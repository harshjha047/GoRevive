"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeaturedProducts } from '@/services/productService';
import { ProductCard } from '../Components/ProductCard';

export const FeaturedProductsSection = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            const data = await getFeaturedProducts();
            setProducts(data);
            setIsLoading(false);
        };
        
        fetchProducts();
    }, []);

    return (
        <section id="featured-products" className="bg-gray-50 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                
                {/* Header */}
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-[#0B2136]">Featured Products</h2>
                        <p className="text-gray-500 mt-2 text-sm">Top enterprise devices available in bulk.</p>
                    </div>
                    <Link href="/products" className="text-[#1B5E3B] font-bold hover:text-[#22C55E] transition-colors flex items-center gap-2 mb-2">
                        View All Inventory
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {isLoading ? (
                        // Loading Skeletons
                        Array(4).fill(0).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl h-[380px] border border-gray-100 animate-pulse flex flex-col p-4">
                                <div className="w-full h-48 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
                                <div className="mt-auto flex justify-between">
                                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                                </div>
                            </div>
                        ))
                    ) : products.length > 0 ? (
                        // Render Actual Products
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        // Fallback if empty
                        <div className="col-span-full text-center py-12 text-gray-500">
                            No featured products currently available.
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
};