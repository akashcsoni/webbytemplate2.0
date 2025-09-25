"use client";

import React, { useState, useMemo } from "react";
import FaqSection from "../components/pageSections/FaqSection";
import ReviewList from "./product/review-list";

// Tabs configuration
const tabs = [
  { key: "overview", title: "Overview" },
  { key: "reviews", title: "Reviews" },
  { key: "changelog", title: "Changelog" },
  { key: "faq", title: "FAQ" },
];

// Utility to format content: handles plain text + HTML safely
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

const SinglePageTab = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  // Render all content for SEO - all tabs are always in HTML
  const renderAllContent = () => {
    return (
      <>
        {/* Overview Tab Content */}
        <div className={`tab-content ${activeTab === "overview" ? "block" : "hidden"}`}>
          {data?.overview_description ? (
            <div
              className="space-y-4 product-overview"
              dangerouslySetInnerHTML={{
                __html: formatContent(data.overview_description),
              }}
            />
          ) : (
            <p>An overview for this item is currently unavailable.</p>
          )}
        </div>

        {/* Reviews Tab Content */}
        <div className={`tab-content ${activeTab === "reviews" ? "block" : "hidden"}`}>
          {data?.slug ? (
            <div className="sm:space-y-8 space-y-4">
              <ReviewList slug={data.slug} />
            </div>
          ) : (
            <p>
              No reviews have been submitted yet. Be the first to share your
              experience!
            </p>
          )}
        </div>

        {/* Changelog Tab Content */}
        <div className={`tab-content ${activeTab === "changelog" ? "block" : "hidden"}`}>
          {Array.isArray(data?.changelogs) && data.changelogs.length > 0 ? (
            <div className="space-y-5">
              {data.changelogs.map((entry, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-bold text-primary">
                      {entry?.version || "v?"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {entry?.date || "Unknown date"}
                    </p>
                  </div>
                  <p className="bg-blue-300 w-full px-3 py-1 rounded border border-primary/10 font-mono text-sm text-black tracking-normal">
                    - {entry?.note || "No notes provided."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No changelog has been published yet.</p>
          )}
        </div>

        {/* FAQ Tab Content */}
        <div className={`tab-content ${activeTab === "faq" ? "block" : "hidden"}`}>
          {data?.faq?.length > 0 ? (
            <FaqSection list={data.faq} type="full" />
          ) : (
            <p>There are no frequently asked questions at the moment.</p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-primary/10 overflow-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 transition-all duration-200 border-b-2 ${activeTab === tab.key
              ? "border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600 border-transparent"
              } bg-transparent`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="sm:mt-6 mt-3 space-y-6">{renderAllContent()}</div>
    </div>
  );
};

export default SinglePageTab;
