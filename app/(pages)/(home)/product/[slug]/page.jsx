import LicenseSelector from "@/components/product/single-product/license/license-selector";
import { TechnologySelector } from "@/components/product/technology-selector";
import SinglePageSwiper from "@/components/single-page-swiper";
import SinglePageTab from "@/components/single-page-tab";
import SinglePageModal from "@/single-page-modal";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

// Server-side data fetching with POST method
async function getPageData(slug) {
  try {
    // Use a fixed API URL since we know the domain
    const apiUrl = `https://studio.webbytemplate.com/api/product/${slug}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug,
        // Add any other required parameters for your POST request
      }),
      cache: "no-store", // or { next: { revalidate: 60 } } for ISR
    });

    const result = await response.json();

    if (result.result && result.data) {
      return result.data;
    }
    // If no data is found, trigger 404
    return notFound();
  } catch (error) {
    // console.error("Error fetching page data:", error)
    throw error;
  }
}

function TagPill({ text, slug }) {
  return (
    <Link
      href={`/tag/${slug}`}
      className="p2 border py-1 sm:px-[18px] px-2 border-primary/10 rounded-[4px]"
    >
      {text}
    </Link>
  );
}

function FeatureItem({ text }) {
  return (
    <div className="flex items-center gap-2 sm:pt-[14px] pt-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="sm:w-5 sm:h-5 w-4 h-4 text-[#0156d5]"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <span className="text-[#505050]">{text}</span>
    </div>
  );
}

export default async function ProductSinglePage({ params }) {
  const { slug } = await params;
  const pageData = await getPageData(slug);

  // Function to extract technologies with custom slug and price
  function extractTechnologiesWithProductSlugs(
    data,
    defaultSlug = "",
    defaultPrice = null,
  ) {
    const technologies = [];
    const techMap = new Map(); // To track technologies by ID

    // First, add the main technology with the default slug and price
    if (data.technology && data.technology.id) {
      const mainTech = JSON.parse(JSON.stringify(data.technology));
      mainTech.slug = defaultSlug || mainTech.slug;
      mainTech.price = defaultPrice || {
        id: null,
        regular_price: null,
        sales_price: null,
      };
      technologies.push(mainTech);
      techMap.set(mainTech.id, true); // Mark as processed
    }

    // Process products to get the product slugs and prices
    if (data.products && Array.isArray(data.products)) {
      data.products.forEach((product) => {
        if (
          product.all_technology &&
          product.all_technology.technology &&
          product.all_technology.technology.id
        ) {
          const techId = product.all_technology.technology.id;

          // Skip if we already processed this technology (as the main technology)
          if (techMap.has(techId)) {
            return;
          }

          // Create a deep copy of the technology object
          const tech = JSON.parse(
            JSON.stringify(product.all_technology.technology),
          );

          // Replace technology slug with product slug
          tech.slug = product.slug;

          // Add price object from the product
          if (product.price) {
            tech.price = product.price;
          }

          technologies.push(tech);
          techMap.set(techId, true); // Mark as processed
        }
      });
    }

    return technologies;
  }

  // Extract and display
  const allTechnologies = extractTechnologiesWithProductSlugs(
    pageData?.all_technology,
    pageData?.slug,
    pageData?.price,
  );

  return (
    <div className="overflow-hidden">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center text-sm mb-3">
          <Link href="/" className="text-[#0156d5] hover:underline">
            Home
          </Link>
          <span className="mx-2 text-gray-500">&gt;</span>
          {pageData.categories && pageData.categories.length > 0 ? (
            <Link
              href={`/category/${pageData.categories[0].slug}`}
              className="text-[#0156d5] hover:underline"
            >
              {pageData.categories[0].title}
            </Link>
          ) : null}
          <span className="mx-2 text-gray-500">&gt;</span>
          <span className="text-[#505050]">{pageData?.title}</span>
        </nav>

        {/* Main Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 md:mb-10">
          <div className="space-y-[15px]">
            <h1 className="h2">{pageData?.title}</h1>

            <div className="flex lg:items-start items-baseline justify-between w-full gap-y-4 flex-wrap">
              <div className="flex lg:flex-row flex-col lg:items-center items-start gap-[15px]">
                {pageData.author && (
                  <div className="flex items-center gap-2">
                    {pageData.author.image?.url ? (
                      <div className="relative w-7 h-7 overflow-hidden rounded-full">
                        <Image
                          src={
                            `https://studio.webbytemplate.com${pageData.author.image.url}` ||
                            "/placeholder.svg"
                          }
                          alt={`${pageData.author.full_name}'s profile picture`}
                          fill
                          sizes="28px"
                          className="object-cover"
                          priority={false}
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">
                          {pageData.author.name?.[0] ||
                            pageData.author.full_name?.[0]}
                        </span>
                      </div>
                    )}
                    <span className="p2">{pageData.author.full_name}</span>
                  </div>
                )}
                <div className="flex gap-[10px] lg:m-0 flex-wrap">
                  <span className="flex items-center px-3 py-0.5 rounded-[4px] gap-2 text-sm leading-6 bg-blue-300 text-primary flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_1360_669)">
                        <path
                          d="M5.27066 4.6109L0.630662 5.28362L0.54848 5.30035C0.424072 5.33338 0.310658 5.39883 0.21982 5.49003C0.128982 5.58122 0.0639738 5.69489 0.0314346 5.81943C-0.00110454 5.94396 -8.93511e-06 6.0749 0.0346095 6.19888C0.0692279 6.32285 0.136129 6.43542 0.22848 6.52508L3.58993 9.79708L2.79721 14.4189L2.78775 14.4989C2.78014 14.6276 2.80686 14.7559 2.86517 14.8709C2.92349 14.9859 3.0113 15.0832 3.11963 15.1531C3.22796 15.2229 3.35291 15.2627 3.48168 15.2684C3.61045 15.2741 3.73842 15.2455 3.85248 15.1854L8.0023 13.0036L12.1427 15.1854L12.2154 15.2189C12.3354 15.2662 12.4659 15.2807 12.5934 15.2609C12.7209 15.2411 12.8408 15.1878 12.9409 15.1064C13.041 15.0249 13.1176 14.9184 13.1629 14.7975C13.2082 14.6767 13.2205 14.546 13.1987 14.4189L12.4052 9.79708L15.7681 6.52435L15.8248 6.46253C15.9059 6.36273 15.959 6.24323 15.9788 6.1162C15.9986 5.98918 15.9844 5.85917 15.9376 5.73943C15.8908 5.61968 15.8132 5.51448 15.7125 5.43454C15.6118 5.3546 15.4917 5.30278 15.3645 5.28435L10.7245 4.6109L8.6503 0.407261C8.59028 0.285468 8.49737 0.182908 8.38207 0.111191C8.26678 0.0394746 8.13371 0.00146484 7.99793 0.00146484C7.86216 0.00146484 7.72909 0.0394746 7.6138 0.111191C7.4985 0.182908 7.40559 0.285468 7.34557 0.407261L5.27066 4.6109Z"
                          fill="#0156D5"
                        />
                      </g>
                    </svg>
                    Creative Tools
                  </span>

                  <span className="flex items-center px-3 py-0.5 rounded-[4px] gap-2 text-sm leading-6 bg-blue-300 text-primary flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_1360_673)">
                        <path
                          d="M4.87891 5.07669V4.29729C4.87891 3.47045 5.20737 2.67747 5.79203 2.09281C6.37669 1.50815 7.16967 1.17969 7.9965 1.17969C8.82334 1.17969 9.61632 1.50815 10.201 2.09281C10.7856 2.67747 11.1141 3.47045 11.1141 4.29729V5.07669"
                          stroke="#0156D5"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.44501 4.75409C0.988281 5.21082 0.988281 5.94501 0.988281 7.41496V9.75316C0.988281 12.6923 0.988281 14.1622 1.90174 15.0749C2.81519 15.9876 4.28436 15.9884 7.22348 15.9884H8.78228C11.7214 15.9884 13.1913 15.9884 14.104 15.0749C15.0167 14.1614 15.0175 12.6923 15.0175 9.75316V7.41496C15.0175 5.94501 15.0175 5.21082 14.5607 4.75409C14.104 4.29736 13.3698 4.29736 11.8999 4.29736H4.10588C2.63593 4.29736 1.90174 4.29736 1.44501 4.75409ZM6.44408 8.19436C6.44408 7.98765 6.36196 7.78941 6.2158 7.64324C6.06963 7.49708 5.87139 7.41496 5.66468 7.41496C5.45797 7.41496 5.25973 7.49708 5.11356 7.64324C4.96739 7.78941 4.88528 7.98765 4.88528 8.19436V9.75316C4.88528 9.95987 4.96739 10.1581 5.11356 10.3043C5.25973 10.4504 5.45797 10.5326 5.66468 10.5326C5.87139 10.5326 6.06963 10.4504 6.2158 10.3043C6.36196 10.1581 6.44408 9.95987 6.44408 9.75316V8.19436ZM11.1205 8.19436C11.1205 7.98765 11.0384 7.78941 10.8922 7.64324C10.746 7.49708 10.5478 7.41496 10.3411 7.41496C10.1344 7.41496 9.93612 7.49708 9.78996 7.64324C9.64379 7.78941 9.56168 7.98765 9.56168 8.19436V9.75316C9.56168 9.95987 9.64379 10.1581 9.78996 10.3043C9.93612 10.4504 10.1344 10.5326 10.3411 10.5326C10.5478 10.5326 10.746 10.4504 10.8922 10.3043C11.0384 10.1581 11.1205 9.95987 11.1205 9.75316V8.19436Z"
                          fill="#0156D5"
                        />
                      </g>
                    </svg>
                    986 Sales
                  </span>

                  <span className="flex items-center px-3 py-0.5 rounded-[4px] gap-2 text-sm leading-6 bg-blue-300 text-primary flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_1360_679)">
                        <mask
                          id="mask0_1360_679"
                          maskUnits="userSpaceOnUse"
                          x="0"
                          y="0"
                          width="16"
                          height="16"
                        >
                          <path
                            d="M7.91961 14.8807C8.82334 14.8818 9.71838 14.7044 10.5533 14.3585C11.3882 14.0127 12.1466 13.5052 12.7848 12.8654C13.4247 12.2272 13.9321 11.4688 14.2779 10.6339C14.6238 9.79894 14.8013 8.9039 14.8001 8.00017C14.8013 7.09645 14.6238 6.2014 14.2779 5.36647C13.9321 4.53154 13.4247 3.77317 12.7848 3.13494C12.1466 2.49511 11.3882 1.98769 10.5533 1.64184C9.71838 1.29599 8.82334 1.11852 7.91961 1.11963C7.01588 1.11852 6.12084 1.29599 5.28591 1.64184C4.45097 1.98769 3.69261 2.49511 3.05438 3.13494C2.41454 3.77317 1.90712 4.53154 1.56127 5.36647C1.21542 6.2014 1.03795 7.09645 1.03907 8.00017C1.03795 8.9039 1.21542 9.79894 1.56127 10.6339C1.90712 11.4688 2.41454 12.2272 3.05438 12.8654C3.69261 13.5052 4.45097 14.0127 5.28591 14.3585C6.12084 14.7044 7.01588 14.8818 7.91961 14.8807Z"
                            fill="white"
                            stroke="white"
                            strokeWidth="2.06416"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.16797 8.0002L7.23213 10.0644L11.3605 5.93604"
                            stroke="black"
                            strokeWidth="2.06416"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </mask>
                        <g mask="url(#mask0_1360_679)">
                          <path
                            d="M-0.339844 -0.256836H16.1735V16.2565H-0.339844V-0.256836Z"
                            fill="#0156D5"
                          />
                        </g>
                      </g>
                    </svg>
                    Well Documented
                  </span>
                </div>
              </div>
              <div className="flex gap-3 min-w-fit lg:hidden flex-wrap">
                <button className="2xl:!px-5 xl:!px-[18px] lg:!px-4 lg:!py-[7px] !py-1.5 !px-2 gap-2 flex items-center justify-center rounded-md btn btn-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="21"
                    viewBox="0 0 20 21"
                    fill="none"
                    className="md:w-[20px] md:h-[21px] w-[17px] h-[17px]"
                  >
                    <path
                      d="M2.06925 13.4961C1.29652 12.4925 0.910156 11.9898 0.910156 10.4998C0.910156 9.00887 1.29652 8.50796 2.06925 7.50341C3.61197 5.49978 6.19925 3.22705 10.0011 3.22705C13.8029 3.22705 16.3902 5.49978 17.9329 7.50341C18.7056 8.50887 19.092 9.00978 19.092 10.4998C19.092 11.9907 18.7056 12.4916 17.9329 13.4961C16.3902 15.4998 13.8029 17.7725 10.0011 17.7725C6.19925 17.7725 3.61197 15.4998 2.06925 13.4961Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M12.728 10.4997C12.728 11.2231 12.4406 11.9167 11.9292 12.4282C11.4177 12.9397 10.724 13.227 10.0007 13.227C9.27739 13.227 8.5837 12.9397 8.07224 12.4282C7.56077 11.9167 7.27344 11.2231 7.27344 10.4997C7.27344 9.77642 7.56077 9.08272 8.07224 8.57126C8.5837 8.0598 9.27739 7.77246 10.0007 7.77246C10.724 7.77246 11.4177 8.0598 11.9292 8.57126C12.4406 9.08272 12.728 9.77642 12.728 10.4997Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                  Live Preview
                </button>

                <button className="2xl:!px-5 xl:!px-[18px] lg:!px-4 lg:!py-[7px] !py-1.5 !px-2 gap-2 inline-flex items-center justify-center rounded-md btn text-primary border border-gray-100 hover:border-primary focus:border-primary active:border-primary transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d="M5.64365 11.0056V7.48067C5.65412 6.78779 5.8012 6.10379 6.07648 5.46785C6.35175 4.83192 6.7498 4.25655 7.24782 3.77471C7.74584 3.29288 8.33405 2.91404 8.97873 2.65993C9.62341 2.40581 10.3119 2.28139 11.0047 2.29382C11.6976 2.28139 12.3861 2.40581 13.0308 2.65993C13.6754 2.91404 14.2636 3.29288 14.7617 3.77471C15.2597 4.25655 15.6577 4.83192 15.933 5.46785C16.2083 6.10379 16.3554 6.78779 16.3658 7.48067V11.0056M13.6853 18.042C14.3962 18.042 15.078 17.7596 15.5807 17.2569C16.0834 16.7542 16.3658 16.0724 16.3658 15.3615V12.3459M13.6853 18.042C13.6853 18.4864 13.5088 18.9125 13.1946 19.2267C12.8804 19.5409 12.4543 19.7174 12.0099 19.7174H9.99954C9.55521 19.7174 9.12908 19.5409 8.81489 19.2267C8.50071 18.9125 8.3242 18.4864 8.3242 18.042C8.3242 17.5977 8.50071 17.1716 8.81489 16.8574C9.12908 16.5432 9.55521 16.3667 9.99954 16.3667H12.0099C12.4543 16.3667 12.8804 16.5432 13.1946 16.8574C13.5088 17.1716 13.6853 17.5977 13.6853 18.042ZM3.63324 8.99518H4.97352C5.15125 8.99518 5.3217 9.06578 5.44737 9.19146C5.57305 9.31713 5.64365 9.48759 5.64365 9.66532V13.6861C5.64365 13.8639 5.57305 14.0343 5.44737 14.16C5.3217 14.2857 5.15125 14.3563 4.97352 14.3563H3.63324C3.27778 14.3563 2.93688 14.2151 2.68553 13.9637C2.43418 13.7124 2.29297 13.3715 2.29297 13.016V10.3355C2.29297 9.97999 2.43418 9.63909 2.68553 9.38774C2.93688 9.13639 3.27778 8.99518 3.63324 8.99518ZM18.3762 14.3563H17.036C16.8582 14.3563 16.6878 14.2857 16.5621 14.16C16.4364 14.0343 16.3658 13.8639 16.3658 13.6861V9.66532C16.3658 9.48759 16.4364 9.31713 16.5621 9.19146C16.6878 9.06578 16.8582 8.99518 17.036 8.99518H18.3762C18.7317 8.99518 19.0726 9.13639 19.324 9.38774C19.5753 9.63909 19.7165 9.97999 19.7165 10.3355V13.016C19.7165 13.3715 19.5753 13.7124 19.324 13.9637C19.0726 14.2151 18.7317 14.3563 18.3762 14.3563Z"
                      stroke="currentColor"
                      strokeWidth="1.37561"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>

          <div className="lg:flex gap-3 min-w-fit hidden">
            <button className="gap-2 inline-flex items-center justify-center rounded-md btn btn-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="21"
                viewBox="0 0 20 21"
                fill="none"
              >
                <path
                  d="M2.06925 13.4961C1.29652 12.4925 0.910156 11.9898 0.910156 10.4998C0.910156 9.00887 1.29652 8.50796 2.06925 7.50341C3.61197 5.49978 6.19925 3.22705 10.0011 3.22705C13.8029 3.22705 16.3902 5.49978 17.9329 7.50341C18.7056 8.50887 19.092 9.00978 19.092 10.4998C19.092 11.9907 18.7056 12.4916 17.9329 13.4961C16.3902 15.4998 13.8029 17.7725 10.0011 17.7725C6.19925 17.7725 3.61197 15.4998 2.06925 13.4961Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M12.728 10.4997C12.728 11.2231 12.4406 11.9167 11.9292 12.4282C11.4177 12.9397 10.724 13.227 10.0007 13.227C9.27739 13.227 8.5837 12.9397 8.07224 12.4282C7.56077 11.9167 7.27344 11.2231 7.27344 10.4997C7.27344 9.77642 7.56077 9.08272 8.07224 8.57126C8.5837 8.0598 9.27739 7.77246 10.0007 7.77246C10.724 7.77246 11.4177 8.0598 11.9292 8.57126C12.4406 9.08272 12.728 9.77642 12.728 10.4997Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              Live Preview
            </button>

            <button className="gap-2 inline-flex items-center justify-center rounded-md btn text-primary border border-gray-100 hover:border-primary focus:border-primary active:border-primary transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d="M5.64365 11.0056V7.48067C5.65412 6.78779 5.8012 6.10379 6.07648 5.46785C6.35175 4.83192 6.7498 4.25655 7.24782 3.77471C7.74584 3.29288 8.33405 2.91404 8.97873 2.65993C9.62341 2.40581 10.3119 2.28139 11.0047 2.29382C11.6976 2.28139 12.3861 2.40581 13.0308 2.65993C13.6754 2.91404 14.2636 3.29288 14.7617 3.77471C15.2597 4.25655 15.6577 4.83192 15.933 5.46785C16.2083 6.10379 16.3554 6.78779 16.3658 7.48067V11.0056M13.6853 18.042C14.3962 18.042 15.078 17.7596 15.5807 17.2569C16.0834 16.7542 16.3658 16.0724 16.3658 15.3615V12.3459M13.6853 18.042C13.6853 18.4864 13.5088 18.9125 13.1946 19.2267C12.8804 19.5409 12.4543 19.7174 12.0099 19.7174H9.99954C9.55521 19.7174 9.12908 19.5409 8.81489 19.2267C8.50071 18.9125 8.3242 18.4864 8.3242 18.042C8.3242 17.5977 8.50071 17.1716 8.81489 16.8574C9.12908 16.5432 9.55521 16.3667 9.99954 16.3667H12.0099C12.4543 16.3667 12.8804 16.5432 13.1946 16.8574C13.5088 17.1716 13.6853 17.5977 13.6853 18.042ZM3.63324 8.99518H4.97352C5.15125 8.99518 5.3217 9.06578 5.44737 9.19146C5.57305 9.31713 5.64365 9.48759 5.64365 9.66532V13.6861C5.64365 13.8639 5.57305 14.0343 5.44737 14.16C5.3217 14.2857 5.15125 14.3563 4.97352 14.3563H3.63324C3.27778 14.3563 2.93688 14.2151 2.68553 13.9637C2.43418 13.7124 2.29297 13.3715 2.29297 13.016V10.3355C2.29297 9.97999 2.43418 9.63909 2.68553 9.38774C2.93688 9.13639 3.27778 8.99518 3.63324 8.99518ZM18.3762 14.3563H17.036C16.8582 14.3563 16.6878 14.2857 16.5621 14.16C16.4364 14.0343 16.3658 13.8639 16.3658 13.6861V9.66532C16.3658 9.48759 16.4364 9.31713 16.5621 9.19146C16.6878 9.06578 16.8582 8.99518 17.036 8.99518H18.3762C18.7317 8.99518 19.0726 9.13639 19.324 9.38774C19.5753 9.63909 19.7165 9.97999 19.7165 10.3355V13.016C19.7165 13.3715 19.5753 13.7124 19.324 13.9637C19.0726 14.2151 18.7317 14.3563 18.3762 14.3563Z"
                  stroke="currentColor"
                  strokeWidth="1.37561"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Schedule Meeting
            </button>
          </div>
        </div>

        <div className="lg:hidden block">
          <SinglePageSwiper />
        </div>

        <div className="lg:flex gap-[60px] w-full bg-white pb-8">
          <div className="w-full lg:w-[40%] 2xl:space-y-[35px] 1xl:space-y-6 lg:space-y-5 space-y-4 sm:mb-5 lg:mb-0 divide-y divide-primary/10">
            {/* License Selection */}
            <LicenseSelector licenses={pageData?.all_license} />

            {/* Technology */}
            <div className="border-b border-[#d9dde2] ">
              <TechnologySelector all_technology={allTechnologies} />
            </div>

            {/* Lifetime */}
            <div className="border-b border-[#d9dde2] lg:py-[15px] py-3 flex justify-between items-center">
              <h2 className="text-[#000000] text-lg font-semibold">Lifetime</h2>
              <div>
                <span className="font-medium">
                  ${pageData?.price?.sales_price}
                </span>
                <br />
                {/* <span className="text-[#969ba3] font-medium text-sm line-through">
                ${pageData?.price?.regular_price}
              </span> */}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="!mt-0">
              <div className="lg:py-5 py-4 grid gap-5">
                <button className="w-full btn btn-primary flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="xl:w-5 xl:h-5 w-4 h-4 mr-2"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                  Add to Cart
                </button>
                {/* contact sales */}
                <SinglePageModal />
              </div>

              {/* contact sale */}

              {/* Related Topics */}
              <div className="2xl:pt-4 lg;pt-1">
                <h5 className="text-[#000000] font-medium mb-4 2xl:pb-[18px] pb-3 border-primary/10 border-b">
                  Related Topics:
                </h5>
                <p className="p2 lg:mb-[30px] mb-4">
                  Buy with confidence. Our 10 days money-back guarantee has
                  covered you if you are unhappy with our products.
                </p>

                <div className="flex justify-between text-[#505050] flex-wrap gap-y-1">
                  <p className="p2">
                    <span className="!text-black">Created :</span> 03 October
                    2023
                  </p>
                  <p className="p2">
                    <span className="!text-black">Updated :</span> 30 January
                    2025
                  </p>
                </div>
              </div>
            </div>

            {/* Review */}
            <div className="2xl:py-[15px] py-3 flex justify-between items-center">
              <h5 className="text-[#000000] font-medium">Review:</h5>
              <div className="flex items-center">
                <div className="flex text-[#f9bc60]">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="0"
                      className="w-5 h-5"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-[#505050]">(4.70)</span>
              </div>
            </div>

            {/* Tags */}
            <div className="!mt-0">
              <div className="lg:py-[15px] py-3 2xl:pt-[30px]">
                <h5 className="font-medium mb-3 border-b border-primary/10 pb-[18px]">
                  Tags:
                </h5>
                <div className="flex flex-wrap gap-3">
                  {pageData.tags.map((tag) => (
                    <TagPill key={tag.slug} text={tag.title} slug={tag.slug} />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="sm:py-4 py-3">
                <h5 className="font-medium border-b border-primary/10 sm:pb-[18px] pb-3">
                  Features:
                </h5>
                <div className="sm:space-y-[14px] space-y-3 divide-y divide-primary/10 ">
                  {pageData.features.map((feature) => (
                    <FeatureItem key={feature.slug} text={feature.title} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-[60%] relative">
            {/* discription */}
            <>
              <div className="lg:block hidden">
                <SinglePageSwiper />
              </div>
              <hr className="border border-primary/10 xl:my-[25px] sm:my-5 my-2" />
              <div className="sm:space-y-5 space-y-2 sm:mb-[50px] mb-4">
                <p>
                  Diazelo is a modern and stylish Adobe XD template designed
                  specifically for fashion and clothing{" "}
                  <Link href="javascript:;" className="!text-primary p2">
                    eCommerce{" "}
                  </Link>{" "}
                  businesses. With its sleek design and user-friendly interface,
                  Diazelo provides an excellent foundation for creating a
                  high-performing online store. It offers a visually stunning
                  experience that enhances brand appeal and engages customers
                  effectively.
                </p>
                <p>
                  Template is crafted with a pixel-perfect layout, ensuring a
                  seamless browsing experience for users. Diazelo features a
                  clean and contemporary aesthetic, making it suitable for
                  various fashion brands, including apparel, footwear,
                  accessories, and more. Its well-structured design allows
                  businesses to showcase their products in an appealing and
                  organized manner.
                </p>
                <p>
                  This{" "}
                  <Link href="javascript:;" className="!text-primary p2">
                    {" "}
                    XD template{" "}
                  </Link>{" "}
                  offers various pre-designed inner pages, including product
                  pages, category pages, shopping cart, checkout, and customer
                  account sections. These pages are carefully designed to
                  maintain consistency in style and usability, enhancing the
                  overall user journey from browsing to purchase.
                </p>
              </div>

              <SinglePageTab data={pageData} />
            </>
          </div>
        </div>
      </div>
    </div>
  );
}
