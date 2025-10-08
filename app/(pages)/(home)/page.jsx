import GlobalComponent from "@/components/global/global-component";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export const dynamic = 'force-dynamic'; // SSR on every request

// Generate metadata for SEO
export async function generateMetadata() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
    const currentUrl = baseUrl;

    try {
        const pageData = await strapiGet("pages/home", {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
            // next: { revalidate: 60 }
        });

        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            return {
                title: "Buy Premium Website Templates & UI Kits | WebbyTemplate Marketplace",
                description: "Discover top-selling website templates, WordPress themes, and UI kits. Build modern, responsive sites with WebbyTemplate's global design marketplace.",
                keywords: "website templates, WordPress themes, UI kits, HTML templates, responsive design, web design, portfolio templates, business templates, marketplace, premium templates",
                alternates: {
                    canonical: `${currentUrl}/`,
                },
                openGraph: {
                    title: "Buy Premium Website Templates & UI Kits | WebbyTemplate Marketplace",
                    description: "Discover top-selling website templates, WordPress themes, and UI kits. Build modern, responsive sites with WebbyTemplate's global design marketplace.",
                    url: `${currentUrl}/`,
                    siteName: "WebbyTemplate Marketplace",
                    images: [
                        {
                            url: `${baseUrl}/images/digital-product.png`,
                            width: 1200,
                            height: 630,
                            alt: "WebbyTemplate Marketplace - Premium Website Templates",
                        },
                    ],
                    locale: "en_US",
                    type: "website",
                },
                twitter: {
                    card: "summary_large_image",
                    title: "Buy Premium Website Templates & UI Kits | WebbyTemplate Marketplace",
                    description: "Discover top-selling website templates, WordPress themes, and UI kits. Build modern, responsive sites with WebbyTemplate's global design marketplace.",
                    images: [`${baseUrl}/images/digital-product.png`],
                },
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
                other: {
                    'theme-color': '#000000',
                    'msapplication-TileColor': '#000000',
                },
            };
        }

        const data = pageData?.data || {};

        // Generate title from seo_meta with fallbacks
        const title = data?.seo_meta?.title || "Buy Premium Website Templates & UI Kits | WebbyTemplate Marketplace";

        // Generate description from seo_meta with fallbacks
        const description = data?.seo_meta?.description || "Discover top-selling website templates, WordPress themes, and UI kits. Build modern, responsive sites with WebbyTemplate's global design marketplace.";

        // Generate keywords from API data and seo_meta
        let keywords = data?.seo_meta?.keywords;
        
        if (!keywords && data?.components) {
          // Extract keywords from components
          const categoryKeywords = [];
          data.components.forEach((component) => {
            if (component.__component === "shared.home-hero" && component.categories) {
              component.categories.forEach((category) => {
                if (category.title) {
                  categoryKeywords.push(category.title.toLowerCase());
                }
              });
            }
            if (component.__component === "shared.service-section" && component.list) {
              component.list.forEach((service) => {
                if (service.title) {
                  categoryKeywords.push(service.title.toLowerCase());
                }
              });
            }
          });
          
          keywords = [
            "website templates",
            "WordPress themes", 
            "UI kits",
            "HTML templates",
            "responsive design",
            "web design",
            "portfolio templates",
            "business templates",
            "marketplace",
            "premium templates",
            ...categoryKeywords
          ].join(", ");
        }
        
        keywords = keywords || "website templates, WordPress themes, UI kits, HTML templates, responsive design, web design, portfolio templates, business templates, marketplace, premium templates";

        // Get canonical image URL from seo_meta with validation
        let imageUrl = null;
        if (data?.seo_meta?.image?.url) {
            imageUrl = data.seo_meta.image.url.startsWith('http') 
                ? data.seo_meta.image.url 
                : `${baseUrl}${data.seo_meta.image.url}`;
        } else {
            // Use default marketplace image since API doesn't have hero_image
            imageUrl = `${baseUrl}/images/digital-product.png`;
        }

        return {
            title,
            description,
            keywords,
            alternates: {
                canonical: `${currentUrl}/`,
            },
            openGraph: {
                title,
                description,
                url: `${currentUrl}/`,
                siteName: "WebbyTemplate Marketplace",
                images: [
                    {
                        url: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: title,
                    },
                ],
                locale: "en_US",
                type: "website",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: [imageUrl],
            },
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
            other: {
                'theme-color': '#000000',
                'msapplication-TileColor': '#000000',
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: "Buy Premium Website Templates & UI Kits | WebbyTemplate Marketplace",
            description: "Discover top-selling website templates, WordPress themes, and UI kits. Build modern, responsive sites with WebbyTemplate's global design marketplace.",
            keywords: "website templates, WordPress themes, UI kits, HTML templates, responsive design, web design, portfolio templates, business templates, marketplace, premium templates",
            alternates: {
                canonical: `${currentUrl}/`,
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    }
}

export default async function HomePage() {
  let pageData = null;

  try {
    pageData = await strapiGet("pages/home", {
      params: { populate: "*" },
      token: themeConfig.TOKEN,
    });

    if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
      throw new Error("Page data is empty");
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://webbytemplatev2.vercel.app';
    const data = pageData.data;

    // Generate WebSite structured data for the home page
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": `${baseUrl}/`,
      "name": "WebbyTemplate Marketplace",
      "description": data?.seo_meta?.description || "Discover top-selling website templates, WordPress themes, and UI kits. Build modern, responsive sites with WebbyTemplate's global design marketplace.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${baseUrl}/search?query={search_term_string}`,
        "query-input": "required name=search_term_string"
      }
    };

    // Add Organization structured data
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "WebbyTemplate Inc.",
      "url": baseUrl,
      "logo": `${baseUrl}/logo/webbytemplate-logo.svg`,
      "sameAs": [
        "https://twitter.com/webbytemplate",
        "https://linkedin.com/company/webbytemplate"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer support",
        "email": "support@webbytemplate.com",
        "telephone": "+1-555-123-4567"
      }
    };

    // Add Product schema for actual products from reviews
    const productSchemas = [];
    
    // Look for products in the components array (from reviews)
    if (data?.components && Array.isArray(data.components)) {
      data.components.forEach((component) => {
        // Check for review components that contain actual product data
        if (component.__component === "shared.review" && component.list && Array.isArray(component.list)) {
          component.list.forEach((review) => {
            if (review.product && review.product.slug) {
              productSchemas.push({
                "@context": "https://schema.org",
                "@type": "Product",
                "name": review.product.title || review.product.short_title || "Website Template",
                "description": review.product.description || "High-quality website template with modern design and responsive layout.",
                "image": `${baseUrl}/images/digital-product.png`,
                "brand": {
                  "@type": "Brand", 
                  "name": "WebbyTemplate"
                },
                "offers": {
                  "@type": "Offer",
                  "url": `${baseUrl}/product/${review.product.slug}`,
                  "price": "29.99",
                  "priceCurrency": "USD",
                  "availability": "https://schema.org/InStock",
                  "seller": {
                    "@type": "Organization",
                    "name": "WebbyTemplate"
                  }
                },
                "category": "Website Templates",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": review.rating || 5,
                  "reviewCount": 1
                }
              });
            }
          });
        }
      });
    }

    // Add FAQ structured data if available
    const faqSchema = [];
    if (data?.components && Array.isArray(data.components)) {
      data.components.forEach((component) => {
        if (component.__component === "shared.faq-section" && component.list && Array.isArray(component.list)) {
          faqSchema.push({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": component.list.map((faq) => ({
              "@type": "Question",
              "name": faq.title,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.label
              }
            }))
          });
        }
      });
    }

    return (
      <>
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        
        {/* Product Schema for featured templates */}
        {productSchemas.map((productSchema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(productSchema)
            }}
          />
        ))}
        
        {/* FAQ Schema */}
        {faqSchema.map((faq, index) => (
          <script
            key={`faq-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faq)
            }}
          />
        ))}
        
        {/* Preload critical images for better LCP */}
        {data?.components && Array.isArray(data.components) && (
          <>
            {data.components.map((component, index) => {
              // Preload hero images from home-hero component categories
              if (component.__component === "shared.home-hero" && component.categories && Array.isArray(component.categories)) {
                return component.categories.slice(0, 3).map((category, catIndex) => (
                  <link
                    key={`hero-cat-${index}-${catIndex}`}
                    rel="preload"
                    as="image"
                    href={`${baseUrl}/images/digital-product.png`}
                    type="image/png"
                  />
                ));
              }
              // Preload service section images
              if (component.__component === "shared.service-section" && component.list && Array.isArray(component.list)) {
                return component.list.slice(0, 2).map((service, serviceIndex) => (
                  service.image && (
                    <link
                      key={`service-img-${index}-${serviceIndex}`}
                      rel="preload"
                      as="image"
                      href={service.image.url.startsWith('http') ? service.image.url : `${baseUrl}${service.image.url}`}
                      type="image/png"
                    />
                  )
                ));
              }
              return null;
            })}
          </>
        )}
        
        <GlobalComponent data={pageData.data} />
      </>
    );
  } catch (error) {
    return (
      <SomethingWrong message={error?.message} />
    )
  }
}
