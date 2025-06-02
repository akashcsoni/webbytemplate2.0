"use client";

import Link from "next/link";
import ReviewGrid from "./common/review/review-grid";

export default function Review({ title = "", label = "", link = null, list = [] }) {
    return (
        <section className="xl:py-[35px] md:py-[30px] py-5">
            <div className="container mx-auto">
                {(title || label || (link && link.label)) && (
                    <div className="flex justify-between sm:items-center items-start sm:flex-nowrap flex-wrap md:mb-[30px] sm:mb-6 mb-5">
                        <div>
                            {title && <h2>{title}</h2>}
                            {label && (
                                <p className="md:mt-3 sm:mt-1.5 mt-0 lg:max-w-full md:max-w-[500px] max-w-[400px]">
                                    {label}
                                </p>
                            )}
                        </div>

                        {link?.link && link?.label && (
                            <Link
                                href={link.link}
                                className="all-btn flex items-center hover:underline sm:mt-0 mt-3 underline-offset-4"
                            >
                                {link.label}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={18}
                                    height={18}
                                    viewBox="0 0 16 16"
                                    className="ml-1.5"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M8.85 3.15a.5.5 0 0 0-.707.707l4.15 4.15h-9.79a.5.5 0 0 0 0 1h9.79l-4.15 4.15a.5.5 0 0 0 .707.707l5-5a.5.5 0 0 0 0-.707l-5-5z"
                                        strokeWidth={0.5}
                                        stroke="currentColor"
                                    />
                                </svg>
                            </Link>
                        )}
                    </div>
                )}

                {Array.isArray(list) && list.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:gap-[30px] sm:gap-6 gap-5">
                        {list.map((testimonial) => (
                            <ReviewGrid key={testimonial.id} testimonial={testimonial} />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-md text-center">No reviews available.</p>
                )}
            </div>
        </section>
    );
}
