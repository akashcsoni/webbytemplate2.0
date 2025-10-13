"use client";

import React from "react";

const SingleBlogText = ({ 
  text, 
  content, 
  className = "",
  ...props 
}) => {
  const textContent = text || content || "";
  
  if (!textContent) {
    return null;
  }

  return (
    <div 
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: textContent }}
      {...props}
    />
  );
};

export default SingleBlogText;
