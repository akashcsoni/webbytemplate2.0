"use client"

import { useState, useEffect } from "react"

export default function LicenseSelector({ licenses, onPriceChange }) {
    const [selectedLicense, setSelectedLicense] = useState(
        licenses.find((license) => license.license_type === "choose_a_license")?.id || null,
    )
    const [selectedAddons, setSelectedAddons] = useState([])

    const handleLicenseChange = (id) => {
        setSelectedLicense(id)
    }

    const handleAddonChange = (id) => {
        setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((addonId) => addonId !== id) : [...prev, id]))
    }

    // Calculate total price based on selected license and addons
    useEffect(() => {
        const selectedLicenseObj = licenses.find((license) => license.id === selectedLicense)
        const selectedAddonObjs = licenses.filter((license) => selectedAddons.includes(license.id))

        let totalPrice = 0
        let isWhiteLabel = false

        if (selectedLicenseObj) {
            totalPrice += selectedLicenseObj.sales_price || 0
            // Check if the license title contains "white label" (case insensitive)
            isWhiteLabel = selectedLicenseObj.license.title.toLowerCase().includes("white label")
        }

        selectedAddonObjs.forEach((addon) => {
            if (!addon.contact_sale) {
                totalPrice += addon.sales_price || 0
            }
        })

        // Pass the selected license ID and addon IDs along with the price and white label status
        onPriceChange(totalPrice, isWhiteLabel, selectedLicense, selectedAddons)
    }, [selectedLicense, selectedAddons, licenses, onPriceChange])

    // Group licenses by type
    const licensesByType = licenses.reduce((groups, license) => {
        const type = license.license_type
        if (!groups[type]) {
            groups[type] = []
        }
        groups[type].push(license)
        return groups
    }, {})

    return (
        <div className="lg:space-y-6 space-y-4">
            {Object.entries(licensesByType).map(([type, typeLicenses]) => (
                <div key={type} className="lg:space-y-4 space-y-2">
                    <h5 className="text-black !font-medium 2xl:!text-xl xl:!text-lg lg:!text-[17px] !text-lg">
                        {type === "choose_a_license" ? "License Options" : "Get Services from UI Website Templates Experts"}
                    </h5>

                    <div className="space-y-[14px]">
                        {typeLicenses.map((license) => (
                            <div key={license.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="relative flex items-center">
                                        {license.license_type === "choose_a_license" ? (
                                            <input
                                                type="radio"
                                                id={`license-${license.id}`}
                                                name="license"
                                                className="w-4 h-4 text-[#0156d5] border-[#d9dde2] focus:ring-[#0156d5]"
                                                checked={selectedLicense === license.id}
                                                onChange={() => handleLicenseChange(license.id)}
                                            />
                                        ) : (
                                            <input
                                                type="checkbox"
                                                id={`license-${license.id}`}
                                                className="w-4 h-4 text-[#0156d5] border-[#d9dde2] focus:ring-[#0156d5]"
                                                checked={selectedAddons.includes(license.id)}
                                                onChange={() => handleAddonChange(license.id)}
                                            />
                                        )}
                                        <label htmlFor={`license-${license.id}`} className="p2 ml-[10px] cursor-pointer">
                                            {license.license.title}
                                        </label>
                                        <div className="relative group">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-[18px] h-[18px] text-[#808080] ml-1 cursor-help"
                                            >
                                                <circle cx="12" cy="12" r="10" />
                                                <line x1="12" y1="16" x2="12" y2="12" />
                                                <line x1="12" y1="8" x2="12.01" y2="8" />
                                            </svg>
                                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-2 bg-black text-white text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-200 z-10">
                                                {license.license.description}
                                                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <span className={`font-medium p2 !text-black ${license.contact_sale ? "text-[#505050] italic" : ""}`}>
                                    {license.contact_sale ? "Full Access" : `$${license.sales_price.toFixed(2)}`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
