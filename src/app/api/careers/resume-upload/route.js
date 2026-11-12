import { NextResponse } from 'next/server';
import { getJob, isOpen } from '@/lib/careers/jobs';
import { rateLimit, clientIp } from '@/lib/server/rateLimit';
import { isCloudinaryConfigured, signResumeUpload } from '@/lib/server/cloudinary';
import { encryptToken } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

const fail = (message, status) => NextResponse.json({ success: false, message }, { status });

/**
 * Step 1 of attaching a resume: returns signed Cloudinary upload fields plus an
 * encrypted ticket naming the exact file. The apply route only accepts a resume
 * through this ticket, so nobody can attach a file they didn't upload.
 */
export async function POST(request) {
    const ip = await clientIp();
    const limit = rateLimit(`careers-upload:${ip}`, 20, 10 * 60 * 1000);
    if (!limit.ok) return fail('Too many uploads from this network. Please try again in a few minutes.', 429);

    if (!isCloudinaryConfigured()) {
        console.error('Careers: Cloudinary env vars are not set');
        return fail('Resume upload is temporarily unavailable. You can apply without a resume.', 503);
    }

    let body = {};
    try {
        body = await request.json();
    } catch {
        /* empty body */
    }
    const job = getJob(String(body.jobSlug || ''));
    if (!job || !isOpen(job)) return fail('This role is no longer open.', 404);

    const { uploadUrl, fields } = signResumeUpload(job.slug);
    const ticket = await encryptToken({ typ: 'resume', publicId: fields.public_id, jobSlug: job.slug }, '1h');
    return NextResponse.json({ success: true, uploadUrl, fields, ticket });
}
