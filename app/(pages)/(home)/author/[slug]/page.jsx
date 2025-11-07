"use client";
import React, { use, useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Skeleton,
} from "@heroui/react";
import { strapiPost } from "@/lib/api/strapiClient";
import { NO_FOUND_PRODUCT_GRID_IMAGE, themeConfig } from "@/config/theamConfig";
import Image from "next/image";
import Link from "next/link";
import GlobalNotFound from "@/app/(pages)/global-not-found";

const page = ({ params }) => {
  const [author, setAuthor] = useState({});
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [pagination, setPagination] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const { slug } = use(params);

  const short = [
    {
      name: "New to Old",
      value: "new to old",
    },
    {
      name: "Old to New",
      value: "old to new",
    },
    {
      name: "High to Low",
      value: "high to low",
    },
    {
      name: "Low to High",
      value: "low to high",
    },
  ];

  const [selectedSort, setSelectedSort] = useState(short[0].value);

  const pageSize = 20;

  const getAuthoreProduct = async (id) => {
    try {
      setLoading(true);
      const payload = {
        page_size: pageSize,
        page: activePage,
        filter: selectedCategory === "All" ? "" : selectedCategory,
        order: selectedSort,
      };

      const productData = await strapiPost(
        `product/author/${id}`,
        payload,
        themeConfig.TOKEN
      );

      setAuthor(productData?.author);
      setCategory(productData?.categories);
      setProduct(productData?.products);
      setPagination(productData?.pagination);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch product data:", err.response.status);
      setLoading(false);
      if (err?.response?.status === 404) {
        setNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (slug) {
      getAuthoreProduct(slug);
    }
  }, [slug, selectedCategory, selectedSort, activePage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pageCount) {
      setActivePage(page);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generatePageNumbers = () => {
    const totalPages = pagination?.pageCount || 0;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  function formatMonthYear(dateInput) {
    if (!dateInput) return null;

    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  return !notFound ? (
    <section className="py-[22px]">
      <div className="container">
        {loading ? (
          <>
            <div className="flex items-center text-sm xl:mb-[14px] mb-3 gap-2">
              <Skeleton className="h-4 w-16 rounded" /> {/* Home link */}
              <Skeleton className="h-4 w-4 rounded" /> {/* arrow icon */}
              <Skeleton className="h-4 w-24 rounded" /> {/* Author name */}
            </div>

            {/* Author info */}
            <div className="flex items-stretch lg:gap-[22px] gap-4 sm:flex-row flex-col">
              <Skeleton className="rounded-full 2xl:w-[90px] 2xl:h-[90px] xl:w-20 xl:h-20 w-[70px] h-[70px]" />

              <div className="flex flex-col justify-between gap-1 flex-1">
                <Skeleton className="h-6 w-48 rounded" /> {/* Author name */}
                <div className="flex items-center gap-4 flex-wrap">
                  <Skeleton className="h-3 w-32 rounded" /> {/* joined date */}
                  <Skeleton className="h-6 w-20 rounded" />{" "}
                  {/* total sales badge */}
                </div>
              </div>
            </div>

            {/* Author description */}
            <Skeleton className="h-4 w-full rounded mt-4" />

            {/* Categories / dropdown menus */}
            <div className="flex items-center justify-between w-full sm:flex-row flex-col gap-4 mt-[42px]">
              <div className="flex flex-wrap gap-3 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded" />
                ))}
              </div>
              <div className="flex gap-3 mb-6">
                <Skeleton className="h-8 w-32 rounded" /> {/* sort dropdown */}
              </div>
            </div>

            {/* Product grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 1xl:grid-cols-5 gap-[26px] mt-[35px]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 animate-pulse">
                  {/* Product image */}
                  <Skeleton className="rounded-lg h-[300px] w-full" />

                  {/* Product title */}

                  <div className="flex items-center justify-between gap-2">
                    {/* Author avatar + name */}
                    <div className="flex items-center gap-2">
                      <Skeleton className="rounded-full h-7 w-7" />
                      <div className="flex flex-col gap-1.5">
                        <Skeleton className="h-4 w-24 rounded" />
                        <Skeleton className="h-3 w-20 rounded" />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {/* Price */}
                      <Skeleton className="h-4 w-16 rounded mt-1" />

                      {/* Optional sale price line */}
                      <Skeleton className="h-3 w-12 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination skeleton */}
            <div className="flex justify-center sm:mt-[50px] mt-[30px] gap-2 text-sm">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded" />
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center text-sm xl:mb-[14px] mb-3">
              <Link className="text-primary hover:underline" href="/">
                Home
              </Link>
              <span className="mx-2 text-[#505050]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <g clipPath="url(#clip0_590_7)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                      fill="#505050"
                    ></path>
                  </g>
                </svg>
              </span>

              <Link
                className="text-[#505050] hover:text-primary hover:underline"
                href="/top-authore"
              >
                Top Author
              </Link>
              <span className="mx-2 text-[#505050]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                >
                  <g clipPath="url(#clip0_590_7)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                      fill="#505050"
                    ></path>
                  </g>
                </svg>
              </span>

              <span className="text-[#505050]">
                {author?.name
                  ? author.name.charAt(0).toUpperCase() + author.name.slice(1)
                  : ""}
              </span>
            </div>

            <div className="mt-[10px] mb-7">
              <div className="flex items-stretch lg:gap-[22px] gap-4 sm:flex-row flex-col">
                {author?.image?.url && (
                  <Image
                    src={author?.image?.url ? author?.image?.url : ""}
                    alt="author"
                    width={270}
                    height={345}
                    className="2xl:w-[90px] 2xl:h-[90px] xl:h-20 xl:w-20 w-[70px] h-[70px] rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = NO_FOUND_PRODUCT_GRID_IMAGE;
                    }}
                  />
                )}

                <div className="flex flex-col justify-between gap-1">
                  <h2>
                    {" "}
                    {author?.name
                      ? author.name.charAt(0).toUpperCase() +
                        author.name.slice(1)
                      : ""}
                  </h2>
                  <div className="flex items-center sm:gap-[20px] gap-[10px] flex-wrap">
                    <div className="flex items-center gap-2">
                      <p>Joined by</p>
                      <span className="block w-1 h-1 rounded-full bg-gray-200"></span>
                      <p>{formatMonthYear(author?.joined)}</p>
                    </div>
                    <div className="sm:py-1 py-[2px] sm:px-3 px-2 bg-blue-300 text-primary rounded text-sm flex items-center justify-center w-fit sm:gap-2 gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_7426_3507)">
                          <path
                            d="M4.87891 5.07669V4.29729C4.87891 3.47045 5.20737 2.67747 5.79203 2.09281C6.37669 1.50815 7.16967 1.17969 7.9965 1.17969C8.82334 1.17969 9.61632 1.50815 10.201 2.09281C10.7856 2.67747 11.1141 3.47045 11.1141 4.29729V5.07669"
                            stroke="#0043A2"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M1.44501 4.75409C0.988281 5.21082 0.988281 5.94501 0.988281 7.41496V9.75316C0.988281 12.6923 0.988281 14.1622 1.90174 15.0749C2.81519 15.9876 4.28436 15.9884 7.22348 15.9884H8.78228C11.7214 15.9884 13.1913 15.9884 14.104 15.0749C15.0167 14.1614 15.0175 12.6923 15.0175 9.75316V7.41496C15.0175 5.94501 15.0175 5.21082 14.5607 4.75409C14.104 4.29736 13.3698 4.29736 11.8999 4.29736H4.10588C2.63593 4.29736 1.90174 4.29736 1.44501 4.75409ZM6.44408 8.19436C6.44408 7.98765 6.36196 7.78941 6.2158 7.64324C6.06963 7.49708 5.87139 7.41496 5.66468 7.41496C5.45797 7.41496 5.25973 7.49708 5.11356 7.64324C4.96739 7.78941 4.88528 7.98765 4.88528 8.19436V9.75316C4.88528 9.95987 4.96739 10.1581 5.11356 10.3043C5.25973 10.4504 5.45797 10.5326 5.66468 10.5326C5.87139 10.5326 6.06963 10.4504 6.2158 10.3043C6.36196 10.1581 6.44408 9.95987 6.44408 9.75316V8.19436ZM11.1205 8.19436C11.1205 7.98765 11.0384 7.78941 10.8922 7.64324C10.746 7.49708 10.5478 7.41496 10.3411 7.41496C10.1344 7.41496 9.93612 7.49708 9.78996 7.64324C9.64379 7.78941 9.56168 7.98765 9.56168 8.19436V9.75316C9.56168 9.95987 9.64379 10.1581 9.78996 10.3043C9.93612 10.4504 10.1344 10.5326 10.3411 10.5326C10.5478 10.5326 10.746 10.4504 10.8922 10.3043C11.0384 10.1581 11.1205 9.95987 11.1205 9.75316V8.19436Z"
                            fill="#0043A2"
                          />
                        </g>
                      </svg>
                      {author?.totalSales && <span>{author?.totalSales}</span>}
                    </div>
                  </div>
                </div>
              </div>
              <p className="xl:mt-7 md:mt-[22px] mt-[18px]">
                {author?.name
                  ? author.name.charAt(0).toUpperCase() + author.name.slice(1)
                  : ""}{" "}
                delivers modern, customizable templates designed for speed and
                simplicity.
              </p>

              {category && product.length > 0 ? (
                <div className="flex items-center justify-between w-full mt-[42px] relative">
                  <div className="flex items-center justify-between w-full sm:flex-row flex-col gap-4">
                    <div className="sm:flex items-center w-[70%] flex-wrap xl:gap-3 md:gap-[10px] sm:gap-2 gap-[6px] hidden">
                      <button
                        className={`btn ${
                          selectedCategory === "All"
                            ? "bg-primary text-white"
                            : "black-btn"
                        }`}
                        onClick={() => setSelectedCategory("All")}
                      >
                        All
                      </button>

                      {category.map((cat, index) => (
                        <button
                          key={index}
                          className={`btn ${
                            selectedCategory === cat.slug
                              ? "bg-primary text-white"
                              : "black-btn"
                          }`}
                          onClick={() => setSelectedCategory(cat.slug)}
                        >
                          {cat?.title}
                        </button>
                      ))}
                    </div>
                    <div className="sm:hidden w-full">
                      <Dropdown
                        classNames={{
                          content: "rounded-[10px]",
                        }}
                      >
                        <DropdownTrigger>
                          <Button className="btn black-btn opacity-1 hover:opacity-1 focus:opacity-1 active:opacity-1 flex items-center !justify-between w-full gap-2">
                            {/* Show current selection */}
                            {selectedCategory === "All"
                              ? "All"
                              : category.find(
                                  (c) => c.slug === selectedCategory
                                )?.title || "All"}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
                              viewBox="0 0 9 9"
                              fill="none"
                            >
                              <path
                                d="M4.16979 7.07357C4.35861 7.23964 4.64139 7.23964 4.83021 7.07357L8.83021 3.55556C8.93814 3.46064 9 3.32385 9 3.18011V2.74483C9 2.31425 8.492 2.08503 8.16916 2.36994L4.83084 5.31602C4.64182 5.48283 4.35818 5.48283 4.16916 5.31602L0.830842 2.36994C0.508002 2.08503 0 2.31425 0 2.74483V3.18011C0 3.32385 0.061859 3.46064 0.169791 3.55556L4.16979 7.07357Z"
                                fill="currentColor"
                              />
                            </svg>
                          </Button>
                        </DropdownTrigger>

                        <DropdownMenu
                          aria-label="Category Options"
                          className="p-0 rounded"
                          selectedKeys={[selectedCategory]}
                          onAction={(key) => setSelectedCategory(key)}
                        >
                          <DropdownItem
                            key="All"
                            className="hover:!bg-primary hover:!text-white rounded-md"
                          >
                            All
                          </DropdownItem>
                          {category.map((cat, index) => (
                            <DropdownItem
                              key={cat.slug}
                              className="hover:!bg-primary hover:!text-white rounded-md"
                            >
                              {cat.title}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                    <div className="sm:min-w-[11%] sm:w-auto w-full">
                      <Dropdown
                        classNames={{
                          content: "rounded-[10px]",
                        }}
                      >
                        <DropdownTrigger>
                          <Button className="btn black-btn opacity-1 hover:opacity-1 focus:opacity-1 active:opacity-1 flex items-center !justify-between w-full gap-2">
                            {/* Show selected sort */}
                            {short.find((s) => s.value === selectedSort)
                              ?.name || "Sort By"}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="9"
                              height="9"
                              viewBox="0 0 9 9"
                              fill="none"
                            >
                              <path
                                d="M4.16979 7.07357C4.35861 7.23964 4.64139 7.23964 4.83021 7.07357L8.83021 3.55556C8.93814 3.46064 9 3.32385 9 3.18011V2.74483C9 2.31425 8.492 2.08503 8.16916 2.36994L4.83084 5.31602C4.64182 5.48283 4.35818 5.48283 4.16916 5.31602L0.830842 2.36994C0.508002 2.08503 0 2.31425 0 2.74483V3.18011C0 3.32385 0.061859 3.46064 0.169791 3.55556L4.16979 7.07357Z"
                                fill="currentColor"
                              />
                            </svg>
                          </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Sort Options"
                          className="p-0 rounded"
                          selectedKeys={[selectedSort]}
                          onAction={(key) => setSelectedSort(key)}
                        >
                          {short.map((s) => (
                            <DropdownItem
                              key={s.value}
                              className="hover:!bg-primary hover:!text-white rounded-md"
                            >
                              {s.name}
                            </DropdownItem>
                          ))}
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[calc(100vh-60vh)] bg-white">
                  <div className="flex flex-col items-center text-center lg:space-y-[30px] space-y-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100"
                      height="100"
                      viewBox="0 0 100 100"
                      fill="none"
                      className="lg:w-[100px] lg:h-[100px] w-[90px] h-[90px]"
                    >
                      <path
                        d="M59.1146 86.9793C54.6094 89.5834 50.1302 92.1355 45.6771 94.7657C44.5833 95.4168 43.724 95.4168 42.6302 94.7657C30.4948 87.7345 18.3333 80.7032 6.14583 73.724C5.07812 73.099 4.6875 72.3699 4.6875 71.1459C4.71354 57.1095 4.71354 43.073 4.6875 29.0365C4.6875 27.8386 5.07812 27.1355 6.11979 26.5365C18.3594 19.5313 30.5729 12.474 42.7865 5.41675C43.8021 4.84383 44.5833 4.84383 45.5729 5.41675C57.7865 12.474 70 19.5313 82.2396 26.5365C83.2292 27.1095 83.6458 27.7865 83.6458 28.9584C83.6198 38.099 83.6458 47.2136 83.5938 56.3542C83.5938 57.0834 83.8281 57.422 84.4531 57.7345C92.0313 61.5886 96.3802 70.0522 95.0781 78.2553C93.6979 86.9793 87.1354 93.7241 78.5938 94.9741C70.9115 96.1199 64.5833 93.5678 59.6614 87.5782C59.4792 87.3959 59.2969 87.1876 59.1146 86.9793ZM42.5781 91.0938C42.5781 90.7293 42.5781 90.573 42.5781 90.4168C42.5781 77.5522 42.5781 64.6876 42.6042 51.797C42.6042 51.1199 42.2917 50.8334 41.7969 50.547C30.7552 44.1928 19.7135 37.8126 8.67187 31.4584C8.4375 31.3282 8.17708 31.224 7.8125 31.0418C7.8125 31.4063 7.8125 31.6667 7.8125 31.9011C7.8125 44.6615 7.81251 57.448 7.78646 70.2084C7.78646 70.8595 8.02084 71.172 8.56771 71.4845C17.7083 76.7188 26.8229 82.0053 35.9375 87.2657C38.099 88.5157 40.2604 89.7657 42.5781 91.0938ZM59.7656 42.8907C59.3229 43.1251 59.0364 43.2813 58.75 43.4376C54.7135 45.7813 50.651 48.1511 46.5885 50.4688C45.9115 50.8595 45.6771 51.2761 45.6771 52.0574C45.7031 64.7136 45.7031 77.3438 45.7031 90.0001C45.7031 90.3126 45.7031 90.6251 45.7031 91.0938C49.7396 88.7501 53.6198 86.5105 57.5 84.297C54.2187 76.5626 54.7396 69.349 60 62.9168C65.2604 56.4845 72.2396 54.4793 80.3385 56.172C80.3385 47.7865 80.3385 39.5053 80.3385 31.0938C80.0521 31.224 79.8438 31.3022 79.6615 31.4063C74.2448 34.5313 68.8542 37.6303 63.4635 40.7813C63.1771 40.9636 62.9167 41.4845 62.9167 41.849C62.8646 45.7553 62.8906 49.6615 62.8906 53.5418C62.8906 53.9584 62.8906 54.3751 62.8906 54.8178C62.8646 55.9115 62.2656 56.5626 61.3542 56.5886C60.4167 56.5886 59.8177 55.9376 59.7656 54.8699C59.7656 54.5574 59.7656 54.2188 59.7656 53.9063C59.7656 50.2605 59.7656 46.6668 59.7656 42.8907ZM92.1875 75.4949C92.1615 66.2501 84.6615 58.698 75.4688 58.698C66.0938 58.698 58.6198 66.198 58.6198 75.547C58.6198 84.7657 66.2239 92.2657 75.5469 92.2397C84.6614 92.2136 92.2135 84.6355 92.1875 75.4949ZM78.8021 28.2813C78.5677 28.1251 78.4115 27.9949 78.2552 27.9168C67.1094 21.4845 55.9635 15.0522 44.8177 8.61987C44.2969 8.30737 43.9062 8.35945 43.4115 8.64591C38.9063 11.2501 34.401 13.8543 29.8958 16.4584C29.6875 16.5886 29.5052 16.7449 29.2708 16.9011C29.4271 17.0313 29.5312 17.1095 29.6354 17.1876C40.026 24.0886 50.4427 31.0157 60.8073 37.9428C61.3542 38.3074 61.6927 38.2032 62.1875 37.9168C67.4479 34.8699 72.7083 31.849 77.9948 28.8022C78.2812 28.6459 78.4896 28.4897 78.8021 28.2813ZM58.4115 40.0782C58.1771 39.922 58.0469 39.8178 57.9167 39.7136C47.5521 32.8126 37.1875 25.9115 26.849 18.9845C26.3281 18.6459 25.9635 18.672 25.4427 18.9584C20.4167 21.8751 15.3646 24.7657 10.3385 27.6824C10.0781 27.8386 9.81771 28.0209 9.47917 28.2553C9.8698 28.4897 10.1563 28.698 10.4688 28.8542C14.2969 31.0678 18.125 33.2813 21.9531 35.4688C29.1146 39.5834 36.25 43.724 43.4115 47.8126C43.75 47.9949 44.3229 48.1251 44.6094 47.9688C49.1927 45.4168 53.724 42.7865 58.4115 40.0782Z"
                        fill="#0043A2"
                      />
                      <path
                        d="M75.3906 73.2813C77.2917 71.3803 79.1146 69.5574 80.9375 67.7605C81.1719 67.5261 81.3802 67.2917 81.6406 67.0834C82.3698 66.4584 83.2292 66.4584 83.8281 67.0313C84.4792 67.6563 84.5052 68.5678 83.8021 69.297C82.5261 70.6251 81.1979 71.9272 79.8698 73.2292C79.1406 73.9584 78.3854 74.6876 77.6042 75.4688C79.5573 77.3959 81.4062 79.2709 83.2552 81.1199C84.4531 82.3178 84.6354 83.1772 83.8281 83.9324C83.0729 84.6615 82.2136 84.4792 81.0677 83.3334C79.2188 81.4845 77.3438 79.6095 75.3646 77.6042C74.4531 78.5678 73.6198 79.4532 72.7604 80.3386C71.5885 81.5105 70.4427 82.7084 69.2448 83.8542C68.5156 84.5574 67.6042 84.5574 66.9792 83.9324C66.3542 83.3074 66.3542 82.3699 67.0573 81.6667C68.776 79.8959 70.5469 78.1511 72.2917 76.4324C72.5781 76.172 72.8906 75.9376 73.2813 75.6511C72.9427 75.2605 72.7344 75.0261 72.5 74.8178C70.7031 73.0209 68.9062 71.224 67.1094 69.4272C66.25 68.5678 66.1719 67.6303 66.901 66.9532C67.5781 66.3022 68.4896 66.3803 69.2969 67.2136C71.3021 69.1667 73.3073 71.172 75.3906 73.2813Z"
                        fill="#0043A2"
                      />
                    </svg>

                    <p>No products available in this store yet.</p>
                  </div>
                </div>
              )}

              {/* product grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 1xl:grid-cols-5 gap-[26px] mt-[35px]">
                {product &&
                  product?.map((data, index) => {
                    return (
                      <div className="group relative" key={index}>
                        <Link
                          prefetch={true}
                          href={`/product/${encodeURIComponent(data?.slug)}`}
                        >
                          <div className="cursor-pointer relative rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:shadow-lg">
                            <Image
                              src={data?.grid_image?.url}
                              alt={data?.short_title}
                              width={270}
                              height={345}
                              className="w-full h-auto aspect-[1/1.2]"
                              onError={(e) => {
                                e.currentTarget.src =
                                  NO_FOUND_PRODUCT_GRID_IMAGE;
                              }}
                            />
                            <div className="absolute top-0 w-full h-full items-center justify-center bg-black/60 hidden group-hover:flex transition-all">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="40"
                                height="40"
                                viewBox="0 0 40 40"
                                fill="none"
                              >
                                <g clipPath="url(#clip0_5061_42)">
                                  <path
                                    d="M9 31L32.0001 8.00011M32.0001 8.00011L32 30M32.0001 8.00011L9.99976 8.00024"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </g>
                              </svg>
                            </div>
                          </div>
                        </Link>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Image
                              src={data?.author?.image?.url}
                              alt={data?.author?.username}
                              width={270}
                              height={345}
                              className="object-cover aspect-[1/1.2] rounded-full w-7 h-7 flex items-center justify-center text-xs mr-[10px] flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src =
                                  NO_FOUND_PRODUCT_GRID_IMAGE;
                              }}
                            />
                            <div>
                              <Link
                                href={`/product/${encodeURIComponent(data?.slug)}`}
                              >
                                <h3 className="text-base !text-black cursor-pointer line-clamp-1">
                                  {data?.short_title}
                                </h3>
                              </Link>
                              <p className="text-sm text-gray-200">
                                <span className="text-gray-300">by </span>
                                {data?.author?.username}
                              </p>
                            </div>
                          </div>
                          {data?.price && (
                            <div>
                              <span className="p !text-primary">
                                $
                                {data?.price?.sales_price === null
                                  ? data?.price?.regular_price.toFixed(2)
                                  : data?.price?.sales_price.toFixed(2)}
                              </span>
                              <br />
                              {data?.price?.sales_price !== null &&
                                data?.price?.regular_price && (
                                  <span className="p2 !text-gray-300 text-sm line-through">
                                    ${data?.price?.regular_price.toFixed(2)}
                                  </span>
                                )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Pagination */}
              {product?.length > 0 && pagination?.total > pageSize && (
                <div className="flex justify-center sm:mt-[50px] mt-[30px] gap-2 text-sm">
                  <button
                    className="px-3 py-1 w-10 h-10 border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(activePage - 1)}
                    disabled={activePage === 1}
                  >
                    «
                  </button>

                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-1 w-10 h-10 btn border rounded flex items-center justify-center ${
                        activePage === page ? "bg-primary text-white" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    className="px-3 py-1 w-10 h-10 btn border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => handlePageChange(activePage + 1)}
                    disabled={activePage === pagination.pageCount}
                  >
                    »
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  ) : (
    <GlobalNotFound />
  );
};

export default page;
