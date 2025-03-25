"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export function TechnologySelector({ all_technology }) {
    const [defaultTech, setDefaultTech] = useState(null)
    const [hoveredTech, setHoveredTech] = useState(null)

    useEffect(() => {
        if (Array.isArray(all_technology) && all_technology.length > 0) {
            setDefaultTech(all_technology[0])
        }
    }, [all_technology])

    const currentTech = hoveredTech || defaultTech

    if (!Array.isArray(all_technology) || all_technology.length === 0) {
        return (
            <div className="text-red-500 text-sm">
                No technology data available.
            </div>
        )
    }

    return (
        <div>
            {/* Dynamic Heading and Description */}
            <h2 className="text-[#000000] text-lg font-semibold mb-2">Technology</h2>
            <p className="text-[#505050] mb-4">
                {currentTech?.title || "No title available"} : {currentTech?.description || "No description available"}
            </p>

            {/* Tech Grid */}
            <div className="grid grid-cols-3 gap-3">
                {all_technology.map((tech, index) => {
                    const isFirst = index === 0
                    const safeImages = Array.isArray(tech?.image) ? tech.image : []

                    const cardContent = (
                        <div
                            onMouseEnter={() => setHoveredTech(tech)}
                            onMouseLeave={() => setHoveredTech(null)}
                            className={`
                                border ${isFirst ? "border-[#0156d5]" : "border-[#d9dde2]"}
                                ${isFirst ? "bg-[#e6effb]" : "bg-white"}
                                rounded-md p-3 flex flex-col items-center justify-center text-center  
                                cursor-pointer transition-colors
                                hover:border-[#0156d5] hover:bg-[#e6effb]
                            `}
                        >
                            {/* Image(s) */}
                            <div className="h-12 flex items-center justify-center mb-2">
                                {safeImages.map((image, idx) => (
                                    <div className="w-8 h-8 relative" key={idx}>
                                        {image?.url ? (
                                            <Image
                                                src={`https://studio.webbytemplate.com${image.url}`}
                                                alt={tech?.title || `Technology ${idx + 1}`}
                                                width={image?.width || 32}
                                                height={image?.height || 32}
                                            />
                                        ) : (
                                            <div className="w-8 h-8 bg-gray-100 rounded" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Title and Price */}
                            <div className="text-sm">{tech?.title || "Untitled"}</div>
                            <div className="text-[#0156d5] font-medium text-sm">${tech?.price?.sales_price}</div>
                            <div className="text-[#969ba3] font-medium text-sm line-through">${tech?.price?.regular_price}</div>
                        </div>
                    )

                    return isFirst ? (
                        <div key={tech?.id ?? `tech-${index}`}>{cardContent}</div>
                    ) : (
                        <Link
                            href={`/product/${tech?.slug || "#"}`}
                            key={tech?.id ?? `tech-${index}`}
                            onClick={(e) => {
                                if (!tech?.slug) e.preventDefault()
                            }}
                        >
                            {cardContent}
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
