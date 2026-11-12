import { NextResponse } from 'next/server';
import { getHrUser } from '@/lib/server/hrAuth';
import { getApplication } from '@/lib/server/careers';
import { resumeDownloadUrl } from '@/lib/server/cloudinary';

export const dynamic = 'force-dynamic';

/** Opens the resume: redirects to a Cloudinary download link that expires in 10 minutes. */
export async function GET(request, { params }) {
    const hr = await getHrUser();
    if (!hr) return NextResponse.redirect(new URL('/hr/login', request.url));
    const { id } = await params;
    const app = await getApplication(id);
    if (!app?.resume?.publicId) return NextResponse.json({ success: false, message: 'No resume for this application.' }, { status: 404 });
    const res = NextResponse.redirect(resumeDownloadUrl(app.resume.publicId, 600), 302);
    res.headers.set('Cache-Control', 'private, no-store');
    return res;
}
