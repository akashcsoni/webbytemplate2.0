"use client";

import { NO_FOUND_PRODUCT_GRID_IMAGE } from "@/config/theamConfig";
import Image from "next/image";
import Link from "next/link";

// Helper function to sanitize text
const sanitizeText = (text) =>
  typeof text === "string"
    ? text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    : "";

export default function ProductCard({ product }) {
  // ✅ Collect current product technology image
  const currentTechImage = product?.all_technology?.technology?.image?.url
    ? [product.all_technology.technology.image.url]
    : [];

  // ✅ Collect related products technology images
  const relatedTechImages =
    product?.all_technology?.products
      ?.map((p) => p?.all_technology?.technology?.image?.url)
      ?.filter(Boolean) || [];

  // ✅ Merge both
  const combinedTechImages = [...currentTechImage, ...relatedTechImages];

  const productSlug = product?.slug ?? "";
  const productTitle = sanitizeText(product?.short_title || product?.title);
  const authorName = sanitizeText(
    product?.author?.full_name || product?.author?.username
  );
  const productImage = product?.grid_image?.url
    ? `${product.grid_image.url}`
    : NO_FOUND_PRODUCT_GRID_IMAGE;
  const authorImage = product?.author?.image?.url
    ? `${product.author.image.url}`
    : NO_FOUND_PRODUCT_GRID_IMAGE;
  const regularPrice =
    product?.price?.regular_price ?? product?.price?.sales_price;
  const salesPrice =
    product?.price?.sales_price ?? product?.price?.regular_price;

  return (
    <div className="group relative">
      <Link
        prefetch={true}
        href={`/product/${encodeURIComponent(productSlug)}`}
      >
        <div className="cursor-pointer relative rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:shadow-lg">
          <Image
            src={productImage}
            alt={productTitle}
            width={270}
            height={345}
            className="w-full h-auto aspect-[1/1.2]"
            onError={(e) => {
              e.currentTarget.src = NO_FOUND_PRODUCT_GRID_IMAGE;
            }}
          />
          <div className="absolute top-0 w-full h-full bg-black/60 hidden group-hover:block transition-all">
            {/* Center Arrow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
              >
                <path
                  d="M9 31L32 8M32 8V30M32 8H10"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* ✅ Technology icons loop */}
            <div
              className="absolute w-[95%] bottom-4 left-1/2 -translate-x-1/2
gap-2 flex flex-wrap items-center justify-center text-center
cursor-pointer transition-colors w-fit"
            >
              {combinedTechImages.map((imgUrl, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center border border-[#0156d5] bg-white rounded-full p-2"
                >
                  <div className="relative">
                    <img
                      alt="Technology"
                      loading="lazy"
                      width="46"
                      height="46"
                      decoding="async"
                      className="2xl:h-[46px] xl:h-9 h-[35px] w-full"
                      style={{ color: "transparent" }}
                      src={imgUrl}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Link>

      {/* Bottom section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={authorImage}
            alt={authorName}
            width={270}
            height={345}
            className="object-cover aspect-[1/1.2] rounded-full w-7 h-7 flex items-center justify-center text-xs mr-[10px] flex-shrink-0"
            onError={(e) => {
              e.currentTarget.src = NO_FOUND_PRODUCT_GRID_IMAGE;
            }}
          />
          <div>
            <Link href={`/product/${encodeURIComponent(productSlug)}`}>
              <h3 className="text-base !text-black cursor-pointer line-clamp-1">
                {productTitle}
              </h3>
            </Link>
            <p className="text-sm text-gray-200">
              <span className="text-gray-300">by </span>
              {authorName}
            </p>
          </div>
        </div>
        {product?.price && (
          <div>
            <span className="p !text-primary">
              $
              {salesPrice === null
                ? regularPrice.toFixed(2)
                : salesPrice.toFixed(2)}
            </span>
            <br />
            {product?.price?.sales_price !== null && regularPrice && (
              <span className="p2 !text-gray-300 text-sm line-through">
                ${regularPrice.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}