"use client";

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, FileText, Loader2, UploadCloud, X } from 'lucide-react';
import { validators, LIMITS, RESUME_ACCEPT } from '@/lib/careers/validate';
import { loadDraft, saveDraft, clearDraft, markApplied, readUtm, captureUtm, useAppliedSlugs } from '@/lib/careers/careersStore';

const EMPTY_VALUES = { name: '', email: '', phone: '', link: '', note: '' };
const FIELD_ORDER = ['name', 'email', 'phone', 'link', 'resume', 'note'];

const inputClass = (hasError) =>
    `w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:ring-2 ${
        hasError ? 'border-red-400 focus:ring-red-100' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'
    }`;

function Field({ id, label, optional, error, children }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
                {label} {optional && <span className="font-normal text-slate-400">(optional)</span>}
            </label>
            {children}
            {error && <p id={`${id}-error`} className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
        </div>
    );
}

const formatSize = (bytes) => (bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`);

/** Short application form. Used in the drawer and on /careers/[slug]. */
export default function ApplyForm({ job, reviewPromise, onDone }) {
    const applied = useAppliedSlugs().includes(job.slug);
    const [values, setValues] = useState(EMPTY_VALUES);
    const [consent, setConsent] = useState(false);
    const [resume, setResume] = useState(null);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('idle'); // idle | uploading | sending | done
    const [progress, setProgress] = useState(0);
    const uploaded = useRef(null); // { file, ticket } of the last successful upload
    const [formError, setFormError] = useState('');
    const [dragging, setDragging] = useState(false);
    const fileInput = useRef(null);
    const formRef = useRef(null);
    const loaded = useRef(false);

    // Restore a half-filled form for this role.
    useEffect(() => {
        captureUtm();
        const draft = loadDraft(job.slug);
        if (draft) setValues({ ...EMPTY_VALUES, ...Object.fromEntries(Object.keys(EMPTY_VALUES).map((k) => [k, String(draft[k] ?? '')])) });
        loaded.current = true;
    }, [job.slug]);

    useEffect(() => {
        if (!loaded.current || status === 'done') return;
        const t = setTimeout(() => saveDraft(job.slug, values), 300);
        return () => clearTimeout(t);
    }, [job.slug, values, status]);

    const setValue = (key) => (e) => {
        const v = e.target.value;
        setValues((prev) => ({ ...prev, [key]: v }));
        if (errors[key]) setErrors((prev) => ({ ...prev, [key]: validators[key](v) }));
    };
    const validateOnBlur = (key) => () => setErrors((prev) => ({ ...prev, [key]: validators[key](values[key]) }));

    const pickFile = (file) => {
        if (!file) return;
        const message = validators.resume(file);
        setErrors((prev) => ({ ...prev, resume: message }));
        setResume(message ? null : file);
    };

    const removeFile = () => {
        setResume(null);
        setErrors((prev) => ({ ...prev, resume: '' }));
        if (fileInput.current) fileInput.current.value = '';
    };

    const focusFirstError = (errs) => {
        const first = FIELD_ORDER.find((k) => errs[k]);
        if (first) formRef.current?.querySelector(`[name="${first}"]`)?.focus();
    };

    // Uploads the PDF straight to Cloudinary with a server-signed request and
    // returns the ticket the apply API needs. The same file isn't uploaded twice
    // if the candidate fixes another field and submits again.
    async function uploadResume(file) {
        if (uploaded.current?.file === file) return uploaded.current.ticket;
        const signRes = await fetch('/api/careers/resume-upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobSlug: job.slug }),
        });
        const sign = await signRes.json().catch(() => ({}));
        if (!signRes.ok || !sign.success) throw new Error(sign.message || 'Could not start the upload.');

        const body = new FormData();
        Object.entries(sign.fields).forEach(([k, v]) => body.append(k, String(v)));
        body.append('file', file);

        await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', sign.uploadUrl);
            xhr.upload.onprogress = (e) => e.lengthComputable && setProgress(Math.round((e.loaded / e.total) * 100));
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) return resolve();
                let message = 'Upload failed. Please check the file is a PDF under 5 MB.';
                try {
                    const m = JSON.parse(xhr.responseText)?.error?.message || '';
                    if (/format/i.test(m)) message = 'Please upload a PDF file.';
                } catch {
                    /* keep default */
                }
                reject(new Error(message));
            };
            xhr.onerror = () => reject(new Error('Network error while uploading. Please try again.'));
            xhr.send(body);
        });
        uploaded.current = { file, ticket: sign.ticket };
        return sign.ticket;
    }

    async function submit(e) {
        e.preventDefault();
        setFormError('');
        const errs = Object.fromEntries(Object.keys(EMPTY_VALUES).map((k) => [k, validators[k](values[k])]));
        errs.resume = resume ? validators.resume(resume) : '';
        setErrors(errs);
        if (Object.values(errs).some(Boolean)) return focusFirstError(errs);
        if (!consent) return setFormError('Please agree to the privacy notice to apply.');

        let resumeTicket = '';
        if (resume) {
            setStatus('uploading');
            setProgress(0);
            try {
                resumeTicket = await uploadResume(resume);
            } catch (error) {
                setErrors((prev) => ({ ...prev, resume: error.message }));
                focusFirstError({ resume: true });
                setStatus('idle');
                return;
            }
        }

        const payload = {
            jobSlug: job.slug,
            ...values,
            consent: true,
            resumeTicket,
            resumeName: resume?.name || '',
            company_website: formRef.current?.elements.company_website?.value || '',
            ...readUtm(),
        };

        setStatus('sending');
        try {
            const res = await fetch('/api/careers/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if ((res.ok && data.success) || data.alreadyApplied) {
                finish();
                return;
            }
            if (data.errors) {
                if (data.errors.resume) uploaded.current = null;
                setErrors((prev) => ({ ...prev, ...data.errors }));
                focusFirstError(data.errors);
            }
            setFormError(data.message || 'Something went wrong. Please try again.');
            setStatus('idle');
        } catch {
            setFormError('Network error. Your details are saved here; please try again.');
            setStatus('idle');
        }
    }

    function finish() {
        clearDraft(job.slug);
        markApplied(job.slug);
        setStatus('done');
        onDone?.();
    }

    if (status === 'done' || applied) {
        return (
            <div className="py-6 text-center" role="status">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" aria-hidden="true" />
                <h3 className="mt-3 text-lg font-bold text-slate-900">
                    {status === 'done' ? 'Application sent' : 'You’ve applied for this role'}
                </h3>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-600">{reviewPromise}</p>
                {status === 'done' && (
                    <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">A confirmation is on its way to {values.email}.</p>
                )}
                <Link href="/careers" className="mt-5 inline-block text-sm font-semibold text-blue-600 hover:text-blue-700">
                    See other open roles
                </Link>
            </div>
        );
    }

    const busy = status === 'uploading' || status === 'sending';
    const describedBy = (k) => (errors[k] ? `${k}-error` : undefined);

    return (
        <form ref={formRef} onSubmit={submit} noValidate className="space-y-4">
            <Field id="name" label="Full name" error={errors.name}>
                <input id="name" name="name" autoComplete="name" value={values.name} onChange={setValue('name')} onBlur={validateOnBlur('name')}
                    maxLength={LIMITS.name} className={inputClass(errors.name)} aria-invalid={Boolean(errors.name)} aria-describedby={describedBy('name')} />
            </Field>
            <Field id="email" label="Email" error={errors.email}>
                <input id="email" name="email" type="email" autoComplete="email" inputMode="email" value={values.email} onChange={setValue('email')}
                    onBlur={validateOnBlur('email')} maxLength={LIMITS.email} className={inputClass(errors.email)} aria-invalid={Boolean(errors.email)} aria-describedby={describedBy('email')} />
            </Field>
            <Field id="phone" label="Phone / WhatsApp" error={errors.phone}>
                <input id="phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="98XXXXXXXX" value={values.phone}
                    onChange={setValue('phone')} onBlur={validateOnBlur('phone')} maxLength={20} className={inputClass(errors.phone)} aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy('phone')} />
            </Field>
            <Field id="link" label="LinkedIn or portfolio link" optional error={errors.link}>
                <input id="link" name="link" type="url" inputMode="url" placeholder="linkedin.com/in/yourname" value={values.link}
                    onChange={setValue('link')} onBlur={validateOnBlur('link')} maxLength={LIMITS.link} className={inputClass(errors.link)} aria-invalid={Boolean(errors.link)} aria-describedby={describedBy('link')} />
            </Field>

            <Field id="resume" label="Resume" optional error={errors.resume}>
                {resume ? (
                    <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
                        <FileText className="h-5 w-5 shrink-0 text-blue-600" aria-hidden="true" />
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-slate-800">{resume.name}</p>
                            <p className="text-xs text-slate-500">{formatSize(resume.size)}</p>
                        </div>
                        <button type="button" onClick={removeFile} className="rounded-md p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-800" aria-label="Remove resume">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ) : (
                    <label
                        htmlFor="resume"
                        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => { e.preventDefault(); setDragging(false); pickFile(e.dataTransfer.files?.[0]); }}
                        className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-5 text-center transition ${
                            dragging ? 'border-blue-500 bg-blue-50' : errors.resume ? 'border-red-300' : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
                        }`}
                    >
                        <UploadCloud className="h-6 w-6 text-slate-400" aria-hidden="true" />
                        <span className="mt-1.5 text-sm text-slate-700"><span className="font-semibold text-blue-600">Choose a file</span><span className="hidden sm:inline"> or drag it here</span></span>
                        <span className="mt-0.5 text-xs text-slate-500">PDF only, up to 5 MB. No resume on your phone? Skip it.</span>
                    </label>
                )}
                <input ref={fileInput} id="resume" name="resume" type="file" accept={RESUME_ACCEPT} className="sr-only"
                    onChange={(e) => pickFile(e.target.files?.[0])} aria-describedby={describedBy('resume')} />
            </Field>

            <Field id="note" label="Anything you want us to know?" optional error={errors.note}>
                <textarea id="note" name="note" rows={3} value={values.note} onChange={setValue('note')} onBlur={validateOnBlur('note')}
                    maxLength={LIMITS.note} className={inputClass(errors.note)} aria-invalid={Boolean(errors.note)} aria-describedby={describedBy('note')} />
            </Field>

            {/* Honeypot: hidden from people and screen readers; bots fill it in. */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="company_website">Company website</label>
                <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>

            <label className="flex items-start gap-2.5 text-sm text-slate-600">
                <input type="checkbox" checked={consent} onChange={(e) => { setConsent(e.target.checked); setFormError(''); }}
                    className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <span>
                    I agree that GoRevive may use these details to consider me for this role, as described in the{' '}
                    <Link href="/privacy-policy#job-applicants" target="_blank" className="font-medium text-blue-600 underline-offset-2 hover:underline">privacy policy</Link>.
                </span>
            </label>

            {formError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{formError}</p>}

            <button type="submit" disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {status === 'uploading' ? `Uploading resume… ${progress}%` : status === 'sending' ? 'Sending…' : 'Submit application'}
            </button>
        </form>
    );
}
