"use client";

export const FilterSidebar = ({ 
    filters, 
    uniqueCategories, 
    uniqueBrands, 
    handleFilterChange, 
    clearAllFilters, 
    activeFilterCount,
    isMobileFiltersOpen 
}) => {
    return (
        <aside className={`lg:w-[280px] flex-shrink-0 ${isMobileFiltersOpen ? 'block mb-6' : 'hidden lg:block'}`}>
            <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 lg:sticky lg:top-24">
                
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-extrabold text-[#0B2136]">Filters</h2>
                    {activeFilterCount > 0 && (
                        <button onClick={clearAllFilters} className="text-[13px] text-red-500 hover:text-red-700 font-bold transition-colors">
                            Clear All
                        </button>
                    )}
                </div>

                {/* Category Checkboxes */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4 text-[13px] uppercase tracking-widest">Category</h3>
                    <div className="space-y-3">
                        {uniqueCategories?.map(category => (
                            <label key={category} className="flex items-center group cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={filters.category.includes(category)}
                                    onChange={() => handleFilterChange('category', category)}
                                    className="w-4.5 h-4.5 rounded border-gray-300 text-[#1B5E3B] focus:ring-[#1B5E3B] cursor-pointer transition-all"
                                />
                                <span className="ml-3 text-[14px] font-medium text-gray-600 group-hover:text-[#0B2136] transition-colors">
                                    {category}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Brand Pills */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-4 text-[13px] uppercase tracking-widest">Brands</h3>
                    <div className="flex flex-wrap gap-2">
                        {uniqueBrands.map(brand => {
                            const isActive = filters.brand.includes(brand);
                            return (
                                <button
                                    key={brand}
                                    onClick={() => handleFilterChange('brand', brand)}
                                    className={`px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all duration-200 border ${
                                        isActive 
                                        ? 'bg-[#0B2136] text-white border-[#0B2136] shadow-md' 
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    {brand}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </aside>
    );
};