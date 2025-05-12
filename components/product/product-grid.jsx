"use client";

import Image from "next/image";
import Link from "next/link";

export default function ProductGrid({ product }) {
  return (
    <>
      <div className="group">
        <Link href={`/product/${product?.slug}`}>
          <div className="cursor-pointer relative rounded-lg overflow-hidden mb-4 transition-transform duration-300 group-hover:shadow-lg">
            <Image
              src={
                product.grid_image?.url
                  ? `https://studio.webbytemplate.com${product?.grid_image?.url}`
                  : "/placeholder.svg?height=270&width=230"
              }
              alt={product?.short_title || product?.title}
              width={270}
              height={345}
              className="w-full h-auto object-cover aspect-[1/1.2]"
            />
          </div>
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-[#000000] text-white rounded-full w-7 h-7 flex items-center justify-center text-xs mr-[10px]">
              {product?.rating || 5}
            </div>
            <div>
              <h3 className="text-base !text-black cursor-pointer">
                {product?.short_title || product?.title}
              </h3>
              <p className="text-sm text-gray-200">
                <span className="text-gray-300">by </span>
                {product?.author?.full_name || product?.author?.username}
              </p>
            </div>
          </div>
          {product?.price && (
            <div>
              <span className="p !text-primary">
                ${product?.price?.sales_price?.toFixed(2)}
              </span>
              <br />
              <span className="p2 !text-gray-300 text-sm line-through">
                ${product?.price?.regular_price?.toFixed(2)}
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
