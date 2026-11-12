/** @type {import('next').NextConfig} */

const imageHost = new URL(process.env.NEXT_PUBLIC_IMAGE_HOST || 'https://gorevive.jbbs.in');

const securityHeaders = [
  // Browsers remember to use HTTPS only for this site for a year. Add
  // `; includeSubDomains` once every subdomain of the site serves HTTPS.
  { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'self' https://harsh-jha.vercel.app" },
];

const nextConfig = {
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,

  // Set ASSET_PREFIX to a CDN origin (e.g. https://cdn.gorevive.in) to serve
  // /_next/static from the CDN. Leave unset to serve from this server.
  assetPrefix: process.env.ASSET_PREFIX || undefined,

  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7,
    remotePatterns: [
      { protocol: imageHost.protocol.replace(':', ''), hostname: imageHost.hostname, pathname: '/**' },
      // Category thumbnails in components/utils/UI/CatogeryImage.js
      { protocol: 'https', hostname: 'i.pinimg.com', pathname: '/**' },
    ],
  },

  experimental: {
    // Only bundle the icons/functions actually used from these packages.
    optimizePackageImports: ['lucide-react'],
  },

  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Files in /public rarely change; let browsers and the CDN cache them.
        source: '/:file(.*\\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=2592000, stale-while-revalidate=86400' }],
      },
      {
        // Account and checkout pages must never be indexed or cached by a CDN.
        source: '/:path(dashboard|order|checkout|cart|login|logout|hr)/:rest*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: true },
      { source: '/product', destination: '/products', permanent: true },
      { source: '/product/:slug', destination: '/products/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
