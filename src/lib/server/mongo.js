import 'server-only';
import { MongoClient } from 'mongodb';

// One MongoClient per server process. Next.js dev reloads modules and
// serverless hosts reuse warm instances, so the connection promise is kept on
// globalThis; creating a client per request would exhaust Atlas connections.
const g = globalThis;

export const isMongoConfigured = () => Boolean(process.env.MONGODB_URI);

export function getMongoClient() {
    if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is not set');
    if (!g.__goreviveMongo) {
        const client = new MongoClient(process.env.MONGODB_URI, {
            maxPoolSize: Number(process.env.MONGODB_MAX_POOL || 10),
            serverSelectionTimeoutMS: 8000,
            appName: 'gorevive-web',
        });
        g.__goreviveMongo = client.connect().catch((error) => {
            // Let the next request retry instead of caching a failed connection.
            g.__goreviveMongo = null;
            throw error;
        });
    }
    return g.__goreviveMongo;
}

export async function getDb() {
    const client = await getMongoClient();
    return client.db(process.env.MONGODB_DB || 'gorevive');
}
