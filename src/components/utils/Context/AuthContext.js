"use client";

import api from '@/lib/apiClient';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            } catch (error) {
                if (error.response?.status !== 401) {
                    console.error("Session check failed:", error.response?.data || error.message);
                }
            } finally {
                setIsInitializing(false);
            }
        };
        
        checkUser();
    }, []);

   const login = useCallback(async (userData) => {
        try {
            await api.post('/auth/session', userData);
            
            setUser(userData);
            toast.success("Successfully logged in!");
        } catch (error) {
            console.error("Failed to set session cookie", error);
            toast.error("Login finalized, but session error occurred.");
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            localStorage.removeItem('token')
            await api.post('/auth/logout');
            setUser(null);
            toast.success("Logged out securely.");
        } catch (error) {
            console.error("Logout failed:", error);
            toast.error("Issue logging out. Please try again.");
        }
    }, []);

    const value = useMemo(() => ({
        user,
        isAuthenticated: !!user,
        isInitializing,
        login,
        logout,
    }), [user, isInitializing, login, logout]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};