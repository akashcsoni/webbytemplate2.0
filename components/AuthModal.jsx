"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import Link from "next/link";
import { useState, useRef, useEffect, useCallback } from "react";
import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import Cookies from "js-cookie";

const countries = [
    { name: "Afghanistan", code: "+93", short_name: "AF" },
    { name: "Albania", code: "+355", short_name: "AL" },
    { name: "Algeria", code: "+213", short_name: "DZ" },
    { name: "Andorra", code: "+376", short_name: "AD" },
    { name: "Angola", code: "+244", short_name: "AO" },
    { name: "Antigua and Barbuda", code: "+1-268", short_name: "AG" },
    { name: "Argentina", code: "+54", short_name: "AR" },
    { name: "Armenia", code: "+374", short_name: "AM" },
    { name: "Australia", code: "+61", short_name: "AU" },
    { name: "Austria", code: "+43", short_name: "AT" },
    { name: "Azerbaijan", code: "+994", short_name: "AZ" },
    { name: "Bahamas", code: "+1-242", short_name: "BS" },
    { name: "Bahrain", code: "+973", short_name: "BH" },
    { name: "Bangladesh", code: "+880", short_name: "BD" },
    { name: "Barbados", code: "+1-246", short_name: "BB" },
    { name: "Belarus", code: "+375", short_name: "BY" },
    { name: "Belgium", code: "+32", short_name: "BE" },
    { name: "Belize", code: "+501", short_name: "BZ" },
    { name: "Benin", code: "+229", short_name: "BJ" },
    { name: "Bhutan", code: "+975", short_name: "BT" },
    { name: "Bolivia", code: "+591", short_name: "BO" },
    { name: "Bosnia and Herzegovina", code: "+387", short_name: "BA" },
    { name: "Botswana", code: "+267", short_name: "BW" },
    { name: "Brazil", code: "+55", short_name: "BR" },
    { name: "Brunei", code: "+673", short_name: "BN" },
    { name: "Bulgaria", code: "+359", short_name: "BG" },
    { name: "Burkina Faso", code: "+226", short_name: "BF" },
    { name: "Burundi", code: "+257", short_name: "BI" },
    { name: "Cabo Verde", code: "+238", short_name: "CV" },
    { name: "Cambodia", code: "+855", short_name: "KH" },
    { name: "Cameroon", code: "+237", short_name: "CM" },
    { name: "Canada", code: "+1", short_name: "CA" },
    { name: "Central African Republic", code: "+236", short_name: "CF" },
    { name: "Chad", code: "+235", short_name: "TD" },
    { name: "Chile", code: "+56", short_name: "CL" },
    { name: "China", code: "+86", short_name: "CN" },
    { name: "Colombia", code: "+57", short_name: "CO" },
    { name: "Comoros", code: "+269", short_name: "KM" },
    { name: "Congo", code: "+242", short_name: "CG" },
    { name: "Congo (Democratic Republic)", code: "+243", short_name: "CD" },
    { name: "Costa Rica", code: "+506", short_name: "CR" },
    { name: "Croatia", code: "+385", short_name: "HR" },
    { name: "Cuba", code: "+53", short_name: "CU" },
    { name: "Cyprus", code: "+357", short_name: "CY" },
    { name: "Czech Republic", code: "+420", short_name: "CZ" },
    { name: "Denmark", code: "+45", short_name: "DK" },
    { name: "Djibouti", code: "+253", short_name: "DJ" },
    { name: "Dominica", code: "+1-767", short_name: "DM" },
    { name: "Dominican Republic", code: "+1-809", short_name: "DO" },
    { name: "Ecuador", code: "+593", short_name: "EC" },
    { name: "Egypt", code: "+20", short_name: "EG" },
    { name: "El Salvador", code: "+503", short_name: "SV" },
    { name: "Equatorial Guinea", code: "+240", short_name: "GQ" },
    { name: "Eritrea", code: "+291", short_name: "ER" },
    { name: "Estonia", code: "+372", short_name: "EE" },
    { name: "Eswatini", code: "+268", short_name: "SZ" },
    { name: "Ethiopia", code: "+251", short_name: "ET" },
    { name: "Fiji", code: "+679", short_name: "FJ" },
    { name: "Finland", code: "+358", short_name: "FI" },
    { name: "France", code: "+33", short_name: "FR" },
    { name: "Gabon", code: "+241", short_name: "GA" },
    { name: "Gambia", code: "+220", short_name: "GM" },
    { name: "Georgia", code: "+995", short_name: "GE" },
    { name: "Germany", code: "+49", short_name: "DE" },
    { name: "Ghana", code: "+233", short_name: "GH" },
    { name: "Greece", code: "+30", short_name: "GR" },
    { name: "Grenada", code: "+1-473", short_name: "GD" },
    { name: "Guatemala", code: "+502", short_name: "GT" },
    { name: "Guinea", code: "+224", short_name: "GN" },
    { name: "Guinea-Bissau", code: "+245", short_name: "GW" },
    { name: "Guyana", code: "+592", short_name: "GY" },
    { name: "Haiti", code: "+509", short_name: "HT" },
    { name: "Honduras", code: "+504", short_name: "HN" },
    { name: "Hungary", code: "+36", short_name: "HU" },
    { name: "Iceland", code: "+354", short_name: "IS" },
    { name: "India", code: "+91", short_name: "IN" },
    { name: "Indonesia", code: "+62", short_name: "ID" },
    { name: "Iran", code: "+98", short_name: "IR" },
    { name: "Iraq", code: "+964", short_name: "IQ" },
    { name: "Ireland", code: "+353", short_name: "IE" },
    { name: "Israel", code: "+972", short_name: "IL" },
    { name: "Italy", code: "+39", short_name: "IT" },
    { name: "Jamaica", code: "+1-876", short_name: "JM" },
    { name: "Japan", code: "+81", short_name: "JP" },
    { name: "Jordan", code: "+962", short_name: "JO" },
    { name: "Kazakhstan", code: "+7", short_name: "KZ" },
    { name: "Kenya", code: "+254", short_name: "KE" },
    { name: "Kiribati", code: "+686", short_name: "KI" },
    { name: "Korea (North)", code: "+850", short_name: "KP" },
    { name: "Korea (South)", code: "+82", short_name: "KR" },
    { name: "Kuwait", code: "+965", short_name: "KW" },
    { name: "Kyrgyzstan", code: "+996", short_name: "KG" },
    { name: "Laos", code: "+856", short_name: "LA" },
    { name: "Latvia", code: "+371", short_name: "LV" },
    { name: "Lebanon", code: "+961", short_name: "LB" },
    { name: "Lesotho", code: "+266", short_name: "LS" },
    { name: "Liberia", code: "+231", short_name: "LR" },
    { name: "Libya", code: "+218", short_name: "LY" },
    { name: "Liechtenstein", code: "+423", short_name: "LI" },
    { name: "Lithuania", code: "+370", short_name: "LT" },
    { name: "Luxembourg", code: "+352", short_name: "LU" },
    { name: "Madagascar", code: "+261", short_name: "MG" },
    { name: "Malawi", code: "+265", short_name: "MW" },
    { name: "Malaysia", code: "+60", short_name: "MY" },
    { name: "Maldives", code: "+960", short_name: "MV" },
    { name: "Mali", code: "+223", short_name: "ML" },
    { name: "Malta", code: "+356", short_name: "MT" },
    { name: "Marshall Islands", code: "+692", short_name: "MH" },
    { name: "Mauritania", code: "+222", short_name: "MR" },
    { name: "Mauritius", code: "+230", short_name: "MU" },
    { name: "Mexico", code: "+52", short_name: "MX" },
    { name: "Micronesia", code: "+691", short_name: "FM" },
    { name: "Moldova", code: "+373", short_name: "MD" },
    { name: "Monaco", code: "+377", short_name: "MC" },
    { name: "Mongolia", code: "+976", short_name: "MN" },
    { name: "Montenegro", code: "+382", short_name: "ME" },
    { name: "Morocco", code: "+212", short_name: "MA" },
    { name: "Mozambique", code: "+258", short_name: "MZ" },
    { name: "Myanmar", code: "+95", short_name: "MM" },
    { name: "Namibia", code: "+264", short_name: "NA" },
    { name: "Nauru", code: "+674", short_name: "NR" },
    { name: "Nepal", code: "+977", short_name: "NP" },
    { name: "Netherlands", code: "+31", short_name: "NL" },
    { name: "New Zealand", code: "+64", short_name: "NZ" },
    { name: "Nicaragua", code: "+505", short_name: "NI" },
    { name: "Niger", code: "+227", short_name: "NE" },
    { name: "Nigeria", code: "+234", short_name: "NG" },
    { name: "North Macedonia", code: "+389", short_name: "MK" },
    { name: "Norway", code: "+47", short_name: "NO" },
    { name: "Oman", code: "+968", short_name: "OM" },
    { name: "Pakistan", code: "+92", short_name: "PK" },
    { name: "Palau", code: "+680", short_name: "PW" },
    { name: "Panama", code: "+507", short_name: "PA" },
    { name: "Papua New Guinea", code: "+675", short_name: "PG" },
    { name: "Paraguay", code: "+595", short_name: "PY" },
    { name: "Peru", code: "+51", short_name: "PE" },
    { name: "Philippines", code: "+63", short_name: "PH" },
    { name: "Poland", code: "+48", short_name: "PL" },
    { name: "Portugal", code: "+351", short_name: "PT" },
    { name: "Qatar", code: "+974", short_name: "QA" },
    { name: "Romania", code: "+40", short_name: "RO" },
    { name: "Russia", code: "+7", short_name: "RU" },
    { name: "Rwanda", code: "+250", short_name: "RW" },
    { name: "Saint Kitts and Nevis", code: "+1-869", short_name: "KN" },
    { name: "Saint Lucia", code: "+1-758", short_name: "LC" },
    { name: "Saint Vincent and the Grenadines", code: "+1-784", short_name: "VC" },
    { name: "Samoa", code: "+685", short_name: "WS" },
    { name: "San Marino", code: "+378", short_name: "SM" },
    { name: "Sao Tome and Principe", code: "+239", short_name: "ST" },
    { name: "Saudi Arabia", code: "+966", short_name: "SA" },
    { name: "Senegal", code: "+221", short_name: "SN" },
    { name: "Serbia", code: "+381", short_name: "RS" },
    { name: "Seychelles", code: "+248", short_name: "SC" },
    { name: "Sierra Leone", code: "+232", short_name: "SL" },
    { name: "Singapore", code: "+65", short_name: "SG" },
    { name: "Slovakia", code: "+421", short_name: "SK" },
    { name: "Slovenia", code: "+386", short_name: "SI" },
    { name: "Solomon Islands", code: "+677", short_name: "SB" },
    { name: "Somalia", code: "+252", short_name: "SO" },
    { name: "South Africa", code: "+27", short_name: "ZA" },
    { name: "South Sudan", code: "+211", short_name: "SS" },
    { name: "Spain", code: "+34", short_name: "ES" },
    { name: "Sri Lanka", code: "+94", short_name: "LK" },
    { name: "Sudan", code: "+249", short_name: "SD" },
    { name: "Suriname", code: "+597", short_name: "SR" },
    { name: "Sweden", code: "+46", short_name: "SE" },
    { name: "Switzerland", code: "+41", short_name: "CH" },
    { name: "Syria", code: "+963", short_name: "SY" },
    { name: "Taiwan", code: "+886", short_name: "TW" },
    { name: "Tajikistan", code: "+992", short_name: "TJ" },
    { name: "Tanzania", code: "+255", short_name: "TZ" },
    { name: "Thailand", code: "+66", short_name: "TH" },
    { name: "Timor-Leste", code: "+670", short_name: "TL" },
    { name: "Togo", code: "+228", short_name: "TG" },
    { name: "Tonga", code: "+676", short_name: "TO" },
    { name: "Trinidad and Tobago", code: "+1-868", short_name: "TT" },
    { name: "Tunisia", code: "+216", short_name: "TN" },
    { name: "Turkey", code: "+90", short_name: "TR" },
    { name: "Turkmenistan", code: "+993", short_name: "TM" },
    { name: "Tuvalu", code: "+688", short_name: "TV" },
    { name: "Uganda", code: "+256", short_name: "UG" },
    { name: "Ukraine", code: "+380", short_name: "UA" },
    { name: "United Arab Emirates", code: "+971", short_name: "AE" },
    { name: "United Kingdom", code: "+44", short_name: "GB" },
    { name: "United States", code: "+1", short_name: "US" },
    { name: "Uruguay", code: "+598", short_name: "UY" },
    { name: "Uzbekistan", code: "+998", short_name: "UZ" },
    { name: "Vanuatu", code: "+678", short_name: "VU" },
    { name: "Vatican City", code: "+379", short_name: "VA" },
    { name: "Venezuela", code: "+58", short_name: "VE" },
    { name: "Vietnam", code: "+84", short_name: "VN" },
    { name: "Yemen", code: "+967", short_name: "YE" },
    { name: "Zambia", code: "+260", short_name: "ZM" },
    { name: "Zimbabwe", code: "+263", short_name: "ZW" },
]

export default function AuthModal() {
    const { isAuthOpen, closeAuth, authMode, switchToOtp } = useAuth()
    const [inputValue, setInputValue] = useState("")
    const [inputMode, setInputMode] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [selectedCountry, setSelectedCountry] = useState({
        short_name: "IN",
        code: "+91",
        name: "India",
    })
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const inputRef = useRef(null)

    const isValidEmail = useCallback((email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }, [])

    const isValidMobile = useCallback((mobile) => {
        // More flexible mobile validation - accepts 6-15 digits
        return /^[0-9]{6,15}$/.test(mobile.replace(/[\s\-()]/g, ""))
    }, [])

    const handleInputChange = (e) => {
        const rawValue = e.target.value

        // Clear error when user starts typing
        if (error) setError("")

        // Determine input mode based on content
        if (rawValue.includes("@") || /[a-zA-Z]/.test(rawValue)) {
            setInputMode("email")
            setInputValue(rawValue)
        } else if (rawValue === "") {
            setInputMode("")
            setInputValue("")
        } else if (/^\d+$/.test(rawValue)) {
            setInputMode("mobile")
            setInputValue(rawValue)
        } else if (inputMode === "mobile") {
            // Prevent non-digit characters in mobile mode
            return
        } else {
            setInputMode("")
            setInputValue(rawValue)
        }
    }

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen)

    const selectCountry = (country) => {
        setSelectedCountry(country)
        setIsDropdownOpen(false)
    }

    const validateInput = () => {
        if (!inputValue.trim()) {
            setError("Enter your email or mobile phone number")
            return false
        }

        if (inputMode === "email" && !isValidEmail(inputValue)) {
            setError("Please enter a valid email address")
            return false
        }

        if (inputMode === "mobile" && !isValidMobile(inputValue)) {
            setError("Please enter a valid mobile number")
            return false
        }

        if (!inputMode) {
            setError("Please enter a valid email or mobile number")
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        if (!validateInput()) return

        const isEmail = inputMode === "email"
        const formattedMobile = `${selectedCountry.code} ${inputValue}`
        const payload = isEmail ? { email: inputValue, type: "email" } : { mobile: formattedMobile, type: "mobile" }

        setIsSubmitting(true)
        setError("")

        try {
            const response = await strapiPost("login-register-user", payload, themeConfig.TOKEN)

            if (response?.message) {
                setSuccessMessage("OTP has been sent.")
                setTimeout(() => {
                    switchToOtp(isEmail ? inputValue : formattedMobile)
                    setSuccessMessage("")
                }, 1500)
            } else {
                setError("Something went wrong. Please try again.")
            }
        } catch (error) {
            setError(error?.response?.data?.message || "An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSubmit()
        }

        // Prevent typing non-digits in mobile mode
        if (inputMode === "mobile" && !/[\d]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
            e.preventDefault()
        }
    }

    // Focus input when switching to mobile mode
    useEffect(() => {
        if (inputMode === "mobile" && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 50)
        }
    }, [inputMode])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest(".country-dropdown")) {
                setIsDropdownOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isDropdownOpen])

    if (authMode === "otp") {
        return (
            <OtpModal
                isOpen={isAuthOpen}
                onClose={closeAuth}
                identifier={inputMode === "email" ? inputValue : `${selectedCountry.code}${inputValue}`}
                type={inputMode === "email" ? "email" : "mobile"}
            />
        )
    }

    return (
        <Modal
            hideCloseButton={true}
            isOpen={isAuthOpen}
            onOpenChange={(open) => !open && closeAuth()}
            classNames={{ backdrop: "bg-black/50" }}
        >
            <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
                {(onClose) => (
                    <>
                        <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
                            Sign in or create account
                            <button
                                onClick={onClose}
                                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </ModalHeader>

                        <ModalBody className="p-0 gap-0 relative">
                            <p className="text-gray-600 sm:mb-[30px] mb-5">
                                Seamless shopping starts with a simple sign in or create account.
                            </p>

                            {inputMode === "mobile" ? (
                                <div
                                    className={`flex items-center border ${error ? "border-red-500" : "border-gray-200"
                                        } rounded-md py-[11px] px-2 relative country-dropdown`}
                                >
                                    <div className="relative z-10">
                                        <button
                                            type="button"
                                            onClick={toggleDropdown}
                                            className="flex items-center justify-between min-w-[80px] w-auto pr-3 pl-[10px] border-r border-gray-200 bg-white uppercase hover:bg-gray-50 transition-colors"
                                            tabIndex={-1}
                                            aria-label="Select country code"
                                        >
                                            <span className="text-sm whitespace-nowrap">
                                                {selectedCountry.short_name} {selectedCountry.code}
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="9"
                                                height="11"
                                                viewBox="0 0 9 11"
                                                fill="none"
                                                className={`ml-2 transition-transform duration-300 flex-shrink-0 ${isDropdownOpen ? "rotate-0" : "rotate-180"
                                                    }`}
                                            >
                                                <path
                                                    d="M4.1612 2.31217C4.35263 2.13578 4.64737 2.13578 4.8388 2.31217L8.8388 5.9977C8.94155 6.09237 9 6.22571 9 6.36541V6.85679C9 7.29285 8.48076 7.51995 8.16057 7.22393L4.83943 4.15343C4.64781 3.97628 4.35219 3.97628 4.16057 4.15343L0.839427 7.22393C0.519237 7.51995 0 7.29285 0 6.85679V6.36541C0 6.22571 0.0584515 6.09237 0.161196 5.9977L4.1612 2.31217Z"
                                                    fill="#505050"
                                                />
                                            </svg>
                                        </button>

                                        {isDropdownOpen && (
                                            <ul className="absolute z-20 bg-white border border-gray-200 rounded-[5px] shadow-lg max-h-36 overflow-y-auto w-full left-0 top-full mt-1">
                                                {countries.map((country) => (
                                                    <li
                                                        key={country.short_name}
                                                        onClick={() => selectCountry(country)}
                                                        className={`cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${selectedCountry.code === country.code ? "bg-blue-500 text-white hover:bg-blue-600" : ""
                                                            }`}
                                                    >
                                                        {country.name} {country.code}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <input
                                        ref={inputRef}
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Enter mobile number"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                                        aria-label="Mobile number"
                                    />
                                </div>
                            ) : (
                                <div
                                    className={`flex items-center border ${error ? "border-red-500" : "border-gray-200"
                                        } rounded-md py-[11px] px-2`}
                                >
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Enter mobile number or email"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={handleKeyDown}
                                        className="h-full w-full text-sm text-black placeholder:text-gray-400 px-2 mb-0.5 rounded-[5px] outline-none"
                                        aria-label="Email or mobile number"
                                    />
                                </div>
                            )}

                            {error && (
                                <div className="mt-2 text-red-500 text-sm" role="alert">
                                    {error}
                                </div>
                            )}

                            {successMessage && (
                                <div className="mt-2 text-green-600 text-sm" role="status">
                                    {successMessage}
                                </div>
                            )}

                            <p className="text-sm text-gray-600 my-[22px]">
                                By continuing, you agree to WebbyTemplate's{" "}
                                <Link href="#" className="text-blue-600 underline hover:text-blue-800">
                                    Conditions of Use
                                </Link>{" "}
                                and{" "}
                                <Link href="#" className="text-blue-600 underline hover:text-blue-800">
                                    Privacy Notice
                                </Link>
                                .
                            </p>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Processing..." : "Continue"}
                            </button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

function OtpModal({ isOpen, onClose, identifier, type }) {
    const { login } = useAuth()
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [otpError, setOtpError] = useState("")
    const [resendMessage, setResendMessage] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)

    const firstInputRef = useRef(null)

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => firstInputRef.current?.focus(), 100)
        }
    }, [isOpen])

    // Handle resend cooldown timer
    useEffect(() => {
        if (resendCooldown === 0) return

        const timer = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleOtpChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return

        const newOtpValues = [...otpValues]
        newOtpValues[index] = value
        setOtpValues(newOtpValues)

        // Clear error when user starts typing
        if (otpError) setOtpError("")

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`)
            if (prevInput) prevInput.focus()
        }

        if (e.key === "Enter") {
            handleSubmit()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const numbersOnly = e.clipboardData.getData("text/plain").trim().replace(/\D/g, "")

        const newOtpValues = [...otpValues]
        for (let i = 0; i < Math.min(numbersOnly.length, 6); i++) {
            newOtpValues[i] = numbersOnly[i]
        }
        setOtpValues(newOtpValues)

        // Focus next empty input or last input
        const nextEmptyIndex = newOtpValues.findIndex((val) => !val)
        const targetIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
        const target = document.querySelector(`input[name=otp-${targetIndex}]`)
        if (target) target.focus()
    }

    const validateOtp = () => {
        if (otpValues.some((val) => !val)) {
            setOtpError("Please enter the complete 6-digit OTP")
            return false
        }

        if (otpValues.some((val) => !/^\d$/.test(val))) {
            setOtpError("OTP must contain only numbers")
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        setResendMessage("")
        if (!validateOtp()) return

        setIsSubmitting(true)
        const cart_id = Cookies.get("cart_id")
        const wishlist_id = Cookies.get("wishlist_id")

        try {
            const response = await strapiPost(
                "verify-otp",
                {
                    [type === "email" ? "email" : "mobile"]: identifier,
                    type: type,
                    otp: otpValues.join(""),
                    cart_id: cart_id,
                    wishlist_id: wishlist_id,
                },
                themeConfig.TOKEN,
            )

            if (response && response.jwt) {
                const query = {
                    token: response.jwt,
                    user: JSON.stringify(response.user),
                }

                const queryString = Object.entries(query)
                    .filter(([_, value]) => value != null)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join("&")

                const cookieResponse = await fetch(`/api/auth/login?${queryString}`)

                if (cookieResponse.ok) {
                    onClose()
                    login()

                    const currentUrl = window.location.href
                    const hasAuthorQuery = currentUrl.includes("author=true")
                    const username = response.user?.username

                    setTimeout(() => {
                        if (hasAuthorQuery && username) {
                            window.location.href = `/user/${username}/become-an-author`
                        } else {
                            window.location.reload()
                        }
                    }, 1000)
                } else {
                    throw new Error("Failed to set authentication cookies")
                }
            } else {
                setOtpError("Invalid OTP. Please try again.")
            }
        } catch (error) {
            setOtpError(error?.response?.data?.error?.message || "An error occurred. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendOtp = async () => {
        if (resendCooldown > 0) return

        setResendMessage("")
        setOtpValues(["", "", "", "", "", ""])

        try {
            const payload = type === "email" ? { email: identifier, type: "email" } : { mobile: identifier, type: "mobile" }

            await strapiPost("login-register-user", payload, themeConfig.TOKEN)

            setResendMessage("OTP has been resent successfully.")
            setOtpError("")
            setResendCooldown(30) // 30 second cooldown
        } catch (error) {
            setOtpError("Failed to resend OTP. Please try again.")
            setResendMessage("")
        }

        setTimeout(() => {
            setResendMessage("")
        }, 3000)
    }

    const maskIdentifier = (identifier) => {
        if (identifier.includes("@")) {
            // Email masking
            const [username, domain] = identifier.split("@")
            const maskedUsername = username.length > 2 ? username.slice(0, 2) + "*".repeat(username.length - 2) : username
            return `${maskedUsername}@${domain}`
        } else {
            // Mobile masking - show first 2 and last 2 digits
            const cleanNumber = identifier.replace(/\D/g, "")
            if (cleanNumber.length > 4) {
                return cleanNumber.slice(0, 2) + "*".repeat(cleanNumber.length - 4) + cleanNumber.slice(-2)
            }
            return identifier
        }
    }

    return (
        <Modal
            hideCloseButton={true}
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            classNames={{ backdrop: "bg-black/50" }}
        >
            <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
                {(onClose) => (
                    <>
                        <ModalHeader className="p-0 text-2xl font-bold gap-1 flex items-center justify-between w-full mb-[10px]">
                            OTP Verification
                            <button
                                onClick={onClose}
                                className="cursor-pointer p-1 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close modal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </ModalHeader>

                        <ModalBody className="p-0 gap-0">
                            <p className="text-gray-600 sm:mb-[30px] mb-5">
                                {identifier ? (
                                    <>
                                        We have sent a code to <span className="font-medium">{maskIdentifier(identifier)}</span>
                                    </>
                                ) : (
                                    "Seamless shopping starts with a simple login."
                                )}
                            </p>

                            <div className="flex justify-center md:space-x-[18px] space-x-3 mb-[18px]">
                                {otpValues.map((value, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        name={`otp-${index}`}
                                        maxLength={1}
                                        value={value}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        ref={index === 0 ? firstInputRef : null}
                                        className={`2xl:w-[60px] 2xl:h-[60px] xl:w-[55px] xl:h-[55px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] text-center text-lg font-medium border ${otpError ? "border-red-500" : "border-gray-200"
                                            } text-black placeholder:text-gray-400 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all`}
                                        aria-label={`OTP digit ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {otpError && (
                                <div className="mt-2 text-red-500 text-sm mb-2" role="alert">
                                    {otpError}
                                </div>
                            )}

                            {resendMessage && (
                                <div className="mt-2 text-green-600 text-sm mb-2" role="status">
                                    {resendMessage}
                                </div>
                            )}

                            <div className="text-center mb-5">
                                <p className="text-sm text-gray-500">
                                    {"Didn't receive the code? "}
                                    <button
                                        className={`font-medium transition-colors ${resendCooldown > 0
                                            ? "text-gray-400 cursor-not-allowed"
                                            : "text-blue-600 hover:text-blue-800 hover:underline"
                                            }`}
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0}
                                    >
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                                    </button>
                                </p>
                            </div>

                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Verifying..." : "Verify OTP"}
                            </button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
