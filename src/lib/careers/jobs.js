// Open roles shown on /careers. Edit this file to add, change or close a role:
// set `active: false` (or let `validThrough` pass) to take it down.
//
// THE ROLES BELOW ARE SAMPLES. Replace the titles, details and salaries with
// your real openings before going live.
//
// Fields:
//   slug          URL of the role: /careers/<slug>. Never reuse a slug.
//   department    Used for the filter pills.
//   workMode      'On-site' | 'Hybrid' | 'Remote'
//   employmentType  schema.org value: FULL_TIME, PART_TIME, CONTRACTOR, INTERN
//   salary        Optional. { min, max, unit: 'MONTH' | 'YEAR' } in INR. Shown
//                 on the page and sent to Google for Jobs.
//   postedAt / validThrough  ISO dates (YYYY-MM-DD).

import { CONTACT } from '@/lib/site';

// Public address for general applications (shown when no role fits). Change it
// to a careers@ mailbox once one exists.
export const CAREERS_EMAIL = CONTACT.email;

export const CAREERS_OFFICE = {
    locality: 'New Delhi',
    region: 'Delhi',
    postalCode: '110020',
    country: 'IN',
};

// Shown on the confirmation screen and in the candidate's email. Only promise
// what the hiring team will actually do.
export const REVIEW_PROMISE = 'Our hiring team reviews every application. If your profile is a match, we will email you within 7 working days.';

export const JOBS = [
    {
        slug: 'qc-technician-laptops',
        title: 'QC Technician – Laptops & Desktops',
        department: 'Operations',
        workMode: 'On-site',
        location: 'New Delhi',
        experience: '1–3 years',
        employmentType: 'FULL_TIME',
        summary: 'Test, grade and certify pre-owned laptops and desktops before they reach our customers.',
        responsibilities: [
            'Run hardware diagnostics on incoming laptops and desktops',
            'Grade cosmetic and functional condition against the GoRevive grading parameters',
            'Replace common parts (RAM, SSD, batteries, keyboards) and re-test',
            'Record results against each serial number in our QC system',
        ],
        skills: ['Laptop/desktop hardware', 'Windows & macOS installs', 'Diagnostic tools', 'Attention to detail'],
        perks: ['Health insurance', 'Paid leave', 'Training on enterprise hardware'],
        salary: { min: 18000, max: 28000, unit: 'MONTH' },
        postedAt: '2026-11-01',
        validThrough: '2027-01-31',
        active: true,
    },
    {
        slug: 'b2b-sales-executive',
        title: 'B2B Sales Executive',
        department: 'Sales',
        workMode: 'Hybrid',
        location: 'New Delhi',
        experience: '2–5 years',
        employmentType: 'FULL_TIME',
        summary: 'Sell certified pre-owned IT hardware to retailers, resellers and corporate buyers.',
        responsibilities: [
            'Build and manage a pipeline of retailer and corporate accounts',
            'Prepare quotes for bulk laptop and desktop orders',
            'Work with operations to meet delivery timelines',
            'Hit monthly revenue targets',
        ],
        skills: ['B2B / channel sales', 'IT hardware knowledge', 'Negotiation', 'CRM & Excel'],
        perks: ['Incentives on every deal', 'Health insurance', 'Travel allowance'],
        salary: { min: 300000, max: 600000, unit: 'YEAR' },
        postedAt: '2026-11-01',
        validThrough: '2027-01-31',
        active: true,
    },
    {
        slug: 'itad-operations-executive',
        title: 'ITAD Operations Executive',
        department: 'Operations',
        workMode: 'On-site',
        location: 'New Delhi',
        experience: '1–4 years',
        employmentType: 'FULL_TIME',
        summary: 'Coordinate IT asset pickups, data erasure and recycling for corporate clients.',
        responsibilities: [
            'Schedule asset pickups and track inbound lots',
            'Make sure every device goes through certified data erasure',
            'Prepare disposal and erasure certificates for clients',
            'Keep e-waste records compliant with CPCB requirements',
        ],
        skills: ['Logistics coordination', 'Documentation', 'Excel', 'Client communication'],
        perks: ['Health insurance', 'Paid leave'],
        postedAt: '2026-11-01',
        validThrough: '2027-01-31',
        active: true,
    },
    {
        slug: 'full-stack-developer',
        title: 'Full-Stack Developer (Next.js)',
        department: 'Technology',
        workMode: 'Hybrid',
        location: 'New Delhi',
        experience: '2–4 years',
        employmentType: 'FULL_TIME',
        summary: 'Build the GoRevive storefront, checkout and internal tools.',
        responsibilities: [
            'Ship features across the Next.js storefront and its APIs',
            'Integrate payments, inventory and order systems',
            'Keep pages fast and search-friendly',
            'Own features from idea to production',
        ],
        skills: ['React / Next.js', 'Node.js', 'REST APIs', 'MongoDB or SQL'],
        perks: ['Health insurance', 'Hybrid work', 'Latest hardware'],
        salary: { min: 600000, max: 1200000, unit: 'YEAR' },
        postedAt: '2026-11-01',
        validThrough: '2027-01-31',
        active: true,
    },
];

const endOfDay = (iso) => new Date(`${iso}T23:59:59+05:30`);

export const isOpen = (job, now = new Date()) =>
    Boolean(job?.active) && (!job.validThrough || endOfDay(job.validThrough) >= now);

export const getOpenJobs = (now = new Date()) => JOBS.filter((j) => isOpen(j, now));

export const getJob = (slug) => JOBS.find((j) => j.slug === slug) || null;

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

/** "₹18,000 – ₹28,000 / month", or null when no salary is set. */
export function formatSalary(salary) {
    if (!salary?.min && !salary?.max) return null;
    const unit = salary.unit === 'MONTH' ? 'month' : 'year';
    const range = salary.min && salary.max && salary.min !== salary.max
        ? `${inr.format(salary.min)} – ${inr.format(salary.max)}`
        : inr.format(salary.max || salary.min);
    return `${range} / ${unit}`;
}
