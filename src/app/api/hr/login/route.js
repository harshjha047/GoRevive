import { NextResponse } from 'next/server';
import { rateLimit, clientIp } from '@/lib/server/rateLimit';
import { isMongoConfigured } from '@/lib/server/mongo';
import { sendLoginLink } from '@/lib/server/hrAuth';

export const dynamic = 'force-dynamic';

const SAME_ANSWER = 'If that email can access HR, a sign-in link is on its way. It expires in 15 minutes.';

export async function POST(request) {
    const ip = await clientIp();
    if (!rateLimit(`hr-login:${ip}`, 5, 15 * 60 * 1000).ok) {
        return NextResponse.json({ success: false, message: 'Too many attempts. Please try again in 15 minutes.' }, { status: 429 });
    }
    if (!isMongoConfigured()) {
        return NextResponse.json({ success: false, message: 'HR sign-in is not set up yet.' }, { status: 503 });
    }
    let email = '';
    try {
        email = String((await request.json())?.email || '').trim().toLowerCase().slice(0, 120);
    } catch {
        /* empty body */
    }
    if (!email) return NextResponse.json({ success: false, message: 'Please enter your email.' }, { status: 400 });
    if (!rateLimit(`hr-login-email:${email}`, 3, 15 * 60 * 1000).ok) {
        return NextResponse.json({ success: true, message: SAME_ANSWER });
    }
    try {
        await sendLoginLink(email);
    } catch (error) {
        console.error('HR login link failed:', error.message);
        return NextResponse.json({ success: false, message: 'Could not send the sign-in email. Please try again.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: SAME_ANSWER });
}
