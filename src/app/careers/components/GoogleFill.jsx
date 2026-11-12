"use client";

import { useEffect, useRef, useState } from 'react';

// "Continue with Google": Google's own button (Google Identity Services). On
// approval Google hands back a signed ID token; we read the name and email from
// it to fill the form, and the server verifies the token when the application
// is submitted. No redirect, no account, nothing stored by Google for us.

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';
const SCRIPT = 'https://accounts.google.com/gsi/client';

let scriptPromise = null;
function loadScript() {
    if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
    if (window.google?.accounts?.id) return Promise.resolve();
    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = SCRIPT;
            s.async = true;
            s.onload = () => resolve();
            s.onerror = () => {
                scriptPromise = null;
                reject(new Error('Google script failed to load'));
            };
            document.head.appendChild(s);
        });
    }
    return scriptPromise;
}

/** Reads the (unverified) claims for display. The server does the real check. */
function decodeClaims(jwt) {
    try {
        const part = jwt.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const json = decodeURIComponent(
            atob(part.padEnd(part.length + ((4 - (part.length % 4)) % 4), '='))
                .split('')
                .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
                .join('')
        );
        return JSON.parse(json);
    } catch {
        return null;
    }
}

export const isGoogleFillEnabled = () => Boolean(CLIENT_ID);

export default function GoogleFill({ onFill }) {
    const box = useRef(null);
    const onFillRef = useRef(onFill);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        onFillRef.current = onFill;
    });

    useEffect(() => {
        if (!CLIENT_ID) return undefined;
        let cancelled = false;
        loadScript()
            .then(() => {
                if (cancelled || !box.current) return;
                window.google.accounts.id.initialize({
                    client_id: CLIENT_ID,
                    callback: ({ credential }) => {
                        const c = decodeClaims(credential);
                        if (c?.email) onFillRef.current({ credential, name: c.name || '', email: String(c.email).toLowerCase() });
                    },
                    ux_mode: 'popup',
                    context: 'use',
                    itp_support: true,
                    use_fedcm_for_button: true,
                });
                window.google.accounts.id.renderButton(box.current, {
                    type: 'standard',
                    theme: 'outline',
                    size: 'large',
                    text: 'continue_with',
                    shape: 'pill',
                    logo_alignment: 'left',
                    width: Math.min(box.current.offsetWidth || 320, 400),
                });
            })
            .catch(() => !cancelled && setFailed(true));
        return () => {
            cancelled = true;
        };
    }, []);

    if (!CLIENT_ID || failed) return null;
    return <div ref={box} className="flex min-h-[44px] w-full justify-center" />;
}
