// --- Static Data ---
const PROCESS_STEPS = [
    {
        step: '01',
        title: 'Assessment & Inventory',
        desc: 'Assess condition, age, and functionality to create a comprehensive inventory list.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    },
    {
        step: '02',
        title: 'Valuation & Offer',
        desc: 'Determine fair market value and generate an offer based on current demand.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    },
    {
        step: '03',
        title: 'Secure Logistics',
        desc: 'Arrange protected transportation using trusted experts in sensitive equipment.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    },
    {
        step: '04',
        title: 'Data Erasure',
        desc: 'Execute approved data erasure and compliant, eco-friendly disposal practices.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.95 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    },
    {
        step: '05',
        title: 'Settlement & Reporting',
        desc: 'Process payments and provide full documentation, receipts, and certificates.',
        icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    }
];

export const BusinessValueSection = () => {
    return (
        <>
            {/* =========================================
                PART 1: BUYBACK PIPELINE 
                ========================================= */}
            <section id='buyback-pipeline' className="bg-gray-50 py-24 relative overflow-hidden border-t border-gray-200">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px] relative z-10">

                    <div className="text-center mb-16">
                        <span className="text-[#1B5E3B] font-bold tracking-widest uppercase text-xs mb-3 block">
                            IT Asset Disposition
                        </span>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B2136]">
                            The Corporate Buyback Pipeline
                        </h2>
                        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                            A seamless, secure, and transparent journey designed specifically to handle enterprise-scale hardware retirement.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
                        {PROCESS_STEPS.map((item, idx) => (
                            <div key={idx} className="relative group h-full">
                                
                                {/* The Card */}
                                <div className="bg-white rounded-2xl p-6 lg:p-8 h-full border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative z-10 flex flex-col">
                                    
                                    {/* Step Number & Icon Header */}
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-3xl font-black text-gray-200 group-hover:text-[#1B5E3B]/20 transition-colors duration-300">
                                            {item.step}
                                        </span>
                                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                {item.icon}
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-[17px] font-bold text-[#0B2136] mb-3 leading-tight">{item.title}</h3>
                                    <p className="text-[14px] text-gray-500 leading-relaxed flex-grow">
                                        {item.desc}
                                    </p>
                                </div>

                                {/* Desktop Arrow connecting cards (Hidden on the last item) */}
                                {idx !== PROCESS_STEPS.length - 1 && (
                                    <div className="hidden lg:flex absolute top-1/2 -right-4 w-8 h-8 -mt-4 z-20 items-center justify-center text-gray-300">
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* =========================================
                PART 2: ENVIRONMENTAL IMPACT 
                ========================================= */}
            <section id="environmental-impact" className="w-full bg-white py-24 relative overflow-hidden">
                
                {/* Decorative Background Glows */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-40 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#1B5E3B]/5 blur-[100px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px]"></div>
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1200px] z-10 relative">
                    
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F0FAF5] rounded-full mb-4">
                            <img src="/RecyclingSymbolGreen.png" alt="Recycling" className="w-8 h-8 object-contain" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-[#0B2136]">
                            Powering a Sustainable Future
                        </h2>
                        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                            By choosing GoRevive, businesses actively reduce their corporate carbon footprint and drive the circular economy.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100 flex flex-col lg:flex-row">

                        {/* Left Side: Data Bars */}
                        <div className="lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-[#0B2136] mb-10">Carbon Footprint Comparison</h3>

                            <div className="space-y-10">
                                {/* New Laptop */}
                                <div>
                                    <div className="flex justify-between items-end mb-3">
                                        <span className="font-semibold text-gray-600">Manufacturing a New Laptop</span>
                                        <span className="text-xl font-black text-gray-400">~400 kg CO₂e</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
                                        <div className="bg-gray-300 h-full rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                                    </div>
                                </div>

                                {/* Refurbished Laptop */}
                                <div className="relative">
                                    <div className="absolute -top-8 left-0 bg-[#1B5E3B] text-white text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-md shadow-sm">
                                        The GoRevive Choice
                                    </div>
                                    <div className="flex justify-between items-end mb-3 mt-6">
                                        <span className="font-semibold text-[#1B5E3B]">Refurbishing a Laptop</span>
                                        <span className="text-2xl font-black text-[#1B5E3B]">~50 kg CO₂e</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-5 overflow-hidden">
                                        {/* 12.5% visually represented */}
                                        <div className="bg-[#22C55E] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(34,197,94,0.5)]" style={{ width: '15%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Impact Summary */}
                        <div className="lg:w-2/5 p-8 lg:p-12 bg-[#0B2136] text-white flex flex-col justify-center relative overflow-hidden">
                            
                            {/* Abstract Graphic */}
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white opacity-5 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                <h3 className="text-5xl lg:text-6xl font-black text-[#22C55E] mb-2 tracking-tight">~350 kg</h3>
                                <p className="text-lg font-medium text-gray-300 mb-8">CO₂e Saved Per Device</p>

                                <div className="w-full h-px bg-white/10 mb-8"></div>

                                <p className="text-[11px] text-gray-400 mb-5 font-bold uppercase tracking-[0.15em]">Roughly Equivalent To:</p>

                                <div className="space-y-4 w-full">
                                    {/* Stat 1 */}
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-4 hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#1B5E3B]/40 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">
                                            Driving a car for <strong className="text-white text-base">1,000 km</strong>
                                        </span>
                                    </div>

                                    {/* Stat 2 */}
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md flex items-center gap-4 hover:bg-white/10 transition-colors">
                                        <div className="w-10 h-10 rounded-full bg-[#1B5E3B]/40 flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-[#22C55E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-sm font-medium text-gray-300">
                                            Charging <strong className="text-white text-base">37,500</strong> phones
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </>
    );
};