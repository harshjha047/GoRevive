"use client";

export const ProductToolbar = ({ 
    filters, 
    sort, 
    setSort, 
    handleSearch, 
    removeFilter,
    resultCount 
}) => {
    return (
        <div className="mb-6">
            {/* Search & Sort Row */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] mb-4">
                <div className="w-full sm:w-auto flex-1">
                    <div className="relative max-w-sm">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input 
                            type="text" 
                            placeholder="Search inventory..." 
                            value={filters.search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#1B5E3B] focus:ring-2 focus:ring-[#1B5E3B]/20 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <p className="text-[13px] text-gray-500 whitespace-nowrap hidden sm:block">
                        <strong className="text-[#0B2136] font-black">{resultCount}</strong> devices
                    </p>
                    <div className="flex items-center gap-2">
                        <label htmlFor="sort" className="text-[13px] font-bold text-gray-500">Sort:</label>
                        <select
                            id="sort"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="text-[13px] font-bold text-[#0B2136] bg-gray-50 border border-gray-200 rounded-xl py-2 pl-3 pr-8 cursor-pointer focus:bg-white focus:border-[#1B5E3B] outline-none transition-all appearance-none"
                        >
                            <option value="relevance">Relevance</option>
                            <option value="price-asc">Price (Low to High)</option>
                            <option value="price-desc">Price (High to Low)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Active Filter Chips */}
            {(filters.category.length > 0 || filters.brand.length > 0 || filters.search) && (
                <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[13px] font-bold text-gray-400 mr-2">Active:</span>

                    {filters.search && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-bold bg-gray-200 text-gray-700">
                            "{filters.search}"
                            <button onClick={() => handleSearch('')} className="hover:text-red-500 ml-1">&times;</button>
                        </span>
                    )}

                    {filters.category.map(cat => (
                        <span key={cat} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-bold bg-[#F0FAF5] text-[#1B5E3B] border border-[#1B5E3B]/20">
                            {cat}
                            <button onClick={() => removeFilter('category', cat)} className="hover:text-red-500 ml-1">&times;</button>
                        </span>
                    ))}

                    {filters.brand.map(b => (
                        <span key={b} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-bold bg-[#0B2136] text-white">
                            {b}
                            <button onClick={() => removeFilter('brand', b)} className="hover:text-red-400 ml-1">&times;</button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};