import GlobalComponent from "@/components/global/global-component"

// Server-side data fetching
async function getPageData() {
  try {
    // For the home page, use 'home' as the page name
    const pageName = "home"

    // Use a fixed API URL since we know the domain
    const apiUrl = `https://studio.webbytemplate.com/api/pages/${pageName}`

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

export default async function Home() {
  // Fetch data on the server
  const pageData = await getPageData()

  return (
    <main>
      <h1 className="sr-only">{pageData.title}</h1>
      <GlobalComponent data={pageData} />
    </main>
  )
}