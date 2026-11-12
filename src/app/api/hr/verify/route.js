import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/server/rateLimit';
import { consumeLoginToken, setHrSession } from '@/lib/server/hrAuth';

export const dynamic = 'force-dynamic';

// POST, not GET: email security scanners open links in emails, and a GET would
// use up the one-time link before the person clicks it.
export async function POST(request) {
    const ip = await clientIp();
    if (!rateLimit(`hr-verify:${ip}`, 10, 15 * 60 * 1000).ok) {
        return NextResponse.json({ success: false, message: 'Too many attempts. Please try again later.' }, { status: 429 });
    }
    let token = '';
    try {
        token = String((await request.json())?.token || '');
    } catch {
        /* empty body */
    }
    const email = await consumeLoginToken(token).catch((e) => {
        console.error('HR verify failed:', e.message);
        return null;
    });
    if (!email) {
        return NextResponse.json({ success: false, message: 'This link has expired or was already used. Request a new one.' }, { status: 401 });
    }
    return setHrSession(NextResponse.json({ success: true }), email);
}
