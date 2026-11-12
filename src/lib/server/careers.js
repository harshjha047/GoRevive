import 'server-only';
import { ObjectId } from 'mongodb';
import { getDb } from './mongo';

// Collection "job_applications": one document per application. Resume files
// live in Cloudinary; the document keeps their public ID.
const APPLICATIONS = 'job_applications';

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
    return col;
}

export async function hasApplied(emailLower, jobSlug) {
    const col = await collection();
    return Boolean(await col.findOne({ emailLower, jobSlug }, { projection: { _id: 1 } }));
}

/** Saves an application. Throws DuplicateApplicationError if this email already applied for the role. */
export async function createApplication(application) {
    const col = await collection();
    const now = new Date();
    const doc = {
        ...application,
        status: 'new',
        notifications: { hr: null, candidate: null },
        createdAt: now,
        updatedAt: now,
    };
    try {
        const { insertedId } = await col.insertOne(doc);
        return { ...doc, _id: insertedId };
    } catch (error) {
        if (error?.code === 11000) throw new DuplicateApplicationError('Already applied');
        throw error;
    }
}

/** Records whether each notification email went out ("sent" or the error). */
export async function markNotified(id, results) {
    const col = await collection();
    await col.updateOne(
        { _id: new ObjectId(String(id)) },
        { $set: { 'notifications.hr': results.hr, 'notifications.candidate': results.candidate, updatedAt: new Date() } }
    );
}
