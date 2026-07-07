export const ProductSkeleton = () => {
    return (
        <div className="flex flex-row md:flex-col bg-white border border-gray-100  rounded-2xl overflow-hidden h-full ">
            
            {/* Image Placeholder */}
            <div className="w-[40%] md:w-full aspect-square md:aspect-[4/3] bg-gray-100 animate-pulse flex-shrink-0 border-r md:border-r-0 md:border-b border-gray-100">
                {/* Fake Condition Badge */}
                <div className="absolute top-2 left-2 md:top-3 md:left-3 w-16 h-5 bg-gray-200 rounded-md"></div>
            </div>

            {/* Content Placeholder */}
            <div className="flex flex-col flex-grow p-3 md:p-5 w-[60%] md:w-full">
                
                {/* Fake Brand */}
                <div className="w-12 h-3 bg-gray-100 rounded animate-pulse mb-3"></div>

                {/* Fake Title (Two lines) */}
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse mb-4"></div>

                {/* Fake Specs Pills */}
                <div className="flex gap-2 mb-auto">
                    <div className="w-12 h-4 bg-gray-100 rounded animate-pulse"></div>
                    <div className="w-16 h-4 bg-gray-100 rounded animate-pulse"></div>
                </div>

                {/* Fake Pricing / Button Area */}
                <div className="mt-4 pt-3 border-t border-gray-50">
                    <div className="w-full h-10 bg-gray-100 rounded-xl animate-pulse"></div>
                </div>

            </div>
        </div>
    );
};