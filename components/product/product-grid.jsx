"use client";

import { NO_FOUND_PRODUCT_GRID_IMAGE, URL } from "@/config/theamConfig";
import Image from "next/image";
import Link from "next/link";

// Helper function to sanitize text
const sanitizeText = (text) =>
  typeof text === "string"
    ? text.replace(/</g, "&lt;").replace(/>/g, "&gt;")
    : "";

export default function 




({ product }) {
  const productSlug = product?.slug ?? "";
  const productTitle = sanitizeText(product?.short_title || product?.title);
  const authorName = sanitizeText(product?.author?.full_name || product?.author?.username);
  const productImage = product?.grid_image?.url ? `${product.grid_image.url}` : NO_FOUND_PRODUCT_GRID_IMAGE;
  const authorImage = product?.author?.image?.url ? `${product.author.image.url}` : NO_FOUND_PRODUCT_GRID_IMAGE;
  const regularPrice = product?.price?.regular_price ?? product?.price?.sales_price;
  const salesPrice = product?.price?.sales_price ?? product?.price?.regular_price;

  return (
    <div className="group">
      <Link href={`/product/${encodeURIComponent(productSlug)}`}>
        <div className="cursor-pointer relative rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:shadow-lg">
          <Image
            src={productImage}
            alt={productTitle}
            width={270}
            height={345}
            className="w-full h-auto object-cover aspect-[1/1.2]"
            onError={(e) => { e.currentTarget.src = NO_FOUND_PRODUCT_GRID_IMAGE; }}
          />
        </div>
      </Link>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Image
            src={authorImage}
            alt={authorName}
            width={270}
            height={345}
            className="object-cover aspect-[1/1.2] rounded-full w-7 h-7 flex items-center justify-center text-xs mr-[10px]"
            onError={(e) => { e.currentTarget.src = NO_FOUND_PRODUCT_GRID_IMAGE; }}
          />
          <div>
            <Link href={`/product/${encodeURIComponent(productSlug)}`}>
              <h3 className="text-base !text-black cursor-pointer">
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
              ${salesPrice === null ? regularPrice.toFixed(2) : salesPrice.toFixed(2)}
            </span>
            <br />
            {salesPrice !== null && regularPrice && (
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
