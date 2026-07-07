"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/utils/Context/AuthContext';
import api from '@/lib/apiClient';
import toast from 'react-hot-toast';

export default function DashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading ,logout} = useAuth();
    
    const [kycData, setKycData] = useState(null);
    const [isLoadingKyc, setIsLoadingKyc] = useState(true);

    // ==========================================
    // 1. GUARDS & INITIALIZATION
    // ==========================================
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.replace('/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated && user?.crm_party_code) {
            const fetchKycStatus = async () => {
                try {
                    const response = await api.get(`/user/kyc?userId=${user.crm_party_code}`);
                    if (response.data?.success) {
                        setKycData(response.data.kycData);
                    }
                } catch (error) {
                    console.error("KYC Fetch Error:", error);
                    toast.error("Could not load compliance data.");
                } finally {
                    setIsLoadingKyc(false);
                }
            };
            fetchKycStatus();
        }
    }, [isAuthenticated, user]);

    // ==========================================
    // RENDER HELPERS
    // ==========================================
    if (authLoading || (isAuthenticated && !user)) {
        return <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div></div>;
    }

    if (!isAuthenticated) return null; // Prevent flash before redirect

    // KYC Status Badge Config
    const getKycBadge = (status) => {
        const s = String(status).toUpperCase();
        if (s === "VERIFIED") return <span className="bg-emerald-100 text-emerald-700 text-xs font-black px-3 py-1 rounded-md tracking-wider">VERIFIED</span>;
        if (s === "PENDING") return <span className="bg-amber-100 text-amber-700 text-xs font-black px-3 py-1 rounded-md tracking-wider animate-pulse">PENDING APPROVAL</span>;
        if (s === "REJECTED") return <span className="bg-red-100 text-red-700 text-xs font-black px-3 py-1 rounded-md tracking-wider">REJECTED</span>;
        return <span className="bg-gray-100 text-gray-600 text-xs font-black px-3 py-1 rounded-md tracking-wider">INCOMPLETE</span>;
    };

    // Construct full image URLs from the PHP response
    const getDocumentUrl = (imgPath) => {
        if (!imgPath || !kycData?.url) return null;
        return `${kycData.url}${imgPath}`;
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 py-12">
            <div className="container mx-auto px-4 max-w-[1200px]">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#0B2136]">Welcome back, {user.cust_name?.split(' ')[0]}!</h1>
                        <p className="text-gray-500 font-medium mt-1">Manage your B2B profile and track your business compliance.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/products" className="bg-white border-2 border-[#0B2136] text-[#0B2136] hover:bg-gray-50 font-bold px-6 py-2.5 rounded-lg transition-colors">
                            Browse Inventory
                        </Link>
                        <button onClick={()=>{logout()}} className="bg-red-50 text-red-600 hover:bg-red-100 font-bold px-6 py-2.5 rounded-lg transition-colors">
                            Logout
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Profile & Address */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        
                        {/* 1. Account Details Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-14 h-14 bg-[#0B2136] text-white rounded-full flex items-center justify-center text-xl font-bold shadow-inner">
                                    {user.cust_name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#0B2136]">{user.cust_name}</h2>
                                    <p className="text-xs font-bold text-[#1B5E3B] uppercase tracking-wider">{user.customer_type}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Party Code (MID)</p>
                                    <p className="font-mono font-bold text-[#0B2136]">{user.crm_party_code}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                                    <p className="font-semibold text-gray-700">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mobile Number</p>
                                    <p className="font-semibold text-gray-700">+91 {user.mobile}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Account Status</p>
                                    <span className="inline-block mt-1 bg-emerald-50 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded uppercase">{user.status}</span>
                                </div>
                            </div>
                        </div>

                        {/* 2. Primary Business Address Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-[#0B2136]">Registered Address</h2>
                                <button className="text-sm font-bold text-gray-400 hover:text-[#0B2136] transition-colors">Edit</button>
                            </div>
                            
                            {user.address1 ? (
                                <div className="p-4 bg-gray-50 border border-gray-100 rounded-md">
                                    <p className="text-sm font-semibold text-gray-700 leading-relaxed">
                                        {user.address1} <br/>
                                        {user.address2 && <>{user.address2} <br/></>}
                                        {user.city}, {user.state} <br/>
                                        {user.pincode}
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                    <p className="text-sm font-semibold text-gray-500 mb-3">No registered address found.</p>
                                    <button className="text-sm font-bold text-[#1B5E3B] hover:underline">Add Business Address</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: B2B Compliance & Orders */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        
                        {/* 3. KYC & Compliance Card */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-[#0B2136]">B2B Compliance Check</h2>
                                    <p className="text-sm text-gray-500 mt-1">Required for wholesale pricing and GST invoicing.</p>
                                </div>
                                {isLoadingKyc ? (
                                    <div className="w-6 h-6 border-2 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div>
                                ) : (
                                    getKycBadge(kycData?.kyc_status)
                                )}
                            </div>

                            <div className="p-6 bg-gray-50/50">
                                {isLoadingKyc ? (
                                    <div className="h-32 flex items-center justify-center">
                                        <p className="text-sm font-bold text-gray-400">Loading compliance data...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {/* Aadhaar Row */}
                                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#0B2136]">Aadhaar Card</h3>
                                                    <p className="text-xs font-semibold text-gray-500">Identity Verification</p>
                                                </div>
                                            </div>
                                            {kycData?.aadhar_img ? (
                                                <a href={'#'} rel="noopener noreferrer" className="text-sm font-bold text-[#1B5E3B] bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">Submited</a>
                                            ) : (
                                                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded uppercase">Missing</span>
                                            )}
                                        </div>

                                        {/* PAN Row */}
                                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#0B2136]">PAN Card</h3>
                                                    <p className="text-xs font-semibold text-gray-500">Financial Verification</p>
                                                </div>
                                            </div>
                                            {kycData?.pan_img ? (
                                                <a href={'#'} rel="noopener noreferrer" className="text-sm font-bold text-[#1B5E3B] bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">Submited</a>
                                            ) : (
                                                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded uppercase">Missing</span>
                                            )}
                                        </div>

                                        {/* GST Row */}
                                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-[#0B2136]">GST Certificate</h3>
                                                    <p className="text-xs font-semibold text-gray-500">Business Verification</p>
                                                    {user.gst_no && <p className="text-xs font-mono font-bold text-gray-400 mt-0.5">{user.gst_no}</p>}
                                                </div>
                                            </div>
                                            {kycData?.gst_img ? (
                                                <a href={'#'} rel="noopener noreferrer" className="text-sm font-bold text-[#1B5E3B] bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">Submited</a>
                                            ) : (
                                                <span className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1.5 rounded uppercase">Missing</span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Rejected/Remark Notice */}
                                {kycData?.kyc_status?.toUpperCase() === "REJECTED" && kycData?.remark && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3">
                                        <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-800">Admin Remark</h4>
                                            <p className="text-sm font-medium text-red-600 mt-1">{kycData.remark}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 4. Quick Actions / Next Steps (Placeholder for Future Features) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-[#0B2136] to-[#12304d] rounded-2xl p-6 shadow-md text-white relative overflow-hidden group cursor-pointer">
                                <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-4 translate-y-4 group-hover:scale-110 transition-transform">
                                    <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5l-10-5v10l10 5 10-5v-10l-10 5z"/></svg>
                                </div>
                                <h3 className="text-lg font-bold mb-1">My Orders</h3>
                                <p className="text-sm text-blue-100 mb-6">Track invoices and shipping</p>
                                <Link href="/order" className="text-sm font-bold bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm transition-colors">View History →</Link>
                            </div>
                            
                            <div className="bg-white  border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#1B5E3B] transition-colors cursor-pointer group">
                                <h3 className="text-lg font-bold text-[#0B2136] mb-2 ">Partner Helpdesk</h3>
                                <p className="text-sm text-gray-500">Need help with an asset?</p>
                                <p><b>Email:</b> support@gorevive.in</p>
                                <p><b>Phone:</b> 011 4275 8155</p>
                                <p className="text-sm text-gray-500">(Mon-Fri, 10 AM - 6 PM IST)</p>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}