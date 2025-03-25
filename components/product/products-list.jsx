"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { apiRequest } from "@/lib/api-utils"
import ProductGrid from "./product-grid"

/**
 * Products List Component
 * @param {Object} props
 * @param {number} props.id - Component ID
 * @param {string} props.title - Section title
 * @param {string} props.description - Section description
 * @param {string} props.section_layout - Layout type ("with_bg" or "without_bg")
 * @param {number} props.page_size - Number of products to display
 * @param {string} props.filter - Filter type for products
 * @param {string} props.base - Base type
 * @param {boolean} props.category - Whether to show category
 * @param {Object} props.link - Link object
 * @param {Array} props.categories_list - List of categories
 */
export default function ProductsList(props) {
    const {
        title,
        description,
        section_layout,
        page_size,
        filter,
        base,
        category,
        link,
        categories_list,
    } = props

    const [products, setProducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedCategory, setSelectedCategory] = useState(null)

    // Fetch products when component mounts or when filter/page_size changes
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true)

                // Create form data for the POST request
                const formData = new FormData()
                formData.append("page_size", page_size.toString())
                formData.append("filter", filter)
                formData.append("base", base)
                formData.append("category", category.toString())

                // Make API request using our utility function
                const response = await apiRequest("https://studio.webbytemplate.com/api/product/filter", "POST", formData)

                const productsData = response.data || []
                setProducts(productsData)
                setFilteredProducts(productsData)
                setError(null)
            } catch (err) {
                console.error("Error fetching products:", err)
                setError("Failed to load products. Please try again later.")
                setProducts([])
                setFilteredProducts([])
            } finally {
                setLoading(false)
            }
        }

        fetchProductData()
    }, [filter, page_size, base, category])

    // Filter products when selected category changes
    useEffect(() => {
        if (!selectedCategory) {
            setFilteredProducts(products)
            return
        }

        const filtered = products.filter(
            (product) => product.categories && product.categories.some((cat) => cat.slug === selectedCategory),
        )
        setFilteredProducts(filtered)
    }, [selectedCategory, products])

    // Handle category selection
    const handleCategoryClick = (slug) => {
        setSelectedCategory(selectedCategory === slug ? null : slug)
    }

    // Determine background class based on section_layout
    const bgClass = section_layout === "with_bg" ? "bg-gray-50" : ""

    return (
        <section className={`py-12 px-4 md:px-6 container mx-auto ${bgClass}`}>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[#000000]">{title}</h2>
                    <p className="text-[#505050] mt-1">{description}</p>
                </div>
                {link && (
                    <Link href={link?.link} className="text-[#0156d5] font-medium flex items-center hover:underline">
                        {link?.label}
                        {link?.image ? (
                            <Image src={link?.image || "/placeholder.svg"} alt="" width={16} height={16} className="ml-1" />
                        ) : (
                            <span className="ml-1">→</span>
                        )}
                    </Link>
                )}
            </div>

            {categories_list && categories_list?.length > 0 && (
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === null
                            ? "bg-[#0156d5] text-white border-[#0156d5]"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                    >
                        All
                    </button>
                    {categories_list?.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => handleCategoryClick(category?.slug)}
                            className={`px-4 py-2 border rounded-full text-sm whitespace-nowrap transition-colors ${selectedCategory === category?.slug
                                ? "bg-[#0156d5] text-white border-[#0156d5]"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {category?.title || category?.name}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                // Loading state
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {[...Array(page_size)].map((_, index) => (
                        <div key={index} className="animate-pulse">
                            <div className="bg-gray-200 rounded-lg h-[340px] mb-4"></div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="bg-gray-200 rounded-full w-8 h-8 mr-3"></div>
                                    <div>
                                        <div className="bg-gray-200 h-4 w-24 rounded mb-2"></div>
                                        <div className="bg-gray-200 h-3 w-16 rounded"></div>
                                    </div>
                                </div>
                                <div className="bg-gray-200 h-4 w-16 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                // Error state
                <div className="text-center py-10">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                    >
                        Try Again
                    </button>
                </div>
            ) : filteredProducts.length === 0 ? (
                (<div>No Products Found in selected category</div>)
            ) : (
                // Products grid
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                    {filteredProducts.map((product, index) => (
                        <ProductGrid key={index} product={product} />
                    ))}
                </div>
            )}
        </section>
    )
}