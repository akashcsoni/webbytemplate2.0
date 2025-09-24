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

  const flushList = () => {
    if (listBuffer.length) {
      result += "<ul>" + listBuffer.map(li => `<li>${li}</li>`).join("") + "</ul>";
      listBuffer = [];
    }
  };

  const parseInlineMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") // bold
      .replace(/\*(.*?)\*/g, "<em>$1</em>");           // italic
  };

  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }

    // Headings
    if (/^###\s+/.test(trimmed)) {
      flushList();
      result += `<h3>${parseInlineMarkdown(trimmed.replace(/^###\s+/, ""))}</h3>`;
    } else if (/^##\s+/.test(trimmed)) {
      flushList();
      result += `<h2>${parseInlineMarkdown(trimmed.replace(/^##\s+/, ""))}</h2>`;
    } else if (/^#\s+/.test(trimmed)) {
      flushList();
      result += `<h1>${parseInlineMarkdown(trimmed.replace(/^#\s+/, ""))}</h1>`;
    }

    // Lists
    else if (/^[-*]\s+/.test(trimmed)) {
      listBuffer.push(parseInlineMarkdown(trimmed.replace(/^[-*]\s+/, "")));
    }

    // Paragraph
    else {
      flushList();
      result += `<p>${parseInlineMarkdown(trimmed)}</p>`;
    }
  });

  flushList();
  return result;
};

const SinglePageTab = ({ data }) => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = useMemo(() => {
    switch (activeTab) {
      case "overview":
        return data?.overview_description ? (
          <div
            className="space-y-4 product-overview"
            dangerouslySetInnerHTML={{
              __html: formatContent(data.overview_description),
            }}
          />
        ) : (
          <p>An overview for this item is currently unavailable.</p>
        );

      case "reviews":
        return data?.slug ? (
          <div className="sm:space-y-8 space-y-4">
            <ReviewList slug={data.slug} />
          </div>
        ) : (
          <p>
            No reviews have been submitted yet. Be the first to share your
            experience!
          </p>
        );

      case "changelog":
        return Array.isArray(data?.changelogs) && data.changelogs.length > 0 ? (
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
        );

      case "faq":
        return data?.faq?.length > 0 ? (
          <FaqSection list={data.faq} type="full" />
        ) : (
          <p>There are no frequently asked questions at the moment.</p>
        );

      default:
        return <p>Invalid tab selection.</p>;
    }
  }, [activeTab, data]);

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
      <div className="sm:mt-6 mt-3 space-y-6">{renderContent}</div>
    </div>
  );
};

export default SinglePageTab;
