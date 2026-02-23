"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef, useState, useEffect, useMemo } from "react";
import PageLoader from "./common/page-loader/PageLoader";
import BlogComponentsRendererServer from "./BlogComponentsRendererServer";

const SingleBlogPage = ({ data, breadcrumb = [] }) => {
  const [open, setOpen] = useState(false);
  const [headings, setHeadings] = useState([]);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setOpen(!open);
  const inputRef = useRef(null);

  // Extract headings from components for table of contents
  const extractHeadingsFromComponents = (components) => {
    if (!components || components.length === 0) return [];
    
    const headings = [];
    const usedIds = new Set();
    
    components.forEach((component, componentIndex) => {
      // Extract headings from rich-text components
      if (component.__component === "shared.rich-text" && component.body) {
        const lines = component.body.split('\n');
        
        lines.forEach((line) => {
          const trimmed = line.trim();
          const headingMatch = /^(#{1,6})\s+(.+)$/.exec(trimmed);
          if (headingMatch) {
            const level = headingMatch[1].length;
            const text = headingMatch[2].replace(/<[^>]*>/g, '').trim(); // Remove HTML tags
            if (text && text.length > 0) {
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
              
              headings.push({
                id: uniqueId,
                text: text,
                level: level,
                element: `h${level}`,
                type: 'heading'
              });
            }
          }
        });
      }
      
      // Extract FAQ section heading and questions
      if (component.__component === "shared.faq-section" && component.list && Array.isArray(component.list)) {
        // Add the FAQ section heading itself to TOC (always "FAQs" or component.title)
        const faqSectionTitle = (component.title && component.title.trim()) ? component.title.trim() : "FAQs";
        let faqSectionBaseId = faqSectionTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim() || 'faqs';
        let faqSectionId = faqSectionBaseId;
        let faqSectionCounter = 1;
        while (usedIds.has(faqSectionId)) {
          faqSectionId = `${faqSectionBaseId}-${faqSectionCounter}`;
          faqSectionCounter++;
        }
        usedIds.add(faqSectionId);

        headings.push({
          id: faqSectionId,
          text: faqSectionTitle,
          level: 2,
          element: 'h2',
          type: 'faq-section',
          componentIndex: componentIndex
        });
        
        component.list.forEach((faqItem, faqIndex) => {
          if (faqItem.title && faqItem.title.trim()) {
            const faqQuestion = faqItem.title.trim();
            // Generate base ID for FAQ question
            let baseId = faqQuestion.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();
            
            // Ensure uniqueness
            let uniqueId = baseId;
            let counter = 1;
            while (usedIds.has(uniqueId)) {
              uniqueId = `${baseId}-${counter}`;
              counter++;
            }
            usedIds.add(uniqueId);
            
            headings.push({
              id: uniqueId,
              text: faqQuestion,
              level: 3, // FAQ questions are treated as H3 level
              element: 'h3',
              type: 'faq-question',
              componentIndex: componentIndex,
              faqIndex: faqIndex,
              faqId: faqItem.id || `faq-${componentIndex}-${faqIndex}`
            });
          }
        });
      }
    });
    
    return headings;
  };


  // Share functions
  const shareToSocial = (platform) => {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(data?.title || 'Check out this blog post');
    const text = encodeURIComponent(data?.title || 'Check out this blog post');

    let shareUrl = '';

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
        break;
      case 'pinterest':
        shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${title}`;
        break;
      case 'youtube':
        shareUrl = `https://www.youtube.com/redirect?q=${url}`;
        break;
      case 'instagram':
        shareUrl = `https://www.instagram.com/`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${url}`;
        break;
      default:
        return;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setOpen(false); // Close dropdown after opening share window
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      // You could add a toast notification here
      alert('Link copied to clipboard!');
      setOpen(false); // Close dropdown after copying
    });
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  };

  // Calculate reading time based on components content
  const calculateReadingTime = (components) => {
    if (!components || components.length === 0) return "1 min read";
    try {
      const wordsPerMinute = 200;
      let totalWordCount = 0;
      
      components.forEach((component) => {
        if (component.__component === "shared.rich-text" && component.body) {
          totalWordCount += component.body.split(/\s+/).length;
        }
      });
      
      const minutes = Math.ceil(totalWordCount / wordsPerMinute);
      return `${minutes} min read`;
    } catch (error) {
      console.error("Error calculating reading time:", error);
      return "1 min read";
    }
  };


  // Generate table of contents
  const generateTableOfContents = (headings) => {
    if (!headings || headings.length === 0) {
      return (
        <div className="insight-sticky">
          <div className="logo-box">
            {data?.author?.image?.url ? (
              <img
                src={data.author.image.url}
                alt={data?.author?.full_name || "Author"}
                className="w-full h-full object-cover mr-[10px]"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center mr-[10px]">
                <span className="text-gray-600 text-xs font-medium">
                  {(data?.author?.full_name || "A").charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <h3 className="mb-4">{data?.author?.full_name ? `${data.author.full_name}'s Insight` : 'Template Insight'}</h3>
          <div className="global-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <g clipPath="url(#clip0_7849_3720)">
                <path
                  d="M1.66797 10.0003H18.3346M1.66797 10.0003C1.66797 14.6026 5.39893 18.3336 10.0013 18.3336M1.66797 10.0003C1.66797 5.39795 5.39893 1.66699 10.0013 1.66699M18.3346 10.0003C18.3346 14.6026 14.6036 18.3336 10.0013 18.3336M18.3346 10.0003C18.3346 5.39795 14.6036 1.66699 10.0013 1.66699M10.0013 18.3336C12.0857 16.0516 13.2703 13.0903 13.3346 10.0003C13.2703 6.91035 12.0857 3.94895 10.0013 1.66699M10.0013 18.3336C7.91691 16.0516 6.73235 13.0903 6.66797 10.0003C6.73235 6.91035 7.91691 3.94895 10.0013 1.66699"
                  stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </g>
            </svg>
          </div>
          <div className="this-page-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
              <path d="M1 3H12" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 7.75H15" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6 12.75H17" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="p2">On this page</p>
          </div>
          <div className="insight-main-box">
            <p className="text-gray-500 text-sm">No headings found in this content.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="insight-sticky">
        <div className="logo-box">
          {data?.author?.image?.url ? (
            <img
              src={data.author.image.url}
              alt={data?.author?.full_name || "Author"}
              className="w-full h-full object-cover mr-[10px]"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center mr-[10px]">
              <span className="text-gray-600 text-xs font-medium">
                {(data?.author?.full_name || "A").charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
        <h3 className="mb-4">{data?.author?.full_name ? `${data.author.full_name}'s Insight` : 'Template Insight'}</h3>
        <div className="global-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <g clipPath="url(#clip0_7849_3720)">
              <path
                d="M1.66797 10.0003H18.3346M1.66797 10.0003C1.66797 14.6026 5.39893 18.3336 10.0013 18.3336M1.66797 10.0003C1.66797 5.39795 5.39893 1.66699 10.0013 1.66699M18.3346 10.0003C18.3346 14.6026 14.6036 18.3336 10.0013 18.3336M18.3346 10.0003C18.3346 5.39795 14.6036 1.66699 10.0013 1.66699M10.0013 18.3336C12.0857 16.0516 13.2703 13.0903 13.3346 10.0003C13.2703 6.91035 12.0857 3.94895 10.0013 1.66699M10.0013 18.3336C7.91691 16.0516 6.73235 13.0903 6.66797 10.0003C6.73235 6.91035 7.91691 3.94895 10.0013 1.66699"
                stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        </div>
        <div className="sticky top-0 overflow-y-auto max-h-[calc(100vh-100px)] h-full scrollbar-custom">
          <div className="this-page-content">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
              <path d="M1 3H12" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M3 7.75H15" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M6 12.75H17" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="p2 !font-medium !text-black">On this page</p>
          </div>
          <div className="insight-main-box">
            {headings.map((heading, index) => (
              <p
                key={heading.id}
                className={`cursor-pointer hover:text-primary transition-colors p2 ${heading.level === 2 ? 'font-normal' :
                  heading.level === 3 ? 'ml-4 !text-sm' :
                    heading.level >= 4 ? 'ml-6 !text-xs' : ''
                  } ${heading.type === 'faq-question' ? 'text-green-600 font-medium' : ''}`}
                onClick={() => scrollToHeading(heading.id, heading.type)}
              >
                {/* {heading.type === 'faq-question' && (
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                )} */}
                {heading.text}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Scroll to heading function
  const scrollToHeading = (headingId, headingType = 'heading') => {
    let element = null;
    
    if (headingType === 'faq-question') {
      // For FAQ questions, find the specific FAQ item
      const heading = headings.find(h => h.id === headingId);
      
      
      if (heading && heading.faqId) {
        // Method 1: Try to find by specific FAQ ID directly (most reliable)
        const faqItemById = document.getElementById(`faq-item-${heading.faqId}`);
        if (faqItemById) {
          element = faqItemById;
        }
      }
      
      // Method 2: If ID method fails, search all FAQ sections
      if (!element) {
        const faqSections = document.querySelectorAll('.faq-section');
        
        for (let i = 0; i < faqSections.length; i++) {
          const faqSection = faqSections[i];
          const faqItems = faqSection.querySelectorAll('[id^="faq-item-"]');
          
          // Try to find by FAQ ID in this section
          if (heading.faqId) {
            const faqItem = faqSection.querySelector(`#faq-item-${heading.faqId}`);
            if (faqItem) {
              element = faqItem;
              break;
            }
          }
          
          // Try to find by index in this section
          if (!element && heading.faqIndex !== undefined) {
            const faqItem = faqItems[heading.faqIndex];
            if (faqItem) {
              element = faqItem;
              break;
            }
          }
        }
      }
      
      // Method 3: Last resort - search by text content
      if (!element && heading.text) {
        const allFaqItems = document.querySelectorAll('[id^="faq-item-"]');
        
        for (let i = 0; i < allFaqItems.length; i++) {
          const faqItem = allFaqItems[i];
          const questionText = faqItem.querySelector('h3');
          if (questionText && questionText.textContent.trim() === heading.text) {
            element = faqItem;
            break;
          }
        }
      }
    } else if (headingType === 'faq-section') {
      // For FAQ section, first try the section heading ID directly
      element = document.getElementById(headingId);
      if (!element) {
        // Fallback: locate the faq-section wrapper by component index
        const faqElements = document.querySelectorAll('.faq-section');
        const heading = headings.find(h => h.id === headingId);
        if (heading && heading.componentIndex !== undefined) {
          const faqElement = faqElements[heading.componentIndex];
          if (faqElement) {
            element = faqElement;
          }
        }
      }
    } else {
      // For regular headings, use ID
      element = document.getElementById(headingId);
    }
    
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Highlight the heading briefly
      element.style.transition = 'background-color 0.3s ease';
      element.style.backgroundColor = '#fef3c7';
      setTimeout(() => {
        element.style.backgroundColor = '';
      }, 2000);
    } else {
    }
  };


  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  // Extract headings from components on component mount
  useEffect(() => {
    if (data?.components) {
      const extractedHeadings = extractHeadingsFromComponents(data.components);
      setHeadings(extractedHeadings);
    }
  }, [data?.components]);

  // Scroll to top when component mounts or data changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-[1200px]">
        <div className="text-center text-gray-500">No blog data available</div>
      </div>
    );
  }

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

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": data?.title || "Untitled Blog Post",
            "description": data?.excerpt || data?.title || "Check out this blog post",
            "image": data?.image?.url || "",
            "author": {
              "@type": "Person",
              "name": data?.author?.full_name || "Anonymous",
              "image": data?.author?.image?.url || ""
            },
            "publisher": {
              "@type": "Organization",
              "name": "Your Website Name", // Replace with your actual website name
              "logo": {
                "@type": "ImageObject",
                "url": "/logo.png" // Replace with your actual logo URL
              }
            },
            "datePublished": data?.publishedAt || data?.createdAt,
            "dateModified": data?.updatedAt || data?.publishedAt || data?.createdAt,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "" // Will be populated by Next.js router
            },
            "articleBody": data?.components?.map(comp => 
              comp.__component === "shared.rich-text" ? comp.body : ""
            ).filter(Boolean).join(" ") || data?.title || "Check out this blog post",
            "keywords": data?.blog_categories?.map(cat => cat?.title).join(', ') || '',
            "wordCount": data?.components?.reduce((total, comp) => {
              if (comp.__component === "shared.rich-text" && comp.body) {
                return total + comp.body.split(/\s+/).length;
              }
              return total;
            }, 0) || 0
          })
        }}
      />

      <div className="single-post-header">
        <div className="container mx-auto px-4 py-8 max-w-[1200px]">

          <div>
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

          {/* Blog Title */}
          <h1 className="mb-6">{data?.title || "Untitled Blog Post"}</h1>

          {/* Blog Categories */}
          {data?.blog_categories &&
            Array.isArray(data.blog_categories) &&
            data.blog_categories.length > 0 && (
              <div className="tags flex flex-wrap gap-2 mb-6">
                {data.blog_categories.map((category, index) => (
                  <span
                    key={category?.id || index}
                    className="text-primary bg-[#E6EFFB] py-[3px] px-3 rounded-[4px] text-sm"
                  >
                    {category?.title || "Uncategorized"}
                  </span>
                ))}
              </div>
            )}

          {/* Author Info and Meta */}
          <div className="template-info flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Author Image */}
              <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                {data?.author?.image?.url ? (
                  <Image
                    src={data.author.image.url}
                    alt={data?.author?.full_name || "Author"}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 text-xs font-medium">
                      {(data?.author?.full_name || "A").charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Author Name and Meta */}
              <div className="flex flex-row items-start gap-2">
                <h3 className="p2 text-gray-900">
                  {data?.author?.full_name || "Anonymous"}
                </h3>
                <div className="p2 text-gray-500">
                  {/* {console.log(data)} */}
                  {formatDate(data?.custom_publish_date || data?.updatedAt)} •{" "}
                  {calculateReadingTime(data?.components)}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center 1xl:gap-[15px] sm:gap-2">
              <div className="relative flex text-left" ref={dropdownRef}>
                <button
                  onClick={toggleDropdown}
                  className="inline-flex items-center 1xl:gap-2 btn btn-primary focus:outline-none mr-2 after-login-btn !rounded-full !overflow-hidden"
                >
                  {/* User Icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      d="M14.6654 8.50016V11.6113C14.6654 12.8559 14.6654 13.4781 14.4231 13.9535C14.2101 14.3716 13.8702 14.7115 13.452 14.9246C12.9767 15.1668 12.3544 15.1668 11.1098 15.1668H4.88759C3.64303 15.1668 3.02074 15.1668 2.54539 14.9246C2.12725 14.7115 1.78729 14.3716 1.57424 13.9535C1.33203 13.4781 1.33203 12.8559 1.33203 11.6113V8.50016M10.9616 4.79646L7.9987 1.8335M7.9987 1.8335L5.03574 4.79646M7.9987 1.8335V10.7224"
                      stroke="currentColor"
                      strokeWidth="1.33333"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Share
                </button>

                {/* Dropdown menu */}
                {open && (
                  <div
                    className="absolute login-dropdown-menu bg-white border border-primary/10 before:border-primary/10 before:border shadow-dropDown before:z-0 rounded-md z-10
                            before:content-[''] before:absolute before:top-[-8px] before:right-[10%] before:w-[13px] before:h-4 before:bg-white before:rotate-45 before:shadow-md before:rounded-sm"
                  >
                    <div className="z-20 relative xl:w-[12.5rem] md:w-[11rem] w-[10rem] origin-top-right rounded-md bg-white overflow-hidden">
                      <ul className="divide-y divide-primary/10 w-full">
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M8 2C6.89543 2 6 2.89543 6 4V6H4C2.89543 6 2 6.89543 2 8V16C2 17.1046 2.89543 18 4 18H12C13.1046 18 14 17.1046 14 16V14H16C17.1046 14 18 13.1046 18 12V4C18 2.89543 17.1046 2 16 2H8ZM12 4H16V12H14V8C14 6.89543 13.1046 6 12 6V4ZM4 8H12V16H4V8Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Copy Link
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('facebook')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M7.25884 19.2969H11.1733V11.4582H14.7003L15.0878 7.56326H11.1733V5.59623C11.1733 5.33669 11.2764 5.08777 11.46 4.90424C11.6435 4.72072 11.8924 4.61761 12.1519 4.61761H15.0878V0.703125H12.1519C10.8542 0.703125 9.60963 1.21865 8.692 2.13628C7.77436 3.05392 7.25884 4.2985 7.25884 5.59623V7.56326H5.3016L4.91406 11.4582H7.25884V19.2969Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Facebook
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('twitter')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M19.0753 4.77712C18.4072 5.08077 17.6872 5.28031 16.941 5.37574C17.7045 4.91593 18.2945 4.18718 18.5721 3.31094C17.852 3.74472 17.0538 4.04837 16.2123 4.22188C15.5269 3.47578 14.5639 3.04199 13.4708 3.04199C11.432 3.04199 9.76628 4.70772 9.76628 6.76385C9.76628 7.05882 9.80098 7.34512 9.86171 7.61406C6.77318 7.4579 4.02299 5.97436 2.19243 3.72737C1.87143 4.27394 1.68924 4.91593 1.68924 5.59264C1.68924 6.88531 2.33991 8.0305 3.34629 8.68117C2.73032 8.68117 2.15773 8.50766 1.65454 8.24739V8.27341C1.65454 10.078 2.93853 11.5875 4.63896 11.9259C4.09312 12.0759 3.51984 12.0967 2.96456 11.9866C3.2002 12.7262 3.66168 13.3733 4.28414 13.8371C4.9066 14.3008 5.65874 14.5578 6.43483 14.5719C5.11931 15.6135 3.48858 16.1764 1.8107 16.1683C1.51573 16.1683 1.22075 16.1509 0.925781 16.1162C2.57416 17.1746 4.53486 17.7906 6.63437 17.7906C13.4708 17.7906 17.2273 12.1167 17.2273 7.19763C17.2273 7.0328 17.2273 6.87663 17.2187 6.7118C17.9474 6.19126 18.5721 5.53191 19.0753 4.77712Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Twitter
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('pinterest')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M9.21159 13.2279C8.70053 15.9812 8.07836 18.6213 6.23205 20C5.66341 15.8387 7.06935 12.7127 7.72182 9.39485C6.60879 7.46572 7.85615 3.58222 10.2034 4.5387C13.0921 5.71638 7.70162 11.7118 11.3205 12.4613C15.099 13.243 16.6423 5.71133 14.299 3.26103C10.9135 -0.275028 4.44433 3.18124 5.24022 8.24444C5.43414 9.48272 6.67545 9.85845 5.73613 11.5674C3.56965 11.0715 2.92324 9.31203 3.00708 6.96576C3.1404 3.12771 6.35729 0.439052 9.58328 0.0673668C13.6637 -0.4033 17.4927 1.60966 18.0209 5.56184C18.6168 10.0221 16.1797 14.854 11.8174 14.5055C10.6347 14.4116 10.1378 13.8086 9.21159 13.2279Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Pinterest
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('youtube')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <g clipPath="url(#clip0_8077_5205)">
                                <path
                                  d="M8.05099 13.0823L13.2741 10.0632L8.05099 7.04405V13.0823ZM19.6847 5.20238C19.8155 5.67538 19.9061 6.3094 19.9664 7.11449C20.0369 7.91959 20.0671 8.61399 20.0671 9.21781L20.1275 10.0632C20.1275 12.2671 19.9664 13.8874 19.6847 14.924C19.4331 15.8297 18.8494 16.4134 17.9436 16.665C17.4706 16.7958 16.6052 16.8864 15.2767 16.9468C13.9685 17.0172 12.7709 17.0474 11.6639 17.0474L10.0637 17.1078C5.84703 17.1078 3.22039 16.9468 2.18383 16.665C1.27809 16.4134 0.694398 15.8297 0.442804 14.924C0.311976 14.451 0.221402 13.8169 0.16102 13.0118C0.0905737 12.2067 0.0603823 11.5123 0.0603823 10.9085L0 10.0632C0 7.85921 0.16102 6.23895 0.442804 5.20238C0.694398 4.29665 1.27809 3.71295 2.18383 3.46136C2.65683 3.33053 3.52231 3.23996 4.85072 3.17957C6.159 3.10913 7.35659 3.07894 8.4636 3.07894L10.0637 3.01855C14.2804 3.01855 16.9071 3.17957 17.9436 3.46136C18.8494 3.71295 19.4331 4.29665 19.6847 5.20238Z"
                                  fill="#0043A2"
                                />
                              </g>
                            </svg>
                            Youtube
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('instagram')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M6.5013 1.66602H13.5013C16.168 1.66602 18.3346 3.83268 18.3346 6.49935V13.4993C18.3346 14.7812 17.8254 16.0106 16.919 16.917C16.0126 17.8235 14.7832 18.3327 13.5013 18.3327H6.5013C3.83464 18.3327 1.66797 16.166 1.66797 13.4993V6.49935C1.66797 5.21747 2.17719 3.98809 3.08362 3.08167C3.99004 2.17524 5.21942 1.66602 6.5013 1.66602ZM6.33463 3.33268C5.53899 3.33268 4.77592 3.64875 4.21331 4.21136C3.65071 4.77397 3.33464 5.53703 3.33464 6.33268V13.666C3.33464 15.3243 4.6763 16.666 6.33463 16.666H13.668C14.4636 16.666 15.2267 16.3499 15.7893 15.7873C16.3519 15.2247 16.668 14.4617 16.668 13.666V6.33268C16.668 4.67435 15.3263 3.33268 13.668 3.33268H6.33463ZM14.3763 4.58268C14.6526 4.58268 14.9175 4.69243 15.1129 4.88778C15.3082 5.08313 15.418 5.34808 15.418 5.62435C15.418 5.90062 15.3082 6.16557 15.1129 6.36092C14.9175 6.55627 14.6526 6.66601 14.3763 6.66601C14.1 6.66601 13.8351 6.55627 13.6397 6.36092C13.4444 6.16557 13.3346 5.90062 13.3346 5.62435C13.3346 5.34808 13.4444 5.08313 13.6397 4.88778C13.8351 4.69243 14.1 4.58268 14.3763 4.58268ZM10.0013 5.83268C11.1064 5.83268 12.1662 6.27167 12.9476 7.05307C13.729 7.83447 14.168 8.89428 14.168 9.99935C14.168 11.1044 13.729 12.1642 12.9476 12.9456C12.1662 13.727 11.1064 14.166 10.0013 14.166C8.89623 14.166 7.83642 13.727 7.05502 12.9456C6.27362 12.1642 5.83463 11.1044 5.83463 9.99935C5.83463 8.89428 6.27362 7.83447 7.05502 7.05307C7.83642 6.27167 8.89623 5.83268 10.0013 5.83268ZM10.0013 7.49935C9.33826 7.49935 8.70237 7.76274 8.23353 8.23158C7.76469 8.70042 7.5013 9.33631 7.5013 9.99935C7.5013 10.6624 7.76469 11.2983 8.23353 11.7671C8.70237 12.236 9.33826 12.4993 10.0013 12.4993C10.6643 12.4993 11.3002 12.236 11.7691 11.7671C12.2379 11.2983 12.5013 10.6624 12.5013 9.99935C12.5013 9.33631 12.2379 8.70042 11.7691 8.23158C11.3002 7.76274 10.6643 7.49935 10.0013 7.49935Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Instagram
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('linkedin')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M9.21159 13.2279C8.70053 15.9812 8.07836 18.6213 6.23205 20C5.66341 15.8387 7.06935 12.7127 7.72182 9.39485C6.60879 7.46572 7.85615 3.58222 10.2034 4.5387C13.0921 5.71638 7.70162 11.7118 11.3205 12.4613C15.099 13.243 16.6423 5.71133 14.299 3.26103C10.9135 -0.275028 4.44433 3.18124 5.24022 8.24444C5.43414 9.48272 6.67545 9.85845 5.73613 11.5674C3.56965 11.0715 2.92324 9.31203 3.00708 6.96576C3.1404 3.12771 6.35729 0.439052 9.58328 0.0673668C13.6637 -0.4033 17.4927 1.60966 18.0209 5.56184C18.6168 10.0221 16.1797 14.854 11.8174 14.5055C10.6347 14.4116 10.1378 13.8086 9.21159 13.2279Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Linkedin
                          </button>
                        </li>
                        <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                          <button
                            onClick={() => shareToSocial('whatsapp')}
                            className="flex items-center gap-[14px] text-black group-hover:text-primary p2 w-full text-left"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 20 20"
                              fill="none"
                            >
                              <path
                                d="M10.5156 0.637695C15.4022 0.637695 19.3633 4.59879 19.3633 9.48534C19.3633 14.3719 15.4022 18.333 10.5156 18.333C8.95203 18.3357 7.41593 17.9219 6.06526 17.1341L1.67152 18.333L2.86772 13.9375C2.07936 12.5864 1.66524 11.0496 1.66798 9.48534C1.66798 4.59879 5.62908 0.637695 10.5156 0.637695ZM7.50035 5.32695L7.3234 5.33403C7.20899 5.34191 7.09721 5.37196 6.99427 5.4225C6.89834 5.47693 6.81073 5.54487 6.73415 5.62423C6.62797 5.72421 6.56781 5.81092 6.50322 5.89497C6.17597 6.32046 5.99977 6.84283 6.00245 7.3796C6.00422 7.81314 6.11747 8.23517 6.29442 8.62978C6.65629 9.42784 7.25173 10.2728 8.03741 11.0558C8.22674 11.2443 8.41255 11.4336 8.6125 11.6097C9.58878 12.4691 10.7521 13.089 12.01 13.4199L12.5125 13.4969C12.6762 13.5057 12.8399 13.4933 13.0045 13.4854C13.2621 13.4718 13.5137 13.402 13.7415 13.281C13.8573 13.2211 13.9703 13.1562 14.0804 13.0863C14.0804 13.0863 14.1178 13.061 14.1909 13.0067C14.3104 12.9182 14.3838 12.8554 14.4829 12.7519C14.5572 12.6752 14.6192 12.5862 14.6687 12.4847C14.7377 12.3405 14.8067 12.0653 14.8351 11.8362C14.8563 11.661 14.8501 11.5654 14.8474 11.5061C14.8439 11.4115 14.7652 11.3133 14.6793 11.2717L14.1644 11.0408C14.1644 11.0408 13.3947 10.7054 12.924 10.4913C12.8747 10.4699 12.8219 10.4576 12.7682 10.455C12.7077 10.4487 12.6465 10.4555 12.5888 10.4749C12.5311 10.4942 12.4782 10.5258 12.4338 10.5674C12.4294 10.5656 12.3701 10.6161 11.7304 11.3911C11.6937 11.4405 11.6431 11.4778 11.5851 11.4982C11.5272 11.5187 11.4644 11.5215 11.4048 11.5061C11.3472 11.4908 11.2907 11.4713 11.2358 11.4478C11.1261 11.4017 11.0881 11.3841 11.0129 11.3522C10.5049 11.1309 10.0347 10.8315 9.61937 10.4648C9.50788 10.3675 9.40437 10.2613 9.2982 10.1587C8.95014 9.82528 8.64679 9.44817 8.39573 9.03677L8.34353 8.95272C8.30661 8.89591 8.27633 8.83505 8.25329 8.77134C8.21967 8.64128 8.30726 8.53688 8.30726 8.53688C8.30726 8.53688 8.52226 8.30153 8.62223 8.17412C8.71956 8.05026 8.80184 7.92993 8.85493 7.84411C8.95933 7.676 8.99207 7.50347 8.93721 7.36987C8.68948 6.76469 8.43349 6.16276 8.16924 5.56407C8.11703 5.44551 7.9622 5.36057 7.82152 5.34376C7.77375 5.33786 7.72597 5.33314 7.67819 5.3296C7.55939 5.32279 7.44027 5.32397 7.32163 5.33314L7.50035 5.32695Z"
                                fill="#0043A2"
                              />
                            </svg>
                            Whatsapp
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {data?.image?.url && (
            <div className="mb-8">
              <Image
                src={data.image.url}
                alt={
                  data?.image?.alternativeText ||
                  `${data?.title || 'Blog post'} featured image`
                }
                width={800}
                height={400}
                className="w-full h-auto rounded-lg object-cover"
                priority={true}
                loading="eager"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )}

          {/* Blog Content with Table of Contents */}
          <div className="single-blog">
            <div className="content-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="left-content lg:col-span-2">
                {data?.components && (
                  <BlogComponentsRendererServer components={data.components} />
                )}
              </div>

              {/* Sidebar with Table of Contents */}
              <div className="right-content sticky -top-24 lg:col-span-1">
                {generateTableOfContents(headings)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleBlogPage;
