import Link from 'next/link'
import React from 'react'

const SubscribeSection = ({ title, label, check_box, email_input }) => {
    return (
        <div>
            <div className="w-full bg-[#0156d5] py-12 px-4">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="max-w-md">
                        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">{title}</h2>
                        <p className="text-white text-base">
                            {label}
                        </p>
                    </div>

                    <div className="w-full max-w-md">
                        {
                            email_input && (
                                <form>
                                    <div className="bg-white rounded-lg overflow-hidden">
                                        <div className="flex">
                                            <input
                                                type="email"
                                                placeholder="Enter your email here..."
                                                className="flex-grow p-4 outline-none text-gray-700"
                                            />
                                            <button
                                                type="submit"
                                                className="bg-[#0156d5] text-white font-medium py-4 px-6 whitespace-nowrap"
                                            >
                                                {"Subscribe"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="terms" className="text-white text-sm">
                                            I accept the Terms of Service and{" "}
                                            <Link href="/privacy-policy" className="underline">
                                                Privacy Policy
                                            </Link>
                                            .
                                        </label>
                                    </div>
                                </form>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SubscribeSection
