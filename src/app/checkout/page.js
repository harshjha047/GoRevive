"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/utils/Context/AuthContext';
import { useCart } from '@/components/utils/Context/CartContext';
import toast from 'react-hot-toast';
import api from '@/lib/apiClient';
import SidebarSummary from './components/SidebarSummary';
import StepperHeader from './components/StepperHeader';
import Address from './components/Address';
import Verification from './components/Verification';
import OwnerSummary from './components/OwnerSummary';
import Payment from './components/Payment';
import { load } from '@cashfreepayments/cashfree-js';

const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount).replace(/\s/g, '');

const STEPS = [
    { id: 1, name: 'Shipping Address' },
    { id: 2, name: 'B2B Verification' },
    { id: 3, name: 'Order Summary' },
    { id: 4, name: 'Payment' }
];

export default function CheckoutPage() {
    const router = useRouter();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const { cartItems, cartSubtotal, loading: cartLoading, removeFromCart } = useCart();

    console.log(user);


    const [currentStep, setCurrentStep] = useState(1);

    // Address State
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);

    // Verification State
    const [isVerifying, setIsVerifying] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    const [kycData, setKycData] = useState(null);
    const [kycFiles, setKycFiles] = useState({ aadhaar: null, pan: null, gst: null });
    const [isUploadingKyc, setIsUploadingKyc] = useState(false);

    const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);

    const [isCheckingInventory, setIsCheckingInventory] = useState(false);
    const [unavailableItems, setUnavailableItems] = useState([]);

    // ==========================================
    // INITIALIZATION & GUARDS
    // ==========================================
    useEffect(() => {
        if (!cartLoading && cartItems.length === 0) {
            toast.error("Your cart is empty. Redirecting to inventory.");
            router.push('/products');
        }
    }, [isAuthenticated, authLoading, cartItems.length, cartLoading, router]);

    // Fetch Addresses
    useEffect(() => {
        if (isAuthenticated && user?.crm_party_code) {
            const fetchAddresses = async () => {
                try {
                    const response = await api.get(`/user/addresses?userId=${user.crm_party_code}`);
                    if (response.data.success) {
                        setAddresses(response.data.addresses);
                        // Auto-select first address if available
                        if (response.data.addresses.length > 0) {
                            setSelectedAddressId(response.data.addresses[0].addressid);
                        }
                    }
                } catch (error) {
                    toast.error("Failed to load saved addresses.");
                } finally {
                    setIsLoadingAddresses(false);
                }
            };
            fetchAddresses();
        }
    }, [isAuthenticated, user]);

    // ==========================================
    // PIPELINE HANDLERS
    // ==========================================
    const handleProceedToVerification = () => {
        if (!selectedAddressId) return toast.error("Please select a shipping address.");
        setCurrentStep(2);
        fetchKycStatus();
    };

    const fetchKycStatus = async () => {
        setIsVerifying(true);
        try {
            const response = await api.get(`/user/kyc?userId=${user.crm_party_code}`);
            console.log(response)
            if (response.data?.success) {
                const data = response.data.kycData;
                setKycData(data);
                if (data.aadhar_img && data.pan_img && data.gst_img) {
                    setIsVerified(true);
                } else {
                    setIsVerified(false);
                }
            }
        } catch (error) {
            toast.error("Could not verify B2B status.");
            setIsVerified(false);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleFileChange = (e, documentType) => {
        const file = e.target.files[0];
        if (!file) return;

        // Strict frontend enforcement matching the PHP error
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
            toast.error("Only JPG, JPEG, and PNG files are allowed.");
            e.target.value = ''; // Reset the input
            return;
        }

        setKycFiles(prev => ({ ...prev, [documentType]: file }));
    };

    const handleKycUpload = async (e) => {
        e.preventDefault();

        // Only enforce upload if the PHP backend says it's missing
        if (!kycData?.aadhar_img && !kycFiles.aadhaar) return toast.error("Aadhaar image is required.");
        if (!kycData?.pan_img && !kycFiles.pan) return toast.error("PAN image is required.");
        if (!kycData?.gst_img && !kycFiles.gst) return toast.error("GST Certificate image is required.");

        setIsUploadingKyc(true);
        const toastId = toast.loading("Uploading business documents...");

        try {
            const formData = new FormData();
            formData.append('dist_code', user.crm_party_code);

            if (kycFiles.aadhaar) formData.append('aadhaar_image', kycFiles.aadhaar);
            if (kycFiles.pan) formData.append('pan_image', kycFiles.pan);
            if (kycFiles.gst) formData.append('gst_image', kycFiles.gst);

            const response = await api.post('/user/kyc/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });


            if (response.data.success) {
                toast.success("Documents verified successfully!", { id: toastId });
                setIsVerified(true);
                setKycData({ ...kycData, aadhar_img: 'uploaded', pan_img: 'uploaded', gst_img: 'uploaded' });
            } else {
                toast.error(response.data.message || "Upload failed.", { id: toastId });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Server error during upload.", { id: toastId });
        } finally {
            setIsUploadingKyc(false);
        }
    };

    const handleProceedToSummary = () => {
        if (!isVerified) return toast.error("You must complete verification first.");


        const outOfStockIds = cartItems
            .filter(item => item.product.isStock !== "Available" || item.product.stock < item.quantity)
            .map(item => item.product.id);

        setUnavailableItems(outOfStockIds);

        if (outOfStockIds.length > 0) {
            toast.error("Some items in your cart are no longer available.");
        } else {
            setCurrentStep(3);
        }


    };

    const handleInitiatePayment = async (gateway, option) => {
        setIsInitiatingPayment(true);
        const toastId = toast.loading(`Creating Purchase Order...`);

        try {
            const orderId = `GR_${user.crm_party_code}_${Date.now()}`;

            // Find the selected address object
            const selectedAddress = addresses.find(a => a.addressid === selectedAddressId);

            // ==========================================
            // STEP 1: CREATE PURCHASE ORDER (PO)
            // ==========================================
            const pad = (n) => n.toString().padStart(2, '0');
            const d = new Date();
            const formattedDate = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;

            const poPayload = {
                order_details: cartItems.map(item => ({
                    sku_id: item.product.model_code || "",
                    imei: item.product.id || "",
                    qnty: item.quantity.toString(),
                    item_category: item.product.condition || item.product.category || "Unknown",
                    item_name: item.product.name || "",
                    item_price: item.product.price
                })),
                order_no: orderId,
                order_date: formattedDate,
                tot_qnty: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                tot_amount: totalRequestAmount,
                payment_mode: gateway, // HDFC or CASHFREE
                cod_charges: "",
                payment_remark: "B2B Website Order",
                crm_party_code: user?.crm_party_code || "",
                party_name: user?.cust_name || "User",
                party_mobile: user?.mobile || "",
                party_email: user?.email || "",
                shipping_address: selectedAddress?.address1 || "",
                shipping_city: selectedAddress?.city || "",
                shipping_state: selectedAddress?.state || "",
                shipping_zip: selectedAddress?.pincode || ""
            };

            const poResponse = await api.post('/order/po', poPayload);

            if (!poResponse.data.success) {
                toast.error("Failed to sync Purchase Order.", { id: toastId });
                setIsInitiatingPayment(false);
                return;
            }

            // ==========================================
            // STEP 2: INITIATE PAYMENT GATEWAY
            // ==========================================
            toast.loading(`Connecting to ${gateway}...`, { id: toastId });

            const paymentPayload = {
                orderId,
                amount: totalRequestAmount,
                customerId: user.crm_party_code,
                customerPhone: user.mobile,
                customerEmail: user.email,
                gateway
            };

            if (gateway === 'HDFC' && option) {
                paymentPayload.payment_filter = {
                    allowDefaultOptions: false,
                    options: [{ paymentMethodType: option, enable: true }]
                };
            } else if (gateway === 'CASHFREE' && option) {
                    paymentPayload.payment_methods_filters = option;
            }

            const response = await api.post('/payment/create', paymentPayload);

            if (!response.data.success) {
                toast.error(response.data.message || "Failed to initialize payment.", { id: toastId });
                setIsInitiatingPayment(false);
                return;
            }

            // ==========================================
            // STEP 3: REDIRECT (HDFC) OR MODAL (CASHFREE)
            // ==========================================
            if (gateway === 'HDFC') {
                toast.success("Redirecting to Secure Gateway...", { id: toastId });
                window.location.href = response.data.paymentUrl;

            } else if (gateway === 'CASHFREE') {
                const cashfree = await load({ mode: "sandbox" }); 
                toast.dismiss(toastId);

                const result = await cashfree.checkout({
                    paymentSessionId: response.data.sessionId,
                    redirectTarget: "_modal"
                });

                if (result.error) {
                    toast.error("Payment failed: " + result.error.message);
                    setIsInitiatingPayment(false);
                } else if (result.paymentDetails) {

                    // ==========================================
                    // STEP 3 (CASHFREE ONLY): CREATE INVOICE
                    // ==========================================
                    toast.loading("Payment verified! Generating Invoice...", { id: toastId });

                    try {
                        const invoicePayload = {
                            order_no: orderId,
                            invoice_no: "",
                            invoice_date: formattedDate.split(' ')[0],
                            tot_qty: cartItems.reduce((acc, item) => acc + item.quantity, 0),
                            tot_discount_amt: 0,
                            tot_taxable_amt: totalRequestAmount,
                            tot_cgst_amt: 0,
                            tot_sgst_amt: 0,
                            tot_igst_amt: 0,
                            tot_amount: totalRequestAmount,
                            payment_mode: "Cashfree",
                            wallet_amount: 0,
                            cashfree_amount: totalRequestAmount,
                            extra_charges: "",
                            extra_per: 0,
                            extra_amt: 0,
                            crm_party_code: user.crm_party_code,
                            payment_reference: orderId,
                            payment_status: "Success",
                            company_gstno: "",
                            customer_gstno: "",
                            party_name: user.cust_name,
                            party_mobile: user.mobile,
                            party_email: user.email,
                            shipping_address: selectedAddress?.address1 || "",
                            shipping_city: selectedAddress?.city || "",
                            shipping_state: selectedAddress?.state || "",
                            shipping_zip: selectedAddress?.pincode || "",
                            ship_from_state: "Delhi",
                            ship_from_addrs: "",
                            invoice_details: cartItems.map(item => ({
                                model_name: item.product.name,
                                model_code: item.product.model_code || "",
                                type: item.product.category || "Unknown",
                                hsn_code: item.product.hsn_code || "",
                                qty: item.quantity.toString(),
                                imei1: item.product.id,
                                imei2: "",
                                disccount: "0.00",
                                item_category: item.product.condition || item.product.category || "D",
                                purchase_price: item.product.price,
                                taxable_value: item.product.price * item.quantity,
                                cgst_per: "0.00",
                                cgst_amount: "0.00",
                                sgst_per: "0.00",
                                sgst_amount: "0.00",
                                igst_per: "0.00",
                                igst_amount: "0.00",
                                price: item.product.price.toString(),
                                item_total: (item.product.price * item.quantity).toString()
                            }))
                        };

                        await api.post('/order/invoice', invoicePayload);
                        toast.success("Order Complete!", { id: toastId });

                        // Redirect to success page manually since modal didn't redirect
                        router.push(`/checkout/status?order_id=${orderId}&gateway=CASHFREE`);

                    } catch (invoiceError) {
                        toast.error("Payment successful, but failed to generate invoice.", { id: toastId });
                        router.push(`/checkout/status?order_id=${orderId}&gateway=CASHFREE`);
                    }
                }
            }
        } catch (error) {
            toast.error("Network error while connecting to bank.", { id: toastId });
            setIsInitiatingPayment(false);
        }
    };

    const handleProceedToPayment = async () => {
        // setIsInitiatingPayment(true);
        // const toastId = toast.loading("Securely connecting to HDFC SmartGateway...");

        setCurrentStep(4);
        // try {
        //     const orderId = `GR_${user.crm_party_code}_${Date.now()}`;

        //     const response = await api.post('/payment/create', {
        //         orderId: orderId,
        //         amount: totalRequestAmount,
        //         customerId: user.crm_party_code,
        //         customerPhone: user.mobile,
        //         customerEmail: user.email
        //     });

        //     if (response.data.success && response.data.paymentLinks?.web) {
        //         toast.success("Redirecting to payment gateway...", { id: toastId });

        //         window.location.href = response.data.paymentLinks.web;
        //     } else {
        //         toast.error("Failed to initialize payment gateway.", { id: toastId });
        //         setIsInitiatingPayment(false);
        //     }
        // } catch (error) {
        //     toast.error("Network error while connecting to bank.", { id: toastId });
        //     setIsInitiatingPayment(false);
        // }
    };




    // ==========================================
    // RENDER HELPERS
    // ==========================================
    if (authLoading || cartLoading) {
        return <div className="min-h-screen bg-[#F8FAFC] flex justify-center py-20"><div className="w-10 h-10 border-4 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin"></div></div>;
    }

    const totalRequestAmount = cartItems.length >= 10 ? cartSubtotal * 0.97 : cartSubtotal;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-24 py-12">
            <div className="container mx-auto px-4 max-w-[1000px]">

                {/* Stepper Header */}
                <StepperHeader currentStep={currentStep} STEPS={STEPS} />


                <div className="flex flex-col lg:flex-row gap-8 mt-16">
                    {/* LEFT COLUMN: Main Steps */}
                    <div className="lg:w-[65%] w-full">

                        {/* STEP 1: ADDRESS */}
                        {currentStep === 1 && (
                            <Address
                                addresses={addresses}
                                selectedAddressId={selectedAddressId}
                                setSelectedAddressId={setSelectedAddressId}
                                isLoadingAddresses={isLoadingAddresses}
                                handleProceedToVerification={handleProceedToVerification}
                            />
                        )}

                        {/* STEP 2: VERIFICATION */}
                        {currentStep === 2 && (
                            <Verification
                                isVerifying={isVerifying}
                                isVerified={isVerified}
                                kycData={kycData}
                                isUploadingKyc={isUploadingKyc}
                                handleKycUpload={handleKycUpload}
                                handleFileChange={handleFileChange}
                                handleProceedToSummary={handleProceedToSummary}
                            />
                        )}

                        {/* STEP 3: ORDER SUMMARY */}
                        {currentStep === 3 && (
                            <OwnerSummary
                                cartItems={cartItems}
                                formatCurrency={formatCurrency}
                                handleProceedToPayment={handleProceedToPayment}
                                isInitiatingPayment={isInitiatingPayment}
                                unavailableItems={unavailableItems}
                                removeFromCart={removeFromCart}
                            />
                        )}

                        {/* STEP 4: PAYMENT */}
                        {currentStep === 4 && (
                            <Payment
                                onInitiatePayment={handleInitiatePayment}
                                isInitiatingPayment={isInitiatingPayment}
                            />
                        )}
                    </div>

                    {/* RIGHT COLUMN: Permanent Sidebar Summary */}
                    <SidebarSummary
                        cartItems={cartItems}
                        cartSubtotal={cartSubtotal}
                        totalRequestAmount={totalRequestAmount}
                        formatCurrency={formatCurrency}
                    />
                </div>

            </div>
        </div>
    );
}