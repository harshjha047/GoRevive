import { Briefcase, CheckCircle2, ChevronDown, Clock, Gift, Wallet, MapPin, Sparkles, Wrench } from 'lucide-react';
import { formatSalary } from '@/lib/careers/jobs';

/**
 * Pay, location and experience as small pills. `tone="dark"` is for the navy
 * job header; the default suits white cards and the drawer.
 */
export function JobMeta({ job, className = '', tone = 'light' }) {
    const salary = formatSalary(job.salary);
    const dark = tone === 'dark';
    const items = [
        { icon: MapPin, text: `${job.location} · ${job.workMode}` },
        { icon: Clock, text: job.experience },
        { icon: Briefcase, text: job.department },
    ];
    const pill = dark ? 'bg-white/10 text-white' : 'border border-g100 bg-off-white text-[#0B2136]';
    return (
        <ul className={`flex flex-wrap gap-2 text-sm ${className}`}>
            {salary && (
                <li className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 font-semibold ${dark ? 'bg-lime text-[#0B2136]' : 'bg-g050 text-g600'}`}>
                    <Wallet className="h-4 w-4" aria-hidden="true" />
                    {salary}
                </li>
            )}
            {items.map(({ icon: I, text }) => (
                <li key={text} className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${pill}`}>
                    <I className={`h-4 w-4 ${dark ? 'text-lime' : 'text-g500'}`} aria-hidden="true" />
                    {text}
                </li>
            ))}
        </ul>
    );
}

function Section({ icon: I, title, children }) {
    return (
        <section>
            <h3 className="mb-3 flex items-center gap-2 font-display text-base font-extrabold text-[#0B2136]">
                <I className="h-4 w-4 text-g600" aria-hidden="true" />
                {title}
            </h3>
            {children}
        </section>
    );
}

const LIST = 'list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-g700 marker:text-g400';
const VISIBLE = 4;

/** Shows the first few bullets; the rest sit behind a native "Show N more" toggle (works without JS). */
function BulletList({ items }) {
    const head = items.slice(0, VISIBLE);
    const rest = items.slice(VISIBLE);
    return (
        <>
            <ul className={LIST}>{head.map((r) => <li key={r}>{r}</li>)}</ul>
            {rest.length > 0 && (
                <details className="group mt-2">
                    <summary className="inline-flex min-h-[36px] cursor-pointer list-none items-center gap-1 text-sm font-bold text-g600 hover:text-g700 [&::-webkit-details-marker]:hidden">
                        <span className="group-open:hidden">Show {rest.length} more</span>
                        <span className="hidden group-open:inline">Show less</span>
                        <ChevronDown className="h-4 w-4 transition group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ul className={`${LIST} mt-2`}>{rest.map((r) => <li key={r}>{r}</li>)}</ul>
                </details>
            )}
        </>
    );
}

/** The role brief. No hooks, so it renders on the server too. */
export default function JobDetails({ job }) {
    const salary = formatSalary(job.salary);
    return (
        <div className="space-y-7">
            <p className="text-base leading-relaxed text-g700">{job.summary}</p>

            <Section icon={Briefcase} title="What you’ll do">
                <BulletList items={job.responsibilities} />
            </Section>

            {job.requirements?.length > 0 && (
                <Section icon={CheckCircle2} title="Must have">
                    <BulletList items={job.requirements} />
                </Section>
            )}

            <Section icon={Wrench} title="Skills & tools">
                <ul className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                        <li key={s} className="rounded-full border border-g100 px-3 py-1 text-xs font-semibold text-[#0B2136]">{s}</li>
                    ))}
                </ul>
            </Section>

            {job.goodToHave?.length > 0 && (
                <details className="group border-t border-g100 pt-5">
                    <summary className="flex min-h-[40px] cursor-pointer list-none items-center gap-2 [&::-webkit-details-marker]:hidden">
                        <Sparkles className="h-4 w-4 text-g600" aria-hidden="true" />
                        <span className="font-display text-base font-extrabold text-[#0B2136]">Good to have</span>
                        <span className="text-sm text-secondary">not required · {job.goodToHave.length} items</span>
                        <ChevronDown className="ml-auto h-4 w-4 text-g600 transition group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <ul className={`${LIST} mt-3`}>{job.goodToHave.map((r) => <li key={r}>{r}</li>)}</ul>
                </details>
            )}

            <section className="rounded-2xl bg-off-white p-5">
                <h3 className="mb-3 flex items-center gap-2 font-display text-base font-extrabold text-[#0B2136]">
                    <Gift className="h-4 w-4 text-g600" aria-hidden="true" />
                    {salary ? 'Pay & perks' : 'What we offer'}
                </h3>
                {salary && <p className="mb-2 text-[15px] font-bold text-[#0B2136]">{salary}</p>}
                <ul className="list-disc space-y-1.5 pl-5 text-[15px] leading-relaxed text-g700 marker:text-g400">
                    {job.perks.map((p) => <li key={p}>{p}</li>)}
                </ul>
            </section>
        </div>
    );
}
