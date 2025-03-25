import GlobalComponent from "@/components/global/global-component"

const getPageData = async () => {
  try {
    const response = await fetch('https://studio.webbytemplate.com/api/pages/home', {
      cache: 'no-store'
    })
    const { result, data } = await response.json()
    if (!result || !data) throw new Error('Failed to load page data')
    return data
  } catch (error) {
    throw error
  }
}

export default async function Home() {
  const pageData = await getPageData()
  return (
    <main>
      <GlobalComponent data={pageData} />
    </main>
  )
}