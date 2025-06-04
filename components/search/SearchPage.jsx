"use client";

import React, { useEffect, useState } from "react";
import { Slider } from "@heroui/react";
import Link from "next/link";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import ProductGrid from "../product/product-grid";
import ProductDummyGrid from "../product/product-dummy-grid";

// Skeleton components for loading states
const FilterSkeleton = ({ count = 5 }) => (
    <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto">
        {[...Array(count)].map((_, index) => (
            <li key={index} className="flex items-center justify-between animate-pulse">
                <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-gray-200 rounded"></div>
                    <div className="w-20 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="w-6 h-4 bg-gray-200 rounded"></div>
            </li>
        ))}
    </ul>
)

const CategorySkeleton = ({ count = 6 }) => (
    <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto">
        {[...Array(count)].map((_, index) => (
            <li key={index} className="flex justify-between items-center animate-pulse">
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-6 h-4 bg-gray-200 rounded"></div>
            </li>
        ))}
    </ul>
)

const DropdownSection = ({ title, children }) => {
    const [open, setOpen] = useState(true);
    return (
        <div>
            <button
                className="flex items-center justify-between w-full mb-4 focus:outline-none border-y border-gray-100 xl:py-[11px] py-2 px-[5px]"
                onClick={() => setOpen(!open)}
            >
                <p className="font-medium text-black">{title}</p>
                <span className="text-sm text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"
                            }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </span>
            </button>
            {open && <div className="px-[5px]">{children}</div>}
        </div>
    );
};

export default function SearchPage({ slug }) {

    const [sort, setSort] = useState("Best seller");
    const [activePage, setActivePage] = useState(1);
    const pages = [1, 2, 3];
    const [priceRange, setPriceRange] = useState([0, 500]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("Sort by");
    const [sortDirection, setSortDirection] = useState("desc"); // "asc" or "desc"

    const [filterLoading, setfilterLoading] = useState(true);
    const [filteredProducts, setfilteredProducts] = useState([]);

    const [filterData, setfilterData] = useState({
        categories: [],
        features: [],
        sales: [],
        tags: []
    })

    const [searchFilterData, setsearchFilterData] = useState({
        categories: [],
        features: [],
        sales: [],
        tags: []
    })

    const options = ["Best Seller", "Newest", "Best Rated", "Tranding", "Price"];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [filterResponse] = await Promise.all([strapiPost("product/filter",
                    {
                        "page_size": 12,
                        "shop": true,
                        "base": ""
                    },
                    themeConfig.TOKEN
                )]);

                if (filterResponse?.result === true) {
                    setfilterData(filterResponse?.filter);
                    setsearchFilterData(filterResponse?.filter);
                    setfilteredProducts(filterResponse?.data);


                    console.log('filter', filterResponse?.filter);
                    console.log('products', filterResponse?.data);
                    console.log('pagination', filterResponse?.pagination);
                }

            } catch (error) {
                console.error("Error fetching menu data:", error);
            } finally {
                setfilterLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterTags = (event) => {
        const searchTerm = event.target.value;

        if (!searchTerm) {
            // If search term is empty, reset to the original list of tags
            setsearchFilterData((prevData) => ({
                ...prevData,
                tags: filterData.tags.map((tag) => ({ ...tag, selected: false })),
            }));
            return;
        }

        // Filter tags based on search term (case-insensitive)
        const filteredTags = filterData.tags.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Update the filtered tags in the state
        setsearchFilterData((prevData) => ({
            ...prevData,
            tags: filteredTags.map((tag) => ({ ...tag, selected: false })),
        }));
    };

    return (
        <div className="container px-4 py-8">
            <div className="flex flex-col xl:flex-row xl:gap-[34px]">
                {/* Sidebar */}
                <div className="relative w-full xl:w-1/4">
                    {/* Toggle button for mobile */}

                    {/* Sidebar */}
                    <aside
                        className={`
                 fixed top-0 left-0 h-full bg-white shadow-lg p-4 overflow-y-auto
                 transition-transform duration-300 ease-in-out
                 ${showSidebar ? "translate-x-0 z-50 w-[350px] max-w-full" : "-translate-x-full"}
                 xl:relative xl:translate-x-0 z-20 xl:p-0 xl:shadow-none xl:block
               `}
                    >
                        <div className="flex items-center justify-between w-full">
                            <h5 className="mb-[15px] px-[5px]">Filter</h5>
                            {/* Close button for mobile */}
                            <div className="flex justify-end mb-4 xl:hidden">
                                <button
                                    onClick={() => setShowSidebar(false)}
                                    className="text-gray-700 p-2 hover:bg-gray-100 rounded"
                                    aria-label="Close sidebar"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 14 14"
                                        fill="none"
                                    >
                                        <path
                                            d="M13 13L7 7M7 7L1 1M7 7L13 1M7 7L1 13"
                                            stroke="black"
                                            strokeWidth="1.7"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="xl:space-y-[30px] space-y-7">
                            <DropdownSection title="Categories">
                                {filterLoading ? (
                                    <div>
                                        <CategorySkeleton />
                                    </div>
                                ) : (
                                    <>
                                        <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                                            {filterData?.categories?.map((cat, index) => {
                                                return (
                                                    <li
                                                        key={index}
                                                        className="flex justify-between items-center rounded cursor-pointer group"
                                                    >
                                                        <span className="p2 group-hover:text-primary">
                                                            {cat.title}
                                                        </span>
                                                        <span className="p2">{cat.products}</span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </>
                                )}
                            </DropdownSection>

                            <DropdownSection title="Tags">
                                {filterLoading ? (
                                    <div>
                                        <div className="w-full h-10 bg-gray-200 rounded mb-3.5 animate-pulse"></div>
                                        <FilterSkeleton />
                                    </div>
                                ) : (
                                    <>
                                        <input onChange={(e) => filterTags(e)} type="search" id="search" name="search" className=" w-full h-10 border border-gray-100 outline-none p-3 mb-3.5" placeholder="Search tags here" />
                                        <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                                            {searchFilterData?.tags?.map((tag, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center justify-between"
                                                >
                                                    <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                                                        <div className="relative flex items-center justify-center">
                                                            <input
                                                                type="checkbox"
                                                                value={tag?.title}
                                                                className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                                                            />
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={15}
                                                                height={15}
                                                                viewBox="0 0 24 24"
                                                                className="absolute"
                                                            >
                                                                <path
                                                                    fill="white"
                                                                    d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                                                                    strokeWidth={1.5}
                                                                    stroke="white"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span className="p2">{tag?.title}</span>
                                                    </label>
                                                    <span className="p2">{tag?.count}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </DropdownSection>

                            <DropdownSection title="Price">
                                <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
                                    <div className="w-full max-w-md">
                                        <Slider
                                            aria-label="Select a budget"
                                            formatOptions={{ style: "currency", currency: "USD" }}
                                            maxValue={1000}
                                            minValue={0}
                                            size="sm"
                                            value={priceRange} // changed
                                            onChange={setPriceRange} // changed
                                            step={10}
                                        />
                                        <div className="flex justify-between text-sm text-gray-700 mt-2">
                                            <span>${priceRange[0]}</span>{" "}
                                            <span>${priceRange[1]}</span>
                                        </div>
                                    </div>
                                </div>
                            </DropdownSection>

                            <DropdownSection title="Sales">
                                {filterLoading ? (
                                    <div>
                                        <FilterSkeleton />
                                    </div>
                                ) : (
                                    <>
                                        <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                                            {filterData?.sales?.map((sale, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center justify-between"
                                                >
                                                    <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                                                        <div className="relative flex items-center justify-center">
                                                            <input
                                                                type="checkbox"
                                                                value={sale.title} // Use sale.name for the checkbox value
                                                                className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                                                            />
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={11}
                                                                height={11}
                                                                viewBox="0 0 24 24"
                                                                className="absolute"
                                                            >
                                                                <path
                                                                    fill="white"
                                                                    d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                                                                    strokeWidth={3}
                                                                    stroke="white"
                                                                ></path>
                                                            </svg>
                                                        </div>
                                                        <span className="p2">{sale.title}</span>
                                                    </label>
                                                    <span className="p2">{sale.count}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                )}
                            </DropdownSection>

                            <DropdownSection title="Features">
                                {filterLoading ? (
                                    <div>
                                        <FilterSkeleton />
                                    </div>
                                ) : (
                                    <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                                        {filterData?.features?.map((features, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between"
                                            >
                                                <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                                                    <div className="relative flex items-center justify-center">
                                                        <input
                                                            type="checkbox"
                                                            value={features.title} // Use features.name for the checkbox value
                                                            className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                                                        />
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            width={11}
                                                            height={11}
                                                            viewBox="0 0 24 24"
                                                            className="absolute"
                                                        >
                                                            <path
                                                                fill="white"
                                                                d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                                                                strokeWidth={3}
                                                                stroke="white"
                                                            ></path>
                                                        </svg>
                                                    </div>
                                                    <span className="p2">{features.title}</span>
                                                </label>
                                                <span className="p2">{features.count}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </DropdownSection>
                        </div>
                    </aside>
                </div>

                {/* Main section */}
                <main className="w-full xl:w-4/5">
                    <h1 className="h2 mb-4">Website Templates</h1>
                    <div className="relative flex items-center sm:mb-5 mb-2 border border-gray-100 rounded-[5px] overflow-hidden">
                        <input
                            defaultValue={slug}
                            type="text"
                            placeholder="Search for mockups, Web Templates and More....."
                            className="w-full rounded-l sm:px-4 px-2.5 placeholder:text-gray-300 outline-none lg:h-10 h-9 p2"
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
                                aria-hidden="true"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                        </button>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex items-center justify-between w-full sm:mb-6 mb-3">
                        <div>
                            <p className="p2">You found 41 Html templates</p>
                        </div>
                        <div className="xl:flex hidden gap-2">
                            {["Best seller", "Newest", "Best rated", "Trending", "Price"].map(
                                (tab) => (
                                    <button
                                        key={tab}
                                        className={`btn rounded font-normal flex items-center justify-center gap-[6px] ${sort === tab
                                            ? "bg-primary text-white border border-primary"
                                            : "bg-white text-black border border-primary/10"
                                            }`}
                                        onClick={() => {
                                            if (sort === tab) {
                                                // Toggle direction if same tab clicked
                                                setSortDirection((prev) =>
                                                    prev === "asc" ? "desc" : "asc",
                                                );
                                            } else {
                                                // Set new tab and default direction
                                                setSort(tab);
                                                setSortDirection("desc");
                                            }
                                        }}
                                    >
                                        {tab}
                                        {sort === tab && (
                                            <span>
                                                {sortDirection === "desc" ? (
                                                    // Down Arrow
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="12"
                                                        height="8"
                                                        viewBox="0 0 9 6"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M4.16979 5.07357C4.35861 5.23964 4.64139 5.23964 4.83021 5.07357L8.83021 1.55556C8.93814 1.46064 9 1.32385 9 1.18011V0.744831C9 0.314253 8.492 0.0850332 8.16916 0.369941L4.83084 3.31602C4.64182 3.48283 4.35818 3.48283 4.16916 3.31602L0.830842 0.36994C0.508002 0.0850325 0 0.314253 0 0.744832V1.18011C0 1.32385 0.061859 1.46064 0.169791 1.55556L4.16979 5.07357Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                ) : (
                                                    // Up Arrow
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="12"
                                                        height="8"
                                                        viewBox="0 0 9 6"
                                                        fill="none"
                                                    >
                                                        <path
                                                            d="M4.83021 0.926427C4.64139 0.760364 4.35861 0.760364 4.16979 0.926427L0.169791 4.44444C0.061859 4.53936 0 4.67615 0 4.81989V5.25517C0 5.68575 0.508002 5.91497 0.830842 5.63006L4.16916 2.68398C4.35818 2.51717 4.64182 2.51717 4.83084 2.68398L8.16916 5.63006C8.492 5.91497 9 5.68575 9 5.25517V4.81989C9 4.67615 8.93814 4.53936 8.83021 4.44444L4.83021 0.926427Z"
                                                            fill="white"
                                                        />
                                                    </svg>
                                                )}
                                            </span>
                                        )}
                                    </button>
                                ),
                            )}
                        </div>
                    </div>

                    {/* template categories */}
                    <div className="flex items-center justify-between w-full xl:hidden sm:mb-6 mb-[15px] ">
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="xl:hidden py-[7px] sm:px-4 px-2.5 border border-primary/10 rounded-[4px] flex items-center justify-center gap-2 p2 "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="15"
                                viewBox="0 0 14 15"
                                fill="none"
                            >
                                <g clipPath="url(#clip0_778_1629)">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M0 1.60294C0 1.31042 0.116202 1.02989 0.323044 0.823044C0.529886 0.616202 0.810423 0.5 1.10294 0.5H12.1324C12.4249 0.5 12.7054 0.616202 12.9122 0.823044C13.1191 1.02989 13.2353 1.31042 13.2353 1.60294V3.13676C13.2352 3.52676 13.0802 3.90075 12.8044 4.17647L8.82353 8.15735V13.6162C8.82355 13.7541 8.78832 13.8897 8.72119 14.0101C8.65405 14.1305 8.55725 14.2318 8.43996 14.3043C8.32267 14.3768 8.1888 14.4181 8.05105 14.4243C7.91331 14.4305 7.77626 14.4014 7.65294 14.3397L4.91985 12.9735C4.76718 12.8972 4.63879 12.7799 4.54905 12.6347C4.45931 12.4895 4.41177 12.3222 4.41176 12.1515V8.15735L0.430882 4.17647C0.155074 3.90075 8.32903e-05 3.52676 0 3.13676V1.60294Z"
                                        fill="black"
                                    />
                                </g>
                            </svg>
                            Filters
                        </button>

                        <div className="relative inline-block text-left">
                            <button
                                onClick={() => setOpen(!open)}
                                className="inline-flex items-center px-[15px] py-[7px] border border-primary/10 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none"
                            >
                                {selected}
                                <svg
                                    className={`ml-2 h-4 w-4 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {open && (
                                <div className="absolute z-10 right-0 mt-1 w-44 bg-white border border-gray-100 rounded-md shadow-md">
                                    {options.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => {
                                                setSelected(option);
                                                setOpen(false);
                                            }}
                                            className="block w-full text-left px-4 sm:py-2 py-1 text-sm text-black hover:bg-gray-100"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-start w-full gap-2 flex-wrap mb-[25px]">
                        <p className="p2 !text-black">1 items in</p>
                        <Link
                            href="javascript:;"
                            className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary "
                        >
                            All Categories
                        </Link>
                        /<p className="p2 !text-black">Headless Templates</p>
                        <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                            <p className="p2 !text-black sm:px-2 px-1">Bank template</p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="27"
                                viewBox="0 0 9 9"
                                fill="none"
                                className="px-2 flex-shrink-0 cursor-pointer"
                            >
                                <path
                                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                            <p className="p2 sm:px-2 px-1">
                                Tags : <span className="!text-black"> Bank template</span>
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="27"
                                viewBox="0 0 9 9"
                                fill="none"
                                className="px-2 flex-shrink-0 cursor-pointer"
                            >
                                <path
                                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                        <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                            <p className="p2 sm:px-2 px-1">
                                Sales : <span className="!text-black">Medium</span>
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="27"
                                height="27"
                                viewBox="0 0 9 9"
                                fill="none"
                                className="px-2 flex-shrink-0 cursor-pointer"
                            >
                                <path
                                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                                    fill="black"
                                />
                            </svg>
                        </div>
                        <Link
                            href="javascript:;"
                            className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary gap-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="9"
                                height="9"
                                viewBox="0 0 9 9"
                                fill="none"
                            >
                                <path
                                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                                    fill="#0156D5"
                                />
                            </svg>
                            Clear All
                        </Link>
                    </div>

                    {/* Grid */}

                    <div>
                        {filterLoading ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(12)].map((_, index) => (
                                    <ProductDummyGrid key={index} />
                                ))}
                            </div>
                        ) : filteredProducts?.length <= 0 ? (
                            <div className="text-center">
                                <p className="text-red-500">Search Result: No Products Found</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts?.map((product, index) => (
                                    <ProductGrid key={index} product={product} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-center sm:mt-[50px] mt-[30px]  gap-2 text-sm">
                        <button
                            className="px-3 py-1 w-10 h-10 border rounded flex items-center justify-center"
                            onClick={() => setActivePage((prev) => Math.max(1, prev - 1))}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={20}
                                height={20}
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="m11 6l-6 6l6 6m8-12l-6 6l6 6"
                                ></path>
                            </svg>
                        </button>

                        {pages.map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 w-10 h-10 btn border rounded flex items-center justify-center ${activePage === page ? "bg-primary text-white" : ""
                                    }`}
                                onClick={() => setActivePage(page)}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            className="px-3 py-1 w-10 h-10 btn border rounded flex items-center justify-center"
                            onClick={() =>
                                setActivePage((prev) => Math.min(pages.length, prev + 1))
                            }
                        >
                            »
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}
