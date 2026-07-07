"use client";

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/utils/Context/AuthContext';
import { useCart } from '@/components/utils/Context/CartContext';
import toast from 'react-hot-toast';

export default function LogoutPage() {
    const router = useRouter();
    
    const { logout } = useAuth(); 
    const { clearCart } = useCart(); 

    const hasLoggedOut = useRef(false);

    useEffect(() => {
        if (hasLoggedOut.current) return;
        hasLoggedOut.current = true;

        const performSecureLogout = async () => {
            try {
                if (clearCart) {
                    clearCart();
                }

                if (logout) {
                    await logout();
                }

                toast.success("Successfully logged out");
                router.replace('/login'); 

            } catch (error) {
                console.error("Logout sequence failed:", error);
                router.replace('/login');
            }
        };

        const timer = setTimeout(() => {
            performSecureLogout();
        }, 800);

        return () => clearTimeout(timer);
    }, [logout, clearCart, router]);

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center pb-20">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center max-w-sm w-full mx-4">
                
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                    <svg className="w-8 h-8 text-[#0B2136]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h1 className="text-xl font-bold text-[#0B2136] mb-2">Securely logging out</h1>
                <p className="text-sm text-gray-500 mb-8">Clearing your session data and B2B pricing...</p>
                
                <div className="w-8 h-8 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div>
            </div>
        </div>
    );
}