"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/components/utils/Context/DashboardContext';

export const BannerSliderSkeleton = () => {
    return (
        <div className="w-full mx-auto flex flex-col gap-6 mt-4 animate-pulse overflow-hidden">
            {/* Navigators Skeleton */}
            <div className="flex items-center gap-3 overflow-hidden pb-2 pt-2 px-4">
                <div className="h-9 w-20 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
                <div className="h-9 w-36 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
                <div className="h-9 w-24 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
                <div className="h-9 w-40 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
                <div className="h-9 w-28 bg-gray-100 rounded-full flex-shrink-0 border border-gray-200"></div>
            </div>

            {/* Banner Skeleton */}
            <div className="relative w-[90%] md:w-[80%] lg:w-[75%] max-w-7xl m-auto h-[200px] sm:h-[300px] md:h-[400px] lg:h-[460px] bg-gray-100 rounded-3xl border border-gray-200 shadow-sm"></div>

            {/* Controls Skeleton */}
            <div className="relative flex items-center justify-center w-full px-4 mt-2 h-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                </div>
                <div className="absolute right-4 md:right-8 flex gap-3 hidden md:flex">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"></div>
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"></div>
                </div>
            </div>
        </div>
    );
};

export const BannerSlider = () => {
    const { bannerData, isLoadingBanners } = useDashboard(); 

    const navigators = [
        "Offers", "Asset Disposition", "About Us", "Lifecycle Management", 
        "Categories", "Brands", "Featured Products", "Buyback Pipeline", 
        "Environmental Impact", "Process in Action"
    ];

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const slides = bannerData?.map((e, i) => ({
        id: i,
        image: e.bannerUrl, 
        title: "",
        subtitle: "",
        link: e.landing_page === 'info' ? '#' : `/${e.landing_page}`,
        description: "",
        ctaText: ""
    })) || [];

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }, [slides.length]);

    useEffect(() => {
        if (isPaused || slides.length === 0) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 5000); 
        return () => clearInterval(timer);
    }, [isPaused, nextSlide, slides.length]);

    if (isLoadingBanners) return <BannerSliderSkeleton />;
    if (!slides || slides.length === 0) return null;

    const handleSmoothScroll = (e, navTitle) => {
        e.preventDefault(); 
        const targetId = navTitle.toLowerCase().replace(/\s+/g, '-');
        const element = document.getElementById(targetId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div id="offers" className="w-full mx-auto flex flex-col gap-6 mt-6 overflow-x-hidden pb-4">
            
            {/* --- TOP: On-Page Navigators --- */}
             <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-2 px-4 scrollbar-hide snap-x">
                {navigators.map((nav, idx) => (
                    <a 
                        key={idx} 
                        href={`#${nav.toLowerCase().replace(/\s+/g, '-')}`}
                        onClick={(e) => handleSmoothScroll(e, nav)}
                        className="whitespace-nowrap px-5 py-2 rounded-full border border-gray-200 bg-white font-bold text-[13px] tracking-wide hover:text-[#1B5E3B] hover:border-[#1B5E3B]/40 hover:bg-[#F0FAF5] hover:shadow-sm transition-all duration-300 snap-center"
                    >
                        {nav}
                    </a>
                ))}
            </div>

            {/* --- MIDDLE: Carousel Area --- */}
            <div 
                className="relative w-[90%] md:w-full max-w-7xl m-auto md:h-[65vh] h-[20vh] group flex items-center justify-center"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {slides.map((slide, index) => {
                    const isActive = index === currentSlide;
                    const isPrev = index === (currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
                    const isNext = index === (currentSlide === slides.length - 1 ? 0 : currentSlide + 1);

                     let positionClasses = "opacity-0 scale-75 z-0 translate-x-0 pointer-events-none";

                    if (isActive) {
                        positionClasses = "opacity-100 scale-100 z-20 translate-x-0";
                    } else if (isPrev) {
                        positionClasses = "opacity-50 scale-[0.85] z-10 -translate-x-[11%] cursor-pointer";
                    } else if (isNext) {
                        positionClasses = "opacity-50 scale-[0.85] z-10 translate-x-[11%] cursor-pointer";
                    }

                    return (
                        <div 
                            key={slide.id} 
                            onClick={() => {
                                if (isPrev) prevSlide();
                                if (isNext) nextSlide();
                            }}
                            className={`absolute left-0 right-0 mx-auto w-[100%] h-full rounded-3xl overflow-hidden transition-all duration-700 ease-in-out shadow-2xl ${positionClasses}`}
                        >
                            <img 
                                src={slide.image} 
                                alt={`Promotional Banner ${index + 1}`} 
                                className="w-full h-full object-cover" 
                            />
                            {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div> */}

                        </div>
                    );
                })}
            </div>

            {/* --- BOTTOM: Controls Layout --- */}
            <div className="relative flex items-center justify-center w-full px-4 mt-4 max-w-[1800px] mx-auto">
                
                {/* Center Dots */}
                <div className="flex items-center gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide 
                                    ? 'w-8 h-2 bg-gray-800' 
                                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Absolute Right: Next/Prev Buttons */}
                <div className="absolute right-4 md:right-8 hidden md:flex gap-3">
                    <button 
                        onClick={prevSlide}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-black"
                        aria-label="Previous slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm text-gray-500 hover:text-black"
                        aria-label="Next slide"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

        </div>
    );
};