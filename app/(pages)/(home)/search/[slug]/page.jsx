import SearchPage from '@/components/search/SearchPage'
import React from 'react'
import { Metadata } from 'next'
import { themeConfig } from '@/config/theamConfig'

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

export async function generateMetadata({ params, searchParams }) {
    const { slug } = await params;
    
    // Format slug for display: handles both hyphens and spaces
    // Examples: "food-ordering" → "Food Ordering"
    //           "WooCommerce%20Dynamic%20Pricing" → "WooCommerce Dynamic Pricing"
    const formatSlug = (slug) => {
        if (!slug) return '';
        
        try {
            // Decode URL-encoded characters (e.g., %20 → space)
            const decodedSlug = decodeURIComponent(slug);
            
            // Split by both hyphens and spaces, then filter out empty strings
            const words = decodedSlug.split(/[-\s]+/).filter(word => word.length > 0);
            
            // Capitalize each word: first letter uppercase, rest lowercase
            return words
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        } catch (e) {
            // If decoding fails, try with original slug
            const words = slug.split(/[-\s]+/).filter(word => word.length > 0);
            return words
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ');
        }
    };
    
    const formattedSlug = formatSlug(slug);
    
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
    
    // Generate title in format: "Food Ordering Website Templates | WebbyTemplate"
    // If the slug already contains "website templates", don't add it again
    const slugLower = formattedSlug.toLowerCase();
    const alreadyHasWebsiteTemplates = slugLower.includes('website templates') || 
                                       slugLower.includes('website template');
    
    const title = formattedSlug 
        ? alreadyHasWebsiteTemplates 
            ? `${formattedSlug} | WebbyTemplate`
            : `${formattedSlug} Website Templates | WebbyTemplate`
        : 'Search - WebbyTemplate';
    
    return {
        title: title,
        description: formattedSlug 
            ? `Browse our collection of ${formattedSlug.toLowerCase()} website templates. Find premium, responsive templates for your next project.`
            : `Search results for templates, graphics, and digital products`,
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
