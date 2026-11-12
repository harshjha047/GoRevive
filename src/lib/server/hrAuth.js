import 'server-only';
import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import { signToken, verifyToken, cookieOptions } from './session';
import { getDb } from './mongo';
import { SITE_URL } from '@/lib/site';
import { escapeHtml } from './email';
import { Resend } from 'resend';

// HR sign-in for /hr: passwordless, by emailed one-time link.
//   - Only addresses in CAREERS_ADMINS can sign in (checked again on every
//     request, so removing someone from the list locks them out at once).
//   - Links last 15 minutes and work once (tracked in "hr_login_tokens").
//   - Links always point at NEXT_PUBLIC_SITE_URL, never at the request's Host
//     header, so a forged Host can't send a login link to another domain.
//   - The session is a separate httpOnly cookie from the customer login.

export const HR_COOKIE = 'hr_session';
const SESSION_HOURS = 12;
const LINK_MINUTES = 15;

export const hrAdmins = () =>
    String(process.env.CAREERS_ADMINS || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

export const isHrAdmin = (email) => hrAdmins().includes(String(email || '').trim().toLowerCase());

let ttlReady = null;
async function tokens() {
    const col = (await getDb()).collection('hr_login_tokens');
    if (!ttlReady) {
        ttlReady = Promise.all([
            col.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0, name: 'ttl' }),
            col.createIndex({ jti: 1 }, { unique: true, name: 'uniq_jti' }),
        ]).catch((e) => {
            ttlReady = null;
            throw e;
        });
    }
    await ttlReady;
    return col;
}

/**
 * Emails a sign-in link if the address is an HR admin. Does nothing otherwise,
 * and the caller always shows the same message, so the form can't be used to
 * discover who is an admin.
 */
export async function sendLoginLink(email) {
    const address = String(email || '').trim().toLowerCase();
    if (!isHrAdmin(address)) return;
    if (!process.env.RESEND_API_KEY || !process.env.CAREERS_FROM) throw new Error('Resend is not configured');

    const jti = randomUUID();
    await (await tokens()).insertOne({ jti, email: address, used: false, expiresAt: new Date(Date.now() + LINK_MINUTES * 60 * 1000) });
    const token = await signToken({ typ: 'hr-link', email: address, jti }, `${LINK_MINUTES}m`);
    const url = `${SITE_URL}/hr/verify?token=${encodeURIComponent(token)}`;

    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.CAREERS_FROM,
        to: [address],
        subject: 'Your GoRevive HR sign-in link',
        html: `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#0f172a">
<h2 style="font-size:18px;margin:0 0 12px">Sign in to GoRevive HR</h2>
<p style="font-size:14px;line-height:1.6;color:#334155">Click the button to see job applications. The link works once and expires in ${LINK_MINUTES} minutes.</p>
<p style="margin:24px 0"><a href="${escapeHtml(url)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold;font-size:14px">Sign in</a></p>
<p style="font-size:12px;color:#94a3b8">If you didn't ask for this, ignore this email.</p></div>`,
        text: `Sign in to GoRevive HR (works once, expires in ${LINK_MINUTES} minutes):\n${url}\n\nIf you didn't ask for this, ignore this email.`,
    });
    if (error) throw new Error(error.message || 'Resend error');
}

/** Checks a link token and burns it. Returns the admin email, or null. */
export async function consumeLoginToken(token) {
    let payload;
    try {
        payload = await verifyToken(String(token || ''));
    } catch {
        return null;
    }
    if (payload.typ !== 'hr-link' || !payload.jti || !isHrAdmin(payload.email)) return null;
    const res = await (await tokens()).findOneAndUpdate(
        { jti: payload.jti, email: payload.email, used: false, expiresAt: { $gt: new Date() } },
        { $set: { used: true, usedAt: new Date() } }
    );
    const doc = res && 'value' in res ? res.value : res; // driver v5 vs v6 return shape
    return doc ? payload.email : null;
}

export async function setHrSession(response, email) {
    const token = await signToken({ typ: 'hr', email }, `${SESSION_HOURS}h`);
    response.cookies.set(HR_COOKIE, token, cookieOptions(SESSION_HOURS * 3600));
    return response;
}

export function clearHrSession(response) {
    response.cookies.set(HR_COOKIE, '', cookieOptions(0));
    return response;
}

/** The signed-in HR admin's email, or null. Use in /hr pages and /api/hr routes. */
export async function getHrUser() {
    const token = (await cookies()).get(HR_COOKIE)?.value;
    if (!token) return null;
    try {
        const payload = await verifyToken(token);
        if (payload.typ !== 'hr' || !isHrAdmin(payload.email)) return null;
        return { email: payload.email };
    } catch {
        return null;
    }
}
