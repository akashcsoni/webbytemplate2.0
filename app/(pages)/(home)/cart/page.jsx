"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@heroui/button";
import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import EmptyCart from "@/components/emptycart/page";
import { trackCheckout } from "@/lib/utils/trackUser";
import { useAuth } from "@/contexts/AuthContext";
import Head from "next/head";

export default function Page() {
  const router = useRouter();
  const [removingItemId, setRemovingItemId] = useState(null);
  const [removingAddOnId, setRemovingAddOnId] = useState(null);

  const {
    isLoading,
    addToCart,
    removeFromCart,
    cartItems = [],
    totalPrice = 0,
  } = useCart() || {};

  const removeProductFromCart = (cartItem) => {
    if (cartItem) {
      if (cartItem?.product) {
        if (cartItem?.product?.documentId) {
          setRemovingItemId(cartItem.id);

          removeFromCart(cartItem?.product?.documentId);
        }
      }
    }
  };

  const removeAddOns = (product, addOn) => {
    // Start animation
    setRemovingAddOnId(addOn.id);

    // Filter out the add-on that matches the provided addOn object
    const updatedExtraInfo = product.extra_info.filter(
      (item) => item.id !== addOn.id
    );

    // Create a new product object with the updated extra_info
    const updatedProduct = { ...product, extra_info: updatedExtraInfo };

    // Normalizing the cart data (no need to map updatedProduct directly)
    const normalizedCart = {
      product: updatedProduct.product?.documentId,
      extra_info:
        updatedProduct.extra_info?.map((info) => ({
          price: info.price,
          license: info.license?.documentId,
        })) || [], // Default to an empty array if no extra_info
    };

    // Check if the extra_info array is empty and log accordingly
    if (normalizedCart.extra_info.length === 0) {
      if (updatedProduct?.product?.documentId) {
        removeFromCart(updatedProduct?.product?.documentId);
      }
    } else {
      addToCart(normalizedCart);
    }
  };

  const { authUser } = useAuth();

  const handleCheckoutClick = async () => {
    try {
      const user_id = authUser?.id || null; // dynamic user ID

      // 1️⃣ Call tracking function
      await trackCheckout({ user_id });

      // 2️⃣ Redirect to checkout page after tracking
      router.push("/checkout");
    } catch (err) {
      console.error("Error tracking checkout:", err);
      router.push("/checkout"); // still go to checkout even if tracking fails
    }
  };

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="container px-4 py-10">
        <h1 className="h2 border-b border-primary/10 sm:pb-[30px] pb-4">
          Shopping Cart
        </h1>

        {isLoading ? (
          <div className="container px-4 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-apiun rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>

                <p className="text-gray-600">Loading cart...</p>
              </div>
            </div>
          </div>
        ) : cartItems?.length > 0 ? (
          <div className="flex flex-col lg:flex-row sm:gap-[46px] gap-0">
            <div className="flex-1 sm:space-y-[30px] space-y-5 divide-y divide-primary/10">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`sm:pt-[30px] pt-5 transition-all ease-in-out ${removingItemId === item.id ? "opacity-0 translate-x-20" : "opacity-100 translate-x-0"}`}
                >
                  <div className="flex items-start sm:flex-row flex-col xl:gap-[30px] sm:gap-5 gap-4">
                    <Image
                      src={item?.product?.grid_image?.url}
                      width="150"
                      height="140"
                      alt="Product"
                      className="sm:w-[150px] w-[140px] rounded"
                    />
                    <div className="flex-1 sm:w-auto w-full">
                      <div className="flex justify-between items-start sm:flex-nowrap flex-wrap">
                        <h5 className="xl:w-[350px] w-[300px] sm:mb-[11px] mb-1 hover:text-primary">
                          <Link href={`product/${item?.product?.slug}`}>
                            {item?.product?.title}
                          </Link>
                        </h5>
                        <button
                          onClick={() => removeProductFromCart(item)}
                          className="mt-1 !text-primary hover:!text-gray-200 2xl:text-base xl:text-[15px] text-sm flex items-center gap-2 group flex-shrink-0"
                        >
                          Remove item
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            className="fill-primary group-hover:fill-gray-200"
                          >
                            <path d="M12.2563 6.9916C12.3283 6.92443 12.3864 6.84372 12.4273 6.75409C12.4682 6.66447 12.491 6.56767 12.4944 6.46922C12.4979 6.37078 12.4819 6.27263 12.4474 6.18036C12.4129 6.08809 12.3606 6.00352 12.2934 5.93147C12.2262 5.85943 12.1455 5.80132 12.0559 5.76046C11.9663 5.7196 11.8695 5.6968 11.771 5.69335C11.6726 5.6899 11.5744 5.70588 11.4822 5.74037C11.3899 5.77485 11.3053 5.82718 11.2333 5.89435L9.03879 7.94035L6.99279 5.7451C6.85589 5.60488 6.66955 5.52382 6.47364 5.51925C6.27772 5.51468 6.08781 5.58697 5.94452 5.72065C5.80123 5.85433 5.71596 6.03879 5.70694 6.23455C5.69793 6.4303 5.76589 6.62181 5.89629 6.7681L7.94229 8.9626L5.74704 11.0086C5.67245 11.0751 5.61189 11.1558 5.56894 11.246C5.52598 11.3363 5.50148 11.4341 5.49689 11.534C5.49229 11.6338 5.50769 11.7335 5.54217 11.8273C5.57666 11.9211 5.62954 12.007 5.6977 12.0801C5.76587 12.1532 5.84795 12.2119 5.93912 12.2528C6.03029 12.2937 6.12871 12.3159 6.22861 12.3183C6.32851 12.3206 6.42786 12.3029 6.52084 12.2663C6.61382 12.2297 6.69854 12.1749 6.77004 12.1051L8.96454 10.0598L11.0105 12.2543C11.0766 12.3303 11.1573 12.3922 11.2478 12.4363C11.3383 12.4805 11.4367 12.5059 11.5373 12.5112C11.6378 12.5164 11.7384 12.5014 11.833 12.467C11.9276 12.4326 12.0143 12.3794 12.0879 12.3108C12.1616 12.2421 12.2206 12.1594 12.2616 12.0674C12.3025 11.9754 12.3246 11.8762 12.3264 11.7755C12.3281 11.6748 12.3096 11.5748 12.272 11.4815C12.2343 11.3881 12.1782 11.3033 12.107 11.2321L10.0618 9.0376L12.2563 6.9916Z" />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M0.75 9C0.75 4.44375 4.44375 0.75 9 0.75C13.5562 0.75 17.25 4.44375 17.25 9C17.25 13.5562 13.5562 17.25 9 17.25C4.44375 17.25 0.75 13.5562 0.75 9ZM9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 8.11358 2.42459 7.23583 2.76381 6.41689C3.10303 5.59794 3.60023 4.85382 4.22703 4.22703C4.85382 3.60023 5.59794 3.10303 6.41689 2.76381C7.23583 2.42459 8.11358 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75Z"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-cener justify-between w-full sm:flex-nowrap flex-wrap sm:gap-0 gap-y-1">
                        <p className="2xl:text-base xl:text-[15px] text-sm text-gray-500 sm:mt-1 mt-0.5">
                          License type:{" "}
                          <span className=" text-primary">
                            {item?.extra_info[0]?.license?.title}
                          </span>
                        </p>
                        <p className="!text-black font-medium">
                          ${item?.total?.toFixed(2)}
                        </p>
                      </div>
                      <ul className="sm:mt-[18px] mt-[14px] space-y-2">
                        {item?.extra_info.map((addOn, idx) => (
                          <li
                            key={idx}
                            className={`flex sm:items-center item-features text-sm md:py-[10px] md:px-[14px] p-2 rounded-[5px] border-2 border-blue-300 transition-all ease-in-out duration-300 
  ${removingAddOnId === addOn.id ? "opacity-0 translate-x-20" : "opacity-100 translate-x-0"}`}
                          >
                            <span className="flex items-center justify-start md:gap-[10px] sm:gap-3 gap-[6px] w-full">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="md:w-5 md:h-5 w-4 h-4 flex-shrink-0"
                              >
                                <path
                                  d="M8.64282 1.40537C8.81464 1.21661 9.02398 1.06582 9.25743 0.962634C9.49089 0.85945 9.74332 0.806152 9.99857 0.806152C10.2538 0.806152 10.5062 0.85945 10.7397 0.962634C10.9732 1.06582 11.1825 1.21661 11.3543 1.40537L12.2893 2.43203C12.4709 2.63133 12.6941 2.78814 12.9432 2.89129C13.1923 2.99443 13.461 3.04138 13.7303 3.02878L15.1172 2.96462C15.3721 2.95261 15.6267 2.99393 15.8646 3.08594C16.1026 3.17794 16.3188 3.31861 16.4993 3.49893C16.6798 3.67926 16.8206 3.89528 16.9129 4.13317C17.0051 4.37106 17.0467 4.62558 17.0349 4.88045L16.9698 6.26828C16.9572 6.53757 17.0042 6.80633 17.1073 7.0554C17.2105 7.30448 17.3673 7.52774 17.5666 7.70928L18.5932 8.64428C18.782 8.8161 18.9328 9.02544 19.036 9.2589C19.1391 9.49236 19.1924 9.74479 19.1924 10C19.1924 10.2553 19.1391 10.5077 19.036 10.7412C18.9328 10.9746 18.782 11.184 18.5932 11.3558L17.5666 12.2908C17.3673 12.4723 17.2105 12.6956 17.1073 12.9447C17.0042 13.1937 16.9572 13.4625 16.9698 13.7318L17.034 15.1187C17.046 15.3736 17.0047 15.6281 16.9127 15.8661C16.8207 16.1041 16.68 16.3202 16.4997 16.5007C16.3193 16.6812 16.1033 16.8221 15.8654 16.9143C15.6275 17.0066 15.373 17.0481 15.1181 17.0364L13.7303 16.9713C13.461 16.9587 13.1923 17.0056 12.9432 17.1088C12.6941 17.2119 12.4709 17.3687 12.2893 17.568L11.3543 18.5947C11.1825 18.7834 10.9732 18.9342 10.7397 19.0374C10.5062 19.1406 10.2538 19.1939 9.99857 19.1939C9.74332 19.1939 9.49089 19.1406 9.25743 19.0374C9.02398 18.9342 8.81464 18.7834 8.64282 18.5947L7.70782 17.568C7.52628 17.3687 7.30301 17.2119 7.05394 17.1088C6.80487 17.0056 6.53611 16.9587 6.26682 16.9713L4.8799 17.0354C4.62504 17.0475 4.37048 17.0061 4.1325 16.9141C3.89453 16.8221 3.67837 16.6815 3.49787 16.5011C3.31738 16.3208 3.1765 16.1048 3.08427 15.8669C2.99203 15.629 2.95047 15.3745 2.96223 15.1196L3.02732 13.7318C3.03991 13.4625 2.99297 13.1937 2.88982 12.9447C2.78667 12.6956 2.62986 12.4723 2.43057 12.2908L1.4039 11.3558C1.21515 11.184 1.06435 10.9746 0.961169 10.7412C0.857985 10.5077 0.804687 10.2553 0.804688 10C0.804688 9.74479 0.857985 9.49236 0.961169 9.2589C1.06435 9.02544 1.21515 8.8161 1.4039 8.64428L2.43057 7.70928C2.62986 7.52774 2.78667 7.30448 2.88982 7.0554C2.99297 6.80633 3.03991 6.53757 3.02732 6.26828L2.96315 4.88137C2.95114 4.6265 2.99246 4.37194 3.08447 4.13397C3.17648 3.89599 3.31714 3.67984 3.49747 3.49934C3.6778 3.31884 3.89381 3.17797 4.1317 3.08573C4.36959 2.9935 4.62411 2.95193 4.87898 2.9637L6.26682 3.02878C6.53611 3.04138 6.80487 2.99443 7.05394 2.89129C7.30301 2.78814 7.52628 2.63133 7.70782 2.43203L8.64282 1.40537Z"
                                  stroke="#0156D5"
                                  strokeWidth="1.5"
                                />
                                <path
                                  d="M7.25 10.0003L9.08333 11.8337L12.75 8.16699"
                                  stroke="#0156D5"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <p className="2xl:text-base xl:text-[15px] text-sm !text-black">
                                {addOn?.license?.title}
                              </p>
                            </span>
                            <span className="flex items-center justify-end gap-[10px]">
                              <p className="2xl:text-base xl:text-[15px] text-sm !text-primary">
                                ${addOn?.price?.toFixed(2)}
                              </p>
                              {idx !== 0 && (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="18"
                                  height="18"
                                  viewBox="0 0 18 18"
                                  fill="none"
                                  className="sm:w-[18px] sm:h-[18px] w-4 h-4 cursor-pointer"
                                  onClick={() => removeAddOns(item, addOn)}
                                >
                                  <g clipPath="url(#clip0_1151_2175)">
                                    <path
                                      d="M12.2563 6.9916C12.3283 6.92443 12.3864 6.84372 12.4273 6.75409C12.4682 6.66447 12.491 6.56767 12.4944 6.46922C12.4979 6.37078 12.4819 6.27263 12.4474 6.18036C12.4129 6.08809 12.3606 6.00352 12.2934 5.93147C12.2262 5.85943 12.1455 5.80132 12.0559 5.76046C11.9663 5.7196 11.8695 5.6968 11.771 5.69335C11.6726 5.6899 11.5744 5.70588 11.4822 5.74037C11.3899 5.77485 11.3053 5.82718 11.2333 5.89435L9.03879 7.94035L6.99279 5.7451C6.85589 5.60488 6.66955 5.52382 6.47364 5.51925C6.27772 5.51468 6.08781 5.58697 5.94452 5.72065C5.80123 5.85433 5.71596 6.03879 5.70694 6.23455C5.69793 6.4303 5.76589 6.62181 5.89629 6.7681L7.94229 8.9626L5.74704 11.0086C5.67245 11.0751 5.61189 11.1558 5.56894 11.246C5.52598 11.3363 5.50148 11.4341 5.49689 11.534C5.49229 11.6338 5.50769 11.7335 5.54217 11.8273C5.57666 11.9211 5.62954 12.007 5.6977 12.0801C5.76587 12.1532 5.84795 12.2119 5.93912 12.2528C6.03029 12.2937 6.12871 12.3159 6.22861 12.3183C6.32851 12.3206 6.42786 12.3029 6.52084 12.2663C6.61382 12.2297 6.69854 12.1749 6.77004 12.1051L8.96454 10.0598L11.0105 12.2543C11.0766 12.3303 11.1573 12.3922 11.2478 12.4363C11.3383 12.4805 11.4367 12.5059 11.5373 12.5112C11.6378 12.5164 11.7384 12.5014 11.833 12.467C11.9276 12.4326 12.0143 12.3794 12.0879 12.3108C12.1616 12.2421 12.2206 12.1594 12.2616 12.0674C12.3025 11.9754 12.3246 11.8762 12.3264 11.7755C12.3281 11.6748 12.3096 11.5748 12.272 11.4815C12.2343 11.3881 12.1782 11.3033 12.107 11.2321L10.0618 9.0376L12.2563 6.9916Z"
                                      fill="#808080"
                                    />
                                    <path
                                      fillRule="evenodd"
                                      clipRule="evenodd"
                                      d="M0.75 9C0.75 4.44375 4.44375 0.75 9 0.75C13.5562 0.75 17.25 4.44375 17.25 9C17.25 13.5562 13.5562 17.25 9 17.25C4.44375 17.25 0.75 13.5562 0.75 9ZM9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 8.11358 2.42459 7.23583 2.76381 6.41689C3.10303 5.59794 3.60023 4.85382 4.22703 4.22703C4.85382 3.60023 5.59794 3.10303 6.41689 2.76381C7.23583 2.42459 8.11358 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75Z"
                                      fill="#808080"
                                    />
                                  </g>
                                  <defs>
                                    <clipPath id="clip0_1151_2175">
                                      <rect width="18" height="18" fill="white" />
                                    </clipPath>
                                  </defs>
                                </svg>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-[31%] h-fit sm:pt-[30px] pt-5 divide-y divide-primary/10 2xl:space-y-6 1xl:space-y-5 xl:space-y-4 space-y-3">
              <h4>Your Cart Total</h4>
              <div className="xl:space-y-[15px] space-y-3 text-sm xl:pt-5 pt-4">
                <div className="flex justify-between">
                  <p className="2xl:text-base xl:text-[15px] text-sm !text-black">
                    Subtotal
                  </p>
                  <p className="2xl:text-base xl:text-[15px] text-sm !text-primary font-medium">
                    ${totalPrice?.toFixed(2)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <span className="2xl:text-base xl:text-[15px] text-sm !text-black">
                    Discount
                  </span>
                  <p className="2xl:text-base xl:text-[15px] text-sm !text-primary font-medium">
                    $0.00
                  </p>
                </div>
              </div>

              {/* <div className="xl:pt-[18px] pt-3">
                <label
                  htmlFor="coupon"
                  className="block font-medium xl:mb-3 mb-2 p"
                >
                  Enter Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="coupon"
                    className="border border-gray-100 2xl:text-base xl:text-[15px] text-sm placeholder:text-gray-300 rounded-[5px] px-5 2xl:py-3 xl:py-[11px] py-2.5 w-full"
                    placeholder="Coupon code"
                  />
                  <Button className="btn btn-primary h-auto xl:!px-[30px] lg:!px-5 sm:!px-10">
                    Apply
                  </Button>
                </div>
              </div> */}

              <div>
                <div className="1xl:pt-[18px] xl:pt-4 pt-3 flex justify-between text-base font-medium 1xl:mb-[18px] xl:mb-4 mb-3.5">
                  <p className="font-medium !text-black">Total</p>
                  <p className="font-medium !text-black">
                    ${totalPrice?.toFixed(2)}
                  </p>
                </div>
                <Button
                  onClick={handleCheckoutClick}
                  className="w-full btn btn-primary 2xl:!py-3 1xl:!py-2.5 !py-[9px] h-auto"
                >
                  Process to Checkout
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyCart />
        )}
      </div>
    </>
  );
}
