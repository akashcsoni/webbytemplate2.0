import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CategoryTagCard = ({ category }) => {
    const { title, slug, cover } = category
    const imageUrl = cover?.url || "/placeholder.svg?height=40&width=40"

    return (
        <Link
            href={`/category/${slug}`}
            className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex items-center">
                <div className="mr-3 w-8 h-8 relative flex items-center justify-center">
                    <Image
                        src={imageUrl.startsWith("/") ? `https://studio.webbytemplate.com${imageUrl}` : imageUrl}
                        alt={title}
                        width={32}
                        height={32}
                        className="object-contain"
                    />
                </div>
                <span className="font-medium">{title}</span>
            </div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-[#0156d5]"
            >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
            </svg>
        </Link>
    )
}

export default CategoryTagCard
