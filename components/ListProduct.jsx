"use client";

import { themeConfig } from "@/config/theamConfig";
import { useAuth } from "@/contexts/AuthContext";
import { strapiPost } from "@/lib/api/strapiClient";
import { formatDate } from "@/lib/formatDate";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  Image,
  Input,
  Link,
  Skeleton,
} from "@heroui/react";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { SearchIcon } from "./icons";

const statuses = [
  {
    label: "Authorised",
    value: "authorised",
    color: "text-primary",
  },
  {
    label: "Pending for Review",
    value: "pending-for-review",
    color: "text-[#ED9A12]",
  },
  {
    label: "Under Review",
    value: "under-review",
    color: "text-[#257C65]",
  },
  {
    label: "Declined",
    value: "declined",
    color: "text-[#C32D0B]",
  },
];

export default function ProductsPage({
  title = "",
  sub_title = "",
  button = {},
  filter = true,
}) {
  const formRef = useRef(null);
  const { authUser } = useAuth();
  const [activePage, setActivePage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [filterData, setFilterData] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounced setter using useCallback to ensure it's stable
  const debouncedInputChange = useCallback(
    debounce((name, value) => {
      setFilterData((prev) => ({ ...prev, [name]: value }));
      setActivePage(1)
    }, 300),
    [] // you can add dependencies if needed
  );

  // Actual input handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    debouncedInputChange(name, value);
  };

  const handleStatusChange = (value) => {
    if (value !== undefined) {
      setFilterData((prev) => ({ ...prev, status: value }));
      setActivePage(1)
    }
  };

  const removeFilter = (key) => {
    setFilterData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const clearAllFilters = (e) => {
    e.preventDefault();
    setFilterData({});
    if (formRef.current) {
      formRef.current.reset();
    }
  };

  const page_size = 5;

  useEffect(() => {
    const fetchProductData = async (id) => {
      try {
        setFilteredProducts([]);
        setLoading(true);

        // Prepare the payload as JSON
        const payload = {
          page_size: page_size,
          page: activePage,
          ...filterData,
        };

        // Call the API using the utility function
        const response = await strapiPost(`author-product/${id}`,
          payload,
          themeConfig.TOKEN
        );

        if (response.data) {
          const productsData = response.data || [];
          setPageCount(response.pagination.pageCount);
          setFilteredProducts(productsData);
        }
        // setError(null);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (authUser?.documentId) {
      fetchProductData(authUser?.documentId);
    }
  }, [filterData, authUser, activePage]);

  return (
    <div>
      {/* main page heading */}
      <div className="flex items-center justify-between flex-wrap w-full py-[27px] gap-y-3">
        <h1 className="h2">{title}</h1>
        {button && (
          <div>
            <Button
              onPress={() => {
                window.open(button?.link, "_blank");
              }}
              // href={button?.link}
              className="btn btn-primary 2xl:!px-5 !px-[18px] !py-[7px] flex items-center gap-[10px] group h-auto"
            >
              {button.icon && (
                <div dangerouslySetInnerHTML={{ __html: button.icon }} />
              )}
              {button?.label}
            </Button>
          </div>
        )}
      </div>

      <div className="border border-primary/10 rounded-md overflow-hidden bg-white">
        {/* sub heading */}
        <div className="border-b border-primary/10">
          <p className="text-black py-[6px] sm:px-5 px-4">{sub_title}</p>
        </div>

        {/* Filter Fields */}
        {filter && (
          <form
            ref={formRef}
            className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 sm:px-5 px-4 pt-[18px]"
          >
            {/* Product Name */}
            <div>
              <Input
                isRequired={false}
                name="search"
                classNames={{
                  input:
                    "xl:!text-base sm:!text-sm placeholder:!text-gray-300 placeholder:!font-light",
                  inputWrapper:
                    "block w-full rounded xl:px-5 md:px-4 px-3 xl:py-[23px] sm:py-[21px] py-[20px] !font-normal border outline-none flex",
                  label:
                    "2xl:!text-base md:!text-[15px] sm:!text-sm !text-black block sm:!pb-1 !font-normal",
                }}
                // value={filterData?.search || ""}
                onChange={handleInputChange}
                label="Product Name"
                labelPlacement="outside"
                placeholder="Type product name"
                type="text"
                variant="bordered"
                startContent={
                  <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                }
              />
            </div>

            {/* Status Filter */}
            <div>
              <Autocomplete
                name="status"
                className="!bg-white custom-auto-complete"
                classNames={{
                  mainWrapper: "!bg-white",
                  innerWrapper:
                    "border !border-gray-100 !bg-white 2xl:py-[11px] py-[10px] rounded-[5px] 1xl:px-5 px-3 w-full cursor-pointer flex justify-between items-center",
                  input:
                    "!2xl:text-base md:text-[15px] sm:text-sm !text-gray-300 placeholder:text-gray-300",
                  inputWrapper: "!bg-transparent",
                }}
                label="State"
                items={statuses}
                labelPlacement="outside"
                placeholder="Select State"
                // selectedKey={filterData?.status || ""}
                onSelectionChange={handleStatusChange}
              >
                {(item) => (
                  <AutocompleteItem key={item.value} value={item.value}>
                    {item.label}
                  </AutocompleteItem>
                )}
              </Autocomplete>
            </div>
          </form>
        )}

        {/* Filter tags */}
        {filterData &&
          Object.values(filterData).some(
            (value) => value !== null && value !== "" && value !== undefined
          ) && (
            <div className="flex items-center justify-start w-full gap-2 sm:px-5 px-4 flex-wrap pt-[18px]">
              <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 !text-black">
                Applied Filters:
              </p>

              {Object.entries(filterData).map(([key, value]) => {
                if (
                  !value ||
                  value === undefined ||
                  value === null ||
                  value === ""
                )
                  return null;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-center divide-x divide-primary/10 bg-blue-300 border border-primary/10 p-[1px] rounded-[4px] flex-shrink-0"
                  >
                    <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 sm:px-2 px-1">
                      {key}: <span className="!text-black">{value}</span>
                    </p>
                    <button onClick={() => removeFilter(key)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="27"
                        height="27"
                        viewBox="0 0 9 9"
                        fill="none"
                        className="px-2 flex-shrink-0 cursor-pointer"
                      >
                        <path
                          d="M8.80065 0.206172C8.7375 0.142889 8.66249 0.0926821 8.5799 0.0584261C8.49732 0.02417 8.40879 0.00653721 8.31939 0.00653721C8.22999 0.00653721 8.14146 0.02417 8.05888 0.0584261C7.97629 0.0926821 7.90128 0.142889 7.83813 0.206172L4.5 3.53747L1.16187 0.199346C1.09867 0.136145 1.02364 0.086012 0.941068 0.0518081C0.858492 0.0176043 0.769989 6.65925e-10 0.68061 0C0.591231 -6.65925e-10 0.502727 0.0176043 0.420151 0.0518081C0.337576 0.086012 0.262546 0.136145 0.199346 0.199346C0.136145 0.262546 0.086012 0.337576 0.0518081 0.420151C0.0176043 0.502727 -6.65925e-10 0.591231 0 0.68061C6.65925e-10 0.769989 0.0176043 0.858492 0.0518081 0.941068C0.086012 1.02364 0.136145 1.09867 0.199346 1.16187L3.53747 4.5L0.199346 7.83813C0.136145 7.90133 0.086012 7.97636 0.0518081 8.05893C0.0176043 8.14151 0 8.23001 0 8.31939C0 8.40877 0.0176043 8.49727 0.0518081 8.57985C0.086012 8.66242 0.136145 8.73745 0.199346 8.80065C0.262546 8.86385 0.337576 8.91399 0.420151 8.94819C0.502727 8.9824 0.591231 9 0.68061 9C0.769989 9 0.858492 8.9824 0.941068 8.94819C1.02364 8.91399 1.09867 8.86385 1.16187 8.80065L4.5 5.46253L7.83813 8.80065C7.90133 8.86385 7.97636 8.91399 8.05893 8.94819C8.14151 8.9824 8.23001 9 8.31939 9C8.40877 9 8.49727 8.9824 8.57985 8.94819C8.66242 8.91399 8.73745 8.86385 8.80065 8.80065C8.86385 8.73745 8.91399 8.66242 8.94819 8.57985C8.9824 8.49727 9 8.40877 9 8.31939C9 8.23001 8.9824 8.14151 8.94819 8.05893C8.91399 7.97636 8.86385 7.90133 8.80065 7.83813L5.46253 4.5L8.80065 1.16187C9.06006 0.902469 9.06006 0.465577 8.80065 0.206172Z"
                          fill="black"
                        />
                      </svg>
                    </button>
                  </div>
                );
              })}

              <Link
                href="/"
                onClick={clearAllFilters}
                className="2xl:!text-base sm:!text-[15px] !text-sm all-btn inline-flex items-center border-b border-transparent hover:border-primary gap-2 hover:opacity-100"
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
                </svg>{" "}
                Clear All
              </Link>
            </div>
          )}

        {/* Filter line */}
        <div className="border-b border-primary/10 pt-[18px]" />

        {/* Products list */}
        <Card className="!shadow-none !max-w-full">
          <CardBody className="sm:px-5 px-4 pt-0">
            {!loading && filteredProducts?.length > 0 ?
              filteredProducts?.length > 0 ?
                filteredProducts.map((product, index, arr) => {
                  return (
                    <div
                      className={
                        index !== arr.length - 1 ? "border-b border-gray-100" : ""
                      }
                      key={index}
                    >
                      <ProductItem {...product} />
                    </div>
                  );
                })
                :
                <div className="flex justify-center items-center h-[343px]">
                  <p>No data is currently available.</p>
                </div>
              : (
                <div>
                  {Array.from({ length: 9 }).map((_, index) => (
                    <div
                      key={index}
                      className="border-b border-gray-100 py-[18px]"
                    >
                      <div className="flex md:flex-row flex-col gap-[18px] product-image">
                        <Skeleton className="rounded-[3px] md:!w-[100px] w-[100px] md:!h-[120px] h-[120px] flex-shrink-0" />

                        <div className="flex-1">
                          <div className="flex lg:items-center items-start justify-between lg:flex-row flex-col gap-2 w-full">
                            <Skeleton className="h-7 sm:w-[250px] w-full" />

                            <div className="flex items-center">
                              <div className="flex items-center sm:gap-2 gap-1">
                                <Skeleton className="w-5 h-5 rounded-full" />
                                <Skeleton className="w-[120px] h-5" />
                              </div>
                              <span className="xl:mx-3 lg:mx-2 mx-1.5 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100"></span>
                              <div className="flex items-center sm:gap-2 gap-1">
                                <Skeleton className="w-5 h-5 rounded-full" />
                                <Skeleton className="w-[120px] h-5" />
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-sm 1xl:py-[14px] py-[11px]">
                            <Skeleton className="w-[80px] h-5" />
                            <Skeleton className="w-[80px] h-5" />
                          </div>

                          <div className="flex xl:items-center items-start xl:flex-row flex-col justify-between w-full">
                            <div className="flex sm:items-center items-start sm:flex-row flex-col gap-y-2">
                              <div className="flex items-center gap-1">
                                <Skeleton className="w-7 h-7 rounded-full" />
                                <Skeleton className="w-[60px] h-5" />
                              </div>
                              <span className="xl:mx-3 mx-2 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100 sm:block hidden"></span>

                              <div className="flex items-center gap-x-2">
                                <Skeleton className="w-5 h-5 rounded-full" />
                                <Skeleton className="w-[140px] h-5" />
                              </div>
                              <span className="xl:mx-3 mx-2 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100 sm:block hidden"></span>

                              <div className="flex items-center gap-x-2">
                                <Skeleton className="w-5 h-5 rounded-full" />
                                <Skeleton className="w-[100px] h-5" />
                              </div>
                            </div>

                            <div className="flex gap-2 mt-2 flex-wrap">
                              <Skeleton className="w-[80px] h-9 rounded-md" />
                              <Skeleton className="w-[100px] h-9 rounded-md" />
                              <Skeleton className="w-[90px] h-9 rounded-md" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
          </CardBody>
        </Card>

        <div className="border-b border-primary/10" />

        <div className="flex justify-between items-center sm:my-[30px] my-[10px] sm:px-5 px-4 gap-2 text-sm">
          <div className="flex gap-2 text-sm">
            <p className="text-black font-normal">Page {activePage} of {pageCount}</p>
          </div>
          {pageCount > 0 && <div className="flex gap-2 text-sm">
            <button
              className="px-3 py-1 w-10 h-10 border border-gray-100 rounded flex items-center justify-center"
              onClick={() => {
                setActivePage((prev) => Math.max(1, prev - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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

            {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                className={`px-3 py-1 w-10 h-10 btn border border-gray-100 rounded flex items-center justify-center ${activePage === page ? "bg-primary text-white" : ""
                  }`}
                onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); setActivePage(page); }}
              >
                {page}
              </button>
            ))}

            <button
              className="px-3 py-1 w-10 h-10 btn border border-gray-100 rounded flex items-center justify-center"
              onClick={() => {
                setActivePage((prev) => Math.min(Array.from({ length: pageCount }, (_, index) => index + 1).length, prev + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
              }
            >
              »
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
}

// product list start
const ProductItem = ({
  grid_image = {},
  title,
  price,
  sell = 0,
  documentId,
  categories = [],
  updatedAt,
  note = {},
  product_status = "",
  product_zip_url = "",
  product_zip = {},
}) => {
  const [showContent, setShowContent] = useState(false);

  function getStatusBySlug(get) {
    return statuses.find((status) => status.value === get);
  }

  const statusData = getStatusBySlug(product_status);

  return (
    <div className="py-[18px]">
      <div className="flex md:flex-row flex-col gap-[18px] product-image">
        {/* product image */}
        {grid_image?.url && (
          <Image
            src={grid_image.url}
            alt="Preview"
            width={100}
            height={120}
            className="rounded-[3px] md:!w-full w-[100px] md:!h-[120px] !h-full flex-shrink-0"
          />
        )}
        <div className="flex-1">
          <div className="flex lg:items-center items-start justify-between lg:flex-row flex-col gap-2 w-full">
            {/* product title */}
            {title && (
              <h3 className="sm:text-lg text-[17px] sm:leading-7 leading-6 font-medium !text-black">
                {title}
              </h3>
            )}
            {/* purchase and item sale */}
            <div className="text-sm text-muted-foreground flex items-center">
              <span className="flex items-center sm:gap-2 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="xl:w-5 xl:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M6.91268 7.04716V4.09189C6.91268 2.45975 8.29594 1.13663 10.0023 1.13663C11.7086 1.13663 13.0919 2.45975 13.0919 4.09189V7.04716M3.82308 5.07698H16.1815L17.2113 17.8831H2.79321L3.82308 5.07698Z"
                    stroke="#0156D5"
                    strokeWidth="1.36397"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="2xl:text-[15px] text-sm text-gray-200">
                  Purchases:{" "}
                  <span className="text-black font-medium">{sell || 0}</span>
                </span>
              </span>
              <span className="xl:mx-3 lg:mx-2 mx-1.5 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100"></span>
              <span className="flex items-center sm:gap-2 gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="xl:w-5 xl:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M10.0001 18.3358C14.6026 18.3358 18.3334 14.6049 18.3334 10.0024C18.3334 5.39993 14.6026 1.6691 10.0001 1.6691C5.39758 1.6691 1.66675 5.39993 1.66675 10.0024C1.66675 14.6049 5.39758 18.3358 10.0001 18.3358Z"
                    stroke="#0156D5"
                    strokeWidth="1.26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.5 7.08575C11.9292 6.51492 10.9242 6.11825 10 6.09325M10 6.09325C8.9 6.06325 7.91667 6.56075 7.91667 7.91909C7.91667 10.4191 12.5 9.16909 12.5 11.6691C12.5 13.0949 11.28 13.7074 10 13.6616M10 6.09325V4.58575M7.5 12.5024C8.03667 13.2191 9.03583 13.6274 10 13.6616M10 13.6616V15.4191"
                    stroke="#0156D5"
                    strokeWidth="1.26"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="2xl:text-[15px] text-sm text-gray-200">
                  Item Sales:{" "}
                  <span className="text-black font-medium">
                    ${sell * price.regular_price}
                  </span>
                </span>
              </span>
            </div>
          </div>
          {/* product's both price */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground 1xl:py-[14px] py-[11px]">
            <p className="text-primary font-medium">${price?.sales_price}.00</p>
            {price?.sales_price && (
              <>
                <span className="line-through text-sm text-gray-200">
                  ${price?.regular_price}.00
                </span>
              </>
            )}
          </div>
          <div className="flex xl:items-center items-start xl:flex-row flex-col justify-between w-full">
            <div className="flex sm:items-center items-start sm:flex-row flex-col gap-y-2">
              {/* tool */}
              <div className="flex items-center gap-1">
                {categories &&
                  categories.map((category_data, index) => {
                    return (
                      <React.Fragment key={index}>
                        <div className="flex items-center justify-center border border-gray-100 rounded-full xl:w-7 xl:h-7 w-6 h-6">
                          <Image
                            src={category_data?.cover?.url}
                            alt=""
                            width={20}
                            height={20}
                            className="opaimages-100"
                          />
                        </div>
                        <span className="2xl:text-[15px] text-sm text-gray-200">
                          {category_data.title}
                        </span>
                      </React.Fragment>
                    );
                  })}
              </div>
              <span className="xl:mx-3 mx-2 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100 sm:block hidden"></span>
              {/* updates */}
              <span className="flex items-center gap-x-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <g clipPath="url(#clip0_3017_699)">
                    <path
                      d="M8.00366 15C11.8697 15 15.0037 11.866 15.0037 8C15.0037 4.13401 11.8697 1 8.00366 1C4.13767 1 1.00366 4.13401 1.00366 8C1.00366 11.866 4.13767 15 8.00366 15Z"
                      stroke="#0156D5"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.1037 10.8L8.41386 9.11019C8.15129 8.8477 8.00374 8.49166 8.00366 8.12039V3.79999"
                      stroke="#0156D5"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>
                <span className="2xl:text-[15px] text-sm text-gray-200">
                  Last Update:{" "}
                  <span className="text-primary">{formatDate(updatedAt)}</span>
                </span>
              </span>
              <span className="xl:mx-3 mx-2 text-gray-100 h-[19px] w-[0.5px] border-r border-gray-100 sm:block hidden"></span>

              {/* status */}
              <span className="flex items-center gap-x-2 2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="flex-shrink-0"
                >
                  <g clipPath="url(#clip0_3166_55)">
                    <path
                      d="M15.1932 0.815347C14.67 0.293232 13.9611 0 13.222 0C12.4828 0 11.7739 0.293232 11.2507 0.815347L6.02598 6.04006C5.95848 6.10736 5.90755 6.18943 5.87723 6.27979L4.34055 10.8898C4.30434 10.9981 4.29901 11.1143 4.32514 11.2255C4.35128 11.3366 4.40785 11.4383 4.48851 11.519C4.56918 11.5998 4.67075 11.6566 4.78184 11.6829C4.89293 11.7092 5.00916 11.704 5.11749 11.668L9.72754 10.1313C9.81834 10.1012 9.90084 10.0502 9.96849 9.98258L15.1932 4.75786C15.7153 4.23468 16.0086 3.52574 16.0086 2.7866C16.0086 2.04747 15.7153 1.33852 15.1932 0.815347ZM12.1198 1.68449C12.4137 1.39977 12.8077 1.24199 13.2169 1.24522C13.626 1.24844 14.0175 1.41241 14.3068 1.70173C14.5961 1.99106 14.7601 2.38254 14.7633 2.79169C14.7666 3.20084 14.6088 3.59486 14.3241 3.88871L9.20138 9.01016L5.89444 10.1129L6.99716 6.80595L12.1198 1.68449ZM7.38195 2.47865C7.53275 2.47865 7.68273 2.48398 7.83189 2.49463L8.9174 1.40912C7.36146 1.0783 5.74026 1.25935 4.29564 1.92525C2.85101 2.59116 1.66036 3.70624 0.90129 5.10417C0.142224 6.5021 -0.144583 8.10796 0.0836501 9.68223C0.311884 11.2565 1.04293 12.7148 2.16774 13.8396C3.29254 14.9644 4.75084 15.6954 6.3251 15.9237C7.89936 16.1519 9.50522 15.8651 10.9032 15.106C12.3011 14.347 13.4162 13.1563 14.0821 11.7117C14.748 10.2671 14.929 8.64587 14.5982 7.08993L13.5127 8.17667C13.5233 8.32419 13.5287 8.47376 13.5287 8.62538C13.5287 9.84109 13.1682 11.0295 12.4928 12.0403C11.8174 13.0511 10.8574 13.839 9.7342 14.3042C8.61103 14.7694 7.37513 14.8912 6.18278 14.654C4.99043 14.4168 3.89519 13.8314 3.03555 12.9718C2.17592 12.1121 1.5905 11.0169 1.35333 9.82455C1.11615 8.6322 1.23788 7.3963 1.70311 6.27313C2.16834 5.14996 2.95618 4.18997 3.96701 3.51456C4.97783 2.83915 6.16624 2.47865 7.38195 2.47865Z"
                      fill="#0156D5"
                    />
                  </g>
                </svg>
                <span className="2xl:text-[15px] text-sm text-gray-200">
                  Status:
                </span>
                <div className="flex items-center gap-1">
                  <span className={`${statusData?.color}`}>
                    {statusData?.label}
                  </span>
                  {/* declined icon */}
                  {product_status === "declined" && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_3421_26)">
                        <path
                          d="M7.5 13.5938C10.8655 13.5938 13.5938 10.8655 13.5938 7.5C13.5938 4.13451 10.8655 1.40625 7.5 1.40625C4.13451 1.40625 1.40625 4.13451 1.40625 7.5C1.40625 10.8655 4.13451 13.5938 7.5 13.5938Z"
                          stroke="#C32D0B"
                          strokeWidth="1.4"
                          strokeMiterlimit="10"
                        />
                        <path
                          d="M3.19092 3.19104L11.8089 11.809"
                          stroke="#C32D0B"
                          strokeWidth="1.4"
                          strokeMiterlimit="10"
                        />
                      </g>
                    </svg>
                  )}
                </div>
                {note.message && (
                  <div className="mt-1.5">
                    {product_status ? (
                      <>
                        <button
                          onClick={() => setShowContent(!showContent)}
                          type="button"
                        >
                          <svg
                            width="16"
                            height="16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cart-service-tooltip-icon"
                          >
                            <path
                              d="M8 0a8 8 0 000 16A8 8 0 008 0zm0 14.55a6.55 6.55 0 11.01-13.11A6.55 6.55 0 018 14.54z"
                              fill="#90A4AE"
                            ></path>
                            <path
                              d="M8 3.4a.97.97 0 100 1.94.97.97 0 000-1.95zM8 6.79c-.4 0-.73.32-.73.73v4.36a.73.73 0 001.46 0V7.52c0-.4-.33-.73-.73-.73z"
                              fill="#90A4AE"
                            ></path>
                          </svg>
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-400">No status</span>
                    )}
                  </div>
                )}
              </span>
            </div>
            {/* buttons */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {/* edit */}
              <Button
                // href={slug + "/" + id}
                onPress={() => {
                  window.open(`edit/${documentId}`, "_blank");
                }}
                target="_blank"
                size="sm"
                variant="flat"
                className="btn btn-outline-primary !border-primary/10 !py-2 !px-3 !text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="stroke-primary group-hover:stroke-white"
                >
                  <path
                    d="M1.90469 9.47525L1.21875 12.219L3.96249 11.5331L11.9097 3.58581C12.1669 3.32855 12.3114 2.97967 12.3114 2.6159C12.3114 2.25213 12.1669 1.90325 11.9097 1.64599L11.7918 1.52801C11.5345 1.27082 11.1856 1.12634 10.8218 1.12634C10.4581 1.12634 10.1092 1.27082 9.85193 1.52801L1.90469 9.47525Z"
                    fill="white"
                    strokeWidth="1.54335"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M1.90469 9.47526L1.21875 12.219L3.96249 11.5331L10.8218 4.67371L8.76404 2.61591L1.90469 9.47526Z"
                    fill="#0156D5"
                  />
                  <path
                    d="M8.76372 2.61591L10.8215 4.67371L8.76372 2.61591ZM7.39185 12.219H12.8793H7.39185Z"
                    fill="#0156D5"
                  />
                  <path
                    d="M8.76372 2.61591L10.8215 4.67371M7.39185 12.219H12.8793"
                    strokeWidth="1.54335"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Edit
              </Button>
              {/* download */}
              <Button
                onPress={() => {
                  if (product_zip) {
                    window.open(product_zip?.url, "_blank");
                  } else {
                    window.open(product_zip_url, "_blank");
                  }
                }}
                target="_blank"
                size="sm"
                variant="flat"
                className="btn btn-outline-primary !border-primary/10 !py-2 !px-3 !text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="fill-primary group-hover:fill-white"
                >
                  <g clipPath="url(#clip0_3007_2985)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M7.77804 6.33889V0.777778C7.77804 0.571498 7.6961 0.373667 7.55024 0.227806C7.40438 0.0819442 7.20655 0 7.00027 0C6.79399 0 6.59616 0.0819442 6.45029 0.227806C6.30443 0.373667 6.22249 0.571498 6.22249 0.777778V6.33889L4.49582 4.17978C4.43325 4.09648 4.35457 4.0266 4.26447 3.9743C4.17437 3.92199 4.07468 3.88831 3.97132 3.87527C3.86795 3.86224 3.76302 3.87009 3.66275 3.89839C3.56249 3.92668 3.46892 3.97483 3.38762 4.03997C3.30632 4.10512 3.23893 4.18594 3.18946 4.27763C3.13999 4.36932 3.10945 4.47001 3.09964 4.57373C3.08984 4.67745 3.10097 4.78209 3.13238 4.88142C3.16379 4.98076 3.21484 5.07277 3.28249 5.152L6.3936 9.04089C6.46648 9.13173 6.55883 9.20504 6.66383 9.25542C6.76883 9.3058 6.88381 9.33195 7.00027 9.33195C7.11673 9.33195 7.2317 9.3058 7.3367 9.25542C7.44171 9.20504 7.53405 9.13173 7.60693 9.04089L10.718 5.152C10.7857 5.07277 10.8367 4.98076 10.8682 4.88142C10.8996 4.78209 10.9107 4.67745 10.9009 4.57373C10.8911 4.47001 10.8605 4.36932 10.8111 4.27763C10.7616 4.18594 10.6942 4.10512 10.6129 4.03997C10.5316 3.97483 10.438 3.92668 10.3378 3.89839C10.2375 3.87009 10.1326 3.86224 10.0292 3.87527C9.92585 3.88831 9.82616 3.92199 9.73606 3.9743C9.64596 4.0266 9.56729 4.09648 9.50471 4.17978L7.77804 6.33889Z"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M5.17767 10.0131L3.38956 7.77777H1.55556C1.143 7.77777 0.747335 7.94166 0.455612 8.23338C0.163888 8.52511 0 8.92077 0 9.33333V12.4444C0 12.857 0.163888 13.2527 0.455612 13.5444C0.747335 13.8361 1.143 14 1.55556 14H12.4444C12.857 14 13.2527 13.8361 13.5444 13.5444C13.8361 13.2527 14 12.857 14 12.4444V9.33333C14 8.92077 13.8361 8.52511 13.5444 8.23338C13.2527 7.94166 12.857 7.77777 12.4444 7.77777H10.6104L8.82156 10.0131C8.60295 10.2863 8.3257 10.5069 8.01033 10.6584C7.69495 10.81 7.34952 10.8887 6.99961 10.8887C6.6497 10.8887 6.30427 10.81 5.9889 10.6584C5.67352 10.5069 5.39627 10.2863 5.17767 10.0131ZM10.8889 10.1111C10.6826 10.1111 10.4848 10.193 10.3389 10.3389C10.1931 10.4848 10.1111 10.6826 10.1111 10.8889C10.1111 11.0952 10.1931 11.293 10.3389 11.4389C10.4848 11.5847 10.6826 11.6667 10.8889 11.6667H10.8967C11.1029 11.6667 11.3008 11.5847 11.4466 11.4389C11.5925 11.293 11.6744 11.0952 11.6744 10.8889C11.6744 10.6826 11.5925 10.4848 11.4466 10.3389C11.3008 10.193 11.1029 10.1111 10.8967 10.1111H10.8889Z"
                    />
                  </g>
                </svg>
                Download
              </Button>
              {/* remove */}
              {/* <Button
                size="sm"
                color="danger"
                variant="flat"
                className="btn btn-outline-primary !border-primary/10 !py-2 !px-3 !text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  className="fill-primary group-hover:fill-white"
                >
                  <g clipPath="url(#clip0_3017_2)">
                    <path d="M5.6 2.8H8.4C8.4 2.4287 8.2525 2.0726 7.98995 1.81005C7.7274 1.5475 7.3713 1.4 7 1.4C6.6287 1.4 6.2726 1.5475 6.01005 1.81005C5.7475 2.0726 5.6 2.4287 5.6 2.8ZM4.2 2.8C4.2 2.05739 4.495 1.3452 5.0201 0.820101C5.5452 0.294999 6.25739 0 7 0C7.74261 0 8.4548 0.294999 8.9799 0.820101C9.505 1.3452 9.8 2.05739 9.8 2.8H13.3C13.4857 2.8 13.6637 2.87375 13.795 3.00503C13.9263 3.1363 14 3.31435 14 3.5C14 3.68565 13.9263 3.8637 13.795 3.99497C13.6637 4.12625 13.4857 4.2 13.3 4.2H12.6826L12.0624 11.438C12.0028 12.1369 11.683 12.788 11.1663 13.2624C10.6496 13.7369 9.97366 14.0001 9.2722 14H4.7278C4.02634 14.0001 3.35039 13.7369 2.8337 13.2624C2.31702 12.788 1.99722 12.1369 1.9376 11.438L1.3174 4.2H0.7C0.514348 4.2 0.336301 4.12625 0.205025 3.99497C0.0737498 3.8637 0 3.68565 0 3.5C0 3.31435 0.0737498 3.1363 0.205025 3.00503C0.336301 2.87375 0.514348 2.8 0.7 2.8H4.2ZM9.1 7C9.1 6.81435 9.02625 6.6363 8.89497 6.50503C8.7637 6.37375 8.58565 6.3 8.4 6.3C8.21435 6.3 8.0363 6.37375 7.90503 6.50503C7.77375 6.6363 7.7 6.81435 7.7 7V9.8C7.7 9.98565 7.77375 10.1637 7.90503 10.295C8.0363 10.4263 8.21435 10.5 8.4 10.5C8.58565 10.5 8.7637 10.4263 8.89497 10.295C9.02625 10.1637 9.1 9.98565 9.1 9.8V7ZM5.6 6.3C5.41435 6.3 5.2363 6.37375 5.10503 6.50503C4.97375 6.6363 4.9 6.81435 4.9 7V9.8C4.9 9.98565 4.97375 10.1637 5.10503 10.295C5.2363 10.4263 5.41435 10.5 5.6 10.5C5.78565 10.5 5.9637 10.4263 6.09497 10.295C6.22625 10.1637 6.3 9.98565 6.3 9.8V7C6.3 6.81435 6.22625 6.6363 6.09497 6.50503C5.9637 6.37375 5.78565 6.3 5.6 6.3Z" />
                  </g>
                </svg>
                Remove
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      {showContent && (
        <div className="mt-2 w-full">
          {(() => {
            switch (product_status) {
              case "pending-for-review":
                return (
                  <div className="rounded-[4px] flex items-start gap-3 py-[14px] px-4 bg-[#ED9A12]/20 z-50 relative warning">
                    <div className="flex items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <rect
                          x="0.65"
                          y="0.65"
                          width="28.7"
                          height="28.7"
                          rx="14.35"
                          stroke="#ED9A12"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M3.75 15C3.75 8.78654 8.78654 3.75 15 3.75C21.2135 3.75 26.25 8.78654 26.25 15C26.25 21.2135 21.2135 26.25 15 26.25C8.78654 26.25 3.75 21.2135 3.75 15ZM15.8654 8.07692C15.8654 7.84741 15.7742 7.62729 15.6119 7.465C15.4496 7.30271 15.2295 7.21154 15 7.21154C14.7705 7.21154 14.5504 7.30271 14.3881 7.465C14.2258 7.62729 14.1346 7.84741 14.1346 8.07692V15C14.1346 15.1615 14.1808 15.3208 14.2662 15.4592L17.1508 20.0746C17.2726 20.2692 17.4667 20.4075 17.6904 20.459C17.9142 20.5105 18.1492 20.471 18.3438 20.3492C18.5385 20.2274 18.6767 20.0333 18.7282 19.8096C18.7797 19.5858 18.7403 19.3508 18.6185 19.1562L15.8654 14.7519V8.07692Z"
                          className="fill-[#ED9A12]"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-[6px] overflow-auto">
                      <h6 className="p !font-medium !text-black break-all">
                        Product currently waiting for review
                      </h6>
                      <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 break-words">
                        {note?.message}
                      </p>
                    </div>
                  </div>
                );
              case "under-review":
                return (
                  <div className="rounded-[4px] flex items-start gap-3 py-[14px] px-4 bg-[#257C65]/20 z-50 relative reviewed">
                    <div className="flex items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <rect
                          x="0.65"
                          y="0.65"
                          width="28.7"
                          height="28.7"
                          rx="14.35"
                          stroke="#257C65"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M3.75 15C3.75 8.78654 8.78654 3.75 15 3.75C21.2135 3.75 26.25 8.78654 26.25 15C26.25 21.2135 21.2135 26.25 15 26.25C8.78654 26.25 3.75 21.2135 3.75 15ZM15.8654 8.07692C15.8654 7.84741 15.7742 7.62729 15.6119 7.465C15.4496 7.30271 15.2295 7.21154 15 7.21154C14.7705 7.21154 14.5504 7.30271 14.3881 7.465C14.2258 7.62729 14.1346 7.84741 14.1346 8.07692V15C14.1346 15.1615 14.1808 15.3208 14.2662 15.4592L17.1508 20.0746C17.2726 20.2692 17.4667 20.4075 17.6904 20.459C17.9142 20.5105 18.1492 20.471 18.3438 20.3492C18.5385 20.2274 18.6767 20.0333 18.7282 19.8096C18.7797 19.5858 18.7403 19.3508 18.6185 19.1562L15.8654 14.7519V8.07692Z"
                          className="fill-[#257C65]"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-[6px] overflow-auto">
                      <h6 className="p !font-medium !text-black break-all">
                        Product currently waiting for review
                      </h6>
                      <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 break-words">
                        {note?.message}
                      </p>
                    </div>
                  </div>
                );
              case "declined":
                return (
                  <div className="rounded-[4px] flex items-start gap-3 py-[14px] px-4 bg-[#C32D0B]/20 z-50 relative error">
                    <div className="flex items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <rect
                          x="0.65"
                          y="0.65"
                          width="28.7"
                          height="28.7"
                          rx="14.35"
                          stroke="#C32D0B"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M3.75 15C3.75 8.78654 8.78654 3.75 15 3.75C21.2135 3.75 26.25 8.78654 26.25 15C26.25 21.2135 21.2135 26.25 15 26.25C8.78654 26.25 3.75 21.2135 3.75 15ZM15.8654 8.07692C15.8654 7.84741 15.7742 7.62729 15.6119 7.465C15.4496 7.30271 15.2295 7.21154 15 7.21154C14.7705 7.21154 14.5504 7.30271 14.3881 7.465C14.2258 7.62729 14.1346 7.84741 14.1346 8.07692V15C14.1346 15.1615 14.1808 15.3208 14.2662 15.4592L17.1508 20.0746C17.2726 20.2692 17.4667 20.4075 17.6904 20.459C17.9142 20.5105 18.1492 20.471 18.3438 20.3492C18.5385 20.2274 18.6767 20.0333 18.7282 19.8096C18.7797 19.5858 18.7403 19.3508 18.6185 19.1562L15.8654 14.7519V8.07692Z"
                          className="fill-[#C32D0B]"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-[6px] overflow-auto">
                      <h6 className="p !font-medium !text-black break-all">
                        Product currently waiting for review
                      </h6>
                      <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 break-words">
                        {note?.message}
                      </p>
                    </div>
                  </div>
                );
              case "authorised":
                return (
                  <div className="rounded-[4px] flex items-start gap-3 py-[14px] px-4 bg-primary/10 z-50 relative success">
                    <div className="flex items-center gap-5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none"
                      >
                        <rect
                          x="0.65"
                          y="0.65"
                          width="28.7"
                          height="28.7"
                          rx="14.35"
                          stroke="#0156D5"
                          strokeWidth="1.3"
                        />
                        <path
                          d="M3.75 15C3.75 8.78654 8.78654 3.75 15 3.75C21.2135 3.75 26.25 8.78654 26.25 15C26.25 21.2135 21.2135 26.25 15 26.25C8.78654 26.25 3.75 21.2135 3.75 15ZM15.8654 8.07692C15.8654 7.84741 15.7742 7.62729 15.6119 7.465C15.4496 7.30271 15.2295 7.21154 15 7.21154C14.7705 7.21154 14.5504 7.30271 14.3881 7.465C14.2258 7.62729 14.1346 7.84741 14.1346 8.07692V15C14.1346 15.1615 14.1808 15.3208 14.2662 15.4592L17.1508 20.0746C17.2726 20.2692 17.4667 20.4075 17.6904 20.459C17.9142 20.5105 18.1492 20.471 18.3438 20.3492C18.5385 20.2274 18.6767 20.0333 18.7282 19.8096C18.7797 19.5858 18.7403 19.3508 18.6185 19.1562L15.8654 14.7519V8.07692Z"
                          className="fill-primary"
                        />
                      </svg>
                    </div>
                    <div className="flex flex-col gap-[6px] overflow-auto">
                      <h6 className="p !font-medium !text-black break-all">
                        Product currently waiting for review
                      </h6>
                      <p className="2xl:text-base 1xl:text-[15px] text-sm leading-5 text-gray-200 break-words">
                        {note?.message}
                      </p>
                    </div>
                  </div>
                );
              default:
                return "";
            }
          })()}
        </div>
      )}
      {/* this will show when products is in declined state */}
    </div>
  );
};
