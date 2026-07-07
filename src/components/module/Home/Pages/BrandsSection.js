"use client";

import React from 'react';
import Link from 'next/link';
import { useDashboard } from '@/components/utils/Context/DashboardContext'; 
import BrandImage from '@/components/utils/UI/BrandImage';

const BrandsSection = () => {
    const { uniqueBrands } = useDashboard();

    if (!uniqueBrands || uniqueBrands.length === 0) return null;
    console.log(uniqueBrands);

    return (
        <section id="brands" className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-[12px] font-bold text-[#1B5E3B] uppercase tracking-[0.2em] mb-3">
                        Shop by Top Brands
                    </h2>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {uniqueBrands.slice(0, 12).map((brand, index) => (
                        <Link 
                            href={`/products?brand=${encodeURIComponent(brand)}`} 
                            key={index} 
                            className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:border-[#1B5E3B]/30 transition-all flex flex-col items-center justify-center text-center group"
                        >
                            <div className="w-16 h-16 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                                <BrandImage type={brand} className="w-full h-full object-contain mix-blend-multiply" />
                            </div>
                            <span className="font-semibold text-gray-900 group-hover:text-[#1B5E3B] transition-colors">
                                {brand}
                            </span>
                        </Link>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Link
                        href="/products"
                        className="inline-flex items-center justify-center gap-2 text-[14px] font-bold text-[#1B5E3B] hover:text-[#2E8B57] transition-colors group"
                    >
                        View All Brands
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default BrandsSection;