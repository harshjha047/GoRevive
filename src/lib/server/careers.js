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

// ---- HR page (/hr) -------------------------------------------------------

export const STATUSES = ['new', 'reviewing', 'shortlisted', 'interview', 'offer', 'hired', 'rejected'];
export const PAGE_SIZE = 25;

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function filterFor({ job, status, q }) {
    const filter = {};
    if (job) filter.jobSlug = String(job);
    if (status && STATUSES.includes(status)) filter.status = status;
    const text = String(q || '').trim().slice(0, 80);
    if (text) {
        const re = new RegExp(escapeRegex(text), 'i');
        filter.$or = [{ name: re }, { emailLower: re }, { phone: re }];
    }
    return filter;
}

/** One page of applications, newest first, plus totals per status for the tabs. */
export async function listApplications({ job, status, q, page = 1 } = {}) {
    const col = await collection();
    const filter = filterFor({ job, status, q });
    const skip = (Math.max(1, Number(page) || 1) - 1) * PAGE_SIZE;
    const [items, total, byStatus] = await Promise.all([
        col.find(filter, { projection: { emailLower: 0, googleSub: 0 } }).sort({ createdAt: -1 }).skip(skip).limit(PAGE_SIZE).toArray(),
        col.countDocuments(filter),
        col.aggregate([{ $match: filterFor({ job, q }) }, { $group: { _id: '$status', n: { $sum: 1 } } }]).toArray(),
    ]);
    return {
        items: items.map((d) => ({ ...d, _id: String(d._id) })),
        total,
        counts: Object.fromEntries(byStatus.map((s) => [s._id, s.n])),
    };
}

const oid = (id) => {
    try {
        return new ObjectId(String(id));
    } catch {
        return null;
    }
};

export async function getApplication(id) {
    const _id = oid(id);
    if (!_id) return null;
    return (await collection()).findOne({ _id });
}

export async function updateApplicationStatus(id, status, by) {
    const _id = oid(id);
    if (!_id || !STATUSES.includes(status)) return false;
    const now = new Date();
    const res = await (await collection()).updateOne(
        { _id },
        { $set: { status, updatedAt: now }, $push: { statusHistory: { status, by, at: now } } }
    );
    return res.matchedCount === 1;
}

/** Deletes the application document. The caller deletes the resume file. */
export async function deleteApplication(id) {
    const _id = oid(id);
    if (!_id) return null;
    const col = await collection();
    const doc = await col.findOne({ _id }, { projection: { resume: 1 } });
    if (!doc) return null;
    await col.deleteOne({ _id });
    return doc;
}
