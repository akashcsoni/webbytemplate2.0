"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Slider } from "@heroui/react";
import Link from "next/link";
import { strapiPost } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import ProductGrid from "../product/product-grid";
import ProductDummyGrid from "../product/product-dummy-grid";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

// Skeleton components for loading states
const FilterSkeleton = ({ count = 5 }) => (
  <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto">
    {[...Array(count)].map((_, index) => (
      <li
        key={index}
        className="flex items-center justify-between animate-pulse"
      >
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <div className="w-20 h-4 bg-gray-100 rounded"></div>
        </div>
        <div className="w-6 h-4 bg-gray-100 rounded"></div>
      </li>
    ))}
  </ul>
);

const CategorySkeleton = ({ count = 6 }) => (
  <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto">
    {[...Array(count)].map((_, index) => (
      <li
        key={index}
        className="flex justify-between items-center animate-pulse"
      >
        <div className="w-24 h-4 bg-gray-100 rounded"></div>
        <div className="w-6 h-4 bg-gray-100 rounded"></div>
      </li>
    ))}
  </ul>
);

const DropdownSection = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button
        className="flex items-center justify-between w-full mb-4 focus:outline-none border-y border-gray-100 xl:py-[11px] py-2 px-[5px]"
        onClick={() => setOpen(!open)}
      >
        <p className="font-medium text-black">{title}</p>
        <span className="text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transform transition-transform duration-300 ease-in-out ${
              open ? "rotate-180" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </span>
      </button>
      {open && <div className="px-[5px]">{children}</div>}
    </div>
  );
};

// Loading component for Suspense
const SearchPageLoading = () => (
  <div className="container px-4 py-8">
    <div className="flex flex-col xl:flex-row xl:gap-[34px]">
      <div className="relative w-full xl:w-1/4">
        <div className="animate-pulse">
          <div className="h-8 bg-grayu-100 rounded mb-4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-grayu-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full xl:w-4/5">
        <div className="animate-pulse">
          <div className="h-8 bg-grayu-100 rounded mb-4"></div>
          <div className="h-12 bg-grayu-100 rounded mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 bg-grayu-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main SearchPage component
const SearchPageContent = ({ slug }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Add mounted state to handle client-side rendering
  const [mounted, setMounted] = useState(false);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  const [sort, setSort] = useState("Best seller");
  const [sortDirection, setSortDirection] = useState("desc");
  const [activePage, setActivePage] = useState(1);
  const [pageSize] = useState(12); // Default page size
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    page_size: 12,
    pageCount: 1,
  });

  const [totalProducts, setTotalProducts] = useState(0);
  const [error, setError] = useState(null);

  // Initialize search query from pathname
  const initialSearchQuery = (() => {
    const segments = pathname.split("/");
    return segments[2] || "";
  })();

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  // Add a ref to track if price was changed by user
  const priceChangedByUser = React.useRef(false);

  // Map UI sort options to API filter keys
  const sortOptions = {
    "Best seller": "top_download",
    Newest: "newest",
    "Best rated": "top_rated",
    Trending: "trending",
    Price: "price",
  };

  // Update useEffect to handle sort from URL
  useEffect(() => {
    const sortFromUrl = searchParams.get("sort");
    if (sortFromUrl && sortOptions[sortFromUrl]) {
      setSort(sortFromUrl);
    }
  }, [searchParams]);

  // Update the sort button click handler
  const handleSortChange = (tab) => {
    if (sort === tab) {
      // Toggle direction if same tab clicked
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      // Set new tab and default direction
      setSort(tab);
      setSortDirection("desc");
    }
  };

  // Single state for price range
  const [priceRange, setPriceRange] = useState(() => {
    const min = searchParams.get("price_min");
    const max = searchParams.get("price_max");
    return [min ? parseInt(min) : 0, max ? parseInt(max) : 500];
  });

  // Handle price range changes
  const handlePriceChange = (newRange) => {
    priceChangedByUser.current = true;
    setPriceRange(newRange);
  };

  // Update URL when price range changes
  useEffect(() => {
    // Only update URL if price was changed by user
    if (priceChangedByUser.current) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("price_min", priceRange[0]);
      params.set("price_max", priceRange[1]);
      router.push(createOrderedUrl(params));
      priceChangedByUser.current = false;
    }
  }, [priceRange]);

  // Reset price range when price filter is removed from URL
  useEffect(() => {
    const min = searchParams.get("price_min");
    const max = searchParams.get("price_max");
    if (!min && !max) {
      setPriceRange([0, 500]);
    }
  }, [searchParams]);

  // Add debounce timer ref
  const debounceTimer = React.useRef(null);

  const [showSidebar, setShowSidebar] = useState(false);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("Sort by");

  const [filterLoading, setfilterLoading] = useState(true);
  const [filteredProducts, setfilteredProducts] = useState([]);

  const [filterData, setfilterData] = useState({
    categories: [],
    features: [],
    sales: [],
    tags: [],
  });

  const [searchFilterData, setsearchFilterData] = useState({
    categories: [],
    features: [],
    sales: [],
    tags: [],
  });

  const options = ["Best Seller", "Newest", "Best Rated", "Tranding", "Price"];

  // Add function to convert title to clean slug
  const titleToSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/[^a-z0-9-]/g, "") // Remove any characters that aren't letters, numbers, or hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
  };

  // Add function to convert slug back to title
  const slugToTitle = (slug) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Function to create URL with ordered parameters
  const createOrderedUrl = (params) => {
    const orderedParams = [];

    // Add parameters in specific order
    if (params.get("tags")) {
      orderedParams.push(`tags=${params.get("tags")}`);
    }
    if (params.get("sales")) {
      orderedParams.push(`sales=${params.get("sales")}`);
    }
    if (params.get("feature")) {
      orderedParams.push(`feature=${params.get("feature")}`);
    }
    if (params.get("price_min")) {
      orderedParams.push(`price_min=${params.get("price_min")}`);
    }
    if (params.get("price_max")) {
      orderedParams.push(`price_max=${params.get("price_max")}`);
    }

    return `/search${orderedParams.length > 0 ? "?" + orderedParams.join("&") : ""}`;
  };

  // Function to remove a filter
  const removeFilter = (type, value) => {
    const params = new URLSearchParams(searchParams.toString());

    switch (type) {
      case "tags":
        const currentTags = params.get("tags")?.split(",") || [];
        const newTags = currentTags.filter((tag) => tag !== value);
        if (newTags.length > 0) {
          params.set("tags", newTags.join(","));
        } else {
          params.delete("tags");
        }
        break;
      case "sales":
        const currentSales = params.get("sales")?.split(",") || [];
        const newSales = currentSales.filter((sale) => sale !== value);
        if (newSales.length > 0) {
          params.set("sales", newSales.join(","));
        } else {
          params.delete("sales");
        }
        break;
      case "feature":
        const currentFeatures = params.get("feature")?.split(",") || [];
        const newFeatures = currentFeatures.filter(
          (feature) => feature !== value
        );
        if (newFeatures.length > 0) {
          params.set("feature", newFeatures.join(","));
        } else {
          params.delete("feature");
        }
        break;
      case "price":
        params.delete("price_min");
        params.delete("price_max");
        setPriceRange([0, 500]); // Reset price range when removing price filter
        break;
    }

    router.push(createOrderedUrl(params));
  };

  // Function to clear all filters
  const clearAllFilters = () => {
    // Reset all states
    setSelectedSales([]);
    setSelectedFeatures([]);
    setPriceRange([0, 500]);
    priceChangedByUser.current = false;

    // Reset filter data selections
    setfilterData((prevData) => ({
      ...prevData,
      tags: prevData.tags?.map((tag) => ({ ...tag, selected: false })),
      sales: prevData.sales?.map((sale) => ({ ...sale, selected: false })),
      features: prevData.features?.map((feature) => ({
        ...feature,
        selected: false,
      })),
    }));

    setsearchFilterData((prevData) => ({
      ...prevData,
      tags: prevData.tags?.map((tag) => ({ ...tag, selected: false })),
      sales: prevData.sales?.map((sale) => ({ ...sale, selected: false })),
      features: prevData.features?.map((feature) => ({
        ...feature,
        selected: false,
      })),
    }));

    router.push("/search");
  };

  // Update handleTagChange
  const handleTagChange = (tagTitle) => {
    const currentTags = searchParams.get("tags")?.split(",") || [];
    const tagSlug = titleToSlug(tagTitle);
    let newTags;

    if (currentTags.includes(tagSlug)) {
      newTags = currentTags.filter((tag) => tag !== tagSlug);
    } else {
      newTags = [...currentTags, tagSlug];
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newTags.length > 0) {
      params.set("tags", newTags.join(","));
    } else {
      params.delete("tags");
    }

    router.push(createOrderedUrl(params));
  };

  // Update handleSalesChange
  const handleSalesChange = (saleTitle) => {
    const saleSlug = titleToSlug(saleTitle);
    let newSales;

    if (selectedSales.includes(saleSlug)) {
      newSales = selectedSales.filter((sale) => sale !== saleSlug);
    } else {
      newSales = [...selectedSales, saleSlug];
    }
    setSelectedSales(newSales);

    const params = new URLSearchParams(searchParams.toString());
    if (newSales.length > 0) {
      params.set("sales", newSales.join(","));
    } else {
      params.delete("sales");
    }
    router.push(createOrderedUrl(params));
  };

  // Update handleFeatureChange
  const handleFeatureChange = (featureTitle) => {
    const featureSlug = titleToSlug(featureTitle);
    let newFeatures;

    if (selectedFeatures.includes(featureSlug)) {
      newFeatures = selectedFeatures.filter(
        (feature) => feature !== featureSlug
      );
    } else {
      newFeatures = [...selectedFeatures, featureSlug];
    }
    setSelectedFeatures(newFeatures);

    const params = new URLSearchParams(searchParams.toString());
    if (newFeatures.length > 0) {
      params.set("feature", newFeatures.join(","));
    } else {
      params.delete("feature");
    }
    router.push(createOrderedUrl(params));
  };

  // Update sales state to be an array like tags
  const [selectedSales, setSelectedSales] = useState(() => {
    return searchParams.get("sales")?.split(",") || [];
  });

  const [selectedFeatures, setSelectedFeatures] = useState(() => {
    return searchParams.get("feature")?.split(",") || [];
  });

  // Helper function to safely parse API response
  const safeParseResponse = (response) => {
    try {
      if (!response) return null;

      // Ensure we have the basic structure
      const data = response?.data || [];
      const filter = response?.filter || {};
      const pagination = response?.pagination || {
        total: data.length,
        page: activePage,
        page_size: pageSize,
        pageCount: Math.ceil(data.length / pageSize),
      };

      return {
        data,
        filter,
        pagination,
      };
    } catch (err) {
      console.error("Error parsing API response:", err);
      return null;
    }
  };

  // Helper function to safely update filter data
  const safeUpdateFilterData = (filter, urlTags, sales, features) => {
    try {
      const updatedTags = (filter?.tags || []).map((tag) => ({
        ...tag,
        selected: urlTags.includes(tag?.title || ""),
      }));

      const updatedSales = (filter?.sales || []).map((sale) => ({
        ...sale,
        selected: sales.includes(sale?.title || ""),
      }));

      const updatedFeatures = (filter?.features || []).map((feature) => ({
        ...feature,
        selected: features.includes(feature?.title || ""),
      }));

      return {
        ...filter,
        tags: updatedTags,
        sales: updatedSales,
        features: updatedFeatures,
      };
    } catch (err) {
      console.error("Error updating filter data:", err);
      return {
        tags: [],
        sales: [],
        features: [],
        categories: [],
      };
    }
  };

  // Update useEffect to handle search term from path
  useEffect(() => {
    const fetchData = async () => {
      try {
        setfilterLoading(true);
        setError(null);

        // Get search term from pathname
        const segments = pathname.split("/");
        const searchFromPath = segments[2] || "";

        const urlTags =
          searchParams
            .get("tags")
            ?.split(",")
            .map((slug) => slugToTitle(slug)) || [];
        const priceMin = searchParams.get("price_min");
        const priceMax = searchParams.get("price_max");
        const sales =
          searchParams
            .get("sales")
            ?.split(",")
            .map((slug) => slugToTitle(slug)) || [];
        const features =
          searchParams
            .get("feature")
            ?.split(",")
            .map((slug) => slugToTitle(slug)) || [];

        // Update search query state from path
        setSearchQuery(searchFromPath);

        // Get current sort option and direction
        const currentSort = sortOptions[sort] || "top_download";
        const currentDirection = sortDirection;

        // Update selected states based on URL
        setSelectedSales(sales.map((slug) => titleToSlug(slug)));
        setSelectedFeatures(features.map((slug) => titleToSlug(slug)));

        // Prepare API request parameters
        const apiParams = {
          page_size: pageSize,
          page: activePage,
          shop: true,
          filter: currentSort,
          order: currentDirection,
        };

        // Check if we're in a category route
        if (segments[1] === "category") {
          // Add category as base parameter
          apiParams.base = segments[2];
        }

        // Add search term if it exists and we're not in a category
        if (searchFromPath && segments[1] !== "category") {
          apiParams.search = searchFromPath;
        }

        if (priceMin || priceMax) {
          apiParams.min_price = priceMin ? parseInt(priceMin) : 0;
          apiParams.max_price = priceMax ? parseInt(priceMax) : 150;
        }

        if (sales.length > 0) {
          apiParams.sales = sales.join(",");
          apiParams.on_sale = true;
        }

        if (urlTags.length > 0) {
          apiParams.tag = urlTags.join(",");
        }

        if (features.length > 0) {
          apiParams.feature = features.join(",");
        }

        // Log the filter parameters
        console.log("Filter Parameters:", {
          base: segments[1] === "category" ? segments[2] : undefined,
          search: segments[1] !== "category" ? searchFromPath : undefined,
          tags: urlTags,
          priceRange: {
            min: priceMin ? parseInt(priceMin) : undefined,
            max: priceMax ? parseInt(priceMax) : undefined,
          },
          sales: sales,
          features: features,
          sort: currentSort,
          order: currentDirection,
          page: activePage,
          pageSize,
        });

        const [filterResponse] = await Promise.all([
          strapiPost("product/filter", apiParams, themeConfig.TOKEN),
        ]);

        const parsedResponse = safeParseResponse(filterResponse);

        if (parsedResponse) {
          const { data, filter, pagination } = parsedResponse;

          // Update filter data with safe parsing
          const updatedFilterData = safeUpdateFilterData(
            filter,
            urlTags,
            sales,
            features
          );

          setfilterData(updatedFilterData);
          setsearchFilterData(updatedFilterData);
          setfilteredProducts(data);
          setTotalProducts(data.length);
          setPagination(pagination);

          // Log the filtered results
          console.log("Filtered Results:", {
            totalProducts: data.length,
            products: data,
            filterCounts: {
              tags: filter?.tags?.length || 0,
              sales: filter?.sales?.length || 0,
              features: filter?.features?.length || 0,
              categories: filter?.categories?.length || 0,
            },
            pagination,
          });
        } else {
          // Handle invalid response format
          setError("Invalid response format from server");
          setfilteredProducts([]);
          setTotalProducts(0);
          setPagination({
            total: 0,
            page: 1,
            page_size: pageSize,
            pageCount: 1,
          });
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
        setError(error.message || "An error occurred while fetching data");
        setfilteredProducts([]);
        setTotalProducts(0);
      } finally {
        setfilterLoading(false);
      }
    };

    fetchData();
  }, [searchParams, sort, sortDirection, pathname, activePage, pageSize]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setActivePage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const pages = [];
    const maxPages = Math.min(5, pagination.pageCount); // Show max 5 pages
    let startPage = Math.max(1, activePage - Math.floor(maxPages / 2));
    let endPage = startPage + maxPages - 1;

    if (endPage > pagination.pageCount) {
      endPage = pagination.pageCount;
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const filterTags = (event) => {
    const searchTerm = event.target.value;

    if (!searchTerm) {
      // If search term is empty, reset to the original list of tags
      setsearchFilterData((prevData) => ({
        ...prevData,
        tags: filterData.tags.map((tag) => ({ ...tag, selected: false })),
      }));
      return;
    }

    // Filter tags based on search term (case-insensitive)
    const filteredTags = filterData.tags.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Update the filtered tags in the state
    setsearchFilterData((prevData) => ({
      ...prevData,
      tags: filteredTags.map((tag) => ({ ...tag, selected: false })),
    }));
  };

  // Update search handler
  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchQuery(searchValue);
  };

  // Add submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateSearchInUrl();
  };

  // Function to update search in URL
  const updateSearchInUrl = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Remove search from params as it will be in the path
    params.delete("search");

    // Create URL with ordered parameters
    const orderedParams = [];

    // Add other parameters in specific order
    if (params.get("tags")) {
      orderedParams.push(`tags=${params.get("tags")}`);
    }
    if (params.get("sales")) {
      orderedParams.push(`sales=${params.get("sales")}`);
    }
    if (params.get("feature")) {
      orderedParams.push(`feature=${params.get("feature")}`);
    }
    if (params.get("price_min")) {
      orderedParams.push(`price_min=${params.get("price_min")}`);
    }
    if (params.get("price_max")) {
      orderedParams.push(`price_max=${params.get("price_max")}`);
    }

    // Create URL with search term in path
    const searchPath = searchQuery.trim()
      ? `/search/${searchQuery.trim()}`
      : "/search";
    const queryString =
      orderedParams.length > 0 ? "?" + orderedParams.join("&") : "";
    const newUrl = `${searchPath}${queryString}`;

    router.push(newUrl);
  };

  // Update the search form JSX
  const renderSearchForm = () => {
    const inputProps = {
      type: "text",
      placeholder: "Search for mockups, Web Templates and More.....",
      className:
        "w-full rounded-l sm:px-4 px-2.5 placeholder:text-gray-300 outline-none lg:h-10 h-9 p2",
    };

    if (mounted) {
      // Client-side rendering
      Object.assign(inputProps, {
        value: searchQuery,
        onChange: handleSearch,
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            updateSearchInUrl();
          }
        },
      });
    } else {
      // Server-side rendering
      Object.assign(inputProps, {
        defaultValue: initialSearchQuery,
        readOnly: true,
      });
    }

    const formContent = (
      <>
        <input {...inputProps} />
        <button
          type={mounted ? "submit" : "button"}
          className="bg-[#0156d5] text-white lg:py-3 py-2.5 px-[18px] rounded-r flex items-center justify-center"
        >
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
      </>
    );

    if (mounted) {
      return (
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center sm:mb-5 mb-2 border border-gray-100 rounded-[5px] overflow-hidden"
        >
          {formContent}
        </form>
      );
    }

    return (
      <div className="relative flex items-center sm:mb-5 mb-2 border border-gray-100 rounded-[5px] overflow-hidden">
        {formContent}
      </div>
    );
  };

  // Add this function after the createOrderedUrl function
  const createCategoryUrl = (
    categorySlug,
    searchTerm = "",
    existingParams = null
  ) => {
    // Create the base URL with category path
    let url = `/category/${categorySlug}`;
    const params = new URLSearchParams();

    // Add existing filters if they exist
    if (existingParams) {
      const currentParams = new URLSearchParams(existingParams);

      // Add tags
      if (currentParams.get("tags")) {
        params.set("tags", currentParams.get("tags"));
      }

      // Add sales
      if (currentParams.get("sales")) {
        params.set("sales", currentParams.get("sales"));
      }

      // Add features
      if (currentParams.get("feature")) {
        params.set("feature", currentParams.get("feature"));
      }

      // Add price range
      if (currentParams.get("price_min")) {
        params.set("price_min", currentParams.get("price_min"));
      }
      if (currentParams.get("price_max")) {
        params.set("price_max", currentParams.get("price_max"));
      }
    }

    // Append query string if we have any parameters
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  };

  return (
    <div className="container px-4 py-8">
      <div className="flex flex-col xl:flex-row xl:gap-[34px]">
        {/* Sidebar */}
        <div className="relative w-full xl:w-1/4">
          {/* Toggle button for mobile */}

          {/* Sidebar */}
          <aside
            className={`
fixed top-0 left-0 h-full bg-white shadow-lg p-4 overflow-y-auto
transition-transform duration-300 ease-in-out
${showSidebar ? "translate-x-0 z-50 w-[350px] max-w-full" : "-translate-x-full"}
xl:relative xl:translate-x-0 z-20 xl:p-0 xl:shadow-none xl:block
`}
          >
            <div className="flex items-center justify-between w-full">
              <h5 className="mb-[15px] px-[5px]">Filter</h5>
              {/* Close button for mobile */}
              <div className="flex justify-end mb-4 xl:hidden">
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-700 p-2 hover:bg-gray-100 rounded"
                  aria-label="Close sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="none"
                  >
                    <path
                      d="M13 13L7 7M7 7L1 1M7 7L13 1M7 7L1 13"
                      stroke="black"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="xl:space-y-[30px] space-y-7">
              {/* Categories Section */}
              {filterLoading ? (
                <DropdownSection title="Categories">
                  <CategorySkeleton />
                </DropdownSection>
              ) : filterData?.categories?.length > 0 ? (
                <DropdownSection title="Categories">
                  <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                    <li className="flex justify-between items-center rounded cursor-pointer group">
                      <Link
                        href="/search"
                        className={`p2 group-hover:text-primary flex-1 ${!searchParams.get("tags") && !searchParams.get("sales") && !searchParams.get("feature") && !searchParams.get("price_min") && !searchParams.get("price_max") ? "font-bold" : ""}`}
                      >
                        All Categories
                      </Link>
                      <span className="p2">
                        {filterData?.categories?.reduce(
                          (total, cat) => total + cat.products,
                          0
                        )}
                      </span>
                    </li>
                    {filterData?.categories?.map((cat, index) => {
                      const categorySlug = titleToSlug(cat.title);
                      const categoryUrl = createCategoryUrl(
                        categorySlug,
                        searchQuery,
                        searchParams.toString()
                      );

                      return (
                        <li
                          key={index}
                          className="flex justify-between items-center rounded cursor-pointer group"
                        >
                          <Link
                            href={categoryUrl}
                            className="p2 group-hover:text-primary flex-1"
                          >
                            {cat.title}
                          </Link>
                          <span className="p2">{cat.products}</span>
                        </li>
                      );
                    })}
                  </ul>
                </DropdownSection>
              ) : null}

              {/* Tags Section */}
              {filterLoading ? (
                <DropdownSection title="Tags">
                  <div className="w-full h-10 bg-grayu-100 rounded mb-3.5 animate-pulse"></div>
                  <FilterSkeleton />
                </DropdownSection>
              ) : filterData?.tags?.length > 0 ? (
                <DropdownSection title="Tags">
                  <input
                    onChange={(e) => filterTags(e)}
                    type="search"
                    id="search"
                    name="search"
                    className="w-full h-10 border border-gray-100 outline-none p-3 mb-3.5"
                    placeholder="Search tags here"
                  />
                  <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                    {searchFilterData?.tags?.map((tag, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              value={tag?.title}
                              checked={tag?.selected}
                              onChange={() => handleTagChange(tag.title)}
                              className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={15}
                              height={15}
                              viewBox="0 0 24 24"
                              className="absolute"
                            >
                              <path
                                fill="white"
                                d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                                strokeWidth={1.5}
                                stroke="white"
                              ></path>
                            </svg>
                          </div>
                          <span className="p2">{tag?.title}</span>
                        </label>
                        <span className="p2">{tag?.count}</span>
                      </li>
                    ))}
                  </ul>
                </DropdownSection>
              ) : null}

              {/* Price Section - Only show if there are products */}
              {totalProducts > 0 && (
                <DropdownSection title="Price">
                  <div className="flex flex-col gap-2 w-full h-full items-start justify-center">
                    <div className="w-full max-w-md">
                      <Slider
                        aria-label="Select a budget"
                        formatOptions={{ style: "currency", currency: "USD" }}
                        maxValue={1000}
                        minValue={0}
                        size="sm"
                        value={priceRange}
                        onChange={handlePriceChange}
                        step={10}
                      />
                      <div className="flex justify-between text-sm text-gray-700 mt-2">
                        <span>${priceRange[0]}</span>{" "}
                        <span>${priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </DropdownSection>
              )}

              {/* Sales Section */}
              {filterLoading ? (
                <DropdownSection title="Sales">
                  <FilterSkeleton />
                </DropdownSection>
              ) : filterData?.sales?.length > 0 ? (
                <DropdownSection title="Sales">
                  <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                    {filterData?.sales?.map((sale, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              value={sale.title}
                              checked={selectedSales.includes(
                                titleToSlug(sale.title)
                              )}
                              onChange={() => handleSalesChange(sale.title)}
                              className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={11}
                              height={11}
                              viewBox="0 0 24 24"
                              className="absolute"
                            >
                              <path
                                fill="white"
                                d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                                strokeWidth={3}
                                stroke="white"
                              ></path>
                            </svg>
                          </div>
                          <span className="p2">{sale.title}</span>
                        </label>
                        <span className="p2">{sale.count}</span>
                      </li>
                    ))}
                  </ul>
                </DropdownSection>
              ) : null}

              {/* Features Section */}
              {filterLoading ? (
                <DropdownSection title="Features">
                  <FilterSkeleton />
                </DropdownSection>
              ) : filterData?.features?.length > 0 ? (
                <DropdownSection title="Features">
                  <ul className="text-sm 1xl:space-y-[14px] space-y-3 h-44 pr-2 overflow-auto tags">
                    {filterData?.features?.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <label className="flex items-center 1xl:space-x-3 space-x-1.5 cursor-pointer">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              value={feature.title}
                              checked={selectedFeatures.includes(
                                titleToSlug(feature.title)
                              )}
                              onChange={() =>
                                handleFeatureChange(feature.title)
                              }
                              className="form-checkbox 1xl:h-[18px] 1xl:w-[18px] w-4 h-4 !rounded-[4px] border-gray-100 border appearance-none checked:bg-primary"
                            />
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width={11}
                              height={11}
                              viewBox="0 0 24 24"
                              className="absolute"
                            >
                              <path
                                fill="white"
                                d="m9.55 17.308l-4.97-4.97l.714-.713l4.256 4.256l9.156-9.156l.713.714z"
                                strokeWidth={3}
                                stroke="white"
                              ></path>
                            </svg>
                          </div>
                          <span className="p2">{feature.title}</span>
                        </label>
                        <span className="p2">{feature.count}</span>
                      </li>
                    ))}
                  </ul>
                </DropdownSection>
              ) : null}
            </div>
          </aside>
        </div>

        {/* Main section */}
        <main className="w-full xl:w-4/5">
          <h1 className="h2 mb-4">Website Templates</h1>
          {renderSearchForm()}

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-center my-4">{error}</div>
          )}

          {/* Filter Tabs */}
          <div className="flex items-center justify-between w-full sm:mb-6 mb-3">
            <div>
              <p className="p2">You found {totalProducts} Website Templates</p>
            </div>
            <div className="xl:flex hidden gap-2">
              {["Best seller", "Newest", "Best rated", "Trending", "Price"].map(
                (tab) => (
                  <button
                    key={tab}
                    className={`btn rounded font-normal flex items-center justify-center gap-[6px] ${
                      sort === tab
                        ? "bg-primary text-white border border-primary"
                        : "bg-white text-black border border-primary/10"
                    }`}
                    onClick={() => handleSortChange(tab)}
                  >
                    {tab}
                    {sort === tab && (
                      <span>
                        {sortDirection === "desc" ? (
                          // Down Arrow
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="8"
                            viewBox="0 0 9 6"
                            fill="none"
                          >
                            <path
                              d="M4.16979 5.07357C4.35861 5.23964 4.64139 5.23964 4.83021 5.07357L8.83021 1.55556C8.93814 1.46064 9 1.32385 9 1.18011V0.744831C9 0.314253 8.492 0.0850332 8.16916 0.369941L4.83084 3.31602C4.64182 3.48283 4.35818 3.48283 4.16916 3.31602L0.830842 0.36994C0.508002 0.0850325 0 0.314253 0 0.744832V1.18011C0 1.32385 0.061859 1.46064 0.169791 1.55556L4.16979 5.07357Z"
                              fill="white"
                            />
                          </svg>
                        ) : (
                          // Up Arrow
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="8"
                            viewBox="0 0 9 6"
                            fill="none"
                          >
                            <path
                              d="M4.83021 0.926427C4.64139 0.760364 4.35861 0.760364 4.16979 0.926427L0.169791 4.44444C0.061859 4.53936 0 4.67615 0 4.81989V5.25517C0 5.68575 0.508002 5.91497 0.830842 5.63006L4.16916 2.68398C4.35818 2.51717 4.64182 2.51717 4.83084 2.68398L8.16916 5.63006C8.492 5.91497 9 5.68575 9 5.25517V4.81989C9 4.67615 8.93814 4.53936 8.83021 4.44444L4.83021 0.926427Z"
                              fill="white"
                            />
                          </svg>
                        )}
                      </span>
                    )}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Add sort filter tag */}
          {searchParams.get("sort") && (
            <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
              <p className="p2 sm:px-2 px-1">
                Sort : <span className="!text-black">{sort}</span>
              </p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="27"
                height="27"
                viewBox="0 0 9 9"
                fill="none"
                className="px-2 flex-shrink-0 cursor-pointer"
                onClick={() => removeFilter("sort")}
              >
                <path
                  d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                  fill="#0156D5"
                />
              </svg>
            </div>
          )}

          {/* template categories */}
          <div className="flex items-center justify-between w-full xl:hidden sm:mb-6 mb-[15px] ">
            <button
              onClick={() => setShowSidebar(true)}
              className="xl:hidden py-[7px] sm:px-4 px-2.5 border border-primary/10 rounded-[4px] flex items-center justify-center gap-2 p2 "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="15"
                viewBox="0 0 14 15"
                fill="none"
              >
                <g clipPath="url(#clip0_778_1629)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 1.60294C0 1.31042 0.116202 1.02989 0.323044 0.823044C0.529886 0.616202 0.810423 0.5 1.10294 0.5H12.1324C12.4249 0.5 12.7054 0.616202 12.9122 0.823044C13.1191 1.02989 13.2353 1.31042 13.2353 1.60294V3.13676C13.2352 3.52676 13.0802 3.90075 12.8044 4.17647L8.82353 8.15735V13.6162C8.82355 13.7541 8.78832 13.8897 8.72119 14.0101C8.65405 14.1305 8.55725 14.2318 8.43996 14.3043C8.32267 14.3768 8.1888 14.4181 8.05105 14.4243C7.91331 14.4305 7.77626 14.4014 7.65294 14.3397L4.91985 12.9735C4.76718 12.8972 4.63879 12.7799 4.54905 12.6347C4.45931 12.4895 4.41177 12.3222 4.41176 12.1515V8.15735L0.430882 4.17647C0.155074 3.90075 8.32903e-05 3.52676 0 3.13676V1.60294Z"
                    fill="black"
                  />
                </g>
              </svg>
              Filters
            </button>

            <div className="relative inline-block text-left">
              <button
                onClick={() => setOpen(!open)}
                className="inline-flex items-center px-[15px] py-[7px] border border-primary/10 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-50 focus:outline-none"
              >
                {selected}
                <svg
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ease-in-out ${
                    open ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute z-10 right-0 mt-1 w-44 bg-white border border-gray-100 rounded-md shadow-md">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelected(option);
                        setOpen(false);
                      }}
                      className="block w-full text-left px-4 sm:py-2 py-1 text-sm text-black hover:bg-gray-100"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter tags section */}
          <div className="flex items-center justify-start w-full gap-2 flex-wrap mb-[25px]">
            {/* {searchParams.get('tags') && (
<>
<p className="p2 !text-black">1 items in</p>
<Link
href="/search"
className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary"
>
All Categories
</Link>
/<p className="p2 !text-black">Headless Templates</p>
</>
)} */}

            {/* Tags */}
            {searchParams
              .get("tags")
              ?.split(",")
              .map((tag, index) => (
                <div
                  key={`tag-${index}`}
                  className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0"
                >
                  <p className="p2 !text-black sm:px-2 px-1">
                    {slugToTitle(tag)}
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 9 9"
                    fill="none"
                    className="px-2 flex-shrink-0 cursor-pointer"
                    onClick={() => removeFilter("tags", tag)}
                  >
                    <path
                      d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                      fill="#0156D5"
                    />
                  </svg>
                </div>
              ))}

            {/* Sales */}
            {searchParams
              .get("sales")
              ?.split(",")
              .map((sale, index) => (
                <div
                  key={`sale-${index}`}
                  className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0"
                >
                  <p className="p2 sm:px-2 px-1">
                    Sales :{" "}
                    <span className="!text-black">{slugToTitle(sale)}</span>
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 9 9"
                    fill="none"
                    className="px-2 flex-shrink-0 cursor-pointer"
                    onClick={() => removeFilter("sales", sale)}
                  >
                    <path
                      d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                      fill="#0156D5"
                    />
                  </svg>
                </div>
              ))}

            {/* Features */}
            {searchParams
              .get("feature")
              ?.split(",")
              .map((feature, index) => (
                <div
                  key={`feature-${index}`}
                  className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0"
                >
                  <p className="p2 sm:px-2 px-1">
                    Feature :{" "}
                    <span className="!text-black">{slugToTitle(feature)}</span>
                  </p>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 9 9"
                    fill="none"
                    className="px-2 flex-shrink-0 cursor-pointer"
                    onClick={() => removeFilter("feature", feature)}
                  >
                    <path
                      d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                      fill="#0156D5"
                    />
                  </svg>
                </div>
              ))}

            {/* Price Range */}
            {(searchParams.get("price_min") ||
              searchParams.get("price_max")) && (
              <div className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0">
                <p className="p2 sm:px-2 px-1">
                  Price :{" "}
                  <span className="!text-black">
                    ${searchParams.get("price_min")} - $
                    {searchParams.get("price_max")}
                  </span>
                </p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  viewBox="0 0 9 9"
                  fill="none"
                  className="px-2 flex-shrink-0 cursor-pointer"
                  onClick={() => removeFilter("price")}
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="#0156D5"
                  />
                </svg>
              </div>
            )}

            {/* Clear All button - only show if there are any filters */}
            {(searchParams.get("tags") ||
              searchParams.get("sales") ||
              searchParams.get("feature") ||
              searchParams.get("price_min") ||
              searchParams.get("price_max")) && (
              <Link
                href="/search"
                className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary gap-2"
                onClick={(e) => {
                  e.preventDefault();
                  clearAllFilters();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="9"
                  height="9"
                  viewBox="0 0 9 9"
                  fill="none"
                >
                  <path
                    d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                    fill="#0156D5"
                  />
                </svg>
                Clear All
              </Link>
            )}
          </div>

          {/* Grid */}
          <div>
            {filterLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(12)].map((_, index) => (
                  <ProductDummyGrid key={index} />
                ))}
              </div>
            ) : filteredProducts?.length <= 0 ? (
              <div className="text-center">
                <p className="text-gray-200 p2">Search Result: No Products Found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredProducts?.map((product, index) => (
                  <ProductGrid key={index} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination - only show if we have products and no error */}
          {!error &&
            filteredProducts?.length > 0 &&
            pagination.total > pageSize && (
              <div className="flex justify-center sm:mt-[50px] mt-[30px] gap-2 text-sm">
                <button
                  className="px-3 py-1 w-10 h-10 border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(activePage - 1)}
                  disabled={activePage === 1}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="m11 6l-6 6l6 6m8-12l-6 6l6 6"
                    ></path>
                  </svg>
                </button>

                {generatePageNumbers().map((page) => (
                  <button
                    key={page}
                    className={`px-3 py-1 w-10 h-10 btn border rounded flex items-center justify-center ${
                      activePage === page ? "bg-primary text-white" : ""
                    }`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="px-3 py-1 w-10 h-10 btn border rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => handlePageChange(activePage + 1)}
                  disabled={activePage === pagination.pageCount}
                >
                  »
                </button>
              </div>
            )}
        </main>
      </div>
    </div>
  );
};

// Wrapper component with Suspense
export default function SearchPage({ slug }) {
  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageContent slug={slug} />
    </Suspense>
  );
}
