// import { Icon } from '../components/Icon';

import { Icon } from "@/components/utils/UI/Icons/Icon";

export default function AboutUs() {
  const directors = [
    { name: "Rohit Kakkar", title: "Founder and Director", image: "/2.svg", linkedin: "https://www.linkedin.com/in/rohit-kakkar-38539816/" },
    { name: "Ankush Bhan", title: "Founder and Director", image: "/3.svg", linkedin: "https://www.linkedin.com/in/ankush-bhan-26b90b5/" },
    { name: "Dheeraj Joshi", title: "Vice President, Sales", image: "/1.svg", linkedin: "https://www.linkedin.com/in/dheeraj-joshi/" }
  ];

  const officeImages = [
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=800&auto=format&fit=crop',
    //   'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=800&auto=format&fit=crop',
  ];

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-blue-200">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 pt-24 pb-48 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="relative container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            Reviving Technology, <br className="hidden md:block" />
            <span className="text-blue-400">Sustaining the Future.</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100/80 font-light max-w-2xl mx-auto">
            Leading the charge in sustainable technology by giving IT assets a second life through reliable and accessible circular economy solutions.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10 mb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100 transform transition-transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To provide businesses and consumers with reliable, affordable, and high-quality refurbished IT equipment, while promoting environmental sustainability through the reduction of e-waste.
            </p>
          </div>
          
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-slate-100 transform transition-transform hover:-translate-y-1 duration-300">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
            <p className="text-slate-600 leading-relaxed">
              To be India's most trusted and efficient recircular economy platform for IT assets, empowering progress through accessible technology.
            </p>
          </div>

          <div className="lg:col-span-1 rounded-2xl overflow-hidden shadow-xl h-full min-h-[300px]">
            {/* Using standard img tags here to avoid Next.js domain config requirements for external URLs. */}
            <img 
              src="https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?q=80&w=800&auto=format&fit=crop" 
              alt="Our Team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Directors Section */}
      <section className="bg-white py-24 border-y border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Meet Our Leadership</h2>
            <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {directors.map((director, index) => (
              <div key={index} className="group flex flex-col items-center bg-slate-50 p-8 rounded-3xl transition-all duration-300 hover:bg-white hover:shadow-2xl hover:-translate-y-2 border border-transparent hover:border-slate-100">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-blue-600 rounded-full blur opacity-0 group-hover:opacity-30 transition-opacity duration-300 transform scale-110"></div>
                  <img src={director.image} alt={director.name} className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-md z-10"/>
                  <a 
                    href={director.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2.5 shadow-lg hover:bg-blue-700 transition-colors z-20 transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 duration-300"
                  >
                    <Icon type="linkedin" className="w-4 h-4"/>
                  </a>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{director.name}</h3>
                <p className="text-blue-600 font-medium mt-1">{director.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Gallery */}
      <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Our Workspace</h2>
          <p className="text-slate-500">Where innovation and sustainability meet.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 h-auto md:h-[600px] max-w-6xl mx-auto">
          {officeImages.map((src, index) => (
            <div 
              key={index} 
              className={`overflow-hidden rounded-2xl shadow-sm group ${
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              }`}
            >
              <img 
                src={src} 
                alt={`Office view ${index + 1}`} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out min-h-[250px]" 
              />
            </div>
          ))}
        </div>
      </section>

      {/* Team Hierarchy */}
      <section className="bg-slate-900 text-white py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6">Our Structure</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Our 40-member team is the backbone of our <span className="text-blue-400 font-semibold">40 Cr annual revenue</span>. We are organized into specialized departments to ensure excellence at every stage.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 p-8 rounded-2xl border-t-4 border-blue-500 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-3">Technical Team</h3>
                  <p className="text-slate-400">Certified technicians dedicated to rigorous inspection, quality control, and premium refurbishment.</p>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-2xl border-t-4 border-teal-500 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-3">Sales & B2B</h3>
                  <p className="text-slate-400">Dedicated account managers ensuring seamless relationships with our trusted corporate partners.</p>
                </div>
                <div className="bg-slate-800/50 p-8 rounded-2xl border-t-4 border-indigo-500 backdrop-blur-sm">
                  <h3 className="text-xl font-bold text-white mb-3">Logistics & Ops</h3>
                  <p className="text-slate-400">The engine behind our supply chain, ensuring timely procurement and secure delivery of all assets.</p>
                </div>
            </div>
        </div>
      </section>

      {/* Location Section */}
      <section className=" container">
         <div className="bg-white  shadow-xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row">
            <div className="lg:w-1/3 p-10 lg:p-12 flex flex-col justify-center bg-blue-50/50">
                {/* <h2 className="text-3xl font-bold text-slate-900 mb-6">Find Us</h2> */}
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Headquarters</h3>
                    <p className="text-slate-600 mt-2 leading-relaxed">
                      Second Floor, D-161, <br />
                      Okhla Phase I, Okhla Industrial Estate, <br />
                      New Delhi, Delhi 110020
                    </p>
                  </div>
                </div>
            </div>
            <div className="lg:w-2/3 h-80 lg:h-auto">
                <iframe
                    title="GoRevive Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3505.748057201974!2d77.27710111508003!3d28.51983908246369!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce1a42c174a65%3A0x4ddcb31be0e4d0bc!2sGoRevive%20Private%20Limited!5e0!3m2!1sen!2sin!4v1678886543210!5m2!1sen!2sin"
                    className="w-full h-full"
                    style={{ border: 0, minHeight: '400px' }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
            </div>
        </div>
      </section>
      
    </div>
  );
}