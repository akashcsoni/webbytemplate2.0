import GlobalComponent from "@/components/global/global-component";
import { notFound } from "next/navigation";
import SearchPage from "@/components/search/SearchPage";
import SingleBlogPage from "@/components/SingleBlogPage";
import SinglePage from "@/components/SinglePage";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet, strapiPost } from "@/lib/api/strapiClient";
import { getCanonicalImageUrl, getCanonicalImageUrls, getBestCanonicalImage, createImageObjectSchema, getFallbackImageUrl } from "@/lib/utils/canonicalImageUrl";
export const dynamic = 'force-dynamic';
// ISR configuration for category pages
export const revalidate = 60; // Revalidate every 60 seconds for ISR

// Generate static params for ISR - pre-generate paths for category pages
export async function generateStaticParams() {
    try {
        // Fetch all categories to pre-generate static paths
        const categoriesResponse = await strapiGet('categories', {
            params: {
                populate: "*",
            },
            token: themeConfig.TOKEN,
        });

        if (!categoriesResponse?.data || !Array.isArray(categoriesResponse.data)) {
            return [];
        }

        // Generate static params for category pages
        const categoryParams = categoriesResponse.data.map((category) => ({
            pageSlug: 'category',
            itemSlug: category.slug,
        }));

        // You can also add other page types here if needed
        // For example, if you want to pre-generate product pages:
        // const productsResponse = await strapiGet('products', { ... });
        // const productParams = productsResponse.data.map((product) => ({
        //     pageSlug: 'product',
        //     itemSlug: product.slug,
        // }));

        return categoryParams;
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const { pageSlug, itemSlug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbytemplate.com';
    const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}/`;

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
            // Add cache configuration for ISR in metadata generation
        });

        if (!pageData.result || !pageData.data || Object.keys(pageData.data).length === 0) {
            return {
                title: '404 - Page Not Found | WebbyTemplate',
                description: 'The page you are looking for does not exist.',
                robots: {
                    index: false,
                    follow: false,
                },
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
        const shouldIndex = pageSlug === 'category' 
            ? (data?.no_index !== true) 
            : true;

        // Get canonical image URL from seo_meta with validation
        let imageUrl = null;
        try {
            if (data?.seo_meta?.image) {
                imageUrl = getCanonicalImageUrl(data.seo_meta.image, baseUrl);
            } else if (pageSlug === 'blog' && data?.image) {
                // For blog posts, fallback to main image if seo_meta image is not available
                imageUrl = getCanonicalImageUrl(data.image, baseUrl);
            }

            // Fallback to site logo if no image found
            if (!imageUrl) {
                imageUrl = getFallbackImageUrl(baseUrl);
            }
        } catch (error) {
            console.error('Error extracting image URL:', error);
            imageUrl = getFallbackImageUrl(baseUrl);
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
                locale: 'en_US',
                images: imageUrl ? [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                        type: 'image/jpeg'
                    }
                ] : [
                    {
                        url: `https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png`,
                        width: 1200,
                        height: 630,
                        alt: 'WebbyTemplate',
                        type: 'image/svg+xml'
                    }
                ],
                ...(pageSlug === 'blog' && data?.author?.full_name && {
                    authors: [data.author.full_name]
                }),
                ...(pageSlug === 'blog' && data?.publishedAt && {
                    publishedTime: new Date(data.publishedAt).toISOString()
                }),
                ...(pageSlug === 'blog' && data?.updatedAt && {
                    modifiedTime: new Date(data.updatedAt).toISOString()
                }),
                ...(pageSlug === 'product' && data?.all_license && data.all_license.length > 0 && {
                    price: {
                        amount: data.all_license[0].sales_price || data.all_license[0].regular_price || 0,
                        currency: 'USD'
                    }
                }),
                ...(pageSlug === 'product' && data?.categories && data.categories.length > 0 && {
                    section: data.categories[0].title
                })
            },
            twitter: {
                card: 'summary_large_image',
                site: '@webbytemplate',
                creator: pageSlug === 'blog' && data?.author?.twitter ? `@${data.author.twitter}` : '@webbytemplate',
                title: title,
                description: description,
                images: imageUrl ? [imageUrl] : [`https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png`],
                ...(pageSlug === 'product' && data?.all_license && data.all_license.length > 0 && {
                    label1: 'Price',
                    data1: `$${data.all_license[0].sales_price || data.all_license[0].regular_price || 0}`
                }),
                ...(pageSlug === 'product' && data?.categories && data.categories.length > 0 && {
                    label2: 'Category',
                    data2: data.categories[0].title
                })
            },
            robots: {
                index: shouldIndex,
                follow: shouldIndex,
                googleBot: {
                    index: shouldIndex,
                    follow: shouldIndex,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            other: {
                // Additional meta tags for better SEO
                'theme-color': '#000000',
                'msapplication-TileColor': '#000000',
                'msapplication-config': '/browserconfig.xml',
                ...(pageSlug === 'product' && data?.all_license && data.all_license.length > 0 && {
                    'product:price:amount': (data.all_license[0].sales_price || data.all_license[0].regular_price || 0).toString(),
                    'product:price:currency': 'USD',
                    'product:availability': 'in stock',
                    'product:condition': 'new'
                }),
                ...(pageSlug === 'product' && data?.categories && data.categories.length > 0 && {
                    'product:category': data.categories[0].title
                }),
                ...(pageSlug === 'blog' && data?.author?.full_name && {
                    'article:author': data.author.full_name
                }),
                ...(pageSlug === 'blog' && data?.publishedAt && {
                    'article:published_time': new Date(data.publishedAt).toISOString()
                }),
                ...(pageSlug === 'blog' && data?.updatedAt && {
                    'article:modified_time': new Date(data.updatedAt).toISOString()
                }),
                ...(pageSlug === 'blog' && data?.blog_categories && data.blog_categories.length > 0 && {
                    'article:section': data.blog_categories[0].title
                })
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        
        // Check if it's a 404 error
        if (error?.response?.status === 404 || error?.status === 404) {
            return {
                title: '404 - Page Not Found | WebbyTemplate',
                description: 'The page you are looking for does not exist.',
                robots: {
                    index: false,
                    follow: false,
                },
                alternates: {
                    canonical: currentUrl,
                },
            };
        }
        
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

        // Fetch data with ISR-friendly configuration
        const pageData = await strapiGet(endpoint, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
            // Add cache configuration for ISR
            next: { revalidate: 60 }
        });

        // Handle API response errors
        if (!pageData.result) {
            console.error('API request failed:', {
                endpoint,
                status: pageData.status,
                error: pageData.error
            });
            return <SomethingWrong />;
        }

        // Handle 404 responses
        if (pageData.status === 404) {
            console.error('Resource not found:', {
                endpoint,
                pageSlug,
                itemSlug
            });
            notFound();
        }

        // Handle empty or invalid data
        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            console.error('Empty or invalid data received:', {
                endpoint,
                hasData: !!pageData?.data,
                dataKeys: pageData?.data ? Object.keys(pageData.data) : []
            });
            notFound();
        }

        // Additional validation for blog-specific requirements
        if (pageSlug === 'blog') {
            if (!pageData.data.title || (!pageData.data.body && !pageData.data.components)) {
                console.error('Blog missing required fields:', {
                    hasTitle: !!pageData.data.title,
                    hasBody: !!pageData.data.body,
                    hasComponents: !!pageData.data.components,
                    itemSlug
                });
                return <GlobalNotFound />;
            }
        }


        if (pageSlug === 'product') {
            // Safe data extraction with fallbacks
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbytemplate.com';
            const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}/`;

            // Generate title and description from seo_meta with fallbacks (same as metadata)
            const title = pageData?.data?.seo_meta?.title || pageData?.data?.title || itemSlug;
            const description = pageData?.data?.seo_meta?.description || pageData?.data?.description || "Premium website template";

            // Generate Product schema (always show, with or without reviews)
            let productSchema = null;
            try {
                // Prepare canonical images array
                let images = [];
                if (pageData?.data?.gallery_image && Array.isArray(pageData.data.gallery_image)) {
                    images = getCanonicalImageUrls(pageData.data.gallery_image, baseUrl);
                }
                if (images.length === 0 && pageData?.data?.seo_meta?.image) {
                    const canonicalImage = getCanonicalImageUrl(pageData.data.seo_meta.image, baseUrl);
                    if (canonicalImage) images = [canonicalImage];
                }
                if (images.length === 0) {
                    // Fallback to site logo
                    images = [getFallbackImageUrl(baseUrl)];
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
                        "name": "WebbyTemplate",
                        "url": `${baseUrl}/`
                    },
                    "offers": offers.length > 0 ? offers : null,
                    "mainEntityOfPage": {
                        "@type": "WebPage",
                        "@id": currentUrl
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "WebbyTemplate",
                        "url": `${baseUrl}/`,
                        "logo": createImageObjectSchema(
                            `https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png`,
                            baseUrl,
                            "WebbyTemplate Logo"
                        )
                    },
                    "datePublished": pageData?.data?.createdAt ? new Date(pageData.data.createdAt).toISOString().split('T')[0] : null,
                    "dateModified": pageData?.data?.updatedAt ? new Date(pageData.data.updatedAt).toISOString().split('T')[0] : null,
                    "url": currentUrl,
                    "category": pageData?.data?.categories?.map(cat => cat.title).join(', ') || null,
                    "keywords": pageData?.data?.tags?.map(tag => tag.title).join(', ') || null,
                    "additionalProperty": []
                };

                // Add additional properties for better SEO
                if (pageData?.data?.technology) {
                    productSchema.additionalProperty.push({
                        "@type": "PropertyValue",
                        "name": "Technology",
                        "value": pageData.data.technology
                    });
                }

                if (pageData?.data?.file_size) {
                    productSchema.additionalProperty.push({
                        "@type": "PropertyValue",
                        "name": "File Size",
                        "value": pageData.data.file_size
                    });
                }

                if (pageData?.data?.resolution) {
                    productSchema.additionalProperty.push({
                        "@type": "PropertyValue",
                        "name": "Resolution",
                        "value": pageData.data.resolution
                    });
                }

                // Add author information if available
                if (pageData?.data?.author) {
                    productSchema.author = {
                        "@type": "Person",
                        "name": pageData.data.author.full_name || pageData.data.author.username,
                        "url": pageData.data.author.username ? `${baseUrl}/author/${pageData.data.author.username}/` : null
                    };
                }

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
                        "item": `${baseUrl}/category/${pageData.data.categories[0].slug}/`
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
                        "item": `${baseUrl}/category/${pageData.data.sub_categories[0].slug}/`
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
                    {/* Preload critical product images for better LCP */}
                    {pageData?.data?.gallery_image && pageData.data.gallery_image.length > 0 && (
                        <link
                            rel="preload"
                            as="image"
                            href={pageData.data.gallery_image[0].url}
                            type="image/jpeg"
                        />
                    )}
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
            // Validate blog data before proceeding
            if (!pageData?.data ||
                !pageData?.data?.title ||
                (!pageData?.data?.body && !pageData?.data?.components) ||
                Object.keys(pageData.data).length === 0) {
                console.error('Blog data validation failed:', {
                    hasData: !!pageData?.data,
                    hasTitle: !!pageData?.data?.title,
                    hasBody: !!pageData?.data?.body,
                    hasComponents: !!pageData?.data?.components,
                    dataKeys: pageData?.data ? Object.keys(pageData.data) : []
                });
                notFound();
            }

            // Additional validation for required blog fields
            const requiredFields = ['title'];
            const missingFields = requiredFields.filter(field => !pageData.data[field]);

            if (missingFields.length > 0) {
                console.error('Missing required blog fields:', missingFields);
                notFound();
            }

            // Generate blog metadata and structured data
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbytemplate.com';
            const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}/`;

            // Generate title and description from seo_meta with fallbacks
            const title = pageData?.data?.seo_meta?.title || pageData?.data?.title || itemSlug;
            const description = pageData?.data?.seo_meta?.description || pageData?.data?.description || "Read our latest blog post";

            // Generate Article structured data
            let articleSchema = null;
            try {
                // Prepare canonical images array
                let images = [];
                if (pageData?.data?.image) {
                    const canonicalImage = getCanonicalImageUrl(pageData.data.image, baseUrl);
                    if (canonicalImage) images = [canonicalImage];
                }
                if (images.length === 0 && pageData?.data?.seo_meta?.image) {
                    const canonicalImage = getCanonicalImageUrl(pageData.data.seo_meta.image, baseUrl);
                    if (canonicalImage) images = [canonicalImage];
                }
                if (images.length === 0) {
                    // Fallback to site logo
                    images = [getFallbackImageUrl(baseUrl)];
                }

                // Calculate word count for reading time
                let wordCount = 0;
                if (pageData?.data?.body) {
                    const textContent = pageData.data.body.replace(/<[^>]*>/g, '');
                    wordCount = textContent.split(/\s+/).length;
                } else if (pageData?.data?.components) {
                    // Calculate word count from components
                    pageData.data.components.forEach((component) => {
                        if (component.__component === "shared.rich-text" && component.body) {
                            const textContent = component.body.replace(/<[^>]*>/g, '');
                            wordCount += textContent.split(/\s+/).length;
                        }
                    });
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
                        "url": pageData?.data?.author?.username ? `${baseUrl}/author/${pageData.data.author.username}/` : null
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "WebbyTemplate",
                        "url": `${baseUrl}/`,
                        "logo": createImageObjectSchema(
                            `https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png`,
                            baseUrl,
                            "WebbyTemplate Logo"
                        )
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
            let breadcrumb = [];
            try {
                breadcrumbData = {
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    "itemListElement": [
                        {
                            "@type": "ListItem",
                            "position": 1,
                            "name": "Home",
                            "item": `${baseUrl}/`
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": "Blog",
                            "item": `${baseUrl}/blogs/`
                        },
                        {
                            "@type": "ListItem",
                            "position": 3,
                            "name": title,
                            "item": currentUrl
                        }
                    ]
                };

                // Create breadcrumb array for component
                breadcrumb = [
                    {
                        id: 1,
                        title: "Home",
                        slug: "/",
                        visible: true
                    },
                    {
                        id: 2,
                        title: "Blog",
                        slug: "/blogs",
                        visible: true
                    },
                    {
                        id: 3,
                        title: title,
                        slug: currentUrl.replace(baseUrl, ''),
                        visible: false
                    }
                ];
            } catch (error) {
                console.error('Error generating blog breadcrumb data:', error);
                breadcrumbData = null;
                breadcrumb = [];
            }

            // Generate FAQ structured data for blog posts
            let faqStructuredData = null;
            try {
                if (pageData?.data?.components && Array.isArray(pageData.data.components)) {
                    const faqComponents = pageData.data.components.filter(comp => comp.__component === 'shared.faq-section');
                    
                    if (faqComponents.length > 0) {
                        const allFaqItems = [];
                        faqComponents.forEach(faqComponent => {
                            if (faqComponent.list && Array.isArray(faqComponent.list)) {
                                faqComponent.list.forEach(faqItem => {
                                    if (faqItem.title && faqItem.label) {
                                        allFaqItems.push({
                                            "@type": "Question",
                                            "name": faqItem.title,
                                            "acceptedAnswer": {
                                                "@type": "Answer",
                                                "text": faqItem.label.replace(/<[^>]*>/g, '').trim() // Remove HTML tags for schema
                                            }
                                        });
                                    }
                                });
                            }
                        });

                        if (allFaqItems.length > 0) {
                            faqStructuredData = {
                                "@context": "https://schema.org",
                                "@type": "FAQPage",
                                "mainEntity": allFaqItems
                            };
                        }
                    }
                }
            } catch (error) {
                console.error('Error generating FAQ structured data for blog:', error);
                faqStructuredData = null;
            }

            return (
                <>
                    {/* Preload critical blog image for better LCP */}
                    {pageData?.data?.image?.url && (
                        <link
                            rel="preload"
                            as="image"
                            href={pageData.data.image.url}
                            type="image/jpeg"
                        />
                    )}
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
                    {faqStructuredData && (
                        <script
                            type="application/ld+json"
                            dangerouslySetInnerHTML={{
                                __html: JSON.stringify(faqStructuredData)
                            }}
                        />
                    )}
                    <SingleBlogPage data={pageData.data} breadcrumb={breadcrumb} />
                </>
            );
        } else if (pageSlug === 'category') {
            // Generate CollectionPage and ItemList structured data for category pages
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.webbytemplate.com';
            const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}/`;

            // Generate title and description from seo_meta with fallbacks
            const title = pageData?.data?.seo_meta?.title || pageData?.data?.title || itemSlug;
            const description = pageData?.data?.seo_meta?.description || pageData?.data?.description || "Browse our collection of premium website templates and themes";

            // Generate CollectionPage structured data
            let collectionPageSchema = null;
            try {
                collectionPageSchema = {
                    "@context": "https://schema.org",
                    "@type": "CollectionPage",
                    "name": title,
                    "description": description,
                    "url": currentUrl,
                    "mainEntity": {
                        "@type": "ItemList",
                        "name": title,
                        "description": description,
                        "url": currentUrl,
                        "numberOfItems": pageData?.data?.products?.length || 0,
                        "itemListElement": []
                    },
                    "breadcrumb": {
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            {
                                "@type": "ListItem",
                                "position": 1,
                                "name": "Home",
                            "item": `${baseUrl}/`
                        },
                        {
                            "@type": "ListItem",
                            "position": 2,
                            "name": title,
                            "item": currentUrl
                        }
                        ]
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "WebbyTemplate",
                        "url": `${baseUrl}/`
                    }
                };

                // Add products to ItemList if available
                if (pageData?.data?.products && Array.isArray(pageData.data.products)) {
                    collectionPageSchema.mainEntity.itemListElement = pageData.data.products.slice(0, 20).map((product, index) => ({
                        "@type": "ListItem",
                        "position": index + 1,
                        "item": {
                            "@type": "Product",
                            "name": product.title || product.name,
                            "url": `${baseUrl}/product/${product.slug}/`,
                            "image": getBestCanonicalImage(
                                product.image || product.gallery_image?.[0] || product.gallery_image,
                                baseUrl
                            ) || getFallbackImageUrl(baseUrl),
                            "description": product.description || null,
                            "offers": product.all_license && product.all_license.length > 0 ? {
                                "@type": "Offer",
                                "priceCurrency": "USD",
                                "price": product.all_license[0].sales_price || product.all_license[0].regular_price || "0",
                                "availability": "https://schema.org/InStock"
                            } : null
                        }
                    }));
                }

                // Remove null values from schema
                collectionPageSchema = JSON.parse(JSON.stringify(collectionPageSchema, (key, value) => {
                    return value === null ? undefined : value;
                }));
            } catch (error) {
                console.error('Error generating CollectionPage schema:', error);
                collectionPageSchema = null;
            }

            if (Object.keys(searchParams).length > 0) {
                return (
                    <>
                        {collectionPageSchema && (
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify(collectionPageSchema)
                                }}
                            />
                        )}
                        <SearchPage />
                    </>
                );
            } else {
                // Generate FAQ structured data for category pages
                let faqStructuredData = null;
                try {
                    const faqComponent = pageData.data.components?.find(comp => comp.__component === 'shared.faq-section');
                    if (faqComponent && faqComponent.list && Array.isArray(faqComponent.list) && faqComponent.list.length > 0) {
                        const validFaqItems = faqComponent.list.filter(faqItem =>
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
                    console.error('Error generating FAQ structured data:', error);
                    faqStructuredData = null;
                }

                return (
                    <>
                        {collectionPageSchema && (
                            <script
                                type="application/ld+json"
                                dangerouslySetInnerHTML={{
                                    __html: JSON.stringify(collectionPageSchema)
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
                        
                        {/* Render FAQ content directly in HTML for SEO - server-side rendered with same structure as client-side */}
                        {(() => {
                            const faqComponent = pageData.data.components?.find(comp => comp.__component === 'shared.faq-section');
                            if (faqComponent && faqComponent.list && Array.isArray(faqComponent.list) && faqComponent.list.length > 0) {
                                return (
                                    <div style={{ display: 'none' }}>
                                        <section className="xl:py-[35px] sm:py-[30px] py-5">
                                            <div className="container mx-auto">
                                                <div className="flex justify-between lg:flex-row flex-col 2xl:gap-52 xl:gap-20 sm:gap-8 gap-5">
                                                    {(faqComponent.title || faqComponent.label) && (
                                                        <div className="xl:w-[30%] lg:w-[36%] w-full">
                                                            {faqComponent.title && <h2 className="md:mb-4 sm:mb-3 mb-2">{faqComponent.title}</h2>}
                                                            {faqComponent.label && <p className="lg:mb-6 sm:mb-5 mb-4 2xl:text-lg 1xl:text-[17px] lg:text-[15px] sm:text-base text-[15px] 1xl:leading-[30px] sm:leading-6 leading-[1.45rem]">{faqComponent.label}</p>}
                                                        </div>
                                                    )}
                                                    <div className="w-full 1xl:space-y-7 md:space-y-5 space-y-4">
                                                        {faqComponent.list.map((item, index) => (
                                                            <div key={`seo-faq-${item.id || index}`} className="border-b border-primary/10 2xl:pb-7 1xl:pb-6 md:pb-5 pb-4">
                                                                <div className="flex items-center justify-between cursor-pointer sm:gap-[22px] gap-2">
                                                                    <div className="flex items-center md:gap-6 sm:gap-4 gap-2.5">
                                                                        <span className="h5 !font-normal text-primary">Q{index + 1}.</span>
                                                                        <h3 className="font-normal 2xl:text-xl 1xl:text-[19px] md:text-lg sm:text-[17px] sm:text-base text-[15px]">{item.title || item.question || 'FAQ Question'}</h3>
                                                                    </div>
                                                                    <span className="text-gray-200 p-1" aria-hidden="true">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                                                                            <path d="M5 12h14" />
                                                                            <path d="M12 5v14" />
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                                <div className="2xl:mt-5 xl:mt-4 sm:mt-3 mt-2 lg:pl-14 md:pl-[52px] sm:pl-10 pl-8 pr-4 pb-0.5">
                                                                    {(item.label || item.answer || item.description) && (
                                                                        <div className="2xl:text-lg 1xl:text-[17px] sm:text-base text-sm cms-content" dangerouslySetInnerHTML={{
                                                                            __html: (item.label || item.answer || item.description || '').replace(/\n/g, '<br>')
                                                                        }} />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                );
                            }
                            return null;
                        })()}
                        
                        <GlobalComponent data={pageData.data} />
                    </>
                );
            }
        }
        return <GlobalComponent data={pageData.data} />;
    } catch (error) {
        console.error('Error loading page:', error);
        
        // Check if it's a 404 error
        if (error?.response?.status === 404 || error?.status === 404) {
            notFound();
        }
        
        return <SomethingWrong />;
    }
}
