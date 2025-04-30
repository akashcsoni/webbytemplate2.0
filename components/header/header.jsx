"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import CountdownTimer from "./countdown-timer";
import MegaMenu from "./mega-menu";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

const mainMenu = [
  {
    id: 1,
    label: "Templates & Themes",
    name: "templates",
    menu: [
      {
        id: 1,
        label: "WordPress Themes",
        sub_menu: [
          {
            id: 1,
            label: "Premium Themes",
            slug: "/premium-themes",
            tag: null,
          },
          { id: 2, label: "Free Themes", slug: "/free-themes", tag: null },
          {
            id: 3,
            label: "Multipurpose Themes",
            slug: "/multipurpose-themes",
            tag: null,
          },
          { id: 4, label: "Blog Themes", slug: "/blog-themes", tag: null },
          {
            id: 5,
            label: "Business Themes",
            slug: "/business-themes",
            tag: null,
          },
          {
            id: 6,
            label: "Portfolio Themes",
            slug: "/portfolio-themes",
            tag: "New",
          },
          {
            id: 7,
            label: "Creative Themes",
            slug: "/creative-themes",
            tag: null,
          },
          {
            id: 8,
            label: "WooCommerce Themes",
            slug: "/woocommerce-themes",
            tag: null,
          },
          {
            id: 9,
            label: "Minimalist Themes",
            slug: "/minimalist-themes",
            tag: null,
          },
        ],
      },
      {
        id: 2,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 10,
            label: "Landing Page Kits",
            slug: "/landing-page-kits",
            tag: null,
          },
          { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
          { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
          { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
        ],
      },
      {
        id: 3,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 1,
            label: "Premium Themes",
            slug: "/premium-themes",
            tag: null,
          },
          { id: 2, label: "Free Themes", slug: "/free-themes", tag: null },
          {
            id: 3,
            label: "Multipurpose Themes",
            slug: "/multipurpose-themes",
            tag: null,
          },
          { id: 4, label: "Blog Themes", slug: "/blog-themes", tag: null },
          {
            id: 5,
            label: "Business Themes",
            slug: "/business-themes",
            tag: null,
          },
          {
            id: 6,
            label: "Portfolio Themes",
            slug: "/portfolio-themes",
            tag: "New",
          },
          {
            id: 7,
            label: "Creative Themes",
            slug: "/creative-themes",
            tag: null,
          },
          {
            id: 8,
            label: "WooCommerce Themes",
            slug: "/woocommerce-themes",
            tag: null,
          },
          {
            id: 9,
            label: "Minimalist Themes",
            slug: "/minimalist-themes",
            tag: null,
          },
        ],
      },
      {
        id: 4,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 10,
            label: "Landing Page Kits",
            slug: "/landing-page-kits",
            tag: null,
          },
          { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
          { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
          { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
        ],
      },
      {
        id: 5,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 10,
            label: "Landing Page Kits",
            slug: "/landing-page-kits",
            tag: null,
          },
          { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
          { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
        ],
      },
      {
        id: 6,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 10,
            label: "Landing Page Kits",
            slug: "/landing-page-kits",
            tag: null,
          },
          { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
          { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
          { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
        ],
      },
      {
        id: 7,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 10,
            label: "Landing Page Kits",
            slug: "/landing-page-kits",
            tag: null,
          },
          { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
          { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
          { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
        ],
      },
      {
        id: 8,
        label: "Elementor Kits",
        sub_menu: [
          {
            id: 10,
            label: "Landing Page Kits",
            slug: "/landing-page-kits",
            tag: null,
          },
          { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
          { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
          { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
        ],
      },
    ],
  },
  {
    id: 2,
    label: "Plugins",
    name: "plugins",
    menu: [
      {
        id: 4,
        label: "WordPress Plugins",
        sub_menu: [
          { id: 14, label: "SEO Plugins", slug: "/seo-plugins", tag: null },
          {
            id: 17,
            label: "Security Plugins",
            slug: "/security-plugins",
            tag: null,
          },
          {
            id: 18,
            label: "Performance Optimization",
            slug: "/performance-optimization",
            tag: null,
          },
          { id: 19, label: "Contact Forms", slug: "/contact-forms", tag: null },
          { id: 20, label: "Page Builders", slug: "/page-builders", tag: null },
        ],
      },
      {
        id: 5,
        label: "PrestaShop Modules",
        sub_menu: [
          {
            id: 15,
            label: "Payment Gateways",
            slug: "/payment-gateways",
            tag: null,
          },
          {
            id: 16,
            label: "Shipping & Logistics",
            slug: "/shipping-and-logistics",
            tag: null,
          },
          {
            id: 21,
            label: "Marketing & Promotions",
            slug: "/marketing-and-promotions",
            tag: null,
          },
          {
            id: 22,
            label: "Customer Support",
            slug: "/customer-support",
            tag: null,
          },
          {
            id: 23,
            label: "Inventory Management",
            slug: "/inventory-management",
            tag: null,
          },
        ],
      },
    ],
  },
];

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  // Handlers for mouse events
  const handleMouseEnter = (category) => {
    setActiveCategory(category);
  };

  const handleMouseLeave = () => {
    setActiveCategory(null);
  };

  return (
    <div className="bg-white border-b border-primary/10 relative">
      <div className="mx-auto px-4">
        <nav>
          {/* Main Menu */}
          <div className="flex">
            {mainMenu.map(({ name, label }) => (
              <div
                key={name}
                className="relative lg:block hidden"
                onMouseEnter={() => handleMouseEnter(name)}
              >
                <div
                  className={cn(
                    "cursor-pointer flex items-center space-x-1 py-4 px-3",
                    activeCategory === name &&
                    "text-primary hover:text-primary border-b border-primary",
                  )}
                >
                  <span className="p2">{label}</span>
                  <svg width="9" height="11" viewBox="0 0 9 11" fill="none">
                    <path
                      d="M4.1612 9.18783C4.35263 9.36422 4.64737 9.36422 4.8388 9.18783L8.8388 5.5023C8.94155 5.40763 9 5.27429 9 5.13459V4.64321C9 4.20715 8.48076 3.98005 8.16057 4.27607L4.83943 7.34657C4.64781 7.52372 4.35219 7.52372 4.16057 7.34657L0.839427 4.27607C0.519237 3.98005 0 4.20715 0 4.64321V5.13459C0 5.27429 0.0584515 5.40763 0.161196 5.5023L4.1612 9.18783Z"
                      fill="#505050"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:hidden flex border-2 border-blue-300 rounded-[5px] bg-white overflow-hidden sm:h-[48px] h-full w-full mb-6">
            <input
              type="email"
              placeholder="Search for “Web Templates” and More....."
              className="flex-grow outline-none px-4 text-gray-200/80 sm:text-base text-[15px] w-full"
            />
            <button
              type="submit"
              className="btn btn-primary font-medium whitespace-nowrap group !rounded-l-none"
            >
              <svg
                className="stroke-white group-hover:stroke-primary group-active:stroke-primary group-focus:stroke-primary"
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
            </button>
          </div>
          {/* Container for all submenus */}
          <div
            className={cn(
              "absolute left-0 right-0 bg-white shadow-lg z-10 mt-[1px]",
              activeCategory ? "block" : "hidden",
            )}
            onMouseEnter={() =>
              activeCategory && setActiveCategory(activeCategory)
            }
            onMouseLeave={handleMouseLeave}
          >
            {/* Submenu Dropdowns */}
            {mainMenu.map(({ name, menu }) =>
              activeCategory === name && menu ? (
                <div key={name} className="mx-auto py-6 px-4">
                  <div className="grid grid-cols-4 lg:grid-cols-5 gap-8 px-4">
                    {menu.map(({ id, label, sub_menu }) => (
                      <div key={id}>
                        <h3 className="mb-2 pb-3 border-b-2 border-blue-300 p !text-black">
                          {label}
                        </h3>
                        <ul className="2xl:space-y-4 space-y-3">
                          {sub_menu.map(({ id, label, slug, tag }) => (
                            <li key={id}>
                              <div className="flex items-center">
                                <Link
                                  href={slug}
                                  className="p2 hover:text-primary"
                                >
                                  {label}
                                </Link>
                                {tag && (
                                  <span className="ml-2 btn-secondary !border-primary text-xs px-2 py-0.5 rounded-full">
                                    {tag}
                                  </span>
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null,
            )}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default function Header() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    let value = e.target.value.trim();

    // Check if input is a number and doesn't already start with +
    if (/^\d{5,}$/.test(value) && !value.startsWith("+")) {
      value = "+91" + value;
    }

    setInputValue(value);
  };

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

  return (
    <header className="relative z-50">
      {/* Notification Bar */}
      <div className="bg-primary text-white py-[7px] text-center">
        <div className="container mx-auto sm:flex md:items-center items-start justify-center hidden">
          <CountdownTimer />
          <span className="ml-2 2xl:text-base text-[15px]">
            Exclusive 10% OFF! Up to $10 Hurry Before Time Runs Out! Use Code:
            <span className="font-bold text-orange-100 border-b border-orange-100 text-base ml-0.5">
              WEBBY10
            </span>
          </span>
        </div>
        <div className="flex items-center justify-center text-white text-sm gap-1 sm:hidden">
          <Image
            src="/images/fire.png"
            alt="WebbyTemplate"
            width={14}
            height={14}
            className="w-[14px] h-[14px] mb-0.5"
          />
          10% OFF (Up to $10)! Code: WEBBY10
          <Image
            src="/images/time.png"
            alt="WebbyTemplate"
            width={14}
            height={14}
            className="w-[14px] h-[15px] mb-1"
          />
          Hurry!
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-white lg:border-b border-primary/10">
        <div className="flex items-center justify-between h-[75px] mx px-4 sm:flex-nowrap flex-wrap">
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
                stroke="currentColor"
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
            <div className="nav-logo">
              <Link href="/" className="flex items-center" onClick={closeMenu}>
                <Image
                  src="/logo/webbytemplate-logo.svg"
                  alt="WebbyTemplate"
                  width={180}
                  height={40}
                  className="main-logo"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="links-content">
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
                className=" links !text-primary hover:!text-primary/80"
              >
                Unlimited Downloads
              </Link>
            </nav>
          </div>
          {/* Right Side Actions */}
          <div className="button-content lg:space-x-1 sm:space-x-2 space-x-1 nav-icons">
            {/* Search Icon */}
            <button
              className="text-gray-700 hover:text-primary mr-0.5 lg:block hidden"
              onClick={toggleSearch}
            >
              <svg
                className="search"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z"
                  stroke="black"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Search Bar */}
            <div
              className={`search-bar right-[408px] h-[74px] absolute z-50 bg-white overflow-hidden transition-all duration-700 ease-in-out flex items-center justify-between ${isSearchOpen
                ? "w-[61%] opacity-100 z-100 p-2"
                : "w-0 opacity-0 z-0 p-0"
                }`}
            >
              <div className="flex items-center justify-start w-full gap-5">
                <svg
                  className="stroke-primary w-[22px] h-[22px] flex-shrink-0"
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
                  className="w-full outline-none text-[#505050] placeholder:text-[#505050] text-base"
                />
              </div>
              <button onClick={toggleSearch} className="ml-2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                >
                  <path
                    d="M17 5L5 17M5 5L17 17"
                    stroke="black"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <Link href="/schedule" className="meeting 1xl:hidden block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                className="sm:w-[22px] sm:h-[22px] w-5 h-5 icon"
              >
                <path
                  d="M5.12938 9.99986V6.7961C5.1389 6.16635 5.27258 5.54467 5.52277 4.96667C5.77297 4.38868 6.13475 3.86573 6.5874 3.42779C7.04004 2.98986 7.57465 2.64554 8.1606 2.41458C8.74654 2.18361 9.3723 2.07053 10.002 2.08182C10.6317 2.07053 11.2575 2.18361 11.8434 2.41458C12.4294 2.64554 12.964 2.98986 13.4166 3.42779C13.8693 3.86573 14.2311 4.38868 14.4813 4.96667C14.7315 5.54467 14.8651 6.16635 14.8747 6.7961V9.99986M12.4383 16.3952C13.0845 16.3952 13.7042 16.1385 14.1611 15.6816C14.618 15.2247 14.8747 14.605 14.8747 13.9589V11.218M12.4383 16.3952C12.4383 16.799 12.2779 17.1864 11.9924 17.4719C11.7068 17.7575 11.3195 17.9179 10.9156 17.9179H9.0884C8.68456 17.9179 8.29725 17.7575 8.01169 17.4719C7.72613 17.1864 7.5657 16.799 7.5657 16.3952C7.5657 15.9914 7.72613 15.6041 8.01169 15.3185C8.29725 15.0329 8.68456 14.8725 9.0884 14.8725H10.9156C11.3195 14.8725 11.7068 15.0329 11.9924 15.3185C12.2779 15.6041 12.4383 15.9914 12.4383 16.3952ZM3.30214 8.17262H4.5203C4.68184 8.17262 4.83676 8.23679 4.95099 8.35102C5.06521 8.46524 5.12938 8.62017 5.12938 8.7817V12.4362C5.12938 12.5977 5.06521 12.7526 4.95099 12.8669C4.83676 12.9811 4.68184 13.0453 4.5203 13.0453H3.30214C2.97907 13.0453 2.66922 12.9169 2.44078 12.6885C2.21233 12.46 2.08398 12.1502 2.08398 11.8271V9.39078C2.08398 9.06771 2.21233 8.75786 2.44078 8.52941C2.66922 8.30097 2.97907 8.17262 3.30214 8.17262ZM16.7019 13.0453H15.4837C15.3222 13.0453 15.1673 12.9811 15.0531 12.8669C14.9388 12.7526 14.8747 12.5977 14.8747 12.4362V8.7817C14.8747 8.62017 14.9388 8.46524 15.0531 8.35102C15.1673 8.23679 15.3222 8.17262 15.4837 8.17262H16.7019C17.025 8.17262 17.3348 8.30097 17.5633 8.52941C17.7917 8.75786 17.9201 9.06771 17.9201 9.39078V11.8271C17.9201 12.1502 17.7917 12.46 17.5633 12.6885C17.3348 12.9169 17.025 13.0453 16.7019 13.0453Z"
                  stroke="black"
                  strokeWidth="1.25028"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            <Link href="/schedule" className="heart 1xl:hidden block">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 22 22"
                fill="none"
                className="sm:w-[22px] sm:h-[22px] w-5 h-5 icon"
              >
                <g clipPath="url(#clip0_2528_235)">
                  <path
                    d="M2.5633 11.6888C0.48549 8.91835 1.17809 4.76273 4.64111 3.37753C8.10412 1.99232 10.1819 4.76273 10.8745 6.14794C11.5671 4.76273 14.3375 1.99232 17.8006 3.37753C21.2636 4.76273 21.2636 8.91835 19.1858 11.6888C17.108 14.4592 10.8745 20 10.8745 20C10.8745 20 4.64111 14.4592 2.5633 11.6888Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </svg>
            </Link>

            <Link href="/schedule" className="schedule">
              Schedule Meeting
            </Link>



            <button onClick={onOpen} style={{ minWidth: 'auto', padding: 0 }} className="login" >
              <span className="btn btn-primary">Login / Sign up</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={20}
                height={20}
                viewBox="0 0 20 20"
                fill="none"
                className="sm:w-[22px] sm:h-[22px] w-5 h-5 1xl:hidden block"
              >
                <path
                  d="M16.3442 17.7023C16.3442 14.7013 12.9983 12.2618 9.99732 12.2618C6.99631 12.2618 3.65039 14.7013 3.65039 17.7023M9.99732 9.54245C10.9592 9.54245 11.8816 9.16036 12.5618 8.48022C13.2419 7.80008 13.624 6.87762 13.624 5.91576C13.624 4.9539 13.2419 4.03143 12.5618 3.3513C11.8816 2.67116 10.9592 2.28906 9.99732 2.28906C9.03546 2.28906 8.11299 2.67116 7.43286 3.3513C6.75272 4.03143 6.37062 4.9539 6.37062 5.91576C6.37062 6.87762 6.75272 7.80008 7.43286 8.48022C8.11299 9.16036 9.03546 9.54245 9.99732 9.54245Z"
                  stroke="black"
                  strokeWidth="1.25028"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <Link href="/cart" className="relative">
              <svg
                width="18"
                height="21"
                viewBox="0 0 18 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="sm:w-[22px] sm:h-[22px] w-5 h-5 icon"
              >
                <path
                  d="M5.74935 7.75V4.5C5.74935 2.70507 7.20442 1.25 8.99935 1.25C10.7943 1.25 12.2493 2.70507 12.2493 4.5V7.75M2.49935 5.58333H15.4993L16.5827 19.6667H1.41602L2.49935 5.58333Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="badge">0</span>
            </Link>
          </div>
          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={{
              backdrop: "bg-black/50",
            }}
          >
            <ModalContent className="p-[30px] xl:w-[510px] sm:w-[474px] w-full">
              {(onClose) => (
                <>
                  <ModalHeader className="p-0 h2 gap-1 flex items-center justify-between w-full mb-[10px]">
                    Log in
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      className="cursor-pointer"
                      onClick={onClose}
                    >
                      <path
                        d="M17 5L5 17M5 5L17 17"
                        stroke="black"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </ModalHeader>
                  <ModalBody className="p-0 gap-0">
                    <p className="p2 sm:mb-[30px] mb-5">
                      Seamless shopping starts with a simple login.
                    </p>

                    {/* Input */}
                    <input
                      type="text"
                      placeholder="Enter Email/Mobile number"
                      className="w-full px-4 sm:py-[11px] py-[10px] border border-gray-100 text-gray-300 placeholder:text-gray-300 p-2 rounded-[5px] mb-[18px] focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={inputValue}
                      onChange={handleInputChange}
                    />

                    {/* Terms */}
                    <p className="p2 mb-[22px]">
                      By continuing, you acknowledge and agree to our{" "}
                      <a href="#" className="text-blue-600 underline">
                        Terms of use
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 underline">
                        Privacy Policy
                      </a>
                      .
                    </p>

                    {/* Sign In Button */}
                    <button className="w-full btn btn-primary">Sign in</button>
                  </ModalBody>
                  <ModalFooter className="p-0">
                    <div className="flex items-center justify-center w-full">
                      {/* Footer Text */}
                      <p className="p2 text-center text-sm text-gray-700 mt-[22px]">
                        Don’t have account?{" "}
                        <a
                          href="#"
                          className="text-blue-600 font-medium hover:underline"
                        >
                          Create an account
                        </a>
                      </p>
                    </div>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>

      <Menu />

      {/* Mega Menu */}
      {isMenuOpen && activeCategory && (
        <div className="absolute w-full bg-white shadow-lg border-t z-50">
          <MegaMenu category={activeCategory} />
        </div>
      )}

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
