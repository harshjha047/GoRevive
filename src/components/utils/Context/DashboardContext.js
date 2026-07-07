"use client";

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '@/lib/apiClient'; 

const DashboardContext = createContext(undefined);

export const DashboardProvider = ({ children }) => {
    const [bannerData, setBannerData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [uniqueCategories, setUniqueCategories] = useState([]);
    const [uniqueBrands, setUniqueBrands] = useState([]); 
    const [isLoadingBanners, setIsLoadingBanners] = useState(true);
    
    const [isLoading, setIsLoading] = useState(true);

    const hasFetched = useRef(false);

    // Helper function to extract and sort brands properly
    const extractAndSortBrands = (productsArray) => {
        const rawBrands = [...new Set(productsArray.map(p => p.brand).filter(Boolean))];
        const priorityMap = { 'apple': 1, 'dell': 2, 'hp': 3 };
        
        return rawBrands.sort((a, b) => {
            const rankA = priorityMap[a.toLowerCase()] || 99; 
            const rankB = priorityMap[b.toLowerCase()] || 99;
            
            if (rankA !== rankB) {
                return rankA - rankB;
            }
            return a.localeCompare(b);
        });
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const fetchDashboardData = async () => {
            const cachedProducts = sessionStorage.getItem('gorevive_products');
            const cachedBanners = sessionStorage.getItem('gorevive_banners');

            // ==========================================
            // PHASE 1: STALE (Show cached data instantly)
            // ==========================================
            if (cachedProducts && cachedBanners) {
                try {
                    const parsedProducts = JSON.parse(cachedProducts);
                    setProductData(parsedProducts);
                    setBannerData(JSON.parse(cachedBanners));
                    
                    const categories = [...new Set(parsedProducts.map(p => p.category).filter(Boolean))];
                    setUniqueCategories(categories);
                    
                    setUniqueBrands(extractAndSortBrands(parsedProducts));
                    setIsLoadingBanners(false);
                    
                    setIsLoading(false); 
                    
                } catch (e) {
                    console.warn("Cache parse failed, falling back to API entirely", e);
                }
            }

            // ==========================================
            // PHASE 2: REVALIDATE (Fetch fresh data in background)
            // ==========================================
            try {
                const [bannerRes, productRes] = await Promise.all([
                    api.get('/dashboard/banners').catch(() => ({ data: { banners: [] } })),
                    api.get('/products').catch(() => ({ data: { success: false, products: [] } }))
                ]);

                if (bannerRes.data?.banners) {
                    setBannerData(bannerRes.data.banners);
                    sessionStorage.setItem('gorevive_banners', JSON.stringify(bannerRes.data.banners));
                    setIsLoadingBanners(false);
                }

                if (productRes.data?.success && productRes.data?.products) {
                    const freshProducts = productRes.data.products;
                    
                    setProductData(freshProducts);
                    
                    const categories = [...new Set(freshProducts.map(p => p.category).filter(Boolean))];
                    setUniqueCategories(categories);
                    
                    setUniqueBrands(extractAndSortBrands(freshProducts));
                    
                    sessionStorage.setItem('gorevive_products', JSON.stringify(freshProducts));
                }

            } catch (err) {
                console.error("Failed to revalidate dashboard data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const value = {
        bannerData,
        productData, 
        uniqueCategories,
        uniqueBrands, 
        isLoading,
        isLoadingBanners,
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (context === undefined) {
        throw new Error('useDashboard must be used within a DashboardProvider');
    }
    return context;
};