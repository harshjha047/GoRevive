"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/apiClient';

export default function QCReportPage() {
    const router = useRouter();
    const params = useParams();


    const { imei } = params;




    const [qcData, setQcData] = useState([]);
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchQCDetails = async () => {
            try {
                const response = await api.get(`/qc?imei=${imei}`);
                
                if (response.data?.success) {
                    const rawData = response.data.data;
                    
                    const tests = rawData.filter(item => item.name && item.name.trim() !== "");
                    setQcData(tests);

                    const imageRow = rawData.find(item => 'image1' in item);
                    if (imageRow) {
                        const extractedImages = [
                            imageRow.image1, imageRow.image2, imageRow.image3, 
                            imageRow.image4, imageRow.image5, imageRow.image6
                        ].filter(img => img && img.trim() !== ""); 
                        
                        setImages(extractedImages);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load QC details.");
            } finally {
                setIsLoading(false);
            }
        };

        if (imei) {
            fetchQCDetails();
        }
    }, [imei]);

    // Helper to color-code remarks
    const getRemarkColor = (rmk) => {
        const val = String(rmk).toLowerCase();
        if (["ok", "yes", "working"].includes(val)) return "text-emerald-700 bg-emerald-50 border-emerald-200";
        if (["na", "n/a"].includes(val)) return "text-gray-500 bg-gray-50 border-gray-200";
        return "text-amber-700 bg-amber-50 border-amber-200"; // For "Minor Scratch", etc.
    };

    if (isLoading) {
        return <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
                <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-200 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h1 className="text-xl font-bold text-[#0B2136] mb-2">Report Not Found</h1>
                    <p className="text-gray-500 mb-6">{error}</p>
                    <button onClick={() => router.back()} className="w-full bg-[#0B2136] text-white font-bold py-3 rounded-xl hover:bg-[#1B5E3B] transition-colors">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 py-12">
            <div className="container mx-auto px-4 max-w-[800px]">
                
                {/* Header Card */}
                <div className="bg-[#0B2136] rounded-t-2xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">Quality Control Certificate</p>
                        <h1 className="text-3xl font-black">Device Report</h1>
                    </div>
                    <div className="bg-white/10 px-5 py-3 rounded-md backdrop-blur-sm border border-white/20 text-right">
                        <p className="text-xs text-gray-300 uppercase tracking-wider mb-0.5">Device Identifier (IMEI/SN)</p>
                        <p className="text-lg font-mono font-bold tracking-widest">{imei}</p>
                    </div>
                </div>

                <div className="bg-white rounded-b-2xl border border-gray-200 border-t-0 shadow-sm overflow-hidden">
                    
                    {/* Inspection Checklist */}
                    <div className="p-8">
                        <h2 className="text-lg font-bold text-[#0B2136] mb-6 flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#1B5E3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            64-Point Inspection Results
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                            {qcData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                                    <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-md border ${getRemarkColor(item.rmk)}`}>
                                        {item.rmk}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Image Gallery (Only renders if images exist) */}
                    {images.length > 0 && (
                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-[#0B2136] mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                Device Condition Photos
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {images.map((imgUrl, index) => (
                                    console.log("image:", images),

                                    <div key={index} className="aspect-square  border-gray-200 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                                        <img 
                                            src={`https://gorevive.jbbs.in/${imgUrl}`} 
                                            alt={`QC Device ${index + 1}`}
                                            className="max-w-full max-h-full object-contain"
                                            onError={(e) => { e.target.src = '/placeholder_laptop.png' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                </div>
            </div>
        </div>
    );
}