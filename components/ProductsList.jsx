"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import ProductGrid from "./product/product-grid";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";

/**
 * Products List Component
 * @param {Object} props
 * @param {number} props.id - Component ID
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {string} props.section_layout - Layout type ("with_bg" or "without_bg")
 * @param {number} props.page_size - Number of products to display
 * @param {string} props.filter - Filter type for products
 * @param {boolean} props.category - Whether to show category
 * @param {Object} props.link - Link object
 * @param {Array} props.categories_list - List of categories
 */
export default function ProductsList(props) {
  const {
    title,
    description,
    section_layout,
    page_size,
    filter,
    category,
    link,
    categories_list,
  } = props;

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Fetch products when component mounts or when filter/page_size/selectedCategory changes
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);

        // Prepare the payload as JSON
        const payload = {
          page_size: page_size,
          filter: filter,
          category: category.toString(),
        };

        if (selectedCategory) {
          payload.base = selectedCategory;
        }

        // Call the API using the utility function
        const response = await strapiPost(
          "/product/filter",
          { ...payload },
          themeConfig.TOKEN
        );

        const productsData = response.data || [];
        setFilteredProducts(productsData);
        setError(null);
      } catch (err) {
        // console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [filter, page_size, selectedCategory, category]);

  // Handle category selection
  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
  };

  // Determine background class based on section_layout
  const bgClass = section_layout === "with_bg" ? "bg-gray-50" : "";

  return (
    <section className={`xl:py-[35px] sm:py-[30px] py-5 ${bgClass}`}>
      <div className={`${section_layout}`}></div>
      <div className="container mx-auto relative">
        <div>
          <div className={`wc_${section_layout}_secton`}>
            <div className="flex justify-between sm:items-center items-start sm:flex-row flex-col sm:mb-[30px] mb-6">
              <div>
                <h2>{title}</h2>
                <p className=" 2xl:text-lg 1xl:text-[17px] lg:text-base text-[15px] mt-2 2xl:w-[926px] lg:w-[775px] md:w-[550px] sm:w-[445px] max-w-full">{description}</p>
              </div>
              {link && (
                <Link
                  href={link?.link}
                  className="all-btn flex items-center hover:underline sm:mt-0 mt-4 underline-offset-4"
                >
                  {link?.label}
                  {link?.image ? (
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
                  ) : (
                    <span className="ml-1">→</span>
                  )}
                </Link>
              )}
            </div>
            {categories_list && categories_list?.length > 0 && (
              <div className="grid 1xl:grid-cols-7 xl:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 lg:gap-4 gap-3 mb-10 overflow-x-auto pb-2 tab-btn">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`btn whitespace-nowrap px-0 !py-2.5 !h-auto ${selectedCategory === null
                    ? "bg-primary text-white border-primary"
                    : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                >
                  All
                </button>

                {categories_list?.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => handleCategoryClick(category?.slug)}
                    className={`btn whitespace-nowrap px-0 !py-[9px] !h-auto ${selectedCategory === category?.slug
                      ? "bg-primary text-white border-primary"
                      : "bg-white border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary"
                      }`}
                  >
                    {category?.title || category?.name}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[26px]">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-[340px] mb-4"></div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-200 rounded-full w-8 h-8 mr-3"></div>
                        <div>
                          <div className="bg-gray-200 h-4 w-24 rounded mb-2"></div>
                          <div className="bg-gray-200 h-3 w-16 rounded"></div>
                        </div>
                      </div>
                      <div className="bg-gray-200 h-4 w-16 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-red-500">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 1xl:grid-cols-5 gap-[26px]">
                {filteredProducts.map((product, index) => (
                  <ProductGrid key={index} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
