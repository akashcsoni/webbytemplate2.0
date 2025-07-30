"use client";

import { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

export default function GroupSelect({
    data,
    onChange,
    error,
    defaultValueData,
}) {
    
    const dropdownRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(defaultValueData || []);
    const [localError, setLocalError] = useState("");

    useEffect(() => {
        setSelected(defaultValueData || []);
    }, [defaultValueData]);

    useEffect(() => {
        onChange(data.name, selected);
    }, [selected]);

    useEffect(() => {
        setLocalError(error && error.length > 0 ? error[0] : "");
    }, [error]);

    const isInvalid = localError?.length > 0;

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleSelect = (option) => {
        const exists = selected.includes(option.documentId);
        if (exists) {
            setSelected((prev) => prev.filter((id) => id !== option.documentId));
        } else {
            setSelected((prev) => [...prev, option.documentId]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedTitles = data.options
        .filter((option) => selected.includes(option.documentId))
        .map((opt) => opt.title)
        .join(", ");

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <label className="block mb-1 text-sm text-black font-medium">
                {data.label}
                {Array.isArray(data.rules) && data.rules.includes("required") && "*"}
            </label>
            <div
                onClick={toggleDropdown}
                className={`w-full h-[42px] px-4 py-2 border ${isInvalid ? "border-[#F31260]" : "border-gray-300"
                    } rounded cursor-pointer bg-white flex items-center justify-between`}
            >
                <span className="text-sm text-gray-700 truncate">
                    {selectedTitles || `Select ${data.label}...`}
                </span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                    <path
                        d="M19 9l-7 7-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-300 rounded shadow">
                    {Object.entries(
                        data.options.reduce((acc, option) => {
                            const parentTitle =
                                option.parent_topics?.[0]?.title || "Ungrouped Topics";
                            if (!acc[parentTitle]) acc[parentTitle] = [];
                            acc[parentTitle].push(option);
                            return acc;
                        }, {})
                    ).map(([groupTitle, groupOptions]) => (
                        <div key={groupTitle}>
                            {/* ✅ Render parent name as unclickable heading */}
                            <div className="px-4 py-2 font-semibold text-sm text-gray-700 bg-gray-100 cursor-default select-none">
                                {groupTitle}
                            </div>

                            {/* ✅ Render only the children as selectable */}
                            {groupOptions.map((option) => (
                                <div
                                    key={option.documentId}
                                    onClick={() => handleSelect(option)}
                                    className={`px-10 py-2 text-sm hover:bg-primary hover:text-white flex justify-between items-center cursor-pointer ${selected.includes(option.documentId)
                                            ? "bg-primary text-white"
                                            : ""
                                        }`}
                                >
                                    <span>{option.title}</span>
                                    {selected.includes(option.documentId) && (
                                        <Check className="w-4 h-4" />
                                    )}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}

            {isInvalid && <p className="text-xs text-[#F31260] mt-1">{localError}</p>}
        </div>
    );
}