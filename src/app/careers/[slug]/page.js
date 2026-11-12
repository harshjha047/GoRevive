import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import JsonLd from '@/components/utils/SEO/JsonLd';
import { pageMetadata, SITE_URL, SITE_NAME } from '@/lib/site';
import { JOBS, getJob, isOpen, REVIEW_PROMISE, CAREERS_OFFICE, formatSalary } from '@/lib/careers/jobs';
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
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
            {open && <JsonLd data={jobPostingSchema(job)} />}
            <div className="container mx-auto max-w-5xl">
                <Link href="/careers" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700">
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All open roles
                </Link>

                <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
                    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">{job.department}</p>
                        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{job.title}</h1>
                        <JobMeta job={job} className="mt-3" />
                        <hr className="my-6 border-slate-100" />
                        <JobDetails job={job} />
                    </article>

                    <aside id="apply" className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
                        {open ? (
                            <>
                                <h2 className="mb-1 text-lg font-bold text-slate-900">Quick apply</h2>
                                <p className="mb-5 text-sm text-slate-500">Takes under a minute. No account needed.</p>
                                <ApplyForm job={job} reviewPromise={REVIEW_PROMISE} />
                            </>
                        ) : (
                            <div className="text-center">
                                <h2 className="text-lg font-bold text-slate-900">This role is closed</h2>
                                <p className="mt-2 text-sm text-slate-600">We’re no longer taking applications for it.</p>
                                <Link href="/careers" className="mt-4 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">See open roles</Link>
                            </div>
                        )}
                    </aside>
                </div>
            </div>
        </div>
    );
}
