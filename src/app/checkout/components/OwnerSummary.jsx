import React from 'react';

function OwnerSummary({ 
    cartItems, 
    formatCurrency, 
    handleProceedToPayment, 
    isInitiatingPayment, 
    unavailableItems = [], 
    removeFromCart 
}) {
    console.log('OwnerSummary cartItems:', cartItems); // Debugging line

    // Check if there are any out-of-stock items currently in the cart
    const hasUnavailableItems = cartItems.some(item => unavailableItems.includes(item.product.id));

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
            
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-[#0B2136]">Final Order Review</h2>
                {hasUnavailableItems && (
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-md animate-pulse">
                        Action Required
                    </span>
                )}
            </div>

            {/* Warning Banner */}
            {hasUnavailableItems && (
                <div className="bg-red-50 p-4 border-b border-red-100">
                    <p className="text-sm font-semibold text-red-600 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Some items sold out while you were checking out. Please remove them to proceed.
                    </p>
                </div>
            )}

            <div className="p-6 overflow-y-auto max-h-[400px]">
                <table className="w-full text-left text-sm">
                    <thead className="text-xs font-bold text-gray-400 uppercase tracking-wide border-b border-gray-100">
                        <tr>
                            <th className="pb-3">Device / IMEI</th>
                            <th className="pb-3 text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {cartItems.map((item, index) => {
                            const isUnavailable = unavailableItems.includes(item.product.id);

                            // Used standard JS comment here instead of JSX comment to prevent the crash
                            // Appended index to key to prevent React crash if identical IDs are in cart
                            return (
                                <tr key={`${item.product.id}-${index}`} className={isUnavailable ? "bg-red-50/50" : ""}>
                                    <td className="py-4 flex items-center gap-4">
                                        {/* Optional: Add Product Image */}
                                        {item.product.image && (
                                            <div className="w-12 h-12 bg-gray-50 rounded-lg border border-gray-100 flex-shrink-0 flex items-center justify-center p-1">
                                                <img src={item.product.image} alt={item.product.name} className="max-w-full max-h-full object-contain" />
                                            </div>
                                        )}
                                        <div>
                                            <p className={`font-bold ${isUnavailable ? 'text-red-700 line-through' : 'text-[#0B2136]'}`}>
                                                {item.product.model || item.product.name}
                                            </p>
                                            <p className="font-mono text-xs text-gray-500 mt-0.5">
                                                IMEI/ID: {item.product.id} • Grade {item.product.condition} • Qty: {item.quantity}
                                            </p>
                                            
                                            {/* Remove Button for Out of Stock Items */}
                                            {isUnavailable && (
                                                <button 
                                                    onClick={() => removeFromCart(item.product.id)}
                                                    className="mt-2 text-[10px] font-bold text-red-600 hover:text-red-800 hover:underline bg-red-100/50 px-2 py-1 rounded uppercase tracking-wider"
                                                >
                                                    Remove from Cart
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 text-right align-top">
                                        <span className={`font-bold ${isUnavailable ? 'text-gray-400 line-through' : 'text-[#0B2136]'}`}>
                                            {formatCurrency(item.product.price * item.quantity)}
                                        </span>
                                        {isUnavailable && (
                                            <p className="text-xs font-bold text-red-600 mt-1">Out of Stock</p>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
                <button
                    onClick={handleProceedToPayment}
                    // Disable if initiating payment, if cart is empty, OR if there are unavailable items
                    disabled={isInitiatingPayment || hasUnavailableItems || cartItems.length === 0}
                    className="w-full bg-[#0B2136] text-white font-bold py-4 rounded-xl hover:bg-[#1B5E3B] transition-colors shadow-md disabled:opacity-50"
                >
                    {hasUnavailableItems 
                        ? 'Please remove out-of-stock items' 
                        : isInitiatingPayment 
                            ? 'Connecting to Bank...' 
                            : 'Proceed to Checkout'}
                </button>
            </div>
        </div>
    );
}

export default OwnerSummary;