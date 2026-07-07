"use client";

import React from 'react';

const formatGrade = (grade) => grade?.length === 1 ? `Grade ${grade}` : grade;

export default function Configurator({ 
    availableGrades, 
    specOptions, 
    selectedGrade, 
    setSelectedGrade, 
    selectedSpecs, 
    setSelectedSpecs 
}) {
    return (
        <div className="space-y-6 mb-8">
            {/* Grade Selector */}
            {availableGrades.length > 0 && (
                <div>
                    <h3 className="font-semibold text-gray-600 text-sm mb-3">Condition Grade</h3>
                    <div className="flex flex-wrap gap-3">
                        {availableGrades.map(grade => (
                            <button
                                key={grade}
                                onClick={() => setSelectedGrade(grade)}
                                className={`px-6 py-2.5 rounded text-sm font-bold transition-colors border-2 ${
                                    selectedGrade === grade 
                                    ? 'border-[#1B5E3B] text-[#1B5E3B] bg-[#F0FAF5] shadow-sm' 
                                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                                }`}
                            >
                                {formatGrade(grade)}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Spec Selectors (RAM, Storage, etc.) */}
            {Object.entries(specOptions).map(([specName, options]) => (
                <div key={specName}>
                    <h3 className="font-semibold text-gray-600 text-sm mb-3 capitalize">{specName}</h3>
                    <div className="flex flex-wrap gap-3">
                        {options.map(option => (
                            <button
                                key={option}
                                onClick={() => setSelectedSpecs(prev => ({ ...prev, [specName]: option }))}
                                className={`px-5 py-2.5 rounded text-sm font-bold transition-colors border-2 ${
                                    selectedSpecs[specName] === option 
                                    ? 'border-[#1B5E3B] text-[#1B5E3B] bg-[#F0FAF5] shadow-sm' 
                                    : 'border-gray-200 text-gray-600 bg-white hover:border-gray-300'
                                }`}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}