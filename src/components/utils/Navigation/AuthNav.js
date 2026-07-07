"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../Context/AuthContext';

export const AuthNav = () => {
    const { isAuthenticated, logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    if (isAuthenticated) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    href="/dashboard"
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:text-brand-blue transition-all duration-300"
                >
                    Dashboard
                </Link>
                <button
                    onClick={handleLogout}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-full shadow-md hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                    Logout
                </button>
                {/* <Link 
    href="/logout" 
    className="bg-red-50 text-red-600 font-bold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
>
    Logout
</Link> */}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Link
                href="/login"
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:border-gray-300 hover:text-brand-blue transition-all duration-300"
            >
                Login
            </Link>
            <Link
                href="/login"
                className="px-6 py-2.5 text-sm font-semibold bg-gray-900 text-white bg-brand-blue rounded-full shadow-md hover:bg-brand-blue-dark hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
                Sign Up
            </Link>
        </div>
    );
};