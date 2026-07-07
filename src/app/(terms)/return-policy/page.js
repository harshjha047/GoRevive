import React from 'react';

export default function ReturnPolicyPage() {
    const lastUpdated = "March 17, 2026";


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className=" mx-auto bg-white shadow-sm  border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Return & Cancellation Policy
          </h1>
          <p className="text-lg font-medium text-slate-300 mb-1">
            GoRevive Private Limited
          </p>
          <p className="text-sm font-medium text-indigo-300 italic mb-6">
            Applicable to All Products Purchased via the GoRevive Application (Android/iOS)
          </p>
          <div className="inline-flex items-center rounded-full text-sm text-slate-200">
            Last updated: {lastUpdated}
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">01.</span> Our Commitment
            </h2>
            <p>
              At GoRevive Pvt. Ltd., our goal is to provide dependable, affordable, and quality-tested refurbished electronics. Since refurbished devices differ from brand-new products, we believe in complete transparency regarding product condition and return procedures.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">02.</span> Understanding Refurbished Products
            </h2>
            <p className="mb-6">
              All products are pre-owned or professionally refurbished. While they are verified for functionality, the following conditions are considered <strong className="text-slate-900">normal</strong> and do <strong className="text-slate-900">not</strong> qualify for return:
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded p-6">
              <ul className="grid sm:grid-cols-2 gap-4">
                {[
                  'Battery backup of 1 hour or more under normal usage.',
                  'Minor or major surface scratches, marks, or noticeable dents.',
                  'Faded keys or cosmetic wear consistent with the product grade.',
                  'Availability of compatible (rather than original) accessories.'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full mr-3 mt-1.5 shrink-0"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="bg-emerald-50 p-6 rounded border border-emerald-100">
            <h2 className="text-xl font-bold text-emerald-950 mb-4 flex items-center gap-2">
              <span className="text-emerald-600 text-lg">03.</span> 7-Day Return Eligibility
            </h2>
            <p className="text-emerald-900/80 text-sm font-medium mb-4">
              Returns are accepted within <strong className="text-emerald-900">7 calendar days</strong> of delivery only for the following reasons:
            </p>
            <ul className="space-y-3">
              {[
                'Complete non-functionality (Dead on Arrival).',
                'Verified hardware defects not matching the declared grade.',
                'Incorrect specifications (e.g., wrong RAM, Storage, or Processor).',
                'Missing components explicitly mentioned in the listing.'
              ].map((item, i) => (
                <li key={i} className="flex items-start text-sm text-emerald-900">
                  <svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="mt-0.5">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">04.</span> How to Initiate a Return
            </h2>
            <p className="mb-6">To start a return or exchange request, you must complete the following steps:</p>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-4 shrink-0 text-xs font-bold border border-indigo-200">1</span>
                <span className="text-sm mt-0.5">Submit the request within 7 days of delivery.</span>
              </div>
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-4 shrink-0 text-xs font-bold border border-indigo-200">2</span>
                <span className="text-sm mt-0.5">Provide clear photo or video evidence of the issue.</span>
              </div>
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-4 shrink-0 text-xs font-bold border border-indigo-200">3</span>
                <span className="text-sm mt-0.5">
                  Fill out the <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500 underline">Return & Exchange Form</a>.
                </span>
              </div>
              <div className="flex items-start">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 mr-4 shrink-0 text-xs font-bold border border-indigo-200">4</span>
                <span className="text-sm mt-0.5">Email us at <strong className="text-slate-900">Support@gorevive.in</strong>.</span>
              </div>
            </div>
          </section>

          <section className="bg-rose-50 p-6 rounded border border-rose-100">
            <h2 className="text-xl font-bold text-rose-950 mb-4 flex items-center gap-2">
              <span className="text-rose-600 text-lg">05.</span> Non-Returnable Conditions
            </h2>
            <p className="text-rose-900/80 text-sm font-medium mb-4">
              Return requests will be strictly rejected if:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                'The warranty seal is broken or tampered with.',
                'Issues are caused by pirated software or unauthorized OS.',
                'The request is based on personal preference or "buyer’s remorse."',
                'The item was sold as a "Clearance Sale," "Sample Sale," or "As-Is."',
                'Orders were placed using discount/referral codes.',
                'Cosmetic wear falls within defined QC grading norms.'
              ].map((item, i) => (
                <div key={i} className="flex items-start text-sm text-rose-900 bg-white/50 p-3 rounded-lg border border-rose-100/50">
                  <svg className="w-4 h-4 text-rose-500 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center">
          <p className="text-slate-300 mb-6 max-w-md mx-auto font-medium">
            Our support team will respond to all verified return requests within <span className="text-white font-bold">24–48 working hours</span>.
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