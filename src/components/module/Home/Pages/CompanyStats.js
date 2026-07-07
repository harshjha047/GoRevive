// Move static data outside to prevent it from being recreated on every render
const PILLARS = [
    {
        title: 'Enterprise Refurbishing',
        desc: 'Extending IT lifecycles with certified, grade-A restoration.',
        color: 'bg-blue-50 text-blue-700',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        watermark: (
            <svg className="absolute -bottom-4 -right-4 w-32 h-32 text-blue-500/5 rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        )
    },
    {
        title: 'NIST Data Destruction',
        desc: 'Military-grade wiping ensuring 100% corporate data security.',
        color: 'bg-gray-100 text-gray-800',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.95 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        ),
        watermark: (
            <svg className="absolute -bottom-4 -right-4 w-32 h-32 text-gray-500/5 -rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        )
    },
    {
        title: 'E-Waste Recycling',
        desc: 'CPCB authorized dismantling with zero-landfill policies.',
        color: 'bg-[#F0FAF5] text-[#1B5E3B]',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        ),
        watermark: (
            <svg className="absolute -bottom-4 -right-4 w-32 h-32 text-[#1B5E3B]/5 rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        )
    },
    {
        title: 'Value Recovery',
        desc: 'Maximized financial returns on retiring corporate assets.',
        color: 'bg-emerald-50 text-emerald-700',
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        watermark: (
            <svg className="absolute -bottom-4 -right-4 w-32 h-32 text-emerald-500/5 -rotate-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08-.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
];

export const CompanyStats = () => {
    return (
        <section id="about-us" className="bg-gradient-to-br from-white via-white to-[#E6F4EA] py-20 lg:py-28 relative overflow-hidden">
            
            {/* Subtle background element */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F0FAF5] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1260px] relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-center">

                    {/* Left Column: The Narrative */}
                    <div className="w-full lg:w-5/12">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#061410] leading-[1.1] tracking-tight mb-6">
                            India's trusted leader in <span className="text-[#1B5E3B] font-accent italic font-medium">IT lifecycle</span> management.
                        </h2>

                        <p className="text-[17px] text-[#4A6355] leading-relaxed mb-8">
                            GoRevive, a premium brand under the umbrella of Connect Residuary Private Limited, has emerged as a trusted leader in the preowned IT asset space. With a sharp focus on performance, sustainability, and value, we specialize in delivering enterprise-grade, certified pre-owned IT infrastructure exclusively tailored for the B2B segment.
                        </p>

                        {/* Quick Trust Stats placed below the text */}
                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-gray-100">
                            <div>
                                <div className="text-2xl font-black text-[#0A1A0E]">300+</div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">Enterprise Clients</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#0A1A0E]">30+</div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">Expert Team</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#0A1A0E]">6+</div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">Pan-India Hubs</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black text-[#0A1A0E]">₹100cr+</div>
                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mt-1">Assets Processed</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visual Business Pillars */}
                    <div className="w-full lg:w-7/12">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
                            {PILLARS.map((pillar, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-6 lg:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(10,31,20,0.03)] hover:shadow-[0_16px_48px_rgba(10,31,20,0.08)] transition-all duration-300 hover:-translate-y-1 group relative overflow-hidden flex flex-col h-full"
                                >
                                    {/* The massive faded background icon that communicates instantly */}
                                    {pillar.watermark}

                                    <div className={`w-12 h-12 rounded-xl ${pillar.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                                        {pillar.icon}
                                    </div>
                                    
                                    <h3 className="text-[19px] font-bold text-[#0A1A0E] tracking-tight mb-2 relative z-10">
                                        {pillar.title}
                                    </h3>
                                    
                                    <p className="text-[14px] text-gray-600 leading-snug relative z-10">
                                        {pillar.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};