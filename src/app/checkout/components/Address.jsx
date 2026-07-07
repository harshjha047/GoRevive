import React from 'react'

function Address({addresses, selectedAddressId, setSelectedAddressId, isLoadingAddresses, handleProceedToVerification }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#0B2136]">Select Shipping Address</h2>
                <button className="text-sm font-bold text-[#1B5E3B] hover:underline">+ Add New</button>
            </div>

            {isLoadingAddresses ? (
                <div className="py-10 text-center"><div className="w-6 h-6 border-2 border-[#1B5E3B]/20 border-t-[#1B5E3B] rounded-full animate-spin mx-auto"></div></div>
            ) : addresses.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-500 font-semibold">No addresses found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {addresses.map(addr => (
                        <div
                            key={addr.addressid}
                            onClick={() => setSelectedAddressId(addr.addressid)}
                            className={`p-4 rounded-md border-2 cursor-pointer transition-all ${selectedAddressId === addr.addressid
                                ? 'border-[#1B5E3B] bg-emerald-50/30'
                                : 'border-gray-100 hover:border-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{addr.address_type}</span>
                                    <h3 className="font-bold text-[#0B2136]">{addr.contact_name}</h3>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.addressid ? 'border-[#1B5E3B]' : 'border-gray-300'}`}>
                                    {selectedAddressId === addr.addressid && <div className="w-2.5 h-2.5 bg-[#1B5E3B] rounded-full"></div>}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {addr.plot_no}, {addr.locality}<br />
                                {addr.city}, {addr.state} - {addr.pincode}<br />
                                {addr.landmark && <span className="text-gray-400 text-xs">Landmark: {addr.landmark}</span>}
                            </p>
                            <p className="text-sm font-semibold text-gray-800 mt-2">Mobile: {addr.contact_no}</p>
                        </div>
                    ))}
                </div>
            )}

            <button
                onClick={handleProceedToVerification}
                disabled={!selectedAddressId}
                className="w-full mt-6 bg-[#0B2136] text-white font-bold py-4 rounded-xl hover:bg-[#1B5E3B] transition-colors disabled:opacity-50"
            >
                Proceed to Verification
            </button>
        </div>
    )
}

export default Address