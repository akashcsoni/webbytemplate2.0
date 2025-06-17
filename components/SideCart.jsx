"use client";

import { useCart } from "@/contexts/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SideCart() {
  const router = useRouter();
  const [removingItemId, setRemovingItemId] = useState(null);

  const {
    isCartOpen,
    removeFromCart,
    closeCart,
    cartItems = [],
    totalPrice = 0,
  } = useCart() || {};

  const removeProductFromCart = (cartItem) => {
    if (cartItem) {
      if (cartItem?.product) {
        if (cartItem?.product?.documentId) {
          // Set the removing item ID to trigger the animation
          setRemovingItemId(cartItem.id);
          removeFromCart(cartItem?.product?.documentId);

          // Match this duration with your CSS transition duration
        }
      }
    }
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 !m-0"
          onClick={closeCart}
        />
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 bg-blue-300">
          <h5 className="sm:text-[20px] text-lg font-medium">
            Cart ({cartItems?.length || 0})
          </h5>
          <button onClick={closeCart} aria-label="Close cart">
            <div className="h-4 w-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                className="cursor-pointer"
              >
                <path
                  d="M17 5L5 17M5 5L17 17"
                  stroke="black"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            </div>
          </button>
        </div>

        <div className="overflow-hidden sm:max-h-[calc(100vh-235px)] max-h-[calc(100vh-210px)] sm:p-5 p-3 space-y-[25px] h-full">
          {Array.isArray(cartItems) && cartItems?.length > 0 ? (
            cartItems?.map((item) => {
              const imageUrl = item?.product?.grid_image?.url
                ? `${item.product.grid_image.url}`
                : "/placeholder.svg";
              const title = item?.product?.title || "No title";
              const price = item?.total?.toFixed(2) || "0.00";

              const isRemoving = removingItemId === item.id; // Check if the item is being removed

              return (
                <div
                  key={item?.id || Math.random()}
                  className={`flex items-start sm:gap-[18px] gap-3 transition-all ease-in-out duration-300 ${
                    isRemoving
                      ? "opacity-0 translate-x-full"
                      : "opacity-100 translate-x-0"
                  }`}
                >
                  <img
                    src={imageUrl}
                    alt={title}
                    className="2xl:w-[130px] 2xl:h-[92px] lg:w-[125px] lg:h-[88px] sm:w-[118px] sm:h-[83px] w-20 h-[75px] rounded-[3px]"
                  />
                  <div className="flex-1">
                    <Link href={`/product/${item?.product?.slug || ""}`}>
                      <div className="block mb-3">
                        <p className="p2 text-black font-medium hover:text-primary cursor-pointer">
                          {title}
                        </p>
                      </div>
                    </Link>
                    <p className="p2 text-primary font-medium">${price}</p>
                  </div>
                  <button
                    onClick={() => removeProductFromCart(item)}
                    className="text-gray-400 hover:text-red-500 sm:ml-[10px] mt-1"
                    aria-label="Remove item"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M12.2543 6.9916C12.3264 6.92443 12.3845 6.84372 12.4253 6.75409C12.4662 6.66447 12.489 6.56767 12.4925 6.46922C12.4959 6.37078 12.4799 6.27263 12.4454 6.18036C12.411 6.08809 12.3586 6.00352 12.2915 5.93147C12.2243 5.85943 12.1436 5.80132 12.054 5.76046C11.9643 5.7196 11.8675 5.6968 11.7691 5.69335C11.6706 5.6899 11.5725 5.70588 11.4802 5.74037C11.388 5.77485 11.3034 5.82718 11.2313 5.89435L9.03684 7.94035L6.99084 5.7451C6.85394 5.60488 6.66759 5.52382 6.47168 5.51925C6.27577 5.51468 6.08585 5.58697 5.94256 5.72065C5.79928 5.85433 5.714 6.03879 5.70499 6.23455C5.69598 6.4303 5.76394 6.62181 5.89434 6.7681L7.94034 8.9626L5.74509 11.0086C5.67049 11.0751 5.60994 11.1558 5.56698 11.246C5.52403 11.3363 5.49953 11.4341 5.49493 11.534C5.49034 11.6338 5.50573 11.7335 5.54022 11.8273C5.57471 11.9211 5.62758 12.007 5.69575 12.0801C5.76391 12.1532 5.84599 12.2119 5.93716 12.2528C6.02833 12.2937 6.12676 12.3159 6.22666 12.3183C6.32655 12.3206 6.42591 12.3029 6.51888 12.2663C6.61186 12.2297 6.69659 12.1749 6.76809 12.1051L8.96259 10.0598L11.0086 12.2543C11.0746 12.3303 11.1553 12.3922 11.2458 12.4363C11.3363 12.4805 11.4348 12.5059 11.5353 12.5112C11.6358 12.5164 11.7364 12.5014 11.831 12.467C11.9256 12.4326 12.0123 12.3794 12.086 12.3108C12.1596 12.2421 12.2187 12.1594 12.2596 12.0674C12.3006 11.9754 12.3226 11.8762 12.3244 11.7755C12.3262 11.6748 12.3077 11.5748 12.27 11.4815C12.2323 11.3881 12.1762 11.3033 12.1051 11.2321L10.0598 9.0376L12.2543 6.9916Z"
                        fill="#808080"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.75 9C0.75 4.44375 4.44375 0.75 9 0.75C13.5562 0.75 17.25 4.44375 17.25 9C17.25 13.5562 13.5562 17.25 9 17.25C4.44375 17.25 0.75 13.5562 0.75 9ZM9 15.75C8.11358 15.75 7.23583 15.5754 6.41689 15.2362C5.59794 14.897 4.85382 14.3998 4.22703 13.773C3.60023 13.1462 3.10303 12.4021 2.76381 11.5831C2.42459 10.7642 2.25 9.88642 2.25 9C2.25 8.11358 2.42459 7.23583 2.76381 6.41689C3.10303 5.59794 3.60023 4.85382 4.22703 4.22703C4.85382 3.60023 5.59794 3.10303 6.41689 2.76381C7.23583 2.42459 8.11358 2.25 9 2.25C10.7902 2.25 12.5071 2.96116 13.773 4.22703C15.0388 5.4929 15.75 7.20979 15.75 9C15.75 10.7902 15.0388 12.5071 13.773 13.773C12.5071 15.0388 10.7902 15.75 9 15.75Z"
                        fill="#808080"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center text-center xl:py-[50px] md:py-9 sm:py-7 py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="75"
                height="75"
                viewBox="0 0 126 126"
                fill="none"
                className="xl:mb-7 lg:mb-5 sm:mb-4 mb-3  lg:w-[75px] lg:h-[75px] sm:w-[70px] sm:h-[70px] w-[55px] h-[55px]"
              >
                <g mask="url(#mask0_4726_887)">
                  <path
                    d="M3.73411 6.5023C3.41255 6.18075 3.21491 5.75845 3.17188 5.30959V5.11455C3.17188 4.59737 3.37731 4.10138 3.74301 3.73569C4.10871 3.36999 4.6047 3.16455 5.12188 3.16455H9.02007C14.1381 3.16455 17.1839 6.40203 19.1387 10.2137C20.4827 12.8451 21.484 16.1288 22.3716 19.1953L22.8941 21.0001H24.773H116.398C117.387 21.0005 118.363 21.23 119.248 21.6705C120.133 22.1111 120.904 22.7509 121.501 23.5396C122.097 24.3283 122.503 25.2446 122.686 26.2164C122.869 27.1878 122.824 28.1883 122.555 29.1395C122.555 29.1399 122.555 29.1404 122.555 29.1409L109.242 76.0846C108.331 79.2862 106.402 82.1036 103.746 84.1096C101.089 86.1155 97.8511 87.2005 94.5226 87.2001H49.3192C45.9629 87.2012 42.6986 86.0988 40.0306 84.0625C37.363 82.0266 35.4387 79.17 34.5542 75.9329C34.5541 75.9325 34.554 75.9321 34.5539 75.9317L28.8404 54.9734L28.8176 54.8896L28.789 54.8076C28.7742 54.7652 28.7607 54.7222 28.7487 54.6788L28.7432 54.6589L28.7374 54.6391L19.5615 23.5158L19.5602 23.5116L18.6728 20.5209C18.6537 20.4547 18.6345 20.3885 18.6154 20.3223C17.7657 17.3812 16.9276 14.4803 15.65 11.9925C14.8644 10.4609 13.9788 9.1992 12.8419 8.33152C11.6205 7.3993 10.312 7.07345 9.01118 7.07345H5.11297C4.5958 7.07345 4.09981 6.868 3.73411 6.5023ZM57.3206 119.622C55.2859 121.657 52.5261 122.8 49.6485 122.8C46.7709 122.8 44.0112 121.657 41.9764 119.622C39.9416 117.587 38.7985 114.827 38.7985 111.95C38.7985 109.072 39.9416 106.313 41.9764 104.278C44.0112 102.243 46.7709 101.1 49.6485 101.1C52.5261 101.1 55.2859 102.243 57.3206 104.278C59.3554 106.313 60.4985 109.072 60.4985 111.95C60.4985 114.827 59.3554 117.587 57.3206 119.622ZM101.821 119.622C99.7859 121.657 97.0261 122.8 94.1485 122.8C91.2709 122.8 88.5112 121.657 86.4764 119.622C84.4416 117.587 83.2985 114.827 83.2985 111.95C83.2985 109.072 84.4416 106.313 86.4764 104.278C88.5112 102.243 91.2709 101.1 94.1485 101.1C97.0261 101.1 99.7859 102.243 101.821 104.278C103.856 106.313 104.999 109.072 104.999 111.95C104.999 114.827 103.856 117.587 101.821 119.622Z"
                    stroke="#0156D5"
                    strokeWidth="5"
                  />
                  <path
                    d="M66.9252 41.5888C66.9252 42.1914 66.8074 42.7881 66.5785 43.3449C66.3497 43.9016 66.0143 44.4075 65.5914 44.8336C65.1686 45.2597 64.6666 45.5977 64.1142 45.8283C63.5617 46.0589 62.9696 46.1776 62.3716 46.1776C61.7736 46.1776 61.1815 46.0589 60.629 45.8283C60.0765 45.5977 59.5746 45.2597 59.1517 44.8336C58.7289 44.4075 58.3935 43.9016 58.1646 43.3449C57.9358 42.7881 57.818 42.1914 57.818 41.5888C57.818 40.3718 58.2978 39.2046 59.1517 38.344C60.0057 37.4835 61.1639 37 62.3716 37C63.5793 37 64.7375 37.4835 65.5914 38.344C66.4454 39.2046 66.9252 40.3718 66.9252 41.5888ZM88.1752 41.5888C88.1752 42.8058 87.6954 43.973 86.8414 44.8336C85.9875 45.6942 84.8293 46.1776 83.6216 46.1776C82.4139 46.1776 81.2557 45.6942 80.4017 44.8336C79.5478 43.973 79.068 42.8058 79.068 41.5888C79.068 40.3718 79.5478 39.2046 80.4017 38.344C81.2557 37.4835 82.4139 37 83.6216 37C84.8293 37 85.9875 37.4835 86.8414 38.344C87.6954 39.2046 88.1752 40.3718 88.1752 41.5888ZM61.6552 66.503C67.2712 59.7972 78.7159 59.7972 84.338 66.503C84.5889 66.8283 84.9024 67.0991 85.2596 67.2993C85.6169 67.4994 86.0106 67.6248 86.4171 67.6679C86.8237 67.711 87.2346 67.671 87.6254 67.5501C88.0162 67.4292 88.3788 67.2301 88.6913 66.9646C89.0039 66.6991 89.26 66.3727 89.4443 66.005C89.6286 65.6374 89.7374 65.2359 89.764 64.8249C89.7907 64.4138 89.7347 64.0016 89.5993 63.6129C89.464 63.2241 89.2522 62.867 88.9766 62.5628C80.9319 52.9568 65.0552 52.9568 57.0166 62.5628C56.741 62.867 56.5291 63.2241 56.3938 63.6129C56.2585 64.0016 56.2025 64.4138 56.2291 64.8249C56.2558 65.2359 56.3645 65.6374 56.5489 66.005C56.7332 66.3727 56.9893 66.6991 57.3019 66.9646C57.6144 67.2301 57.9769 67.4292 58.3677 67.5501C58.7585 67.671 59.1695 67.711 59.576 67.6679C59.9826 67.6248 60.3763 67.4994 60.7335 67.2993C61.0908 67.0991 61.4043 66.8283 61.6552 66.503Z"
                    fill="#0156D5"
                  />
                </g>
              </svg>
              <h5 className="lg:mb-3 sm:mb-2 mb-1">
                Your shopping cart is empty
              </h5>
              <p className="p2 lg:mb-[26px] sm:mb-5 mb-3 sm:px-5">
                Looks like you have not added anything to your cart. Go ahead &
                explore top categories.
              </p>
              <Link href="/" className="btn btn-primary">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>

        <div className="sm:py-[18px] sm:px-5 p-3 shadow-gray">
          <div className="flex justify-between items-center mb-4">
            <p className="text-black">Subtotal:</p>
            <p className="text-primary font-medium">${totalPrice.toFixed(2)}</p>
          </div>
          <button
            onClick={() => router.push(`/cart`)}
            className="w-full btn btn-outline-primary transition mb-3"
          >
            View Cart
          </button>
          <button
            onClick={() => router.push(`/checkout`)}
            className="w-full btn btn-primary transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
}
