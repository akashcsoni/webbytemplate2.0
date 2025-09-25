"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@heroui/button";
import DynamicIcon from "../ui/DynamicIcon";
import { usePathname } from "next/navigation";

// Social media icons as SVG (fallback if images are not available)
const socialIcons = {
  facebook: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      class="fill-primary group-hover:fill-white"
    >
      <path d="M7.25884 19.2969H11.1733V11.4582H14.7003L15.0878 7.56326H11.1733V5.59623C11.1733 5.33669 11.2764 5.08777 11.46 4.90424C11.6435 4.72072 11.8924 4.61761 12.1519 4.61761H15.0878V0.703125H12.1519C10.8542 0.703125 9.60963 1.21865 8.692 2.13628C7.77436 3.05392 7.25884 4.2985 7.25884 5.59623V7.56326H5.3016L4.91406 11.4582H7.25884V19.2969Z" />
    </svg>
  ),
  twitter: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="20"
      viewBox="0 0 21 20"
      class="fill-primary group-hover:fill-white"
    >
      <path d="M19.8741 4.77712C19.2061 5.08077 18.486 5.28031 17.7399 5.37574C18.5033 4.91593 19.0933 4.18718 19.3709 3.31094C18.6508 3.74472 17.8527 4.04837 17.0111 4.22188C16.3257 3.47578 15.3627 3.04199 14.2696 3.04199C12.2308 3.04199 10.5651 4.70772 10.5651 6.76385C10.5651 7.05882 10.5998 7.34512 10.6605 7.61406C7.572 7.4579 4.82182 5.97436 2.99126 3.72737C2.67026 4.27394 2.48807 4.91593 2.48807 5.59264C2.48807 6.88531 3.13874 8.0305 4.14512 8.68117C3.52915 8.68117 2.95655 8.50766 2.45336 8.24739V8.27341C2.45336 10.078 3.73736 11.5875 5.43779 11.9259C4.89195 12.0759 4.31866 12.0967 3.76339 11.9866C3.99903 12.7262 4.46051 13.3733 5.08297 13.8371C5.70543 14.3008 6.45757 14.5578 7.23365 14.5719C5.91814 15.6135 4.28741 16.1764 2.60953 16.1683C2.31455 16.1683 2.01958 16.1509 1.72461 16.1162C3.37298 17.1746 5.33368 17.7906 7.43319 17.7906C14.2696 17.7906 18.0262 12.1167 18.0262 7.19763C18.0262 7.0328 18.0262 6.87663 18.0175 6.7118C18.7463 6.19126 19.3709 5.53191 19.8741 4.77712Z" />
    </svg>
  ),
  pinterest: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      class="fill-primary group-hover:fill-white"
    >
      <path d="M8.65691 13.2279C8.14584 15.9812 7.52367 18.6213 5.67736 20C5.10873 15.8387 6.51467 12.7127 7.16714 9.39485C6.0541 7.46572 7.30147 3.58222 9.64874 4.5387C12.5374 5.71638 7.14694 11.7118 10.7658 12.4613C14.5443 13.243 16.0876 5.71133 13.7443 3.26103C10.3588 -0.275028 3.88964 3.18124 4.68553 8.24444C4.87945 9.48272 6.12076 9.85845 5.18145 11.5674C3.01497 11.0715 2.36856 9.31203 2.45239 6.96576C2.58571 3.12771 5.80261 0.439052 9.02859 0.0673668C13.109 -0.4033 16.938 1.60966 17.4663 5.56184C18.0622 10.0221 15.625 14.854 11.2627 14.5055C10.08 14.4116 9.58309 13.8086 8.65691 13.2279Z" />
    </svg>
  ),
  youtube: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      class="fill-primary group-hover:fill-white"
    >
      <g clipPath="url(#clip0_803_5041)">
        <path d="M8.05099 13.0823L13.2741 10.0632L8.05099 7.04405V13.0823ZM19.6847 5.20238C19.8155 5.67538 19.9061 6.3094 19.9664 7.11449C20.0369 7.91959 20.0671 8.61399 20.0671 9.21781L20.1275 10.0632C20.1275 12.2671 19.9664 13.8874 19.6847 14.924C19.4331 15.8297 18.8494 16.4134 17.9436 16.665C17.4706 16.7958 16.6052 16.8864 15.2767 16.9468C13.9685 17.0172 12.7709 17.0474 11.6639 17.0474L10.0637 17.1078C5.84703 17.1078 3.22039 16.9468 2.18383 16.665C1.27809 16.4134 0.694398 15.8297 0.442804 14.924C0.311976 14.451 0.221402 13.8169 0.16102 13.0118C0.0905737 12.2067 0.0603823 11.5123 0.0603823 10.9085L0 10.0632C0 7.85921 0.16102 6.23895 0.442804 5.20238C0.694398 4.29665 1.27809 3.71295 2.18383 3.46136C2.65683 3.33053 3.52231 3.23996 4.85072 3.17957C6.159 3.10913 7.35659 3.07894 8.4636 3.07894L10.0637 3.01855C14.2804 3.01855 16.9071 3.17957 17.9436 3.46136C18.8494 3.71295 19.4331 4.29665 19.6847 5.20238Z" />
      </g>
    </svg>
  ),
  instagram: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      class="fill-primary group-hover:fill-white"
    >
      <path d="M6.5013 1.66602H13.5013C16.168 1.66602 18.3346 3.83268 18.3346 6.49935V13.4993C18.3346 14.7812 17.8254 16.0106 16.919 16.917C16.0126 17.8235 14.7832 18.3327 13.5013 18.3327H6.5013C3.83464 18.3327 1.66797 16.166 1.66797 13.4993V6.49935C1.66797 5.21747 2.17719 3.98809 3.08362 3.08167C3.99004 2.17524 5.21942 1.66602 6.5013 1.66602ZM6.33463 3.33268C5.53899 3.33268 4.77592 3.64875 4.21331 4.21136C3.65071 4.77397 3.33464 5.53703 3.33464 6.33268V13.666C3.33464 15.3243 4.6763 16.666 6.33463 16.666H13.668C14.4636 16.666 15.2267 16.3499 15.7893 15.7873C16.3519 15.2247 16.668 14.4617 16.668 13.666V6.33268C16.668 4.67435 15.3263 3.33268 13.668 3.33268H6.33463ZM14.3763 4.58268C14.6526 4.58268 14.9175 4.69243 15.1129 4.88778C15.3082 5.08313 15.418 5.34808 15.418 5.62435C15.418 5.90062 15.3082 6.16557 15.1129 6.36092C14.9175 6.55627 14.6526 6.66601 14.3763 6.66601C14.1 6.66601 13.8351 6.55627 13.6397 6.36092C13.4444 6.16557 13.3346 5.90062 13.3346 5.62435C13.3346 5.34808 13.4444 5.08313 13.6397 4.88778C13.8351 4.69243 14.1 4.58268 14.3763 4.58268ZM10.0013 5.83268C11.1064 5.83268 12.1662 6.27167 12.9476 7.05307C13.729 7.83447 14.168 8.89428 14.168 9.99935C14.168 11.1044 13.729 12.1642 12.9476 12.9456C12.1662 13.727 11.1064 14.166 10.0013 14.166C8.89623 14.166 7.83642 13.727 7.05502 12.9456C6.27362 12.1642 5.83463 11.1044 5.83463 9.99935C5.83463 8.89428 6.27362 7.83447 7.05502 7.05307C7.83642 6.27167 8.89623 5.83268 10.0013 5.83268ZM10.0013 7.49935C9.33826 7.49935 8.70237 7.76274 8.23353 8.23158C7.76469 8.70042 7.5013 9.33631 7.5013 9.99935C7.5013 10.6624 7.76469 11.2983 8.23353 11.7671C8.70237 12.236 9.33826 12.4993 10.0013 12.4993C10.6643 12.4993 11.3002 12.236 11.7691 11.7671C12.2379 11.2983 12.5013 10.6624 12.5013 9.99935C12.5013 9.33631 12.2379 8.70042 11.7691 8.23158C11.3002 7.76274 10.6643 7.49935 10.0013 7.49935Z" />
    </svg>
  ),
  linkedin: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      class="fill-primary group-hover:fill-white"
    >
      <path d="M5.56768 3.75739C5.56745 4.23049 5.37928 4.68413 5.04458 5.01849C4.70987 5.35286 4.25605 5.54057 3.78295 5.54034C3.30984 5.5401 2.85621 5.35193 2.52184 5.01723C2.18748 4.68253 1.99976 4.22871 2 3.75561C2.00024 3.2825 2.1884 2.82887 2.52311 2.4945C2.85781 2.16013 3.31163 1.97242 3.78473 1.97266C4.25784 1.97289 4.71147 2.16106 5.04584 2.49576C5.3802 2.83046 5.56792 3.28428 5.56768 3.75739ZM5.6212 6.86127H2.05352V18.0281H5.6212V6.86127ZM11.2581 6.86127H7.70829V18.0281H11.2225V12.1682C11.2225 8.90377 15.4769 8.60052 15.4769 12.1682V18.0281H19V10.9552C19 5.45204 12.703 5.65718 11.2225 8.3597L11.2581 6.86127Z" />
    </svg>
  ),
  clock: (
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
    >
      <path d="M12 2v10l4.24 4.24" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
};

// Map social media names to icon keys
const socialIconMap = {
  facebook: "facebook",
  twitter: "twitter",
  x: "twitter",
  pinterest: "pinterest",
  youtube: "youtube",
  instagram: "instagram",
  linkedin: "linkedin",
};

export function Footer({ footerMenu = [], footerSettings = {} }) {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  // Organize menu items by their position
  const organizedMenu = useMemo(() => {
    // Ensure footerMenu is an array
    if (!Array.isArray(footerMenu)) {
      return [];
    }

    // Sort menu items by their id to ensure consistent order
    return [...footerMenu].sort((a, b) => (a?.id || 0) - (b?.id || 0));
  }, [footerMenu]);

  // Find specific menu categories - with null checks
  const findMenuCategory = (label) => {
    return organizedMenu.find((item) => item?.label === label) || null;
  };

  const productsAndPartners = findMenuCategory("Products and Partners");
  const topics = findMenuCategory("Topics");
  const company = findMenuCategory("Company");
  const earn = findMenuCategory("Earn");
  const support = findMenuCategory("Support");

  // Organize social media links
  const socialLinks = useMemo(() => {
    if (
      !footerSettings?.social_media ||
      !Array.isArray(footerSettings.social_media)
    ) {
      return [];
    }

    return footerSettings.social_media
      .filter((social) => social && typeof social === "object") // Filter out invalid items
      .sort((a, b) => {
        const posA = Number.parseInt(a?.position) || 0;
        const posB = Number.parseInt(b?.position) || 0;
        return posA - posB;
      })
      .map((social) => {
        const label =
          social?.label ||
          Object.keys(socialIconMap).find((key) =>
            (social?.link || "").toLowerCase().includes(key)
          ) ||
          "Social Media";

        return {
          icon: social?.image || null,
          href: social?.link || "#",
          label: label,
        };
      });
  }, [footerSettings]);

  // Get the copyright text with fallback
  const copyrightText =
    footerSettings?.copyright_label ||
    `© ${currentYear} WebbyTemplate.com owned by WebbyCrown Solutions. All rights reserved.`;

  // Get the logo with fallback
  const logo = footerSettings?.logo || {
    url: "/placeholder.svg?height=40&width=240",
    width: 240,
    height: 40,
  };

  // Get the buttons with fallback
  const buttons = Array.isArray(footerSettings?.button)
    ? footerSettings.button
    : [
        { id: 1, label: "Contact Us", link: "/contact-us", image: null },
        {
          id: 2,
          label: "Schedule Meeting",
          link: "/schedule-meeting",
          image: null,
        },
      ];

  // Render a menu column if data exists
  const renderMenuColumn = (menuItem, fallbackLabel) => {
    // If no menu item or sub_menu, don't render anything
    if (
      !menuItem ||
      !Array.isArray(menuItem?.sub_menu) ||
      menuItem.sub_menu.length === 0
    ) {
      return null;
    }

    return (
      <div className="md:max-w-full sm:max-w-[200px] w-full">
        <h5 className="font-bold xl:mb-4 mb-2">{menuItem.label}</h5>
        <ul className="lg:space-y-2 space-y-1">
          {menuItem.sub_menu.map((subItem, index) => {
            const isActive = isActiveLink(subItem?.slug);
            return (
              <li key={subItem?.id || index}>
                <Link
                  href={subItem?.slug || "#"}
                  className={`!text-gray-400 p2 hover:!text-white focus:!text-white active:!text-white${
                    isActive ? " active !text-white font-medium" : ""
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {subItem?.label || `Menu Item ${index + 1}`}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  // If no menu items at all, don't render the menu section
  const hasMenuItems = organizedMenu.length > 0;

  // Update isActiveLink to support sub-paths
  const isActiveLink = (slug) => {
    if (!slug) return false;
    const cleanPathname = pathname?.replace(/\/$/, "");
    const cleanSlug = slug.replace(/\/$/, "");
    return (
      cleanPathname === cleanSlug || cleanPathname.startsWith(cleanSlug + "/")
    );
  };

  return (
    <footer className="bg-gray-600 text-white">
      {/* Top section with logo and buttons */}
      <div className="border-b border-gray-500">
        <div className="container mx-auto sm:py-9 py-7 flex flex-col sm:flex-row justify-between items-center">
          <div className="mb-4 sm:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logo.url}
                alt="WebbyTemplate Logo"
                width={logo.width}
                height={logo.height}
                className="2xl:h-[60px] lg:h-[55px] md:h-[50px] sm:h-10 h-[35px] w-auto"
              />
            </Link>
          </div>
          <div className="flex sm:gap-5 gap-3 sm:flex-row flex-col">
            {buttons.map((btn) => (
              <Button
                key={btn?.id || Math.random()}
                variant={btn?.id === 1 ? "outline" : "default"}
                className={
                  btn?.id === 1
                    ? "btn btn-secondary !bg-white hover:!bg-primary active:!bg-primary focus:!bg-primary"
                    : "btn btn-primary flex items-center"
                }
                asChild
              >
                <Link
                  href={btn?.link || "#"}
                  className="flex items-center gap-[10px] justify-center"
                >
                  {btn?.image ? (
                    <svg
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
                    </svg>
                  ) : btn?.id === 2 ? (
                    socialIcons.clock
                  ) : null}
                  <span>{btn?.label || "Button"}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer links - only render if we have menu items */}
      {hasMenuItems && (
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {/* First three columns */}
            <div className="2xl:pe-20 xl:pe-10 lg:pe-8 sm:pe-4 xl:py-9 sm:py-5 py-3 sm:border-r border-gray-500 md:block grid sm:justify-items-start">
              {renderMenuColumn(productsAndPartners, "Products and Partners")}
            </div>
            <div className="2xl:px-20 xl:px-10 lg:px-8 sm:px-4 xl:py-9 sm:py-5 py-3 md:border-r border-gray-500 md:block grid md:justify-items-center sm:justify-items-end">
              {renderMenuColumn(topics, "Topics")}
            </div>
            <div className="2xl:px-20 xl:px-10 lg:px-8 md:px-4 pr-4 xl:py-9 sm:py-5 py-3 sm:border-r border-gray-500 md:block grid md:justify-items-center sm:justify-items-start">
              {renderMenuColumn(company, "Company")}
            </div>

            {/* Fourth column with Earn and Support stacked */}
            <div className="sm:space-y-8 space-y-4 2xl:ps-20 xl:ps-10 lg:ps-8 md:ps-4 sm:px-4 xl:py-9 sm:py-5 py-3 md:block grid md:justify-items-center sm:justify-items-end">
              {renderMenuColumn(earn, "Earn")}
              {renderMenuColumn(support, "Support")}
            </div>
          </div>
        </div>
      )}

      {/* Bottom section with copyright and social links */}
      <div className="border-t border-gray-500 bg-gray-500">
        <div className="container mx-auto xl:py-7 py-5 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-white sm:mb-4 mb-3 lg:mb-0 lg:text-start text-center 2xl:text-lg 1xl:text-[17px] sm:text-base text-[15px]">
            {/* {console.log(copyrightText, "this id for copyrightText")} */}
            <span dangerouslySetInnerHTML={{ __html: copyrightText }} />
            {/* {copyrightText} */}
          </p>
          {socialLinks.length > 0 && (
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <Link
                  target="_blank"
                  key={index}
                  href={social?.href || "/"}
                  aria-label={social?.label || "Social Media Link"}
                  className="btn btn-secondary !p-2 group"
                >
                  <DynamicIcon icon={social?.icon} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
