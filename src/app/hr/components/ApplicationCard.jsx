"use client";

import { useState } from 'react';
import { BadgeCheck, ExternalLink, FileText, Loader2, Mail, Phone, Trash2 } from 'lucide-react';

const STATUS_STYLE = {
    new: 'bg-blue-50 text-blue-700 ring-blue-200',
    reviewing: 'bg-amber-50 text-amber-700 ring-amber-200',
    shortlisted: 'bg-violet-50 text-violet-700 ring-violet-200',
    interview: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    offer: 'bg-teal-50 text-teal-700 ring-teal-200',
    hired: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    rejected: 'bg-slate-100 text-slate-600 ring-slate-200',
};

const INTAKE = { google: 'Google', resume_autofill: 'Resume auto-fill', resume: 'Resume', manual: 'Typed' };

const fmtDate = (iso) =>
    new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Kolkata' });

const hostOf = (url) => {
    try {
        return url ? new URL(url).hostname : 'Direct';
    } catch {
        return 'Direct';
    }
};

const fmtSize = (b) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(b / 1024)} KB`);

export default function ApplicationCard({ app, statuses }) {
    const [status, setStatus] = useState(app.status);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [deleted, setDeleted] = useState(false);

    async function changeStatus(next) {
        const prev = status;
        setStatus(next);
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`/api/hr/applications/${app._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: next }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) throw new Error(data.message || 'Could not save.');
        } catch (e) {
            setStatus(prev);
            setError(e.message);
        } finally {
            setSaving(false);
        }
    }

    async function remove() {
        setSaving(true);
        setError('');
        try {
            const res = await fetch(`/api/hr/applications/${app._id}`, { method: 'DELETE' });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.success) throw new Error(data.message || 'Could not delete.');
            setDeleted(true);
        } catch (e) {
            setError(e.message);
            setConfirming(false);
        } finally {
            setSaving(false);
        }
    }

    if (deleted) {
        return <li className="rounded-xl border border-dashed border-slate-300 bg-white px-5 py-4 text-sm text-slate-500">Deleted {app.name}’s application and resume.</li>;
    }

    const source = [app.source?.utmSource, app.source?.utmMedium, app.source?.utmCampaign].filter(Boolean).join(' / ') || hostOf(app.source?.referrer);

    return (
        <li className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-3">
                <div className="min-w-0 flex-1">
                    <h3 className="flex items-center gap-1.5 text-base font-bold text-slate-900">
                        {app.name}
                        {app.emailVerified && <BadgeCheck className="h-4 w-4 text-emerald-600" aria-label="Email verified with Google" />}
                    </h3>
                    <p className="mt-0.5 text-sm text-slate-500">{app.jobTitle} · {fmtDate(app.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                    {saving && <Loader2 className="h-4 w-4 animate-spin text-slate-400" aria-hidden="true" />}
                    <label className="sr-only" htmlFor={`status-${app._id}`}>Status</label>
                    <select id={`status-${app._id}`} value={status} disabled={saving} onChange={(e) => changeStatus(e.target.value)}
                        className={`rounded-full px-3 py-1.5 text-sm font-semibold capitalize ring-1 outline-none ${STATUS_STYLE[status] || STATUS_STYLE.new}`}>
                        {statuses.map((s) => <option key={s} value={s} className="bg-white text-slate-900">{s}</option>)}
                    </select>
                </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <a href={`mailto:${app.email}`} className="flex items-center gap-1.5 text-blue-700 hover:underline"><Mail className="h-4 w-4" aria-hidden="true" />{app.email}</a>
                <a href={`tel:${app.phone}`} className="flex items-center gap-1.5 text-blue-700 hover:underline"><Phone className="h-4 w-4" aria-hidden="true" />{app.phone}</a>
                {app.link && (
                    <a href={app.link} target="_blank" rel="noopener noreferrer nofollow" className="flex max-w-xs items-center gap-1.5 truncate text-blue-700 hover:underline">
                        <ExternalLink className="h-4 w-4 shrink-0" aria-hidden="true" /><span className="truncate">{app.link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                    </a>
                )}
                {app.resume?.publicId ? (
                    <a href={`/api/hr/applications/${app._id}/resume`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 font-medium text-blue-700 hover:underline">
                        <FileText className="h-4 w-4" aria-hidden="true" />Resume{app.resume.bytes ? ` (${fmtSize(app.resume.bytes)}${app.resume.pages ? `, ${app.resume.pages} pg` : ''})` : ''}
                    </a>
                ) : (
                    <span className="flex items-center gap-1.5 text-slate-400"><FileText className="h-4 w-4" aria-hidden="true" />No resume</span>
                )}
            </div>

            {app.note && (
                <details className="group mt-3">
                    <summary className="cursor-pointer text-sm font-medium text-slate-700 hover:text-slate-900">Candidate’s note</summary>
                    <p className="mt-2 whitespace-pre-wrap rounded-lg bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">{app.note}</p>
                </details>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span>Source: {source}</span>
                <span>Filled via: {INTAKE[app.intakeMethod] || app.intakeMethod}</span>
                {app.notifications?.hr && app.notifications.hr !== 'sent' && <span className="text-amber-700">HR email: {app.notifications.hr}</span>}
                <span className="ml-auto">
                    {confirming ? (
                        <span className="flex items-center gap-2">
                            <span className="text-red-700">Delete application and resume permanently?</span>
                            <button type="button" onClick={remove} disabled={saving} className="rounded bg-red-600 px-2 py-1 font-semibold text-white hover:bg-red-700">Delete</button>
                            <button type="button" onClick={() => setConfirming(false)} className="rounded px-2 py-1 text-slate-600 hover:bg-slate-100">Cancel</button>
                        </span>
                    ) : (
                        <button type="button" onClick={() => setConfirming(true)} className="flex items-center gap-1 text-slate-500 hover:text-red-700">
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />Delete
                        </button>
                    )}
                </span>
            </div>
            {error && <p className="mt-2 text-sm text-red-700" role="alert">{error}</p>}
        </li>
    );
}
