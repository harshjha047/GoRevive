"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/apiClient';
import { useAuth } from '@/components/utils/Context/AuthContext';
import { useCart } from '@/components/utils/Context/CartContext';

function StatusContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { user } = useAuth();
    const { cartItems, cartSubtotal, clearCart } = useCart();
    
    const orderId = searchParams.get('order_id');
    const gateway = searchParams.get('gateway');

    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'failed'
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!orderId || !gateway) {
            setStatus('failed');
            setErrorMessage("Invalid return URL. Missing order ID or Gateway.");
            return;
        }

        const verifyAndCompleteOrder = async () => {
            try {
                // 1. Verify Payment with the Bank
                const verifyRes = await api.post('/payment/verify', { orderId, gateway });
                
                if (verifyRes.data?.success && verifyRes.data?.isPaid) {
                    
                    // 2. HDFC ONLY: Generate Invoice on Return
                    if (gateway === 'HDFC' && user?.crm_party_code && cartItems.length > 0) {
                        try {
                            const totalAmount = cartItems.length >= 10 ? cartSubtotal * 0.97 : cartSubtotal;
                            const d = new Date();
                            const formattedDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

                            const invoicePayload = {
                                order_no: orderId,
                                invoice_no: "",
                                invoice_date: formattedDate,
                                tot_qty: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                                tot_amount: totalAmount,
                                payment_mode: "HDFC",
                                wallet_amount: 0,
                                cashfree_amount: totalAmount,
                                crm_party_code: user.crm_party_code,
                                payment_reference: orderId,
                                payment_status: "Success",
                                party_name: user.cust_name,
                                party_mobile: user.mobile,
                                party_email: user.email,
                                // Fallback addresses if context is missing
                                shipping_address: user.address1 || "B2B Order",
                                shipping_city: user.city || "",
                                shipping_state: user.state || "",
                                shipping_zip: user.pincode || "",
                                invoice_details: cartItems.map(item => ({
                                    model_name: item.product.name,
                                    model_code: item.product.model_code || "",
                                    type: item.product.category || "Unknown",
                                    qty: item.quantity.toString(),
                                    imei1: item.product.id,
                                    price: item.product.price.toString(),
                                    item_total: (item.product.price * item.quantity).toString(),
                                }))
                            };

                            await api.post('/order/invoice', invoicePayload);
                        } catch (invErr) {
                            console.error("HDFC Invoice Generation Failed:", invErr);
                            // We don't fail the whole page here, the payment was successful. 
                            // The admin can manually generate the invoice from the backend.
                        }
                    }

                    // 3. Clear the user's cart now that the order is fully complete
                    if (clearCart) clearCart();
                    
                    setStatus('success');

                } else {
                    setStatus('failed');
                    setErrorMessage(verifyRes.data?.message || "Payment verification failed or was declined by the bank.");
                }
            } catch (error) {
                setStatus('failed');
                setErrorMessage(error.response?.data?.message || "Network error during verification.");
            }
        };

        verifyAndCompleteOrder();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderId, gateway]); // Run once on mount when params are available

    // RENDER HELPERS
    if (status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-16 h-16 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin mb-6"></div>
                <h2 className="text-2xl font-bold text-[#0B2136] mb-2">Verifying Payment...</h2>
                <p className="text-gray-500">Please don't close or refresh this page.</p>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>
                <h2 className="text-3xl font-bold text-[#0B2136] mb-4">Payment Failed</h2>
                <p className="text-gray-500 max-w-md mb-8">{errorMessage}</p>
                <div className="flex gap-4">
                    <button onClick={() => router.push('/checkout')} className="bg-[#0B2136] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#1B5E3B] transition-colors shadow-md">
                        Try Again
                    </button>
                    <Link href="/dashboard" className="bg-white border border-gray-200 text-gray-700 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                        Go to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
                <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-4xl font-black text-[#0B2136] mb-2">Payment Successful!</h2>
            <p className="text-gray-500 text-lg mb-2">Thank you for your business.</p>
            <p className="text-sm font-mono bg-gray-100 px-4 py-2 rounded-lg text-gray-600 mb-10">
                Order ID: <strong>{orderId}</strong>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <Link href="/orders" className="flex-1 bg-[#1B5E3B] text-white font-bold px-6 py-4 rounded-xl hover:bg-[#14472d] transition-colors shadow-md text-center">
                    View Order Details
                </Link>
                <Link href="/products" className="flex-1 bg-white border-2 border-gray-200 text-gray-700 font-bold px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors text-center">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function CheckoutStatusPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] py-20 flex items-center justify-center">
            <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-8 w-full max-w-2xl mx-4">
                <Suspense fallback={
                    <div className="flex flex-col items-center justify-center p-12">
                        <div className="w-12 h-12 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div>
                    </div>
                }>
                    <StatusContent />
                </Suspense>
            </div>
        </div>
    );
}