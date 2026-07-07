"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icon } from './Icons/Icon';

export const SearchBar = ({ className = '', onSearch }) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const [term, setTerm] = useState(searchParams.get('search') || '');

    const onSearchRef = useRef(onSearch);
    const searchParamsRef = useRef(searchParams);

    useEffect(() => {
        onSearchRef.current = onSearch;
    }, [onSearch]);

    useEffect(() => {
        searchParamsRef.current = searchParams;
    }, [searchParams]);

    // Sync input when URL parameter changes externally
    useEffect(() => {
        const urlTerm = searchParams.get('search') || '';
        if (urlTerm !== term) {
            setTerm(urlTerm);
        }
    }, [searchParams]);

    // Debounced search logic
    useEffect(() => {
        const timer = setTimeout(() => {
            const currentUrlTerm = searchParamsRef.current.get('search') || '';

            if (term !== currentUrlTerm) {
                if (term.trim()) {
                    router.replace(`/products?search=${encodeURIComponent(term.trim())}`);
                } else {
                    router.replace(`/products`);
                }
                if (onSearchRef.current) onSearchRef.current();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [term, router]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (term.trim()) {
            router.push(`/products?search=${encodeURIComponent(term.trim())}`);
            if (onSearchRef.current) onSearchRef.current();
        }
    };

    const clearSearch = () => {
        setTerm('');
        router.replace('/products');
        if (onSearchRef.current) onSearchRef.current();
    };

    return (
        <form onSubmit={handleSearch} className={`relative group ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Icon
                    type="search"
                    className="h-4 w-4 text-gray-400 group-focus-within:text-brand-blue transition-colors duration-300"
                />
            </div>
            <input
                type="text"
                className="block w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200/80 rounded-full text-sm text-gray-900 placeholder-gray-400 hover:bg-gray-100/50 focus:bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15 transition-all duration-300 outline-none"
                placeholder="Search products..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />

            {term && (
                <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-1.5 pr-2 flex items-center text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    aria-label="Clear search"
                >
                    <div className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <Icon type="close" className="h-3.5 w-3.5" />
                    </div>
                </button>
            )}
        </form>
    );
};