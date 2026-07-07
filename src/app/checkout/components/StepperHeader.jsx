import React from 'react'

function StepperHeader({currentStep, STEPS }) {
    return (
        <div className="mb-10">
            <h1 className="text-3xl font-extrabold text-[#0B2136] mb-8">Secure Checkout</h1>
            <div className="flex items-center justify-between relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
                <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1B5E3B] rounded-full z-0 transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                ></div>

                {STEPS.map((step) => (
                    <div key={step.id} className="relative z-10 flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full font-bold flex items-center justify-center border-4 transition-colors duration-300 ${currentStep >= step.id ? 'bg-[#1B5E3B] border-emerald-100 text-white' : 'bg-white border-gray-200 text-gray-400'
                            }`}>
                            {currentStep > step.id ? '✓' : step.id}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold mt-2 uppercase tracking-wide absolute -bottom-6 whitespace-nowrap ${currentStep >= step.id ? 'text-[#0B2136]' : 'text-gray-400'}`}>
                            {step.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default StepperHeader