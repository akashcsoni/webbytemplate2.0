import GlobalComponent from "@/components/global/global-component"
import { notFound } from 'next/navigation'

// Server-side data fetching
async function getPageData(slug) {
    try {
        // Use a fixed API URL since we know the domain
        const apiUrl = `https://studio.webbytemplate.com/api/pages/${slug}`

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

export default async function Home({ params }) {

    const { slug } = await params;

    // Fetch data on the server
    const pageData = await getPageData(slug)

    return (
        <main>
            <GlobalComponent data={pageData} />
        </main>
    )
}