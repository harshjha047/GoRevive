import { NextResponse } from 'next/server';
import { getJob, isOpen, REVIEW_PROMISE } from '@/lib/careers/jobs';
import { validateField, normalizePhone, normalizeLink } from '@/lib/careers/validate';
import { rateLimit, clientIp } from '@/lib/server/rateLimit';
import { isMongoConfigured } from '@/lib/server/mongo';
import { createApplication, hasApplied, markNotified, DuplicateApplicationError } from '@/lib/server/careers';
import { verifyResume, fetchResume, resumeDownloadUrl, markResumeSubmitted, deleteResume, ResumeRejectedError } from '@/lib/server/cloudinary';
import { decryptToken } from '@/lib/server/session';
import { verifyGoogleCredential } from '@/lib/server/google';
import { sendApplicationEmails } from '@/lib/server/email';

export const dynamic = 'force-dynamic';

const fail = (message, status = 400, extra = {}) =>
    NextResponse.json({ success: false, message, ...extra }, { status });

const clip = (v, n) => String(v || '').slice(0, n);

const safeFilename = (name) => {
    const base = String(name || 'resume').replace(/\.[^.]+$/, '').replace(/[^\w.\- ]+/g, '').trim().slice(0, 60) || 'resume';
    return `${base}.pdf`;
};

/** Reads the ticket from /api/careers/resume-upload. Returns the file's public ID or null. */
async function resumeFromTicket(ticket, jobSlug) {
    if (!ticket) return null;
    try {
        const t = await decryptToken(String(ticket));
        return t.typ === 'resume' && t.jobSlug === jobSlug && t.publicId ? String(t.publicId) : null;
    } catch {
        return null;
    }
}

// Expects JSON: { jobSlug, name, email, phone, link, note, consent, resumeTicket,
// resumeName, googleCredential, autofilled, company_website, utm_source,
// utm_medium, utm_campaign, referrer }.
// The resume itself was already uploaded to Cloudinary by the browser.
export async function POST(request) {
    const ip = await clientIp();
    const limit = rateLimit(`careers:${ip}`, 10, 10 * 60 * 1000);
    if (!limit.ok) {
        return fail('Too many applications from this network. Please try again in a few minutes.', 429, { retryAfter: limit.retryAfter });
    }

    if (!isMongoConfigured()) {
        console.error('Careers: MONGODB_URI is not set');
        return fail('Applications are temporarily unavailable. Please email us instead.', 503);
    }

    let body;
    try {
        body = await request.json();
    } catch {
        return fail('Could not read the application.', 400);
    }

    // Honeypot: a hidden field people never see. Bots that fill it get a fake success.
    if (String(body.company_website || '').trim()) {
        return NextResponse.json({ success: true });
    }

    const job = getJob(String(body.jobSlug || ''));
    if (!job || !isOpen(job)) return fail('This role is no longer open.', 404);

    if (body.consent !== true) return fail('Please agree to the privacy notice to apply.');

    const input = {
        name: String(body.name || '').trim(),
        email: String(body.email || '').trim(),
        phone: String(body.phone || ''),
        link: String(body.link || ''),
        note: String(body.note || '').trim(),
    };
    const errors = {};
    for (const key of Object.keys(input)) {
        const message = validateField(key, input[key], job);
        if (message) errors[key] = message;
    }

    const resumeId = await resumeFromTicket(body.resumeTicket, job.slug);
    if (body.resumeTicket && !resumeId) errors.resume = 'Your resume upload expired. Please attach it again.';

    if (Object.keys(errors).length) return fail('Please fix the highlighted fields.', 400, { errors });

    const emailLower = input.email.toLowerCase();

    // "Continue with Google": the email counts as verified only if it is the
    // Google account's verified address. An expired or invalid token just
    // means unverified; it never blocks the application.
    const google = await verifyGoogleCredential(body.googleCredential);
    const emailVerified = Boolean(google && google.email === emailLower);
    const autofilled = Array.isArray(body.autofilled)
        ? [...new Set(body.autofilled.map(String))].filter((k) => ['name', 'email', 'phone', 'link'].includes(k))
        : [];

    let saved;
    let resume = null;
    try {
        if (await hasApplied(emailLower, job.slug)) throw new DuplicateApplicationError();

        if (resumeId) {
            const meta = await verifyResume(resumeId);
            resume = { ...meta, filename: safeFilename(body.resumeName) };
        }

        saved = await createApplication({
            jobSlug: job.slug,
            jobTitle: job.title,
            name: input.name,
            email: input.email,
            emailLower,
            phone: normalizePhone(input.phone),
            link: normalizeLink(input.link),
            note: input.note,
            resume, // { publicId, bytes, pages, uploadedAt, filename } | null
            intakeMethod: emailVerified ? 'google' : autofilled.length ? 'resume_autofill' : resume ? 'resume' : 'manual',
            emailVerified,
            googleSub: emailVerified ? google.sub : null,
            autofilled,
            source: {
                utmSource: clip(body.utm_source, 80),
                utmMedium: clip(body.utm_medium, 80),
                utmCampaign: clip(body.utm_campaign, 120),
                referrer: clip(body.referrer, 300),
            },
            consentAt: new Date(),
        });
    } catch (error) {
        if (error instanceof ResumeRejectedError) {
            return fail('Please fix the highlighted fields.', 400, { errors: { resume: error.message } });
        }
        if (error instanceof DuplicateApplicationError) {
            if (resumeId) await deleteResume(resumeId);
            return fail("You've already applied for this role. We'll be in touch by email.", 409, { alreadyApplied: true });
        }
        console.error('Careers: saving application failed:', error.message);
        return fail('Something went wrong saving your application. Please try again.', 500);
    }

    let attachment = null;
    let resumeLink = null;
    if (resume) {
        resumeLink = resumeDownloadUrl(resume.publicId, 7 * 24 * 3600);
        await markResumeSubmitted(resume.publicId);
        const buffer = await fetchResume(resume.publicId);
        if (buffer) attachment = { filename: resume.filename, buffer, mime: 'application/pdf' };
    }

    const notified = await sendApplicationEmails({ job, application: saved, attachment, resumeLink, reviewPromise: REVIEW_PROMISE });
    try {
        await markNotified(saved._id, notified);
    } catch (error) {
        console.error('Careers: could not record email status:', error.message);
    }

    return NextResponse.json({ success: true });
}
