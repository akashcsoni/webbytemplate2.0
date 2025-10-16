import SearchPage from '@/components/search/SearchPage'
import React from 'react'
import { Metadata } from 'next'
import { themeConfig } from '@/config/theamConfig'

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

export async function generateMetadata({ params, searchParams }) {
    const { slug } = await params;
    
    // Build canonical URL with search parameters
    const baseUrl = themeConfig.SITE_URL;
    const searchUrl = new URL(`/search/${slug}`, baseUrl);
    
    // Add search parameters to canonical URL
    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                searchUrl.searchParams.set(key, value);
            }
        });
    }
    
    return {
        title: `Search ${slug ? `- ${slug}` : ''} - WebbyTemplate`,
        description: `Search results for ${slug || 'templates, graphics, and digital products'}`,
        alternates: {
            canonical: searchUrl.toString(),
        },
    };
}

const searchPage = async ({ params }) => {

    const { slug } = await params;

    return (
        <>
            <SearchPage slug={slug} />
        </>
    )
}

export default searchPage
