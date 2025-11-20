import { useState } from "react";

export const AccordionSection = ({ 
    title, 
    preview, 
    defaultOpen = false, 
    isOpen, 
    onToggle,
    children 
}) => {
    return (
        <div className="border-t border-gray-100 pt-4">
            <button
                className="w-full flex items-center gap-3 bg-transparent border-none px-2 py-3 cursor-pointer text-left rounded-lg transition-all hover:bg-gray-50 active:bg-gray-100"
                onClick={onToggle}
            >
                <div className="flex-1 font-semibold text-sm text-gray-800">
                    {title}
                </div>
                <div className="text-gray-500 text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                    {preview}
                </div>
                <div className={`transition-transform duration-200 text-gray-400 ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                </div>
            </button>

            {isOpen && (
                <div className="ml-3 mt-2 pl-3 border-l-2 border-blue-200 animate-fadeIn">
                    {children}
                </div>
            )}
        </div>
    );
};