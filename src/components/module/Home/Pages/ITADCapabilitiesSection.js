// Moved static data outside the component so it isn't recreated on every render
const CAPABILITIES = [
    {
        title: "Pan-India Logistics",
        desc: "1,400+ cities · 24,000+ pin codes with secure nationwide transport.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
        )
    },
    {
        title: "End-to-End ITAD",
        desc: "Full in-house handling — asset assessment, value recovery, and final recycling under one roof.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
        )
    },
    {
        title: "ESG Impact",
        desc: "Direct Scope 1, 2 & 3 emission reduction with >98% material recovery efficiency.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: "Strong Compliance",
        desc: "Authorized by CPCB, MoEFCC, and Delhi SPCB. 100% compliant with India's EPR regulations.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.95 11.95 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
        )
    },
    {
        title: "Certified Data Destruction",
        desc: "BitRaser wiping & physical destruction. We proudly issue official NIST 800-88 data destruction certificates.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        )
    },
    {
        title: "Global Certifications",
        desc: "R2 (SERI) · ISO 9001, 14001, 27001, 14064, 14044 & 45001 · UNFCCC approved for carbon credits.",
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        )
    }
];

export const ITADCapabilitiesSection = () => {
    return (
        <section id='asset-disposition' className="bg-white border-y border-gray-100 py-20 lg:py-28 relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B2136] leading-tight tracking-tight mb-6">
                        Secure, <em className="font-accent italic font-normal text-g600">Certified</em> & Sustainable <br className="hidden md:block"/>
                        <span>IT Asset Disposal</span>
                    </h2>
                    <p className="text-[17px] text-[#4A6355] leading-relaxed">
                        Turning unmanaged IT equipment into opportunity — with the industry's best asset value, uncompromising data security, full traceability, and environmentally certified recycling technology.
                    </p>
                </div>

                {/* 3x2 Grid of Capabilities */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {CAPABILITIES.map((item, index) => (
                        <div 
                            key={index}
                            className="bg-[#F7FAF8] border-b-2 border-transparent rounded-2xl p-8 hover:shadow-lg hover:border-[#1B5E3B]/30 transition-all duration-300"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#1B5E3B] mb-6">
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-[#0B2136] mb-3">
                                {item.title}
                            </h3>
                            <p className="text-[15px] text-gray-600 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
                
                {/* Background Image / Gradient */}
                <div className="absolute bg-[#ffffff20] left-0 -bottom-28 bg-[url('/bg2.webp')] z-[-1] bg-cover bg-bottom w-full h-full">
                    <div className="absolute bottom-0 w-full h-[300px] bg-gradient-to-t from-white to-transparent"></div>
                </div>

            </div>
        </section>
    );
};