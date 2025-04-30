"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo } from "react";
import { Button } from "@heroui/button";

// Social media icons as SVG (fallback if images are not available)
const socialIcons = {
  facebook: (
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
    </svg>
  ),
  twitter: (
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
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
    </svg>
  ),
  pinterest: (
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
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M8 9h8" />
    </svg>
  ),
  youtube: (
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
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
    </svg>
  ),
  instagram: (
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
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
    </svg>
  ),
  linkedin: (
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
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
      <rect x="2" y="9" width="4" height="12"></rect>
      <circle cx="4" cy="4" r="2"></circle>
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

// Fallback menu items in case specific categories are missing
const fallbackMenuItems = {
  "Products and Partners": [
    { id: 1, label: "WordPress Themes", slug: "/wordpress-themes", tag: null },
    {
      id: 2,
      label: "WooCommerce Themes",
      slug: "/woocommerce-themes",
      tag: null,
    },
  ],
  Topics: [
    {
      id: 1,
      label: "Business & Services",
      slug: "/business-services",
      tag: null,
    },
    { id: 2, label: "Fashion & Beauty", slug: "/fashion-beauty", tag: null },
  ],
  Company: [
    { id: 1, label: "About Us", slug: "/about-us", tag: null },
    { id: 2, label: "Licenses", slug: "/licenses", tag: null },
  ],
  Earn: [
    { id: 1, label: "Become an author", slug: "/become-author", tag: null },
  ],
  Support: [{ id: 1, label: "Help Center", slug: "/help-center", tag: null }],
};

// Map social media names to icon keys
const socialIconMap = {
  facebook: "facebook",
  twitter: "twitter",
  x: "twitter", // For the new Twitter/X branding
  pinterest: "pinterest",
  youtube: "youtube",
  instagram: "instagram",
  linkedin: "linkedin",
};

export function Footer({ footerMenu, footerSettings }) {
  const currentYear = new Date().getFullYear();

  // Organize menu items by their position
  const organizedMenu = useMemo(() => {
    // Make sure footerMenu is an array before proceeding
    if (!Array.isArray(footerMenu) || footerMenu.length === 0) {
      // If no data, create default structure
      return [
        {
          id: 1,
          label: "Products and Partners",
          positioin: null,
          sub_menu: fallbackMenuItems["Products and Partners"],
        },
        {
          id: 2,
          label: "Topics",
          positioin: null,
          sub_menu: fallbackMenuItems["Topics"],
        },
        {
          id: 3,
          label: "Company",
          positioin: null,
          sub_menu: fallbackMenuItems["Company"],
        },
        {
          id: 4,
          label: "Earn",
          positioin: null,
          sub_menu: fallbackMenuItems["Earn"],
        },
        {
          id: 5,
          label: "Support",
          positioin: null,
          sub_menu: fallbackMenuItems["Support"],
        },
      ];
    }

    // Sort menu items by their id to ensure consistent order
    return [...footerMenu].sort((a, b) => a.id - b.id);
  }, [footerMenu]);

  // Find specific menu categories
  const productsAndPartners = organizedMenu.find(
    (item) => item.label === "Products and Partners",
  );
  const topics = organizedMenu.find((item) => item.label === "Topics");
  const company = organizedMenu.find((item) => item.label === "Company");
  const earn = organizedMenu.find((item) => item.label === "Earn");
  const support = organizedMenu.find((item) => item.label === "Support");

  // Organize social media links
  const socialLinks = useMemo(() => {
    if (
      !footerSettings?.social_media ||
      !Array.isArray(footerSettings.social_media)
    ) {
      return [];
    }

    return footerSettings.social_media
      .sort((a, b) => {
        // Sort by position if available
        const posA = Number.parseInt(a.position) || 0;
        const posB = Number.parseInt(b.position) || 0;
        return posA - posB;
      })
      .map((social) => {
        // Determine the label for accessibility
        const label =
          social.label ||
          Object.keys(socialIconMap).find((key) =>
            social.link.toLowerCase().includes(key),
          ) ||
          "Social Media";

        return {
          icon: social.image,
          href: social.link || "#",
          label: label,
        };
      });
  }, [footerSettings]);

  // Get the copyright text
  const copyrightText =
    footerSettings?.copyright_label ||
    `© ${currentYear} WebbyTemplate.com owned by WebbyCrown Solutions. All rights reserved.`;

  // Get the logo
  const logo = footerSettings?.logo || {
    url: "/placeholder.svg?height=40&width=240",
    width: 240,
    height: 40,
  };

  // Get the buttons
  const buttons = footerSettings?.button || [
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
    // If menu item doesn't exist or has no sub_menu, use fallback
    const label = menuItem?.label || fallbackLabel;
    const subMenu =
      Array.isArray(menuItem?.sub_menu) && menuItem.sub_menu.length > 0
        ? menuItem.sub_menu
        : fallbackMenuItems[fallbackLabel];

    return (
      <div>
        <h5 className="font-bold xl:mb-4 mb-2">{label}</h5>
        <ul className="lg:space-y-2 space-y-1">
          {subMenu.map((subItem, index) => (
            <li key={subItem.id || index}>
              <Link href={subItem.slug || "#"} className="!text-gray-400 p2">
                {subItem.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <footer className="bg-gray-600 text-white">
      {/* Top section with logo and buttons */}
      <div className="border-b border-gray-500">
        <div className="container mx-auto sm:py-9 py-7 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="flex items-center">
              <Image
                src={logo.url || "/placeholder.svg"}
                alt="WebbyTemplate Logo"
                width={logo.width || 240}
                height={logo.height || 40}
                className="sm:h-10 h-8 w-auto"
              />
            </Link>
          </div>
          <div className="flex sm:gap-5 gap-3 sm:flex-row flex-col">
            {buttons.map((btn) => (
              <Button
                key={btn.id}
                variant={btn.id === 1 ? "outline" : "default"}
                className={
                  btn.id === 1
                    ? "btn btn-secondary !bg-white hover:!bg-primary active:!bg-primary focus:!bg-primary"
                    : "btn btn-primary flex items-center"
                }
                asChild
              >
                <Link
                  href={btn.link || "#"}
                  className="flex items-center gap-[10px] justify-center"
                >
                  {btn.image ? (
                    <Image
                      src={btn.image || "/placeholder.svg"}
                      alt=""
                      width={20}
                      height={20}
                    />
                  ) : btn.id === 2 ? (
                    socialIcons.clock
                  ) : null}
                  <span className={btn.image ? "" : ""}>{btn.label}</span>
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer links */}
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {/* First three columns */}
          <div className="2xl:pe-20 xl:pe-10 lg:pe-8 sm:pe-4 xl:py-9 sm:py-5 py-3 sm:border-r border-gray-500 md:block grid sm:justify-items-center">
            {renderMenuColumn(productsAndPartners, "Products and Partners")}
          </div>
          <div className="2xl:px-20 xl:px-10 lg:px-8 sm:px-4 xl:py-9 sm:py-5 py-3 md:border-r border-gray-500 md:block grid sm:justify-items-center">{renderMenuColumn(topics, "Topics")}</div>
          <div className="2xl:px-20 xl:px-10 lg:px-8 sm:px-4 xl:py-9 sm:py-5 py-3 sm:border-r border-gray-500 md:block grid sm:justify-items-center">
            {renderMenuColumn(company, "Company")}
          </div>

          {/* Fourth column with Earn and Support stacked */}
          <div className="sm:space-y-8 space-y-4 2xl:ps-20 xl:ps-10 lg:ps-8 sm:ps-4 xl:py-9 sm:py-5 py-3 md:block grid sm:justify-items-center">
            {renderMenuColumn(earn, "Earn")}
            {renderMenuColumn(support, "Support")}
          </div>
        </div>
      </div>

      {/* Bottom section with copyright and social links */}
      <div className="border-t border-gray-500 bg-gray-500">
        <div className="container mx-auto xl:py-7 py-5 flex flex-col lg:flex-row justify-between items-center">
          <p className="text-white sm:mb-4 mb-3 lg:mb-0 lg:text-start text-center 2xl:text-lg 1xl:text-[17px] sm:text-base text-[15px]">{copyrightText}</p>
          <div className="flex space-x-3">
            {socialLinks.map((social, index) => (
              <Link
                key={index}
                href={social.href}
                aria-label={social.label}
                className="btn btn-secondary !p-2"
              >
                {social.icon ? (
                  <Image
                    src={social.icon || "/placeholder.svg"}
                    alt=""
                    width={20}
                    height={20}
                    className="sm:w-5 sm:h-5 w-4 h-4"
                  />
                ) : (
                  socialIcons[
                    socialIconMap[social.label.toLowerCase()] || "facebook"
                  ]
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
