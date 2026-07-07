"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { useDashboard } from '@/components/utils/Context/DashboardContext';
import api from '@/lib/apiClient';

const ProductDetailContext = createContext(undefined);

export const ProductDetailProvider = ({ children }) => {
    const params = useParams();
    const productId = decodeURIComponent(params.id);
    const { productData, isLoading: isDashboardLoading } = useDashboard();

    const [baseProduct, setBaseProduct] = useState(null);
    const [familyUnits, setFamilyUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [selectedGrade, setSelectedGrade] = useState(null);
    const [selectedSpecs, setSelectedSpecs] = useState({});

    useEffect(() => {
        if (isDashboardLoading) return;
        const initialProduct = productData?.find(bundle => 
            bundle.id === productId || bundle.model_code === productId
        );

        if (!initialProduct) {
            setIsLoading(false);
            return;
        }

        setBaseProduct(initialProduct);

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
                setIsLoading(false);
            }
        };

        fetchDetailedInventory();
    }, [productId, productData, isDashboardLoading]);

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

    useEffect(() => {
        if (availableGrades.length > 0 && !selectedGrade) {
            setSelectedGrade(availableGrades[0]);
        }
        
        if (Object.keys(specOptions).length > 0 && Object.keys(selectedSpecs).length === 0) {
            const initial = {};
            Object.keys(specOptions).forEach(k => initial[k] = specOptions[k][0]);
            setSelectedSpecs(initial);
        }
    }, [availableGrades, specOptions, selectedGrade, selectedSpecs]);

    const matchingUnits = useMemo(() => {
        return familyUnits.filter(unit => {
            if (unit.condition !== selectedGrade) return false;
            if (unit.specs) {
                for (const [key, selectedValue] of Object.entries(selectedSpecs)) {
                    if (unit.specs[key] && String(unit.specs[key]) !== selectedValue) {
                        return false;
                    }
                }
            }
            return true;
        });
    }, [familyUnits, selectedGrade, selectedSpecs]);
    const handleSpecChange = (specName, value) => {
        setSelectedSpecs(prev => ({ ...prev, [specName]: value }));
    };

    const value = {
        baseProduct,
        isLoading: isLoading || isDashboardLoading,
        selectedGrade,
        setSelectedGrade,
        selectedSpecs,
        handleSpecChange,
        availableGrades,
        specOptions,
        matchingUnits
    };

    return (
        <ProductDetailContext.Provider value={value}>
            {children}
        </ProductDetailContext.Provider>
    );
};

export const useProductDetail = () => {
    const context = useContext(ProductDetailContext);
    if (context === undefined) {
        throw new Error('useProductDetail must be used within a ProductDetailProvider');
    }
    return context;
};