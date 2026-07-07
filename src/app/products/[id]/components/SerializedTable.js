"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/utils/Context/AuthContext';
import { useCart } from '@/components/utils/Context/CartContext';
import { ClipboardList, ClipboardPenLine } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount).replace(/\s/g, '');

export default function SerializedTable({ matchingUnits }) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart, cartItems } = useCart();
    const [addingToCart, setAddingToCart] = useState(null);
    const [showMobileSerial, setShowMobileSerial] = useState(null);

    const handleAddToCart = async (unit) => {
        setAddingToCart(unit.id);
        await new Promise(resolve => setTimeout(resolve, 300));
        addToCart(unit, 1);
        setAddingToCart(null);
    };

    const handleQuickAdd = async (unit, redirect = false) => {
        try {
            await handleAddToCart(unit);
            if (redirect) {
                router.push('/cart');
            }
        } catch (error) {
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mt-4 shadow-sm transition-shadow hover:shadow-md">
            {/* Enhanced Header Area */}
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-[15px]">Available Units in Warehouse</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Real-time inventory updates</p>
                    </div>
                </div>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-2 w-fit border border-emerald-200/50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm"></span>
                    {matchingUnits.length} Ready to Dispatch
                </span>
            </div>

            {/* Enhanced Empty State */}
            {matchingUnits.length === 0 ? (
                <div className="p-12 text-center bg-white flex flex-col items-center justify-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    </div>
                    <p className="text-lg font-bold text-gray-700">Configuration Out of Stock</p>
                    <p className="text-sm text-gray-500 mt-1 max-w-sm leading-relaxed">
                        We currently don't have this exact specification in our warehouse.
                        Try selecting a different Grade or Spec, or check back soon for new inventory.
                    </p>
                </div>
            ) : !isAuthenticated ? (
                /* Enhanced Auth Gate (Blurred State) */
                <div className="relative bg-white min-h-[300px]">
                    <div className="flex flex-col blur-[5px] opacity-40 select-none pointer-events-none p-6">
                        {/* Mock Table Header */}
                        <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-200 pb-3 mb-3">
                            <span>Serial No / IMEI</span>
                            <span>B2B Price</span>
                            <span>Action</span>
                        </div>
                        {/* Mock Rows with better styling */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-0 animate-pulse">
                                <span className="font-mono text-gray-400 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                                    XXXXXX{i}ABC
                                </span>
                                <span className="font-bold text-gray-300 text-lg">₹XX,XXX</span>
                                <div className="px-8 py-2.5 bg-gray-100 rounded-lg w-28 h-9"></div>
                            </div>
                        ))}
                    </div>

                    {/* Enhanced Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-sm p-6 text-center">
                        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-200/50 max-w-sm">
                            <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">B2B Access Required</h4>
                            <p className="text-sm text-gray-600 mb-6">Login to view serial numbers and wholesale pricing</p>
                            <button
                                onClick={() => router.push('/login')}
                                className="group w-full flex items-center justify-center gap-2 bg-indigo-600 text-white text-sm font-semibold uppercase tracking-wide px-8 py-3.5 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-200 ease-in-out hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
                            >
                                <svg className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Login to Continue
                            </button>
                            <p className="text-xs text-gray-500 mt-4 flex items-center justify-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                Verified B2B Buyers Only
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white">
                    <div className="">
                        {matchingUnits.map((unit) => {
                            const isInCart = cartItems?.some(item => item.product.id === unit.id);
                            const hasDiscount = unit.mrp > unit.price;
                            const discountAmt = hasDiscount ? (unit.mrp - unit.price) : 0;
                            const isLoading = addingToCart === unit.id;

                            return (
                                <div key={unit.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <span className="font-mono font-semibold text-gray-600 bg-gray-100 px-2.5 py-1.5 rounded-md border border-gray-200 text-xs tracking-tight">
                                                {unit.serialNumber || unit.id}
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="font-extrabold text-gray-900 text-lg">
                                                {formatCurrency(unit.price)}
                                            </span>
                                            {hasDiscount && (
                                                <div className="flex items-center gap-2 mt-1 justify-end">
                                                    <span className="text-xs text-gray-400 line-through">
                                                        {formatCurrency(unit.mrp)}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                                                        Save {formatCurrency(discountAmt)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className='flex gap-3'>
                                        <button
                                            onClick={() => handleAddToCart(unit)}
                                            disabled={isInCart || isLoading}
                                            className={` flex-1 cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 ease-in-out ${isInCart
                                                    ? 'bg-emerald-50 text-emerald-600 cursor-not-allowed'
                                                    : isLoading
                                                        ? 'bg-gray-100 text-gray-400 cursor-wait'
                                                        : 'border border-black text-g600 overflow-hidden rounded-full '
                                                }`}
                                        >
                                            {isInCart ? (
                                                <span className="flex items-center gap-1.5">
                                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Added to Cart
                                                </span>
                                            ) : isLoading ? (
                                                <span className="flex items-center gap-2">
                                                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                    </svg>
                                                    Adding...
                                                </span>
                                            ) : 'Add to Cart'}
                                        </button>
                                        {!isInCart && (
                                            <button
                                                onClick={() => handleQuickAdd(unit, true)}
                                                disabled={isLoading}

                                                className=' flex-1 border bg-[#06002c] text-white hover:bg-green-600 cursor-pointer inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 ease-in-out'>
                                                Buy Now
                                            </button>
                                        )}
                                        <Link
                                        href={`/qc/${unit.serialNumber || unit.id}`}
                                            // onClick={() => {}}
                                         className=' cursor-pointer aspect-square justify-center items-center flex '>
                                            <ClipboardList strokeWidth={1} />
                                        </Link>

                                    </div>


                                </div>
                            );
                        })}
                    </div>


                    <div className="bg-gradient-to-r from-emerald-50/50 to-white px-6 py-4 border-t border-emerald-100">
                        <div className="flex items-start sm:items-center justify-between gap-4">
                            <div className="flex items-start sm:items-center gap-3 flex-1">
                                <div className="bg-emerald-100 p-2 rounded-lg shrink-0 mt-0.5 sm:mt-0">
                                    <svg className="w-4 h-4 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-emerald-800 text-xs sm:text-sm font-medium leading-relaxed">
                                        <strong className="font-bold">Pro Tip:</strong> Buy 10+ total units to unlock an automatic
                                        <span className="font-bold text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded mx-1">3% bulk discount</span>
                                        on your entire order.
                                    </p>
                                </div>
                            </div>
                            <a href="#" className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 transition-colors whitespace-nowrap">
                                View all offers
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}