import React from 'react'

function Verification({isVerifying, isVerified, kycData, isUploadingKyc, handleKycUpload, handleFileChange, handleProceedToSummary }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
                                <h2 className="text-xl font-bold text-[#0B2136] mb-6">B2B Compliance Check</h2>

                                {isVerifying ? (
                                    <div className="py-12 text-center">
                                        <div className="w-12 h-12 border-4 border-emerald-100 border-t-[#1B5E3B] rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="font-bold text-[#0B2136]">Checking Compliance Status...</p>
                                    </div>
                                ) : isVerified ? (
                                    <div className="py-8 text-center">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h3 className="text-2xl font-black text-[#1B5E3B]">Profile Verified</h3>
                                        <p className="text-gray-600 mt-2 mb-8">All required documents are active for GST invoicing.</p>
                                        <button
                                            onClick={handleProceedToSummary}
                                            className="w-full bg-[#0B2136] text-white font-bold py-4 rounded-xl hover:bg-[#1B5E3B] transition-colors"
                                        >
                                            Continue to Order Summary
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-4">
                                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start gap-3">
                                            <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            <div>
                                                <h4 className="font-bold text-amber-800">Action Required</h4>
                                                <p className="text-sm text-amber-700 mt-1">Your business profile is missing required documents. Please upload them to unlock wholesale purchasing.</p>
                                            </div>
                                        </div>

                                        <form onSubmit={handleKycUpload} className="space-y-5">
                                            {/* Aadhaar Upload */}
                                            {!kycData?.aadhar_img && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Aadhaar Card Image (JPG/PNG)</label>
                                                    <input
                                                        type="file"
                                                        accept=".jpg, .jpeg, .png"
                                                        onChange={(e) => handleFileChange(e, 'aadhaar')}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-[#0B2136] hover:file:bg-gray-100 border border-gray-200 rounded-lg p-1.5"
                                                    />
                                                </div>
                                            )}

                                            {/* PAN Upload */}
                                            {!kycData?.pan_img && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">PAN Card Image (JPG/PNG)</label>
                                                    <input
                                                        type="file"
                                                        accept=".jpg, .jpeg, .png"
                                                        onChange={(e) => handleFileChange(e, 'pan')}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-[#0B2136] hover:file:bg-gray-100 border border-gray-200 rounded-lg p-1.5"
                                                    />
                                                </div>
                                            )}

                                            {/* GST Upload */}
                                            {!kycData?.gst_img && (
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">GST Certificate Image (JPG/PNG)</label>
                                                    <input
                                                        type="file"
                                                        accept=".jpg, .jpeg, .png"
                                                        onChange={(e) => handleFileChange(e, 'gst')}
                                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-gray-50 file:text-[#0B2136] hover:file:bg-gray-100 border border-gray-200 rounded-lg p-1.5"
                                                    />
                                                </div>
                                            )}

                                            <button
                                                type="submit"
                                                disabled={isUploadingKyc}
                                                className="w-full mt-4 bg-[#0B2136] text-white font-bold py-4 rounded-xl hover:bg-[#1B5E3B] transition-colors disabled:opacity-50"
                                            >
                                                {isUploadingKyc ? 'Uploading...' : 'Submit Documents'}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
  )
}

export default Verification