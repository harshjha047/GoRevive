import React from 'react';

export default function ShippingPolicyPage() {
  const lastUpdated = "March 17, 2026";
  

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className=" mx-auto bg-white shadow-sm border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Shipping Policy
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
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">01.</span> Order Processing Times
            </h2>
            <p className="mb-6">
              All orders are usually processed within <strong className="text-slate-900">2–3 Working days</strong> (excluding public holidays) after your order confirmation email is received or after confirmation through a phone call. 
            </p>
            <div className="bg-slate-50 border-l-4 border-slate-400 p-5 rounded-r-lg text-slate-700 text-sm font-medium">
              Once your order has been shipped, you will receive another notification confirming the shipment.
            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded border border-indigo-100">
            <h2 className="text-xl font-bold mb-2 text-indigo-950 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">02.</span> Shipping Charges
            </h2>
            <p className="text-indigo-900/80 text-sm leading-relaxed">
              Shipping fees are calculated automatically and will be shown to you during the checkout process before you complete your purchase.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">03.</span> Delayed or Missing Orders
            </h2>
            <p>
              If your order has not arrived within <strong className="text-slate-900">10 days</strong> after receiving the shipping confirmation email, please contact us with your name and order number, and we will investigate the issue as soon as possible.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">04.</span> Satisfaction & Returns
            </h2>
            <p>
              If for any reason you are not fully satisfied with your purchase, we encourage you to review our <strong className="text-slate-900">Return and Refund Policy</strong> for further details regarding our strict no-refund guidelines.
            </p>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Have delivery questions?</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            If you have any questions regarding your delivery or need to report a missing order, our support team is here to help.
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