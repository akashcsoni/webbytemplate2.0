import { strapiGet, strapiPost } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();

        // Initialize sitemap entries
        const sitemapEntries = [];

        // Add static pages
        const staticPages = [
            { url: '', priority: '1.0', changefreq: 'daily' }, // Home page
            { url: '/cart', priority: '0.5', changefreq: 'weekly' },
            { url: '/wishlist', priority: '0.5', changefreq: 'weekly' },
            { url: '/checkout', priority: '0.3', changefreq: 'monthly' },
            { url: '/search', priority: '0.6', changefreq: 'weekly' },
        ];

        // Add static pages to sitemap
        staticPages.forEach(page => {
            sitemapEntries.push({
                url: `${baseUrl}${page.url}`,
                lastmod: currentDate,
                changefreq: page.changefreq,
                priority: page.priority
            });
        });

        // Fetch dynamic pages from Strapi using pages endpoint
        try {
            const pagesData = await strapiGet('pages', {
                params: {
                    populate: '*',
                    pagination: { limit: 1000 } // Adjust limit as needed
                },
                token: themeConfig.TOKEN,
            });

            if (pagesData && pagesData.data) {
                pagesData.data.forEach(page => {
                    const slug = page.attributes?.slug || page.slug;
                    const updatedAt = page.attributes?.updatedAt || page.updatedAt;
                    
                    // Filter out the 'home' page from dynamic pages
                    if (slug && slug !== 'home') {
                        sitemapEntries.push({
                            url: `${baseUrl}/${slug}`,
                            lastmod: updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.8'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching pages from Strapi:', error);
        }

        // Note: Products are now in a separate sitemap at /product-list.xml
        // This main sitemap focuses on other content types

        // Fetch blogs for dynamic blog pages
        try {
            const blogsData = await strapiPost('/blog/filter', {
                category: ""
            }, themeConfig.TOKEN);

            if (blogsData && blogsData.data) {
                blogsData.data.forEach(blog => {
                    if (blog.slug) {
                        sitemapEntries.push({
                            url: `${baseUrl}/blog/${blog.slug}`,
                            lastmod: blog.updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.6'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching blogs from Strapi:', error);
        }

        // Fetch categories for dynamic category pages
        try {
            const categoriesData = await strapiGet('categories', {
                params: {
                    populate: '*',
                    pagination: { limit: 1000 }
                },
                token: themeConfig.TOKEN,
            });

            if (categoriesData && categoriesData.data) {
                categoriesData.data.forEach(category => {
                    if (category.attributes && category.attributes.slug) {
                        sitemapEntries.push({
                            url: `${baseUrl}/category/${category.attributes.slug}`,
                            lastmod: category.attributes.updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.7'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching categories from Strapi:', error);
        }

        // Fetch authors for dynamic author pages
        try {
            const authorsData = await strapiGet('customers', {
                params: {
                    populate: '*',
                    pagination: { limit: 1000 }
                },
                token: themeConfig.TOKEN,
            });

            if (authorsData && authorsData.data) {
                authorsData.data.forEach(author => {
                    if (author.attributes && author.attributes.username) {
                        sitemapEntries.push({
                            url: `${baseUrl}/author/${author.attributes.username}`,
                            lastmod: author.attributes.updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.6'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching authors from Strapi:', error);
        }

        // Generate XML sitemap with reference to product sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
  <!-- Product sitemap reference -->
  <url>
    <loc>${baseUrl}/product-list.xml</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Product category sitemap reference -->
  <url>
    <loc>${baseUrl}/product-category.xml</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

        return new Response(sitemap, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
