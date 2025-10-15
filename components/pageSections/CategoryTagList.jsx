import React, { useState } from "react";
import { usePathname } from "next/navigation";
import CategoryTagCard from "../product/category/tag/category-tag-card";

const CategoryTagList = ({
  title,
  description,
  categories,
  tags,
  limit, // default limit
  section_layout,
  params, // Add params prop
}) => {
  const pathname = usePathname();
  
  // Extract parentSlug from params or pathname
  const getParentSlug = () => {
    // First try to get from params
    if (params?.itemSlug) {
      return params.itemSlug;
    }
    
    // If not in params, try to extract from pathname
    // For URLs like /category/html-templates/web-design
    // We want to extract "html-templates" as the parent slug
    const pathSegments = pathname.split("/").filter(Boolean);
    if (pathSegments[0] === "category" && pathSegments[1]) {
      return pathSegments[1];
    }
    
    return null;
  };
  
  const parentSlug = getParentSlug();
  
  // Debug logging
  console.log("CategoryTagList Debug:", {
    pathname,
    params,
    parentSlug,
    categories: categories?.length || 0
  });
  const [visibleCount, setVisibleCount] = useState(limit);

  const handleShowMore = () => {
    setVisibleCount(
      (prev) => Math.min(prev + limit, tags.length) // increment by limit, but not exceed total
    );
  };

  const handleShowLess = () => {
    setVisibleCount(limit); // reset to default limit
  };

  return section_layout === "category_layout"
    ? categories && categories.length > 0 && (
      <div className="bg-blue-300 md:py-[50px] sm:py-9 py-6">
        <div className="container">
          <h2 className="h2 mb-[10px]">{title}</h2>
          <p className="sm:mb-[30px] mb-5">{description}</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 sm:gap-4 gap-3 mb-4 html-categories">
            {categories.map((category, index) => (
              <CategoryTagCard key={index} category={category} parentSlug={parentSlug} />
            ))}
          </div>
        </div>
      </div>
    )
    : tags && tags.length > 0 && (
      <div className="container">
        <div className="mb-[60px]">
          <h2 className="font-medium text-gray-800 mb-4">Templates in..</h2>
          <div className="flex flex-wrap xl:gap-[15px] lg:gap-3 sm:gap-[10px] gap-2">
            {tags.slice(0, visibleCount).map((data, index) => (
              <button className="btn black-btn" key={index}>
                {data?.title}
              </button>
            ))}
            {visibleCount < tags.length && (
              <button onClick={handleShowMore} className="btn black-btn">
                Show More
              </button>
            )}

            {visibleCount >= tags.length && tags.length > limit && (
              <button onClick={handleShowLess} className="btn black-btn">
                Show Less
              </button>
            )}
          </div>
        </div>
      </div>
    );
};

export default CategoryTagList;
