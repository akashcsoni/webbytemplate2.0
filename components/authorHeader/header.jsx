"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar } from "@heroui/react";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { useWishlist } from "@/contexts/WishListContext";
import { useCart } from "@/contexts/CartContext";
import SideCart from "../SideCart";

export default function AuthorHeader({ authUser }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const { logout } = useAuth();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { wishlistItems } = useWishlist();
  const { toggleCart, cartItems } = useCart();

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

  // const cartItems = [
  //   {
  //     id: 1,
  //     title: "Orion: Construction Company Figma UI Template Kit",
  //     price: 129,
  //     image: "/images/orion.png",
  //   },
  //   {
  //     id: 2,
  //     title: "Diazelo: Fashion & Clothing eCommerce XD Template",
  //     price: 79,
  //     image: "/images/diazelo.png",
  //   },
  //   {
  //     id: 3,
  //     title: "Syndicate: Business Consulting HTML Website Template",
  //     price: 56,
  //     image: "/images/syndicate.png",
  //   },
  //   {
  //     id: 4,
  //     title: "Journeya: Travel Agency HTML Website Template",
  //     price: 149,
  //     image: "/images/journeya.png",
  //   },
  // ];

  // useEffect(() => {
  //   if (openCart) {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }
  // }, [openCart]);
  // const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
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

  const isAuthor = authUser?.author === true;

  // Get documentId from authUser (documentId || id)
  const getDocumentId = () => {
    return authUser?.documentId || authUser?.id || "";
  };

  const commonItems = [
    {
      id: "settiings",
      label: "Settiing",
      path: `/user/${getDocumentId()}/setting`,
    },
    {
      id: "downloads",
      label: "Downloads",
      path: `/user/${getDocumentId()}/download`,
    },
    {
      id: "ticket-support",
      label: isAuthor ? "Tickets / Support" : "Support",
      path: `/user/${getDocumentId()}/support`,
    },
  ];

  const authorItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      path: `/user/${getDocumentId()}/dashboard`,
    },
    {
      id: "products",
      label: "Products",
      path: `/user/${getDocumentId()}/products/list`,
    },
    {
      id: "profile",
      label: "Profile",
      path: `/user/${getDocumentId()}/profile`,
    }
  ];

  const nonAuthorExtra = [
    {
      id: "become-an-author",
      label: "Become an Author",
      path: `/user/${getDocumentId()}/become-an-author`,
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
            <div className="navigation-links flex items-center h-full gap-4">
              <Link href="/offers" className="author-links !text-white">
                Offers
              </Link>
              <Link href="/support" className="author-links !text-white">
                Support
              </Link>
            </div>
            {/* Search Icon */}
            {/* <button
              className="block flex-shrink-0 w-6 h-full"
              onClick={toggleSearch}
            >
              <svg
                className="flex-shrink-0 sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
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
            </button> */}

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
                  className="w-full outline-none text-white placeholder:text-white text-base bg-primary"
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
                    className="flex-shrink-0 sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
                    width="22"
                    height="22"
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
                      ? "opacity-100 sm:h-14 h-12 z-100 right-0"
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

            <Link
              href="/wishlist"
              className="heart flex items-center relative 1xl:pl-[15px] pl-1.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 22 22"
                fill="none"
                className="sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
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

              {/* 🔹 Wishlist count badge */}
              <span className="author-badge">{wishlistItems?.length || 0}</span>
            </Link>

            <div className="flex items-center relative 1xl:pl-[15px] pl-1.5 pr-1">
              <button className="" onClick={toggleCart}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 18 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="1xl:w-[22px] 1xl:h-[22px] sm:w-5 sm:h-5 w-[18px] h-[18px] mr-1"
                >
                  <path
                    d="M5.74935 7.75V4.5C5.74935 2.70507 7.20442 1.25 8.99935 1.25C10.7943 1.25 12.2493 2.70507 12.2493 4.5V7.75M2.49935 5.58333H15.4993L16.5827 19.6667H1.41602L2.49935 5.58333Z"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="author-badge">{cartItems?.length || 0}</span>
              </button>

              <SideCart />
            </div>

            <Link
              href="https://calendly.com/webbytemplate-support/45min"
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
                className="1xl:hidden block sm:w-[22px] sm:h-[22px] w-[18px] h-[18px]"
              >
                <path
                  d="M5.12938 9.99986V6.7961C5.1389 6.16635 5.27258 5.54467 5.52277 4.96
                  667C5.77297 4.38868 6.13475 3.86573 6.5874 3.42779C7.04004 2.98986 7.57465 2.64554 8.1606 2.41458C8.74654 2.18361 9.3723 2.07053 10.002 2.08182C10.6317 2.07053 11.2575 2.18361 11.8434 2.41458C12.4294 2.64554 12.964 2.98986 13.4166 3.42779C13.8693 3.86573 14.2311 4.38868 14.4813 4.96667C14.7315 5.54467 14.8651 6.16635 14.8747 6.7961V9.99986M12.4383 16.3952C13.0845 16.3952 13.7042 16.1385 14.1611 15.6816C14.618 15.2247 14.8747 14.605 14.8747 13.9589V11.218M12.4383 16.3952C12.4383 16.799 12.2779 17.1864 11.9924 17.4719C11.7068 17.7575 11.3195 17.9179 10.9156 17.9179H9.0884C8.68456 17.9179 8.29725 17.7575 8.01169 17.4719C7.72613 17.1864 7.5657 16.799 7.5657 16.3952C7.5657 15.9914 7.72613 15.6041 8.01169 15.3185C8.29725 15.0329 8.68456 14.8725 9.0884 14.8725H10.9156C11.3195 14.8725 11.7068 15.0329 11.9924 15.3185C12.2779 15.6041 12.4383 15.9914 12.4383 16.3952ZM3.30214 8.17262H4.5203C4.68184 8.17262 4.83676 8.23679 4.95099 8.35102C5.06521 8.46524 5.12938 8.62017 5.12938 8.7817V12.4362C5.12938 12.5977 5.06521 12.7526 4.95099 12.8669C4.83676 12.9811 4.68184 13.0453 4.5203 13.0453H3.30214C2.97907 13.0453 2.66922 12.9169 2.44078 12.6885C2.21233 12.46 2.08398 12.1502 2.08398 11.8271V9.39078C2.08398 9.06771 2.21233 8.75786 2.44078 8.52941C2.66922 8.30097 2.97907 8.17262 3.30214 8.17262ZM16.7019 13.0453H15.4837C15.3222 13.0453 15.1673 12.9811 15.0531 12.8669C14.9388 12.7526 14.8747 12.5977 14.8747 12.4362V8.7817C14.8747 8.62017 14.9388 8.46524 15.0531 8.35102C15.1673 8.23679 15.3222 8.17262 15.4837 8.17262H16.7019C17.025 8.17262 17.3348 8.30097 17.5633 8.52941C17.7917 8.75786 17.9201 9.06771 17.9201 9.39078V11.8271C17.9201 12.1502 17.7917 12.46 17.5633 12.6885C17.3348 12.9169 17.025 13.0453 16.7019 13.0453Z"
                  stroke="white"
                  strokeWidth="1.25028"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <div
              className="relative flex text-left 1xl:px-[15px] pl-1 1xl:pr-3 sm:pr-1.5 pr-0"
              ref={dropdownRef}
            >
              <button
                onClick={toggleDropdown}
                className="inline-flex items-center 1xl:gap-2 text-white rounded-full focus:outline-none sm:m-0 mr-[5px]"
              >
                <span className="1xl:block hidden truncate 2xl:w-[80px] w-[75px]">
                  Hello, {authUser?.profile_name || authUser?.username || "Name"}
                </span>
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
                <div className="absolute right-0 sm:top-0 -top-[10px] 1xl:pt-3 pt-2.5 1xl:mt-[22px] mt-[30px] shadow-dropDown overflow-hidden rounded-md z-10 before:content-[''] before:absolute before:top-1 before:right-[10%] 1xl:before:w-4 1xl:before:h-5 before:w-3 before:h-3 before:bg-white before:rotate-45  before:rounded-sm before:overflow-hidden">
                  <div className="z-20 relativexl:w-[12.5rem] md:w-[11rem] w-[10rem] origin-top-right rounded-md bg-white overflow-hidden">
                    <ul className="divide-y divide-primary/10">
                      {menuItems?.map((item, index) => {
                        return (
                          <li
                            className={
                              isActive(item.path)
                                ? "bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3"
                                : " hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3"
                            }
                            key={index}
                          >
                            <Link href={item.path}>
                              <p
                                className={
                                  isActive(item.path)
                                    ? "block !text-primary p2"
                                    : "block text-gray-800 group-hover:text-primary p2"
                                }
                              >
                                {item.label}
                              </p>
                            </Link>
                          </li>
                        );
                      })}
                      <li className="sm:px-5 sm:py-[10px] p-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            logout();
                          }}
                          className="flex items-center justify-between w-full border border-primary/15 rounded-[4px] bg-blue-300 xl:py-2 xl:px-4 py-1 px-2 hover:bg-primary group"
                        >
                          <p className="block !text-primary  group-hover:!text-white p2 ">
                            Log Out
                          </p>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            className="fill-primary group-hover:fill-white md:w-[18px] md:h-[18px] w-3.5 h-3.5"
                          >
                            <g clipPath="url(#clip0_5114_156)">
                              <path d="M8.99996 0.979156C9.18229 0.979156 9.35716 1.05159 9.48609 1.18052C9.61503 1.30945 9.68746 1.48432 9.68746 1.66666C9.68746 1.84899 9.61503 2.02386 9.48609 2.15279C9.35716 2.28172 9.18229 2.35416 8.99996 2.35416C7.23737 2.35416 5.54698 3.05434 4.30065 4.30068C3.05431 5.54701 2.35413 7.2374 2.35413 8.99999C2.35413 10.7626 3.05431 12.453 4.30065 13.6993C5.54698 14.9456 7.23737 15.6458 8.99996 15.6458C9.18229 15.6458 9.35716 15.7183 9.48609 15.8472C9.61503 15.9761 9.68746 16.151 9.68746 16.3333C9.68746 16.5157 9.61503 16.6905 9.48609 16.8195C9.35716 16.9484 9.18229 17.0208 8.99996 17.0208C6.8727 17.0208 4.83257 16.1758 3.32837 14.6716C1.82418 13.1674 0.979126 11.1272 0.979126 8.99999C0.979126 6.87273 1.82418 4.8326 3.32837 3.3284C4.83257 1.82421 6.8727 0.979156 8.99996 0.979156Z" />
                              <path d="M13.0975 6.73584C12.976 6.60551 12.9099 6.43313 12.913 6.25502C12.9162 6.07691 12.9883 5.90698 13.1143 5.78102C13.2403 5.65505 13.4102 5.5829 13.5883 5.57976C13.7664 5.57662 13.9388 5.64273 14.0691 5.76417L16.8191 8.51417C16.9479 8.64308 17.0202 8.81781 17.0202 9C17.0202 9.18219 16.9479 9.35693 16.8191 9.48584L14.0691 12.2358C14.0062 12.3034 13.9303 12.3576 13.846 12.3951C13.7616 12.4327 13.6706 12.4529 13.5783 12.4545C13.486 12.4562 13.3943 12.4392 13.3087 12.4046C13.2231 12.37 13.1453 12.3186 13.08 12.2533C13.0147 12.188 12.9633 12.1102 12.9287 12.0246C12.8941 11.939 12.8771 11.8473 12.8788 11.755C12.8804 11.6627 12.9006 11.5717 12.9382 11.4873C12.9757 11.403 13.0299 11.3271 13.0975 11.2642L14.6741 9.6875H7.16663C6.98429 9.6875 6.80942 9.61507 6.68049 9.48614C6.55156 9.35721 6.47913 9.18234 6.47913 9C6.47913 8.81767 6.55156 8.6428 6.68049 8.51387C6.80942 8.38494 6.98429 8.3125 7.16663 8.3125H14.6741L13.0975 6.73584Z" />
                            </g>
                          </svg>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="1xl:w-[37px] 1xl:h-[37px] sm:w-[32px] sm:h-[32px] w-6 h-6 !m-0 rounded-full border border-blue-300">
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
