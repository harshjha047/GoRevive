"use client";

import { useState, useEffect, useRef } from 'react';
import { ProductSkeleton } from './ProductSkeleton';
import { ProductCard } from '../../Home/Components/ProductCard';

const ITEMS_PER_PAGE = 12;

export const ProductGrid = ({ products, loading, clearAllFilters }) => {
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const observerTarget = useRef(null);

    // Reset pagination to 12 items whenever the filter/sort results change
    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [products]);

    // Infinite Scroll Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleCount < products.length) {
                    // When the user scrolls to the bottom, show 12 more products!
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) observer.unobserve(observerTarget.current);
        };
    }, [visibleCount, products.length]);

    const visibleProducts = products.slice(0, visibleCount);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 flex-1  gap-6">
                {[...Array(6)].map((_, index) => <ProductSkeleton key={index} />)}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm text-center px-4">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>
                <h3 className="text-xl font-extrabold text-[#0B2136] mb-2">No devices found</h3>
                <p className="text-[15px] text-gray-500 max-w-sm mb-8">We couldn't find any inventory matching your exact filters.</p>
                <button onClick={clearAllFilters} className="px-6 py-2.5 bg-[#0B2136] text-white text-[13px] font-bold rounded-xl hover:bg-[#1B5E3B] transition-colors shadow-[0_4px_12px_rgba(11,33,54,0.3)]">
                    Clear all filters
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
            {visibleProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
            
            {/* The Invisible Trigger Element for Infinite Scroll */}
            {visibleCount < products.length && (
                <div ref={observerTarget} className="col-span-full py-8 flex justify-center items-center">
                    <div className="w-8 h-8 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div>
                </div>
            )}
        </div>
    );
};