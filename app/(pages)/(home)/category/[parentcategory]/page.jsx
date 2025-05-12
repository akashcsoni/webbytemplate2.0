import GlobalComponent from "@/components/global/global-component";
import Link from "next/link";
import { notFound } from "next/navigation";

// Server-side data fetching
async function getPageData(parentcategory) {
  try {
    // Use a fixed API URL since we know the domain
    const apiUrl = `https://studio.webbytemplate.com/api/categories/${parentcategory}`;

    const response = await fetch(apiUrl, {
      cache: "no-store", // or { next: { revalidate: 60 } } for ISR
    });

    const result = await response.json();

    if (result.result && result.data) {
      return result.data;
    }
    // If no data is found, trigger 404
    return notFound();
  } catch (error) {
    // console.error("Error fetching page data:", error)
    throw error;
  }
}

export default async function parentCategoryPage({ params }) {
  const { parentcategory } = await params;

  // Fetch data on the server
  const pageData = await getPageData(parentcategory);

  return (
    <main className="lg:py-12 md:py-10 py-8">
      {/* Breadcrumb Navigation */}
      <div className="container">
        <nav className="flex items-center text-sm mb-[14px]">
          <Link href="/" className="text-[#0156d5] hover:underline">
            Home
          </Link>
          <span className="mx-2 text-[#505050]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <g clipPath="url(#clip0_590_7)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                  fill="#505050"
                />
              </g>
            </svg>
          </span>
          <Link href="/" className="text-[#0156d5] hover:underline">
            Categories
          </Link>
          <span className="mx-2 text-[#505050]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
            >
              <g clipPath="url(#clip0_590_7)">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M4.20444 4.99981L0.664062 1.46056L1.46056 0.664062L5.79519 4.99981L1.46056 9.33556L0.664062 8.54019L4.20444 4.99981ZM7.57944 4.99981L4.03906 1.46056L4.83556 0.664062L9.17019 4.99981L4.83556 9.33556L4.03906 8.54019L7.57944 4.99981Z"
                  fill="#505050"
                />
              </g>
            </svg>
          </span>
          <span className="text-[#505050]">{pageData?.title}</span>
        </nav>
      </div>

      {/* Page Heading */}

      <div className="container mb-2">
          <h1 className="h2 lg:mb-[18px] mb-3">{pageData?.title}</h1>

          {/* Search Bar */}
          <div className="relative flex items-center lg:mb-8 sm:mb-6 mb-4 border border-gray-100 rounded-[5px] overflow-hidden">
            <input
              type="text"
              placeholder="Search for mockups, Web Templates and More....."
              className="w-full rounded-l px-4 outline-none lg:h-10 h-9 p2"
            />
            <button className="bg-[#0156d5] text-white lg:py-3 py-2.5 px-[18px] rounded-r flex items-center justify-center">
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
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </svg>
            </button>
          </div>

          {/* Description Text */}
          <p className="text-[#505050] leading-relaxed  2xl:text-lg 1xl:text-[17px] md:text-base text-sm">
            {pageData?.short_description}
          </p>
        </div>
  
      <GlobalComponent data={pageData} />
    </main>
  );
}
