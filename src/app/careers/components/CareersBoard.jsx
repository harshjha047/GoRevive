"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Clock, MapPin } from 'lucide-react';
import JobDrawer from './JobDrawer';
import { useAppliedSlugs, captureUtm } from '@/lib/careers/careersStore';

const ALL = 'All';

function JobCard({ job, applied, onOpen }) {
    // A real link (crawlable, opens in a new tab on Ctrl/Cmd-click); a plain
    // click opens the drawer instead of leaving the page.
    const onClick = (e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        onOpen(job.slug);
    };
    return (
        <li>
            <Link
                href={`/careers/${job.slug}`}
                onClick={onClick}
                className="group flex h-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">{job.department}</span>
                        {applied && <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">Applied ✓</span>}
                    </div>
                    <h3 className="mt-2 text-base font-bold text-slate-900 group-hover:text-blue-700">{job.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-slate-400" aria-hidden="true" />{job.location} · {job.workMode}</span>
                        <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-slate-400" aria-hidden="true" />{job.experience}</span>
                    </div>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-600" aria-hidden="true" />
            </Link>
        </li>
    );
}

export default function CareersBoard({ jobs, reviewPromise, inbox }) {
    const searchParams = useSearchParams();
    const openSlug = searchParams.get('job');
    const openJob = jobs.find((j) => j.slug === openSlug) || null;
    const applied = useAppliedSlugs();
    const [dept, setDept] = useState(ALL);
    const pushedByUs = useRef(false);

    useEffect(() => captureUtm(), []);

    const departments = useMemo(() => [ALL, ...new Set(jobs.map((j) => j.department))], [jobs]);
    const visible = dept === ALL ? jobs : jobs.filter((j) => j.department === dept);

    // The open role lives in the URL (?job=slug), so it can be shared and the
    // back button closes the drawer. Next.js keeps useSearchParams in sync
    // with history.pushState without a page reload.
    const open = useCallback((slug) => {
        const url = new URL(window.location.href);
        url.searchParams.set('job', slug);
        window.history.pushState(null, '', url);
        pushedByUs.current = true;
    }, []);

    const close = useCallback(() => {
        if (pushedByUs.current) {
            pushedByUs.current = false;
            window.history.back();
            return;
        }
        const url = new URL(window.location.href);
        url.searchParams.delete('job');
        window.history.replaceState(null, '', url);
    }, []);

    useEffect(() => {
        if (!openSlug) pushedByUs.current = false;
    }, [openSlug]);

    return (
        <>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter roles by department">
                {departments.map((d) => {
                    const active = d === dept;
                    const count = d === ALL ? jobs.length : jobs.filter((j) => j.department === d).length;
                    return (
                        <button
                            key={d}
                            type="button"
                            onClick={() => setDept(d)}
                            aria-pressed={active}
                            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                                active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:text-blue-700'
                            }`}
                        >
                            {d} <span className={active ? 'text-blue-100' : 'text-slate-400'}>{count}</span>
                        </button>
                    );
                })}
            </div>

            {visible.length ? (
                <ul className="mt-6 grid gap-4 md:grid-cols-2" aria-live="polite">
                    {visible.map((job) => (
                        <JobCard key={job.slug} job={job} applied={applied.includes(job.slug)} onOpen={open} />
                    ))}
                </ul>
            ) : (
                <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                    <p className="font-semibold text-slate-900">No open roles right now</p>
                    <p className="mt-1 text-sm text-slate-600">
                        We still like hearing from good people. Email your resume to{' '}
                        <a href={`mailto:${inbox}`} className="font-medium text-blue-600 hover:underline">{inbox}</a>.
                    </p>
                </div>
            )}

            {openJob && <JobDrawer key={openJob.slug} job={openJob} reviewPromise={reviewPromise} onClose={close} />}
        </>
    );
}
