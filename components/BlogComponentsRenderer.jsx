"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import BlogFaqSection from "./BlogFaqSection";

const BlogComponentsRenderer = ({ components = [] }) => {
  if (!components || components.length === 0) {
    return null;
  }

  const renderComponent = (component, index) => {
    const { __component, id } = component;

    switch (__component) {
      case "shared.rich-text":
        return (
          <RichTextComponent
            key={`rich-text-${id || index}`}
            data={component}
          />
        );

      case "shared.single-blog-image":
        return (
          <SingleBlogImageComponent
            key={`single-blog-image-${id || index}`}
            data={component}
          />
        );

      case "shared.faq-section":
        return (
          <BlogFaqSection
            key={`faq-section-${component.id || index}`}
            list={component.list}
            type="full"
          />
        );

      case "shared.link-thumbnail-preview":
        return (
          <LinkThumbnailPreviewComponent
            key={`link-thumbnail-preview-${id || index}`}
            data={component}
          />
        );

      default:
        console.warn(`Unknown component type: ${__component}`);
        return null;
    }
  };

  return (
    <div className="blog-components">
      {components.map((component, index) => renderComponent(component, index))}
    </div>
  );
};

// Rich Text Component
const RichTextComponent = ({ data }) => {
  const { body, with_bg } = data;

  if (!body) return null;

  // Format content function for markdown-like formatting
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
    <div className={`prose mb-6 ${with_bg ? 'bg-gray-50 p-6 rounded-lg' : ''}`}>
      <div
        dangerouslySetInnerHTML={{
          __html: formatContent(body),
        }}
      />
    </div>
  );
};

// Single Blog Image Component
const SingleBlogImageComponent = ({ data }) => {
  const { image, product } = data;

  if (!image?.url) return null;

  const imageElement = (
    <Image
      src={image.url}
      alt={image.alternativeText || image.name || "Blog image"}
      width={image.width || 800}
      height={image.height || 400}
      className="w-full h-auto rounded-lg object-cover !p-0 !m-0"
      priority={false}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
    />
  );

  return (
    <div className="mb-6">
      {product?.slug ? (
        <span
          className="block relative group overflow-hidden rounded-lg !w-full !bg-[#E6EFFB] border border-primary/10 shadow-sm p-4 hover:shadow-md transition-shadow"
        >
          <div className="relative">
            {imageElement}
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-center">
                {/* <div className="bg-white px-4 py-2 rounded-md mb-2">
               <span className="text-black font-semibold text-sm">LIVE THEME</span>
               <span className="ml-1 text-black">↗</span>
             </div> */}
                <div className="bg-primary px-6 py-2 rounded-md">
                  <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-white font-bold text-sm uppercase">Details</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </span>
      ) : (
        imageElement
      )}
      {image.caption && (
        <p className="text-sm text-gray-600 mt-2 text-center italic">
          {image.caption}
        </p>
      )}
    </div>
  );
};

// Link Thumbnail Preview Component
const LinkThumbnailPreviewComponent = ({ data }) => {
  const { link } = data;

  if (!link) return null;

  // Generate thum.io thumbnail URL
  const getThumbnailUrl = (url) => {
    try {
      return `https://image.thum.io/get/${url}`;
    } catch (error) {
      return null;
    }
  };

  const thumbnailUrl = getThumbnailUrl(link);

  return (
    <div className="mb-6">
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block group relative overflow-hidden rounded-lg bg-white border border-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
        style={{ width: '815px', maxWidth: '100%', aspectRatio: '815/457' }}
      >
        {thumbnailUrl && (
          <div className="relative w-full" style={{ aspectRatio: '815/457', height: 'auto' }}>
            <img
              src={thumbnailUrl}
              alt={`Preview of ${link}`}
              className="w-full h-full object-contain"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              width={815}
              height={457}
              loading="lazy"
              onError={(e) => {
                // Fallback if image fails to load
                e.target.style.display = 'none';
              }}
            />
            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-primary px-4 py-2 rounded-md">
                  <span className="text-white font-medium text-sm">Visit Site</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </a>
    </div>
  );
};


export default BlogComponentsRenderer;
