import GlobalComponent from "@/components/global/global-component";
import GlobalNotFound from "@/app/(pages)/global-not-found";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

// Generate static params for dynamic routes (optional - helps with build optimization)
export async function generateStaticParams() {
    // This function is optional but helps Next.js understand the dynamic route structure
    // You can return an empty array if you want all pages to be server-side rendered
    return [];
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
    const { pageSlug } = await params;
    const headersList = await headers();
    const host = headersList.get('host') || 'webbytemplate.com';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const currentUrl = `${protocol}://${host}/${pageSlug}`;
    
    try {
        const pageData = await strapiGet(`pages/${pageSlug}`, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        if (!pageData.result || !pageData.data) {
            return {
                title: 'Page Not Found | WebbyTemplate',
                description: 'The requested page could not be found.',
            };
        }

        const { data } = pageData;
        const seoMeta = data.seo_meta;

        // Extract title and description from SEO meta or fallback to page title
        const title = seoMeta?.title || data.title || 'WebbyTemplate';
        const description = seoMeta?.description || `Learn more about ${data.title} on WebbyTemplate`;
        
        // Handle SEO image
        let imageUrl = 'https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png'; // Default fallback image
        if (seoMeta?.image) {
            imageUrl = seoMeta.image.url || 
                      seoMeta.image.formats?.large?.url || 
                      seoMeta.image.formats?.medium?.url ||
                      seoMeta.image.formats?.small?.url ||
                      'https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png';
        }

        return {
            title: {
                template: '%s | WebbyTemplate',
                default: title || 'WebbyTemplate - Digital Marketplace for Website Templates'
            },
            description: description,
            keywords: [
                'webbytemplate',
                'website templates',
                'digital products',
                'web design',
                'ui/ux',
                'html templates',
                'figma kits',
                data.title?.toLowerCase(),
                pageSlug
            ].filter(Boolean),
            authors: [{ name: 'WebbyTemplate' }],
            creator: 'WebbyTemplate',
            publisher: 'WebbyTemplate',
            robots: {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    'max-video-preview': -1,
                    'max-image-preview': 'large',
                    'max-snippet': -1,
                },
            },
            openGraph: {
                type: 'website',
                locale: 'en_US',
                url: currentUrl,
                siteName: 'WebbyTemplate',
                title: `${title} | WebbyTemplate`,
                description: description,
                images: [
                    {
                        url: imageUrl,
                        width: seoMeta?.image?.width || 1200,
                        height: seoMeta?.image?.height || 630,
                        alt: seoMeta?.image?.alternativeText || title,
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${title} | WebbyTemplate`,
                description: description,
                images: [imageUrl],
                creator: '@webbytemplate',
                site: '@webbytemplate',
            },
            alternates: {
                canonical: currentUrl,
            },
            other: {
                'og:updated_time': data.updatedAt,
                'article:published_time': data.publishedAt || data.createdAt,
                'article:modified_time': data.updatedAt,
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
            };
        }
        
        return {
            title: {
                template: '%s | WebbyTemplate',
                default: 'WebbyTemplate - Digital Marketplace for Website Templates'
            },
            description: 'WebbyTemplate - Digital marketplace for website templates, UI/UX designs, and digital assets.',
            keywords: ['webbytemplate', 'website templates', 'digital products', 'web design', 'ui/ux'],
            authors: [{ name: 'WebbyTemplate' }],
            creator: 'WebbyTemplate',
            publisher: 'WebbyTemplate',
            robots: {
                index: true,
                follow: true,
            },
            openGraph: {
                type: 'website',
                locale: 'en_US',
                siteName: 'WebbyTemplate',
                title: 'WebbyTemplate - Digital Marketplace for Website Templates',
                description: 'WebbyTemplate - Digital marketplace for website templates, UI/UX designs, and digital assets.',
                images: [
                    {
                        url: 'https://webbytemplate.com/logo/webby-logo.svg',
                        width: 1200,
                        height: 630,
                        alt: 'WebbyTemplate Logo',
                    }
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: 'WebbyTemplate - Digital Marketplace for Website Templates',
                description: 'WebbyTemplate - Digital marketplace for website templates, UI/UX designs, and digital assets.',
                images: ['https://webbytemplate.com/logo/webby-logo.svg'],
                creator: '@webbytemplate',
                site: '@webbytemplate',
            },
        };
    }
}

export default async function DynamicPage({ params, searchParams }) {
    const { pageSlug } = await params;
    const headersList = await headers();
    const host = headersList.get('host') || 'webbytemplate.com';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    const currentUrl = `${protocol}://${host}/${pageSlug}`;

    try {
        const pageData = await strapiGet(`pages/${pageSlug}`, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        // Check if page data exists and is valid
        if (!pageData.result || !pageData.data || Object.keys(pageData.data).length === 0) {
            // Check if it's a 404 specifically
            if (pageData.status === 404) {
                return <GlobalNotFound />;
            }
            return <SomethingWrong />;
        }

        const { data } = pageData;
        const seoMeta = data.seo_meta;
        
        // Extract title and description
        const title = seoMeta?.title || data.title || 'WebbyTemplate';
        const description = seoMeta?.description || `Learn more about ${data.title} on WebbyTemplate`;
        
        // Handle SEO image
        let imageUrl = 'https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png'; // Default fallback image
        if (seoMeta?.image) {
            imageUrl = seoMeta.image.url || 
                      seoMeta.image.formats?.large?.url || 
                      seoMeta.image.formats?.medium?.url ||
                      seoMeta.image.formats?.small?.url ||
                      'https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png';
        }

        // Generate breadcrumb data
        const breadcrumbItems = [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: `${protocol}://${host}`
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: title,
                item: currentUrl
            }
        ];

        // Generate structured data
        const structuredData = [
            {
                '@context': 'https://schema.org',
                '@type': 'WebPage',
                name: title,
                description: description,
                url: currentUrl,
                publisher: {
                    '@type': 'Organization',
                    name: 'WebbyTemplate',
                    url: `${protocol}://${host}`,
                    logo: {
                        '@type': 'ImageObject',
                        url: 'https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png',
                        width: 1200,
                        height: 630
                    }
                },
                datePublished: data.publishedAt || data.createdAt,
                dateModified: data.updatedAt,
                mainEntity: {
                    '@type': 'Article',
                    headline: title,
                    description: description,
                    author: {
                        '@type': 'Organization',
                        name: 'WebbyTemplate'
                    },
                    publisher: {
                        '@type': 'Organization',
                        name: 'WebbyTemplate',
                        logo: {
                            '@type': 'ImageObject',
                            url: 'https://webbytemplate-store-com.s3.ap-south-1.amazonaws.com/image_2_74b59265ec.png'
                        }
                    },
                    datePublished: data.publishedAt || data.createdAt,
                    dateModified: data.updatedAt,
                    image: {
                        '@type': 'ImageObject',
                        url: imageUrl,
                        width: seoMeta?.image?.width || 1200,
                        height: seoMeta?.image?.height || 630
                    }
                }
            },
            {
                '@context': 'https://schema.org',
                '@type': 'BreadcrumbList',
                itemListElement: breadcrumbItems
            }
        ];

        return (
            <>
                {structuredData.map((schema, index) => (
                    <script
                        key={index}
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify(schema)
                        }}
                    />
                ))}
                <GlobalComponent data={pageData.data} />
            </>
        );
    } catch (error) {
        console.error('Error loading page:', error);
        
        // Check if it's a 404 error
        if (error?.response?.status === 404 || error?.status === 404) {
            return <GlobalNotFound />;
        }
        
        return <SomethingWrong />;
    }
}
