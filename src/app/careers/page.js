import { Suspense } from 'react';
import { pageMetadata } from '@/lib/site';
import { getOpenJobs, REVIEW_PROMISE, CAREERS_EMAIL } from '@/lib/careers/jobs';
import CareersBoard from './components/CareersBoard';

export const metadata = pageMetadata({
    title: 'Careers – Jobs at GoRevive, New Delhi',
    description: 'Join GoRevive and help give IT hardware a second life. Open roles in operations, sales and technology in New Delhi. Apply in under a minute.',
    path: '/careers',
});

export default function CareersPage() {
    const jobs = getOpenJobs();

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Plain gradient, no images or video: the role list renders straight away on any connection. */}
            <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 px-4 pb-14 pt-16 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-5xl">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-300">Careers at GoRevive</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
                        Help us give technology a second life.
                    </h1>
                    <p className="mt-4 max-w-2xl text-lg text-blue-100/80">
                        We test, certify and resell pre-owned IT hardware, and recycle what can’t be reused. Pick a role, read the short brief and apply in under a minute — no account needed.
                    </p>
                </div>
            </section>

            <section className="px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="open-roles">
                <div className="container mx-auto max-w-5xl">
                    <h2 id="open-roles" className="mb-4 text-xl font-bold text-slate-900">
                        Open roles <span className="font-medium text-slate-400">({jobs.length})</span>
                    </h2>
                    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-white" />}>
                        <CareersBoard jobs={jobs} reviewPromise={REVIEW_PROMISE} inbox={CAREERS_EMAIL} />
                    </Suspense>
                </div>
            </section>
        </div>
    );
}
