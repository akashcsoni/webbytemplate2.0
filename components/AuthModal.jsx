"use client"

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { themeConfig } from "@/config/theamConfig"
import { useAuth } from "@/contexts/AuthContext"
import { strapiPost } from "@/lib/api/strapiClient"
import Cookies from "js-cookie"

export default function AuthModal() {

    const { isAuthOpen, closeAuth, authMode, switchToOtp } = useAuth()

    const [inputValue, setInputValue] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    const isValidIndianMobile = (mobile) => /^(\+91)?[6-9]\d{9}$/.test(mobile.replace(/[\s\-()]/g, ""))

    const handleInputChange = (e) => {
        setInputValue(e.target.value)
        if (error) setError("")
    }

    const handleSubmit = async () => {
        if (!inputValue.trim()) {
            setError("Enter your email or mobile phone number")
            return
        }

        if (!isValidEmail(inputValue) && !isValidIndianMobile(inputValue)) {
            setError("Wrong or Invalid email address or mobile phone number. Please correct and try again.")
            return
        }

        setIsSubmitting(true)

        try {
            const response = await strapiPost("login-register-user", { email: inputValue }, themeConfig.TOKEN)

            if (response && response.message) {
                setSuccessMessage("OTP has been sent. Please check your email or phone.")

                setTimeout(() => {
                    switchToOtp(inputValue)
                    setSuccessMessage("")
                }, 1500)
            } else {
                setError("Something went wrong. Please try again.")
            }
        } catch (error) {
            console.error("Login error:", error)
            setError(error?.response?.data?.message || "An error occurred. Please try again later.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (authMode === "otp") {
        return <OtpModal isOpen={isAuthOpen} onClose={closeAuth} identifier={inputValue} />
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
                        <ModalHeader className="p-0 h2 gap-1 flex items-center justify-between w-full mb-[10px]">
                            Sign in or create account
                            <svg onClick={onClose} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
                                <path d="M17 5L5 17M5 5L17 17" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </ModalHeader>
                        <ModalBody className="p-0 gap-0">
                            <p className="p2 sm:mb-[30px] mb-5">Seamless shopping starts with a simple sign in or create account.</p>

                            <div className={`flex items-center border ${error ? "border-red-500" : "border-gray-100"} rounded-md overflow-hidden py-[11px] px-2`}>
                                <input
                                    type="text"
                                    placeholder="Enter mobile number or email"
                                    value={inputValue}
                                    onChange={handleInputChange}
                                    className="h-full w-full p2 !text-black placeholder:text-gray-300 px-2 mb-0.5 rounded-[5px] outline-none"
                                />
                            </div>

                            {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}
                            {successMessage && <div className="mt-2 text-green-600 text-sm">{successMessage}</div>}

                            <p className="p2 my-[22px]">
                                By continuing, you agree to WebbyTemplate's{" "}
                                <Link href="#" className="text-blue-600 underline">Conditions of Use</Link> and{" "}
                                <Link href="#" className="text-blue-600 underline">Privacy Notice</Link>.
                            </p>

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

function OtpModal({ isOpen, onClose, identifier }) {

    const { login } = useAuth()

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [otpError, setOtpError] = useState("")
    const [resendMessage, setResendMessage] = useState("")
    const [resendCooldown, setResendCooldown] = useState(0)
    const firstInputRef = useRef(null)

    useEffect(() => {
        if (isOpen && firstInputRef.current) {
            setTimeout(() => firstInputRef.current.focus(), 100)
        }
    }, [isOpen])

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
        if (value && !/^\d*$/.test(value)) return
        const newOtpValues = [...otpValues]
        newOtpValues[index] = value
        setOtpValues(newOtpValues)
        if (otpError) setOtpError("")
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
    }

    const handlePaste = (e) => {
        e.preventDefault()
        const numbersOnly = e.clipboardData.getData("text/plain").trim().replace(/\D/g, "")
        const newOtpValues = [...otpValues]
        for (let i = 0; i < Math.min(numbersOnly.length, 6); i++) {
            newOtpValues[i] = numbersOnly[i]
        }
        setOtpValues(newOtpValues)
        const nextEmptyIndex = newOtpValues.findIndex((val) => !val)
        const target = document.querySelector(`input[name=otp-${nextEmptyIndex !== -1 ? nextEmptyIndex : 5}]`)
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
        setResendMessage(null)
        if (!validateOtp()) return
        setIsSubmitting(true)
        const cart_id = Cookies.get('cart_id');
        try {
            const response = await strapiPost("verify-otp", { email: identifier, otp: otpValues.join(""), cart_id: cart_id }, themeConfig.TOKEN)

            if (response && response.jwt) {

                const query = {
                    token: response.jwt,
                    user: JSON.stringify(response.user), // serialize the user object
                };

                const queryString = Object.entries(query)
                    .filter(([_, value]) => value != null)
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join('&');

                const cookieResponse = await fetch(`/api/auth/login?${queryString}`);

                if (cookieResponse.ok) {
                    onClose()
                    login()
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
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
        if (resendCooldown > 0) return // prevent spamming resend

        setResendMessage(null)
        setOtpValues(["", "", "", "", "", ""])
        try {
            await strapiPost("login-register-user", { email: identifier }, themeConfig.TOKEN)
            setResendMessage("OTP has been resent successfully.")
            setOtpError("")
            setResendCooldown(15) // ⏱ Start cooldown
        } catch (error) {
            console.error("Resend OTP error:", error)
            setOtpError("Failed to resend OTP. Please try again.")
            setResendMessage("")
        }

        setTimeout(() => {
            setResendMessage(null)
        }, 2000)
    }

    return (
        <Modal hideCloseButton={true} isOpen={isOpen} onOpenChange={(open) => !open && onClose()} classNames={{ backdrop: "bg-black/50" }}>
            <ModalContent className="sm:p-[30px] p-5 xl:max-w-[510px] sm:max-w-[474px] w-full">
                {(onClose) => (
                    <>
                        <ModalHeader className="p-0 h2 gap-1 flex items-center justify-between w-full mb-[10px]">
                            OTP Verification
                            <svg onClick={onClose} className="cursor-pointer" xmlns="http://www.w3.org/2000/svg" width="22" height="22">
                                <path d="M17 5L5 17M5 5L17 17" stroke="black" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </ModalHeader>
                        <ModalBody className="p-0 gap-0">
                            <p className="p2 sm:mb-[30px] mb-5">
                                {identifier ? (
                                    <>
                                        We have sent a code to{" "}
                                        <span className="font-medium">
                                            {identifier.includes("@") ? identifier : identifier.replace(/(\d{2})(\d{6})(\d{2})/, "$1******$3")}
                                        </span>
                                    </>
                                ) : "Seamless shopping starts with a simple login."}
                            </p>

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

                            {otpError && <div className="mt-2 text-red-500 text-sm mb-2">{otpError}</div>}
                            {resendMessage && <div className="mt-2 text-green-600 text-sm mb-2">{resendMessage}</div>}

                            <div className="text-center mb-5">
                                <p className="text-sm text-gray-500">
                                    Didn't receive the code?{" "}
                                    <button
                                        className={`font-medium ${resendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:underline"}`}
                                        onClick={handleResendOtp}
                                        disabled={resendCooldown > 0}
                                    >
                                        {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                                    </button>
                                </p>
                            </div>

                            <button className="w-full btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Verifying..." : "Verify OTP"}
                            </button>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}
