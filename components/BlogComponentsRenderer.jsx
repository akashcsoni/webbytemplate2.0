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
      className="w-full h-auto rounded-lg object-cover"
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
        <Link 
          href={`/product/${product.slug}`}
          className="block hover:opacity-90 transition-opacity duration-200"
        >
          <div className="w-full">
            {imageElement}
          </div>
        </Link>
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


export default BlogComponentsRenderer;
