"use client";

import React from "react";

const SingleBlogHeading = ({ 
  level = 2, 
  text, 
  title, 
  className = "",
  id,
  ...props 
}) => {
  const headingText = text || title || "Untitled Section";
  const HeadingTag = `h${Math.min(Math.max(level, 1), 6)}`;
  
  // Generate a URL-friendly ID from the heading text if no ID is provided
  const generateId = (text) => {
    if (id) return id;
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  };

  const headingId = generateId(headingText);
  
  const headingClasses = {
    1: "text-4xl font-bold mb-6 mt-8",
    2: "text-3xl font-semibold mb-5 mt-7",
    3: "text-2xl font-semibold mb-4 mt-6",
    4: "text-xl font-medium mb-3 mt-5",
    5: "text-lg font-medium mb-3 mt-4",
    6: "text-base font-medium mb-2 mt-3"
  };

  return (
    <HeadingTag 
      id={headingId}
      className={`${headingClasses[level]} ${className}`}
      {...props}
    >
      {headingText}
    </HeadingTag>
  );
};

export default SingleBlogHeading;
