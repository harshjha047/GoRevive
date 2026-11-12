"use client";

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// The emailed link lands here. Signing in needs a click (a POST), so email
// security scanners that open links can't use up the one-time token.
function Verify() {
    const token = useSearchParams().get('token') || '';
    const [state, setState] = useState({ status: 'idle', message: '' });

    async function signIn() {
        setState({ status: 'working', message: '' });
        try {
            const res = await fetch('/api/hr/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
            const data = await res.json().catch(() => ({}));
            if (data.success) {
                window.location.replace('/hr');
                return;
            }
            setState({ status: 'error', message: data.message || 'Sign-in failed.' });
        } catch {
            setState({ status: 'error', message: 'Network error. Please try again.' });
        }
    }

    return (
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900">Sign in to HR</h1>
            {!token ? (
                <p className="mt-3 text-sm text-slate-600">This link is incomplete. <Link href="/hr/login" className="font-medium text-blue-600 hover:underline">Request a new one</Link>.</p>
            ) : state.status === 'error' ? (
                <p className="mt-3 text-sm text-red-700" role="alert">{state.message} <Link href="/hr/login" className="font-medium text-blue-600 hover:underline">Request a new link</Link>.</p>
            ) : (
                <button type="button" onClick={signIn} disabled={state.status === 'working'}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70">
                    {state.status === 'working' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                    Continue to applications
                </button>
            )}
        </div>
    );
}

export default function HrVerifyPage() {
    return (
        <div className="flex justify-center px-4 py-16">
            <Suspense fallback={<div className="h-40 w-full max-w-sm animate-pulse rounded-2xl bg-white" />}>
                <Verify />
            </Suspense>
        </div>
    );
}
