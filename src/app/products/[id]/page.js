"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDashboard } from '@/components/utils/Context/DashboardContext';
import { useAuth } from '@/components/utils/Context/AuthContext';
import { useCart } from '@/components/utils/Context/CartContext';
import api from '@/lib/apiClient';
import toast from 'react-hot-toast';

import ImageGallery from './components/ImageGallery';
import Configurator from './components/Configurator';
import SerializedTable from './components/SerializedTable';
import DetailedSpecs from './components/DetailedSpecs';

// Format Helper
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace(/\s/g, '');

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const productId = decodeURIComponent(params.id);

    const { productData, isLoading: isDashboardLoading } = useDashboard();
    const { isAuthenticated } = useAuth();
    const { addToCart, addMultipleToCart, cartItems } = useCart();

    const [baseProduct, setBaseProduct] = useState(null);
    const [familyUnits, setFamilyUnits] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);

    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSpecs, setSelectedSpecs] = useState({});
    
    // Quick Order State
    const [quickQty, setQuickQty] = useState(1);

    // ==========================================
    // 1. DATA INITIALIZATION
    // ==========================================
    useEffect(() => {
        if (isDashboardLoading) return;

        const initialProduct = productData?.find(bundle => 
            bundle.id === productId || bundle.model_code === productId
        );

        if (!initialProduct) {
            setIsPageLoading(false);
            return;
        }

        setBaseProduct(initialProduct);
        setMainImage(initialProduct.image);

        const fetchDetailedInventory = async () => {
            try {
                const response = await api.post('/products/details', { 
                    modelCode: initialProduct.model_code || initialProduct.id 
                });
                
                if (response.data?.success && response.data?.units) {
                    setFamilyUnits(response.data.units);
                }
            } catch (error) {
                console.error("Failed to load serialized inventory:", error);
            } finally {
                setIsPageLoading(false);
            }
        };

        fetchDetailedInventory();
    }, [productId, productData, isDashboardLoading]);

    // ==========================================
    // 2. EXTRACT OPTIONS
    // ==========================================
    const availableGrades = useMemo(() => {
        const grades = new Set();
        familyUnits.forEach(u => grades.add(u.condition));
        return Array.from(grades).sort();
    }, [familyUnits]);

    const specOptions = useMemo(() => {
        const options = {};
        familyUnits.forEach(u => {
            if (u.specs) {
                Object.entries(u.specs).forEach(([key, value]) => {
                    if (!value || value === "/" || value === "N/A") return;
                    if (!options[key]) options[key] = new Set();
                    options[key].add(String(value));
                });
            }
        });
        
        const varyingSpecs = {};
        Object.keys(options).forEach(key => varyingSpecs[key] = Array.from(options[key]).sort());
        return varyingSpecs;
    }, [familyUnits]);

    // Auto-select initial options
    useEffect(() => {
        if (availableGrades.length > 0 && !selectedGrade) setSelectedGrade(availableGrades[0]);
        if (Object.keys(specOptions).length > 0 && Object.keys(selectedSpecs).length === 0) {
            const initial = {};
            Object.keys(specOptions).forEach(k => initial[k] = specOptions[k][0]);
            setSelectedSpecs(initial);
        }
    }, [availableGrades, specOptions, selectedGrade, selectedSpecs]);

    // ==========================================
    // 3. MATCHING LOGIC & QUICK ADD
    // ==========================================
    const matchingUnits = useMemo(() => {
        return familyUnits.filter(unit => {
            if (unit.condition !== selectedGrade) return false;
            if (unit.specs) {
                for (const [key, selectedValue] of Object.entries(selectedSpecs)) {
                    if (unit.specs[key] && String(unit.specs[key]) !== selectedValue) return false;
                }
            }
            return true;
        });
    }, [familyUnits, selectedGrade, selectedSpecs]);

    const representativeUnit = matchingUnits.length > 0 ? matchingUnits[0] : familyUnits[0];

    // Filter out units that the user already has in their cart
    const availableMatchingUnits = useMemo(() => {
        if (!cartItems) return matchingUnits;
        const cartIds = new Set(cartItems.map(item => item.product.id));
        return matchingUnits.filter(u => !cartIds.has(u.id));
    }, [matchingUnits, cartItems]);

    

    const handleQuickAdd = async (redirect = false) => {
        if (availableMatchingUnits.length < quickQty) {
            toast.error(`Only ${availableMatchingUnits.length} unallocated units available.`, { position: 'bottom-center' });
            return;
        }
        
        try {
            if (quickQty === 1) {
                await addToCart(availableMatchingUnits[0], 1);
            } else {
                const unitsToAdd = availableMatchingUnits.slice(0, quickQty);
                await addMultipleToCart(unitsToAdd);
            }
            // toast.success('Added to order!', { id: toastId });
            setQuickQty(1); 

            if (redirect) {
                router.push('/cart');
            }
        } catch (error) {
            // toast.error('Failed to allocate units.', { id: toastId });
        }
    };

    // ==========================================
    // RENDER STATES
    // ==========================================
    if (isDashboardLoading || isPageLoading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-20">
                <div className="w-10 h-10 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!baseProduct) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-20">
                <h1 className="text-3xl font-extrabold text-[#0B2136] mb-2">Device Not Found</h1>
                <button onClick={() => router.push('/products')} className="px-6 py-3 bg-[#0B2136] text-white font-bold rounded-xl mt-4 hover:bg-[#1B5E3B] transition-colors">
                    Back to Inventory
                </button>
            </div>
        );
    }

    const galleryImages = baseProduct.images || [baseProduct.image, baseProduct.secondaryImage].filter(Boolean);
    const hasDiscount = representativeUnit?.mrp > representativeUnit?.price;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24">
            <div className="container mx-auto px-4 max-w-[1200px] py-8 lg:py-12">
                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
                    
                    <div className="lg:w-[45%] relative">
                        <ImageGallery 
                            mainImage={mainImage} 
                            setMainImage={setMainImage} 
                            galleryImages={galleryImages} 
                            altText={baseProduct.model} 
                        />
                    </div>

                    <div className="lg:w-[55%] flex flex-col">
                        <div className="mb-6">
                            <span className="inline-block text-[#1B5E3B] text-xs font-black uppercase tracking-widest mb-2">
                                {baseProduct.brand} • {baseProduct.category}
                            </span>
                            <h1 className="text-2xl lg:text-3xl font-extrabold text-[#0B2136] leading-tight mb-4">
                                {baseProduct.model}
                            </h1>
                        </div>

                        <Configurator 
                            availableGrades={availableGrades}
                            specOptions={specOptions}
                            selectedGrade={selectedGrade}
                            setSelectedGrade={setSelectedGrade}
                            selectedSpecs={selectedSpecs}
                            setSelectedSpecs={setSelectedSpecs}
                        />

                        {/* ==========================================
                            QUICK ACTION / BULK ORDER BLOCK
                            ========================================== */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
                            {isAuthenticated ? (
                                <div>
                                    <div className="flex justify-between items-end mb-6">
                                        <div>
                                            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">B2B Base Price</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl font-black text-[#0B2136] tracking-tight">
                                                    {formatCurrency(representativeUnit?.price || 0)}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-sm font-bold text-gray-400 line-through">
                                                        {formatCurrency(representativeUnit.mrp)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`text-xs font-bold px-3 py-1 rounded-md ${availableMatchingUnits.length > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                                                {availableMatchingUnits.length} Ready to Auto-Allocate
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-4">
                                        {/* Quantity Selector */}
                                        <div className="flex items-center border border-gray-300 rounded-xl h-14 w-full sm:w-36 overflow-hidden">
                                            <button 
                                                onClick={() => setQuickQty(Math.max(1, quickQty - 1))} 
                                                className="px-4 h-full text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                                            >−</button>
                                            <input 
                                                type="number" 
                                                value={quickQty} 
                                                onChange={(e) => setQuickQty(Math.min(availableMatchingUnits.length, Math.max(1, parseInt(e.target.value) || 1)))}
                                                className="w-full h-full text-center font-bold text-[#0B2136] focus:outline-none bg-transparent"
                                            />
                                            <button 
                                                onClick={() => setQuickQty(Math.min(availableMatchingUnits.length, quickQty + 1))} 
                                                className="px-4 h-full text-gray-600 hover:bg-gray-50 font-bold transition-colors"
                                            >+</button>
                                        </div>

                                        <button 
                                            onClick={() => handleQuickAdd(false)}
                                            disabled={availableMatchingUnits.length === 0}
                                            className="flex-1 h-14 rounded-xl p-3 text-sm font-bold bg-white border-2 border-[#0B2136] text-[#0B2136] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Add to Cart
                                        </button>
                                        
                                        <button 
                                            onClick={() => handleQuickAdd(true)}
                                            disabled={availableMatchingUnits.length === 0}
                                            className="flex-1 h-14 rounded-xl p-3 text-sm font-bold bg-[#0B2136] text-white hover:bg-[#1B5E3B] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Buy Now
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <p className="text-gray-500 text-sm mb-4">Please log in to view B2B pricing and quick-add inventory.</p>
                                    <button 
                                        onClick={() => router.push('/login')}
                                        className="w-full py-4 rounded-xl text-sm font-bold bg-[#0B2136] text-white hover:bg-[#1B5E3B] transition-colors shadow-md"
                                    >
                                        Login to View & Buy
                                    </button>
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
                
                {/* Visual Separator for Manual Selection */}
                <div className="flex items-center gap-4 my-8">
                    <hr className="flex-1 border-gray-200" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Or Pick Specific Units Below</span>
                    <hr className="flex-1 border-gray-200" />
                </div>

                <SerializedTable matchingUnits={matchingUnits} />

                <DetailedSpecs specs={representativeUnit?.specs} />
            </div>
        </div>
    );
}