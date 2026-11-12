"use client";

import { LogOut } from 'lucide-react';

export default function LogoutButton() {
    async function logout() {
        await fetch('/api/hr/logout', { method: 'POST' }).catch(() => {});
        window.location.replace('/hr/login');
    }
    return (
        <button type="button" onClick={logout} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
        </button>
    );
}
