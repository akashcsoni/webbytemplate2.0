"use client";

import { useState, useEffect, useMemo } from "react";

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

    const formatContent = useMemo(() => (content) => {
        if (!content) return "";

        const lines = content.split("\n");
        let result = "";
        let listBuffer = [];
        let blockquoteBuffer = [];
        let tableBuffer = [];
        let paragraphBuffer = [];
        let inTable = false;
        const usedIds = new Set(); // Track used IDs to ensure uniqueness

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

        const flushTable = () => {
            if (tableBuffer.length) {
                result += "<table>" + tableBuffer.join("") + "</table>";
                tableBuffer = [];
                inTable = false;
            }
        };

        const flushParagraph = () => {
            if (paragraphBuffer.length) {
                const paragraphText = paragraphBuffer.join(" ").trim();
                if (paragraphText) {
                    result += `<p>${parseInlineMarkdown(paragraphText)}</p>`;
                }
                paragraphBuffer = [];
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

        const generateHeadingId = (text) => {
            // Generate base ID
            let baseId = text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();

            // Ensure uniqueness
            let uniqueId = baseId;
            let counter = 1;
            while (usedIds.has(uniqueId)) {
                uniqueId = `${baseId}-${counter}`;
                counter++;
            }
            usedIds.add(uniqueId);

            return uniqueId;
        };

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            
            // Handle empty lines - flush any pending content
            if (!trimmed) {
                flushList();
                flushBlockquote();
                flushTable();
                flushParagraph();
                return;
            }

            // Check for table start/end comments
            if (trimmed.includes("<!-- table start -->")) {
                flushList();
                flushBlockquote();
                flushTable();
                flushParagraph();
                inTable = true;
                return;
            }
            
            if (trimmed.includes("<!-- end start -->") || trimmed.includes("<!-- end -->")) {
                flushTable();
                return;
            }

            // Handle table rows when in table mode
            if (inTable && trimmed.includes("<table>")) {
                // Skip the opening table tag as we handle it in flushTable
                return;
            }

            if (inTable && trimmed.includes("</table>")) {
                // Skip the closing table tag as we handle it in flushTable
                return;
            }

            if (inTable) {
                // Process table content directly
                tableBuffer.push(trimmed);
                return;
            }

            // Blockquote lines (group contiguous '>' lines)
            if (/^>\s?/.test(trimmed)) {
                flushList(); // end any open list before blockquote
                flushTable();
                flushParagraph();
                const inner = trimmed.replace(/^>\s?/, "");
                // support headings inside blockquote
                const headingMatchBQ = /^(#{1,6})\s+(.+)$/.exec(inner);
                if (headingMatchBQ) {
                    const level = headingMatchBQ[1].length;
                    const text = parseInlineMarkdown(headingMatchBQ[2]);
                    const headingId = generateHeadingId(headingMatchBQ[2]);
                    blockquoteBuffer.push(`<h${level} id="${headingId}">${text}</h${level}>`);
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
                flushTable();
                flushParagraph();
                const level = headingMatch[1].length; // count of "#"
                const text = parseInlineMarkdown(headingMatch[2]);
                const headingId = generateHeadingId(headingMatch[2]);
                result += `<h${level} id="${headingId}">${text}</h${level}>`;
                return;
            }

            // Lists
            if (/^[-*]\s+/.test(trimmed)) {
                flushTable();
                flushParagraph();
                listBuffer.push(parseInlineMarkdown(trimmed.replace(/^[-*]\s+/, "")));
            }

            // Regular text - add to paragraph buffer
            else {
                flushList();
                flushBlockquote();
                flushTable();
                paragraphBuffer.push(trimmed);
            }
        });

        flushList();
        flushBlockquote();
        flushTable();
        flushParagraph();
        
        // Debug: Log the final HTML output
        console.log("Generated HTML:", result);
        
        return result;
    }, []);

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
                            dangerouslySetInnerHTML={{ __html: formatContent(displayContent) }}
                        />
                        <div className="relative z-10">
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
