import { SITE_URL } from '@/lib/site';

// Served at /robots.txt
export default function robots() {
    // Keep staging/preview deployments out of search results.
    if (process.env.NEXT_PUBLIC_ALLOW_INDEXING === 'false') {
        return { rules: [{ userAgent: '*', disallow: '/' }] };
    }
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/cart', '/checkout', '/dashboard', '/order', '/login', '/logout', '/qc/', '/hr'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
