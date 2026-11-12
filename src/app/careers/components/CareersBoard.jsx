"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, ChevronRight, Clock, Wallet, MapPin } from 'lucide-react';
import JobDrawer from './JobDrawer';
import { useAppliedSlugs, captureUtm } from '@/lib/careers/careersStore';
import { formatSalary, formatDate } from '@/lib/careers/jobs';

const ALL = 'All';

// Plain clicks open the drawer; Ctrl/Cmd/Shift/middle clicks keep the link's
// normal behaviour (new tab), and the links stay crawlable.
const plainClick = (e) => !(e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0);

function JobCard({ job, applied, onOpen }) {
    const salary = formatSalary(job.salary);
    const open = (view) => (e) => {
        if (!plainClick(e)) return;
        e.preventDefault();
        onOpen(job.slug, view);
    };
    return (
        <li className="flex flex-wrap items-center gap-6 rounded-2xl border border-g100 bg-white p-5 shadow-card transition hover:shadow-card-hover sm:p-6">
            <div className="min-w-0 flex-[999_1_420px]">
                <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
                    <span className="rounded-full bg-g050 px-3 py-1 text-g600">{job.department}</span>
                    {job.postedAt && <span className="rounded-full border border-g100 px-3 py-1 text-secondary">Posted {formatDate(job.postedAt)}</span>}
                    {job.validThrough && <span className="rounded-full border border-g100 px-3 py-1 text-secondary">Closes {formatDate(job.validThrough)}</span>}
                </div>
                <h3 className="mt-3 font-display text-xl font-extrabold text-[#0B2136]">
                    <Link href={`/careers/${job.slug}`} onClick={open('details')} className="hover:text-g600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-g600">
                        {job.title}
                    </Link>
                </h3>
                <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-[#0B2136]">
                    {salary && (
                        <li className="flex items-center gap-1.5 font-bold">
                            <Wallet className="h-4 w-4 text-g500" aria-hidden="true" />{salary}
                        </li>
                    )}
                    <li className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-g500" aria-hidden="true" />{job.location} · {job.workMode}</li>
                    <li className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-g500" aria-hidden="true" />{job.experience}</li>
                </ul>
            </div>
            <div className="flex flex-[1_1_220px] flex-col gap-2">
                {applied ? (
                    <p className="flex min-h-[48px] items-center justify-center gap-2 rounded-full bg-g050 text-sm font-bold text-g600">
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Applied
                    </p>
                ) : (
                    <Link href={`/careers/${job.slug}#apply`} onClick={open('apply')}
                        className="flex min-h-[48px] items-center justify-center rounded-full bg-g600 px-5 font-display text-[15px] font-bold text-white transition hover:bg-g700">
                        Apply · ~1 min
                    </Link>
                )}
                <Link href={`/careers/${job.slug}`} onClick={open('details')}
                    className="flex min-h-[44px] items-center justify-center gap-1 rounded-full border border-g100 px-5 text-[15px] font-semibold text-g600 transition hover:border-g300">
                    View role <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </Link>
            </div>
        </li>
    );
}

export default function CareersBoard({ jobs, reviewPromise, inbox }) {
    const searchParams = useSearchParams();
    const openSlug = searchParams.get('job');
    const openJob = jobs.find((j) => j.slug === openSlug) || null;
    const applied = useAppliedSlugs();
    const [dept, setDept] = useState(ALL);
    const [view, setView] = useState('details');
    const pushedByUs = useRef(false);

    useEffect(() => captureUtm(), []);

    const departments = useMemo(() => [ALL, ...new Set(jobs.map((j) => j.department))], [jobs]);
    const visible = dept === ALL ? jobs : jobs.filter((j) => j.department === dept);

    // The open role lives in the URL (?job=slug), so it can be shared and the
    // back button closes the drawer. Next.js keeps useSearchParams in sync
    // with history.pushState without a page reload.
    const open = useCallback((slug, nextView = 'details') => {
        setView(nextView);
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
            {departments.length > 2 && (
                <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter roles by department">
                    {departments.map((d) => {
                        const active = d === dept;
                        const count = d === ALL ? jobs.length : jobs.filter((j) => j.department === d).length;
                        return (
                            <button
                                key={d}
                                type="button"
                                onClick={() => setDept(d)}
                                aria-pressed={active}
                                className={`min-h-[40px] rounded-full border px-4 text-sm font-semibold transition ${
                                    active ? 'border-g600 bg-g600 text-white' : 'border-g100 bg-white text-[#0B2136] hover:border-g300'
                                }`}
                            >
                                {d} <span className={active ? 'text-g100' : 'text-secondary'}>{count}</span>
                            </button>
                        );
                    })}
                </div>
            )}

            {visible.length ? (
                <ul className="flex flex-col gap-4" aria-live="polite">
                    {visible.map((job) => (
                        <JobCard key={job.slug} job={job} applied={applied.includes(job.slug)} onOpen={open} />
                    ))}
                </ul>
            ) : (
                <div className="rounded-2xl border border-dashed border-g300 bg-white p-8 text-center">
                    <p className="font-display font-bold text-[#0B2136]">No open roles right now</p>
                </div>
            )}

            <p className="mt-5 text-sm text-secondary">
                {visible.length ? 'Don’t see your role? ' : 'We still like hearing from good people. '}
                Send your resume to{' '}
                <a href={`mailto:${inbox}`} className="font-semibold text-g600 hover:underline">{inbox}</a>
                {' '}— we keep good profiles on file.
            </p>

            {openJob && <JobDrawer key={openJob.slug} job={openJob} reviewPromise={reviewPromise} initialView={view} onClose={close} />}
        </>
    );
}
