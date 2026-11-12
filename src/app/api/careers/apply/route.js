import { NextResponse } from 'next/server';
import { getJob, isOpen, REVIEW_PROMISE } from '@/lib/careers/jobs';
import { validators, normalizePhone, normalizeLink, LIMITS } from '@/lib/careers/validate';
import { rateLimit, clientIp } from '@/lib/server/rateLimit';
import { isMongoConfigured } from '@/lib/server/mongo';
import { createApplication, hasApplied, markNotified, DuplicateApplicationError } from '@/lib/server/careers';
import { sendApplicationEmails } from '@/lib/server/email';

export const dynamic = 'force-dynamic';

const fail = (message, status = 400, extra = {}) =>
    NextResponse.json({ success: false, message, ...extra }, { status });

const MIME = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

// The browser decides file.type, so check the first bytes too:
// PDF starts with "%PDF", DOCX is a ZIP ("PK\x03\x04").
async function resumeKind(file) {
    const b = new Uint8Array(await file.slice(0, 5).arrayBuffer());
    const ext = (file.name.match(/\.([a-z0-9]+)$/i)?.[1] || '').toLowerCase();
    if (ext === 'pdf' && b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46) return 'pdf';
    if (ext === 'docx' && b[0] === 0x50 && b[1] === 0x4b && b[2] === 0x03 && b[3] === 0x04) return 'docx';
    return null;
}

const safeFilename = (name, kind) => {
    const base = String(name || 'resume').replace(/\.[^.]+$/, '').replace(/[^\w.\- ]+/g, '').trim().slice(0, 60) || 'resume';
    return `${base}.${kind}`;
};

const clip = (v, n) => String(v || '').slice(0, n);

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

    let form;
    try {
        form = await request.formData();
    } catch {
        return fail('Could not read the application. If you attached a resume, keep it under 4 MB.', 400);
    }

    // Honeypot: a hidden field people never see. Bots that fill it get a fake success.
    if (String(form.get('company_website') || '').trim()) {
        return NextResponse.json({ success: true });
    }

    const job = getJob(String(form.get('jobSlug') || ''));
    if (!job || !isOpen(job)) return fail('This role is no longer open.', 404);

    if (form.get('consent') !== 'true') return fail('Please agree to the privacy notice to apply.');

    const input = {
        name: String(form.get('name') || '').trim(),
        email: String(form.get('email') || '').trim(),
        phone: String(form.get('phone') || ''),
        link: String(form.get('link') || ''),
        note: String(form.get('note') || '').trim(),
    };
    const errors = {};
    for (const key of Object.keys(input)) {
        const message = validators[key](input[key]);
        if (message) errors[key] = message;
    }

    const file = form.get('resume');
    let resume = null;
    if (file && typeof file !== 'string' && file.size > 0) {
        if (file.size > LIMITS.resumeBytes) errors.resume = 'Resume must be under 4 MB.';
        else {
            const kind = await resumeKind(file);
            if (!kind) errors.resume = 'Please upload a PDF or DOCX file.';
            else resume = { buffer: Buffer.from(await file.arrayBuffer()), filename: safeFilename(file.name, kind), mime: MIME[kind] };
        }
    }

    if (Object.keys(errors).length) return fail('Please fix the highlighted fields.', 400, { errors });

    const emailLower = input.email.toLowerCase();
    const application = {
        jobSlug: job.slug,
        jobTitle: job.title,
        name: input.name,
        email: input.email,
        emailLower,
        phone: normalizePhone(input.phone),
        link: normalizeLink(input.link),
        note: input.note,
        intakeMethod: resume ? 'resume' : 'manual',
        source: {
            utmSource: clip(form.get('utm_source'), 80),
            utmMedium: clip(form.get('utm_medium'), 80),
            utmCampaign: clip(form.get('utm_campaign'), 120),
            referrer: clip(form.get('referrer'), 300),
        },
        consentAt: new Date(),
    };

    let saved;
    try {
        // Checked before saving the resume so duplicates don't leave orphan files.
        if (await hasApplied(emailLower, job.slug)) throw new DuplicateApplicationError();
        saved = await createApplication(application, resume);
    } catch (error) {
        if (error instanceof DuplicateApplicationError) {
            return fail("You've already applied for this role. We'll be in touch by email.", 409, { alreadyApplied: true });
        }
        console.error('Careers: saving application failed:', error.message);
        return fail('Something went wrong saving your application. Please try again.', 500);
    }

    const notified = await sendApplicationEmails({ job, application: saved, resume, reviewPromise: REVIEW_PROMISE });
    try {
        await markNotified(saved._id, notified);
    } catch (error) {
        console.error('Careers: could not record email status:', error.message);
    }

    return NextResponse.json({ success: true });
}
