'use client'

import Image from 'next/image'
import React from 'react'
import Star from './star'
import { NO_AVTAR_IMAGE, URL } from '@/config/theamConfig'

const ReviewGrid = ({ testimonial }) => {
    const {
        user = {},
        rating = 0,
        review = '',
    } = testimonial || {}

    const {
        image = {},
        full_name = 'Anonymous',
        position = 'Not specified',
    } = user || {}

    const imageUrl = image?.url ? `${image.url}` : NO_AVTAR_IMAGE // use fallback image if no URL

    // Ensure rating is a number between 0 and 5
    const validRating = Math.max(0, Math.min(5, Math.floor(Number(rating))))

    return (
        <div className="bg-white rounded-[15px] border border-primary/10 sm:p-6 p-5 shadow-sm">
            <div className="flex items-center sm:gap-4 gap-3 xl:mb-6 xl:pb-6 mb-5 pb-5 border-b border-primary/10">
                <div className="relative 2xl:h-14 2xl:w-14 w-12 h-12 rounded-full overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={full_name}
                        width={64}
                        height={64}
                        className="object-cover"
                        onError={(e) => { e.target.src = NO_AVTAR_IMAGE }} // fallback if image fails to load
                    />
                </div>
                <div>
                    <h5 className="mb-0.5  2xl:text-xl xl:text-[19px] text-lg">{full_name}</h5>
                    <p className="p2 !text-base">{position}</p>
                </div>
            </div>

            <div className="flex sm:mb-4 mb-3 space-x-1">
                {[...Array(validRating)].map((_, i) => (
                    <Star key={i} className="xl:h-6 xl:w-6 w-5 h-6 fill-[#ff7f22] text-[#ff7f22]" />
                ))}
            </div>

            <p>{review || 'No review provided.'}</p>
        </div>
    )
}

export default ReviewGrid