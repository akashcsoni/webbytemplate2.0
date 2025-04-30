import Link from 'next/link'
import React from 'react'

const SubscribeSection = ({ title, label, check_box, email_input }) => {
    return (
        <div className='xl:pt-[35px] sm:pt-[30px] pt-5'>
            <div className="w-full bg-primary py-10">
                <div className="container mx-auto">
                <div className="mx-auto flex flex-col lg:flex-row items-center justify-between 2xl:gap-[230px] xl:gap-[140px] lg:gap-[65px] sm:gap-6 gap-4">
                    <div className="sm:max-w-[626px] w-full lg:text-start sm:text-center text-start">
                        <h2 className="text-white 2xl:mb-[18px] xl:mb-3 mb-2">{title}</h2>
                        <p className="text-white 2xl:text-lg text-base 2xl:leading-7 leading-6">
                            {label}
                        </p>
                    </div>

                    <div className="w-full 2xl:max-w-[600px] sm:max-w-[530px]">
                        {
                            email_input && (
                                <form>
                                    <div className="">
                                        <div className="flex border border-primary/10 rounded-lg bg-white overflow-hidden p-1 2xl:h-[58px] 1xl:h-[54px] lg:h-[50px] h-full">
                                            <input
                                                type="email"
                                                placeholder="Enter your email here..."
                                                className="flex-grow outline-none sm:px-4 px-1 text-gray-200/80 1xl:text-[17px] sm:text-base text-[15px] font-light w-full"
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-primary font-medium whitespace-nowrap"
                                            >
                                                {"Subscribe"}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 sm:mt-4 mt-2">
                                        <input
                                            type="checkbox"
                                            id="terms"
                                            className="1xl:w-5 1xl:h-5 w-4 h-4 rounded-full accent-primary/50"
                                        />
                                        <label htmlFor="terms" className="p italic !text-white">
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
        </div>
    )
}

export default SubscribeSection
