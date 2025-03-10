"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import CountdownTimer from "./countdown-timer"
import MegaMenu from "./mega-menu"

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
                    { id: 1, label: "Premium Themes", slug: "/premium-themes", tag: null },
                    { id: 2, label: "Free Themes", slug: "/free-themes", tag: null },
                    { id: 3, label: "Multipurpose Themes", slug: "/multipurpose-themes", tag: null },
                    { id: 4, label: "Blog Themes", slug: "/blog-themes", tag: null },
                    { id: 5, label: "Business Themes", slug: "/business-themes", tag: null },
                    { id: 6, label: "Portfolio Themes", slug: "/portfolio-themes", tag: "New" },
                    { id: 7, label: "Creative Themes", slug: "/creative-themes", tag: null },
                    { id: 8, label: "WooCommerce Themes", slug: "/woocommerce-themes", tag: null },
                    { id: 9, label: "Minimalist Themes", slug: "/minimalist-themes", tag: null },
                ]
            },
            {
                id: 2,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 10, label: "Landing Page Kits", slug: "/landing-page-kits", tag: null },
                    { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
                    { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
                    { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
                ]
            },
            {
                id: 3,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 1, label: "Premium Themes", slug: "/premium-themes", tag: null },
                    { id: 2, label: "Free Themes", slug: "/free-themes", tag: null },
                    { id: 3, label: "Multipurpose Themes", slug: "/multipurpose-themes", tag: null },
                    { id: 4, label: "Blog Themes", slug: "/blog-themes", tag: null },
                    { id: 5, label: "Business Themes", slug: "/business-themes", tag: null },
                    { id: 6, label: "Portfolio Themes", slug: "/portfolio-themes", tag: "New" },
                    { id: 7, label: "Creative Themes", slug: "/creative-themes", tag: null },
                    { id: 8, label: "WooCommerce Themes", slug: "/woocommerce-themes", tag: null },
                    { id: 9, label: "Minimalist Themes", slug: "/minimalist-themes", tag: null },
                ]
            },
            {
                id: 4,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 10, label: "Landing Page Kits", slug: "/landing-page-kits", tag: null },
                    { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
                    { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
                    { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
                ],
            },
            {
                id: 5,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 10, label: "Landing Page Kits", slug: "/landing-page-kits", tag: null },
                    { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
                    { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null }

                ],
            },
            {
                id: 6,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 10, label: "Landing Page Kits", slug: "/landing-page-kits", tag: null },
                    { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
                    { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
                    { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
                ],
            },
            {
                id: 7,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 10, label: "Landing Page Kits", slug: "/landing-page-kits", tag: null },
                    { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
                    { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
                    { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
                ],
            },
            {
                id: 8,
                label: "Elementor Kits",
                sub_menu: [
                    { id: 10, label: "Landing Page Kits", slug: "/landing-page-kits", tag: null },
                    { id: 11, label: "Business Kits", slug: "/business-kits", tag: null },
                    { id: 12, label: "Personal Kits", slug: "/personal-kits", tag: null },
                    { id: 13, label: "Creative Kits", slug: "/creative-kits", tag: null },
                ],
            }
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
                    { id: 17, label: "Security Plugins", slug: "/security-plugins", tag: null },
                    { id: 18, label: "Performance Optimization", slug: "/performance-optimization", tag: null },
                    { id: 19, label: "Contact Forms", slug: "/contact-forms", tag: null },
                    { id: 20, label: "Page Builders", slug: "/page-builders", tag: null },
                ],
            },
            {
                id: 5,
                label: "PrestaShop Modules",
                sub_menu: [
                    { id: 15, label: "Payment Gateways", slug: "/payment-gateways", tag: null },
                    { id: 16, label: "Shipping & Logistics", slug: "/shipping-and-logistics", tag: null },
                    { id: 21, label: "Marketing & Promotions", slug: "/marketing-and-promotions", tag: null },
                    { id: 22, label: "Customer Support", slug: "/customer-support", tag: null },
                    { id: 23, label: "Inventory Management", slug: "/inventory-management", tag: null },
                ],
            },
        ],
    }
];

const Menu = () => {
    const [activeCategory, setActiveCategory] = useState(null)

    // Handlers for mouse events
    const handleMouseEnter = (category) => {
        setActiveCategory(category)
    }

    const handleMouseLeave = () => {
        setActiveCategory(null)
    }

    return (
        <div className="bg-white border-b relative">
            <div className="mx-auto px-4">
                <nav>
                    {/* Main Menu */}
                    <div className="hidden md:flex">
                        {mainMenu.map(({ name, label }) => (
                            <div key={name} className="relative py-4 px-3" onMouseEnter={() => handleMouseEnter(name)}>
                                <div
                                    className={cn(
                                        "cursor-pointer flex items-center space-x-1",
                                        activeCategory === name && "text-blue-600",
                                    )}
                                >
                                    <span className="text-sm font-medium text-black">{label}</span>
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

                    {/* Container for all submenus */}
                    <div
                        className={cn("absolute left-0 right-0 bg-white shadow-lg z-10", activeCategory ? "block" : "hidden")}
                        onMouseEnter={() => activeCategory && setActiveCategory(activeCategory)}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Submenu Dropdowns */}
                        {mainMenu.map(({ name, menu }) =>
                            activeCategory === name && menu ? (
                                <div key={name} className="mx-auto py-6 px-4">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 px-4">
                                        {menu.map(({ id, label, sub_menu }) => (
                                            <div key={id}>
                                                <h3 className="text-lg font-semibold mb-2 pb-3 border-b-[2px] border-[#E6EFFB] text-black">{label}</h3>
                                                <ul className="space-y-2">
                                                    {sub_menu.map(({ id, label, slug, tag }) => (
                                                        <li key={id}>
                                                            <div className="flex items-center">
                                                                <Link href={slug} className="text-gray-600 hover:text-blue-600 text-sm">
                                                                    {label}
                                                                </Link>
                                                                {tag && (
                                                                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
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
    )
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false)
        setActiveCategory(null)
    }, [])

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = () => {
            closeMenu()
        }

        if (isMenuOpen) {
            document.addEventListener("click", handleClickOutside)
        }

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [isMenuOpen, closeMenu])

    return (
        <header className="relative z-50">
            {/* Notification Bar */}
            <div className="bg-blue-600 text-white py-2 px-4 text-center">
                <div className="container mx-auto flex items-center justify-center">
                    <CountdownTimer />
                    <span className="ml-2 text-base">
                        Exclusive 10% OFF! Up to $10. Hurry Before Time Runs Out! Use Code:
                        <span className="font-bold text-yellow-300 border-b border-bottom-1 text-base">WEBBY10</span>
                    </span>
                </div>
            </div>

            {/* Main Navigation */}
            <div className="bg-white border-b">
                <div className="mx-auto px-4">
                    <div className="flex items-center justify-between h-16 mx px-4">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center" onClick={closeMenu}>
                                <Image src="/logo/webbytemplate-logo.svg" alt="WebbyTemplate" width={180} height={40} className="h-[35px] w-[260px]" />
                            </Link>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-6">
                            <Link href="/become-author" className="text-black hover:text-blue-600 px-2 py-1 text-sm font-bold">
                                Become an author
                            </Link>
                            <Link href="/partners" className="text-black hover:text-blue-600 px-2 py-1 text-sm font-bold">
                                Partners
                            </Link>
                            <Link href="/offers" className="text-black hover:text-blue-600 px-2 py-1 text-sm font-bold">
                                Offers
                            </Link>
                            <Link href="/support" className="text-black hover:text-blue-600 px-2 py-1 text-sm font-bold">
                                Support
                            </Link>
                            <Link href="/hire-agency" className="text-black hover:text-blue-600 px-2 py-1 text-sm font-bold">
                                Hire an agency
                            </Link>
                            <Link href="/downloads" className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm font-bold">
                                Unlimited Downloads
                            </Link>
                        </nav>

                        {/* Right Side Actions */}
                        <div className="flex items-center space-x-4">
                            <button className="text-gray-700 hover:text-blue-600">
                                <svg className="h-5 w-5" width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.1667 15.1667L18.9472 18.9675M3.5 10.1667C3.5 11.9348 4.20238 13.6305 5.45262 14.8807C6.70286 16.131 8.39856 16.8333 10.1667 16.8333C11.9348 16.8333 13.6305 16.131 14.8807 14.8807C16.131 13.6305 16.8333 11.9348 16.8333 10.1667C16.8333 8.39856 16.131 6.70286 14.8807 5.45262C13.6305 4.20238 11.9348 3.5 10.1667 3.5C8.39856 3.5 6.70286 4.20238 5.45262 5.45262C4.20238 6.70286 3.5 8.39856 3.5 10.1667Z" stroke="black" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <Link href="/schedule" className="hidden md:block text-blue-600 hover:text-blue-800 text-sm font-medium">
                                Schedule Meeting
                            </Link>
                            <Link
                                href="/login"
                                className="hidden md:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                            >
                                Login / Sign up
                            </Link>
                            <Link href="/cart" className="relative">
                                <svg width="18" height="21" viewBox="0 0 18 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5.74935 7.75V4.5C5.74935 2.70507 7.20442 1.25 8.99935 1.25C10.7943 1.25 12.2493 2.70507 12.2493 4.5V7.75M2.49935 5.58333H15.4993L16.5827 19.6667H1.41602L2.49935 5.58333Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    0
                                </span>
                            </Link>

                            {/* Mobile menu button */}
                            <button className="md:hidden text-gray-700" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
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
                <div className="md:hidden bg-white shadow-lg border-t">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <Link
                            href="/become-author"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                        >
                            Become an author
                        </Link>
                        <Link href="/partners" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                            Partners
                        </Link>
                        <Link href="/offers" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                            Offers
                        </Link>
                        <Link href="/support" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                            Support
                        </Link>
                        <Link
                            href="/hire-agency"
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                        >
                            Hire an agency
                        </Link>
                        <Link href="/downloads" className="block px-3 py-2 text-base font-medium text-blue-600 hover:text-blue-800">
                            Unlimited Downloads
                        </Link>
                        <Link href="/schedule" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                            Schedule Meeting
                        </Link>
                        <Link href="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                            Login / Sign up
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}

