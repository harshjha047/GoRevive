import React from 'react';

export default function DisclaimerPage() {
    const lastUpdated = "March 17, 2026";


  return (
    <div className="min-h-screen bg-slate-50 font-sans w-full">
      <div className="w-full bg-white shadow-sm border border-slate-100 rounded-none overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 rounded-none">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Disclaimer
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
          
          <section className="bg-amber-50 p-6 border-l-4 border-amber-500 rounded-none shadow-sm">
            <h2 className="text-xl font-bold text-amber-950 mb-3 flex items-center gap-2">
              Important Liability Notice
            </h2>
            <p className="text-amber-900 text-sm leading-relaxed m-0 font-medium">
              <strong>GoRevive is not in any way liable for any defects.</strong> No refunds once Asset is dispatched. We are not liable in case of any incorrect grading. We take and grade each asset as accurately as possible, but there might be errors.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">01.</span> General Information
            </h2>
            <p>
              The information provided by GoRevive Private Limited on our website is for general informational purposes only. All information on the site is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">02.</span> Product Condition
            </h2>
            <p>
              All items are used/refurbished and sold "as-is". While we strive for accuracy in our grading process, we acknowledge that there might be errors. GoRevive assumes no responsibility for errors or omissions in the contents or the grading of the assets.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">03.</span> External Links Disclaimer
            </h2>
            <p>
              The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.
            </p>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center rounded-none">
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-6">
            For support regarding product compliance or terms, feel free to contact us.
          </p>
          <a 
            href="mailto:support@gorevive.in" 
            className="inline-block px-8 py-3 bg-indigo-500 hover:bg-indigo-400 transition-colors text-white font-semibold rounded-none shadow-md"
          >
            Contact Support
          </a>
        </div>

      </div>
    </div>
  );
}