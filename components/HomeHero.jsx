"use client";

import { useState, useRef, useEffect } from "react";
import DynamicIcon from "./ui/DynamicIcon";
import { useRouter } from "next/navigation";

export default function HomeHero({
  title,
  description,
  tags = [],
  categories = [],
  isLoading = false,
}) {


  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();

    // If no search term is entered and no category is selected
    if (trimmedTerm === '' && selectedCategory === 'All Categories') {
      router.push('/search');
      return;
    }

    // If search term is empty but category is selected
    if (trimmedTerm === '') {
      const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
      router.push(`/category/${categorySlug}`);
      return;
    }

    // If search term exists
    const querySlug = encodeURIComponent(trimmedTerm);

    if (selectedCategory === 'All Categories') {
      // Redirect to /search/[querySlug] when 'All Categories' is selected
      router.push(`/search/${querySlug}`);
    } else {
      // Handle the category-specific route
      const categorySlug = selectedCategory.toLowerCase().replace(/\s+/g, '-');
      router.push(`/category/${categorySlug}?term=${querySlug}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 flex justify-center">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded w-96 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-80 mb-8"></div>
          <div className="h-12 bg-gray-200 rounded w-full max-w-4xl"></div>
        </div>
      </div>
    );
  }

  if (!title || !description) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>Failed to load hero data. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className="xl:pb-[35px] lg:pb-[30px] pb-[25px] 2xl:pt-20 1xl:pt-16 lg:pt-14 sm:pt-10 pt-8">
      <div className="container mx-auto">
        <div className="flex flex-col items-center text-center">
          {/* Main Heading */}
          <h1 className="lg:mb-[22px] mb-3 1xl:w-[88rem] w-[62rem] max-w-full">{title}</h1>

          {/* Subheading */}
          <p className="2xl:max-w-5xl xl:max-w-4xl max-w-[49rem] mb-5 md:mb-9 2xl:text-lg lg:text-[16px] md:text-base text-sm">
            {description}
          </p>

          <div className="w-full 2xl:max-w-[53rem] max-w-3xl mb-[35px] z-30">
            <form onSubmit={handleSubmit} className="flex gap-2 2xl:p-3.5 md:p-2.5 p-1.5 bg-white rounded-lg drop-shadow-primary border border-primary/10">
              {/* Categories Dropdown */}
              <div
                className="relative 1xl:w-[180px] lg:w-[175px] md:w-[170px] sm:w-[165px] w-[27%] flex"
                ref={dropdownRef}
              >
                <button
                  className="flex items-center justify-between w-full sm:px-4 px-2 text-[#000000] bg-white border-r border-[#d9dde2]"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(!isOpen)
                  }}
                  aria-expanded={isOpen}
                  aria-haspopup="listbox"
                  type="button"
                >
                  <p className="text-black truncate max-w-[100px] sm:max-w-none whitespace-nowrap overflow-hidden text-ellipsis 2xl:text-lg 1xl:text-[17px] sm:text-base text-sm">
                    {selectedCategory}
                  </p>
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
                    className={`text-[#505050] flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="absolute sm:w-full w-40 2xl:mt-[55px] xl:mt-[51px] md:mt-[49px] sm:mt-[40px] mt-[38px] bg-white border border-[#d9dde2] rounded-md shadow-lg z-50">
                    <ul
                      className="py-1 max-h-60 overflow-auto"
                      role="listbox"
                      aria-label="Category List"
                    >
                      <li>
                        <button
                          className={`w-full text-left px-4 py-2 hover:bg-blue-100 p2 ${selectedCategory === 'All Categories' ? 'bg-blue-100 text-primary' : 'text-black'}`}
                          onClick={(e) => {
                            e.preventDefault()
                            setSelectedCategory('All Categories')
                            setIsOpen(false)
                          }}
                          role="option"
                        >
                          All Categories
                        </button>
                      </li>
                      {categories.map((category) => (
                        <li key={category.id}>
                          <button
                            className={`w-full text-left px-4 py-2 hover:bg-blue-100 p2 !text-black ${selectedCategory === category.title ? 'bg-blue-100 text-primary' : 'text-black'}`}
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedCategory(category.title)
                              setIsOpen(false)
                            }}
                            role="option"
                            title={category.short_description}
                          >
                            {category.title}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Search Input */}
              <div className="flex-1 flex">
                <input
                  type="text"
                  placeholder="Search for mockups, Web Templates and More....."
                  className="w-full sm:px-4 px-2 text-[#505050] bg-white focus:outline-none placeholder:p2 p2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="btn btn-primary tracking-wide drop-shadow-primary"
              >
                <span className="sm:block hidden">Search</span>
                <svg
                  className="stroke-white sm:hidden block"
                  width="18"
                  height="18"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
              </button>
            </form>
          </div>


          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-4">
            {tags.map((tag) => (
              <CategoryPill
                key={tag.id}
                icon={tag.icon}
                label={tag.label}
                link={tag.link}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryPill({ icon, label, link }) {
  return (
    <span
      // href={link || "#"}
      className="flex items-center gap-2 btn btn-secondary 1xl:!px-[18px] !px-3 1xl:!py-[7px] !py-[4px]"
    >
      <DynamicIcon icon={icon} />
      <span>{label}</span>
    </span>
  );
}
