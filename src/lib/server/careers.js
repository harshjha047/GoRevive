import 'server-only';
import { GridFSBucket, ObjectId } from 'mongodb';
import { getDb } from './mongo';

// Collections:
//   job_applications     one document per application
//   resumes.files/chunks resume files (GridFS bucket "resumes")
const APPLICATIONS = 'job_applications';
const RESUME_BUCKET = 'resumes';

export class DuplicateApplicationError extends Error {}

let indexesReady = null;
async function collection() {
    const db = await getDb();
    const col = db.collection(APPLICATIONS);
    if (!indexesReady) {
        indexesReady = Promise.all([
            // One application per email per role.
            col.createIndex({ emailLower: 1, jobSlug: 1 }, { unique: true, name: 'uniq_email_job' }),
            col.createIndex({ createdAt: -1 }, { name: 'by_created' }),
            col.createIndex({ jobSlug: 1, status: 1, createdAt: -1 }, { name: 'by_job_status' }),
        ]).catch((error) => {
            indexesReady = null;
            throw error;
        });
    }
    await indexesReady;
    return { db, col };
}

export async function hasApplied(emailLower, jobSlug) {
    const { col } = await collection();
    return Boolean(await col.findOne({ emailLower, jobSlug }, { projection: { _id: 1 } }));
}

/** Streams the resume into GridFS and returns its file id. */
async function saveResume(db, resume, meta) {
    const bucket = new GridFSBucket(db, { bucketName: RESUME_BUCKET });
    const upload = bucket.openUploadStream(resume.filename, {
        metadata: { ...meta, contentType: resume.mime },
    });
    await new Promise((resolve, reject) => {
        upload.once('finish', resolve);
        upload.once('error', reject);
        upload.end(resume.buffer);
    });
    return upload.id;
}

async function deleteResume(db, id) {
    try {
        await new GridFSBucket(db, { bucketName: RESUME_BUCKET }).delete(id);
    } catch {
        /* already gone */
    }
}

/**
 * Saves an application (and its resume, if any). Throws
 * DuplicateApplicationError when this email already applied for the role.
 */
export async function createApplication(application, resume) {
    const { db, col } = await collection();
    const now = new Date();
    let resumeId = null;

    if (resume) {
        resumeId = await saveResume(db, resume, { jobSlug: application.jobSlug, email: application.emailLower });
    }

    const doc = {
        ...application,
        resume: resume ? { fileId: resumeId, filename: resume.filename, size: resume.buffer.length, mime: resume.mime } : null,
        status: 'new',
        notifications: { hr: null, candidate: null },
        createdAt: now,
        updatedAt: now,
    };

    try {
        const { insertedId } = await col.insertOne(doc);
        return { ...doc, _id: insertedId };
    } catch (error) {
        if (resumeId) await deleteResume(db, resumeId);
        if (error?.code === 11000) throw new DuplicateApplicationError('Already applied');
        throw error;
    }
}

/** Records whether each notification email went out ("sent" or the error). */
export async function markNotified(id, results) {
    const { col } = await collection();
    await col.updateOne(
        { _id: new ObjectId(String(id)) },
        { $set: { 'notifications.hr': results.hr, 'notifications.candidate': results.candidate, updatedAt: new Date() } }
    );
}
