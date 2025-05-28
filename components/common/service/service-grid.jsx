import { URL } from "@/config/theamConfig";
import Image from "next/image";
import Link from "next/link";

const ServiceGrid = ({ category = {}, link_button = {} }) => {
  const {
    title = "No Title Available",
    description = "No description provided.",
    image,
    slug = "",
  } = category;

  // Build image URL only if image and url exist
  const imageUrl = image?.url
    ? `${image.url}`
    : null;

  // Build link href safely
  const href = slug ? `/category${slug.startsWith("/") ? slug : "/" + slug}` : "#";

  return (
    <div className="bg-white rounded-[10px] drop-shadow-category overflow-hidden">
      <div className="2xl:p-[30px] sm:p-[25px] p-5">
        <div className="flex justify-between items-center 2xl:mb-[22px] mb-3">
          <h3>{title}</h3>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={title || "Category icon"}
              width={46}
              height={46}
              className="2xl:w-[46px] 2xl:h-[46px] lg:w-10 lg:h-10 w-9 h-9"
              unoptimized
            />
          ) : (
            <div
              style={{
                width: 46,
                height: 46,
                backgroundColor: "#ddd",
                borderRadius: "10px",
              }}
            />
          )}
        </div>

        <p className="sm:mb-[18px] mb-[15px]">{description}</p>

        {slug && link_button?.label ? (
          <Link
            prefetch={true}
            href={href}
            className="all-btn inline-flex items-center hover:underline underline-offset-4"
          >
            {link_button.label}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={18}
              height={18}
              viewBox="0 0 16 16"
              className="ml-1.5"
              aria-hidden="true"
              focusable="false"
            >
              <path
                fill="currentColor"
                d="M8.85 3.15a.5.5 0 0 0-.707.707l4.15 4.15h-9.79a.5.5 0 0 0 0 1h9.79l-4.15 4.15a.5.5 0 0 0 .707.707l5-5a.5.5 0 0 0 0-.707l-5-5z"
                strokeWidth={0.5}
                stroke="currentColor"
              />
            </svg>
          </Link>
        ) : (
          <span className="text-gray-400 italic">Link unavailable</span>
        )}
      </div>
    </div>
  );
};

export default ServiceGrid;