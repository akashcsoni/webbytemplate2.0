"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * FAQ Section Component
 *
 * @param {Object} props
 * @param {string} props.title - Section heading
 * @param {string} props.label - Section description
 * @param {{ label: string, link: string }} [props.button] - Optional button
 * @param {{ id: string|number, title: string, label: string }[]} props.list - FAQ list
 * @param {'medium'|'full'} [props.type='medium'] - Layout type
 */
export default function FaqSection({ title = "", label = "", button, list = [], type = "medium" }) {
  const [openQuestion, setOpenQuestion] = useState(list?.[0]?.id ?? null);

  const toggleQuestion = (id) => {
    setOpenQuestion((prevId) => (prevId === id ? null : id));
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleQuestion(id);
    }
  };

  const isMedium = type === "medium";

  return (
    <section className="xl:py-[35px] sm:py-[30px] py-5">
      <div className="container mx-auto">
        <div className="flex justify-between lg:flex-row flex-col 2xl:gap-52 xl:gap-20 sm:gap-8 gap-5">
          {(title || label) && (
            <div className="xl:w-[30%] lg:w-[36%] w-full">
              {title && <h2 className="md:mb-4 sm:mb-3 mb-2">{title}</h2>}
              {label && <p className="lg:mb-6 sm:mb-5 mb-4 2xl:text-lg 1xl:text-[17px] lg:text-[15px] sm:text-base text-[15px] 1xl:leading-[30px] sm:leading-6 leading-[1.45rem]">{label}</p>}
              {button?.label && button?.link && (
                <Link href={button.link} passHref>
                  <button className="btn btn-primary">{button.label}</button>
                </Link>
              )}
            </div>
          )}

          <div
            className={`${isMedium ? "lg:w-[58%]" : ""
              } w-full 1xl:space-y-7 md:space-y-5 space-y-4`}
          >
            {Array.isArray(list) && list.length > 0 ? (
              list.map((item, index) => (
                <div
                  key={item.id}
                  className="border-b border-primary/10 2xl:pb-7 1xl:pb-6 md:pb-5 pb-4"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="flex items-center justify-between cursor-pointer sm:gap-[22px] gap-2"
                    onClick={() => toggleQuestion(item.id)}
                    onKeyDown={(e) => handleKeyDown(e, item.id)}
                    aria-expanded={openQuestion === item.id}
                    aria-controls={`faq-content-${item.id}`}
                  >
                    <div className="flex items-center md:gap-6 sm:gap-4 gap-2.5">
                      <span className="h5 !font-normal text-primary">
                        Q{index + 1}.
                      </span>
                      <h5 className="font-normal 2xl:text-xl 1xl:text-[19px] md:text-lg sm:text-[17px] sm:text-base text-[15px]">{item.title}</h5>
                    </div>
                    <span className="text-gray-200 p-1" aria-hidden="true">
                      {openQuestion === item.id ? (
                        <CloseIcon />
                      ) : (
                        <PlusIcon />
                      )}
                    </span>
                  </div>

                  {openQuestion === item.id && (
                    <div
                      id={`faq-content-${item.id}`}
                      className="2xl:mt-5 xl:mt-4 sm:mt-3 mt-2 lg:pl-14 md:pl-[52px] sm:pl-10 pl-8 pr-4 pb-0.5"
                    >
                      <p className="2xl:text-lg 1xl:text-[17px] sm:text-base text-sm">
                        {item.label}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400">No FAQs available.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CloseIcon() {
  return (
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
      className="h-5 w-5"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

function PlusIcon() {
  return (
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
      className="h-5 w-5"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
