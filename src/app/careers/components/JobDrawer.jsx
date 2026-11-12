"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import JobDetails, { JobMeta } from './JobDetails';
import ApplyForm from './ApplyForm';
import { useAppliedSlugs } from '@/lib/careers/careersStore';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Slide-over on desktop, bottom sheet on mobile. The job board stays visible
 * (dimmed) behind it. Esc, the backdrop and the browser back button close it.
 */
export default function JobDrawer({ job, reviewPromise, onClose }) {
    const applied = useAppliedSlugs().includes(job.slug);
    const [view, setView] = useState('details'); // details | apply
    const panel = useRef(null);
    const body = useRef(null);
    const closeRef = useRef(onClose);
    useEffect(() => {
        closeRef.current = onClose;
    });

    // Lock page scroll, move focus in, trap Tab, close on Esc.
    useEffect(() => {
        const previouslyFocused = document.activeElement;
        const { overflow } = document.body.style;
        document.body.style.overflow = 'hidden';
        panel.current?.focus();

        const onKey = (e) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeRef.current();
                return;
            }
            if (e.key !== 'Tab' || !panel.current) return;
            const nodes = [...panel.current.querySelectorAll(FOCUSABLE)].filter((n) => n.offsetParent !== null);
            if (!nodes.length) return;
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = overflow;
            previouslyFocused?.focus?.();
        };
    }, []);

    const openApply = () => {
        setView('apply');
        body.current?.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => panel.current?.querySelector('input[name="name"]')?.focus(), 250);
    };

    return (
        <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[1px] animate-[careersFade_150ms_ease-out]" onClick={onClose} aria-hidden="true" />
            <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="job-drawer-title"
                tabIndex={-1}
                className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-2xl bg-white shadow-2xl outline-none animate-[careersUp_200ms_ease-out] sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[480px] sm:rounded-none sm:animate-[careersLeft_200ms_ease-out]"
            >
                <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" aria-hidden="true" />

                <header className="flex items-start gap-3 border-b border-slate-100 px-5 pb-4 pt-3 sm:pt-5">
                    {view === 'apply' && (
                        <button type="button" onClick={() => setView('details')} className="-ml-1.5 mt-0.5 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Back to role details">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{view === 'apply' ? 'Quick apply' : job.department}</p>
                        <h2 id="job-drawer-title" className="mt-0.5 text-lg font-bold leading-snug text-slate-900">{job.title}</h2>
                        {view === 'details' && <JobMeta job={job} className="mt-2" />}
                    </div>
                    <button type="button" onClick={onClose} className="-mr-1.5 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div ref={body} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                    {view === 'details' ? (
                        <>
                            <JobDetails job={job} />
                            <Link href={`/careers/${job.slug}`} className="mt-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-700">
                                Open full page / share this role
                            </Link>
                        </>
                    ) : (
                        <ApplyForm job={job} reviewPromise={reviewPromise} />
                    )}
                </div>

                {view === 'details' && (
                    <footer className="border-t border-slate-100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {applied ? (
                            <p className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">Applied ✓</p>
                        ) : (
                            <button type="button" onClick={openApply} className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
                                Quick Apply
                            </button>
                        )}
                    </footer>
                )}
            </div>
        </div>
    );
}
