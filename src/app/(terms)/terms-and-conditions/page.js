import React from 'react';

export default function TermsAndConditionsPage() {
    const lastUpdated = "March 17, 2026";


  return (
    <div className="min-h-screen bg-slate-50 font-sans w-full">
      <div className="w-full bg-white shadow-sm border border-slate-100 rounded-none overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 rounded-none">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Terms & Conditions
          </h1>
          <p className="text-lg font-medium text-slate-300 mb-4">
            GoRevive Private Limited
          </p>
          <div className="inline-flex items-center rounded-none text-sm text-slate-200">
            Last updated: {lastUpdated}
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed w-full">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">01.</span> Agreement to Terms
            </h2>
            <p>
              By accessing our website and purchasing products from GoRevive Private Limited, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you must not use this website.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section className="bg-rose-50 p-6 border-l-4 border-rose-500 rounded-none shadow-sm">
            <h2 className="text-xl font-bold text-rose-950 mb-3 flex items-center gap-2">
              <span className="text-rose-600 text-lg">02.</span> Limitation of Liability and Defects
            </h2>
            <p className="text-rose-900 text-sm leading-relaxed m-0 font-medium">
              GoRevive is not in any way liable for any defects, malfunctions, or operational failures of the products sold. All items are sold as-is. We explicitly disclaim all liability for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the products.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section className="bg-rose-50 p-6 border-l-4 border-rose-500 rounded-none shadow-sm">
            <h2 className="text-xl font-bold text-rose-950 mb-3 flex items-center gap-2">
              <span className="text-rose-600 text-lg">03.</span> Refund and Return Policy
            </h2>
            <p className="text-rose-900 text-sm leading-relaxed m-0 font-medium">
              <strong className="text-rose-950 font-bold block mb-1">Strict No Refund Policy:</strong> GoRevive offers no refunds once the Asset is dispatched. All sales are final. By completing a purchase, you acknowledge and agree that you will not be entitled to a refund, return, or exchange for any reason whatsoever, including but not limited to product dissatisfaction or minor cosmetic issues.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">04.</span> Grading Accuracy
            </h2>
            <p>
              We take and grade each asset as accurately as possible based on our internal standards. However, grading is subjective, and there might be errors or oversights. <strong className="text-slate-900">GoRevive is not liable in case of any incorrect grading</strong> or discrepancies between the stated grade and the customer's perception. The buyer accepts the product grading as-is.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">05.</span> Products and Services
            </h2>
            <p>
              All products sold on this website are refurbished, second-hand, or used unless explicitly stated otherwise. All products are sold on an <strong className="text-slate-900">"AS-IS, WHERE-IS"</strong> basis.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">06.</span> Governing Law
            </h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of India. Any dispute arising from these terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
            </p>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center rounded-none">
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            If you have questions regarding these legal terms, please reach out directly to support.
          </p>
          <a 
            href="mailto:support@gorevive.in" 
            className="inline-block px-8 py-3 bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-semibold rounded-none shadow-md"
          >
            Contact Legal Support
          </a>
        </div>

      </div>
    </div>
  );
}