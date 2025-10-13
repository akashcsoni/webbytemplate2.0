"use client";

import Image from "next/image";
import React from "react";

const SingleBlogImage = ({ 
  image, 
  alt, 
  caption, 
  width = 800, 
  height = 400, 
  className = "",
  priority = false,
  ...props 
}) => {
  // Handle different image data structures
  const getImageUrl = () => {
    if (typeof image === 'string') return image;
    if (image?.url) return image.url;
    if (image?.data?.url) return image.data.url;
    return null;
  };

  const getImageAlt = () => {
    if (alt) return alt;
    if (image?.alternativeText) return image.alternativeText;
    if (image?.alt) return image.alt;
    return "Blog image";
  };

  const imageUrl = getImageUrl();
  const imageAlt = getImageAlt();

  if (!imageUrl) {
    return (
      <div className="p-4 border border-gray-200 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500">No image provided</p>
      </div>
    );
  }

  return (
    <div className={`blog-image-container my-6 ${className}`}>
      <div className="relative overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={imageAlt}
          width={width}
          height={height}
          className="w-full h-auto object-cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 800px"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          {...props}
        />
      </div>
      {caption && (
        <p className="text-sm text-gray-600 mt-2 text-center italic">
          {caption}
        </p>
      )}
    </div>
  );
};

export default SingleBlogImage;
