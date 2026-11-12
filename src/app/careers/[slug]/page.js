import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import JsonLd from '@/components/utils/SEO/JsonLd';
import { pageMetadata, SITE_URL, SITE_NAME } from '@/lib/site';
import { JOBS, getJob, isOpen, REVIEW_PROMISE, CAREERS_OFFICE, formatSalary, formatDate } from '@/lib/careers/jobs';
import JobDetails, { JobMeta } from '../components/JobDetails';
import ApplyForm from '../components/ApplyForm';

// Only roles listed in jobs.js have a page; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
    return JOBS.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({ params }) {
    const job = getJob((await params).slug);
    if (!job) return {};
    const meta = pageMetadata({
        title: `${job.title} – ${job.location}`,
        description: `${job.summary} ${job.workMode}, ${job.experience}. Apply in under a minute.`,
        path: `/careers/${job.slug}`,
    });
    // Closed roles stay reachable for old links but drop out of search.
    return isOpen(job) ? meta : { ...meta, robots: { index: false, follow: true } };
}

const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;

// schema.org JobPosting, read by Google for Jobs.
function jobPostingSchema(job) {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'JobPosting',
        title: job.title,
        description: `<p>${job.summary}</p><p><strong>What you'll do</strong></p>${list(job.responsibilities)}<p><strong>Skills</strong></p>${list(job.skills)}${job.requirements?.length ? `<p><strong>Requirements</strong></p>${list(job.requirements)}` : ''}${job.goodToHave?.length ? `<p><strong>Good to have</strong></p>${list(job.goodToHave)}` : ''}<p><strong>What we offer</strong></p>${list(job.perks)}`,
        identifier: { '@type': 'PropertyValue', name: SITE_NAME, value: job.slug },
        datePosted: job.postedAt,
        validThrough: job.validThrough ? `${job.validThrough}T23:59:59+05:30` : undefined,
        employmentType: job.employmentType,
        hiringOrganization: { '@type': 'Organization', name: 'GoRevive Private Limited', sameAs: SITE_URL, logo: `${SITE_URL}/favicon.ico` },
        jobLocation: {
            '@type': 'Place',
            address: {
                '@type': 'PostalAddress',
                streetAddress: CAREERS_OFFICE.street,
                addressLocality: CAREERS_OFFICE.locality,
                addressRegion: CAREERS_OFFICE.region,
                postalCode: CAREERS_OFFICE.postalCode,
                addressCountry: CAREERS_OFFICE.country,
            },
        },
        directApply: true,
        url: `${SITE_URL}/careers/${job.slug}`,
    };
    if (job.experienceMonths) {
        schema.experienceRequirements = { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: job.experienceMonths };
    }
    if (job.workMode === 'Remote') {
        schema.jobLocationType = 'TELECOMMUTE';
        schema.applicantLocationRequirements = { '@type': 'Country', name: 'India' };
    }
    if (formatSalary(job.salary)) {
        schema.baseSalary = {
            '@type': 'MonetaryAmount',
            currency: 'INR',
            value: { '@type': 'QuantitativeValue', minValue: job.salary.min, maxValue: job.salary.max, unitText: job.salary.unit },
        };
    }
    return schema;
}

export default async function JobPage({ params }) {
    const job = getJob((await params).slug);
    if (!job) notFound();
    const open = isOpen(job);

    return (
        <div className="min-h-screen bg-off-white px-4 pb-28 pt-6 text-[#0B2136] sm:px-6 lg:px-8 lg:pb-20">
            {open && <JsonLd data={jobPostingSchema(job)} />}
            <div className="container mx-auto max-w-6xl">
                <Link href="/careers" className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-g600 hover:text-g700">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All open roles
                </Link>

                <header className="mt-2 rounded-3xl bg-[#0B2136] px-6 py-8 text-white sm:px-10 sm:py-10">
                    <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-lime">
                        {job.department}{job.postedAt && ` · Posted ${formatDate(job.postedAt)}`}
                    </p>
                    <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">{job.title}</h1>
                    <JobMeta job={job} tone="dark" className="mt-4" />
                </header>

                <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-start">
                    <article className="rounded-3xl border border-g100 bg-white p-6 sm:p-10">
                        <JobDetails job={job} />
                    </article>

                    <aside id="apply" className="scroll-mt-6 rounded-3xl border border-g100 bg-white p-6 shadow-card-hover sm:p-7 lg:sticky lg:top-24">
                        {open ? (
                            <>
                                <div className="mb-5 flex items-baseline justify-between gap-3">
                                    <h2 className="font-display text-xl font-extrabold">Apply</h2>
                                    <span className="text-sm font-semibold text-secondary">~1 min · no account</span>
                                </div>
                                <ApplyForm job={job} reviewPromise={REVIEW_PROMISE} />
                            </>
                        ) : (
                            <div className="text-center">
                                <h2 className="font-display text-lg font-extrabold">This role is closed</h2>
                                <p className="mt-2 text-sm text-secondary">We’re no longer taking applications for it.</p>
                                <Link href="/careers" className="mt-4 inline-flex min-h-[44px] items-center text-sm font-semibold text-g600 hover:text-g700">See open roles</Link>
                            </div>
                        )}
                    </aside>
                </div>
            </div>

            {/* Below lg the form sits under the brief; keep the way to it one tap away. */}
            {open && (
                <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-g100 bg-white px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(10,31,20,0.06)] lg:hidden">
                    <p className="min-w-0 flex-1 text-sm text-secondary">No account · <span className="font-semibold text-[#0B2136]">about a minute</span></p>
                    <a href="#apply" className="inline-flex min-h-[48px] items-center rounded-full bg-g600 px-7 font-display text-[15px] font-bold text-white hover:bg-g700">Apply</a>
                </div>
            )}
        </div>
    );
}
