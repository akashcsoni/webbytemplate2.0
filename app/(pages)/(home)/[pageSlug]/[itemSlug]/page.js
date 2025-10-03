import GlobalComponent from "@/components/global/global-component";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import SearchPage from "@/components/search/SearchPage";
import SingleBlogPage from "@/components/SingleBlogPage";
import SinglePage from "@/components/SinglePage";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const { pageSlug, itemSlug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
    const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}`;
    
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
                title: itemSlug,
                description: "Premium website templates and themes",
                alternates: {
                    canonical: currentUrl,
                },
            };
        }

        const data = pageData?.data || {};
        
        // Generate title from seo_meta with fallbacks
        const title = data?.seo_meta?.title || data?.title || itemSlug;
        
        // Generate description from seo_meta with fallbacks
        let description = data?.seo_meta?.description || data?.description;
        
        // For blog posts, use different default description
        if (pageSlug === 'blog') {
            description = description || "Read our latest blog post";
        } else {
            description = description || "Premium website templates and themes";
        }

        // Check if category should be indexed based on no_index field
        const shouldIndex = pageSlug === 'category' ? (data?.no_index !== true) : true;

        // Get image URL from seo_meta with validation
        let imageUrl = null;
        try {
            if (data?.seo_meta?.image?.url && typeof data.seo_meta.image.url === 'string') {
                imageUrl = data.seo_meta.image.url;
            } else if (pageSlug === 'blog' && data?.image?.url && typeof data.image.url === 'string') {
                // For blog posts, fallback to main image if seo_meta image is not available
                imageUrl = data.image.url;
            }
        } catch (error) {
            console.error('Error extracting image URL:', error);
            imageUrl = null;
        }

        return {
            title: title,
            description: description,
            keywords: data?.seo_meta?.keywords || 
                     (pageSlug === 'blog' 
                        ? (data?.blog_categories?.map(cat => cat.title).join(', ') || 'blog, articles, web design')
                        : (data?.tags?.map(tag => tag.title).join(', ') || 'website templates, themes, web design')),
            alternates: {
                canonical: currentUrl,
            },
            openGraph: {
                type: pageSlug === 'blog' ? 'article' : 'website',
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
                ...(pageSlug === 'blog' && data?.author?.full_name && {
                    authors: [data.author.full_name]
                }),
                ...(pageSlug === 'blog' && data?.publishedAt && {
                    publishedTime: new Date(data.publishedAt).toISOString()
                }),
                ...(pageSlug === 'blog' && data?.updatedAt && {
                    modifiedTime: new Date(data.updatedAt).toISOString()
                })
            },
            twitter: {
                card: 'summary_large_image',
                title: title,
                description: description,
                images: imageUrl ? [imageUrl] : undefined,
            },
            robots: {
                index: shouldIndex,
                follow: true,
                googleBot: {
                    index: shouldIndex,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        // Default to indexing for error cases (unless specifically a category with no_index)
        const shouldIndexFallback = true;
            
        return {
            title: itemSlug,
            description: "Premium website templates and themes",
            keywords: 'website templates, themes, web design',
            alternates: {
                canonical: currentUrl,
            },
            robots: {
                index: shouldIndexFallback,
                follow: true,
            },
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
            
            // Generate title and description from seo_meta with fallbacks (same as metadata)
            const title = pageData?.data?.seo_meta?.title || pageData?.data?.title || itemSlug;
            const description = pageData?.data?.seo_meta?.description || pageData?.data?.description || "Premium website template";
            
            // Generate Product schema (always show, with or without reviews)
            let productSchema = null;
            try {
                // Prepare images array
                let images = [];
                if (pageData?.data?.gallery_image && Array.isArray(pageData.data.gallery_image)) {
                    images = pageData.data.gallery_image.map(img => img.url).filter(Boolean);
                }
                if (images.length === 0 && pageData?.data?.seo_meta?.image?.url) {
                    images = [pageData.data.seo_meta.image.url];
                }

                // Prepare offers array from licenses
                let offers = [];
                if (pageData?.data?.all_license && Array.isArray(pageData.data.all_license)) {
                    offers = pageData.data.all_license.map(license => ({
                        "@type": "Offer",
                        "url": currentUrl,
                        "priceCurrency": "USD",
                        "price": license.sales_price ? license.sales_price.toString() : license.regular_price?.toString() || "0",
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "priceCurrency": "USD",
                            "price": license.sales_price ? license.sales_price.toString() : license.regular_price?.toString() || "0"
                        },
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition",
                        "name": license.license?.title || license.license_type || "License",
                        "sku": license.license?.documentId || license.id || `${itemSlug}-${license.license_type}`
                    }));
                }

                // Start with comprehensive Product schema
                productSchema = {
                    "@context": "https://schema.org/",
                    "@type": "Product",
                    "name": title,
                    "image": images.length > 0 ? images : null,
                    "description": description,
                    "sku": pageData?.data?.sku || pageData?.data?.id || itemSlug,
                    "brand": {
                        "@type": "Brand",
                        "name": "WebbyTemplate"
                    },
                    "offers": offers.length > 0 ? offers : null,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": currentUrl
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "WebbyTemplate",
                        "url": baseUrl
                    },
                    "datePublished": pageData?.data?.createdAt ? new Date(pageData.data.createdAt).toISOString().split('T')[0] : null,
                    "dateModified": pageData?.data?.updatedAt ? new Date(pageData.data.updatedAt).toISOString().split('T')[0] : null
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
            // Generate blog metadata and structured data
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
            const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}`;
            
            // Generate title and description from seo_meta with fallbacks
            const title = pageData?.data?.seo_meta?.title || pageData?.data?.title || itemSlug;
            const description = pageData?.data?.seo_meta?.description || pageData?.data?.description || "Read our latest blog post";
            
            // Generate Article structured data
            let articleSchema = null;
            try {
                // Prepare images array
                let images = [];
                if (pageData?.data?.image?.url) {
                    images = [pageData.data.image.url];
                }
                if (images.length === 0 && pageData?.data?.seo_meta?.image?.url) {
                    images = [pageData.data.seo_meta.image.url];
                }

                // Calculate word count for reading time
                let wordCount = 0;
                if (pageData?.data?.body) {
                    const textContent = pageData.data.body.replace(/<[^>]*>/g, '');
                    wordCount = textContent.split(/\s+/).length;
                }

                articleSchema = {
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": title,
                    "description": description,
                    "image": images.length > 0 ? images : null,
                    "author": {
                        "@type": "Person",
                        "name": pageData?.data?.author?.full_name || "Anonymous",
                        "url": pageData?.data?.author?.username ? `${baseUrl}/author/${pageData.data.author.username}` : null
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "WebbyTemplate",
                        "url": baseUrl,
                        "logo": {
                            "@type": "ImageObject",
                            "url": `${baseUrl}/logo/webby-logo.svg`
                        }
                    },
                    "datePublished": pageData?.data?.publishedAt ? new Date(pageData.data.publishedAt).toISOString() : null,
                    "dateModified": pageData?.data?.updatedAt ? new Date(pageData.data.updatedAt).toISOString() : null,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": currentUrl
                    },
                    "url": currentUrl,
                    "articleSection": pageData?.data?.blog_categories?.map(cat => cat.title).join(', ') || null,
                    "wordCount": wordCount > 0 ? wordCount.toString() : null
                };

                // Remove null values from schema
                articleSchema = JSON.parse(JSON.stringify(articleSchema, (key, value) => {
                    return value === null ? undefined : value;
                }));
            } catch (error) {
                console.error('Error generating Article schema:', error);
                articleSchema = null;
            }

            // Generate breadcrumb structured data for blog
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
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Blog",
                            "item": `${baseUrl}/blog`
                        }
                    ]
                };

                // Add category breadcrumb if available
                if (pageData?.data?.blog_categories && 
                    Array.isArray(pageData.data.blog_categories) && 
                    pageData.data.blog_categories.length > 0 &&
                    pageData.data.blog_categories[0]?.title &&
                    pageData.data.blog_categories[0]?.slug) {
                    breadcrumbData.itemListElement.push({
                        "@type": "ListItem",
                        "position": 3,
                        "name": pageData.data.blog_categories[0].title,
                        "item": `${baseUrl}/blog/category/${pageData.data.blog_categories[0].slug}`
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
                console.error('Error generating blog breadcrumb data:', error);
                breadcrumbData = null;
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
                    {articleSchema && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(articleSchema)
                            }}
                        />
                    )}
                    <SingleBlogPage data={pageData.data} />
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
