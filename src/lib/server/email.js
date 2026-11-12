import 'server-only';
import { Resend } from 'resend';
import { SITE_URL, SITE_NAME } from '@/lib/site';

let client = null;
const resend = () => {
    if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
    if (!client) client = new Resend(process.env.RESEND_API_KEY);
    return client;
};

export const isEmailConfigured = () =>
    Boolean(process.env.RESEND_API_KEY && process.env.CAREERS_FROM && process.env.CAREERS_INBOX);

/** Everything the candidate typed goes through this before it touches HTML. */
export const escapeHtml = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Header-safe: strips line breaks so input can never add an email header.
const oneLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();

const inboxList = () => String(process.env.CAREERS_INBOX || '').split(',').map((s) => s.trim()).filter(Boolean);

const row = (label, value) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#64748b;vertical-align:top;white-space:nowrap">${label}</td><td style="padding:6px 0;color:#0f172a">${value}</td></tr>`;

const layout = (body) => `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif">
<div style="max-width:560px;margin:0 auto;padding:24px">
<div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:24px">${body}</div>
<p style="color:#94a3b8;font-size:12px;text-align:center;margin-top:16px">${SITE_NAME} · <a href="${SITE_URL}" style="color:#94a3b8">${SITE_URL.replace(/^https?:\/\//, '')}</a></p>
</div></body></html>`;

function hrEmail(job, app) {
    const link = app.link ? `<a href="${escapeHtml(app.link)}">${escapeHtml(app.link)}</a>` : '—';
    const source = [app.source?.utmSource, app.source?.utmMedium, app.source?.utmCampaign].filter(Boolean).join(' / ') || app.source?.referrer || 'direct';
    const html = layout(`
<h2 style="margin:0 0 4px;font-size:18px;color:#0f172a">New application: ${escapeHtml(job.title)}</h2>
<p style="margin:0 0 16px;color:#64748b;font-size:14px">${escapeHtml(job.department)} · ${escapeHtml(job.location)} · ${escapeHtml(job.workMode)}</p>
<table style="font-size:14px;border-collapse:collapse">
${row('Name', escapeHtml(app.name))}
${row('Email', `<a href="mailto:${escapeHtml(app.email)}">${escapeHtml(app.email)}</a>`)}
${row('Phone', `<a href="tel:${escapeHtml(app.phone)}">${escapeHtml(app.phone)}</a>`)}
${row('Link', link)}
${row('Resume', app.resume ? `${escapeHtml(app.resume.filename)} (attached)` : 'Not provided')}
${row('Source', escapeHtml(source))}
${row('Application ID', escapeHtml(String(app._id)))}
</table>
${app.note ? `<p style="margin:16px 0 4px;color:#64748b;font-size:13px">Note from the candidate</p><p style="margin:0;white-space:pre-wrap;font-size:14px;color:#0f172a">${escapeHtml(app.note)}</p>` : ''}
<p style="margin:20px 0 0;color:#64748b;font-size:13px">Reply to this email to contact the candidate directly.</p>`);
    const text = [
        `New application: ${job.title}`,
        `Name: ${app.name}`, `Email: ${app.email}`, `Phone: ${app.phone}`,
        `Link: ${app.link || '-'}`, `Resume: ${app.resume ? 'attached' : 'not provided'}`,
        `Source: ${source}`, `Application ID: ${app._id}`,
        app.note ? `\nNote:\n${app.note}` : '',
    ].join('\n');
    return { html, text };
}

function candidateEmail(job, app, reviewPromise) {
    const firstName = escapeHtml(String(app.name).split(/\s+/)[0]);
    const html = layout(`
<h2 style="margin:0 0 12px;font-size:18px;color:#0f172a">Thanks for applying, ${firstName}</h2>
<p style="margin:0 0 12px;font-size:14px;color:#334155;line-height:1.6">We've received your application for <strong>${escapeHtml(job.title)}</strong> at ${SITE_NAME}.</p>
<p style="margin:0 0 12px;font-size:14px;color:#334155;line-height:1.6">${escapeHtml(reviewPromise)}</p>
<p style="margin:0;font-size:14px;color:#334155;line-height:1.6">You can see our other open roles at <a href="${SITE_URL}/careers">${SITE_URL.replace(/^https?:\/\//, '')}/careers</a>.</p>`);
    const text = `Thanks for applying, ${String(app.name).split(/\s+/)[0]}.\n\nWe've received your application for ${job.title} at ${SITE_NAME}.\n\n${reviewPromise}\n\nOther open roles: ${SITE_URL}/careers`;
    return { html, text };
}

async function send(payload) {
    const { error } = await resend().emails.send(payload);
    if (error) throw new Error(error.message || 'Resend error');
    return 'sent';
}

/**
 * Sends the HR notification (with the resume attached) and the candidate's
 * confirmation. Never throws: the application is already saved, so a failed
 * email is recorded on the application rather than shown to the candidate.
 */
export async function sendApplicationEmails({ job, application, resume, reviewPromise }) {
    if (!isEmailConfigured()) {
        return { hr: 'skipped: email not configured', candidate: 'skipped: email not configured' };
    }
    const from = process.env.CAREERS_FROM;
    const hr = hrEmail(job, application);
    const candidate = candidateEmail(job, application, reviewPromise);

    const [hrResult, candidateResult] = await Promise.allSettled([
        send({
            from,
            to: inboxList(),
            replyTo: application.email,
            subject: oneLine(`Application: ${job.title} – ${application.name}`),
            html: hr.html,
            text: hr.text,
            attachments: resume ? [{ filename: resume.filename, content: resume.buffer, contentType: resume.mime }] : undefined,
        }),
        send({
            from,
            to: [application.email],
            replyTo: process.env.CAREERS_REPLY_TO || inboxList()[0],
            subject: oneLine(`We received your application – ${job.title}`),
            html: candidate.html,
            text: candidate.text,
        }),
    ]);

    const outcome = (r) => (r.status === 'fulfilled' ? r.value : `failed: ${r.reason?.message || 'unknown'}`);
    const results = { hr: outcome(hrResult), candidate: outcome(candidateResult) };
    if (results.hr !== 'sent') console.error('Careers HR email failed:', results.hr);
    if (results.candidate !== 'sent') console.error('Careers candidate email failed:', results.candidate);
    return results;
}
