"use client"

import Image from "next/image"

export default function ProductGrid({ product }) {
    return (
        <>
            <div className="group">
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
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="bg-[#000000] text-white rounded-full w-8 h-8 flex items-center justify-center text-xs mr-3">
                            {product?.rating || 5}
                        </div>
                        <div>
                            <h3 className="font-medium text-[#000000] cursor-pointer">{product?.short_title || product?.title}</h3>
                            <p className="text-sm text-[#505050]">by {product?.author?.full_name || product?.author?.username}</p>
                        </div>
                    </div>
                    <span className="text-[#0156d5] font-medium">${product?.price.toFixed(2)}</span>
                </div>
            </div>
        </>
    )
}
