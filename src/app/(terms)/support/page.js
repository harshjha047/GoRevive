export default function SupportPage() {

  return (
    <div className="min-h-screen bg-slate-50 font-sans w-full">
      <div className="w-full    border-slate-100 rounded-none overflow-hidden">
        
        {/* Header Section */}
        <header className="bg-gradient-to-br from-slate-900 to-slate-800 px-8 py-12 rounded-none">
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-3">
            Contact & Support
          </h1>
          <p className="text-lg font-medium text-slate-300 max-w-2xl">
            We're here to help. Reach out to us through any of our channels below.
          </p>
        </header>

        {/* Channels Information Grid */}
        <div className="p-8 md:p-12 w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Phone Support */}
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between text-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Telephonic Support</h3>
              <p className="text-sm text-slate-600 mb-4">Speak directly with our support team.</p>
            </div>
            <a 
              href="tel:01142758155" 
              className="text-lg font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              011 4275 8155
            </a>
          </div>

          {/* Email Support */}
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between text-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
              <p className="text-sm text-slate-600 mb-4">Get assistance via email.</p>
            </div>
            <a 
              href="mailto:support@gorevive.in" 
              className="text-lg font-bold text-indigo-600 hover:text-indigo-500 transition-colors break-all"
            >
              support@gorevive.in
            </a>
          </div>

          {/* Office Address */}
          <div className="p-8 bg-slate-50 border border-slate-200 rounded-none shadow-sm flex flex-col justify-between text-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Our Office</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Second Floor, D-161, Okhla Phase I,<br />
                Okhla Industrial Estate,<br />
                New Delhi, Delhi 110020
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}