import Image from 'next/image'
import React from 'react'
import Star from './star'

const ReviewGrid = ({ testimonial }) => {
    
    return (
        <div className="bg-white rounded-lg border border-[#d9d9d9] p-6 shadow-sm">
            <div className="flex items-center mb-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden">
                    <Image
                        src={`https://studio.webbytemplate.com${testimonial?.user?.image?.url}`}
                        alt={testimonial?.user?.full_name}
                        width={64}
                        height={64}
                        className="object-cover"
                    />
                </div>
                <div className="ml-4">
                    <h3 className="text-lg font-semibold text-[#00193e]">{testimonial?.user?.full_name}</h3>
                    <p className="text-[#505050]">{testimonial?.user?.position}</p>
                </div>
            </div>

            <div className="flex mb-3">
                {[...Array(testimonial?.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#ff7f22] text-[#ff7f22]" />
                ))}
            </div>
            <p className="text-[#505050]">{testimonial?.review}</p>
        </div>
    )
}

export default ReviewGrid
