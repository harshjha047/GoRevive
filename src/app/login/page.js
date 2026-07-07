"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/components/utils/Context/AuthContext';
import { authService } from '@/services/authService';

export default function AuthPage() {
    const router = useRouter();
    const { login, user } = useAuth();
    
    // UI State
    const [isMounted, setIsMounted] = useState(false);
    const [step, setStep] = useState('userType');
    const [loading, setLoading] = useState(false);
    const [gstVerifying, setGstVerifying] = useState(false);
    
    // Server Data State
    const [serverOtp, setServerOtp] = useState('');
    const [serverUser, setServerUser] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        telephone: "",
        otp: "",
        name: "",
        email: "",
        state: "",
        city: "",
        address_1: "",
        address_2: "",
        pincode: "",
        pancard: "",
        gst_no: "",
        password: "N/A", // Hardcoded per requirements
    });

    // Hydration Safe Init: Check for existing session or logged-in user
    useEffect(() => {
        setIsMounted(true);
        if (user) {
            router.push('/');
        } else {
            const savedType = sessionStorage.getItem('userType');
            if (savedType === 'business') setStep('phone');
            if (savedType === 'individual') setStep('appLinks');
        }
    }, [user, router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // STEP 0: Handle User Type Selection
    const handleUserTypeSelect = (type) => {
        sessionStorage.setItem('userType', type);
        setStep(type === 'business' ? 'phone' : 'appLinks');
    };

    const resetUserType = () => {
        sessionStorage.removeItem('userType');
        setStep('userType');
    };

    // STEP 1: Submit Phone Number
    const handlePhoneSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.telephone.length < 10) {
            return toast.error("Please enter a valid 10-digit mobile number");
        }

        setLoading(true);
        try {
            const response = await authService.login(formData.telephone);

            if (response?.response?.status === "true" && response.response.data?.length > 0) {
                const userData = response.response.data[0];

                // Check if dummy/unregistered user
                const isDummyUser = 
                    userData.cust_name === "XYZ" || 
                    userData.state === "state" || 
                    userData.pincode === "0";

                if (isDummyUser) {
                    toast.success("Welcome! Let's set up your business profile.");
                    setStep('register'); 
                } else {
                    setServerOtp(userData.otp); 
                    setServerUser(userData); 
                    toast.success("OTP sent to your mobile number.");
                    setStep('otp'); 
                }
            } else {
                toast.success("New number detected. Let's register.");
                setStep('register'); 
            }
        } catch (error) {
            toast.error("Failed to connect. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP
    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (formData.otp.toString() === serverOtp.toString()) {
            login(serverUser); // AuthContext handles the toast and storage
            router.push('/'); 
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    // NEW: Verify GST and Autofill
    const handleVerifyGST = async () => {
        if (!formData.gst_no || formData.gst_no.length < 15) {
            return toast.error("Please enter a valid 15-character GST number");
        }

        setGstVerifying(true);
        try {
            const res = await authService.verifyGST(formData.gst_no);
            
            if (res?.response?.status === "true" && res?.response?.data?.length > 0) {
                const gstData = res.response.data[0];
                
                // Extracting PAN from GST (Characters 3 to 12)
                const derivedPan = formData.gst_no.substring(2, 12);

                setFormData(prev => ({
                    ...prev,
                    name: gstData.tradename || gstData.name || prev.name,
                    state: gstData.state || prev.state,
                    pincode: gstData.pincode || prev.pincode,
                    address_1: gstData.street || gstData.state_address || prev.address_1,
                    city: gstData.district || gstData.city || prev.city,
                    pancard: derivedPan || prev.pancard
                }));
                toast.success("GST Verified! Details autofilled.");
            } else {
                toast.error("Invalid GST Number or not found.");
            }
        } catch (error) {
            toast.error("Failed to verify GST. You can enter details manually.");
        } finally {
            setGstVerifying(false);
        }
    };

    // STEP 3: Register Submit
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await authService.register({
                ...formData,
                create_date: today 
            });
            
            if (response?.response?.status === "true" && response?.response?.code === 200) {
                login(formData); 
                router.push('/'); 
            } else {
                toast.error(response?.response?.message || "Registration failed. Please try again.");
            }
        } catch (error) {
            toast.error("An error occurred during registration.");
        } finally {
            setLoading(false);
        }
    };

    // Prevent hydration mismatch flashes
    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        {step === 'userType' && 'Welcome to GoRevive'}
                        {step === 'appLinks' && 'Get Our App'}
                        {step === 'phone' && 'Business Login'}
                        {step === 'otp' && 'Verify Your Login'}
                        {step === 'register' && 'Business Details'}
                    </h2>
                    {step === 'phone' && <p className="mt-2 text-sm text-gray-600">Enter your registered mobile number</p>}
                    {step === 'register' && <p className="mt-2 text-sm text-gray-600">Please provide your GST to auto-fill details.</p>}
                </div>

                {/* --- ACCOUNT TYPE SELECTION --- */}
                {step === 'userType' && (
                    <div className="mt-8 space-y-4">
                        <button onClick={() => handleUserTypeSelect('business')} className="w-full py-3.5 px-4 rounded-xl bg-gray-900 text-white bg-brand-blue hover:bg-brand-blue-dark shadow-md font-semibold transition-all">
                            I am a Business / Retailer
                        </button>
                        <button onClick={() => handleUserTypeSelect('individual')} className="w-full py-3.5 px-4 rounded-xl text-gray-700 bg-white border-2 border-gray-200 hover:border-brand-blue hover:text-brand-blue font-semibold transition-all">
                            I am an Individual Customer
                        </button>
                    </div>
                )}

                {/* --- APP LINKS FOR INDIVIDUALS --- */}
                {step === 'appLinks' && (
                    <div className="mt-8 space-y-6 text-center">
                        <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg">
                            Our web portal is optimized for B2B orders. Individual users can access our platform easily by downloading our mobile app.
                        </p>
                        <div className="space-y-4">
                            <a href="https://play.google.com/store/apps/details?id=com.gorevive.gorevive&hl=en_IN" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3 rounded-xl text-white bg-green-600 hover:bg-green-700 font-medium transition-colors">
                                Download for Android
                            </a>
                            <a href="https://apps.apple.com/in/app/gorevive/id6771653345" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full py-3 rounded-xl text-white bg-gray-900 hover:bg-black font-medium transition-colors">
                                Download for iOS
                            </a>
                        </div>
                        <button onClick={resetUserType} className="text-sm font-medium text-brand-blue hover:underline mt-4">
                            ← Back
                        </button>
                    </div>
                )}

                {/* --- PHONE INPUT STEP --- */}
                {step === 'phone' && (
                    <form className="mt-8 space-y-6" onSubmit={handlePhoneSubmit}>
                        <div>
                            <input name="telephone" type="tel" required maxLength={10} value={formData.telephone} onChange={handleChange} className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all" placeholder="Enter Mobile Number" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gray-900 text-white bg-brand-blue hover:bg-brand-blue-dark shadow-md font-semibold transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? 'Checking...' : 'Continue'}
                        </button>
                        <div className="text-center mt-4">
                            <button type="button" onClick={resetUserType} className="text-sm font-medium text-gray-500 hover:text-brand-blue">
                                ← Change Account Type
                            </button>
                        </div>
                    </form>
                )}

                {/* --- OTP VERIFICATION STEP --- */}
                {step === 'otp' && (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <p className="text-sm text-gray-500 mb-2">Sent to +91 {formData.telephone}</p>
                            <input name="otp" type="text" required maxLength={6} value={formData.otp} onChange={handleChange} className="block w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-all tracking-widest text-center text-lg font-bold" placeholder="• • • • • •" />
                        </div>
                        <button type="submit" className="w-full py-3 rounded-xl bg-gray-900 text-white bg-brand-blue hover:bg-brand-blue-dark shadow-md font-semibold transition-all">
                            Verify & Login
                        </button>
                        <div className="text-center mt-2">
                            <button type="button" onClick={() => setStep('phone')} className="text-sm font-medium text-brand-blue hover:underline">
                                Edit Phone Number
                            </button>
                        </div>
                    </form>
                )}

                {/* --- REGISTRATION STEP --- */}
                {step === 'register' && (
                    <form className="mt-8 space-y-4" onSubmit={handleRegisterSubmit}>
                        <div className="space-y-4">
                            
                            {/* GST Input with Verification Button */}
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">GST Number (Optional but recommended)</label>
                                <div className="flex gap-2">
                                    <input name="gst_no" type="text" value={formData.gst_no} onChange={handleChange} placeholder="e.g., 03CMMPS2968B1ZX" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none uppercase" />
                                    <button type="button" onClick={handleVerifyGST} disabled={gstVerifying || !formData.gst_no} className="px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50 whitespace-nowrap">
                                        {gstVerifying ? 'Wait...' : 'Verify'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                                <div className="md:col-span-2">
                                    <input name="name" type="text" required value={formData.name} onChange={handleChange} placeholder="Business / Trade Name" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <input name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="Business Email" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <input name="pancard" type="text" required value={formData.pancard} onChange={handleChange} placeholder="PAN Card Number" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none uppercase" />
                                </div>
                                
                                {/* Address Fields */}
                                <div className="md:col-span-2">
                                    <input name="address_1" type="text" required value={formData.address_1} onChange={handleChange} placeholder="Shop No. / Building / Street" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <input name="address_2" type="text" value={formData.address_2} onChange={handleChange} placeholder="Locality / Landmark (Optional)" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                                
                                <div>
                                    <input name="city" type="text" required value={formData.city} onChange={handleChange} placeholder="City" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                                <div>
                                    <input name="pincode" type="text" required value={formData.pincode} onChange={handleChange} placeholder="Pincode" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <input name="state" type="text" required value={formData.state} onChange={handleChange} placeholder="State" className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-brand-blue outline-none" />
                                </div>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gray-900 text-white hover:bg-brand-blue-dark shadow-md font-semibold mt-6 transition-all disabled:opacity-70 disabled:cursor-not-allowed">
                            {loading ? 'Registering...' : 'Complete Registration'}
                        </button>
                        
                        <div className="text-center mt-2">
                            <button type="button" onClick={() => setStep('phone')} className="text-sm font-medium text-gray-500 hover:text-brand-blue">
                                Cancel & Go Back
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}