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

  const formatContent = (content) => {
    
    if (!content) return "";

    const lines = content.split("\n");
    let result = "";
    let listBuffer = [];
    let blockquoteBuffer = [];

    const flushList = () => {
      if (listBuffer.length) {
        result += "<ul>" + listBuffer.map(li => `<li>${li}</li>`).join("") + "</ul>";
        listBuffer = [];
      }
    };

    const flushBlockquote = () => {
      if (blockquoteBuffer.length) {
        result += "<blockquote>" + blockquoteBuffer.join("") + "</blockquote>";
        blockquoteBuffer = [];
      }
    };

    const parseInlineMarkdown = (text) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")     // bold (**) 
        .replace(/__(.*?)__/g, "<strong>$1</strong>")         // bold (__)
        .replace(/\*(.*?)\*/g, "<em>$1</em>")                 // italic (*)
        .replace(/_(.*?)_/g, "<em>$1</em>")                   // italic (_)
        .replace(/~~(.*?)~~/g, "<del>$1</del>")               // strikethrough
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>'); // links
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) {
        flushList();
        flushBlockquote();
        return;
      }

      // Blockquote lines (group contiguous '>' lines)
      if (/^>\s?/.test(trimmed)) {
        flushList(); // end any open list before blockquote
        const inner = trimmed.replace(/^>\s?/, "");
        // support headings inside blockquote
        const headingMatchBQ = /^(#{1,6})\s+(.+)$/.exec(inner);
        if (headingMatchBQ) {
          const level = headingMatchBQ[1].length;
          const text = parseInlineMarkdown(headingMatchBQ[2]);
          blockquoteBuffer.push(`<h${level}>${text}</h${level}>`);
        } else {
          blockquoteBuffer.push(`<p>${parseInlineMarkdown(inner)}</p>`);
        }
        return;
      }

      // Headings H1–H6 (outside blockquote)
      const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
      if (headingMatch) {
        flushList();
        flushBlockquote();
        const level = headingMatch[1].length; // count of "#"
        const text = parseInlineMarkdown(headingMatch[2]);
        result += `<h${level}>${text}</h${level}>`;
        return;
      }

      // Lists
      if (/^[-*]\s+/.test(trimmed)) {
        listBuffer.push(parseInlineMarkdown(trimmed.replace(/^[-*]\s+/, "")));
      }

      // Paragraph
      else {
        flushList();
        flushBlockquote();
        result += `<p>${parseInlineMarkdown(trimmed)}</p>`;
      }
    });

    flushList();
    flushBlockquote();
    return result;
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
                      <h3 className="font-normal 2xl:text-xl 1xl:text-[19px] md:text-lg sm:text-[17px] sm:text-base text-[15px]">{item.title}</h3>
                    </div>
                    <span className="text-gray-200 p-1" aria-hidden="true">
                      {openQuestion === item.id ? (
                        <CloseIcon />
                      ) : (
                        <PlusIcon />
                      )}
                    </span>
                  </div>

                  {/* FAQ content - always in DOM for SEO, visibility controlled by CSS */}
                  <div
                    id={`faq-content-${item.id}`}
                    className={`2xl:mt-5 xl:mt-4 sm:mt-3 mt-2 lg:pl-14 md:pl-[52px] sm:pl-10 pl-8 pr-4 pb-0.5 ${openQuestion === item.id ? 'block' : 'hidden'
                      }`}
                    aria-hidden={openQuestion !== item.id}
                  >
                    {item?.label && (
                      <div
                        className="2xl:text-lg 1xl:text-[17px] sm:text-base text-sm cms-content"
                        dangerouslySetInnerHTML={{
                          __html: formatContent(item?.label),
                        }}
                      />
                    )}
                  </div>
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
