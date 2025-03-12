import GlobalComponent from "@/components/global/global-component"
import Link from "next/link"

// Server-side data fetching
async function getPageData() {
    try {
        // Use a fixed API URL since we know the domain
        const apiUrl = `https://studio.webbytemplate.com/api/categories/html-templates`

        const response = await fetch(apiUrl, {
            cache: "no-store", // or { next: { revalidate: 60 } } for ISR
        })

        const result = await response.json()

        if (result.result && result.data) {
            return result.data
        }
        throw new Error("Failed to load page data")
    } catch (error) {
        // console.error("Error fetching page data:", error)
        throw error
    }
}

export default async function parentCategoryPage({ params }) {
    const { parentcategory } = await params
    console.log(parentcategory)
    // Fetch data on the server
    const pageData = await getPageData()

    return (
        <main className="py-12 px-4 md:px-6 container mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center text-sm mb-6">
                <Link href="/" className="text-[#0156d5] hover:underline">
                    Home
                </Link>
                <span className="mx-2 text-[#505050]">›</span>
                <Link href="/categories" className="text-[#0156d5] hover:underline">
                    Categories
                </Link>
                <span className="mx-2 text-[#505050]">›</span>
                <span className="text-[#505050]">HTML Templates</span>
            </nav>

            {/* Page Heading */}
            <h1 className="text-3xl font-bold text-[#000000] mb-6">HTML Templates</h1>

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
                Our HTML Templates are the perfect starting point for clean, well-structured websites that reflect your brand.
                Each Template uses HTML5 and CSS3 to create beautiful, mobile-friendly designs that&apos;ll look great on all
                platforms.
            </p>
            <GlobalComponent data={pageData} />
        </main>
    )
}