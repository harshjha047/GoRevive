import { getProductBundles } from '@/lib/server/inventory';
import { SITE_URL } from '@/lib/site';
import { getOpenJobs } from '@/lib/careers/jobs';

// Served at /sitemap.xml and refreshed hourly.
export const revalidate = 3600;

const STATIC_PAGES = [
    { path: '/', changeFrequency: 'daily', priority: 1.0 },
    { path: '/products', changeFrequency: 'hourly', priority: 0.9 },
    { path: '/grading', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.6 },
    { path: '/support', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/careers', changeFrequency: 'weekly', priority: 0.6 },
    { path: '/warranty-policy', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/return-policy', changeFrequency: 'yearly', priority: 0.4 },
    { path: '/shipping-policy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/cancellation-refund', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/terms-and-conditions', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/privacy-policy', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/disclaimer', changeFrequency: 'yearly', priority: 0.2 },
    { path: '/data-deletion', changeFrequency: 'yearly', priority: 0.2 },
];

const validDate = (v) => {
    const d = v ? new Date(v) : null;
    return d && !Number.isNaN(d.getTime()) ? d : null;
};

export default async function sitemap() {
    const now = new Date();
    const entries = STATIC_PAGES.map(({ path, changeFrequency, priority }) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency,
        priority,
    }));

    for (const job of getOpenJobs(now)) {
        entries.push({ url: `${SITE_URL}/careers/${job.slug}`, lastModified: validDate(job.postedAt) || now, changeFrequency: 'weekly', priority: 0.6 });
    }

    let products = [];
    try {
        products = await getProductBundles();
    } catch {
        // Inventory unavailable: publish the static pages rather than fail.
    }

    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

    for (const c of categories) {
        entries.push({ url: `${SITE_URL}/products?category=${encodeURIComponent(c)}`, lastModified: now, changeFrequency: 'daily', priority: 0.8 });
    }
    for (const b of brands) {
        entries.push({ url: `${SITE_URL}/products?brand=${encodeURIComponent(b)}`, lastModified: now, changeFrequency: 'daily', priority: 0.7 });
    }
    for (const p of products) {
        entries.push({
            url: `${SITE_URL}/products/${p.slug}`,
            lastModified: validDate(p.updatedAt) || now,
            changeFrequency: 'daily',
            priority: 0.8,
            images: p.image ? [p.image] : undefined,
        });
    }
    return entries;
}
