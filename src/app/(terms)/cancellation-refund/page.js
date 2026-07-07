import React from 'react';

export default function CancellationRefundPage() {
    const lastUpdated = "March 17, 2026";


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className="mx-auto bg-white shadow-sm  border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Cancellation & Refund Policy
          </h1>
          <p className="text-lg font-medium text-slate-300 mb-4">
            GoRevive Private Limited
          </p>
          <div className="inline-flex items-center rounded-full text-sm text-slate-200">
            Last updated: {lastUpdated}
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">01.</span> Order Cancellations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 border border-slate-200 rounded bg-slate-50 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3 text-lg">Before Shipment</h3>
                <p className="text-sm">
                  Orders may be cancelled before dispatch. However, a <strong className="text-slate-900">minimum deduction of ₹500</strong> applies for payment gateway and processing charges.
                </p>
              </div>
              <div className="p-6 border border-amber-200 rounded bg-amber-50 shadow-sm">
                <h3 className="font-bold text-amber-900 mb-3 text-lg">After Dispatch</h3>
                <p className="text-sm text-amber-900/80">
                  A deduction of <strong className="text-amber-900 font-bold">5% of the total order value</strong> (minimum ₹500) will be applied for processing charges if cancelled after the item has left our facility.
                </p>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">02.</span> Refund Processing
            </h2>
            <div className="bg-white border border-slate-100 rounded p-6 shadow-sm">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-50 text-indigo-600 mr-4 shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </span>
                  <div className="text-sm">
                    <strong className="text-slate-900 block mb-1">Timeline</strong>
                    Refunds are processed within <strong className="text-slate-900">7–15 business days</strong> via the original payment method.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-50 text-indigo-600 mr-4 shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                  </span>
                  <div className="text-sm">
                    <strong className="text-slate-900 block mb-1">COD Policy</strong>
                    Partial payments made for COD orders are <strong className="text-slate-900">non-refundable</strong> if the order is refused or cancelled before delivery.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-50 text-indigo-600 mr-4 shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  </span>
                  <div className="text-sm">
                    <strong className="text-slate-900 block mb-1">Non-Refundable Costs</strong>
                    Shipping, packaging, and handling charges are excluded from the refund amount.
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="flex items-center justify-center w-6 h-6 rounded bg-indigo-50 text-indigo-600 mr-4 shrink-0 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </span>
                  <div className="text-sm">
                    <strong className="text-slate-900 block mb-1">Adjustments</strong>
                    Refunds may be adjusted if products are returned damaged or missing components.
                  </div>
                </li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">03.</span> Accessory Policy
            </h2>
            <p className="mb-6">
              Replacements for accessories are available within <strong className="text-slate-900">7 days</strong> for manufacturing defects, mismatches, or shipping damage.
            </p>
            
            <div className="bg-slate-50 border-l-4 border-indigo-400 p-6 rounded-r-xl">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Mandatory Conditions</h3>
              <ul className="space-y-2">
                {[
                  'Returns are NOT accepted once the box seal/tag is removed (unless defective).',
                  'Buyer must ship the product back within 7 days of approval.',
                  'Items must be in original condition; tampered or incomplete returns will be rejected.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 mt-1.5 shrink-0"></span>
                    <span className="text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center">
          <p className="text-slate-300 mb-6 max-w-md mx-auto">
            If a replacement is unavailable for a defective product, a full refund or <strong className="text-white">wallet credit</strong> may be provided at our discretion.
          </p>
          <a 
            href="mailto:support@gorevive.in" 
            className="inline-block px-8 py-3 bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-semibold rounded-lg shadow-md hover:shadow-lg"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}