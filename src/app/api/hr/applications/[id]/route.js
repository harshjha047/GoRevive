import { NextResponse } from 'next/server';
import { getHrUser } from '@/lib/server/hrAuth';
import { updateApplicationStatus, deleteApplication, STATUSES } from '@/lib/server/careers';
import { deleteResume } from '@/lib/server/cloudinary';

export const dynamic = 'force-dynamic';

const denied = () => NextResponse.json({ success: false, message: 'Please sign in again.' }, { status: 401 });

/** Change an application's status. Body: { status } */
export async function PATCH(request, { params }) {
    const hr = await getHrUser();
    if (!hr) return denied();
    const { id } = await params;
    let status = '';
    try {
        status = String((await request.json())?.status || '');
    } catch {
        /* empty body */
    }
    if (!STATUSES.includes(status)) return NextResponse.json({ success: false, message: 'Unknown status.' }, { status: 400 });
    const ok = await updateApplicationStatus(id, status, hr.email);
    return ok ? NextResponse.json({ success: true }) : NextResponse.json({ success: false, message: 'Application not found.' }, { status: 404 });
}

/** Permanently delete an application and its resume (e.g. a data deletion request). */
export async function DELETE(request, { params }) {
    const hr = await getHrUser();
    if (!hr) return denied();
    const { id } = await params;
    const doc = await deleteApplication(id);
    if (!doc) return NextResponse.json({ success: false, message: 'Application not found.' }, { status: 404 });
    if (doc.resume?.publicId) await deleteResume(doc.resume.publicId);
    console.info(`HR: application ${id} deleted by ${hr.email}`);
    return NextResponse.json({ success: true });
}
