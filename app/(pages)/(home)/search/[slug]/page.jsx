import SearchPage from '@/components/search/SearchPage'
import React from 'react'

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

const searchPage = async ({ params }) => {

    const { slug } = await params;

    return (
        <>
            <SearchPage slug={slug} />
        </>
    )
}

export default searchPage
