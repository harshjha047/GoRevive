import 'server-only';
import { createRemoteJWKSet, jwtVerify } from 'jose';

// Verifies the ID token from "Continue with Google" (Google Identity Services).
// It proves the candidate controls the Google account's email. Only the
// public client ID is needed; there is no client secret in this flow.
const JWKS = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export const googleClientId = () => process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

/** Returns { email, name, sub } for a valid token with a verified email, else null. Never throws. */
export async function verifyGoogleCredential(credential) {
    if (!credential || !googleClientId()) return null;
    try {
        const { payload } = await jwtVerify(String(credential), JWKS, {
            issuer: ['https://accounts.google.com', 'accounts.google.com'],
            audience: googleClientId(),
            clockTolerance: 60,
        });
        if (!payload.email || payload.email_verified !== true) return null;
        return { email: String(payload.email).toLowerCase(), name: String(payload.name || ''), sub: String(payload.sub) };
    } catch (error) {
        // Usually just expired (tokens last 1 hour): the email is then simply unverified.
        console.warn('Careers: Google credential not accepted:', error.code || error.message);
        return null;
    }
}
