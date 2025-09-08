"use client";

import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Link,
} from "@heroui/react";
import { strapiPost } from "@/lib/api/strapiClient";
import { NO_FOUND_PRODUCT_GRID_IMAGE, themeConfig } from "@/config/theamConfig";
import Image from "next/image";

const TopAuthor = ({ title, description }) => {
  const [author, setAuthor] = useState([]);
  const [pagination, setPagination] = useState({});
  const [activePage, setActivePage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("a_to_z"); // default
  const [loading, setLoading] = useState(true);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  function formatMonthYear(dateInput) {
    if (!dateInput) return null;

    const date = new Date(dateInput);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }

  const filters = [
    {
      name: "A to Z",
      value: "a_to_z",
    },
    {
      name: "Z to A",
      value: "z_to_a",
    },
    {
      name: "By-sells",
      value: "by_sales",
    },
    {
      name: "By-product",
      value: "by_product",
    },
  ];

  const pageSize = 4;

  const getAuthore = async () => {
    try {
      setLoading(true);
      const payload = {
        page_size: pageSize,
        page: activePage,
        filter: activeFilter,
      };

      const productData = await strapiPost(
        `top-authors`,
        payload,
        themeConfig.TOKEN
      );

      setAuthor(productData?.authors);
      setPagination(productData?.pagination);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error("Failed to fetch product data:", err);
    }
  };

  useEffect(() => {
    getAuthore();
  }, [activePage, activeFilter]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.pageCount) {
      setActivePage(page);
    }
  };

  const generatePageNumbers = () => {
    const totalPages = pagination?.pageCount || 0;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return pages;
  };

  // Skeleton components
  const SkeletonCircle = ({ size = "70px" }) => (
    <div
      className={`rounded-full animate-pulse bg-gray-300/30`}
      style={{ width: size, height: size }}
    ></div>
  );

  const SkeletonLine = ({ width = "100px", height = "16px" }) => (
    <div
      className={`rounded-md animate-pulse bg-gray-300/30`}
      style={{ width, height }}
    ></div>
  );

  const SkeletonCard = () => (
    <div className="border border-gray-100 rounded-lg sm:pt-[10px] pt-0 grid content-between">
      <div className="py-6 px-4 flex flex-col items-center text-center">
        {/* Circle image */}
        <SkeletonCircle size="90px" />

        {/* Title */}
        <div className="mt-4 mb-2">
          <SkeletonLine width="120px" height="20px" />
        </div>

        {/* Sub text */}
        <SkeletonLine width="100px" height="14px" />
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center w-full border-t border-gray-100 py-[10px] px-4">
        <div className="flex items-center gap-4">
          <SkeletonLine width="40px" height="16px" />
          <SkeletonLine width="40px" height="16px" />
        </div>
        <SkeletonCircle size="24px" />
      </div>
    </div>
  );

  return !loading ? (
    <section className="py-[22px]">
      <div className="container">
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

          {title && <span className="text-[#505050]">{title}</span>}
        </div>

        <div>
          <div className="flex items-start justify-between sm:flex-row flex-col sm:gap-5 gap-4 mt-2">
            {title && <h1>{title}</h1>}
            <div className="flex items-center xl:gap-[10px] gap-2">
              {/* link */}

              {/* facebook */}
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary !border-2 !bg-white hover:!bg-primary focus:!bg-primary active:!bg-primary !rounded-full overflow-hidden 1xl:!p-3 !p-[10px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="md:w-5 md:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M7.25896 19.2969H11.1734V11.4582H14.7004L15.0879 7.56326H11.1734V5.59623C11.1734 5.33669 11.2766 5.08777 11.4601 4.90424C11.6436 4.72072 11.8925 4.61761 12.1521 4.61761H15.0879V0.703125H12.1521C10.8543 0.703125 9.60976 1.21865 8.69212 2.13628C7.77448 3.05392 7.25896 4.2985 7.25896 5.59623V7.56326H5.30172L4.91418 11.4582H7.25896V19.2969Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>

              {/* twitter */}
              <Link
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  currentUrl
                )}&text=${encodeURIComponent("Check out this amazing page!")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary !border-2 !bg-white hover:!bg-primary focus:!bg-primary active:!bg-primary !rounded-full overflow-hidden 1xl:!p-3 !p-[10px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                  className="md:w-5 md:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M19.876 4.77712C19.208 5.08077 18.4879 5.28031 17.7418 5.37574C18.5053 4.91593 19.0952 4.18718 19.3729 3.31094C18.6528 3.74472 17.8546 4.04837 17.0131 4.22188C16.3277 3.47578 15.3647 3.04199 14.2716 3.04199C12.2328 3.04199 10.5671 4.70772 10.5671 6.76385C10.5671 7.05882 10.6018 7.34512 10.6625 7.61406C7.57396 7.4579 4.82377 5.97436 2.99321 3.72737C2.67221 4.27394 2.49002 4.91593 2.49002 5.59264C2.49002 6.88531 3.1407 8.0305 4.14707 8.68117C3.5311 8.68117 2.95851 8.50766 2.45532 8.24739V8.27341C2.45532 10.078 3.73932 11.5875 5.43975 11.9259C4.89391 12.0759 4.32062 12.0967 3.76534 11.9866C4.00098 12.7262 4.46246 13.3733 5.08492 13.8371C5.70739 14.3008 6.45952 14.5578 7.23561 14.5719C5.92009 15.6135 4.28936 16.1764 2.61148 16.1683C2.31651 16.1683 2.02153 16.1509 1.72656 16.1162C3.37494 17.1746 5.33564 17.7906 7.43515 17.7906C14.2716 17.7906 18.0281 12.1167 18.0281 7.19763C18.0281 7.0328 18.0281 6.87663 18.0195 6.7118C18.7482 6.19126 19.3729 5.53191 19.876 4.77712Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>

              {/* linked in */}
              <Link
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  currentUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary !border-2 !bg-white hover:!bg-primary focus:!bg-primary active:!bg-primary !rounded-full overflow-hidden 1xl:!p-3 !p-[10px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="md:w-5 md:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M5.56768 2.78473C5.56745 3.25784 5.37928 3.71147 5.04458 4.04584C4.70987 4.3802 4.25605 4.56792 3.78295 4.56768C3.30984 4.56745 2.85621 4.37928 2.52184 4.04458C2.18748 3.70987 1.99976 3.25605 2 2.78295C2.00024 2.30984 2.1884 1.85621 2.52311 1.52184C2.85781 1.18748 3.31163 0.999764 3.78473 1C4.25784 1.00024 4.71147 1.1884 5.04584 1.52311C5.3802 1.85781 5.56792 2.31163 5.56768 2.78473ZM5.6212 5.88862H2.05352V17.0555H5.6212V5.88862ZM11.2581 5.88862H7.70829V17.0555H11.2225V11.1955C11.2225 7.93111 15.4769 7.62786 15.4769 11.1955V17.0555H19V9.98253C19 4.47938 12.703 4.68452 11.2225 7.38704L11.2581 5.88862Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>

              {/* whatsapp */}
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary !border-2 !bg-white hover:!bg-primary focus:!bg-primary active:!bg-primary !rounded-full overflow-hidden 1xl:!p-3 !p-[10px]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="md:w-5 md:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M10.5156 0.637878C15.4022 0.637878 19.3633 4.59897 19.3633 9.48553C19.3633 14.3721 15.4022 18.3332 10.5156 18.3332C8.95203 18.3359 7.41593 17.9221 6.06526 17.1343L1.67152 18.3332L2.86772 13.9377C2.07936 12.5866 1.66524 11.0498 1.66798 9.48553C1.66798 4.59897 5.62908 0.637878 10.5156 0.637878ZM7.50035 5.32713L7.3234 5.33421C7.20899 5.34209 7.09721 5.37214 6.99427 5.42269C6.89834 5.47711 6.81073 5.54505 6.73415 5.62441C6.62797 5.72439 6.56781 5.8111 6.50322 5.89515C6.17597 6.32064 5.99977 6.84301 6.00245 7.37979C6.00422 7.81332 6.11747 8.23536 6.29442 8.62996C6.65629 9.42802 7.25173 10.273 8.03741 11.056C8.22674 11.2444 8.41255 11.4338 8.6125 11.6098C9.58878 12.4693 10.7521 13.0892 12.01 13.4201L12.5125 13.4971C12.6762 13.5059 12.8399 13.4935 13.0045 13.4856C13.2621 13.472 13.5137 13.4022 13.7415 13.2812C13.8573 13.2213 13.9703 13.1564 14.0804 13.0865C14.0804 13.0865 14.1178 13.0612 14.1909 13.0069C14.3104 12.9184 14.3838 12.8556 14.4829 12.7521C14.5572 12.6754 14.6192 12.5863 14.6687 12.4849C14.7377 12.3407 14.8067 12.0655 14.8351 11.8363C14.8563 11.6612 14.8501 11.5656 14.8474 11.5063C14.8439 11.4117 14.7652 11.3135 14.6793 11.2719L14.1644 11.0409C14.1644 11.0409 13.3947 10.7056 12.924 10.4915C12.8747 10.4701 12.8219 10.4578 12.7682 10.4552C12.7077 10.4489 12.6465 10.4557 12.5888 10.475C12.5311 10.4944 12.4782 10.526 12.4338 10.5676C12.4294 10.5658 12.3701 10.6163 11.7304 11.3913C11.6937 11.4406 11.6431 11.4779 11.5851 11.4984C11.5272 11.5189 11.4644 11.5217 11.4048 11.5063C11.3472 11.491 11.2907 11.4714 11.2358 11.4479C11.1261 11.4019 11.0881 11.3842 11.0129 11.3524C10.5049 11.1311 10.0347 10.8317 9.61937 10.465C9.50788 10.3676 9.40437 10.2615 9.2982 10.1588C8.95014 9.82546 8.64679 9.44836 8.39573 9.03695L8.34353 8.9529C8.30661 8.8961 8.27633 8.83524 8.25329 8.77152C8.21967 8.64146 8.30726 8.53706 8.30726 8.53706C8.30726 8.53706 8.52226 8.30171 8.62223 8.17431C8.71956 8.05044 8.80184 7.93011 8.85493 7.84429C8.95933 7.67618 8.99207 7.50365 8.93721 7.37006C8.68948 6.76488 8.43349 6.16294 8.16924 5.56425C8.11703 5.44569 7.9622 5.36075 7.82152 5.34394C7.77375 5.33804 7.72597 5.33333 7.67819 5.32979C7.55939 5.32297 7.44027 5.32416 7.32163 5.33333L7.50035 5.32713Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>
          </div>
          {description && (
            <p className="md:mt-[18px] sm:mt-3 mt-4">{description}</p>
          )}

          <div className="md:mt-[42px] sm:mt-10 mt-[30px]">
            <div className="w-fit">
              <Dropdown
                classNames={{
                  content: "rounded-[10px]",
                }}
              >
                <DropdownTrigger>
                  <Button className="btn black-btn opacity-1 hover:opacity-1 focus:opacity-1 active:opacity-1 flex items-center !justify-between w-full gap-10">
                    Sort-by :
                    {filters.find((f) => f.value === activeFilter)?.name ||
                      "Select"}
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
                  aria-label="Static Actions"
                  className="p-0 rounded"
                  onAction={(key) => {
                    setActiveFilter(key);
                    setActivePage(1); // reset to first page
                  }}
                >
                  {filters.map((f) => (
                    <DropdownItem
                      key={f.value}
                      className="hover:!bg-primary hover:!text-white rounded-md"
                    >
                      {f.name}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:gap-[30px] gap-5 lg:py-[35px] md:py-[30px] sm:py-6 py-5">
          {author.map((company) => (
            <div
              key={company.id}
              className="border border-gray-100 rounded-lg sm:pt-[10px] pt-0 grid content-between"
            >
              <div className="py-6 px-4 flex flex-col items-center text-center">
                {/* Logo */}

                {company?.image?.url && (
                  <Image
                    src={company?.image?.url ? company?.image?.url : ""}
                    alt="author"
                    width={270}
                    height={345}
                    className="2xl:w-[150px] 2xl:h-[150px] 1xl:w-[130px] 1xl:h-[130px] sm:h-[100px] sm:w-[100px] w-[90px] h-[90px] rounded-full sm:mb-6 mb-4"
                    onError={(e) => {
                      e.currentTarget.src = NO_FOUND_PRODUCT_GRID_IMAGE;
                    }}
                  />
                )}

                {/* Title */}
                <h3 className="font-semibold 1xl:mb-2 mb-[6px] 2xl:text-2xl lg:text-[23px] text-xl">
                  {company?.name}
                </h3>
                <p className="text-gray-200 flex items-center gap-2 flex-wrap">
                  Joined by
                  <span className="block w-1 h-1 rounded-full bg-gray-200"></span>{" "}
                  {formatMonthYear(company?.joined)}
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-between items-center w-full border-t border-gray-100 1xl:py-[14px] 1xl:px-[22px] py-[10px] px-4">
                <div className="flex items-center 2xl:gap-6 gap-[18px]">
                  <p className="flex items-center 2xl:gap-2 gap-[6px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="1xl:w-[22px] 1xl:h-[22px] w-5 h-5"
                    >
                      <path
                        d="M12.1103 1.7531C11.3956 1.4783 10.6044 1.4783 9.88969 1.7531L2.80706 4.47698C2.38561 4.63912 2.02318 4.92517 1.76754 5.2974C1.51189 5.66964 1.37503 6.1106 1.375 6.56216V15.4378C1.37503 15.8894 1.51189 16.3303 1.76754 16.7026C2.02318 17.0748 2.38561 17.3608 2.80706 17.523L9.88969 20.2469C10.6044 20.5217 11.3956 20.5217 12.1103 20.2469L19.1929 17.523C19.6144 17.3608 19.9768 17.0748 20.2325 16.7026C20.4881 16.3303 20.625 15.8894 20.625 15.4378V6.56216C20.625 6.1106 20.4881 5.66964 20.2325 5.2974C19.9768 4.92517 19.6144 4.63912 19.1929 4.47698L12.1103 1.7531ZM10.3833 3.03666C10.7803 2.88407 11.2197 2.88407 11.6167 3.03666L18.0221 5.49998L15.4688 6.4831L8.44663 3.78123L10.3833 3.03666ZM6.53125 4.51685L13.5534 7.21873L11 8.20116L3.97787 5.49998L6.53125 4.51685ZM2.75206 6.50166L10.3125 9.40979V18.9365L3.30069 16.2394C3.13867 16.1771 2.99934 16.0671 2.90104 15.924C2.80274 15.7809 2.75008 15.6114 2.75 15.4378V6.56216C2.75 6.54154 2.75069 6.52137 2.75206 6.50166ZM11.6875 18.9365V9.40979L19.2479 6.50166L19.25 6.56216V15.4378C19.25 15.7932 19.0307 16.1115 18.6993 16.2394L11.6875 18.9365Z"
                        fill="#0043A2"
                      />
                    </svg>
                    {company?.totalProducts}
                  </p>
                  <p className="flex items-center 2xl:gap-2 gap-[6px]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="1xl:w-[22px] 1xl:h-[22px] w-5 h-5"
                    >
                      <path
                        d="M3.15482 15.2956C2.32751 11.9864 1.91386 10.3327 2.78263 9.22002C3.6514 8.1073 5.35713 8.1073 8.76761 8.1073H13.232C16.6434 8.1073 18.3482 8.1073 19.217 9.22002C20.0857 10.3327 19.6721 11.9874 18.8448 15.2956C18.3183 17.4006 18.056 18.4525 17.2712 19.0658C16.4863 19.6781 15.4015 19.6781 13.232 19.6781H8.76761C6.59809 19.6781 5.51333 19.6781 4.72845 19.0658C3.94356 18.4525 3.68033 17.4006 3.15482 15.2956Z"
                        stroke="#0043A2"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M18.2313 8.5894L17.5467 6.07758C17.2825 5.10853 17.1504 4.62448 16.8794 4.25904C16.6093 3.89597 16.2424 3.61629 15.8207 3.45198C15.3964 3.28613 14.895 3.28613 13.8922 3.28613M3.76782 8.5894L4.45243 6.07758C4.71663 5.10853 4.84872 4.62448 5.11967 4.25904C5.38983 3.89597 5.75673 3.61629 6.1784 3.45198C6.60266 3.28613 7.10406 3.28613 8.10686 3.28613"
                        stroke="#0043A2"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M8.10718 3.28613C8.10718 3.0304 8.20877 2.78514 8.38959 2.60432C8.57042 2.42349 8.81568 2.3219 9.07141 2.3219H12.9283C13.1841 2.3219 13.4293 2.42349 13.6101 2.60432C13.791 2.78514 13.8926 3.0304 13.8926 3.28613C13.8926 3.54186 13.791 3.78712 13.6101 3.96794C13.4293 4.14877 13.1841 4.25036 12.9283 4.25036H9.07141C8.81568 4.25036 8.57042 4.14877 8.38959 3.96794C8.20877 3.78712 8.10718 3.54186 8.10718 3.28613Z"
                        stroke="#0043A2"
                        strokeWidth="1.5"
                      />
                    </svg>
                    {company?.totalSales}
                  </p>
                </div>
                <Link href={`/author/${company?.name}`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    className="stroke-primary hover:stroke-black focus:stroke-black active:stroke-black"
                  >
                    <g clipPath="url(#clip0_7481_13718)">
                      <path
                        d="M1.05025 1.05027H10.9497M10.9497 1.05027V10.9498M10.9497 1.05027L1.05025 10.9498"
                        stroke="curretColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {author?.length > 0 && pagination?.total > pageSize && (
          <div className="flex justify-center sm:mt-[25px] lg:mt-[20px] sm:mt-2 mt-4 gap-2 text-sm">
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
    </section>
  ) : (
    Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
  );
};

export default TopAuthor;
