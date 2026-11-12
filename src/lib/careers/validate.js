// Application field rules, shared by the form (inline errors) and the API
// (the source of truth). Each validator returns an error message or ''.

export const LIMITS = {
    name: 80,
    email: 120,
    link: 200,
    note: 1000,
    resumeBytes: 5 * 1024 * 1024, // 5 MB (uploaded straight to Cloudinary, not through our API)
};

export const RESUME_ACCEPT = '.pdf,application/pdf';

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[a-z]{2,}$/i;

/** Indian numbers -> 10 digits; other countries keep their code (8–15 digits). */
export function normalizePhone(value) {
    const raw = String(value || '').trim();
    const digits = raw.replace(/\D/g, '');
    if (raw.startsWith('+') && !digits.startsWith('91')) return `+${digits}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
    if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
    return digits;
}

export const validators = {
    name(v) {
        const s = String(v || '').trim();
        if (s.length < 2) return 'Please enter your full name.';
        if (s.length > LIMITS.name) return `Name must be under ${LIMITS.name} characters.`;
        return '';
    },
    email(v) {
        const s = String(v || '').trim();
        if (!s) return 'Please enter your email.';
        if (s.length > LIMITS.email || !EMAIL_RE.test(s)) return 'Please enter a valid email address.';
        return '';
    },
    phone(v) {
        const p = normalizePhone(v);
        if (!p) return 'Please enter your phone or WhatsApp number.';
        if (p.startsWith('+')) return p.length >= 9 && p.length <= 16 ? '' : 'Please enter a valid phone number.';
        return /^[6-9]\d{9}$/.test(p) ? '' : 'Please enter a valid 10-digit mobile number.';
    },
    link(v) {
        const s = String(v || '').trim();
        if (!s) return '';
        if (s.length > LIMITS.link) return 'That link is too long.';
        try {
            const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
            return u.hostname.includes('.') ? '' : 'Please enter a valid link.';
        } catch {
            return 'Please enter a valid link.';
        }
    },
    note(v) {
        return String(v || '').length > LIMITS.note ? `Please keep this under ${LIMITS.note} characters.` : '';
    },
    resume(file) {
        if (!file) return '';
        if (!/\.pdf$/i.test(file.name || '') || (file.type && file.type !== 'application/pdf')) return 'Please upload a PDF file.';
        if (file.size > LIMITS.resumeBytes) return 'Resume must be under 5 MB.';
        return '';
    },
};

/** Adds https:// to "linkedin.com/in/x" so it is stored as a usable URL. */
export const normalizeLink = (v) => {
    const s = String(v || '').trim();
    if (!s) return '';
    return /^https?:\/\//i.test(s) ? s : `https://${s}`;
};
