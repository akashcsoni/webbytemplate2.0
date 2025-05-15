"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function TechnologySelector({ all_technology }) {
  const [defaultTech, setDefaultTech] = useState(null);
  const [hoveredTech, setHoveredTech] = useState(null);

  useEffect(() => {
    if (Array.isArray(all_technology) && all_technology.length > 0) {
      setDefaultTech(all_technology[0]);
    }
  }, [all_technology]);

  const currentTech = hoveredTech || defaultTech;

  if (!Array.isArray(all_technology) || all_technology.length === 0) {
    return (
      <div className="text-red-500 text-sm">No technology data available.</div>
    );
  }

  return (
    <div>
      {/* Dynamic Heading and Description */}
      <h2 className="p !text-black mb-[3px] lg:pt-5 pt-2 !text-lg">Technology</h2>
      <p className="p2 mb-4">
        <span className="text-black">
          {currentTech?.title || "No title available"}
        </span>
        <span className="text-gray-200">
          {" : " + (currentTech?.description || "No description available")}
        </span>
      </p>

      {/* Tech Grid */}
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-3 grid-cols-2 gap-3">
        {all_technology.map((tech, index) => {
          const isFirst = index === 0;
          const safeImages = Array.isArray(tech?.image) ? tech.image : [];
          const title = tech?.title || "Untitled";
          const slug = tech?.slug || null;

          const regularPrice = tech?.price?.regular_price ?? "--";
          const salesPrice =
            tech?.price?.sales_price != null
              ? tech.price.sales_price
              : regularPrice;

          const cardContent = (
            <div
              onMouseEnter={() => setHoveredTech(tech)}
              onMouseLeave={() => setHoveredTech(null)}
              className={`border ${isFirst ? "border-[#0156d5]" : "border-[#d9dde2]"
                } ${isFirst ? "bg-[#e6effb]" : "bg-white"} 
                rounded-md p-3 flex flex-col items-center justify-center text-center  
                cursor-pointer transition-colors
                hover:border-[#0156d5] hover:bg-[#e6effb]`}
            >
              {/* Images */}
              <div className="flex items-center justify-center mb-2">
                {safeImages.length > 0 ? (
                  safeImages.map((image, idx) => (
                    <div className="relative" key={idx}>
                      {image?.url ? (
                        <Image
                          src={`https://studio.webbytemplate.com${image.url}`}
                          alt={title}
                          width={image?.width || 46}
                          height={image?.height || 46}
                          className="2xl:h-[46px] xl:h-9 h-[35px] w-full"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gray-100 rounded" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-8 h-8 bg-gray-100 rounded" />
                )}
              </div>

              {/* Title and Price */}
              <div className="p2 2xl:!text-base !text-sm !text-black">
                {title}
              </div>
              <div className="!text-primary p2">
                ${typeof salesPrice === "number" ? salesPrice.toFixed(2) : salesPrice}
              </div>
              <div className="text-[#969ba3] font-medium text-sm line-through">
                ${typeof regularPrice === "number" ? regularPrice.toFixed(2) : regularPrice}
              </div>
            </div>
          );

          return isFirst || !slug ? (
            <div key={tech?.id ?? `tech-${index}`}>{cardContent}</div>
          ) : (
            <Link
              href={`/product/${slug}`}
              key={tech?.id ?? `tech-${index}`}
              onClick={(e) => {
                if (!slug) e.preventDefault();
              }}
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
