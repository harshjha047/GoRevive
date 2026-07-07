import SectionLabel from "../Components/SectionLabel";

// --- Static Data ---
const PRIMARY_LICENSE = {
    imgSrc: "Logo_of_the_Central_Pollution_Control_Board.svg",
    title: "CPCB Certified & Authorized",
    subtitle: "Central Pollution Control Board of India",
    desc: "Our primary government authorization for the safe handling, dismantling, and processing of electronic waste across India.",
    bullets: ["Authorized e-waste handler", "Safe material recovery", "100% environmental compliance"]
};

const STANDARD_CERTS = [
    { imgSrc: "iso_9001_2015.png", title: "ISO 9001:2015", subtitle: "Quality Management Systems", bullets: ["Audited operational excellence", "Consistent product quality", "Strict regulatory compliance"] },
    { imgSrc: "nist-800-88-compliant.jpg", title: "NIST 800-88", subtitle: "Global Data Erasure Standard", bullets: ["Guaranteed data destruction", "Protection from corporate leaks", "Audit-ready certificates provided"] },
    { imgSrc: "dpcc.webp", title: "DPCC Authorized", subtitle: "Pollution Control Committee", bullets: ["Certified hazardous waste handling", "Eco-friendly disposal policies", "CTO & CTE regulatory approved"] },
    { imgSrc: "msme-logo.png", title: "MSME Registered", subtitle: "Government of India", bullets: ["Udyam registered enterprise", "Trusted SME corporate partner", "Verified business operations"] },
    { imgSrc: "gst.webp", title: "GST Compliant", subtitle: "Form GST REG-06", bullets: ["Transparent B2B billing", "Input Tax Credit (ITC) ready", "Fully compliant taxation"] },
    { imgSrc: "MCD.png", title: "Factory License", subtitle: "Municipal Corporation Delhi", bullets: ["Authorized industrial operations", "Safe working environment", "Regulated IT refurbishment"] }
];

// --- Sub-Components ---
const CheckIcon = () => (
    <svg className="w-4 h-4 shrink-0 text-[#22C55E] mt-[2px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const CertificateCard = ({ cert }) => (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-[#1B5E3B]/15">
        <div className="flex items-center gap-4 mb-5">
            <div className="w-[60px] h-[60px] shrink-0 bg-white rounded-lg border border-gray-100 shadow-sm flex items-center justify-center p-2 overflow-hidden">
                <img src={`/${cert.imgSrc}`} alt={`${cert.title} badge`} className="w-full h-full object-contain" />
            </div>
            <div>
                <h4 className="font-display text-[18px] font-bold text-[#0B2136] leading-tight mb-1">
                    {cert.title}
                </h4>
                <p className="text-[13px] font-medium text-[#1E40AF]">
                    {cert.subtitle}
                </p>
            </div>
        </div>
        <div className="w-full h-px bg-gray-200 mb-5" aria-hidden="true"></div>
        <ul className="space-y-3">
            {cert.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-3 text-[14px] text-gray-700">
                    <CheckIcon />
                    <span className="leading-snug">{bullet}</span>
                </li>
            ))}
        </ul>
    </div>
);

const GuaranteeSection = () => (
    <div className="w-full relative reveal-target translate-y-8 transition-all duration-700 ease-out delay-300 mt-16">
        <div className="bg-white border border-gray-200 rounded-[24px] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] group">

            {/* Decorative Blurs */}
            <div className="absolute -top-[100px] -right-[100px] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#1B5E3B]/5 to-transparent blur-3xl pointer-events-none group-hover:bg-[#1B5E3B]/10 transition-colors duration-500" aria-hidden="true"></div>
            <div className="absolute -bottom-[50px] -left-[50px] w-[200px] h-[200px] rounded-full bg-gradient-to-tr from-[#22C55E]/5 to-transparent blur-2xl pointer-events-none" aria-hidden="true"></div>

            <div className="relative z-10 flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
                {/* Pitch */}
                <div className="flex-1 text-center lg:text-left">
                    <h3 className="font-display text-[clamp(28px,3vw,42px)] font-extrabold text-[#0B2136] leading-[1.1] mb-5">
                        Buy Certified,<br className="hidden lg:block" />Devices
                    </h3>
                    <p className="text-[16px] leading-[1.7] text-gray-700 mb-8 max-w-[500px] mx-auto lg:mx-0">
                        Save 50–70% vs new without compromising on Performance. Every device is graded, tested, and backed by a PAN India Delivery through our Logistics partners.
                    </p>
                </div>

                {/* Guarantee Box */}
                <div className="w-full lg:w-[460px] shrink-0 bg-gray-50 rounded-2xl p-6 lg:p-8 border border-gray-100 relative transition-colors duration-500 group-hover:border-[#1B5E3B]/15">
                    <h4 className="text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-6">
                        The GoRevive Certified
                    </h4>
                    <ul className="space-y-5">
                        {[
                            { title: "40-point hardware inspection", desc: "Rigorous testing across all components." },
                            { title: "Transparent grading", desc: "Categorized in A/B/C/D/E Grades as per their Health & Cosmetic Condition." },
                            { title: "Convenient Pick & drop delivery & Collection", desc: "Customer Happiness is more important for us." }
                        ].map((item, i) => (
                            <li key={i} className="flex items-start gap-3.5">
                                <div className="w-6 h-6 rounded-full bg-[#22C55E]/10 flex items-center justify-center shrink-0 mt-0.5">
                                    <CheckIcon />
                                </div>
                                <div>
                                    <div className="text-[14px] font-bold text-[#0B2136] leading-tight mb-1">{item.title}</div>
                                    <div className="text-[13px] text-gray-600 leading-snug">{item.desc}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Component ---
export const Features = () => {
    return (
        <section id="lifecycle-management" className="bg-off-white  pt-[clamp(80px,10vw,140px)] pb-[clamp(80px,10vw,140px)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[120px] bg-gradient-to-b from-gray-100 to-transparent" aria-hidden="true"></div>

            <div className="w-full mx-auto px-[clamp(20px,4vw,60px)] max-w-[1400px] relative z-10">

                {/* Header */}
                <header className="text-center mb-[60px] reveal-target translate-y-8 transition-all duration-700 ease-out">
                    <SectionLabel className="justify-center">Why GoRevive</SectionLabel>
                    <h2 className="font-display text-[clamp(34px,4vw,52px)] font-extrabold tracking-[-0.02em] text-[#0B2136] leading-[1.1]">
                        The <em className="font-accent italic font-normal text-[#1B5E3B] ">trusted</em> standard for<br />
                        enterprise IT Lifecycle Management
                    </h2>
                    <p className="text-[17px] text-gray-600 max-w-[540px] mx-auto mt-4 leading-[1.7]">
                        Every engagement is audit-ready, data-secure, and ESG-compliant from day one — backed by industry-leading certifications.
                    </p>
                </header>

                {/* Certificates Container */}
                <div className="bg-white rounded-2xl p-[32px] md:p-[48px_40px] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-200 relative overflow-hidden reveal-target translate-y-8 transition-all duration-700 ease-out delay-100">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-gray-500 via-green-500 to-blue-500" aria-hidden="true"></div>

                    {/* Primary Hero Certificate */}
                    <div className="bg-gray-50 rounded-2xl p-6 lg:p-8 mb-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white hover:border-[#1B5E3B]/20">
                        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start lg:items-center">

                            <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] shrink-0 bg-white rounded-xl border border-gray-200 p-3 flex items-center justify-center shadow-sm overflow-hidden">
                                <img src={`/${PRIMARY_LICENSE.imgSrc}`} alt={`${PRIMARY_LICENSE.title} badge`} className="w-full h-full object-contain" />
                            </div>

                            <div className="flex-1">
                                <h3 className="font-display text-[22px] lg:text-[26px] font-extrabold text-[#0B2136] mb-1">
                                    {PRIMARY_LICENSE.title}
                                </h3>
                                <p className="text-[14px] text-gray-700 max-w-lg">
                                    {PRIMARY_LICENSE.desc}
                                </p>
                            </div>

                            <div className="w-full lg:w-[320px] shrink-0 bg-white rounded-md p-5 border border-gray-200 shadow-sm">
                                <ul className="space-y-3">
                                    {PRIMARY_LICENSE.bullets.map((bullet, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[14px] text-gray-700 font-medium">
                                            <CheckIcon />
                                            <span className="leading-snug">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Grid Certificates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {STANDARD_CERTS.map((cert, i) => (
                            <CertificateCard key={i} cert={cert} />
                        ))}
                    </div>
                </div>

                <GuaranteeSection />

            </div>
        </section>
    );
};