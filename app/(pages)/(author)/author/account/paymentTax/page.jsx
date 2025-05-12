"use client"

import { useState } from "react"

export default function paymentTaxPage() {
    const [step, setStep] = useState(1)
    const [selectedReason, setSelectedReason] = useState("")
    const [feedback, setFeedback] = useState("")

    const reasons = [
        "I no longer need DailyWe",
        "I've switched to another account",
        "I have concerns about my data/privacy",
        "I'm receiving too many alerts or messages",
        "The app isn't working as expected",
        "Something else",
    ]

    return (
        <div className="h-[600px]">
            {step === 1 && (
                <div className="md:space-y-[25px] space-y-5">
                    <h2 className="md:px-[30px] px-5 md:py-4 py-3 subpoint-heading !font-normal border-b border-[#0023161A] ">
                        Account Privacy & Policy
                    </h2>
                    <p className="2xl:text-base md:text-[15px] sm:text-sm text-[13px] font-light md:px-[30px] px-5 text-[#808080] md:leading-[26px] leading-[23px]">
                        At DailyWe, we value your privacy and are committed to protecting your personal information. By using our
                        website or app, you agree to our Privacy Policy and Terms of Use. We may collect and use your data to
                        improve our services. Please review our policy regularly for updates. For any queries, reach out to us at{" "}
                        <span className="text-[#066A44] underline underline-offset-2 decoration-[#066A44]">
                            support@dailywe.com.
                        </span>
                    </p>
                    <div className="md:px-[30px] px-5">
                        <button onClick={() => setStep(2)} className="btn btn-primary">
                            Request to delete
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="md:space-y-6 space-y-5">
                    <h2 className="md:px-[30px] px-5 py-4 subpoint-heading !font-normal border-b border-[#0023161A]">
                        Delete My Account
                    </h2>
                    <div className="md:px-[30px] px-5">
                        <p className="text-[#616161] 2xl:text-base md:text-[15px] text-sm font-light mb-[20px]">
                            Help us understand why you&apos;re leaving:
                        </p>
                        <div className="grid grid-cols-1 gap-3">
                            {reasons.map((reason) => (
                                <button
                                    key={reason}
                                    onClick={() => {
                                        setSelectedReason(reason)
                                        setStep(3)
                                    }}
                                    className="flex items-center justify-between w-full px-4 md:py-3 py-2 border border-gray-300 rounded-md 2xl:text-base md:text-[15px] sm:text-sm text-[13px] text-left hover:border-[#066A44] hover:text-[#066A44] hover:bg-[#066A4412] group cursor-pointer"
                                >
                                    {reason}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={24}
                                        height={24}
                                        viewBox="0 0 24 24"
                                        className="md:w-6 md:h-6 w-5 h-5 fill-blavk group-hover:fill-[#066A4412]"
                                    >
                                        <path
                                            d="m13.292 12l-4.6-4.6l.708-.708L14.708 12L9.4 17.308l-.708-.708z"
                                            strokeWidth={1}
                                            stroke="currentColor"
                                        ></path>
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="md:space-y-6 space-y-5">
                    <h2 className="md:px-[30px] px-5 md:py-4 py-3 subpoint-heading !font-normal border-b border-[#0023161A]">
                        {selectedReason}
                    </h2>
                    <div className="px-[20px] space-y-5">
                        <p className="text-[#616161] 2xl:text-base md:text-[15px] text-sm font-light md:mb-[25px] mb-5">
                            Have any thoughts to share? We`&lsquo;d love your feedback! (optional)
                        </p>

                        <div className="flex justify-between items-center sm:flex-nowrap flex-wrap md:gap-[18px] gap-2">
                            <input
                                type="text"
                                placeholder="Enter your feedback..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-4 py-2 xl:h-[46px] h-11 2xl:text-base md:text-[15px] text-sm font-light focus:outline-none focus:ring-1 focus:ring-gray-400"
                            />
                            <button className="btn btn-primary flex-shrink-0 flex items-center justify-center gap-[10px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24">
                                    <path
                                        fill="none"
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.687 6.213L6.8 18.976a2.5 2.5 0 0 0 2.466 2.092h3.348m6.698-14.855L17.2 18.976a2.5 2.5 0 0 1-2.466 2.092h-3.348m-1.364-9.952v5.049m3.956-5.049v5.049M2.75 6.213h18.5m-6.473 0v-1.78a1.5 1.5 0 0 0-1.5-1.5h-2.554a1.5 1.5 0 0 0-1.5 1.5v1.78z"
                                    ></path>
                                </svg>
                                Delete My Account
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="sm:text-sm text-[13px] font-light text-[#616161] leading-[22px]">
                                <span className="font-normal text-black">Note:</span> All your account data will be permanently deleted
                                as per our privacy policy. Once deleted, this information cannot be recovered.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
