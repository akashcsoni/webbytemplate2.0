import GlobalComponent from "@/components/global/global-component";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import SearchPage from "@/components/search/SearchPage";
import SinglePage from "@/components/SinglePage";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";

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

        const data = pageData?.data || {};
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
        const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}`;
        
        // Generate title from API data with fallbacks
        const title = data?.title || itemSlug || 'WebbyTemplate';
        
        // Generate description from API data with fallbacks
        const description = data?.description || "Premium website templates and themes";

        // Get image URL from seo_meta with validation
        let imageUrl = null;
        try {
            if (data?.seo_meta?.image?.url && typeof data.seo_meta.image.url === 'string') {
                imageUrl = data.seo_meta.image.url;
            }
        } catch (error) {
            console.error('Error extracting image URL:', error);
            imageUrl = null;
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
            // Safe data extraction with fallbacks
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
            const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}`;
            const title = pageData?.data?.title || itemSlug || 'Product';
            
            // Generate Product schema (always show, with or without reviews)
            let productSchema = null;
            try {
                // Start with basic Product schema
                productSchema = {
                    "@context": "https://schema.org/",
                    "@type": "Product",
                    "name": title,
                    "image": pageData?.data?.gallery_image?.[0]?.url || pageData?.data?.seo_meta?.image?.url || null,
                    "description": pageData?.data?.description || "Premium website template",
                    "sku": pageData?.data?.sku || pageData?.data?.id || itemSlug,
                    "brand": {
                        "@type": "Brand",
                        "name": "WebbyTemplate"
                    }
                };

                // Try to fetch reviews and add them if available
                try {
                    const reviewsResponse = await strapiPost(`/product-review/${itemSlug}`, {
                        token: themeConfig.TOKEN,
                    });
                    
                    if (reviewsResponse?.data && Array.isArray(reviewsResponse.data)) {
                        const authorizedReviews = reviewsResponse.data.filter(
                            (review) => review?.review_status === "Authorized"
                        );
                        
                        // Only add review fields if reviews are found
                        if (authorizedReviews.length > 0) {
                            // Calculate aggregate rating
                            const totalRating = authorizedReviews.reduce((sum, review) => sum + (review?.rating || 0), 0);
                            const averageRating = (totalRating / authorizedReviews.length).toFixed(1);
                            
                            // Add review-related fields to Product schema
                            productSchema.aggregateRating = {
                                "@type": "AggregateRating",
                                "ratingValue": averageRating,
                                "reviewCount": authorizedReviews.length.toString()
                            };
                            
                            productSchema.review = authorizedReviews.map(review => ({
                                "@type": "Review",
                                "author": {
                                    "@type": "Person",
                                    "name": review?.user?.full_name || "Anonymous"
                                },
                                "datePublished": review?.createdAt ? new Date(review.createdAt).toISOString().split('T')[0] : null,
                                "reviewBody": review?.review || "No review text provided.",
                                "name": `${title} Review`,
                                "reviewRating": {
                                    "@type": "Rating",
                                    "ratingValue": review?.rating?.toString() || "5",
                                    "bestRating": "5",
                                    "worstRating": "1"
                                }
                            }));
                        }
                        // If no reviews found, don't add any review-related fields
                    }
                } catch (reviewError) {
                    console.error('Error fetching reviews for Product schema:', reviewError);
                    // Continue with basic Product schema without reviews
                }
                
                // Remove null values from schema
                productSchema = JSON.parse(JSON.stringify(productSchema, (key, value) => {
                    return value === null ? undefined : value;
                }));
            } catch (error) {
                console.error('Error generating Product schema:', error);
                productSchema = null;
            }
            
            // Generate breadcrumb structured data with error handling
            let breadcrumbData = null;
            try {
                breadcrumbData = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": baseUrl
                        }
                    ]
                };

                // Add category breadcrumb if available and valid
                if (pageData?.data?.categories && 
                    Array.isArray(pageData.data.categories) && 
                    pageData.data.categories.length > 0 &&
                    pageData.data.categories[0]?.title &&
                    pageData.data.categories[0]?.slug) {
                    breadcrumbData.itemListElement.push({
                        "@type": "ListItem",
                        "position": 2,
                        "name": pageData.data.categories[0].title,
                        "item": `${baseUrl}/category/${pageData.data.categories[0].slug}`
                    });
                }

                // Add subcategory breadcrumb if available and valid
                if (pageData?.data?.sub_categories && 
                    Array.isArray(pageData.data.sub_categories) && 
                    pageData.data.sub_categories.length > 0 &&
                    pageData.data.sub_categories[0]?.title &&
                    pageData.data.sub_categories[0]?.slug) {
                    breadcrumbData.itemListElement.push({
                        "@type": "ListItem",
                        "position": breadcrumbData.itemListElement.length + 1,
                        "name": pageData.data.sub_categories[0].title,
                        "item": `${baseUrl}/category/${pageData.data.sub_categories[0].slug}`
                    });
                }

                // Add current page breadcrumb
                breadcrumbData.itemListElement.push({
                    "@type": "ListItem",
                    "position": breadcrumbData.itemListElement.length + 1,
                    "name": title,
                    "item": currentUrl
                });
            } catch (error) {
                console.error('Error generating breadcrumb data:', error);
                breadcrumbData = null;
            }

            // Generate FAQ structured data with error handling
            let faqStructuredData = null;
            try {
                if (pageData?.data?.faq && 
                    Array.isArray(pageData.data.faq) && 
                    pageData.data.faq.length > 0) {
                    
                    const validFaqItems = pageData.data.faq.filter(faqItem => 
                        faqItem && 
                        (faqItem.title || faqItem.question) && 
                        (faqItem.label || faqItem.answer || faqItem.description)
                    );

                    if (validFaqItems.length > 0) {
                        faqStructuredData = {
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": validFaqItems.map(faqItem => ({
                                "@type": "Question",
                                "name": faqItem.title || faqItem.question || "FAQ Question",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": faqItem.label || faqItem.answer || faqItem.description || "FAQ Answer"
                                }
                            }))
                        };
                    }
                }
            } catch (error) {
                console.error('Error generating FAQ data:', error);
                faqStructuredData = null;
            }

            return (
                <>
                    {breadcrumbData && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(breadcrumbData)
                            }}
                        />
                    )}
                    {productSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(productSchema)
                            }}
                        />
                    )}
                    {faqStructuredData && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(faqStructuredData)
                            }}
                        />
                    )}
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
