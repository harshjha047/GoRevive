import { NextResponse } from 'next/server';
import { clearHrSession } from '@/lib/server/hrAuth';

export const dynamic = 'force-dynamic';

export async function POST() {
    return clearHrSession(NextResponse.json({ success: true }));
}
