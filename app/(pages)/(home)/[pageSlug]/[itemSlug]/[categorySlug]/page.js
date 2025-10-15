import GlobalComponent from "@/components/global/global-component";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import SearchPage from "@/components/search/SearchPage";
import SinglePage from "@/components/SinglePage";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";
import { getCanonicalImageUrl, getBestCanonicalImage, getFallbackImageUrl } from "@/lib/utils/canonicalImageUrl";



// Generate dynamic metadata for SEO
export async function generateMetadata({ params }) {
    const { pageSlug, itemSlug, categorySlug } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
    const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}/${categorySlug}`;

    try {
        let endpoint = `${pageSlug}/${itemSlug}/${categorySlug}`;

        // If the page is a sub-category page, get custom endpoint from themeConfig
        if (pageSlug === 'category') {
            const categoryBasePath = themeConfig.CATEGORY_API_ROUTE || 'category';
            endpoint = `${categoryBasePath}/${categorySlug}`;
        }

        const pageData = await strapiGet(endpoint, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        if (!pageData.result || !pageData.data || Object.keys(pageData.data).length === 0) {
            return {
                title: categorySlug,
                description: "Browse our collection of premium website templates and themes",
                alternates: {
                    canonical: currentUrl,
                },
            };
        }

        const data = pageData?.data || {};

        // Generate title from seo_meta with fallbacks
        const title = data?.seo_meta?.title || data?.title || categorySlug;

        // Generate description from seo_meta with fallbacks
        const description = data?.seo_meta?.description || data?.description || "Browse our collection of premium website templates and themes";

        // Check if sub-category should be indexed based on no_index field
        const shouldIndex = data?.no_index !== true;

        // Get canonical image URL from seo_meta with validation
        let imageUrl = null;
        try {
            if (data?.seo_meta?.image) {
                imageUrl = getCanonicalImageUrl(data.seo_meta.image, baseUrl);
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
            keywords: data?.seo_meta?.keywords || data?.tags?.map(tag => tag.title).join(', ') || 'website templates, themes, web design',
            alternates: {
                canonical: currentUrl,
            },
            openGraph: {
                type: 'website',
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
            },
            twitter: {
                card: 'summary_large_image',
                site: '@webbytemplate',
                creator: '@webbytemplate',
                title: title,
                description: description,
                images: imageUrl ? [imageUrl] : [`https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png`],
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
            other: {
                // Additional meta tags for better SEO
                'theme-color': '#000000',
                'msapplication-TileColor': '#000000',
                'msapplication-config': '/browserconfig.xml',
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        // Default to indexing for error cases
        const shouldIndexFallback = true;

        return {
            title: categorySlug,
            description: "Browse our collection of premium website templates and themes",
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
    const { pageSlug, itemSlug, categorySlug } = await params;

    try {
        let endpoint = `${pageSlug}/${itemSlug}/${categorySlug}`;

        // If the page is a sub-category page, get custom endpoint from themeConfig
        if (pageSlug === 'category') {
            const categoryBasePath = themeConfig.CATEGORY_API_ROUTE || 'category'; // fallback if not defined
            endpoint = `${categoryBasePath}/${categorySlug}`;
        }

        const pageData = await strapiGet(endpoint, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
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
                itemSlug,
                categorySlug
            });
            return <PageNotFound />;
        }

        // Handle empty or invalid data
        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            console.error('Empty or invalid data received:', {
                endpoint,
                hasData: !!pageData?.data,
                dataKeys: pageData?.data ? Object.keys(pageData.data) : []
            });
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
            // Generate CollectionPage and ItemList structured data for sub-category pages
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
            const currentUrl = `${baseUrl}/${pageSlug}/${itemSlug}/${categorySlug}`;

            // Generate title and description from seo_meta with fallbacks
            const title = pageData?.data?.seo_meta?.title || pageData?.data?.title || categorySlug;
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
                                "item": baseUrl
                            },
                            {
                                "@type": "ListItem",
                                "position": 2,
                                "name": pageData?.data?.category?.title || itemSlug,
                                "item": `${baseUrl}/category/${itemSlug}`
                            },
                            {
                                "@type": "ListItem",
                                "position": 3,
                                "name": title,
                                "item": currentUrl
                            }
                        ]
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "WebbyTemplate",
                        "url": baseUrl
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
                            "url": `${baseUrl}/product/${product.slug}`,
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
                // Generate FAQ structured data for sub-category pages
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
        console.error('Error in DynamicPage:', error);
        return <SomethingWrong />;
    }
}

