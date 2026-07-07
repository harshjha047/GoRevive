import React from 'react';

export default function WarrantyPolicyPage() {
    const lastUpdated = "March 17, 2026";


  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <div className=" mx-auto bg-white shadow-sm  border-slate-100 overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Warranty Policy
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
              <span className="text-indigo-500 text-lg">01.</span> Overview
            </h2>
            <p className="mb-6">
              GoRevive is dedicated to providing high-quality pre-owned products that meet customer expectations. This warranty policy explains the terms and conditions under which GoRevive provides warranty services for its pre-owned hardware products and accessories.
            </p>
            <div className="bg-amber-50 border border-amber-200 p-6 rounded shadow-sm">
              <strong className="text-amber-900 block mb-2 text-sm uppercase tracking-wider">Important Note</strong>
              <p className="text-amber-900/80 text-sm m-0 leading-relaxed">
                This warranty applies only to products purchased directly from the GoRevive official website or mobile application. Products purchased from third-party marketplaces where GoRevive acts as a seller are not covered under this warranty. In such cases, please refer to the warranty and return policies of the respective marketplace.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">02.</span> Warranty Period
            </h2>
            
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Standard Warranty</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-6 border border-slate-200 rounded bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Products Other Than Apple</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 mt-1.5 shrink-0"></span>
                    <span><strong className="text-slate-700">For B2B:</strong> 7 days warranty</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 mt-1.5 shrink-0"></span>
                    <span><strong className="text-slate-700">For B2C (End Users):</strong> 30 days warranty from the date of purchase (Direct App/Web only).</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 border border-slate-200 rounded bg-slate-50 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">Apple Products</h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 mt-1.5 shrink-0"></span>
                    <span><strong className="text-slate-700">For B2B:</strong> 7 days warranty</span>
                  </li>
                  <li className="flex items-start">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-3 mt-1.5 shrink-0"></span>
                    <span><strong className="text-slate-700">For B2C (End Users):</strong> 15 days warranty from the date of purchase (Direct App/Web only).</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded border border-indigo-100">
              <h3 className="text-md font-bold text-indigo-950 mb-2">Extended Warranty</h3>
              <p className="text-indigo-900/80 text-sm leading-relaxed">
                Customers purchasing products as end users (B2C) have the option to purchase an extended warranty for an additional cost, which provides coverage for up to six months beyond the standard warranty period.
              </p>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">03.</span> Coverage
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Materials & Workmanship</h3>
                <p className="text-sm">
                  This warranty covers defects in materials and workmanship for the pre-owned hardware product and any accessories included in the original GoRevive packaging, provided the product is used according to GoRevive’s published guidelines (specifications, manuals, and service instructions).
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Hardware Components Covered</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['Screen', 'Motherboard', 'Keyboard', 'Hard drive and RAM', 'Original Included Accessories'].map((item, i) => (
                    <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-md text-sm shadow-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
                <p className="text-sm">
                  If any of these components fail due to manufacturing defects or normal usage within the warranty period, GoRevive will repair or replace the affected hardware.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-rose-50 p-8 rounded-2xl border border-rose-100">
            <h2 className="text-2xl font-bold text-rose-950 mb-6 flex items-center gap-2">
              <span className="text-rose-600 text-lg">04.</span> What is Not Covered
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-white/60 p-4 rounded-lg border border-rose-100/50">
                <strong className="block text-rose-900 mb-1 text-sm">Physical Damage</strong>
                <p className="text-xs text-rose-900/70 m-0">Damage caused by accidental drops, impacts, or mishandling.</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg border border-rose-100/50">
                <strong className="block text-rose-900 mb-1 text-sm">Liquid Damage</strong>
                <p className="text-xs text-rose-900/70 m-0">Damage caused by exposure to moisture or liquid spills.</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg border border-rose-100/50">
                <strong className="block text-rose-900 mb-1 text-sm">High Voltage Damage</strong>
                <p className="text-xs text-rose-900/70 m-0">Electrical damage caused by unstable or excessive voltage supply.</p>
              </div>
              <div className="bg-white/60 p-4 rounded-lg border border-rose-100/50">
                <strong className="block text-rose-900 mb-1 text-sm">Third-Party Accessories</strong>
                <p className="text-xs text-rose-900/70 m-0">Components/accessories not strictly issued by GoRevive.</p>
              </div>
            </div>

            <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wider mb-2">Software Exclusions</h3>
            <p className="text-sm text-rose-900/80 mb-2">This warranty strictly does not cover any software matters, including:</p>
            <ul className="flex flex-wrap gap-4 text-sm text-rose-900/80 font-medium">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> Operating systems</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> Installed applications</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-rose-400 rounded-full mr-2"></span> Other software programs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">05.</span> Specific Warranty Exclusions
            </h2>
            <p className="mb-4 text-sm">This warranty completely voids or does not apply to:</p>
            <div className="bg-slate-50 border border-slate-100 rounded p-6">
              <ul className="space-y-3">
                {[
                  'Consumable components such as batteries (unless failure is due to manufacturing defects).',
                  'Cosmetic damage including scratches, dents, or broken plastics.',
                  'Damage caused by using third-party components that do not meet device specs.',
                  'Damage resulting from accidents, fire, liquid exposure, or earthquakes.',
                  'Damage caused by using the product outside recommended operating conditions.',
                  'Products repaired, modified, or upgraded by unauthorized third-party providers.',
                  'Normal wear and tear or deterioration due to aging.',
                  'Products with removed, altered, or unreadable serial numbers.',
                  'Products reported stolen or inaccessible due to security locks (unverified ownership).'
                ].map((item, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-200 text-slate-600 mr-3 shrink-0 text-[10px] font-bold mt-0.5 border border-slate-300">
                      {i + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">06.</span> Customer Responsibilities
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Data Backup</h3>
                <p className="text-sm">Customers are responsible for maintaining regular backups of all data. GoRevive is not responsible for any loss of data during repair, replacement, or warranty service.</p>
              </div>
              <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Proof of Purchase</h3>
                <p className="text-sm">Customers must provide valid proof of purchase, answer diagnostic questions, and follow troubleshooting instructions before receiving warranty service.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">07.</span> How to Obtain Service
            </h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 mr-4 shrink-0 font-bold border border-indigo-200">1</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Contact Support</h3>
                  <p className="text-sm">Initiate a warranty claim by contacting GoRevive via the Contact Us page, providing an issue description and proof of purchase.</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 mr-4 shrink-0 font-bold border border-indigo-200">2</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Remote Resolution Attempt</h3>
                  <p className="text-sm mb-2">GoRevive will attempt to resolve the issue remotely via troubleshooting or diagnostics within 24–48 hours (two working days).</p>
                  <p className="text-sm font-medium italic text-slate-900 bg-slate-100 px-3 py-2 rounded-md border border-slate-200 inline-block">
                    If unresolved remotely, the product must be sent to a GoRevive service facility.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-slate-100" />

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="text-indigo-500 text-lg">08.</span> Terms & Limitations
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Replacement & Refunds</h3>
                <p className="text-sm">If unrepairable within the warranty period, GoRevive may replace the product with the same or an equivalent specification model. Replacements inherit the remaining original warranty period.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Shipping & Handling</h3>
                <p className="text-sm">For valid claims, GoRevive covers transit costs to and from the service center. For ineligible claims, the customer covers shipping. GoRevive is not liable for damages caused by poor customer packaging during transit.</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Limitation of Liability</h3>
                <p className="text-sm">GoRevive does not guarantee uninterrupted operation. To the extent permitted by law, GoRevive is not liable for direct, indirect, incidental, or consequential damages (including loss of use, data, revenue, or reputation).</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer / CTA Section */}
        <div className="bg-slate-900 text-white p-8 md:p-12">
          
          <div className="bg-slate-800/50 border border-slate-700 rounded p-6 mb-8 text-center">
            <h2 className="text-xl font-bold mb-3">Customer and Staff Conduct</h2>
            <p className="text-slate-300 text-sm max-w-2xl mx-auto mb-4">
              We aim to maintain a respectful environment. Abusive behavior, threats, or harassment toward staff may result in immediate limitation or refusal of warranty services.
            </p>
            <p className="text-sm text-slate-400">
              Report misconduct directly to: <a href="mailto:support@gorevive.in" className="text-indigo-400 hover:text-indigo-300 transition-colors underline">support@gorevive.in</a>
            </p>
          </div>

          <div className="text-center">
            <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-2">Governing Law & Jurisdiction</p>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-8">
              This policy is governed by the laws of India. Disputes fall under the exclusive jurisdiction of the courts of <strong className="text-slate-300">Delhi / New Delhi</strong>.
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
    </div>
  );
}