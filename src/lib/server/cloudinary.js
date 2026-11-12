import 'server-only';
import { randomUUID } from 'node:crypto';
import { v2 as cloudinary } from 'cloudinary';
import { LIMITS } from '@/lib/careers/validate';

// Resumes are uploaded by the browser straight to Cloudinary (so a 5 MB PDF
// never passes through our API and its request-size limit), with a signature
// from our server that fixes every upload setting:
//   - type "private": no public URL; only time-limited signed download links
//   - allowed_formats "pdf": Cloudinary parses the file and rejects anything
//     that is not a real PDF
//   - public_id chosen by us, so a candidate can't overwrite or point at
//     another file
// The application route then checks the stored file (format, size, age) via
// the Admin API before accepting it.

const PENDING_TAG = 'careers_unsubmitted';
const SUBMITTED_TAG = 'careers_application';
const RESOURCE = { resource_type: 'image', type: 'private' };

export const isCloudinaryConfigured = () =>
    Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

let configured = false;
function cld() {
    if (!isCloudinaryConfigured()) throw new Error('Cloudinary is not configured');
    if (!configured) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
            secure: true,
        });
        configured = true;
    }
    return cloudinary;
}

const folder = () => (process.env.CLOUDINARY_RESUME_FOLDER || 'gorevive/resumes').replace(/^\/+|\/+$/g, '');

/**
 * Signed parameters for one browser upload. The browser must send exactly
 * these fields (plus `file`, `api_key` and `signature`) or Cloudinary rejects it.
 */
export function signResumeUpload(jobSlug) {
    const c = cld();
    const params = {
        public_id: `${folder()}/${jobSlug}/${randomUUID()}`,
        type: 'private',
        allowed_formats: 'pdf',
        tags: PENDING_TAG,
        timestamp: Math.round(Date.now() / 1000),
    };
    const signature = c.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET);
    return {
        uploadUrl: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        fields: { ...params, api_key: process.env.CLOUDINARY_API_KEY, signature },
    };
}

export class ResumeRejectedError extends Error {}

/** Confirms the uploaded file exists, is a PDF, is within the size limit and is fresh. */
export async function verifyResume(publicId) {
    let r;
    try {
        r = await cld().api.resource(publicId, RESOURCE);
    } catch (error) {
        const status = error?.error?.http_code || error?.http_code;
        if (status === 404) throw new ResumeRejectedError('We could not find your uploaded resume. Please attach it again.');
        throw error;
    }
    if (r.format !== 'pdf') {
        await deleteResume(publicId);
        throw new ResumeRejectedError('Please upload a PDF file.');
    }
    if (r.bytes > LIMITS.resumeBytes) {
        await deleteResume(publicId);
        throw new ResumeRejectedError('Resume must be under 5 MB.');
    }
    return { publicId: r.public_id, bytes: r.bytes, pages: r.pages ?? null, uploadedAt: new Date(r.created_at) };
}

/** Time-limited signed link to the original PDF (default 1 hour). */
export function resumeDownloadUrl(publicId, ttlSeconds = 3600) {
    return cld().utils.private_download_url(publicId, 'pdf', {
        ...RESOURCE,
        expires_at: Math.round(Date.now() / 1000) + ttlSeconds,
    });
}

/** Downloads the PDF for the HR email attachment. Returns null on failure. */
export async function fetchResume(publicId) {
    try {
        const res = await fetch(resumeDownloadUrl(publicId, 300), { signal: AbortSignal.timeout(15000) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return Buffer.from(await res.arrayBuffer());
    } catch (error) {
        console.error('Careers: resume download from Cloudinary failed:', error.message);
        return null;
    }
}

/** Swaps the "unsubmitted" tag for "application" so orphans are easy to find and clean up. */
export async function markResumeSubmitted(publicId) {
    try {
        const c = cld();
        await c.uploader.remove_tag(PENDING_TAG, [publicId], RESOURCE);
        await c.uploader.add_tag(SUBMITTED_TAG, [publicId], RESOURCE);
    } catch (error) {
        console.error('Careers: could not retag resume:', error.message);
    }
}

export async function deleteResume(publicId) {
    try {
        await cld().uploader.destroy(publicId, { ...RESOURCE, invalidate: true });
    } catch (error) {
        console.error('Careers: could not delete resume:', error.message);
    }
}
