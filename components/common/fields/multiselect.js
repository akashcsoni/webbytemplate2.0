"use client";

import { useState, useEffect, useRef } from "react";
import { Check, X } from "lucide-react";

export default function FormMultiSelect({
  data,
  onChange,
  error,
  defaultValueData,
}) {
  const dropdownRef = useRef(null);

  const [localError, setLocalError] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [selectedCountries, setSelectedCountries] = useState(
    defaultValueData || []
  );

  useEffect(() => {
    setSelectedCountries(defaultValueData || []);
  }, [defaultValueData]);

  const handleChange = () => {
    onChange(data.name, selectedCountries);
  };

  useEffect(() => {
    handleChange();
  }, [selectedCountries]);

  useEffect(() => {
    setLocalError(error && error.length > 0 ? error[0] : "");
  }, [error]);

  const isInvalid = localError && localError.length > 0;

  const toggleCountryDropdown = () => setIsCountryDropdownOpen((prev) => !prev);

  const handleCountrySelect = (country) => {
    setSelectedCountries((prev) => {
      const exists = prev.find((c) => c === country.documentId);
      if (exists) {
        return prev.filter((id) => id !== country.documentId);
      } else {
        return [...prev, country.documentId];
      }
    });
  };

  const clearAll = (e) => {
    e.stopPropagation();
    setSelectedCountries([]);
  };


  const filteredCountries = data.options.filter((country) =>
    country?.title?.toLowerCase().includes(countrySearchTerm.toLowerCase())
  );


  const selectedCountryTitles = data.options
    .filter((country) => selectedCountries.includes(country.documentId))
    .map((country) => country.title);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="p2 !text-black pb-1.5 block">
        {data?.label}
        {Array.isArray(data.rules) && data.rules.includes("required") && "*"}
      </label>
      <div className="relative">
        <div
          className={`border p2 ${isInvalid ? "border-[#ef4444]" : "border-gray-100 hover:border-[#a1a1aa] "} text-gray-300 placeholder:text-gray-300 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full min-h-[48px] cursor-pointer flex justify-between items-center flex-wrap gap-2`}
          onClick={toggleCountryDropdown}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {selectedCountryTitles.length > 0 ? (
              selectedCountryTitles.map((title, idx) => (
                <span
                  key={idx}
                  className="bg-primary text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {title}
                  <X
                    size={14}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedCountries((prev) =>
                        prev.filter(
                          (id) =>
                            id !==
                            data.options.find((c) => c.title === title)
                              ?.documentId
                        )
                      )
                    }
                  />
                </span>
              ))
            ) : (
              <span className="xl:!text-base sm:!text-sm !text-gray-300">
                {data?.placeholder}...
              </span>
            )}
          </div>
          <div className="flex gap-3 ml-auto mr-0">
            {selectedCountries.length > 0 && (
              <button onClick={clearAll} className="w-4 h-4 text-xs text-black">
                <X className="cursor-pointer font-normal w-4 h-4" />
              </button>
            )}
            <svg
              className={`w-4 h-4 transform transition-transform duration-300 ${
                isCountryDropdownOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>

        {isCountryDropdownOpen && (
          <div className="p2 absolute left-0 right-0 mt-1 border border-gray-100 bg-white rounded-b-md shadow-lg z-50 max-h-60 overflow-hidden">
            <div className="p-2 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search countries..."
                value={countrySearchTerm}
                onChange={(e) => setCountrySearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <ul className="text-gray-800 max-h-40 overflow-y-auto">
              {filteredCountries.map((country) => (
                <li
                  key={country.documentId}
                  onClick={() => handleCountrySelect(country)}
                  className={`px-4 py-2 hover:bg-primary hover:text-white cursor-pointer flex items-center justify-between`}
                >
                  {country.title}
                  {selectedCountries.includes(country.documentId) && (
                    <Check className="w-4 h-4" />
                  )}
                </li>
              ))}
              {filteredCountries.length === 0 && (
                <li className="px-4 py-2 text-gray-500">
                  No {data?.label.toLowerCase()} found
                </li>
              )}
            </ul>
          </div>
        )}
      </div>

      {isInvalid && (
        <p className="2xl:text-sm md:text-[13px] text-xs !text-[#ef4444] p-1">
          {localError}
        </p>
      )}
      {!isInvalid && data?.description && (
        <div className="flex items-center gap-[5px] p-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M10.6667 12.6667L14 9.33335L10.6667 6.00002"
              stroke="#505050"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 9.33337L8.66667 9.33337C4.98467 9.33337 2 6.34871 2 2.66671L2 2.00004"
              stroke="#505050"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="xl:text-sm md:text-[13px] text-xs md:leading-5 leading-[17px] text-gray-200">
            {data?.description}
          </p>
        </div>
      )}
    </div>
  );
}
