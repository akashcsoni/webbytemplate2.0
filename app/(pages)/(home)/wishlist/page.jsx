"use client";

import EmptyWishlist from "@/components/emptywishlist/page";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishListContext";
import { Image } from "@heroui/react";
import Link from "next/link";
import React, { useState } from "react";

export default function wishlistPage() {
  const {
    wishlistItems,
    isLoading,
    removeFromWishlist,
    setIsLoading,
    clearToWishlist,
    wishlistTocart,
  } = useWishlist();
  const { addToCart, openCart } = useCart();
  const [removingItemId, setRemovingItemId] = useState(null);

  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="flex justify-between items-center flex-wrap border-b border-primary/10 pb-[25px] mb-[25px]">
        <div className="sm:m-0 mb-2">
          <div className="h-8 bg-gray-100 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-100 rounded w-32"></div>
        </div>
        <div className="flex items-center">
          <div className="flex sm:gap-[18px] gap-2 flex-wrap xl:p-4 sm:p-3">
            <div className="h-10 bg-gray-100 rounded w-32"></div>
            <div className="h-10 bg-gray-100 rounded w-40"></div>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full min-w-[992px] overflow-auto">
          <thead className="bg-blue-300/50 p2 !text-black w-full overflow-auto">
            <tr>
              <th className="py-3 px-4 text-start font-normal rounded-l-[4px] 2xl:w-[10%] 1xl:w-[11%] xl:w-[12%] lg:w-[13%] w-[100px]">
                Image
              </th>
              <th className="py-3 px-4 text-start font-normal 2xl:w-[45%] 1xl:w-[44%] xl:w-[43%] lg:w-[45%] sm:w-[450px] w-[300px]">
                Product name
              </th>
              <th className="py-3 px-4 text-start font-normal xl:w-[15%] lg:w-[11%] sm:w-[100px] w-[65px]">
                Price
              </th>
              <th className="py-3 px-4 text-start font-normal 1xl:w-[17%] lg:w-[15%] sm:w-[150px] w-[100px]">
                Add to cart
              </th>
              <th className="py-3 px-4 text-end font-normal rounded-r-[4px] lg:w-auto sm:w-[150px] w-[100px]">
                Remove
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-primary/10 w-full">
            {[1, 2, 3].map((item) => (
              <tr key={item}>
                <td className="xl:p-4 p-3">
                  <div className="w-[100px] h-[120px] bg-gray-100 rounded-[2px]"></div>
                </td>
                <td className="xl:p-4 p-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </td>
                <td className="xl:p-4 p-3">
                  <div className="h-4 bg-gray-100 rounded w-20"></div>
                </td>
                <td className="xl:p-4 p-3">
                  <div className="h-4 bg-gray-100 rounded w-24"></div>
                </td>
                <td className="xl:p-4 p-3">
                  <div className="h-4 bg-gray-100 rounded w-24 ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="container">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  const removeProductFromWishlist = (wishlistItem) => {
    if (wishlistItem) {
      if (wishlistItem?.product) {
        if (wishlistItem?.product?.documentId) {
          removeFromWishlist(wishlistItem?.product?.documentId);
          setRemovingItemId(wishlistItem.id); // Set the item ID to trigger animation
        }
      }
    }
  };

  const handleAddToCart = async (wishlistItem) => {
    if (!wishlistItem) {
      console.error("wishlistItem is missing.");
      return;
    }

    setIsLoading(true);

    try {
      const cartData = {
        product:
          wishlistItem?.product?.documentId ||
          wishlistItem?.product?.id ||
          null,
        extra_info: wishlistItem?.extra_info,
      };

      if (!cartData.product) {
        console.error("Product ID is missing.");
        return;
      }

      await addToCart(cartData); // Wait for addToCart to finish
      removeFromWishlist(wishlistItem?.product?.documentId);
    } catch (error) {
      console.error("Add to cart failed:", error);
    } finally {
      setIsLoading(false);
      openCart(true);
    }
  };

  return (
    <div className="py-8">
      <div className="container">
        <div className="flex justify-between items-center flex-wrap border-b border-primary/10 pb-[25px] mb-[25px]">
          <div className="sm:m-0 mb-2">
            <h1 className="h2 mb-[2px]">My Wishlist</h1>
            <p className="p2">{wishlistItems?.length || 0} items in Wishlist</p>
          </div>
          <div className="flex items-center">
            <div className="flex sm:gap-[18px] gap-2 flex-wrap xl:p-4 sm:p-3">
              {!wishlistItems?.length <= 0 && (
                <>
                  <button
                    onClick={() => clearToWishlist()}
                    className="btn btn-outline-primary gap-[10px] font-medium"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="19"
                      viewBox="0 0 18 19"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_4731_7318)">
                        <path
                          d="M7.2 4.1H10.8C10.8 3.62261 10.6104 3.16477 10.2728 2.82721C9.93523 2.48964 9.47739 2.3 9 2.3C8.52261 2.3 8.06477 2.48964 7.72721 2.82721C7.38964 3.16477 7.2 3.62261 7.2 4.1ZM5.4 4.1C5.4 3.14522 5.77928 2.22955 6.45442 1.55442C7.12955 0.879285 8.04522 0.5 9 0.5C9.95478 0.5 10.8705 0.879285 11.5456 1.55442C12.2207 2.22955 12.6 3.14522 12.6 4.1H17.1C17.3387 4.1 17.5676 4.19482 17.7364 4.3636C17.9052 4.53239 18 4.7613 18 5C18 5.23869 17.9052 5.46761 17.7364 5.6364C17.5676 5.80518 17.3387 5.9 17.1 5.9H16.3062L15.5088 15.206C15.4321 16.1046 15.021 16.9417 14.3567 17.5517C13.6924 18.1617 12.8233 18.5001 11.9214 18.5H6.0786C5.17672 18.5001 4.30765 18.1617 3.64333 17.5517C2.97902 16.9417 2.56786 16.1046 2.4912 15.206L1.6938 5.9H0.9C0.661305 5.9 0.432387 5.80518 0.263604 5.6364C0.0948211 5.46761 0 5.23869 0 5C0 4.7613 0.0948211 4.53239 0.263604 4.3636C0.432387 4.19482 0.661305 4.1 0.9 4.1H5.4ZM11.7 9.5C11.7 9.2613 11.6052 9.03239 11.4364 8.8636C11.2676 8.69482 11.0387 8.6 10.8 8.6C10.5613 8.6 10.3324 8.69482 10.1636 8.8636C9.99482 9.03239 9.9 9.2613 9.9 9.5V13.1C9.9 13.3387 9.99482 13.5676 10.1636 13.7364C10.3324 13.9052 10.5613 14 10.8 14C11.0387 14 11.2676 13.9052 11.4364 13.7364C11.6052 13.5676 11.7 13.3387 11.7 13.1V9.5ZM7.2 8.6C6.96131 8.6 6.73239 8.69482 6.5636 8.8636C6.39482 9.03239 6.3 9.2613 6.3 9.5V13.1C6.3 13.3387 6.39482 13.5676 6.5636 13.7364C6.73239 13.9052 6.96131 14 7.2 14C7.43869 14 7.66761 13.9052 7.8364 13.7364C8.00518 13.5676 8.1 13.3387 8.1 13.1V9.5C8.1 9.2613 8.00518 9.03239 7.8364 8.8636C7.66761 8.69482 7.43869 8.6 7.2 8.6Z"
                          fill="currentColor"
                        />
                      </g>
                    </svg>
                    Remove all
                  </button>

                  <button
                    onClick={() => wishlistTocart()}
                    className="btn btn-primary gap-[10px] font-medium"
                  >
                    Add all items to cart
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.30057 7.49988L0.988281 2.18928L2.18342 0.994141L8.68747 7.49988L2.18342 14.0056L0.988281 12.8122L6.30057 7.49988ZM11.3647 7.49988L6.05243 2.18928L7.24757 0.994141L13.7516 7.49988L7.24757 14.0056L6.05243 12.8122L11.3647 7.49988Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {wishlistItems?.length <= 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="overflow-auto">
            <table className="w-full min-w-[992px] overflow-auto">
              <thead className="bg-blue-300/50 p2 !text-black w-full overflow-auto">
                <tr>
                  <th className="py-3 px-4 text-start font-normal rounded-l-[4px] 2xl:w-[10%] 1xl:w-[11%] xl:w-[12%] lg:w-[13%] w-[100px]">
                    Image
                  </th>
                  <th className="py-3 px-4 text-start font-normal 2xl:w-[45%] 1xl:w-[44%] xl:w-[43%] lg:w-[45%] sm:w-[450px] w-[300px]">
                    Product name
                  </th>
                  <th className="py-3 px-4 text-start font-normal xl:w-[15%] lg:w-[11%] sm:w-[100px] w-[65px]">
                    Price
                  </th>
                  <th className="py-3 px-4 text-start font-normal 1xl:w-[17%] lg:w-[15%] sm:w-[150px] w-[100px]">
                    Add to cart
                  </th>
                  <th className="py-3 px-4 text-end font-normal rounded-r-[4px] lg:w-auto sm:w-[150px] w-[100px]">
                    Remove
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/10 w-full">
                {wishlistItems?.map((item) => (
                  <tr
                    key={item.id}
                    className={`transition-all ease-in-out duration-500 ${removingItemId === item.id ? "opacity-0" : "opacity-100"}`}
                  >
                    <td className="xl:p-4 p-3">
                      <Image
                        src={item.product?.grid_image?.url}
                        width="100"
                        height="120"
                        alt={item.product?.title}
                        className="rounded-[2px]"
                      />
                    </td>
                    <td className="xl:p-4 p-3 p font-medium !text-black">
                      <Link
                        className="hover:text-blue-500"
                        href={`/product/${item?.product?.slug}`}
                      >
                        {item.product?.title}
                      </Link>
                    </td>
                    <td className="xl:p-4 p-3">
                      ${item.extra_info?.[0]?.price.toFixed(2)}
                    </td>
                    <td className="xl:p-4 p-3">
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="text-blue-500 hover:border-primary border-b border-white flex items-center gap-2"
                      >
                        Add to cart{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.30057 7.49988L0.988281 2.18928L2.18342 0.994141L8.68747 7.49988L2.18342 14.0056L0.988281 12.8122L6.30057 7.49988ZM11.3647 7.49988L6.05243 2.18928L7.24757 0.994141L13.7516 7.49988L7.24757 14.0056L6.05243 12.8122L11.3647 7.49988Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </td>
                    <td className="xl:p-4 p-3">
                      <button
                        onClick={() => removeProductFromWishlist(item)}
                        className="text-blue-500 hover:underline flex items-center justify-end w-full gap-2"
                      >
                        Remove item{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_4731_4806)">
                            <path
                              d="M12.2563 6.9916C12.3283 6.92443 12.3864 6.84372 12.4273 6.75409C12.4682 6.66447 12.491 6.56767 12.4944 6.46922C12.4979 6.37078 12.4819 6.27263 12.4474 6.18036C12.4129 6.08809 12.3606 6.00352 12.2934 5.93147C12.2262 5.85943 12.1455 5.80132 12.0559 5.76046C11.9663 5.7196 11.8695 5.6968 11.771 5.69335C11.6726 5.6899 11.5744 5.70588 11.4822 5.74037C11.3899 5.77485 11.3053 5.82718 11.2333 5.89435L9.03879 7.94035L6.99279 5.7451C6.85589 5.60488 6.66955 5.52382 6.47364 5.51925C6.27772 5.51468 6.08781 5.58697 5.94452 5.72065C5.80123 5.85433 5.71596 6.03879 5.70694 6.23455C5.69793 6.4303 5.76589 6.62181 5.89629 6.7681L7.94229 8.9626L5.74704 11.0086C5.67245 11.0751 5.61189 11.1558 5.56894 11.246C5.52598 11.3363 5.50148 11.4341 5.49689 11.534C5.49229 11.6338 5.50769 11.7335 5.54217 11.8273C5.57666 11.9211 5.62954 12.007 5.6977 12.0801C5.76587 12.1532 5.84795 12.2119 5.93912 12.2528C6.03029 12.2937 6.12871 12.3159 6.22861 12.3183C6.32851 12.3206 6.42786 12.3029 6.52084 12.2663C6.61382 12.2297 6.69854 12.1749 6.77004 12.1051L8.96454 10.0598L11.0105 12.2543C11.0766 12.3303 11.1573 12.3922 11.2478 12.4363C11.3383 12.4805 11.4367 12.5059 11.5373 12.5112C11.6378 12.5164 11.7384 12.5014 11.833 12.467C11.9276 12.4326 12.0143 12.3794 12.0879 12.3108C12.1616 12.2421 12.2206 12.1594 12.2616 12.0674C12.3025 11.9754 12.3246 11.8762 12.3264 11.7755C12.3281 11.6748 12.3096 11.5748 12.272 11.4815C12.2343 11.3881 12.1782 11.3033 12.107 11.2321L10.0618 9.0376L12.2563 6.9916Z"
                              fill="currentColor"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.75 9C0.75 4.44375 4.44375 0.75 9 0.75C13.5562 0.75 17.25 4.44375 17.25 9C17.25 13.5562 13.5562 17.25 9 17.25C4.44375 17.25 0.75 13.5562 0.75 9ZM9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 8.11358 2.42459 7.23583 2.76381 6.41689C3.10303 5.59794 3.60023 4.85382 4.22703 4.22703C4.85382 3.60023 5.59794 3.10303 6.41689 2.76381C7.23583 2.42459 8.11358 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75Z"
                              fill="currentColor"
                            />
                          </g>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
