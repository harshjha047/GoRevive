"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import JobDetails, { JobMeta } from './JobDetails';
import ApplyForm from './ApplyForm';
import { useAppliedSlugs } from '@/lib/careers/careersStore';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Slide-over on desktop; on mobile a bottom sheet for the details and a
 * full-screen view for the form (so the keyboard never hides the submit
 * button). The job board stays visible (dimmed) behind it. Esc, the backdrop
 * and the browser back button close it. `initialView="apply"` skips straight
 * to the form (the card's "Apply" button).
 */
export default function JobDrawer({ job, reviewPromise, onClose, initialView = 'details' }) {
    const applied = useAppliedSlugs().includes(job.slug);
    const [view, setView] = useState(initialView === 'apply' ? 'apply' : 'details'); // details | apply
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
    };

    return (
        <div className="fixed inset-0 z-[60]">
            <div className="absolute inset-0 bg-[#0B2136]/50 backdrop-blur-[1px] animate-[careersFade_150ms_ease-out]" onClick={onClose} aria-hidden="true" />
            <div
                ref={panel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="job-drawer-title"
                tabIndex={-1}
                className={`absolute inset-x-0 bottom-0 flex flex-col bg-white shadow-2xl outline-none animate-[careersUp_200ms_ease-out] sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:max-h-none sm:w-[480px] sm:rounded-none sm:animate-[careersLeft_200ms_ease-out] ${
                    view === 'apply' ? 'top-0 h-[100dvh]' : 'max-h-[92vh] rounded-t-2xl'
                }`}
            >
                {view === 'details' && <div className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-g100 sm:hidden" aria-hidden="true" />}

                <header className={`flex items-start gap-3 border-b border-g100 px-5 pb-4 sm:pt-5 ${view === 'apply' ? 'pt-[max(1rem,env(safe-area-inset-top))]' : 'pt-3'}`}>
                    {view === 'apply' && (
                        <button type="button" onClick={() => setView('details')} className="-ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-[#0B2136] hover:bg-g050" aria-label="Back to role details">
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                    )}
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-wide text-g600">{view === 'apply' ? 'Applying for' : job.department}</p>
                        <h2 id="job-drawer-title" className="mt-0.5 font-display text-lg font-extrabold leading-snug text-[#0B2136]">{job.title}</h2>
                        {view === 'details' && <JobMeta job={job} className="mt-2" />}
                    </div>
                    <button type="button" onClick={onClose} className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] text-secondary hover:bg-g050 hover:text-[#0B2136]" aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <div ref={body} className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
                    {view === 'details' ? (
                        <>
                            <JobDetails job={job} />
                            <Link href={`/careers/${job.slug}`} className="mt-6 inline-block text-sm font-semibold text-g600 hover:text-g700">
                                Open full page / share this role
                            </Link>
                        </>
                    ) : (
                        <ApplyForm job={job} reviewPromise={reviewPromise} stickySubmit />
                    )}
                </div>

                {view === 'details' && (
                    <footer className="flex items-center gap-3 border-t border-g100 bg-white px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                        {applied ? (
                            <p className="w-full rounded-full bg-g050 px-4 py-3 text-center text-sm font-bold text-g600">You’ve applied for this role</p>
                        ) : (
                            <>
                                <p className="min-w-0 flex-1 text-sm text-secondary">No account · <span className="font-semibold text-[#0B2136]">about a minute</span></p>
                                <button type="button" onClick={openApply} className="min-h-[48px] rounded-full bg-g600 px-7 font-display text-[15px] font-bold text-white transition hover:bg-g700">
                                    Apply
                                </button>
                            </>
                        )}
                    </footer>
                )}
            </div>
        </div>
    );
}
