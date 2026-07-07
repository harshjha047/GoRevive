"use client";

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/utils/Context/CartContext';
import api from '@/lib/apiClient';
import toast from 'react-hot-toast';
import ActionDropdown from './components/ActionDropdown';
import OrderSummary from './components/OrderSummary';

// Format Helper
const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace(/\s/g, '');

export default function CartPage() {
    const { cartItems, cartSubtotal, loading, removeFromCart, addMultipleToCart, removeMultipleFromCart } = useCart();

    // Dropdown State
    const [openDropdownId, setOpenDropdownId] = useState(null);

    // Modal States for Manual Selection
    const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'remove'
    const [activeModelCode, setActiveModelCode] = useState(null);
    const [availableWarehouseUnits, setAvailableWarehouseUnits] = useState([]);
    const [isFetchingUnits, setIsFetchingUnits] = useState(false);

    console.log(cartItems)

    // Close dropdown when clicking outside
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdownId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const groupedCart = useMemo(() => {
        return cartItems.reduce((acc, item) => {
            const code = item.product.model_code;
            if (!acc[code]) {
                acc[code] = {
                    model_code: code,
                    brand: item.product.brand,
                    model: item.product.model || item.product.name,
                    image: item.product.image,
                    items: [],
                    groupTotal: 0
                };
            }
            acc[code].items.push(item);
            acc[code].groupTotal += item.product.price;
            return acc;
        }, {});
    }, [cartItems]);


    const handleAutoRemove = async (modelCode, count) => {
        setOpenDropdownId(null); // Close dropdown
        const group = groupedCart[modelCode];
        if (!group) return;

        const itemsToRemove = group.items.slice(-count).map(i => i.product.id);
        await removeMultipleFromCart(itemsToRemove);
    };

    const handleClearCartModel = async (modelCode) => {
        setOpenDropdownId(null);
        const group = groupedCart[modelCode];
        if (!group) return;

        const itemsToRemove = group.items.map(i => i.product.id);
        await removeMultipleFromCart(itemsToRemove);
    };

    const handleAutoAdd = async (modelCode, count) => {
        setOpenDropdownId(null);
        const toastId = toast.loading("Checking warehouse availability...");
        try {
            const response = await api.post('/products/details', { modelCode });
            const allUnits = response.data?.units || [];

            const cartIds = new Set(cartItems.map(i => i.product.id));
            const availableUnits = allUnits.filter(u => !cartIds.has(u.id));

            if (availableUnits.length < count) {
                toast.error(`Only ${availableUnits.length} additional units available.`, { id: toastId });
                return;
            }

            const unitsToAdd = availableUnits.slice(0, count);
            toast.dismiss(toastId);
            await addMultipleToCart(unitsToAdd);

        } catch (error) {
            toast.error("Failed to fetch inventory.", { id: toastId });
        }
    };

    const openSelectModal = async (modelCode, mode) => {
        setOpenDropdownId(null);
        setActiveModelCode(modelCode);
        setModalMode(mode);
        setIsSelectModalOpen(true);
        setIsFetchingUnits(true);

        if (mode === 'add') {
            try {
                const response = await api.post('/products/details', { modelCode });
                const allUnits = response.data?.units || [];

                console.log(`📦 RAW UNITS FROM PHP for ${modelCode}:`, allUnits);

                const cartIds = new Set(cartItems.map(i => i.product.id));
                console.log(`🛒 IMEIs ALREADY IN CART:`, Array.from(cartIds));

                const filteredUnits = allUnits.filter(u => !cartIds.has(u.id));
                console.log(`✅ FINAL AVAILABLE UNITS:`, filteredUnits);

                setAvailableWarehouseUnits(filteredUnits);
            } catch (error) {
                toast.error("Failed to load warehouse units");
                console.error("Modal Fetch Error:", error);
            }
        }
        setIsFetchingUnits(false);
    };

    if (loading) return <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div></div>;

    if (cartItems.length === 0) return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center py-20">
            <h1 className="text-3xl font-extrabold text-[#0B2136] mb-2">Your Cart is Empty</h1>
            <Link href="/products" className="px-6 py-3 bg-[#0B2136] text-white font-bold rounded-xl mt-4 hover:bg-[#1B5E3B]">Browse Inventory</Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 py-12">
            <div className="container mx-auto px-4 max-w-[1200px]">
                <h1 className="text-3xl font-extrabold text-[#0B2136] mb-8">Purchase Order</h1>

                <div className="flex flex-col lg:flex-row gap-5">
                    {/* LEFT: GROUPED CART ITEMS */}
                    <div className=" flex flex-col gap-6" ref={dropdownRef}>
                        {Object.values(groupedCart).map((group) => (
                            <div key={group.model_code} className="bg-white lg:w-[50vw] rounded-md border border-gray-200 shadow-sm">

                                {/* Group Header */}
                                <div className="p-6 border-b border-gray-100 flex gap-6 items-center">
                                    <div className="w-20 h-20  flex-shrink-0">
                                        <img src={group.image} alt={group.model} className="w-full h-full object-contain mix-blend-multiply" />

                                    </div>
                                    <div className="flex-grow">
                                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{group.brand}</span>
                                        <h3 className="text-lg font-bold text-[#0B2136] leading-tight">{group.model}</h3>
                                        <p className="text-sm font-semibold text-[#1B5E3B] mt-1">{group.items.length} Units Selected • {formatCurrency(group.groupTotal)}</p>
                                    </div>


                                    <ActionDropdown
                                        classname={'lg:block hidden'}
                                        openDropdownId={openDropdownId} group={group} handleAutoAdd={handleAutoAdd} openSelectModal={openSelectModal} handleAutoRemove={handleAutoRemove} handleClearCartModel={handleClearCartModel} setOpenDropdownId={setOpenDropdownId}
                                    />
                                </div>

                                <div className="bg-gray-50/50 p-4 rounded">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {group.items.map((item) => {
                                            const isAvailable = item.product.isStock;

                                            return (
                                                <div
                                                    key={item.product.id}
                                                    className={`rounded-md p-3 flex justify-between items-center shadow-sm transition-all border ${isAvailable
                                                            ? 'bg-white border-gray-200'
                                                            : 'bg-red-50/40 border-red-200 relative overflow-hidden'
                                                        }`}
                                                >
                                                    <div className={`${!isAvailable ? 'opacity-60 grayscale' : ''}`}>
                                                        <div className="flex items-center gap-2 mb-0.5">
                                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Serial / IMEI</p>

                                                            {!isAvailable && (
                                                                <span className="bg-red-100 text-red-600 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider border border-red-200">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className={`font-mono text-sm font-bold ${isAvailable ? 'text-[#0B2136]' : 'text-gray-500 line-through decoration-red-400/60'}`}>
                                                            {item.product.id}
                                                        </p>
                                                        <p className="text-xs font-semibold text-gray-500 mt-0.5">
                                                            Grade {item.product.condition || item.product.category}
                                                        </p>
                                                    </div>

                                                    <div className="text-right flex flex-col items-end gap-2">
                                                        {isAvailable ? (
                                                            <p className="font-black text-[#0B2136]">{formatCurrency(item.product.price)}</p>
                                                        ) : (
                                                            <p className="text-xs font-black text-red-500 uppercase tracking-wide mt-1">Unavailable</p>
                                                        )}

                                                        <button
                                                            onClick={() => removeFromCart(item.product.id)}
                                                            className={`text-[11px] font-bold px-3 py-1.5 rounded transition-all ${isAvailable
                                                                    ? 'text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100'
                                                                    : 'bg-red-500 text-white hover:bg-red-600 shadow-md ring-2 ring-red-500/20'
                                                                }`}
                                                        >
                                                            {isAvailable ? 'Remove' : 'Remove to Checkout'}
                                                        </button>
                                                    </div>

                                                    {/* Subtle red hash pattern background for dead items (Optional UX touch) */}
                                                    {!isAvailable && (
                                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ef4444 25%, transparent 25%, transparent 75%, #ef4444 75%, #ef4444), repeating-linear-gradient(45deg, #ef4444 25%, transparent 25%, transparent 75%, #ef4444 75%, #ef4444)', backgroundSize: '10px 10px', backgroundPosition: '0 0, 5px 5px' }}></div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <OrderSummary cartItems={cartItems} cartSubtotal={cartSubtotal} formatCurrency={formatCurrency} />
                    {/* <div className=" w-full">
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
                            <h2 className="text-lg font-bold text-[#0B2136] mb-6">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Total Units</span>
                                    <span className="font-bold text-[#0B2136]">{cartItems.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500 font-medium">Subtotal</span>
                                    <span className="font-bold text-[#0B2136]">{formatCurrency(cartSubtotal)}</span>
                                </div>
                                {cartItems.length >= 10 && (
                                    <div className="flex justify-between text-emerald-600">
                                        <span className="font-bold">Bulk Discount (3%)</span>
                                        <span className="font-bold">- {formatCurrency(cartSubtotal * 0.03)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="border-t border-gray-100 pt-4 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-900 font-bold">Total Request</span>
                                    <span className="text-2xl font-black text-[#0B2136]">
                                        {formatCurrency(cartItems.length >= 10 ? cartSubtotal * 0.97 : cartSubtotal)}
                                    </span>
                                </div>
                            </div>
                            <button onClick={() => { console.log(".....") }} disabled={cartItems?.length <= 4} className="w-full bg-[#0B2136] text-white font-bold py-4 rounded-xl hover:bg-[#1B5E3B] transition-colors shadow-md">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div> */}
                </div>
            </div>


            {isSelectModalOpen && (
                <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">

                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-[#0B2136]">
                                    {modalMode === 'add' ? 'Select Units to Add' : 'Select Units to Remove'}
                                </h3>
                                <p className="text-xs font-semibold text-gray-500 mt-1">Model Code: {activeModelCode}</p>
                            </div>
                            <button onClick={() => setIsSelectModalOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold p-2 bg-white rounded-full border border-gray-200 hover:bg-gray-100 transition-colors">✕</button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {isFetchingUnits ? (
                                <div className="flex justify-center py-10"><div className="w-8 h-8 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div></div>
                            ) : modalMode === 'add' ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {availableWarehouseUnits.length === 0 ? (
                                        <p className="col-span-2 text-center text-gray-400 font-bold py-8">No additional units available in the warehouse.</p>
                                    ) : (
                                        availableWarehouseUnits.map(unit => (
                                            <div key={unit.id} className="border border-gray-200 rounded p-3 flex justify-between items-center hover:border-[#1B5E3B] transition-colors group/item">
                                                <div>
                                                    <p className="font-mono text-sm font-bold text-[#0B2136]">{unit.id}</p>
                                                    <p className="text-[10px] font-bold text-gray-400">Grade {unit.condition}</p>
                                                </div>
                                                <button
                                                    onClick={async () => {
                                                        await addMultipleToCart([unit]);
                                                        setAvailableWarehouseUnits(prev => prev.filter(u => u.id !== unit.id));
                                                    }}
                                                    className="bg-white border border-[#0B2136] text-[#0B2136] text-xs font-bold px-3 py-1.5 rounded hover:bg-[#0B2136] hover:text-white transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {groupedCart[activeModelCode]?.items.map(item => (
                                        <div key={item.product.id} className="border border-gray-200 rounded-lg p-3 flex justify-between items-center hover:border-red-500 transition-colors group/item">
                                            <div>
                                                <p className="font-mono text-sm font-bold text-[#0B2136]">{item.product.id}</p>
                                                <p className="text-[10px] font-bold text-gray-400">Grade {item.product.condition}</p>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    await removeMultipleFromCart([item.product.id]);
                                                    if (groupedCart[activeModelCode].items.length <= 1) setIsSelectModalOpen(false);
                                                }}
                                                className="bg-white border border-red-500 text-red-500 text-xs font-bold px-3 py-1.5 rounded hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}