"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BlogProductImageSliderServer = ({ data }) => {
  const { swiper } = data;

  if (!swiper || !Array.isArray(swiper) || swiper.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 max-w-[745px] !w-full blog-product-image-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation={true}
        pagination={{
          clickable: true,
        }}
        className="!w-full blog-product-swiper "
      >
        {swiper.map((item, index) => {
          const image = item?.image;
          const link = item?.link;

          if (!image?.url) return null;

          const imageElement = (
            <Image
              src={image.url}
              alt={image.alternativeText || image.name || `Slide ${index + 1}`}
              width={image.width || 789}
              height={image.height || 443}
              className="w-full h-auto rounded-lg object-cover"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 789px"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          );

          return (
            <SwiperSlide key={item.id || index}>
              {link ? (
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group relative overflow-hidden rounded-lg !w-full bg-blue-300"
                >
                  <div className="relative">
                    {imageElement}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 p-4 bg-transparent transition-all duration-300 opacity-0 group-hover:opacity-100">
                      <div className="bg-black w-full h-full bg-opacity-0 group-hover:bg-opacity-10 flex items-center justify-center">
                      <div className="bg-primary px-4 py-2 rounded-md">
                        <span className="text-white font-medium text-sm">Visit Link</span>
                      </div>
                    </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="relative">
                  {imageElement}
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default BlogProductImageSliderServer;

