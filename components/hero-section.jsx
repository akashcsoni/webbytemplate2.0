"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"

export default function HeroSection({ title, description, tags = [], categories = [], isLoading = false }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState("All Categories")
    const dropdownRef = useRef(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 flex justify-center">
                <div className="animate-pulse">
                    <div className="h-10 bg-gray-200 rounded w-96 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-80 mb-8"></div>
                    <div className="h-12 bg-gray-200 rounded w-full max-w-4xl"></div>
                </div>
            </div>
        )
    }

    if (!title || !description) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p>Failed to load hero data. Please try again later.</p>
            </div>
        )
    }

    return (
        <section className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="flex flex-col items-center text-center">
                {/* Main Heading */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#000000] max-w-5xl leading-tight mb-6">
                    {title}
                </h1>

                {/* Subheading */}
                <p className="text-[#505050] max-w-4xl mb-10 text-base md:text-lg">{description}</p>

                {/* Search Bar */}
                <div className="w-full max-w-4xl mb-8">
                    <div className="flex flex-col md:flex-row gap-2 p-2 bg-white rounded-lg shadow-md">
                        {/* Categories Dropdown */}
                        <div className="relative min-w-[180px]" ref={dropdownRef}>
                            <button
                                className="flex items-center justify-between w-full px-4 py-3 text-[#000000] bg-white rounded-md border border-[#d9dde2] hover:border-[#0156d5] transition-colors"
                                onClick={() => setIsOpen(!isOpen)}
                                aria-expanded={isOpen}
                                aria-haspopup="true"
                            >
                                <span className="font-medium">{selectedCategory}</span>
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
                                    className={`text-[#505050] transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-[#d9dde2] rounded-md shadow-lg">
                                    <ul className="py-1 max-h-60 overflow-auto" role="menu" aria-orientation="vertical">
                                        <li>
                                            <button
                                                className={`w-full text-left px-4 py-2 hover:bg-[#e6effb] ${selectedCategory === "All Categories" ? "bg-[#e6effb] text-[#0156d5]" : "text-[#505050]"}`}
                                                onClick={() => {
                                                    setSelectedCategory("All Categories")
                                                    setIsOpen(false)
                                                }}
                                                role="menuitem"
                                            >
                                                All Categories
                                            </button>
                                        </li>
                                        {categories.map((category) => (
                                            <li key={category.id}>
                                                <button
                                                    className={`w-full text-left px-4 py-2 hover:bg-[#e6effb] ${selectedCategory === category.title ? "bg-[#e6effb] text-[#0156d5]" : "text-[#505050]"}`}
                                                    onClick={() => {
                                                        setSelectedCategory(category.title)
                                                        setIsOpen(false)
                                                    }}
                                                    role="menuitem"
                                                    title={category.short_description}
                                                >
                                                    {category.title}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Search Input */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search for mockups, Web Templates and More....."
                                className="w-full px-4 py-3 text-[#505050] bg-white border border-[#d9dde2] rounded-md focus:outline-none focus:ring-2 focus:ring-[#0156d5] focus:border-transparent"
                            />
                        </div>

                        {/* Search Button */}
                        <button className="px-6 py-3 bg-[#0156d5] text-white font-medium rounded-md hover:bg-[#00193e] transition-colors">
                            Search
                        </button>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap justify-center gap-4">
                    {tags.map((tag) => (
                        <CategoryPill key={tag.id} icon={tag.image} label={tag.label} link={tag.link} />
                    ))}
                </div>
            </div>
        </section>
    )
}

function CategoryPill({ icon, label, link }) {
    return (
        <a
            href={link || "#"}
            className="flex items-center gap-2 px-4 py-2 bg-[#e6effb] text-[#0156d5] rounded-md hover:bg-[#d9e5f7] transition-colors"
        >
            <div className="w-5 h-5 relative">
                <Image src={icon || "/placeholder.svg"} alt="" width={20} height={20} className="object-contain" />
            </div>
            <span className="font-medium">{label}</span>
        </a>
    )
}