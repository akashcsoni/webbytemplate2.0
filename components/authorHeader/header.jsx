"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";

export default function AuthorHeader({ authUser }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen(!open);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartItems = [
    {
      id: 1,
      title: "Orion: Construction Company Figma UI Template Kit",
      price: 129,
      image: "/images/orion.png",
    },
    {
      id: 2,
      title: "Diazelo: Fashion & Clothing eCommerce XD Template",
      price: 79,
      image: "/images/diazelo.png",
    },
    {
      id: 3,
      title: "Syndicate: Business Consulting HTML Website Template",
      price: 56,
      image: "/images/syndicate.png",
    },
    {
      id: 4,
      title: "Journeya: Travel Agency HTML Website Template",
      price: 149,
      image: "/images/journeya.png",
    },
  ];

  useEffect(() => {
    if (openCart) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [openCart]);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeMenu();
    };

    if (isMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuOpen, closeMenu]);

  const isAuthor = authUser?.position === "author";

  const commonItems = [
    {
      id: "profile-settiings",
      label: "Profile Settiings",
      path: `/user/${authUser?.username}/setting`,
    },
    {
      id: "downloads",
      label: "Downloads",
      path: `/user/${authUser?.username}/download`,
    },
    {
      id: "ticket-support",
      label: isAuthor ? "Tickets / Support" : "Support",
      path: `/user/${authUser?.username}/ticketSupport`,
    },
  ];

  const authorItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: `/user/${authUser?.username}/dashboard`,
    },
    {
      id: "products",
      label: "Products",
      path: `/user/${authUser?.username}/products/list`,
    },
    {
      id: "paymentTax",
      label: "Payment & tax set up",
      path: `/user/${authUser?.username}/paymentTax`,
    },
  ];

  const nonAuthorExtra = [
    {
      id: "become-an-author",
      label: "Become an Author",
      path: `/user/${authUser?.username}/become-an-author`,
    },
  ];

  const menuItems = isAuthor
    ? [...authorItems, ...commonItems]
    : [...commonItems, ...nonAuthorExtra];

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="relative z-50">
      {/* Main Navigation */}
      <div className="bg-primary xl:border-b border-primary/10">
        <div className="flex items-center sm:justify-normal justify-between sm:h-[75px] h-[58px] mx px-4 sm:flex-nowrap flex-wrap w-full">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              className="xl:hidden text-gray-700 sm:mr-3 mr-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Logo */}
            <div className="nav-logo !border-blue-300/10">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <Image
                  src="/logo/white-main-logo.svg"
                  alt="WebbyTemplate"
                  width={180}
                  height={40}
                  priority={true}
                  className="main-logo author-main-logo block"
                />
                <Image
                  src="/logo/only-logo.svg"
                  alt="WebbyTemplate"
                  width={30}
                  height={30}
                  priority={true}
                  className="author-logo hidden"
                />
              </Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="author-links-content flex items-center justify-between relative w-[58%] h-full">
            <div className="flex items-center h-full gap-4">
              <Link href="/partners" className="author-links !text-white">
                Partners
              </Link>
              <Link href="/offers" className="author-links !text-white">
                Offers
              </Link>
              <Link href="/support" className="author-links !text-white">
                Support
              </Link>
              <Link href="/hire-agency" className="author-links !text-white">
                Hire an agency
              </Link>
              <Link href="/hire-agency" className="author-links !text-white">
                Unlimited Downloads
              </Link>
            </div>
            {/* Search Icon */}
            <button
              className="block flex-shrink-0 w-6 h-full"
              onClick={toggleSearch}
            >
              <svg
                className="flex-shrink-0 1xl:w-6 1xl:h-6 sm:w-5 sm:h-5 w-[18px] h-[18px]"
                width="24"
                height="24"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <div
              className={`h-[74px] absolute z-50 bg-primary overflow-hidden transition-all duration-700 ease-in-out flex items-center justify-between !m-0 ${
                isSearchOpen
                  ? "w-full opacity-100 z-100 p-2 ps-7 right-0"
                  : "w-0 opacity-0 z-0 p-0 right-0"
              }`}
            >
              <div className="flex items-center justify-start w-full gap-5">
                <svg
                  className="stroke-white/60 w-[22px] h-[22px] flex-shrink-0"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search for “ Web Templates ” and More....."
                  className="w-full outline-none text-[#505050] placeholder:text-white/60 text-base bg-primary"
                />
              </div>
              <button
                onClick={toggleSearch}
                className="ml-2 h-full text-gray-500"
              >
                <svg
                  className="stroke-white/60 w-[22px] h-[22px] flex-shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M17 5L5 17M5 5L17 17"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </nav>
          {/* Right Side Actions */}
          <div className="flex items-center 1xl:space-x-[15px] space-x-1.5 flex-1 w-[50%] xl:justify-start justify-end right-side divide-x divide-blue-300/10">
            {/* Search */}
            <div className="">
              {/* Search Icon */}
              <div className="xl:hidden flex">
                <button
                  className="flex-shrink-0 w-5 h-6"
                  onClick={toggleSearch}
                >
                  <svg
                    className="flex-shrink-0 1xl:w-6 1xl:h-6 sm:w-5 sm:h-5 w-[18px] h-[18px]"
                    width="24"
                    height="24"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z"
                      stroke="white"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {/* Search Bar */}
                <div
                  className={` absolute z-50 w-full py-2 sm:px-7 px-4 top-full bg-white border-y border-gray-100 shadow-xl overflow-hidden transition-all duration-700 ease-in-out flex items-center justify-between !m-0 ${
                    isSearchOpen
                      ? "opacity-100 h-14 z-100 right-0"
                      : "opacity-0 z-0 right-0 h-0"
                  }`}
                >
                  <div className="flex items-center justify-start w-full sm:gap-5 gap-2">
                    <svg
                      className="stroke-gray-300 sm:w-[22px] sm:h-[22px] w-[18px] h-[18px] flex-shrink-0"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search for “ Web Templates ” and More....."
                      className="w-full outline-none text-[#505050] placeholder:text-gray-300 p2 bg-white"
                    />
                  </div>
                  <button onClick={toggleSearch} className="ml-2 text-gray-500">
                    <svg
                      className="stroke-gray-300 sm:w-[22px] sm:h-[22px] w-5 h-5 flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M17 5L5 17M5 5L17 17"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <Link href="/schedule" className="heart 1xl:pl-[15px] pl-1.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 22 22"
                fill="none"
                className="1xl:w-[22px] 1xl:h-[22px] sm:w-5 sm:h-5 w-[18px] h-[18px]"
              >
                <g clipPath="url(#clip0_2528_235)">
                  <path
                    d="M2.5633 11.6888C0.48549 8.91835 1.17809 4.76273 4.64111 3.37753C8.10412 1.99232 10.1819 4.76273 10.8745 6.14794C11.5671 4.76273 14.3375 1.99232 17.8006 3.37753C21.2636 4.76273 21.2636 8.91835 19.1858 11.6888C17.108 14.4592 10.8745 20 10.8745 20C10.8745 20 4.64111 14.4592 2.5633 11.6888Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </Link>

            <div className="flex items-center relative 1xl:pl-[15px] pl-1.5 pr-1">
              <button className="" onClick={() => setOpenCart(true)}>
                <svg
                  width="18"
                  height="21"
                  viewBox="0 0 18 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="1xl:w-[22px] 1xl:h-[22px] sm:w-5 sm:h-5 w-[18px] h-[18px]"
                >
                  <path
                    d="M5.74935 7.75V4.5C5.74935 2.70507 7.20442 1.25 8.99935 1.25C10.7943 1.25 12.2493 2.70507 12.2493 4.5V7.75M2.49935 5.58333H15.4993L16.5827 19.6667H1.41602L2.49935 5.58333Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="author-badge">0</span>
              </button>
              {/* Side Cart */}
              {openCart && (
                <div
                  className="fixed inset-0 bg-black/50 z-40 !m-0"
                  onClick={() => setOpenCart(false)}
                />
              )}

              {/* Side Cart */}
              <div
                className={`fixed top-0 right-0 h-full w-full max-w-[450px] bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out ${
                  openCart ? "translate-x-0" : "translate-x-full"
                }`}
              >
                <div className="flex items-center justify-between p-4 bg-blue-300">
                  <h5 className="sm:text-[20px] text-lg font-medium">
                    Cart (0)
                  </h5>
                  <button onClick={() => setOpenCart(false)}>
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

                <div className="overflow-y-auto sm:max-h-[calc(100vh-235px)] max-h-[calc(100vh-210px)] sm:p-5 p-3 space-y-[25px] h-full">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start sm:gap-[18px] gap-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="2xl:w-[130px] 2xl:h-[92px] lg:w-[125px] lg:h-[88px] sm:w-[118px] sm:h-[83px] w-20 h-[75px] rounded-[3px]"
                      />
                      <div className="flex-1">
                        <p className="p2 !text-black !font-medium mb-3">
                          {item.title}
                        </p>
                        <p className="p2 !text-primary !font-medium">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button className="text-gray-400 hover:text-red-500 sm:ml-[10px] mt-1">
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
                  ))}
                </div>

                <div className="sm:py-[18px] sm:px-5 p-3 shadow-gray">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-black">Subtotal:</p>
                    <p className="text-primary font-medium">
                      ${subtotal.toFixed(2)}
                    </p>
                  </div>
                  <button className="w-full btn btn-outline-primary transition mb-3">
                    View Cart
                  </button>
                  <button className="w-full btn btn-primary transition">
                    Checkout
                  </button>
                </div>
              </div>
            </div>

            <Link
              href="/schedule"
              className="links !text-white !py-0 1xl:!pl-[15px] !pl-1.5 !pr-0"
            >
              <span className="1xl:block hidden !text-white">
                Schedule Meeting
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 20 20"
                fill="none"
                className="1xl:hidden block sm:w-[22px] sm:h-[22px] w-[19px] h-[19px]"
              >
                <path
                  d="M5.12938 9.99986V6.7961C5.1389 6.16635 5.27258 5.54467 5.52277 4.96667C5.77297 4.38868 6.13475 3.86573 6.5874 3.42779C7.04004 2.98986 7.57465 2.64554 8.1606 2.41458C8.74654 2.18361 9.3723 2.07053 10.002 2.08182C10.6317 2.07053 11.2575 2.18361 11.8434 2.41458C12.4294 2.64554 12.964 2.98986 13.4166 3.42779C13.8693 3.86573 14.2311 4.38868 14.4813 4.96667C14.7315 5.54467 14.8651 6.16635 14.8747 6.7961V9.99986M12.4383 16.3952C13.0845 16.3952 13.7042 16.1385 14.1611 15.6816C14.618 15.2247 14.8747 14.605 14.8747 13.9589V11.218M12.4383 16.3952C12.4383 16.799 12.2779 17.1864 11.9924 17.4719C11.7068 17.7575 11.3195 17.9179 10.9156 17.9179H9.0884C8.68456 17.9179 8.29725 17.7575 8.01169 17.4719C7.72613 17.1864 7.5657 16.799 7.5657 16.3952C7.5657 15.9914 7.72613 15.6041 8.01169 15.3185C8.29725 15.0329 8.68456 14.8725 9.0884 14.8725H10.9156C11.3195 14.8725 11.7068 15.0329 11.9924 15.3185C12.2779 15.6041 12.4383 15.9914 12.4383 16.3952ZM3.30214 8.17262H4.5203C4.68184 8.17262 4.83676 8.23679 4.95099 8.35102C5.06521 8.46524 5.12938 8.62017 5.12938 8.7817V12.4362C5.12938 12.5977 5.06521 12.7526 4.95099 12.8669C4.83676 12.9811 4.68184 13.0453 4.5203 13.0453H3.30214C2.97907 13.0453 2.66922 12.9169 2.44078 12.6885C2.21233 12.46 2.08398 12.1502 2.08398 11.8271V9.39078C2.08398 9.06771 2.21233 8.75786 2.44078 8.52941C2.66922 8.30097 2.97907 8.17262 3.30214 8.17262ZM16.7019 13.0453H15.4837C15.3222 13.0453 15.1673 12.9811 15.0531 12.8669C14.9388 12.7526 14.8747 12.5977 14.8747 12.4362V8.7817C14.8747 8.62017 14.9388 8.46524 15.0531 8.35102C15.1673 8.23679 15.3222 8.17262 15.4837 8.17262H16.7019C17.025 8.17262 17.3348 8.30097 17.5633 8.52941C17.7917 8.75786 17.9201 9.06771 17.9201 9.39078V11.8271C17.9201 12.1502 17.7917 12.46 17.5633 12.6885C17.3348 12.9169 17.025 13.0453 16.7019 13.0453Z"
                  stroke="white"
                  strokeWidth="1.25028"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div
              className="relative flex text-left 1xl:px-[15px] pl-1.5 sm:pr-3"
              ref={dropdownRef}
            >
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center 1xl:gap-2 text-white rounded-full focus:outline-none sm:m-0 mr-[5px]"
              >
                <span className="1xl:block hidden">Account</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  className="1xl:hidden block sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
                >
                  <path
                    d="M16.3442 17.7023C16.3442 14.7013 12.9983 12.2618 9.99732 12.2618C6.99631 12.2618 3.65039 14.7013 3.65039 17.7023M9.99732 9.54245C10.9592 9.54245 11.8816 9.16036 12.5618 8.48022C13.2419 7.80008 13.624 6.87762 13.624 5.91576C13.624 4.9539 13.2419 4.03143 12.5618 3.3513C11.8816 2.67116 10.9592 2.28906 9.99732 2.28906C9.03546 2.28906 8.11299 2.67116 7.43286 3.3513C6.75272 4.03143 6.37062 4.9539 6.37062 5.91576C6.37062 6.87762 6.75272 7.80008 7.43286 8.48022C8.11299 9.16036 9.03546 9.54245 9.99732 9.54245Z"
                    stroke="white"
                    strokeWidth="1.25028"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <svg
                  className={`w-4 h-4 transform transition-transform duration-200 ${
                    open ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {open && (
                <div className="absolute -right-1/2 1xl:pt-3 pt-2.5 1xl:mt-[22px] mt-[30px] shadow-dropDown overflow-hidden rounded-md z-10 before:content-[''] before:absolute before:top-1 1xl:before:right-24 before:right-16 1xl:before:w-4 1xl:before:h-5 before:w-3 before:h-3 before:bg-white before:rotate-45 before:border before:border-blue-300 before:rounded-sm before:overflow-hidden">
                  <div className="z-20 py-[10px] px-2 relative w-[12.5rem] origin-top-right rounded-md bg-white overflow-hidden">
                    <ul>
                      {menuItems?.map((item, index) => {
                        console.log(item);
                        return (
                          <li
                            className={"hover:bg-primary group rounded-md"}
                            key={index}
                          >
                            <Link href={item.path}>
                              <p
                                className={
                                  isActive(item.path)
                                    ? "!font-medium block 1xl:px-3 1xl:py-2 px-4 py-1.5 text-gray-800 group-hover:text-white"
                                    : "block 1xl:px-3 1xl:py-2 px-4 py-1.5 text-gray-800 group-hover:text-white p2"
                                }
                              >
                                {item.label}
                              </p>
                            </Link>
                          </li>
                        );
                      })}
                      <li className="hover:bg-primary group rounded-md">
                        <Link
                          href="/login"
                          onClick={(e) => {
                            e.preventDefault();
                            logout();
                          }}
                        >
                          <p className="block 1xl:px-3 1xl:py-2 px-4 py-1.5 text-gray-800 group-hover:text-white p2">
                            Log Out
                          </p>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="1xl:w-[37px] 1xl:h-[37px] sm:w-[32px] sm:h-[32px] w-7 h-7 !m-0 rounded-full border border-blue-300">
              <Avatar
                src={authUser ? authUser?.image?.url : ""}
                alt="WebbyTemplate"
                className="w-full h-full bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden block bg-white shadow-lg border-blue-300">
          <div className="px-4 pt-2 pb-3 space-y-1 grid">
            <Link href="/become-author" className="links !text-black">
              Become an author
            </Link>
            <Link href="/partners" className="links !text-black">
              Partners
            </Link>
            <Link href="/offers" className="links !text-black">
              Offers
            </Link>
            <Link href="/support" className="links !text-black">
              Support
            </Link>
            <Link href="/hire-agency" className="links !text-black">
              Hire an agency
            </Link>
            <Link
              href="/downloads"
              className="block px-3 py-2 text-base font-medium text-primary hover:text-blue-800"
            >
              Unlimited Downloads
            </Link>
            <Link href="/schedule" className="links !text-black">
              Schedule Meeting
            </Link>
            <Link href={`/login`} className="links !text-black">
              Login / Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
