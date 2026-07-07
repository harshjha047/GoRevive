import Link from 'next/link';

export const ProcessSection = () => {
    return (
        <section id="process-in-action" className="py-24 bg-gray-50 border-t border-gray-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8  ">
                
                {/* Header */}
                <div className="text-center mb-12">
                    <h3 className="text-3xl md:text-4xl font-extrabold text-[#0B2136]">
                        See Our Process in Action
                    </h3>
                    <p className="text-gray-600 mt-3 text-lg max-w-lg mx-auto">
                        Go behind the scenes at our state-of-the-art facility to see how we bring devices back to life.
                    </p>
                </div>

                {/* Video Card Container */}
                <div className="bg-white p-3 md:p-4 rounded-3xl m-auto shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 transition-transform duration-500 hover:scale-[1.01]">
                    <div className="aspect-video rounded-md overflow-hidden shadow-inner bg-gray-900 relative">
                        {/* Note: 'title' is required for accessibility. 
                           'aspect-video' combined with w-full ensures 16:9 ratio automatically.
                        */}
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/iQYZ-U3yQfo"
                            title="GoRevive Refurbishment Process Video"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

                {/* Optional Call to Action */}
                {/* <div className="text-center mt-12">
                    <Link 
                        href="/grading" 
                        className="inline-flex items-center gap-2 text-[#1B5E3B] font-bold hover:underline underline-offset-4 decoration-2 transition-all"
                    >
                        Learn about our grading standards
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div> */}
            </div>
        </section>
    );
};