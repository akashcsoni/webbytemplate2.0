"use client"

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { themeConfig } from "@/config/theamConfig"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthModal() {
    
    const { isAuthOpen, closeAuth, authMode, switchToOtp } = useAuth()
    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [userId, setUserId] = useState(null) // Store userId from API response

    // Validation functions
    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailRegex.test(email)
    }

    const isValidIndianMobile = (mobile) => {
        // Remove any spaces, dashes, or parentheses
        const cleanedMobile = mobile.replace(/[\s\-()]/g, "")

        // Check if it's a valid Indian mobile number (with or without +91)
        // Indian mobile numbers are 10 digits and typically start with 6, 7, 8, or 9
        const mobileRegex = /^(\+91)?[6-9]\d{9}$/
        return mobileRegex.test(cleanedMobile)
    }

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        // Clear error when user starts typing
        if (error) setError("")
    }

    const handleSubmit = async () => {
        // Check if field is empty
        if (!inputValue.trim()) {
            setError("Enter your email or mobile phone number")
            return
        }

        // Check if it's a valid email or Indian mobile number
        if (!isValidEmail(inputValue) && !isValidIndianMobile(inputValue)) {
            setError("Wrong or Invalid email address or mobile phone number. Please correct and try again.")
            return
        }

        // If validation passes, proceed with submission
        setIsSubmitting(true)

        try {
            // Create form data for API request
            const formData = new FormData()
            formData.append("email", inputValue)

            // Call login API
            const response = await axios({
                method: "post",
                url: "https://studio.webbytemplate.com/api/login-register-user",
                headers: {
                    Authorization: themeConfig.TOKEN, // Replace with your actual authorization token
                },
                data: formData,
            })

            // Handle successful response
            if (response.data && response.data.message) {
                // Store userId for OTP verification
                setUserId(response.data.userId)
                // Move to OTP screen
                switchToOtp(inputValue)
            } else {
                setError("Something went wrong. Please try again.")
            }
        } catch (error) {
            console.error("Login error:", error)
            setError(error.response?.data?.message || "An error occurred. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (authMode === "otp") {
        return <OtpModal isOpen={isAuthOpen} onClose={closeAuth} identifier={inputValue} userId={userId} />
    }

    return (
        <Modal
            hideCloseButton={true}
            isOpen={isAuthOpen}
            onOpenChange={(open) => !open && closeAuth()}
            classNames={{
                backdrop: "bg-black/50",
            }}
        >
            <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
                {(onClose) => (
                    <>
                        <ModalHeader className="p-0 h2 gap-1 flex items-center justify-between w-full mb-[10px]">
                            Sign in or create account
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                className="cursor-pointer"
                                onClick={onClose}
                            >
                                <path
                                    d="M17 5L5 17M5 5L17 17"
                                    stroke="black"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </ModalHeader>
                        <ModalBody className="p-0 gap-0">
                            <p className="p2 sm:mb-[30px] mb-5">Seamless shopping starts with a simple sign in or create account.</p>

                            {/* Input Field */}
                            <div
                                className={`flex items-center border ${error ? "border-red-500" : "border-gray-100"} rounded-md overflow-hidden py-[11px] px-2`}
                            >
                                <input
                                    type="text"
                                    placeholder="Enter mobile number or email"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="h-full w-full p2 !text-black placeholder:text-gray-300 px-2 mb-0.5 rounded-[5px] outline-none"
                                />
                            </div>

                            {/* Error Message */}
                            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

                            {/* Terms */}
                            <p className="p2 my-[22px]">
                                By continuing, you agree to WebbyTemplate's{" "}
                                <Link href="#" className="text-blue-600 underline">
                                    Conditions of Use
                                </Link>{" "}
                                and{" "}
                                <Link href="#" className="text-blue-600 underline">
                                    Privacy Notice
                                </Link>
                                .
                            </p>

                            {/* Action Button */}
                            <button className="w-full btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Processing..." : "Continue"}
                            </button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

function OtpModal({ isOpen, onClose, identifier, userId }) {
    const { login } = useAuth()
    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [otpError, setOtpError] = useState("")
    const firstInputRef = useRef(null)

    // Focus first input when modal opens
    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => {
                firstInputRef.current.focus()
            }, 100)
        }
    }, [isOpen])

    const handleOtpChange = (index, value) => {
        // Only allow numbers
        if (value && !/^\d*$/.test(value)) return

        const newOtpValues = [...otpValues]
        newOtpValues[index] = value
        setOtpValues(newOtpValues)

        // Clear error when user types
        if (otpError) setOtpError("")

        // Auto-focus next input if current input is filled
        if (value && index < 5) {
            const nextInput = document.querySelector(`input[name=otp-${index + 1}]`)
            if (nextInput) nextInput.focus()
        }
    }

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current input is empty
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            const prevInput = document.querySelector(`input[name=otp-${index - 1}]`)
            if (prevInput) prevInput.focus()
        }
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData("text/plain").trim()

        // Extract only numbers from pasted content
        const numbersOnly = pastedData.replace(/\D/g, "")

        // Fill in OTP fields with pasted numbers
        const newOtpValues = [...otpValues]
        for (let i = 0; i < Math.min(numbersOnly.length, 6); i++) {
            newOtpValues[i] = numbersOnly[i]
        }

        setOtpValues(newOtpValues)

        // Focus on the next empty field or the last field
        const nextEmptyIndex = newOtpValues.findIndex((val) => !val)
        if (nextEmptyIndex !== -1 && nextEmptyIndex < 6) {
            const nextInput = document.querySelector(`input[name=otp-${nextEmptyIndex}]`)
            if (nextInput) nextInput.focus()
        } else {
            const lastInput = document.querySelector(`input[name=otp-5]`)
            if (lastInput) lastInput.focus()
        }
    }

    const validateOtp = () => {
        // Check if any field is empty
        if (otpValues.some((val) => !val)) {
            setOtpError("Please enter the complete 6-digit OTP")
            return false
        }

        // Check if all values are numeric (should be redundant due to input validation)
        if (otpValues.some((val) => !/^\d$/.test(val))) {
            setOtpError("OTP must contain only numbers")
            return false
        }

        return true
    }

    const handleSubmit = async () => {
        // Validate OTP
        if (!validateOtp()) {
            return
        }

        setIsSubmitting(true)

        try {
            // Combine OTP digits
            const otpCode = otpValues.join("")

            // Create form data for API request
            const formData = new FormData()
            formData.append("email", identifier)
            formData.append("otp", otpCode)

            // Call API to verify OTP
            const response = await axios({
                method: "post",
                url: "https://studio.webbytemplate.com/api/verify-otp",
                headers: {
                    Authorization: themeConfig.TOKEN, // Replace with your actual authorization token
                },
                data: formData,
            })

            // Handle successful response
            if (response.data && response.data.jwt) {
                // Call the login function from auth context to store user data and token
                login(response.data.user, response.data.jwt)
                // Close modal after successful verification
                onClose()
            } else {
                setOtpError("Invalid OTP. Please try again.")
            }
        } catch (error) {
            console.error("OTP verification error:", error)
            setOtpError(error.response?.data?.message || "An error occurred. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendOtp = async () => {
        try {
            // Create form data for API request
            const formData = new FormData()
            formData.append("email", identifier)

            // Call login API again to resend OTP
            await axios({
                method: "post",
                url: "https://studio.webbytemplate.com/api/login-register-user",
                headers: {
                    Authorization: themeConfig.TOKEN, // Replace with your actual authorization token
                },
                data: formData,
            })

            // Show success message
            alert("OTP has been resent to your email.")
        } catch (error) {
            console.error("Resend OTP error:", error)
            alert("Failed to resend OTP. Please try again.")
        }
    }

    return (
        <Modal
            hideCloseButton={true}
            isOpen={isOpen}
            onOpenChange={(open) => !open && onClose()}
            classNames={{
                backdrop: "bg-black/50",
            }}
        >
            <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
                {(onClose) => (
                    <>
                        <ModalHeader className="p-0 h2 gap-1 flex items-center justify-between w-full mb-[10px]">
                            Log in
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                viewBox="0 0 22 22"
                                fill="none"
                                className="cursor-pointer"
                                onClick={onClose}
                            >
                                <path
                                    d="M17 5L5 17M5 5L17 17"
                                    stroke="black"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </ModalHeader>
                        <ModalBody className="p-0 gap-0">
                            <p className="p2 sm:mb-[30px] mb-5">
                                {identifier ? (
                                    <>
                                        Enter the 6-digit code sent to{" "}
                                        <span className="font-medium">
                                            {identifier.includes("@")
                                                ? identifier
                                                : identifier.replace(/(\d{2})(\d{6})(\d{2})/, "$1******$3")}
                                        </span>
                                    </>
                                ) : (
                                    "Seamless shopping starts with a simple login."
                                )}
                            </p>

                            {/* Input */}
                            <div className="md:space-x-[18px] space-x-3 mb-[18px] otp-input">
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
                                        className={`2xl:w-[60px] 2xl:h-[60px] xl:w-[55px] xl:h-[55px] md:w-[50px] md:h-[50px] w-[45px] h-[45px] text-center p2 p-2 border ${otpError ? "border-red-500" : "border-gray-100"} text-gray-300 placeholder:text-gray-300 rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-600`}
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {otpError && <div className="mt-2 text-red-500 text-sm mb-4">{otpError}</div>}

                            {/* Resend OTP */}
                            <div className="text-center mb-5">
                                <p className="text-sm text-gray-500">
                                    Didn't receive the code?{" "}
                                    <button className="text-blue-600 font-medium hover:underline" onClick={handleResendOtp}>
                                        Resend OTP
                                    </button>
                                </p>
                            </div>

                            {/* Terms */}
                            <p className="p2 mb-[22px]">
                                By continuing, you acknowledge and agree to our{" "}
                                <a href="#" className="text-blue-600 underline">
                                    Terms of use
                                </a>{" "}
                                and{" "}
                                <a href="#" className="text-blue-600 underline">
                                    Privacy Policy
                                </a>
                                .
                            </p>

                            {/* Sign In Button */}
                            <button className="w-full btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Sign in"}
                            </button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
