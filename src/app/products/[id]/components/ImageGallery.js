"use client";

import React, { useState, useEffect } from 'react';


export default function ImageGallery({ mainImage, setMainImage, galleryImages, altText = "Product preview" }) {
    const [isLoading, setIsLoading] = useState(true);

    const displayImage = mainImage || galleryImages?.[0];


    useEffect(() => {
        setIsLoading(true);
        if(displayImage){
            setIsLoading(false);
        }
    }, [mainImage]);


    return (
        <div className="sticky top-24 flex flex-col gap-4 w-full max-w-2xl">
            <div className="relative rounded-lg shadow-2xl shadow-white bg-white aspect-square flex items-center justify-center p-6 sm:p-12">
                {isLoading && (
                    <div className="absolute inset-0 bg-gray-50/80 animate-pulse z-20" />
                )}
                
                <img 
                    src={displayImage} 
                    alt={altText} 
                    onLoad={() => setIsLoading(false)}
                    onError={(e) => { 
                        e.target.src = galleryImages?.[0]; 
                        setIsLoading(false);
                    }}
                    className={`w-full max-h-full  object-cover mix-blend-multiply transition-opacity duration-200 ease-in-out z-10 
                        `}

                    loading="lazy"
                />
            </div>

            {galleryImages?.length > 1 && (
                <div 
                    className="flex gap-2.5 overflow-x-auto pb-1.5 gap-4 scroll-smooth snap-x snap-mandatory" 
                    style={{ scrollbarWidth: 'thin' }}
                >
                    {galleryImages.map((img, idx) => {
                        const isSelected = mainImage === img;
                        return (
                            <button 
                                key={idx}
                                type="button"
                                aria-pressed={isSelected}
                                aria-label={`Select product image ${idx + 1}`}
                                onClick={() => setMainImage(img)}
                                className={`relative flex-shrink-0 shadow snap-start h-20  sm:w-20 sm:h-20 bg-white rounded-md flex items-center justify-center p-2 transition-all duration-150 focus:outline-none ${
                                    isSelected 
                                    ? 'border-[#0B2136] ' 
                                    : 'border-gray-200 opacity-70 shadow-md inset-shadow hover:opacity-100 hover:border-gray-400'
                                }`}
                            >
                                <img 
                                    src={img || FALLBACK_IMAGE} 
                                    alt={`${altText} thumbnail ${idx + 1}`} 
                                    className=" object-cover max-h-full w-full overflow-hidden mix-blend-multiply"
                                    loading="lazy"
                                    onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}