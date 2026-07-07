"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { FilterSidebar } from '@/components/module/Products/Components/FilterSidebar';
import { ProductToolbar } from '@/components/module/Products/Components/ProductToolbar';
import { ProductGrid } from '@/components/module/Products/Components/ProductGrid';
import { useDashboard } from '@/components/utils/Context/DashboardContext';

const ProductsContent = () => {
    const { productData: products = [], isLoading: loading, uniqueCategories } = useDashboard();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();


    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
    const [sort, setSort] = useState('relevance');

    const [filters, setFilters] = useState({
        category: searchParams.getAll('category'),
        brand: searchParams.getAll('brand'),
        search: searchParams.get('search') || '',
    });

    useEffect(() => {
        setFilters({
            category: searchParams.getAll('category'),
            brand: searchParams.getAll('brand'),
            search: searchParams.get('search') || '',
        });
    }, [searchParams]);

    // Centralized URL Updater Logic
    const updateUrlParams = (key, value, isArray = true) => {
        const params = new URLSearchParams(searchParams.toString());
        if (isArray) {
            params.delete(key);
            value.forEach(val => params.append(key, val));
        } else {
            if (value) params.set(key, value);
            else params.delete(key);
        }
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const handleFilterChange = (type, value) => {
        const currentValues = filters[type];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];
        updateUrlParams(type, newValues);
    };

    const handleSearch = (term) => updateUrlParams('search', term, false);

    const clearAllFilters = () => {
        router.replace(pathname, { scroll: false }); 
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...products];
        

        if (filters.category.length > 0) result = result.filter(p => filters.category.includes(p.category));
        if (filters.brand.length > 0) result = result.filter(p => filters.brand.includes(p.brand));
        
        if (filters.search) {
            const term = filters.search.toLowerCase();
            result = result.filter(p =>
                p.model.toLowerCase().includes(term) ||
                p.brand.toLowerCase().includes(term) ||
                (p.category && p.category.toLowerCase().includes(term))
            );
        }

        // FIX: The bundler uses 'startingPrice', not 'price'! 
        if (sort === 'price-asc') result.sort((a, b) => a.startingPrice - b.startingPrice);
        else if (sort === 'price-desc') result.sort((a, b) => b.startingPrice - a.startingPrice);

        return result;
    }, [products, filters, sort]);

    const activeFilterCount = filters.category.length + filters.brand.length + (filters.search ? 1 : 0);
    const uniqueBrands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);

    return (
        <div className="bg-[#F8FAFC] min-h-screen">
            {/* Header */}
            {/* <div className="bg-white border-b border-gray-200 py-8 lg:py-12">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0B2136]">Enterprise Inventory</h1>
                    <p className="text-gray-500 mt-2">Browse our certified, ready-to-deploy IT assets.</p>
                </div>
            </div> */}

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] py-8">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <span className="font-bold text-[#0B2136]">Filters {activeFilterCount > 0 && <span className="bg-[#1B5E3B] text-white px-2 py-0.5 rounded-full text-xs ml-1">{activeFilterCount}</span>}</span>
                    <button onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)} className="flex items-center gap-2 text-sm font-bold text-[#1B5E3B] bg-[#F0FAF5] px-4 py-2 rounded-xl transition-colors">
                        {isMobileFiltersOpen ? 'Close' : 'Filter'}
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <FilterSidebar 
                        filters={filters}
                        uniqueCategories={uniqueCategories}
                        uniqueBrands={uniqueBrands}
                        handleFilterChange={handleFilterChange}
                        clearAllFilters={clearAllFilters}
                        activeFilterCount={activeFilterCount}
                        isMobileFiltersOpen={isMobileFiltersOpen}
                    />

                    <main className="lg:flex-1 w-full">
                        <ProductToolbar 
                            filters={filters}
                            sort={sort}
                            setSort={setSort}
                            handleSearch={handleSearch}
                            removeFilter={handleFilterChange}
                            resultCount={filteredAndSortedProducts.length}
                        />

                        <ProductGrid 
                            products={filteredAndSortedProducts} 
                            loading={loading} 
                            clearAllFilters={clearAllFilters}
                        />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-[#1B5E3B] border-t-transparent rounded-full animate-spin"></div></div>}>
            <ProductsContent />
        </Suspense>
    );
}