// HR area: never indexed, never cached.
export const metadata = {
    title: 'HR – Job applications',
    robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default function HrLayout({ children }) {
    return <div className="min-h-[70vh] bg-slate-50">{children}</div>;
}
