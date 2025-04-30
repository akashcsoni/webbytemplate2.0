import Image from "next/image";
import Link from "next/link";

const ServiceGrid = ({ category, link_button }) => {
  return (
    <div className="bg-white rounded-[10px] drop-shadow-category overflow-hidden">
      <div className="2xl:p-[30px] sm:p-[25px] p-5">
        <div className="flex justify-between items-center 2xl:mb-[22px] mb-3">
          <h3>{category?.title}</h3>
          <Image
            src={`https://studio.webbytemplate.com${category?.image?.url}`}
            alt="WordPress icon"
            width={46}
            height={46}
            className="2xl:w-[46px] 2xl:h-[46px] lg:w-10 lg:h-10 w-9 h-9"
          />
        </div>

        <p className="sm:mb-[18px] mb-[15px]">{category?.description}</p>

        <Link
          href={`/category${category?.slug}`}
          className="all-btn inline-flex items-center hover:underline underline-offset-4"
        >
          {link_button?.label}
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
    </div>
  );
};

export default ServiceGrid;
