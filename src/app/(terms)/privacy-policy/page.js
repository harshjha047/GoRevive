import React from 'react';

export default function PrivacyPolicyPage() {
    const lastUpdated = "March 17, 2026";


  return (
    <div className="min-h-screen bg-slate-50  font-sans">
      <div className=" mx-auto bg-white  shadow-sm  border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Privacy Policy
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
              <span className="text-indigo-500 text-lg">01.</span> Introduction
            </h2>
            <p className="mb-6">
              GoRevive Private Limited (“we”, “our”, or “us”) values your trust and is committed to safeguarding your personal information. This Privacy Policy outlines how we collect, use, disclose, and protect your information when you access or use our Website and Mobile Application.
            </p>
            <div className="bg-indigo-50 border-l-4 border-indigo-500 p-5 rounded-r-lg text-indigo-900 text-sm font-medium">
              By accessing or using our services, you agree to the terms outlined in this Privacy Policy. If you do not agree, please discontinue use of our website or Application.
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">02.</span> Information We Collect
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">A. Personal Information</h3>
                <ul className="space-y-2">
                  {['Full Name or Business/Firm Name', 'Email Address and Phone Number', 'Billing & Shipping Address', 'B2B Data: GST, Bank Details, or PAN', 'Usage Data and transaction history'].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <svg className="w-5 h-5 text-emerald-500 mr-2 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-3">B. Derivative Data</h3>
                <p className="text-sm mb-3">Automatically collected for performance and security:</p>
                <div className="grid grid-cols-2 gap-3">
                  {['IP Address', 'Browser Type', 'OS Version', 'Access Times'].map((item, i) => (
                    <div key={i} className="bg-slate-100 px-3 py-2 rounded-md text-xs font-medium text-slate-700 text-center">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">03.</span> How We Use Your Information
            </h2>
            <p className="mb-4">We use your data for legitimate business purposes, such as:</p>
            <div className="bg-slate-50 border border-slate-100 rounded p-6">
              <ul className="space-y-3">
                <li className="flex items-center text-sm"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></span> Managing accounts and processing orders/invoices.</li>
                <li className="flex items-center text-sm"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></span> Delivering products and improving our Application.</li>
                <li className="flex items-center text-sm"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></span> Responding to support requests.</li>
                <li className="flex items-center text-sm"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3"></span> Preventing fraudulent activity and ensuring security.</li>
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">04.</span> Sharing and Disclosure
            </h2>
            <p className="mb-4">We <strong className="text-slate-900">do not sell, rent, or trade</strong> your personal information. We only share data with trusted partners essential for our operations:</p>
            <div className="flex flex-wrap gap-3">
              {['Payment Gateways', 'Logistics Partners', 'IT & Hosting'].map(item => (
                <span key={item} className="px-4 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-full text-sm font-medium shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded border border-indigo-100">
            <h2 className="text-xl font-bold mb-2 text-indigo-950">05. Social Media Login</h2>
            <p className="text-indigo-900/80 text-sm leading-relaxed">
              Our platform allows registration via <strong className="text-indigo-950">Google, Facebook, and Twitter</strong>. By signing in through these, we may access your name, email, and profile info as permitted by your platform settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">06.</span> Cookies & Tracking
            </h2>
            <div className="overflow-hidden rounded border border-slate-200 shadow-sm">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-slate-900">Cookie Type</th>
                    <th className="px-6 py-4 font-semibold text-slate-900">Persistence</th>
                    <th className="px-6 py-4 font-semibold text-slate-900">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Essential</td>
                    <td className="px-6 py-4 text-slate-500">Session</td>
                    <td className="px-6 py-4">Authentication and core security.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Consent</td>
                    <td className="px-6 py-4 text-slate-500">Persistent</td>
                    <td className="px-6 py-4">Records your acceptance of our policies.</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 font-medium text-slate-900">Functionality</td>
                    <td className="px-6 py-4 text-slate-500">Persistent</td>
                    <td className="px-6 py-4">Remembers logins and language settings.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">07.</span> Data Security
            </h2>
            <p className="text-sm">
              While we implement administrative and technical safeguards, no electronic transmission is 100% secure. 
              <strong className="text-slate-900 ml-1">Users share information at their own risk.</strong>
            </p>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3">Have questions?</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            If you have questions, concerns, or wish to request account deletion, our support team is here to help.
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