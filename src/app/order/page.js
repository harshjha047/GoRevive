"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/utils/Context/AuthContext';
import api from '@/lib/apiClient';
import toast from 'react-hot-toast';

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export default function OrdersPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    
    const [orders, setOrders] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // Guard: Redirect if not logged in
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    // Fetch Orders
    useEffect(() => {
        if (isAuthenticated && user?.crm_party_code) {
            const fetchOrders = async () => {
                try {
                    const response = await api.get(`/user/orders?userId=${user.crm_party_code}`);
                    
                    if (response.data?.success) {
                        const groupedOrders = response.data.orders.reduce((acc, item) => {
                            if (!acc[item.order_id]) {
                                acc[item.order_id] = {
                                    order_id: item.order_id,
                                    date: item.entry_date,
                                    time: item.entry_time,
                                    status: item.status,
                                    payment_status: item.payment_status,
                                    payment_mode: item.payment_mode,
                                    total_amount: item.total_invoice_amt,
                                    invoice_no: item.invoice_no,
                                    link_print: item.link_print,
                                    items: []
                                };
                            }
                            acc[item.order_id].items.push(item);
                            return acc;
                        }, {});

                        setOrders(groupedOrders);
                    }
                } catch (error) {
                    if (error.response?.status !== 404) {
                        toast.error("Failed to load order history.");
                    }
                } finally {
                    setIsLoading(false);
                }
            };
            fetchOrders();
        }
    }, [isAuthenticated, user]);

    // Status Badge Styling Helper
    const getStatusBadge = (status) => {
        const s = String(status).toLowerCase();
        if (s === 'success' || s === 'dispatched' || s === 'delivered') return "bg-emerald-100 text-emerald-700";
        if (s === 'cancelled' || s === 'failed') return "bg-red-100 text-red-700";
        return "bg-amber-100 text-amber-700"; // Pending / Processing
    };

    if (authLoading || isLoading) {
        return <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div></div>;
    }

    const orderArray = Object.values(orders).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 py-12">
            <div className="container mx-auto px-4 max-w-[1000px]">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0B2136]">Order History</h1>
                        <p className="text-gray-500 font-medium mt-1">Track your recent B2B purchases and download invoices.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-bold text-[#1B5E3B] bg-white border border-gray-200 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Orders List */}
                {orderArray.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center shadow-sm">
                        <div className="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[#0B2136] mb-2">No orders found</h2>
                        <p className="text-gray-500 mb-6">You haven't placed any B2B orders yet.</p>
                        <Link href="/products" className="bg-[#0B2136] text-white font-bold px-6 py-3 rounded-lg hover:bg-[#12304d] transition-colors">
                            Browse Inventory
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orderArray.map((order) => (
                            <div key={order.order_id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                
                                {/* Order Header */}
                                <div className="bg-gray-50 border-b border-gray-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full md:w-auto">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Placed</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{order.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-1">{formatCurrency(order.total_amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order ID</p>
                                            <p className="text-sm font-mono font-semibold text-gray-900 mt-1">{order.order_id}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</p>
                                            <span className={`inline-block mt-1 text-xs font-black px-2.5 py-0.5 rounded tracking-wide uppercase ${getStatusBadge(order.payment_status)}`}>
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {/* {order.link_print && order.status !== "Cancelled" && (
                                        <a 
                                            href={`https://gorevive.jbbs.in/app_api/API/${order.link_print}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="whitespace-nowrap text-sm font-bold text-[#1B5E3B] bg-emerald-50 px-5 py-2.5 rounded-lg hover:bg-emerald-100 transition-colors border border-emerald-100 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            Invoice
                                        </a>
                                    )} */}
                                </div>

                                {/* Order Items */}
                                <div className="p-5 divide-y divide-gray-100">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-5 items-start">
                                            
                                            {/* Item Image */}
                                            {/* <div className="w-24 h-24 bg-gray-50 rounded-xl border border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                                <img 
                                                    src={`https://zobox.jbbs.in${item.image1}`} 
                                                    alt={item.model_name}
                                                    className="w-full h-full object-contain p-2"
                                                    onError={(e) => { e.target.src = '/placeholder_laptop.png' }} 
                                                />
                                            </div> */}
                                            
                                            {/* Item Details */}
                                            <div className="flex-1">
                                                <h3 className="text-base font-bold text-[#0B2136] line-clamp-2">{item.model_name}</h3>
                                                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                                    {item.imei1 && <p><span className="font-semibold">IMEI/SN:</span> {item.imei1}</p>}
                                                    <p><span className="font-semibold">Grade:</span> {item.stock_type}</p>
                                                    <p><span className="font-semibold">Qty:</span> {item.Qty}</p>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <p className="font-bold text-[#0B2136]">{formatCurrency(item.item_total)}</p>
                                                    
                                                    {/* Individual Item Status */}
                                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getStatusBadge(item.status)}`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}