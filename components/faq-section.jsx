"use client";

import { useState } from "react";
import Link from "next/link";

export default function FAQSection({
  title,
  label,
  button,
  list,
  type = "medium",
}) {
  const [openQuestion, setOpenQuestion] = useState(list[0]?.id || null);

  const toggleQuestion = (id) => {
    if (openQuestion === id) {
      setOpenQuestion(null);
    } else {
      setOpenQuestion(id);
    }
  };

  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleQuestion(id);
    }
  };

  return (
    <section className="xl:py-[35px] sm:py-[30px] py-5">
      <div className="container mx-auto">
        <div className="flex justify-between lg:flex-row flex-col 2xl:gap-52 xl:gap-20 sm:gap-8 gap-[30px]">
          {title && label && (
            <div className="xl:w-[30%] lg:w-[36%] w-full">
              <h2 className="md:mb-4 mb-3">{title}</h2>
              <p className="lg:mb-6 mb-5">{label}</p>
              {button && (
                <Link href={button.link}>
                  <button className="btn btn-primary">{button.label}</button>
                </Link>
              )}
            </div>
          )}

          <div className={`xl:space-y-7 md:space-y-5 space-y-4 ${type === "medium" && "lg:w-[58%]"} w-full`}>
            {list?.map((item, index) => (
              <div
                key={item.id}
                className="border-b border-primary/10 2xl:pb-7 xl:pb-6 md:pb-5 pb-4"
              >
                <div
                  role="button"
                  tabIndex={0}
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleQuestion(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  aria-expanded={openQuestion === item.id}
                  aria-controls={`faq-content-${item.id}`}
                >
                  <div className="flex items-center md:gap-6 sm:gap-4 gap-2">
                    <span className="h5 !font-normal text-primary">
                      Q{index + 1}.
                    </span>
                    <h5 className="font-normal">{item.title}</h5>
                  </div>
                  <span className="text-gray-200 p-1" aria-hidden="true">
                    {openQuestion === item.id ? (
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
                    ) : (
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
