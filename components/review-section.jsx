"use client"

import Link from "next/link"
import Image from "next/image"
import ReviewGrid from "./common/review/review-grid"

export default function ReviewSection({ title, label, link, list }) {
  return (
    <section className="px-4 py-12 bg-white">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-[#00193e]">{title}</h2>
            <p className="mt-2 text-[#505050]">
              {label}
            </p>
          </div>
          <Link href={link?.link} className="text-[#0156d5] font-medium flex items-center hover:underline">
            {link?.label}
            <Image
              src={link?.image}
              alt="arrow"
              width={12}
              height={14}
              className="ml-1"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {list.map((testimonial) => (
            <ReviewGrid key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

