"use client";

import React, { useState } from "react";
import FaqSection from "./FaqSection";

const tabs = [
  { key: "overview", title: "Overview" },
  { key: "reviews", title: "Reviews" },
  { key: "changelog", title: "Changelog" },
  { key: "faq", title: "Faq" },
];

const reviews = [
  {
    name: "Michael Chen",
    date: "April 29, 2024",
    content:
      "Orion Construction Figma UI website template by WebbyTemplate is amazing. The layout is very professional, and the pre-designed pages saved me a lot of time.",
  },
  {
    name: "Michael Chen",
    date: "April 29, 2024",
    content:
      "Orion Construction Figma UI website template by WebbyTemplate is amazing. The layout is very professional, and the pre-designed pages saved me a lot of time.",
  },
  {
    name: "Michael Chen",
    date: "April 29, 2024",
    content:
      "Orion Construction Figma UI website template by WebbyTemplate is amazing. The layout is very professional, and the pre-designed pages saved me a lot of time.",
  },
];

const changelog = [
  {
    version: "0.0.1",
    date: "23 July 2024",
    label: "initial release",
  },
  {
    version: "0.0.2",
    date: "19 March 2024",
    label: "initial release",
  },
  {
    version: "0.0.3",
    date: "26 January 2024",
    label: "initial release",
  },
];

const SinglePageTab = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-primary/10 overflow-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 p transition-all duration-200 border-b-2 ${activeTab === tab.key
                ? "border-blue-600 !text-blue-600"
                : "text-gray-600 hover:text-blue-600 border-transparent"
              } bg-transparent`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sm:mt-6 mt-3 space-y-6">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div
            className="space-y-4"
            dangerouslySetInnerHTML={{ __html: data?.overview_description }}
          ></div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="sm:space-y-8 space-y-4">
            {/* Tab Header with Sort Dropdown */}
            <div className="flex items-center justify-between w-full gap-2 flex-wrap">
              <h3>4 Reviews of this product</h3>

              {/* Sort Dropdown */}

              {/* <div className="relative inline-block text-left">
                <Button
                  onPress={() => setOpen(!open)}
                  className="inline-flex items-center px-[15px] py-[7px] border border-primary/10 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none"
                >
                  {selected}
                  <svg
                    className={`ml-2 h-4 w-4 transition-transform duration-300 ease-in-out ${open ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </Button>

                {open && (
                  <div className="absolute z-10 right-0 mt-1 w-44 bg-white border border-gray-100 rounded-md shadow-md">
                    {options.map((option) => (
                      <Button
                        key={option}
                        onPress={() => {
                          setSelected(option);
                          setOpen(false);
                        }}
                        className="block w-full text-left px-4 sm:py-2 py-1 text-sm text-black hover:bg-gray-100"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
              </div> */}

            </div>

            {/* Reviews List */}
            {reviews.map((review, idx) => (
              <div
                key={idx}
                className="border-b border-primary/10 1xl:pb-6 sm:pb-4 pb-2"
              >
                <div className="flex items-start flex-wrap sm:gap-[30px] gap-3">
                  <h5 className="flex-shrink-0">{review.name}</h5>
                  <div className="flex flex-col 1xl:gap-[15px] gap-[10px] w-full">
                    <div className="flex items-start justify-between gap-[30px]">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_2070_113)">
                            <path
                              d="M5.92852 5.18708L0.708518 5.94389L0.616064 5.96271C0.476105 5.99987 0.348514 6.0735 0.246321 6.1761C0.144128 6.27869 0.0709939 6.40657 0.0343874 6.54667C-0.00221917 6.68677 -0.000986614 6.83408 0.0379591 6.97355C0.0769048 7.11303 0.152168 7.23966 0.256064 7.34053L4.0377 11.0215L3.14588 16.2211L3.13525 16.3111C3.12668 16.4558 3.15674 16.6003 3.22234 16.7296C3.28795 16.8589 3.38674 16.9685 3.50861 17.047C3.63048 17.1256 3.77104 17.1704 3.91591 17.1768C4.06078 17.1832 4.20474 17.151 4.33306 17.0834L9.00161 14.6289L13.6595 17.0834L13.7413 17.1211C13.8764 17.1743 14.0232 17.1906 14.1666 17.1683C14.31 17.1461 14.445 17.0861 14.5575 16.9945C14.6701 16.9029 14.7563 16.783 14.8073 16.6471C14.8582 16.5111 14.8721 16.3641 14.8475 16.2211L13.9549 11.0215L17.7382 7.33971L17.802 7.27017C17.8931 7.15789 17.9529 7.02345 17.9752 6.88054C17.9975 6.73764 17.9815 6.59139 17.9289 6.45667C17.8762 6.32196 17.7888 6.20361 17.6756 6.11368C17.5623 6.02374 17.4272 5.96544 17.2841 5.94471L12.0641 5.18708L9.73061 0.457985C9.66309 0.320968 9.55856 0.205588 9.42885 0.124907C9.29915 0.0442258 9.14945 0.00146484 8.9967 0.00146484C8.84395 0.00146484 8.69425 0.0442258 8.56454 0.124907C8.43484 0.205588 8.33031 0.320968 8.26279 0.457985L5.92852 5.18708Z"
                              fill="#F9BC60"
                            />
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_2070_113)">
                            <path
                              d="M5.92852 5.18708L0.708518 5.94389L0.616064 5.96271C0.476105 5.99987 0.348514 6.0735 0.246321 6.1761C0.144128 6.27869 0.0709939 6.40657 0.0343874 6.54667C-0.00221917 6.68677 -0.000986614 6.83408 0.0379591 6.97355C0.0769048 7.11303 0.152168 7.23966 0.256064 7.34053L4.0377 11.0215L3.14588 16.2211L3.13525 16.3111C3.12668 16.4558 3.15674 16.6003 3.22234 16.7296C3.28795 16.8589 3.38674 16.9685 3.50861 17.047C3.63048 17.1256 3.77104 17.1704 3.91591 17.1768C4.06078 17.1832 4.20474 17.151 4.33306 17.0834L9.00161 14.6289L13.6595 17.0834L13.7413 17.1211C13.8764 17.1743 14.0232 17.1906 14.1666 17.1683C14.31 17.1461 14.445 17.0861 14.5575 16.9945C14.6701 16.9029 14.7563 16.783 14.8073 16.6471C14.8582 16.5111 14.8721 16.3641 14.8475 16.2211L13.9549 11.0215L17.7382 7.33971L17.802 7.27017C17.8931 7.15789 17.9529 7.02345 17.9752 6.88054C17.9975 6.73764 17.9815 6.59139 17.9289 6.45667C17.8762 6.32196 17.7888 6.20361 17.6756 6.11368C17.5623 6.02374 17.4272 5.96544 17.2841 5.94471L12.0641 5.18708L9.73061 0.457985C9.66309 0.320968 9.55856 0.205588 9.42885 0.124907C9.29915 0.0442258 9.14945 0.00146484 8.9967 0.00146484C8.84395 0.00146484 8.69425 0.0442258 8.56454 0.124907C8.43484 0.205588 8.33031 0.320968 8.26279 0.457985L5.92852 5.18708Z"
                              fill="#F9BC60"
                            />
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_2070_113)">
                            <path
                              d="M5.92852 5.18708L0.708518 5.94389L0.616064 5.96271C0.476105 5.99987 0.348514 6.0735 0.246321 6.1761C0.144128 6.27869 0.0709939 6.40657 0.0343874 6.54667C-0.00221917 6.68677 -0.000986614 6.83408 0.0379591 6.97355C0.0769048 7.11303 0.152168 7.23966 0.256064 7.34053L4.0377 11.0215L3.14588 16.2211L3.13525 16.3111C3.12668 16.4558 3.15674 16.6003 3.22234 16.7296C3.28795 16.8589 3.38674 16.9685 3.50861 17.047C3.63048 17.1256 3.77104 17.1704 3.91591 17.1768C4.06078 17.1832 4.20474 17.151 4.33306 17.0834L9.00161 14.6289L13.6595 17.0834L13.7413 17.1211C13.8764 17.1743 14.0232 17.1906 14.1666 17.1683C14.31 17.1461 14.445 17.0861 14.5575 16.9945C14.6701 16.9029 14.7563 16.783 14.8073 16.6471C14.8582 16.5111 14.8721 16.3641 14.8475 16.2211L13.9549 11.0215L17.7382 7.33971L17.802 7.27017C17.8931 7.15789 17.9529 7.02345 17.9752 6.88054C17.9975 6.73764 17.9815 6.59139 17.9289 6.45667C17.8762 6.32196 17.7888 6.20361 17.6756 6.11368C17.5623 6.02374 17.4272 5.96544 17.2841 5.94471L12.0641 5.18708L9.73061 0.457985C9.66309 0.320968 9.55856 0.205588 9.42885 0.124907C9.29915 0.0442258 9.14945 0.00146484 8.9967 0.00146484C8.84395 0.00146484 8.69425 0.0442258 8.56454 0.124907C8.43484 0.205588 8.33031 0.320968 8.26279 0.457985L5.92852 5.18708Z"
                              fill="#F9BC60"
                            />
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_2070_113)">
                            <path
                              d="M5.92852 5.18708L0.708518 5.94389L0.616064 5.96271C0.476105 5.99987 0.348514 6.0735 0.246321 6.1761C0.144128 6.27869 0.0709939 6.40657 0.0343874 6.54667C-0.00221917 6.68677 -0.000986614 6.83408 0.0379591 6.97355C0.0769048 7.11303 0.152168 7.23966 0.256064 7.34053L4.0377 11.0215L3.14588 16.2211L3.13525 16.3111C3.12668 16.4558 3.15674 16.6003 3.22234 16.7296C3.28795 16.8589 3.38674 16.9685 3.50861 17.047C3.63048 17.1256 3.77104 17.1704 3.91591 17.1768C4.06078 17.1832 4.20474 17.151 4.33306 17.0834L9.00161 14.6289L13.6595 17.0834L13.7413 17.1211C13.8764 17.1743 14.0232 17.1906 14.1666 17.1683C14.31 17.1461 14.445 17.0861 14.5575 16.9945C14.6701 16.9029 14.7563 16.783 14.8073 16.6471C14.8582 16.5111 14.8721 16.3641 14.8475 16.2211L13.9549 11.0215L17.7382 7.33971L17.802 7.27017C17.8931 7.15789 17.9529 7.02345 17.9752 6.88054C17.9975 6.73764 17.9815 6.59139 17.9289 6.45667C17.8762 6.32196 17.7888 6.20361 17.6756 6.11368C17.5623 6.02374 17.4272 5.96544 17.2841 5.94471L12.0641 5.18708L9.73061 0.457985C9.66309 0.320968 9.55856 0.205588 9.42885 0.124907C9.29915 0.0442258 9.14945 0.00146484 8.9967 0.00146484C8.84395 0.00146484 8.69425 0.0442258 8.56454 0.124907C8.43484 0.205588 8.33031 0.320968 8.26279 0.457985L5.92852 5.18708Z"
                              fill="#F9BC60"
                            />
                          </g>
                        </svg>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_2070_113)">
                            <path
                              d="M5.92852 5.18708L0.708518 5.94389L0.616064 5.96271C0.476105 5.99987 0.348514 6.0735 0.246321 6.1761C0.144128 6.27869 0.0709939 6.40657 0.0343874 6.54667C-0.00221917 6.68677 -0.000986614 6.83408 0.0379591 6.97355C0.0769048 7.11303 0.152168 7.23966 0.256064 7.34053L4.0377 11.0215L3.14588 16.2211L3.13525 16.3111C3.12668 16.4558 3.15674 16.6003 3.22234 16.7296C3.28795 16.8589 3.38674 16.9685 3.50861 17.047C3.63048 17.1256 3.77104 17.1704 3.91591 17.1768C4.06078 17.1832 4.20474 17.151 4.33306 17.0834L9.00161 14.6289L13.6595 17.0834L13.7413 17.1211C13.8764 17.1743 14.0232 17.1906 14.1666 17.1683C14.31 17.1461 14.445 17.0861 14.5575 16.9945C14.6701 16.9029 14.7563 16.783 14.8073 16.6471C14.8582 16.5111 14.8721 16.3641 14.8475 16.2211L13.9549 11.0215L17.7382 7.33971L17.802 7.27017C17.8931 7.15789 17.9529 7.02345 17.9752 6.88054C17.9975 6.73764 17.9815 6.59139 17.9289 6.45667C17.8762 6.32196 17.7888 6.20361 17.6756 6.11368C17.5623 6.02374 17.4272 5.96544 17.2841 5.94471L12.0641 5.18708L9.73061 0.457985C9.66309 0.320968 9.55856 0.205588 9.42885 0.124907C9.29915 0.0442258 9.14945 0.00146484 8.9967 0.00146484C8.84395 0.00146484 8.69425 0.0442258 8.56454 0.124907C8.43484 0.205588 8.33031 0.320968 8.26279 0.457985L5.92852 5.18708Z"
                              fill="#F9BC60"
                            />
                          </g>
                        </svg>
                      </div>
                      <span className="p2 !text-primary">{review.date}</span>
                    </div>
                    <p>{review.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Changelog Tab */}
        {activeTab === "changelog" && (
          <div className="space-y-5">
            {data?.changelogs.map((entry, index) => (
              <div key={index} className="flex flex-col gap-2">
                <div className="flex items-center justify-between w-full">
                  <a href="#">
                    <p className="font-bold text-primary">{entry.version}</p>
                  </a>
                  <p className="p2">{entry.date}</p>
                </div>
                <p className="bg-blue-300 w-full px-[10px] rounded-[4px] border border-primary/10 py-[1px] font-Space_Mono text-sm text-black tracking-normal">
                  - {entry.note}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* faq Tab */}
        {activeTab === "faq" && <FaqSection list={data?.faq} type="full" />}
      </div>
    </div>
  );
};

export default SinglePageTab;
