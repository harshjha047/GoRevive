"use client";

import React from 'react';
import Link from 'next/link';
import { useDashboard } from '@/components/utils/Context/DashboardContext';
import CatogeryImage from '@/components/utils/UI/CatogeryImage';

const CategoriesSection = () => {
    const { uniqueCategories } = useDashboard();

    // console.log(uniqueCategories);

    return (
        <section id="categories" className="py-16 bg-[#F7FAF8]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-[12px] font-bold text-[#1B5E3B] uppercase tracking-[0.2em] mb-3">
                        Discover by Category
                    </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {uniqueCategories.slice(0, 12).map((category, index) => (
                        <Link 
                            href={`/products?category=${encodeURIComponent(category)}`} 
                            key={index} 
                            className="bg-white p-6 rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center group"
                        >
                            <div className="w-14 h-14 bg-blue-50 text-[#0B2136] flex items-center justify-center mb-4 group-hover:bg-[#0B2136] group-hover:text-white transition-colors rounded-full">
                                <CatogeryImage type={category?.toLowerCase()} className="w-full h-full" />
                            </div>
                            <span className="font-semibold text-gray-900">{category}</span>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 text-[14px] font-bold text-[#1B5E3B] hover:text-[#2E8B57] transition-colors group"
                    >
                        View Complete Inventory
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default CategoriesSection;