// Open roles shown on /careers. Edit this file to add, change or close a role:
// set `active: false` (or let `validThrough` pass) to take it down.
//
// Fields:
//   slug            URL of the role: /careers/<slug>. Never reuse a slug.
//   department      Used for the filter pills (hidden while there's only one).
//   workMode        'On-site' | 'Hybrid' | 'Remote'
//   experience      Shown on the card. experienceMonths is the minimum, for Google.
//   employmentType  schema.org value: FULL_TIME, PART_TIME, CONTRACTOR, INTERN
//   responsibilities / skills / requirements / goodToHave / perks  bullet lists
//                   (requirements and goodToHave are optional)
//   salary          Optional. { min, max, unit: 'MONTH' | 'YEAR', note } in INR. Shown
//                   on the card, the page and sent to Google for Jobs. `note` is
//                   display-only text such as 'or as discussed'.
//   notePrompt      Optional label for the form's note field; noteRequired makes it mandatory.
//   postedAt / validThrough  ISO dates (YYYY-MM-DD).

// Public address for general applications (shown when no role is open).
// The current JD asks candidates to write to info@gorevive.in.
export const CAREERS_EMAIL = 'info@gorevive.in';

export const CAREERS_OFFICE = {
    street: 'Second Floor, D-161, Okhla Phase I, Okhla Industrial Estate',
    locality: 'New Delhi',
    region: 'Delhi',
    postalCode: '110020',
    country: 'IN',
};

// Shown on the confirmation screen and in the candidate's email. Only promise
// what the hiring team will actually do.
export const REVIEW_PROMISE = 'Our hiring team reviews every application. If your profile is a match, we will email you within 7 working days.';

// "What happens next" on /careers. Keep in line with REVIEW_PROMISE.
export const HIRING_STEPS = [
    { title: 'Apply in a minute', text: 'Upload your resume and we fill in the rest. You get a confirmation email straight away.' },
    { title: 'We review every application', text: 'If your profile is a match, we email you within 7 working days.' },
    { title: 'A quick call, then we meet', text: 'A 5-minute call, then a meeting at our Okhla office.' },
];

export const JOBS = [
    {
        slug: 'digital-marketing-manager',
        title: 'Digital Marketing Manager',
        department: 'Marketing',
        workMode: 'On-site',
        location: 'Okhla, New Delhi',
        experience: '3+ years',
        experienceMonths: 36,
        employmentType: 'FULL_TIME',
        summary: 'Own GoRevive’s digital presence end to end: build the B2B demand engine across search, LinkedIn and content to bring in enterprise leads for our ITAD and buyback services, and grow sales of certified pre-owned devices online. You’ll turn compliance-heavy, technical services into clear, trustworthy marketing for IT heads, procurement, CFOs and ESG leads.',
        responsibilities: [
            'Build and run a quarterly digital marketing plan and budget aligned with sales targets',
            'Run and optimise Google Ads (Search, Performance Max, Shopping), LinkedIn Ads and, where they pay back, Meta campaigns',
            'Build landing pages, lead forms and nurture flows, and hand qualified leads to sales quickly',
            'Own on-page, technical and local SEO for gorevive.in and rank for terms like “ITAD services India” and “pre-owned laptops bulk”',
            'Produce blogs, case studies, whitepapers and ESG/carbon-savings content from our CPCB/DPCC and NIST 800-88 credentials',
            'Grow LinkedIn as our main B2B channel, plus Instagram and Facebook, with short videos of our facility and process',
            'Run email campaigns, keep CRM data clean, and report weekly on spend, CPL, MQLs, SQLs, pipeline and ROAS',
            'Manage freelancers and agencies for design, video and content',
        ],
        skills: ['Google Ads', 'LinkedIn Ads', 'SEO', 'GA4', 'Search Console', 'Tag Manager', 'HubSpot / Zoho CRM', 'Canva'],
        requirements: [
            '3+ years of hands-on digital marketing experience',
            'Hands-on experience running Google Ads and LinkedIn Ads campaigns',
            'Proven SEO results: rankings and organic traffic you can show',
            'Strong working knowledge of GA4, Search Console, Tag Manager and a CRM (HubSpot, Zoho or similar)',
            'Clear, persuasive English writing; able to simplify technical topics',
            'Data-driven: you set targets, measure them and report honestly',
            'Graduate in any discipline; your skills and results matter more than your degree',
        ],
        goodToHave: [
            'Marketing IT hardware, pre-owned electronics, e-waste, SaaS or enterprise B2B services',
            'Familiarity with India’s E-Waste (Management) Rules, EPR or corporate ESG reporting',
            'Account-based marketing (ABM) for enterprise accounts',
            'E-commerce marketing: Google Merchant Center, Shopping feeds, marketplaces',
            'Basic video editing, short-form video and AI tools for content and campaigns',
        ],
        perks: [
            'Ownership of the full digital function, with a real say in budget and strategy',
            'Work that cuts e-waste and carbon emissions for hundreds of companies',
            'Competitive salary and performance-linked incentives',
        ],
        salary: { min: 250000, max: 300000, unit: 'YEAR', note: 'or as discussed' },
        notePrompt: 'Tell us about a campaign you’re proud of (with numbers)',
        noteRequired: false,
        postedAt: '2026-11-12',
        validThrough: '2027-02-12',
        active: true,
    },
];

const endOfDay = (iso) => new Date(`${iso}T23:59:59+05:30`);

export const isOpen = (job, now = new Date()) =>
    Boolean(job?.active) && (!job.validThrough || endOfDay(job.validThrough) >= now);

export const getOpenJobs = (now = new Date()) => JOBS.filter((j) => isOpen(j, now));

export const getJob = (slug) => JOBS.find((j) => j.slug === slug) || null;

const inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const lakh = (n) => String(Number((n / 100000).toFixed(1)));

/**
 * "₹1–3 LPA · or as discussed", "₹18,000 – ₹28,000 / month", or null when no
 * salary is set. Yearly amounts of a lakh or more are shown in LPA, the way
 * Indian candidates compare offers.
 */
export function formatSalary(salary) {
    if (!salary?.min && !salary?.max) return null;
    const lo = salary.min || salary.max;
    const hi = salary.max || salary.min;
    let text;
    if (salary.unit !== 'MONTH' && lo >= 100000) {
        text = lo === hi ? `₹${lakh(lo)} LPA` : `₹${lakh(lo)}–${lakh(hi)} LPA`;
    } else {
        const unit = salary.unit === 'MONTH' ? 'month' : 'year';
        text = `${lo === hi ? inr.format(lo) : `${inr.format(lo)} – ${inr.format(hi)}`} / ${unit}`;
    }
    return salary.note ? `${text} · ${salary.note}` : text;
}

/** "12 Nov 2026" for an ISO date. */
export const formatDate = (iso) =>
    iso ? new Date(`${iso}T12:00:00+05:30`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' }) : '';
