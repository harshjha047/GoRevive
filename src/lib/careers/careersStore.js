"use client";

import { useSyncExternalStore } from 'react';

// Browser-only memory for the careers page:
//   - which roles this browser has applied to ("Applied ✓" badges)
//   - a half-filled form per role, so a reload or a mistake loses nothing
//   - the UTM tags of the visit, sent with the application
// Resumes are never stored here, and the draft is deleted once submitted.

const APPLIED_KEY = 'gorevive_careers_applied';
const draftKey = (slug) => `gorevive_careers_draft_${slug}`;
const UTM_KEY = 'gorevive_careers_utm';
const EMPTY = Object.freeze([]);
const listeners = new Set();
let cache = { raw: undefined, slugs: EMPTY };

const safeGet = (storage, key) => {
    try {
        return window[storage].getItem(key);
    } catch {
        return null;
    }
};
const safeSet = (storage, key, value) => {
    try {
        if (value === null) window[storage].removeItem(key);
        else window[storage].setItem(key, value);
    } catch {
        /* storage blocked */
    }
};

function readApplied() {
    if (typeof window === 'undefined') return EMPTY;
    const raw = safeGet('localStorage', APPLIED_KEY);
    if (raw === cache.raw) return cache.slugs;
    let slugs = EMPTY;
    try {
        const parsed = JSON.parse(raw || '[]');
        if (Array.isArray(parsed)) slugs = Object.freeze(parsed.map(String));
    } catch {
        /* corrupt value */
    }
    cache = { raw, slugs };
    return slugs;
}

export function markApplied(slug) {
    const next = [...new Set([...readApplied(), slug])].slice(-100);
    safeSet('localStorage', APPLIED_KEY, JSON.stringify(next));
    listeners.forEach((l) => l());
}

function subscribe(listener) {
    listeners.add(listener);
    const onStorage = (e) => e.key === APPLIED_KEY && listener();
    window.addEventListener('storage', onStorage);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('storage', onStorage);
    };
}

/** Slugs of roles applied to from this browser. */
export const useAppliedSlugs = () => useSyncExternalStore(subscribe, readApplied, () => EMPTY);

export function loadDraft(slug) {
    try {
        const parsed = JSON.parse(safeGet('localStorage', draftKey(slug)) || 'null');
        return parsed && typeof parsed === 'object' ? parsed : null;
    } catch {
        return null;
    }
}

export const saveDraft = (slug, values) => safeSet('localStorage', draftKey(slug), JSON.stringify(values));
export const clearDraft = (slug) => safeSet('localStorage', draftKey(slug), null);

/** Remembers the visit's UTM tags for this tab (first landing wins). */
export function captureUtm() {
    if (typeof window === 'undefined' || safeGet('sessionStorage', UTM_KEY)) return;
    const p = new URLSearchParams(window.location.search);
    const utm = {
        utm_source: p.get('utm_source') || '',
        utm_medium: p.get('utm_medium') || '',
        utm_campaign: p.get('utm_campaign') || '',
        referrer: document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : '',
    };
    safeSet('sessionStorage', UTM_KEY, JSON.stringify(utm));
}

export function readUtm() {
    try {
        return JSON.parse(safeGet('sessionStorage', UTM_KEY) || '{}') || {};
    } catch {
        return {};
    }
}
