import React from 'react';

function SidebarSummary({ 
    cartItems, 
    cartSubtotal, 
    totalRequestAmount, 
    walletBalance,
    applicableWalletAmount,
    finalPayable,
    isWalletLoading,
    formatCurrency 
}) {

    return (
        <div className="lg:w-[35%] w-full">
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
                <h2 className="text-lg font-bold text-[#0B2136] mb-6">Payment Overview</h2>

                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Total Assets</span>
                        <span className="font-bold text-[#0B2136]">{cartItems.length} Units</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Subtotal</span>
                        <span className="font-bold text-[#0B2136]">{formatCurrency(cartSubtotal)}</span>
                    </div>
                    {cartItems.length >= 10 && (
                        <div className="flex justify-between text-sm text-emerald-600">
                            <span className="font-bold">Bulk Discount (3%)</span>
                            <span className="font-bold">- {formatCurrency(cartSubtotal * 0.03)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500 font-medium">Shipping</span>
                        <span className="font-bold text-[#1B5E3B]">Calculated Post-Approval</span>
                    </div>

                    {/* NEW: Display Wallet Deduction */}
                    {!isWalletLoading && walletBalance > 0 && (
                        <div className="flex justify-between text-sm text-blue-600 bg-blue-50 p-2 rounded-lg -mx-2 px-2">
                            <span className="font-bold">Wallet Applied</span>
                            <span className="font-bold">- {formatCurrency(applicableWalletAmount)}</span>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4">
                    {/* Show old total crossed out if wallet is applied */}
                    <div className="flex justify-between items-end mb-2">
                        <span className="text-gray-900 font-medium">Order Total</span>
                        <span className={`text-lg font-bold ${walletBalance > 0 ? 'text-gray-400 line-through' : 'text-[#0B2136]'}`}>
                            {formatCurrency(totalRequestAmount)}
                        </span>
                    </div>
                    
                    {/* Show true final payable */}
                    {walletBalance > 0 && (
                        <div className="flex justify-between items-end">
                            <span className="text-[#0B2136] font-black text-lg">Final Payable</span>
                            <span className="text-3xl font-black text-[#0B2136]">
                                {formatCurrency(finalPayable)}
                            </span>
                        </div>
                    )}
                    
                    <p className="text-[10px] text-gray-400 text-right mt-1">Exclusive of GST & Logistics</p>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-500">100% Secure</p>
                        <p className="text-xs font-bold text-[#0B2136] mt-0.5">256-Bit SSL</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center border border-gray-100">
                        <p className="text-[10px] font-black uppercase text-gray-500">B2B Certified</p>
                        <p className="text-xs font-bold text-[#0B2136] mt-0.5">GST Invoicing</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SidebarSummary;