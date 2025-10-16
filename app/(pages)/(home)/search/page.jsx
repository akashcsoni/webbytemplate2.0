import SearchPage from '@/components/search/SearchPage'
import React from 'react'
import { themeConfig } from '@/config/theamConfig'

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

export async function generateMetadata({ searchParams }) {
    // Build canonical URL with search parameters
    const baseUrl = themeConfig.SITE_URL;
    const searchUrl = new URL('/search', baseUrl);
    
    // Add search parameters to canonical URL
    if (searchParams) {
        Object.entries(searchParams).forEach(([key, value]) => {
            if (value && typeof value === 'string') {
                searchUrl.searchParams.set(key, value);
            }
        });
    }
    
    return {
        title: 'Search - WebbyTemplate',
        description: 'Search for templates, graphics, and digital products',
        alternates: {
            canonical: searchUrl.toString(),
        },
    };
}

const searchPage = () => {
    return (
        <>
            <SearchPage />
        </>
    )   
}

export default searchPage
