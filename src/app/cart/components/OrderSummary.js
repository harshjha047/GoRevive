import { useRouter } from 'next/navigation';
import React from 'react';

export default function OrderSummary({ cartItems = [], cartSubtotal = 0, formatCurrency }) {
  const router = useRouter();
  const isCheckoutDisabled = !cartItems || cartItems.length < 5;

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
        <h2 className="text-lg font-bold text-[#0B2136] mb-6">Order Summary</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Total Units</span>
            <span className="font-bold text-[#0B2136]">{cartItems.length}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">Subtotal</span>
            <span className="font-bold text-[#0B2136]">{formatCurrency(cartSubtotal)}</span>
          </div>
          
          {cartItems.length >= 10 && (
            <div className="flex justify-between text-emerald-600">
              <span className="font-bold">Bulk Discount (3%)</span>
              <span className="font-bold">- {formatCurrency(cartSubtotal * 0.03)}</span>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-100 pt-4 mb-8">
          <div className="flex justify-between items-end">
            <span className="text-gray-900 font-bold">Total Request</span>
            <span className="text-2xl font-black text-[#0B2136]">
              {formatCurrency(cartItems.length >= 10 ? cartSubtotal * 0.97 : cartSubtotal)}
            </span>
          </div>
        </div>
        
        <button 
          onClick={() => { router.push('/checkout') }} 
          disabled={isCheckoutDisabled} 
          className="w-full bg-[#0B2136] text-white cursor-pointer font-bold py-4 rounded-xl transition-all shadow-md hover:bg-[#1B5E3B] disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isCheckoutDisabled ? "Minimum 5 Items Required" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
}