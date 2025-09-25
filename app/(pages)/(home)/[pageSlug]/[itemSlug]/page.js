import GlobalComponent from "@/components/global/global-component";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import SearchPage from "@/components/search/SearchPage";
import SinglePage from "@/components/SinglePage";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const { pageSlug, itemSlug } = await params;
    
    try {
        let endpoint = `${pageSlug}/${itemSlug}`;
        
        // If the page is a category page, get custom endpoint from themeConfig
        if (pageSlug === 'category') {
            const categoryBasePath = themeConfig.CATEGORY_API_ROUTE || 'category';
            endpoint = `${categoryBasePath}/${itemSlug}`;
        }

        const pageData = await strapiGet(endpoint, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        if (!pageData.result || !pageData.data || Object.keys(pageData.data).length === 0) {
            return {
                title: `${itemSlug} - WebbyTemplate`,
                description: "Premium website templates and themes",
            };
        }

        const data = pageData.data;
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
        const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}`;
        
        // Generate title from API data
        const title = data.title || itemSlug;
        
        // Generate description from API data
        const description = data.description || "Premium website template";

        // Get image URL from seo_meta
        let imageUrl = null;
        if (data.seo_meta && data.seo_meta.image && data.seo_meta.image.url) {
            imageUrl = data.seo_meta.image.url;
        }

        return {
            title: title,
            description: description,
            openGraph: {
                type: 'website',
                title: title,
                description: description,
                url: currentUrl,
                siteName: 'WebbyTemplate',
                images: imageUrl ? [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    }
                ] : undefined,
                locale: 'en_US',
            },
            twitter: {
                card: 'summary_large_image',
                title: title,
                description: description,
                images: imageUrl ? [imageUrl] : undefined,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: `${itemSlug} - WebbyTemplate`,
            description: "Premium website templates and themes",
        };
    }
}

export default async function DynamicPage({ params, searchParams }) {
    const { pageSlug, itemSlug } = await params;

    try {
        let endpoint = `${pageSlug}/${itemSlug}`;

        // If the page is a category page, get custom endpoint from themeConfig
        if (pageSlug === 'category') {
            const categoryBasePath = themeConfig.CATEGORY_API_ROUTE || 'category'; // fallback if not defined
            endpoint = `${categoryBasePath}/${itemSlug}`;
        }

        const pageData = await strapiGet(endpoint, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        if (!pageData.result) {
            return <SomethingWrong />;
        }
        if (!pageData.result && pageData.status === 404) {
            return <PageNotFound />;
        }

        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            return <SomethingWrong />;
        }

        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            return <PageNotFound />;
        }

        if (pageSlug === 'product') {
            return (
                <>
                    <SinglePage pageData={pageData.data} />
                    <GlobalComponent data={pageData.data} />
                </>
            );
        } else if (pageSlug === 'blog') {
            return (
                <>
                    <GlobalComponent data={pageData.data} />
                </>
            );
        } else if (pageSlug === 'category') {
            if (Object.keys(searchParams).length > 0) {
                return (
                    <>
                        <SearchPage />
                    </>
                );
            } else {
                return (
                    <GlobalComponent data={pageData.data} />
                );
            }
        }
        return <GlobalComponent data={pageData.data} />;
    } catch (error) {
        return <SomethingWrong />;
    }
}
