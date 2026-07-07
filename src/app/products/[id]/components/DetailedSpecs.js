"use client";

import React from 'react';

// Helper to convert camelCase, snake_case, or kebab-case into Title Case words
const formatKey = (key) => {
    return key
        .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase
        .replace(/[_-]/g, ' ')               // Replace underscores and dashes with spaces
        .trim();
};

export default function DetailedSpecs({ specs }) {
    if (!specs || Object.keys(specs).length === 0) return null;

    // Filter out unwanted empty values before rendering so we can accurately 
    // check if we still have items to show.
    const validSpecs = Object.entries(specs).filter(([_, value]) => {
        if (!value) return false;
        const stringVal = value.toString().trim();
        return stringVal !== "" && stringVal !== "/" && stringVal !== "N/A";
    });

    if (validSpecs.length === 0) return null;

    return (
        <div className="mt-16  pt-10">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#0B2136] p-2 rounded-lg">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Detailed Specifications</h2>
            </div>
            
            <div className="bg-white border border-gray-200 p-2 sm:p-6 md:p-8 rounded-2xl shadow-sm">
                <ul className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16 gap-y-1">
                    {validSpecs.map(([key, value]) => (
                        <li 
                            key={key} 
                            className="grid grid-cols-3 gap-4 py-3 px-3 sm:px-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-150 ease-in-out rounded-lg group"
                        >
                            <span className="col-span-1 font-semibold text-gray-500 capitalize tracking-wide text-sm flex items-center">
                                {formatKey(key)}
                            </span>
                            <span className="col-span-2 font-bold text-gray-900 text-sm flex items-center">
                                {value}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}