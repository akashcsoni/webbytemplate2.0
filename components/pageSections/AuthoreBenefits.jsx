import Link from 'next/link';
import React from 'react'
import BenefitsGrid from '../benefits-grid';

const AuthoreBenefits = ({ title = '', grid_section = [], button_name = '', button_link = '' }) => {

    return (
        <div className="container">
            <section className="1xl:py-[35px] py-[30px]">
                <div>
                    <div className="flex items-center flex-wrap justify-between w-full 1xl:mb-[35px] md:mb-6 mb-5">
                        {title && <h2>{title}</h2>}
                        {(button_name && button_link) && (
                            <Link
                                className="all-btn flex items-center hover:underline sm:mt-0 mt-2 underline-offset-4"
                                href={button_link}
                            >
                                {button_name}
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 16 16"
                                    className="ml-1.5"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M8.85 3.15a.5.5 0 0 0-.707.707l4.15 4.15h-9.79a.5.5 0 0 0 0 1h9.79l-4.15 4.15a.5.5 0 0 0 .707.707l5-5a.5.5 0 0 0 0-.707l-5-5z"
                                        strokeWidth="0.5"
                                        stroke="currentColor"
                                    ></path>
                                </svg>
                            </Link>
                        )}
                    </div>
                    {(Array.isArray(grid_section) && grid_section.length > 0) && (
                        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 2xl:gap-7 1xl:gap-6 gap-5">
                            {grid_section?.map((item, i) => (
                                <BenefitsGrid
                                    key={i}
                                    image={item?.image}
                                    title={item?.title}
                                    description={item?.description}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default AuthoreBenefits
