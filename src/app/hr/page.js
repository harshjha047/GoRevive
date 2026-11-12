import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Inbox, Search } from 'lucide-react';
import { getHrUser } from '@/lib/server/hrAuth';
import { isMongoConfigured } from '@/lib/server/mongo';
import { listApplications, STATUSES, PAGE_SIZE } from '@/lib/server/careers';
import { JOBS } from '@/lib/careers/jobs';
import ApplicationCard from './components/ApplicationCard';
import LogoutButton from './components/LogoutButton';

const hrefWith = (params, changes) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...params, ...changes })) if (v) q.set(k, String(v));
    const s = q.toString();
    return s ? `/hr?${s}` : '/hr';
};

export default async function HrPage({ searchParams }) {
    const hr = await getHrUser();
    if (!hr) redirect('/hr/login');

    const sp = await searchParams;
    const params = {
        job: typeof sp.job === 'string' ? sp.job : '',
        status: typeof sp.status === 'string' && STATUSES.includes(sp.status) ? sp.status : '',
        q: typeof sp.q === 'string' ? sp.q.slice(0, 80) : '',
    };
    const page = Math.max(1, Number(sp.page) || 1);

    let data = null;
    let loadError = '';
    if (!isMongoConfigured()) loadError = 'MONGODB_URI is not set, so there are no applications to show.';
    else {
        try {
            data = await listApplications({ ...params, page });
        } catch (e) {
            console.error('HR list failed:', e.message);
            loadError = 'Could not load applications from the database. Please refresh in a moment.';
        }
    }
    const allCount = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;
    const pages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1;

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            <div className="flex flex-wrap items-center gap-3">
                <div className="flex-1">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Job applications</h1>
                    <p className="text-sm text-slate-500">Signed in as {hr.email}</p>
                </div>
                <LogoutButton />
            </div>

            <form action="/hr" method="get" className="mt-6 flex flex-wrap gap-2">
                {params.status && <input type="hidden" name="status" value={params.status} />}
                <label className="sr-only" htmlFor="hr-job">Role</label>
                <select id="hr-job" name="job" defaultValue={params.job} className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option value="">All roles</option>
                    {JOBS.map((j) => <option key={j.slug} value={j.slug}>{j.title}</option>)}
                </select>
                <div className="relative min-w-[200px] flex-1">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                    <label className="sr-only" htmlFor="hr-q">Search</label>
                    <input id="hr-q" name="q" defaultValue={params.q} placeholder="Search name, email or phone"
                        className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
                </div>
                <button type="submit" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">Filter</button>
            </form>

            {data && (
                <nav className="mt-4 flex flex-wrap gap-2" aria-label="Filter by status">
                    {['', ...STATUSES].map((s) => {
                        const active = params.status === s;
                        const n = s ? data.counts[s] || 0 : allCount;
                        return (
                            <Link key={s || 'all'} href={hrefWith(params, { status: s, page: '' })} aria-current={active ? 'page' : undefined}
                                className={`rounded-full border px-3 py-1 text-sm capitalize transition ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-blue-400'}`}>
                                {s || 'All'} <span className={active ? 'text-blue-100' : 'text-slate-400'}>{n}</span>
                            </Link>
                        );
                    })}
                </nav>
            )}

            {loadError && <p className="mt-6 rounded-lg bg-amber-50 p-4 text-sm text-amber-800">{loadError}</p>}

            {data && (data.items.length ? (
                <ul className="mt-6 space-y-4">
                    {data.items.map((app) => (
                        <ApplicationCard key={app._id} app={JSON.parse(JSON.stringify(app))} statuses={STATUSES} />
                    ))}
                </ul>
            ) : (
                <div className="mt-6 flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
                    <Inbox className="h-8 w-8 text-slate-300" aria-hidden="true" />
                    <p className="mt-2 font-semibold text-slate-800">No applications here</p>
                    <p className="text-sm text-slate-500">{params.q || params.job || params.status ? 'Try clearing the filters.' : 'New applications will show up here.'}</p>
                </div>
            ))}

            {data && pages > 1 && (
                <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Pages">
                    {page > 1 ? <Link href={hrefWith(params, { page: page - 1 })} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50">← Newer</Link> : <span />}
                    <span className="text-slate-500">Page {page} of {pages}</span>
                    {page < pages ? <Link href={hrefWith(params, { page: page + 1 })} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 hover:bg-slate-50">Older →</Link> : <span />}
                </nav>
            )}
        </div>
    );
}
