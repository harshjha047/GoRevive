import { Briefcase, Clock, Gift, IndianRupee, MapPin, Wrench } from 'lucide-react';
import { formatSalary } from '@/lib/careers/jobs';

export function JobMeta({ job, className = '' }) {
    const items = [
        { icon: MapPin, text: `${job.location} · ${job.workMode}` },
        { icon: Clock, text: job.experience },
        { icon: Briefcase, text: job.department },
    ];
    return (
        <ul className={`flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-slate-600 ${className}`}>
            {items.map(({ icon: I, text }) => (
                <li key={text} className="flex items-center gap-1.5">
                    <I className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {text}
                </li>
            ))}
        </ul>
    );
}

function Section({ icon: I, title, children }) {
    return (
        <section>
            <h3 className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-900">
                <I className="h-4 w-4 text-blue-600" aria-hidden="true" />
                {title}
            </h3>
            {children}
        </section>
    );
}

/** The 3-part summary: what you'll do, skills, pay & perks. No hooks, so it renders on the server too. */
export default function JobDetails({ job }) {
    const salary = formatSalary(job.salary);
    return (
        <div className="space-y-6">
            <p className="text-[15px] leading-relaxed text-slate-700">{job.summary}</p>

            <Section icon={Briefcase} title="What you’ll do">
                <ul className="list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 marker:text-slate-400">
                    {job.responsibilities.map((r) => <li key={r}>{r}</li>)}
                </ul>
            </Section>

            <Section icon={Wrench} title="Skills & tools">
                <ul className="flex flex-wrap gap-2">
                    {job.skills.map((s) => (
                        <li key={s} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">{s}</li>
                    ))}
                </ul>
            </Section>

            <Section icon={Gift} title="Pay & perks">
                {salary && (
                    <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                        <IndianRupee className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                        {salary}
                    </p>
                )}
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700 marker:text-slate-400">
                    {job.perks.map((p) => <li key={p}>{p}</li>)}
                </ul>
            </Section>
        </div>
    );
}
