import LicenseSelector from '@/components/product/single-product/license/license-selector'
import { TechnologySelector } from '@/components/product/technology-selector'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

// Server-side data fetching with POST method
async function getPageData(slug) {
    try {
        // Use a fixed API URL since we know the domain
        const apiUrl = `https://studio.webbytemplate.com/api/product/${slug}`

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                slug: slug,
                // Add any other required parameters for your POST request
            }),
            cache: "no-store", // or { next: { revalidate: 60 } } for ISR
        })

        const result = await response.json()

        if (result.result && result.data) {
            return result.data
        }
        // If no data is found, trigger 404
        return notFound()

    } catch (error) {
        // console.error("Error fetching page data:", error)
        throw error
    }
}

function TagPill({ text, slug }) {
    return <Link href={`/tag/${slug}`} className="px-3 py-1 bg-[#f5f5f5] text-[#505050] text-sm rounded-full">{text}</Link>
}

function FeatureItem({ text }) {
    return (
        <div className="flex items-center gap-2">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-[#0156d5]"
            >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <span className="text-[#505050]">{text}</span>
        </div>
    )
}

export default async function ProductSinglePage({ params }) {
    const { slug } = await params;
    const pageData = await getPageData(slug);

    // Function to extract technologies with custom slug and price
    function extractTechnologiesWithProductSlugs(data, defaultSlug = '', defaultPrice = null) {
        const technologies = [];
        const techMap = new Map(); // To track technologies by ID

        // First, add the main technology with the default slug and price
        if (data.technology && data.technology.id) {
            const mainTech = JSON.parse(JSON.stringify(data.technology));
            mainTech.slug = defaultSlug || mainTech.slug;
            mainTech.price = defaultPrice || {
                id: null,
                regular_price: null,
                sales_price: null
            };
            technologies.push(mainTech);
            techMap.set(mainTech.id, true); // Mark as processed
        }

        // Process products to get the product slugs and prices
        if (data.products && Array.isArray(data.products)) {
            data.products.forEach(product => {
                if (product.all_technology &&
                    product.all_technology.technology &&
                    product.all_technology.technology.id) {

                    const techId = product.all_technology.technology.id;

                    // Skip if we already processed this technology (as the main technology)
                    if (techMap.has(techId)) {
                        return;
                    }

                    // Create a deep copy of the technology object
                    const tech = JSON.parse(JSON.stringify(product.all_technology.technology));

                    // Replace technology slug with product slug
                    tech.slug = product.slug;

                    // Add price object from the product
                    if (product.price) {
                        tech.price = product.price;
                    }

                    technologies.push(tech);
                    techMap.set(techId, true); // Mark as processed
                }
            });
        }

        return technologies;
    }

    // Extract and display
    const allTechnologies = extractTechnologiesWithProductSlugs(pageData?.all_technology, pageData?.slug, pageData?.price);

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-sm mb-4">
                <Link href="/" className="text-[#0156d5] hover:underline">
                    Home
                </Link>
                <span className="mx-2 text-gray-500">&gt;</span>
                {
                    pageData.categories && pageData.categories.length > 0 ? (
                        <Link
                            href={`/category/${pageData.categories[0].slug}`}
                            className="text-[#0156d5] hover:underline"
                        >
                            {pageData.categories[0].title}
                        </Link>
                    ) : null
                }
                <span className="mx-2 text-gray-500">&gt;</span>
                <span className="text-[#505050]">{pageData?.title}</span>
            </nav>

            {/* Main Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 md:mb-10">
                <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-bold">{pageData?.title}</h1>

                    <div className="flex flex-wrap items-center gap-2">
                        {pageData.author && (
                            <div className="flex items-center gap-2">
                                {pageData.author.image?.url ? (
                                    <div className="relative w-8 h-8 overflow-hidden rounded-full">
                                        <Image
                                            src={`https://studio.webbytemplate.com${pageData.author.image.url}` || "/placeholder.svg"}
                                            alt={`${pageData.author.full_name}'s profile picture`}
                                            fill
                                            sizes="32px"
                                            className="object-cover"
                                            priority={false}
                                        />
                                    </div>
                                ) : (
                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">{pageData.author.name?.[0] || pageData.author.full_name?.[0]}</span>
                                    </div>
                                )}
                                <span className="text-sm font-medium">{pageData.author.full_name}</span>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6effb] text-[#0156d5]">
                                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                                        fill="#0156d5"
                                    />
                                </svg>
                                Creative Tools
                            </span>

                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6effb] text-[#0156d5]">
                                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M19 5H5V19H19V5Z" fill="#0156d5" />
                                </svg>
                                986 Sales
                            </span>

                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#e6effb] text-[#0156d5]">
                                <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#0156d5" />
                                </svg>
                                Well Documented
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="inline-flex items-center justify-center px-4 py-2 bg-[#0156d5] text-white rounded-md hover:bg-[#0156d5]/90 transition-colors">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4 mr-2"
                        >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        Live Preview
                    </button>
                    {
                        pageData?.schedule_meeting && (
                            <button className="inline-flex items-center justify-center px-4 py-2 bg-white text-[#0156d5] border border-[#0156d5] rounded-md hover:bg-[#e6effb] transition-colors">
                                Schedule Meeting
                            </button>
                        )
                    }
                </div>
            </div>

            <div className="lg:flex gap-5 xl:gap-10 w-full bg-white pb-8">
                <div className='w-full lg:max-w-[400px] flex-shrink-0 mb-5 lg:mb-0'>
                    {/* License Selection */}
                    <LicenseSelector licenses={pageData?.all_license} />

                    {/* Technology */}
                    <div className="border-b border-[#d9dde2] py-4">
                        <TechnologySelector all_technology={allTechnologies} />
                    </div>

                    {/* Lifetime */}
                    <div className="border-b border-[#d9dde2] py-4 flex justify-between items-center">
                        <h2 className="text-[#000000] text-lg font-semibold">Lifetime</h2>
                        <div>
                            <span className="font-medium">${pageData?.price?.sales_price}</span><br />
                            <span className="text-[#969ba3] font-medium text-sm line-through">${pageData?.price?.regular_price}</span>
                        </div>
                    </div>
                    {/* Add to Cart Button */}
                    <div className="py-4">
                        <button className="w-full bg-[#0156d5] text-white py-3 rounded flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-5 h-5 mr-2"
                            >
                                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <path d="M16 10a4 4 0 0 1-8 0" />
                            </svg>
                            Add to Cart
                        </button>
                    </div>

                    {/* Related Topics */}
                    <div className="border-b border-[#d9dde2] py-4">
                        <h2 className="text-[#000000] text-lg font-semibold mb-2">Related Topics:</h2>
                        <p className="text-[#505050] mb-4">
                            Buy with confidence. Our 10 days money-back guarantee has covered you if you are unhappy with our products.
                        </p>

                        <div className="flex justify-between text-[#505050] mb-4">
                            <div>
                                <span className="text-[#505050]">Created:</span> 03 October 2023
                            </div>
                            <div>
                                <span className="text-[#505050]">Updated:</span> 30 January 2025
                            </div>
                        </div>
                    </div>

                    {/* Review */}
                    <div className="border-b border-[#d9dde2] py-4">
                        <h2 className="text-[#000000] text-lg font-semibold mb-2">Review:</h2>
                        <div className="flex items-center">
                            <div className="flex text-[#f9bc60]">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        stroke="currentColor"
                                        strokeWidth="0"
                                        className="w-5 h-5"
                                    >
                                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                    </svg>
                                ))}
                            </div>
                            <span className="ml-2 text-[#505050]">(4.70)</span>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="border-b border-[#d9dde2] py-4">
                        <h2 className="text-[#000000] text-lg font-semibold mb-3">Tags:</h2>
                        <div className="flex flex-wrap gap-2">
                            {pageData.tags.map((tag) => (
                                <TagPill key={tag.slug} text={tag.title} slug={tag.slug} />
                            ))}
                        </div>
                    </div>

                    {/* Features */}
                    <div className="py-4">
                        <h2 className="text-[#000000] text-lg font-semibold mb-3">Features:</h2>
                        <div className="space-y-3">
                            {pageData.features.map((feature) => (
                                <FeatureItem key={feature.slug} text={feature.title} />
                            ))}
                        </div>
                    </div>
                </div>

                <div className='w-full'>
                    {/* discription */}
                    <div
                        dangerouslySetInnerHTML={{ __html: pageData?.description }}
                    />
                </div>
            </div>
        </div>
    )
}
