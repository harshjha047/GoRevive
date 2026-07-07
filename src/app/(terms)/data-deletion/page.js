import React from 'react';
import Link from 'next/link';

export default function DataDeletionPage() {
  const lastUpdated = "March 17, 2026";

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className=" mx-auto bg-white shadow-sm  border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Data Deletion Request
          </h1>
          <p className="text-lg font-medium text-slate-300 mb-1">
            GoRevive Private Limited
          </p>
          <p className="text-sm font-medium text-indigo-300 italic mb-6">
            How to request the removal of your personal information from GoRevive.
          </p>
          <div className="inline-flex items-center rounded-full text-sm text-slate-200">
            Last updated: {lastUpdated}
          </div>
        </header>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-12 text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">01.</span> Your Right to be Forgotten
            </h2>
            <p>
              At GoRevive Private Limited, we respect your privacy and provide you with the ability to delete your account and associated data. Once a deletion request is processed, your personal data will be permanently removed from our active databases, subject to certain legal and transactional obligations.
            </p>
          </section>

          <hr className="border-slate-100" />

          <section className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded border border-indigo-100">
            <h2 className="text-xl font-bold text-indigo-950 mb-3">02. Where to Send Your Request</h2>
            <p className="text-indigo-900/80 text-sm mb-4">
              All data deletion requests must be sent via your registered email address to:
            </p>
            <p className="text-2xl font-bold text-indigo-600 m-0">
              <a href="mailto:support@gorevive.in" className="hover:text-indigo-500 transition-colors underline">
                support@gorevive.in
              </a>
            </p>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">03.</span> Steps to Delete Your Data
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: 'Subject Line',
                  desc: 'Use the subject line: "Data Deletion Request - [Your Full Name]"'
                },
                {
                  title: 'Provide Account Details',
                  desc: 'Mention your registered Mobile Number and Email Address in the body of the email so we can verify your identity.'
                },
                {
                  title: 'State Your Reason (Optional)',
                  desc: 'Briefly mention why you wish to delete your data. This helps us improve our services.'
                },
                {
                  title: 'Verification & Confirmation',
                  desc: 'Our support team will respond within 48–72 working hours to confirm the request and proceed with the deletion.'
                }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shrink-0 text-sm mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-md font-bold text-slate-900 mb-1">{step.title}</h3>
                    <p className="text-sm text-slate-600 m-0">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="border-slate-100" />

          <section className="bg-amber-50 p-6 rounded border border-amber-200">
            <h2 className="text-xl font-bold text-amber-950 mb-3">04. Scope of Data Deletion</h2>
            <p className="text-amber-900/80 text-sm mb-4 font-medium">
              Upon successful identity verification, GoRevive will permanently remove:
            </p>
            <ul className="space-y-2 mb-4">
              {['Your Profile Information (Name, Phone, Email).', 'Saved Shipping and Billing Addresses.', 'Account Login Credentials.'].map((item, i) => (
                <li key={i} className="flex items-center text-sm text-amber-900">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-amber-800/70 border-t border-amber-200/60 pt-3 italic m-0">
              *Note: Transactional data, invoices, and records required for tax, legal, and warranty purposes will be retained as per Indian Law for the mandatory retention period.
            </p>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12 text-center">
          <p className="text-slate-400 text-sm mb-0">
            For any other privacy-related queries, please refer to our main{' '}
            <Link href="/privacy-policy" className="text-indigo-400 hover:text-indigo-300 transition-colors font-semibold underline">
              Privacy Policy
            </Link>.
          </p>
        </div>

      </div>
    </div>
  );
}