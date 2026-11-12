"use client";

import { useState } from 'react';
import { Loader2, Mail } from 'lucide-react';

export default function HrLoginPage() {
    const [email, setEmail] = useState('');
    const [state, setState] = useState({ status: 'idle', message: '' }); // idle | sending | sent | error

    async function submit(e) {
        e.preventDefault();
        setState({ status: 'sending', message: '' });
        try {
            const res = await fetch('/api/hr/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json().catch(() => ({}));
            setState({ status: data.success ? 'sent' : 'error', message: data.message || 'Something went wrong.' });
        } catch {
            setState({ status: 'error', message: 'Network error. Please try again.' });
        }
    }

    return (
        <div className="flex justify-center px-4 py-16">
            <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-xl font-bold text-slate-900">HR sign-in</h1>
                <p className="mt-1 text-sm text-slate-500">We’ll email you a one-time sign-in link.</p>
                {state.status === 'sent' ? (
                    <p className="mt-6 flex gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">
                        <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {state.message}
                    </p>
                ) : (
                    <form onSubmit={submit} className="mt-6 space-y-4">
                        <div>
                            <label htmlFor="hr-email" className="mb-1.5 block text-sm font-medium text-slate-700">Work email</label>
                            <input id="hr-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@gorevive.in"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                        </div>
                        {state.status === 'error' && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.message}</p>}
                        <button type="submit" disabled={state.status === 'sending'}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-70">
                            {state.status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                            Email me a sign-in link
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
