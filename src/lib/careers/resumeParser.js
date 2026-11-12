"use client";

import { normalizePhone } from './validate';

// Reads a PDF resume in the browser (nothing is sent anywhere) and picks out
// the fields we can find reliably: email, phone, a profile link and, usually,
// the name. Used only to pre-fill empty form fields; the candidate checks them.
//
// pdf.js (~1 MB) is loaded only when a candidate picks a file. The legacy build
// is used because it supports the older Safari versions in browserslist.

const MAX_PAGES = 2;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
// Indian mobiles (+91 / 0 prefix, spaces or dashes), else a generic international number.
const IN_PHONE_RE = /(?:\+?91[\s-]?|0)?[6-9]\d{2}[\s-]?\d{3}[\s-]?\d{4}\b|(?:\+?91[\s-]?|0)?[6-9]\d{4}[\s-]?\d{5}\b/;
const INTL_PHONE_RE = /\+\d{1,3}[\s-]?\(?\d{1,4}\)?(?:[\s-]?\d{2,4}){2,4}/;
const URL_RE = /\b(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+(?:\.[a-z0-9-]+)*\.[a-z]{2,}(?:\/[^\s)\]}>,;]*)?/gi;
const NAME_WORD = /^[A-Z][A-Za-z'’.-]*$/;
const NOT_A_NAME = /resume|curriculum|vitae|\bcv\b|profile|summary|objective|contact|email|phone|mobile|address|linkedin|experience|education|skills/i;

let pdfjsPromise = null;
function loadPdfjs() {
    if (!pdfjsPromise) {
        pdfjsPromise = import('pdfjs-dist/legacy/build/pdf.mjs').then((pdfjs) => {
            pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/legacy/build/pdf.worker.min.mjs', import.meta.url).toString();
            return pdfjs;
        });
        pdfjsPromise.catch(() => {
            pdfjsPromise = null;
        });
    }
    return pdfjsPromise;
}

/** Groups pdf.js text items into lines (same baseline), top to bottom. */
function toLines(items) {
    const rows = new Map();
    for (const it of items) {
        if (!it.str || !it.str.trim()) continue;
        const y = Math.round(it.transform[5]);
        const size = Math.abs(it.transform[3]) || it.height || 0;
        const row = rows.get(y) || { y, parts: [], size: 0 };
        row.parts.push({ x: it.transform[4], str: it.str });
        row.size = Math.max(row.size, size);
        rows.set(y, row);
    }
    return [...rows.values()]
        .sort((a, b) => b.y - a.y)
        .map((r) => ({
            text: r.parts.sort((a, b) => a.x - b.x).map((p) => p.str).join(' ').replace(/\s+/g, ' ').trim(),
            size: r.size,
        }))
        .filter((l) => l.text);
}

const titleCase = (s) => s.toLowerCase().replace(/(^|[\s'’.-])([a-z])/g, (m, p, c) => p + c.toUpperCase());

function looksLikeName(text) {
    const t = text.replace(/[|•·,]+.*$/, '').trim(); // "Ravi Kumar | Marketing" -> "Ravi Kumar"
    if (t.length < 4 || t.length > 40 || /\d|@/.test(t) || NOT_A_NAME.test(t)) return null;
    const words = (t === t.toUpperCase() ? titleCase(t) : t).split(/\s+/);
    if (words.length < 2 || words.length > 4 || !words.every((w) => NAME_WORD.test(w))) return null;
    return words.join(' ');
}

/** The name is usually the biggest text near the top of page 1. */
function findName(lines) {
    const top = lines.slice(0, 12);
    const bySize = [...top].sort((a, b) => b.size - a.size);
    for (const l of bySize.slice(0, 3)) {
        const n = looksLikeName(l.text);
        if (n) return n;
    }
    for (const l of top) {
        const n = looksLikeName(l.text);
        if (n) return n;
    }
    return '';
}

function pickLink(urls) {
    const clean = urls
        .map((u) => u.replace(/[.)]+$/, ''))
        .filter((u) => !/^mailto:/i.test(u) && !EMAIL_RE.test(u.replace(/^https?:\/\//, '')));
    const score = (u) => (/linkedin\.com\/in\//i.test(u) ? 3 : /github\.com\/|behance\.net|dribbble\.com/i.test(u) ? 2 : 1);
    const best = clean.sort((a, b) => score(b) - score(a))[0] || '';
    if (!best) return '';
    return /^https?:\/\//i.test(best) ? best : `https://${best}`;
}

/**
 * Returns { name, email, phone, link } with '' for anything not found.
 * Never throws: an unreadable PDF just returns empty fields.
 */
export async function extractResumeFields(file) {
    const empty = { name: '', email: '', phone: '', link: '' };
    try {
        const pdfjs = await loadPdfjs();
        const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false }).promise;
        const lines = [];
        const urls = [];
        for (let p = 1; p <= Math.min(doc.numPages, MAX_PAGES); p += 1) {
            const page = await doc.getPage(p);
            const content = await page.getTextContent();
            lines.push(...toLines(content.items));
            for (const a of await page.getAnnotations()) {
                if (a.url) urls.push(a.url);
            }
        }
        await doc.destroy();

        const text = lines.map((l) => l.text).join('\n');
        const mailto = urls.find((u) => /^mailto:/i.test(u));
        const email = (text.match(EMAIL_RE)?.[0] || mailto?.replace(/^mailto:/i, '').split('?')[0] || '').toLowerCase();

        const phoneRaw = text.match(IN_PHONE_RE)?.[0] || text.match(INTL_PHONE_RE)?.[0] || '';
        const phone = phoneRaw ? normalizePhone(phoneRaw) : '';

        const textUrls = (text.match(URL_RE) || []).filter((u) => /\//.test(u) || /^www\./i.test(u) || /linkedin|github/i.test(u));
        const link = pickLink([...urls.filter((u) => /^https?:/i.test(u)), ...textUrls]);

        return { name: lines.length ? findName(lines) : '', email, phone, link };
    } catch (error) {
        console.warn('Resume auto-fill skipped:', error?.message);
        return empty;
    }
}
