"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/utils/Context/AuthContext';
import api from '@/lib/apiClient'; 

const CartContext = createContext(undefined);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { user, isAuthenticated } = useAuth();
    const hasFetched = useRef(false);

    // ==========================================
    // CART CALCULATION ENGINE
    // ==========================================
    const calculateItemPrice = (basePrice, quantity) => {
        // Apply 3% B2B Discount if quantity is 10 or more (Global cart quantity)
        if (quantity >= 10) return basePrice * 0.97;
        return basePrice;
    };

    const cartTotals = useMemo(() => {
        let count = 0;
        let subtotal = 0;

        cartItems.forEach(item => {
            count += item.quantity;
        });

        // Calculate subtotal with the global discount logic if applicable
        cartItems.forEach(item => {
            const finalPrice = calculateItemPrice(item.product.price, count);
            subtotal += (finalPrice * item.quantity);
        });

        return { count, subtotal };
    }, [cartItems]);

    // ==========================================
    // SERVER SYNCHRONIZATION
    // ==========================================
    const fetchServerCart = useCallback(async () => {
        if (!isAuthenticated || !user?.crm_party_code) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const response = await api.get(`/cart?userId=${user.crm_party_code}`);
            
            if (response.data?.success && response.data?.cart) {
                setCartItems(response.data.cart);
            } else {
                setCartItems([]);
            }
        } catch (error) {
            console.error("Failed to sync cart:", error);
            setCartItems([]);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        if (hasFetched.current) return;
        if (isAuthenticated) {
            hasFetched.current = true;
            fetchServerCart();
        }
    }, [isAuthenticated, fetchServerCart]);

    // ==========================================
    // ACTIONS
    // ==========================================
    const addToCart = useCallback(async (product, quantity = 1) => {
        if (!isAuthenticated || !user?.crm_party_code) {
            toast.error("Please log in to add items to your cart.");
            return;
        }

        const existingItem = cartItems.find(item => item.product.id === product.id);
        
        if (existingItem) {
            toast.error(`This specific unit is already in your cart.`);
            return;
        }

        toast.promise(
            api.post('/cart', { unit: product, userId: user.crm_party_code }),
            {
                loading: 'Allocating unit...',
                success: (response) => {
                    fetchServerCart(); 
                    return response.data?.message || 'Added to order!';
                },
                error: (err) => err.response?.data?.message || 'Failed to allocate unit.',
            }
        );
    }, [cartItems, isAuthenticated, user, fetchServerCart]);

    const addMultipleToCart = async (productsArray) => {
        console.log(productsArray)
        if (!isAuthenticated || !user?.crm_party_code) return toast.error("Please log in.");
        
        const toastId = toast.loading(`Allocating ${productsArray.length} units...`);
        try {
            await Promise.all(productsArray.map(product => 
                api.post('/cart', { unit: product, userId: user.crm_party_code })
            ));
            
            await fetchServerCart();
            toast.success(`Added ${productsArray.length} units to order`, { id: toastId });
        } catch (error) {
            toast.error("Failed to allocate some units", { id: toastId });
        }
    };

    const removeMultipleFromCart = async (productIdsArray) => {
        if (!isAuthenticated || !user?.crm_party_code) return;

        const toastId = toast.loading(`Releasing ${productIdsArray.length} units...`);
        try {
            await Promise.all(productIdsArray.map(id => {
                const item = cartItems.find(i => i.product.id === id);
                return api.post('/cart', { unit: item.product, userId: user.crm_party_code, action: 'R' });
            }));
            
            await fetchServerCart();
            toast.success(`Released ${productIdsArray.length} units`, { id: toastId });
        } catch (error) {
            toast.error("Failed to release some units", { id: toastId });
        }
    };

// const removeFromCart = useCallback(async (productId) => {
//         const itemToRemove = cartItems.find(item => item.product.id === productId);
//         if (!itemToRemove || !user?.crm_party_code) return;

//         toast.promise(
//             api.post('/cart', { 
//                 unit: itemToRemove.product, 
//                 userId: user.crm_party_code, 
//                 action: 'R' 
//             }),
//             {
//                 loading: 'Releasing unit...',
//                 success: () => {
//                     setCartItems(prev => prev.filter(item => item.product.id !== productId));
//                     fetchServerCart(); 
//                     return 'Unit removed from order.';
//                 },
//                 error: 'Failed to release unit.',
//             }
//         );
//     }, [cartItems, user, fetchServerCart]);

const removeFromCart = useCallback(async (productId) => {
    
        const itemToRemove = cartItems.find(item => item.product.id === productId);
        if (!itemToRemove) return;

        if (isAuthenticated && user?.crm_party_code) {
            toast.promise(
                api.post('/cart', {
                    unit: itemToRemove.product,
                    userId: user.crm_party_code,
                    action: "R"
                }),
                {
                    loading: 'Removing item...',
                    success: () => {
                        // Immediately update UI, then sync with server
                        setCartItems(prev => prev.filter(item => item.product.id !== productId));
                        fetchServerCart();
                        return 'Item removed successfully.';
                    },
                    error: 'Failed to remove item.'
                }
            );
        } else {
            // Local fallback
            setCartItems(prev => prev.filter(item => item.product.id !== productId));
        }
    }, [cartItems, isAuthenticated, user, fetchServerCart]);


    const decrementCartQuantity = useCallback(async (product) => {
        const existingItem = cartItems.find(item => item.product.id === product.id);
        if (!existingItem || existingItem.quantity <= 1) return;

        if (isAuthenticated && user?.crm_party_code) {
            toast.promise(
                api.post('/cart', {
                    unit: product,
                    userId: user.crm_party_code,
                    action: "M"
                }),
                {
                    loading: 'Updating quantity...',
                    success: () => {
                        setCartItems(prev => prev.map(item => 
                            item.product.id === product.id 
                                ? { ...item, quantity: item.quantity - 1 } 
                                : item
                        ));
                        fetchServerCart();
                        return 'Quantity updated.';
                    },
                    error: 'Failed to update quantity.'
                }
            );
        } else {
            // Local fallback
            setCartItems(prev => prev.map(item => 
                item.product.id === product.id 
                    ? { ...item, quantity: item.quantity - 1 } 
                    : item
            ));
        }
    }, [cartItems, isAuthenticated, user, fetchServerCart]);


    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const value = useMemo(() => ({
        cartItems,
        cartCount: cartTotals.count,
        cartSubtotal: cartTotals.subtotal,
        loading,
        addToCart,
        removeFromCart,
        decrementCartQuantity,
        addMultipleToCart,
        removeMultipleFromCart,
        clearCart
    }), [cartItems, cartTotals, loading,decrementCartQuantity, addMultipleToCart, removeMultipleFromCart, addToCart, removeFromCart, clearCart]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};