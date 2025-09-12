"use client";

import { useState, useEffect } from "react";

export default function RichText({ body, read_more, with_bg }) {

    const [isExpanded, setIsExpanded] = useState(false);
    const [displayContent, setDisplayContent] = useState(body);
    const [showToggle, setShowToggle] = useState(false);
    const [characterLimit, setCharacterLimit] = useState(2000);

    // Determine limit based on screen size
    const calculateCharacterLimit = () => {
        const width = window.innerWidth;
        if (width < 640) return 600; // mobile
        if (width <= 1024) return 1100; // tablet
        if (width >= 1023) return 1200; // tablet
        return 2000; // desktop
    };

    useEffect(() => {
        const handleResize = () => {
            setCharacterLimit(calculateCharacterLimit());
        };

        handleResize(); // initial run
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        // Only apply read more/less if the flag is true
        const shouldTruncate = read_more;

        // Create a temporary div to strip HTML and count characters
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = body;
        const textContent = tempDiv.textContent || tempDiv.innerText;
        const isLongContent = textContent.length > characterLimit;


        // Only show the toggle if content is long enough and read_more is true
        setShowToggle(shouldTruncate && isLongContent);

        // Function to truncate HTML content
        const truncateHTML = (html, limit) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = html;

            let charCount = 0;
            let result = "";

            // Process each child node
            const processNode = (node) => {
                if (charCount >= limit) return false;

                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent || "";
                    const remainingChars = limit - charCount;

                    if (charCount + text.length <= limit) {
                        result += text;
                        charCount += text.length;
                        return true;
                    } else {
                        result += text.substring(0, remainingChars) + "...";
                        charCount += remainingChars;
                        return false;
                    }
                }

                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node;
                    const tagName = element.tagName.toLowerCase();
                    const openTag = `<${tagName}${Array.from(element.attributes)
                        .map((attr) => ` ${attr.name}="${attr.value}"`)
                        .join("")}>`;

                    result += openTag;

                    let allChildrenProcessed = true;
                    for (const child of Array.from(element.childNodes)) {
                        if (!processNode(child)) {
                            allChildrenProcessed = false;
                            break;
                        }
                    }

                    result += `</${tagName}>`;
                    return allChildrenProcessed;
                }

                return true;
            };

            for (const child of Array.from(tempDiv.childNodes)) {
                if (!processNode(child)) break;
            }

            return result;
        };

        // Get the display content based on expanded state and read_more flag
        if (shouldTruncate && !isExpanded && isLongContent) {
            setDisplayContent(truncateHTML(body, characterLimit));
        } else {
            setDisplayContent(body);
        }
    }, [body, read_more, characterLimit, isExpanded]);

    return (
        <section className="xl:py-[35px] sm:py-[30px] py-5 RichText">
            <div className="cms-content" >
                <div className={(with_bg === true || with_bg === null) ? "bg-blue-300" : null}>
                    <div className={(with_bg === true || with_bg === null) ? "rich-text container 2xl:py-[60px] xl:py-[50px] md:py-[45px] sm:py-9 py-7" : "rich-text container"}>
                        <div
                            className="prose mb-4"
                            dangerouslySetInnerHTML={{ __html: displayContent }}
                        />
                        <div className="relative z-50">
                            {showToggle && (
                                <button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className={`inline-flex items-end text-primary font-medium hover:underline absolute inset-x-0 bottom-0 transition-all duration-300 underline-offset-4 ${!isExpanded
                                        ? "bg-gradient-to-t from-blue-300 via-blue-300/80 to-transparent h-32"
                                        : "relative h-full"
                                        }`}
                                >
                                    <span className="flex items-center">
                                        {isExpanded ? (
                                            <>
                                                <p className="text-primary !m-0">Read less</p>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="ml-1 h-4 w-4"
                                                >
                                                    <path d="m18 15-6-6-6 6" />
                                                </svg>
                                            </>
                                        ) : (
                                            <>
                                                Read more
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="ml-1 h-4 w-4"
                                                >
                                                    <path d="m6 9 6 6 6-6" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
