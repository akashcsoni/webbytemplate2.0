import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react'

const ChevronIcon = () => (
    <span className="mx-2 text-[#505050]">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                fill="#505050"
            />
        </svg>
    </span>
);

const CategoryHome = ({
    title = '',
    search = false,
    description = '',
    breadcrumb = []
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = () => {
        if (searchTerm.trim()) {
            const searchParams = new URLSearchParams();
            searchParams.set('term', searchTerm.trim());
            router.push(`${pathname}?${searchParams.toString()}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const formatContent = (content) => {
        if (!content) return "";
    
        const lines = content.split("\n");
        let result = "";
        let listBuffer = [];
        let blockquoteBuffer = [];
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
    
        const parseInlineMarkdown = (text) => {
          // Store for link placeholders
          const linkPlaceholders = [];
          let linkCounter = 0;
          
          // First, extract and protect HTML links <a href="..." ...>...</a>
          // This preserves existing HTML links with their attributes (like rel="nofollow")
          let processedText = text.replace(/<a\s+([^>]+)>([^<]*)<\/a>/gi, (match, attributes, linkText) => {
            const placeholder = `HTMLINKPLACEHOLDER${linkCounter}HTMLINKPLACEHOLDER`;
            linkPlaceholders.push({
              placeholder,
              linkText,
              attributes,
              isHtml: true
            });
            linkCounter++;
            return placeholder;
          });
          
          // Then, extract and protect markdown links [text](url)
          // This prevents URLs from being processed by markdown formatting
          // Use a placeholder format that won't be affected by markdown (no _, *, ~, etc.)
          processedText = processedText.replace(/\[(.*?)\]\((.*?)\)/g, (match, linkText, linkUrl) => {
            const placeholder = `LINKPLACEHOLDER${linkCounter}LINKPLACEHOLDER`;
            linkPlaceholders.push({
              placeholder,
              linkText,
              linkUrl,
              isHtml: false
            });
            linkCounter++;
            return placeholder;
          });
          
          // Now process markdown formatting on the remaining text
          // URLs are already protected in placeholders, so we can safely process markdown
          processedText = processedText
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")     // bold (**) 
            .replace(/__(.*?)__/g, "<strong>$1</strong>")         // bold (__)
            .replace(/\*(.*?)\*/g, "<em>$1</em>")                 // italic (*)
            .replace(/_(.*?)_/g, "<em>$1</em>")                    // italic (_) - safe because URLs are already extracted
            .replace(/~~(.*?)~~/g, "<del>$1</del>");               // strikethrough
          
          // Restore links with their original URLs intact
          linkPlaceholders.forEach(({ placeholder, linkText, linkUrl, attributes, isHtml }) => {
            if (isHtml) {
              // For HTML links, preserve the original attributes and restore the link
              // Process markdown in link text if needed
              let protectedLinkText = linkText;
              
              // Protect URLs in link text before processing markdown
              const urlPlaceholders = [];
              let urlCounter = 0;
              protectedLinkText = protectedLinkText.replace(/(https?:\/\/[^\s\)]+|www\.[^\s\)]+)/gi, (url) => {
                const urlPlaceholder = `URLPLACEHOLDER${urlCounter}URLPLACEHOLDER`;
                urlPlaceholders.push({ placeholder: urlPlaceholder, url });
                urlCounter++;
                return urlPlaceholder;
              });
              
              // Process markdown in link text (URLs are protected)
              protectedLinkText = protectedLinkText
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/__(.*?)__/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/_(.*?)_/g, "<em>$1</em>");
              
              // Restore URLs in link text
              urlPlaceholders.forEach(({ placeholder: urlPlaceholder, url }) => {
                protectedLinkText = protectedLinkText.split(urlPlaceholder).join(url);
              });
              
              const linkHtml = `<a ${attributes}>${protectedLinkText}</a>`;
              processedText = processedText.replace(placeholder, linkHtml);
            } else {
              // For markdown links, convert to HTML with default attributes
              // Protect URLs in link text before processing markdown
              const urlPlaceholders = [];
              let urlCounter = 0;
              
              // Extract URLs from link text (http://, https://, www.)
              let protectedLinkText = linkText.replace(/(https?:\/\/[^\s\)]+|www\.[^\s\)]+)/gi, (url) => {
                const urlPlaceholder = `URLPLACEHOLDER${urlCounter}URLPLACEHOLDER`;
                urlPlaceholders.push({ placeholder: urlPlaceholder, url });
                urlCounter++;
                return urlPlaceholder;
              });
              
              // Process markdown in link text (URLs are protected)
              protectedLinkText = protectedLinkText
                .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                .replace(/__(.*?)__/g, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/g, "<em>$1</em>")
                .replace(/_(.*?)_/g, "<em>$1</em>");
              
              // Restore URLs in link text
              urlPlaceholders.forEach(({ placeholder: urlPlaceholder, url }) => {
                protectedLinkText = protectedLinkText.split(urlPlaceholder).join(url);
              });
              
              const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${protectedLinkText}</a>`;
              processedText = processedText.replace(placeholder, linkHtml);
            }
          });
          
          return processedText;
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
            const level = headingMatch[1].length; // count of "#"
            const text = parseInlineMarkdown(headingMatch[2]);
            const headingId = generateHeadingId(headingMatch[2]);
            result += `<h${level} id="${headingId}">${text}</h${level}>`;
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

    return (
        <main className="lg:py-12 md:py-10 py-8">
            {/* Breadcrumb Navigation */}
            <div className="container">
                {Array.isArray(breadcrumb) && breadcrumb.length > 0 && (
                    <nav className="flex items-center text-sm mb-[14px]">
                        {breadcrumb.map((item, index) => (
                            <React.Fragment key={item?.id || index}>
                                {index > 0 && <ChevronIcon />}
                                {item?.visible ? (
                                    <Link
                                        href={item.slug || '#'}
                                        className="text-[#0156d5] hover:underline"
                                    >
                                        {item.title || 'Untitled'}
                                    </Link>
                                ) : (
                                    <span className="text-[#505050]">
                                        {item.title || 'Untitled'}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </nav>
                )}
            </div>

            {/* Page Heading */}
            <div className="container mb-2">
                {title && <h1 className="h2 lg:mb-[18px] mb-3">{title}</h1>}

                {/* Search Bar */}
                {search && (
                    <div className="relative flex items-center lg:mb-8 sm:mb-6 mb-4 border border-gray-100 rounded-[5px] overflow-hidden">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Search for mockups, Web Templates and More....."
                            className="w-full rounded-l px-4 outline-none lg:h-10 h-9 p2"
                        />
                        <button
                            onClick={handleSearch}
                            className="!bg-primary text-white lg:py-3 py-2.5 px-[18px] rounded-r flex items-center justify-center"
                        >
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
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.3-4.3"></path>
                            </svg>
                        </button>
                    </div>
                )}
                {/* Description Text */}
                {
                    description && (
                        <div
                            className="2xl:text-lg 1xl:text-[17px] sm:text-base text-sm cms-content"
                            dangerouslySetInnerHTML={{
                                __html: formatContent(description),
                            }}
                        />
                    )
                }
            </div>
        </main>
    );
};

export default CategoryHome;
