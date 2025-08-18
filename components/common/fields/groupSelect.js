"use client";

import { useState, useEffect, useRef } from "react";
import { Check, ChevronDown } from "lucide-react";

export default function GroupSelect({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(defaultValueData || []);
  console.log(selected, "selected value checking");
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

  const handleRemove = (id) => {
    setSelected((prev) => prev.filter((item) => item !== id));
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

  const selectedObjects = data.options.filter((option) =>
    selected.includes(option.documentId)
  );

  console.log(selectedObjects);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className="block mb-1 text-sm text-black font-medium">
        {data.label}
        {Array.isArray(data.rules) && data.rules.includes("required") && "*"}
      </label>

      {/* Dropdown toggle */}
      <div
        onClick={toggleDropdown}
        className={`w-full min-h-[42px] px-4 py-2 border ${
          isInvalid ? "border-[#F31260]" : "border-gray-100"
        } rounded cursor-pointer bg-white flex items-center flex-wrap gap-2 relative`}
      >
        {/* Render selected items */}
        {selectedObjects.length > 0 ? (
          selectedObjects.map((option) => (
            <span
              key={option.documentId}
              className="text-sm text-white bg-primary px-2 py-1 rounded flex items-center gap-1"
            >
              {option.title}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x cursor-pointer"
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(option.documentId);
                }}
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </span>
          ))
        ) : (
          <span className="text-gray-400 text-sm">Select {data.label}...</span>
        )}

        {/* Chevron Arrow */}
        <ChevronDown
          className={`w-4 h-4 ml-auto transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </div>

      {/* Dropdown Menu */}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full max-h-60 overflow-y-auto bg-white border border-gray-100 rounded shadow">
          {data.options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">
              No {data?.label?.toLowerCase()} found
            </div>
          ) : (
            Object.entries(
              data.options.reduce((acc, option) => {
                const parentTitle =
                  option.parent_topics?.[0]?.title || "Ungrouped Topics";
                if (!acc[parentTitle]) acc[parentTitle] = [];
                acc[parentTitle].push(option);
                return acc;
              }, {})
            ).map(([groupTitle, groupOptions]) => (
              <div key={groupTitle}>
                <div className="px-4 py-2 font-semibold text-sm text-gray-700 bg-gray-100 cursor-default select-none">
                  {groupTitle}
                </div>

                {groupOptions.map((option) => (
                  <div
                    key={option.documentId}
                    onClick={() => handleSelect(option)}
                    className={`px-10 py-2 text-sm hover:bg-primary hover:text-white flex justify-between items-center cursor-pointer ${
                      selected.includes(option.documentId)
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
            ))
          )}
        </div>
      )}

      {isInvalid && <p className="text-xs text-[#F31260] mt-1">{localError}</p>}
    </div>
  );
}
