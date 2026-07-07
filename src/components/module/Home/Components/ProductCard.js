"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/utils/Context/AuthContext';
import Link from 'next/link';
import api from '@/lib/apiClient';

// Grade -> color. Single source of truth so every place a grade appears
// (image badge, text list) stays consistent.
const GRADE_COLORS = {
    A: '#1B5E3B',
    B: '#2563A8',
    C: '#B4650B',
    D: '#B1401F',
};

export const ProductCard = ({ product }) => {
    const { isAuthenticated } = useAuth();

    const [hasOriginalImages, setHasOriginalImages] = useState(false);

    useEffect(() => {
        if (product?.imei) {
            const checkQcImages = async () => {
                try {
                    const response = await api.get(`/qc?imei=${product.imei}`);
                    if (response.data?.success) {
                        const rawData = response.data.data;
                        const imageRow = rawData.find(item => 'image1' in item);
                        if (imageRow && imageRow.image1 && imageRow.image1.trim() !== "") {
                            setHasOriginalImages(true);
                        }
                    }
                } catch (error) {
                }
            };
            checkQcImages();
        }
    }, [product?.imei]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount).replace(/\s/g, '');
    };

    const hasDiscount = product.mrp > product.startingPrice;
    const discountPercent = hasDiscount ? Math.round(((product.mrp - product.startingPrice) / product.mrp) * 100) : 0;
    const discountAmount = hasDiscount ? (product.mrp - product.startingPrice) : 0;
    const isLowStock = product.totalStock > 0 && product.totalStock <= 5;
    const conditions = product.availableConditions || [];

    return (
        <div className="group relative flex flex-row md:flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_16px_40px_rgba(11,33,54,0.08)] hover:-translate-y-0.5 hover:border-gray-200 transition-all duration-300 h-full">

            <Link
                href={`/products/${product.id}`}
                className="relative w-[38%] md:w-full aspect-square md:aspect-[4/3] bg-[#FAFAF9] flex-shrink-0 flex items-center justify-center p-5 md:p-6 border-r md:border-r-0 md:border-b border-gray-100 overflow-hidden"
            >
                {/* Only claim shown on the image itself: is this the actual unit or not.
                    Grade moved to text below, where it can carry a label and stay legible. */}
                {/* {hasOriginalImages && (
                    <div
                        className="absolute top-2.5 right-2.5 md:top-3 md:right-3 z-10 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#0B2136] shadow-[0_1px_4px_rgba(0,0,0,0.12)]"
                        title="Photos of the actual unit"
                    >
                        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )} */}

                <img
                    src={product.image}
                    alt={product.model}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400/f3f4f6/a1a1aa?text=No+Image'; }}
                />
            </Link>

            <div className="flex flex-col flex-grow p-4 md:p-5 w-[62%] md:w-full">

                <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[#1B5E3B] text-[10px] md:text-[11px] font-bold uppercase tracking-[0.08em]">
                        {product.brand}
                    </span>
                    {isLowStock && (
                        <span className="text-[10px] font-semibold text-[#B1401F] whitespace-nowrap">
                            {product.totalStock} left
                        </span>
                    )}
                </div>

                <Link href={`/products/${product.id}`} className="block mb-2">
                    <h3 className="font-bold text-[#0B2136] text-[13.5px] md:text-[15px] leading-snug line-clamp-2 group-hover:text-[#1B5E3B] transition-colors">
                        {product.model}
                    </h3>
                </Link>

                {/* Grade takes the spot specs used to occupy — specs already live in the title,
                    grade is the one piece of decision-relevant info that didn't have a home. */}
                {conditions.length > 0 && (
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] text-gray-400 font-medium">Grade</span>
                        <div className="flex items-center gap-1">
                            {conditions.map((condition, idx) => (
                                <React.Fragment key={idx}>
                                    {idx > 0 && <span className="text-[10px] text-gray-300">/</span>}
                                    <span
                                        className="text-[11px] font-black"
                                        style={{ color: GRADE_COLORS[condition] || '#6B7280' }}
                                        title={`Grade ${condition}`}
                                    >
                                        {condition}
                                    </span>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo assurance as a plain sentence, not a small icon someone has to decode */}
                <p className={`text-[10.5px] mb-1 ${hasOriginalImages ? 'text-[#1B5E3B] font-medium' : 'text-gray-400'}`}>
                    {hasOriginalImages ? 'Photos of the exact unit you\u2019ll receive' : 'Reference image, not the actual unit'}
                </p>

                <div className="flex-grow" />

                <div className="mt-3 pt-3 border-t border-gray-100">
                    {isAuthenticated ? (
                        <div className="flex flex-col gap-0.5">
                            <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-[19px] md:text-[21px] font-black text-[#0B2136] tracking-tight leading-none">
                                    {formatCurrency(product.startingPrice)}
                                </span>
                                {hasDiscount && (
                                    <span className="text-[12px] md:text-[13px] text-gray-400 line-through font-medium">
                                        {formatCurrency(product.mrp)}
                                    </span>
                                )}
                            </div>
                            {hasDiscount && (
                                <p className="text-[10.5px] text-[#1B5E3B] font-semibold">
                                    Save {formatCurrency(discountAmount)} · {discountPercent}% off
                                </p>
                            )}
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center justify-between gap-2 group/cta"
                        >
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] text-gray-400 font-medium">
                                    {hasDiscount ? `Up to ${discountPercent}% below retail` : 'Trade pricing'}
                                </span>
                                <span className="text-[13px] font-bold text-[#0B2136] group-hover/cta:text-[#1B5E3B] transition-colors">
                                    Login to view price
                                </span>
                            </div>
                            <span className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 group-hover/cta:border-[#1B5E3B] group-hover/cta:bg-[#F0FAF5] transition-colors flex-shrink-0">
                                <svg className="w-3.5 h-3.5 text-[#0B2136] group-hover/cta:text-[#1B5E3B] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    )}
                </div>

            </div>
        </div>
    );
};
