import GlobalComponent from "@/components/global/global-component"
import Link from "next/link"
import { notFound } from "next/navigation"

// Server-side data fetching
async function getPageData(parentcategory) {
    try {
        // Use a fixed API URL since we know the domain
        const apiUrl = `https://studio.webbytemplate.com/api/categories/${parentcategory}`

        const response = await fetch(apiUrl, {
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

export default async function parentCategoryPage({ params }) {
    const { parentcategory } = await params

    // Fetch data on the server
    const pageData = await getPageData(parentcategory)

    return (
        <main className="py-12 px-4 md:px-6 container mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-sm mb-6">
                <Link href="/" className="text-[#0156d5] hover:underline">
                    Home
                </Link>
                <span className="mx-2 text-[#505050]">›</span>
                <span className="text-[#505050]">{pageData?.title}</span>
            </nav>

            {/* Page Heading */}
            <h1 className="text-3xl font-bold text-[#000000] mb-6">{pageData?.title}</h1>

            {/* Search Bar */}
            <div className="relative flex items-center mb-8">
                <input
                    type="text"
                    placeholder="Search for mockups, Web Templates and More....."
                    className="w-full border border-[#d9dde2] rounded-l px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#0156d5]"
                />
                <button className="bg-[#0156d5] text-white p-4 rounded-r flex items-center justify-center">
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
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </svg>
                </button>
            </div>

            {/* Description Text */}
            <p className="text-[#505050] leading-relaxed">
                {pageData?.short_description}
            </p>
            <GlobalComponent data={pageData} />
        </main>
    )
}