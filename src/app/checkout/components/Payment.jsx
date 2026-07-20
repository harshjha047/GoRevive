import { WalletMinimal } from 'lucide-react';
import React from 'react';

function Payment({ onInitiatePayment, isInitiatingPayment }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-[#0B2136] mb-6">Select Payment Method</h2>

            <div className="flex flex-col gap-4 max-w-sm mx-auto">
                <button
                    className="border-2 border-gray-200 text-gray-700 gap-2 font-bold py-4 rounded-xl hover:bg-gray-50 flex justify-center items-center disabled:opacity-50 transition-colors"
                >
                    <WalletMinimal strokeWidth={1.25} />

                    Pay via Wallet
                </button>
                <button
                    disabled={isInitiatingPayment}
                    onClick={() => onInitiatePayment('CASHFREE', "")}
                    className="border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-xl hover:bg-gray-50 flex justify-center items-center disabled:opacity-50 transition-colors"
                >
                    <img src="/UPI_logo.svg" className='h-5 mr-3' alt="UPI" />
                    Pay via UPI
                </button>

                <button
                    disabled={isInitiatingPayment}
                    onClick={() => onInitiatePayment('CASHFREE', "nb")}
                    className="bg-green-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                    Net Banking
                </button>

                <button
                    disabled={isInitiatingPayment}
                    onClick={() => onInitiatePayment('CASHFREE', "cc,dc")}
                    className="bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                    Pay via Credit / Debit Card
                </button>
            </div>

            {isInitiatingPayment && (
                <p className="text-sm text-gray-500 mt-6 font-medium animate-pulse">
                    Securely connecting to banking partner...
                </p>
            )}
        </div>
    );
}

export default Payment;