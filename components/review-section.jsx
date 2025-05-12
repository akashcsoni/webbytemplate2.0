"use client";

import Link from "next/link";
import Image from "next/image";
import ReviewGrid from "./common/review/review-grid";

export default function ReviewSection({ title, label, link, list }) {
  return (
    <section className="xl:py-[35px] sm:py-[30px] py-5">
      <div className="container mx-auto ">
        <div className="flex justify-between sm:items-center items-start sm:flex-row flex-col sm:mb-[30px] mb-6">
          <div>
            <h2>{title}</h2>
            <p className="mt-3  lg:max-w-full max-w-[926px]">{label}</p>
          </div>
          <Link
            href={link?.link}
            className="all-btn flex items-center hover:underline sm:mt-0 mt-4 underline-offset-4"
          >
            {link?.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 16 16"
              className="ml-1.5"
            >
              <path
                fill="currentColor"
                d="M8.85 3.15a.5.5 0 0 0-.707.707l4.15 4.15h-9.79a.5.5 0 0 0 0 1h9.79l-4.15 4.15a.5.5 0 0 0 .707.707l5-5a.5.5 0 0 0 0-.707l-5-5z"
                strokeWidth={0.5}
                stroke="currentColor"
              ></path>
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 sm:gap-[30px] gap-4">
          {list.map((testimonial) => (
            <ReviewGrid key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
