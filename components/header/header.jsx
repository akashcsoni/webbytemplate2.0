"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import CountdownTimer from "./countdown-timer";
import MegaMenu from "./mega-menu";
import { strapiGet } from "@/lib/api/strapiClient";
import { themeConfig } from "@/config/theamConfig";
import { containsTargetURL } from "@/lib/containsTargetURL";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import AuthModal from "../AuthModal";
import SideCart from "../SideCart";
import { usePathname, useRouter } from "next/navigation";
import { Skeleton } from "@heroui/react";
import { useWishlist } from "@/contexts/WishListContext";

export default function Header() {
  // for after login start
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleDropdown = () => setOpen(!open);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Separate loading states for menu and settings
  const [isMenuLoading, setIsMenuLoading] = useState(true);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);

  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault(); // Prevent full page reload
  //   const trimmed = query.trim();
  //   if (trimmed !== "") {
  //     router.push(`/search/${encodeURIComponent(trimmed)}`);
  //   }
  // };

    // Clear search query when navigating away from search page
    useEffect(() => {
      if (!pathname.startsWith('/search/')) {
        setQuery("");
      }
    }, [pathname]);

    const handleSubmit = (e) => {
      e.preventDefault(); // Prevent full page reload
      const trimmed = query.trim();
      if (trimmed !== "") {
        router.push(`/search/${encodeURIComponent(trimmed)}`);
        // Clear the search query after navigation
        setQuery("");
        // Close search bar on mobile/desktop
        setIsSearchOpen(false);
      }
    };
  

  // Initialize apiMenu state as empty array
  const [apiMenu, setApiMenu] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const { openAuth, authLoading, isAuthenticated, logout, authUser } =
    useAuth();
  const { toggleCart, cartItems } = useCart();
  const { wishlistItems } = useWishlist(); // wishlist count state

  useEffect(() => {
    const fetchMenuData = async () => {
      setIsMenuLoading(true);
      try {
        const [menuResponse] = await Promise.all([
          strapiGet("header-menu", {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
          }),
        ]);

        if (menuResponse && menuResponse.data.main_menu) {
          // Transform the API menuResponse to match our component's expected format
          const transformedMenu = menuResponse.data.main_menu.map((item) => {
            // Generate a name from the label (lowercase, replace spaces with dashes)
            const name = item.label
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/&/g, "and");
            return {
              id: item.id,
              label: item.label,
              name: name, // Add the generated name property
              slug: item.slug,
              menu: item.menu.map((subItem) => ({
                id: subItem.id,
                label: subItem.label,
                slug: subItem.slug,
                sub_menu: subItem.sub_menu.map((menuItem) => ({
                  id: menuItem.id,
                  label: menuItem.label,
                  slug: menuItem.slug,
                  tag: menuItem.tag,
                })),
              })),
            };
          });
          setApiMenu(transformedMenu);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
        // Set empty array if API fails
        setApiMenu([]);
      } finally {
        setIsMenuLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const fetchHeaderSettingData = async () => {
      setIsSettingsLoading(true);
      try {
        const [headerSetting] = await Promise.all([
          strapiGet("header-setting", {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
          }),
        ]);

        const settingsData = headerSetting?.data?.[0] || {};

        setheaderSettingData(settingsData);
      } catch (error) {
        console.error("Error fetching menu data:", error);
        // Set empty object if API fails
        setheaderSettingData({});
      } finally {
        setIsSettingsLoading(false);
      }
    };

    fetchHeaderSettingData();
  }, []);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [headerSettingData, setheaderSettingData] = useState({});

  // const toggleSearch = () => {
  // setIsSearchOpen((prev) => !prev);
  // };

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      const newState = !prev;

      if (!prev && inputRef.current) {
        // Focus input after state update (with small delay so it renders)
        setTimeout(() => inputRef.current.focus(), 50);
      }

      return newState;
    });
  };

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
    setActiveCategory(null);
  }, []);

  // Add this code right before the `return` statement in the Header component
  const Menu = ({ loading }) => {
    const [menuActiveCategory, setMenuActiveCategory] = useState(null);

    // Handlers for mouse events
    const handleMouseEnter = (category) => {
      setMenuActiveCategory(category);
    };

    const handleMouseLeave = () => {
      setMenuActiveCategory(null);
    };

    return (
      <div className="bg-white border-b border-primary/10 relative">
        <div className="mx-auto px-4">
          <nav>
            {/* Main Menu */}
            <div className="flex">
              {!loading
                ? apiMenu.map(({ name, label, slug }) => (
                  <div
                    key={name}
                    className="relative lg:block hidden"
                    onMouseEnter={() => handleMouseEnter(name)}
                  >
                    <div
                      className={cn(
                        "cursor-pointer flex items-center space-x-1 py-4 px-3",
                        menuActiveCategory === name &&
                        "text-primary hover:text-primary border-b border-primary"
                      )}
                    >
                      <Link href={slug}>
                        <span className="p2 hover:text-primary">{label}</span>
                      </Link>
                      <svg
                        width="9"
                        height="11"
                        viewBox="0 0 9 11"
                        fill="none"
                      >
                        <path
                          d="M4.1612 9.18783C4.35263 9.36422 4.64737 9.36422 4.8388 9.18783L8.8388 5.5023C8.94155 5.40763 9 5.27429 9 5.13459V4.64321C9 4.20715 8.48076 3.98005 8.16057 4.27607L4.83943 7.34657C4.64781 7.52372 4.35219 7.52372 4.16057 7.34657L0.839427 4.27607C0.519237 3.98005 0 4.20715 0 4.64321V5.13459C0 5.27429 0.0584515 5.40763 0.161196 5.5023L4.1612 9.18783Z"
                          fill="#505050"
                        />
                      </svg>
                    </div>
                  </div>
                ))
                : [...Array(9)].map((_, idx) => (
                  <Skeleton
                    className="my-4 h-5 2xl:w-[115px] xl:w-[100px] w-[85px] rounded-md 1xl:block hidden mr-3"
                    key={idx}
                  />
                ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="lg:hidden flex border-2 border-blue-300 rounded-[5px] bg-white overflow-hidden md:h-[48px] sm:h-10 h-full w-full mb-6"
            >
              <input
                type="text"
                placeholder='Search for "Web Templates" and More.....'
                className="flex-grow outline-none px-4 text-gray-300 placeholder:text-gray-300 w-full p2"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
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
            </form>
            {/* Container for all submenus */}
            <div
              className={cn(
                "absolute left-0 right-0 bg-white shadow-lg z-10 mt-[1px]",
                menuActiveCategory ? "block" : "hidden"
              )}
              onMouseEnter={() =>
                menuActiveCategory && setMenuActiveCategory(menuActiveCategory)
              }
              onMouseLeave={handleMouseLeave}
            >
              {/* Submenu Dropdowns */}
              {apiMenu.map(({ name, menu }) =>
                menuActiveCategory === name && menu ? (
                  <div key={name} className="mx-auto py-6 px-4">
                    <div className="grid grid-cols-4 lg:grid-cols-5 gap-8 px-4">
                      {menu.map(
                        ({ id, label, sub_menu, slug }) =>
                          // Show submenu if we have sub_menu items, regardless of label/slug
                          sub_menu &&
                          sub_menu.length > 0 && (
                            <div key={id}>
                              {label && slug ? (
                                <Link href={slug} className="group block">
                                  <h3 className="mb-2 pb-3 border-b-2 border-blue-300 p text-black transition-colors duration-300 group-hover:text-primary">
                                    {label}
                                  </h3>
                                </Link>
                              ) : (
                                <span className="block 2xl:h-[44px] xl:h-[42px] h-[38px] mb-2 pb-3 border-b-2 border-blue-300 p text-black transition-colors duration-300 group-hover:text-primary">
                                  {label}
                                </span>
                              )}
                              <ul className="2xl:space-y-4 space-y-3">
                                {sub_menu &&
                                  sub_menu.map(
                                    ({ id, label, slug, tag }) =>
                                      // Show sub-menu items if we have label, regardless of slug
                                      label && (
                                        <li key={id}>
                                          <div className="flex items-center">
                                            {slug ? (
                                              <Link
                                                prefetch={true}
                                                href={slug}
                                                className="p2 hover:text-primary"
                                              >
                                                {label}
                                              </Link>
                                            ) : (
                                              <span className="p2 text-gray-600">
                                                {label}
                                              </span>
                                            )}
                                            {tag && (
                                              <span className="ml-2 btn-secondary !border-primary text-xs px-2 py-0.5 rounded-full">
                                                {tag}
                                              </span>
                                            )}
                                          </div>
                                        </li>
                                      )
                                  )}
                              </ul>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                ) : null
              )}
            </div>
          </nav>
        </div>
      </div>
    );
  };

  return (
    <header className="relative z-50">
      {/* Notification Bar */}

      {/* <div className="bg-primary">
{isSettingsLoading ? (
<div className="loader"></div>
) : (
<>
<div className=" text-white py-[7px] text-center">
<div className="container mx-auto sm:flex md:items-center items-start justify-center hidden">
<CountdownTimer />
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
</>
)}
</div> */}

      {/* Main Navigation */}
      <div className="bg-white xl:border-b border-primary/10">
        <div className="flex items-center md:h-[75px] h-16 mx-auto px-4 sm:flex-nowrap flex-wrap w-full">
          {/* Mobile menu button */}
          <button
            className="lg:hidden text-gray-700 sm:mr-3 mr-2"
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
            {isSettingsLoading ? (
              <Skeleton className="rounded-md main-logo-skeleton h-[40px] w-[265px]" />
            ) : (
              headerSettingData?.logo && (
                <Link href="/" className="flex items-center">
                  <Image
                    src={
                      containsTargetURL(headerSettingData?.logo?.url)
                        ? headerSettingData?.logo?.url
                        : `${headerSettingData?.logo?.url}`
                    }
                    width={265}
                    height={40}
                    priority
                    alt={
                      headerSettingData?.logo?.name || "WebbyTemplate Logo"
                    }
                    className="main-logo"
                  />
                </Link>
              )
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="links-content flex items-center justify-between relative">
            <div className="navigation-links">
              {isSettingsLoading
                ? // Skeletons based on actual menu length - fixed dimensions to prevent CLS
                [...Array(6)].map((_, index) => (
                  <Skeleton
                    key={index}
                    className="h-5 2xl:w-[115px] xl:w-[100px] w-[85px] rounded-md navigation-skeleton"
                    style={{ minWidth: '85px', minHeight: '20px' }}
                  />
                ))
                : !isSettingsLoading && headerSettingData?.menu?.length > 0
                  ? // Render actual links
                  headerSettingData.menu.map((menu, index) => {
                    const isActive = menu?.active;
                    const isCurrentPage = menu?.slug === pathname;

                    return (
                      <Link
                        key={index}
                        href={menu?.slug}
                        className={`links
${isActive ? "!text-primary" : "!text-black hover:!text-primary"}
${isCurrentPage ? "!text-primary" : ""}
`}
                      >
                        {menu?.label}
                      </Link>
                    );
                  })
                  : [...Array(6)].map((_, index) => (
                    <Skeleton
                      key={index}
                      className="h-5 w-[110px] rounded-md 1xl:block !hidden"
                    />
                  ))}
            </div>

            {/* Search Icon */}
            {isSettingsLoading ? (
              // Skeleton for search icon button (only on lg and up)
              <Skeleton className="rounded-full w-[23px] h-[23px] animate-pulse 1xl:flex-shrink-0 mr-0 search-svg" />
            ) : (
              headerSettingData?.search && (
                <>
                  <button
                    className="text-gray-700 hover:text-primary mr-2 lg:block hidden flex-shrink-0 sm:w-6 sm:h-6 w-4 h-4 "
                    onClick={toggleSearch}
                  >
                    <svg
                      className="search flex-shrink-0 sm:w-6 sm:h-6 w-4 h-4"
                      width="24"
                      height="24"
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
                  <form
                    onSubmit={handleSubmit}
                    className={`h-[74px] absolute z-50 bg-white overflow-hidden transition-all duration-400 ease-in-out flex items-center justify-between !m-0 ${isSearchOpen
                      ? "w-full opacity-100 z-100 p-2 ps-[35px] right-0"
                      : "w-0 opacity-0 z-0 p-0 right-0"
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
                        ref={inputRef}
                        type="text"
                        placeholder='Search for "Web Templates" and More.....'
                        className="w-full outline-none text-[#505050] placeholder:text-[#505050] text-base"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={toggleSearch}
                      className="ml-2 text-gray-500"
                    >
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
                  </form>
                </>
              )
            )}
          </nav>

          {/* Right Side Actions */}
          {/* <div className="button-content lg:space-x-1 sm:space-x-2 space-x-1 nav-icons flex-1 w-[50%] 1xl:justify-start justify-end"> */}
          <div className="button-content nav-icons flex-1 w-[50%] 1xl:justify-start justify-end">
            {isSettingsLoading ? (
              <Skeleton className="rounded-md schedule-skeleton 1xl:ml-3 schedule-meetings " />
            ) : (
              headerSettingData?.right_menu && (
                <>
                  <Link
                    href={headerSettingData?.right_menu?.slug}
                    className="meeting hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 20 20"
                      fill="none"
                      className="sm:w-[22px] sm:h-[22px] w-[18px] h-[18px] icon"
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

                  {/* <svg
xmlns="http://www.w3.org/2000/svg"
width="22"
height="22"
viewBox="0 0 22 22"
fill="none"
>
<path
d="M5.64365 11.0056V7.48067C5.65412 6.78779 5.8012 6.10379 6.07648 5.46785C6.35175 4.83192 6.7498 4.25655 7.24782 3.77471C7.74584 3.29288 8.33405 2.91404 8.97873 2.65993C9.62341 2.40581 10.3119 2.28139 11.0047 2.29382C11.6976 2.28139 12.3861 2.40581 13.0308 2.65993C13.6754 2.91404 14.2636 3.29288 14.7617 3.77471C15.2597 4.25655 15.6577 4.83192 15.933 5.46785C16.2083 6.10379 16.3554 6.78779 16.3658 7.48067V11.0056M13.6853 18.042C14.3962 18.042 15.078 17.7596 15.5807 17.2569C16.0834 16.7542 16.3658 16.0724 16.3658 15.3615V12.3459M13.6853 18.042C13.6853 18.4864 13.5088 18.9125 13.1946 19.2267C12.8804 19.5409 12.4543 19.7174 12.0099 19.7174H9.99954C9.55521 19.7174 9.12908 19.5409 8.81489 19.2267C8.50071 18.9125 8.3242 18.4864 8.3242 18.042C8.3242 17.5977 8.50071 17.1716 8.81489 16.8574C9.12908 16.5432 9.55521 16.3667 9.99954 16.3667H12.0099C12.4543 16.3667 12.8804 16.5432 13.1946 16.8574C13.5088 17.1716 13.6853 17.5977 13.6853 18.042ZM3.63324 8.99518H4.97352C5.15125 8.99518 5.3217 9.06578 5.44737 9.19146C5.57305 9.31713 5.64365 9.48759 5.64365 9.66532V13.6861C5.64365 13.8639 5.57305 14.0343 5.44737 14.16C5.3217 14.2857 5.15125 14.3563 4.97352 14.3563H3.63324C3.27778 14.3563 2.93688 14.2151 2.68553 13.9637C2.43418 13.7124 2.29297 13.3715 2.29297 13.016V10.3355C2.29297 9.97999 2.43418 9.63909 2.68553 9.38774C2.93688 9.13639 3.27778 8.99518 3.63324 8.99518ZM18.3762 14.3563H17.036C16.8582 14.3563 16.6878 14.2857 16.5621 14.16C16.4364 14.0343 16.3658 13.8639 16.3658 13.6861V9.66532C16.3658 9.48759 16.4364 9.31713 16.5621 9.19146C16.6878 9.06578 16.8582 8.99518 17.036 8.99518H18.3762C18.7317 8.99518 19.0726 9.13639 19.324 9.38774C19.5753 9.63909 19.7165 9.97999 19.7165 10.3355V13.016C19.7165 13.3715 19.5753 13.7124 19.324 13.9637C19.0726 14.2151 18.7317 14.3563 18.3762 14.3563Z"
stroke="currentColor"
strokeWidth="1.37561"
strokeLinecap="round"
strokeLinejoin="round"
/>
</svg> */}
                  <Link
                    href={headerSettingData?.right_menu?.slug}
                    className="schedule block"
                    target="_blank"
                  >
                    {headerSettingData?.right_menu?.label}
                  </Link>
                </>
              )
            )}

            {!authLoading &&
              (isAuthenticated ? (
                <div className="login">
                  {isSettingsLoading ? (
                    <Skeleton className="login-skeleton" />
                  ) : (
                    <div className="flex items-center justify-center 1xl:gap-[15px] sm:gap-2">
                      <div
                        className="relative flex text-left"
                        ref={dropdownRef}
                      >
                        <button
                          onClick={toggleDropdown}
                          className="inline-flex items-center 1xl:gap-2 btn btn-primary focus:outline-none mr-2 after-login-btn"
                        >
                          {/* User Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="1xl:w-5 1xl:h-5 w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>

                          <span className="1xl:block hidden truncate 2xl:w-[80px] w-[75px]">
                            Hello, {authUser?.username || "Name"}
                          </span>

                          {/* Arrow Icon */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="1xl:w-5 1xl:h-5 w-4 h-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                            />
                          </svg>
                        </button>

                        {/* Non-button clickable icon */}
                        <div className="after-login-svg hidden">
                          {isSettingsLoading ? (
                            <Skeleton className="sm:w-6 sm:h-6 w-4 h-4 rounded-full after-login-svg-skeleton" />
                          ) : (
                            <span
                              onClick={toggleDropdown}
                              role="button"
                              tabIndex={0}
                              className="cursor-pointer"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                className="sm:w-6 sm:h-6 w-5 h-5"
                              >
                                <path
                                  d="M16.3442 17.7023C16.3442 14.7013 12.9983 12.2618 9.99732 12.2618C6.99631 12.2618 3.65039 14.7013 3.65039 17.7023M9.99732 9.54245C10.9592 9.54245 11.8816 9.16036 12.5618 8.48022C13.2419 7.80008 13.624 6.87762 13.624 5.91576C13.624 4.9539 13.2419 4.03143 12.5618 3.3513C11.8816 2.67116 10.9592 2.28906 9.99732 2.28906C9.03546 2.28906 8.11299 2.67116 7.43286 3.3513C6.75272 4.03143 6.37062 4.9539 6.37062 5.91576C6.37062 6.87762 6.75272 7.80008 7.43286 8.48022C8.11299 9.16036 9.03546 9.54245 9.99732 9.54245Z"
                                  stroke="black"
                                  strokeWidth="1.25028"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </div>

                        {/* Dropdown menu */}
                        {open && (
                          <div
                            className="absolute login-dropdown-menu bg-white border border-primary/10 before:border-primary/10 before:border shadow-dropDown before:z-0 rounded-md z-10
before:content-[''] before:absolute before:top-[-8px] before:right-[10%]
before:w-[13px] before:h-4 before:bg-white before:rotate-45
before:shadow-md before:rounded-sm"
                          >
                            <div className="z-20 relative xl:w-[12.5rem] md:w-[11rem] w-[10rem] origin-top-right rounded-md bg-white overflow-hidden">
                              <ul className="divide-y divide-primary/10">
                                <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                                  <Link href={`/user/${authUser?.username}`}>
                                    <p className="block text-gray-800 group-hover:text-primary p2">
                                      My Account
                                    </p>
                                  </Link>
                                </li>
                                <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                                  <Link href="/wishlist">
                                    <p className="block text-gray-800 group-hover:text-primary p2">
                                      Wishlist
                                    </p>
                                  </Link>
                                </li>
                                <li className="hover:bg-blue-300 group md:py-[10px] md:px-5 py-2 px-3">
                                  <Link
                                    href={`/user/${authUser?.username}/download`}
                                  >
                                    <p className="block text-gray-800 group-hover:text-primary p2">
                                      Downloads
                                    </p>
                                  </Link>
                                </li>
                                <li className="sm:px-5 sm:py-[10px] p-2">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      logout();
                                    }}
                                    className="flex items-center justify-between w-full border border-primary/15 rounded-[4px] bg-blue-300 xl:py-2 xl:px-4 py-1 px-2 hover:bg-primary group"
                                  >
                                    <p className="block !text-primary group-hover:!text-white p2 ">
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
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => openAuth("login")} className="login">
                  {isSettingsLoading ? (
                    <Skeleton className="login-skeleton" />
                  ) : (
                    <>
                      <span className="btn btn-primary 1xl:block hidden login-btn">
                        Login / Sign up
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={20}
                        height={20}
                        viewBox="0 0 20 20"
                        fill="none"
                        className="sm:w-[22px] sm:h-[22px] w-[18px] h-[18px] hidden login-svg"
                      >
                        <path
                          d="M16.3442 17.7023C16.3442 14.7013 12.9983 12.2618 9.99732 12.2618C6.99631 12.2618 3.65039 14.7013 3.65039 17.7023M9.99732 9.54245C10.9592 9.54245 11.8816 9.16036 12.5618 8.48022C13.2419 7.80008 13.624 6.87762 13.624 5.91576C13.624 4.9539 13.2419 4.03143 12.5618 3.3513C11.8816 2.67116 10.9592 2.28906 9.99732 2.28906C9.03546 2.28906 8.11299 2.67116 7.43286 3.3513C6.75272 4.03143 6.37062 4.9539 6.37062 5.91576C6.37062 6.87762 6.75272 7.80008 7.43286 8.48022C8.11299 9.16036 9.03546 9.54245 9.99732 9.54245Z"
                          stroke="black"
                          strokeWidth="1.25028"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </>
                  )}
                </button>
              ))}

            <div className="right-last-icon">
              {isSettingsLoading ? (
                <Skeleton className="rounded-full sm:w-6 sm:h-6 w-4 h-4 mr-2 wishlist-svg " />
              ) : (
                <Link className="heart relative" href="/wishlist">
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

                  {/* 🔹 Wishlist count badge */}
                  <span className="badge absolute -top-1 -right-1 text-xs bg-red-500 text-white rounded-full px-1.5">
                    {wishlistItems?.length || 0}
                  </span>
                </Link>
              )}

              {isSettingsLoading ? (
                <Skeleton className="rounded-full sm:w-6 sm:h-6 w-4 h-4" />
              ) : (
                <button className="cart" onClick={toggleCart}>
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
                  <span className="badge">{cartItems?.length || 0}</span>
                </button>
              )}
            </div>
          </div>

          {/* Include the modals and cart components */}
          <AuthModal />
          <SideCart />
        </div>
      </div>

      {/* Menu */}

      <Menu loading={isMenuLoading} />

      {/* Mega Menu */}
      {!isMenuOpen && activeCategory && (
        <div className="absolute w-full bg-white shadow-lg border-t z-50">
          <MegaMenu category={activeCategory} menuData={apiMenu} />
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="1xl:hidden block bg-white shadow-lg border-blue-300">
          <div className="px-4 pt-2 pb-3 space-y-1 grid">
            {headerSettingData?.menu &&
              headerSettingData.menu.map((menu, index) => {
                const isCurrentPage = menu?.slug === pathname;

                return (
                  <Link
                    key={index}
                    href={menu?.slug}
                    className={`block px-2 py-1.5 font-medium text-sm
${menu?.active ? "text-primary hover:text-blue-800" : "!text-black"}
${isCurrentPage ? "underline" : ""}
`}
                  >
                    {menu?.label}
                  </Link>
                );
              })}

            <Link
              href={headerSettingData?.right_menu?.slug}
              className="links !text-black"
            >
              {headerSettingData?.right_menu?.label}
            </Link>

            <span
              onClick={() => openAuth("login")}
              className="links !text-black cursor-pointer"
            >
              Login / Sign up
            </span>
          </div>
        </div>
      )}
    </header>
  );
}