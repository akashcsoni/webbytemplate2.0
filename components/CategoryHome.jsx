import Link from 'next/link'
import React from 'react'

const ChevronIcon = () => (
    <span className="mx-2 text-[#505050]">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                fill="#505050"
            />
        </svg>
    </span>
);

const CategoryHome = ({
    title = '',
    search = false,
    description = '',
    breadcrumb = []
}) => {
    return (
        <main className="lg:py-12 md:py-10 py-8">
            {/* Breadcrumb Navigation */}
            <div className="container">
                {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
                    <nav className="flex items-center text-sm mb-[14px]">
                        {breadcrumb.map((item, index) => (
                            <React.Fragment key={item?.id || index}>
                                {index > 0 && <ChevronIcon />}
                                {item?.visible ? (
                                    <Link
                                        href={item.slug || '#'}
                                        className="text-[#0156d5] hover:underline"
                                    >
                                        {item.title || 'Untitled'}
                                    </Link>
                                ) : (
                                    <span className="text-[#505050]">
                                        {item.title || 'Untitled'}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
            </div>

            {/* Page Heading */}
            <div className="container mb-2">
                {title && <h1 className="h2 lg:mb-[18px] mb-3">{title}</h1>}

                {/* Search Bar */}
                {search && (
                    <div className="relative flex items-center lg:mb-8 sm:mb-6 mb-4 border border-gray-100 rounded-[5px] overflow-hidden">
                        <input
                            type="text"
                            placeholder="Search for mockups, Web Templates and More....."
                            className="w-full rounded-l px-4 outline-none lg:h-10 h-9 p2"
                        />
                        <button className="bg-[#0156d5] text-white lg:py-3 py-2.5 px-[18px] rounded-r flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                        </button>
                    </div>
                )}

                {/* Description Text */}
                {description && (
                    <p className="text-[#505050] leading-relaxed 2xl:text-lg 1xl:text-[17px] md:text-base text-sm">
                        {description}
                    </p>
                )}
            </div>
        </main>
    );
};

export default CategoryHome;
