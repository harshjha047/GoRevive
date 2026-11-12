import { Suspense } from 'react';
import { Lock, MapPin, ShieldCheck } from 'lucide-react';
import { pageMetadata } from '@/lib/site';
import { getOpenJobs, REVIEW_PROMISE, CAREERS_EMAIL, HIRING_STEPS } from '@/lib/careers/jobs';
import CareersBoard from './components/CareersBoard';

export const metadata = pageMetadata({
    title: 'Careers – Jobs at GoRevive, New Delhi',
    description: 'Join GoRevive and help give IT hardware a second life. See open roles at our New Delhi office and apply in under a minute.',
    path: '/careers',
});

const PROOF = [
    { icon: ShieldCheck, title: 'CPCB / DPCC authorised', text: 'Regulated e-waste work that matters' },
    { icon: Lock, title: 'NIST 800-88 data wiping', text: 'Enterprise clients trust our process' },
    { icon: MapPin, title: 'Okhla Phase I, New Delhi', text: 'Our office and testing facility' },
];

export default function CareersPage() {
    const jobs = getOpenJobs();

    return (
        <div className="min-h-screen bg-off-white text-[#0B2136]">
            {/* Solid colour, no images or video: the role list renders straight away on any connection. */}
            <section className="bg-[#0B2136] px-4 pb-24 pt-16 text-white sm:px-6 lg:px-8">
                <div className="container mx-auto flex max-w-5xl flex-wrap items-end gap-10">
                    <div className="min-w-0 flex-[999_1_480px]">
                        <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-lime">Careers at GoRevive</p>
                        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                            Help us give technology a{' '}
                            <span className="font-accent font-normal italic text-lime">second life.</span>
                        </h1>
                        <p className="mt-5 max-w-xl text-lg leading-relaxed text-g100">
                            We test, certify and resell pre-owned IT hardware, and recycle what can’t be reused. No account, no cover letter — apply in about a minute.
                        </p>
                        <div className="mt-7 flex flex-wrap gap-3">
                            <a href="#open-roles" className="inline-flex min-h-[48px] items-center rounded-full bg-lime px-6 font-display text-[15px] font-bold text-[#0B2136] transition hover:bg-lime-dark">
                                See open roles · {jobs.length}
                            </a>
                            <a href="#hiring-process" className="inline-flex min-h-[48px] items-center rounded-full border border-white/30 px-6 text-[15px] font-semibold text-white transition hover:border-white/60">
                                How hiring works
                            </a>
                        </div>
                    </div>
                    <ul className="flex flex-[1_1_280px] flex-col gap-3">
                        {PROOF.map(({ icon: I, title, text }) => (
                            <li key={title} className="flex items-start gap-3.5 rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5">
                                <I className="mt-0.5 h-5 w-5 shrink-0 text-lime" aria-hidden="true" />
                                <span className="text-[15px] leading-snug">
                                    <strong className="block font-semibold">{title}</strong>
                                    <span className="text-b100">{text}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="px-4 sm:px-6 lg:px-8" aria-labelledby="open-roles">
                <div className="container mx-auto -mt-12 max-w-5xl rounded-3xl bg-white p-5 shadow-card sm:p-7">
                    <h2 id="open-roles" className="mb-5 scroll-mt-24 font-display text-2xl font-extrabold">
                        Open roles <span className="font-semibold text-secondary">({jobs.length})</span>
                    </h2>
                    <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-off-white" />}>
                        <CareersBoard jobs={jobs} reviewPromise={REVIEW_PROMISE} inbox={CAREERS_EMAIL} />
                    </Suspense>
                </div>
            </section>

            <section className="px-4 pb-20 pt-16 sm:px-6 lg:px-8" aria-labelledby="hiring-process">
                <div className="container mx-auto max-w-5xl">
                    <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-g600">What happens next</p>
                    <h2 id="hiring-process" className="mt-2 scroll-mt-24 font-display text-3xl font-extrabold tracking-tight">
                        No black hole. <span className="font-accent font-normal italic text-g600">Here’s the whole process.</span>
                    </h2>
                    <ol className="mt-7 grid gap-4 md:grid-cols-3">
                        {HIRING_STEPS.map((step, i) => (
                            <li key={step.title} className="rounded-2xl border border-g100 bg-white p-6">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0B2136] font-display font-extrabold text-lime" aria-hidden="true">{i + 1}</span>
                                <h3 className="mt-4 font-display text-lg font-bold">{step.title}</h3>
                                <p className="mt-2 text-[15px] leading-relaxed text-secondary">{step.text}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </section>
        </div>
    );
}
