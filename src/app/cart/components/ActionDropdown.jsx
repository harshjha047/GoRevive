import React from 'react'

function ActionDropdown({openDropdownId,group,handleAutoAdd,openSelectModal,handleAutoRemove,handleClearCartModel,setOpenDropdownId,classname}) {
    
    return (
        <div className={`relative ${classname}`}>
            <button
                onClick={() => setOpenDropdownId(openDropdownId === group.model_code ? null : group.model_code)}
                className="bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2 transition-colors"
            >

                Actions
                <svg className={`w-4 h-4 transition-transform duration-200 ${openDropdownId === group.model_code ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <div className={`absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-md shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 flex flex-col transition-all origin-top-right ${openDropdownId === group.model_code ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible pointer-events-none'}`}>

                <div className="bg-gray-50 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider rounded">Quick Add</div>
                <button onClick={() => handleAutoAdd(group.model_code, 1)} className="text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Auto-add 1 more</button>
                <button onClick={() => handleAutoAdd(group.model_code, 5)} className="text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Auto-add 5 more</button>
                <button onClick={() => openSelectModal(group.model_code, 'add')} className="text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors">Select & Add specific units...</button>

                <div className="bg-gray-50 px-4 py-2 text-[10px] font-black text-gray-400 uppercase tracking-wider border-y border-gray-100">Quick Remove</div>
                <button onClick={() => handleAutoRemove(group.model_code, 1)} className="text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">Auto-remove 1 unit</button>
                <button onClick={() => handleAutoRemove(group.model_code, 5)} className="text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 disabled:opacity-50 transition-colors" disabled={group.items.length < 5}>Auto-remove 5 units</button>
                <button onClick={() => openSelectModal(group.model_code, 'remove')} className="text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors">Select & Remove specific units...</button>

                <div className="border-t border-gray-100"></div>
                <button onClick={() => handleClearCartModel(group.model_code)} className="text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-b-xl transition-colors">Clear all from cart</button>
            </div>
        </div>
    )
}

export default ActionDropdown