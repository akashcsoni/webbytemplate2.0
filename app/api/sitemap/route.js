import { strapiGet, strapiPost } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com';
        const currentDate = new Date().toISOString();
        
        // Initialize sitemap entries
        const sitemapEntries = [];
        
        // Add static pages
        const staticPages = [
            { url: '', priority: '1.0', changefreq: 'daily' }, // Home page
            { url: '/shop', priority: '0.9', changefreq: 'daily' },
            { url: '/cart', priority: '0.5', changefreq: 'weekly' },
            { url: '/wishlist', priority: '0.5', changefreq: 'weekly' },
            { url: '/checkout', priority: '0.3', changefreq: 'monthly' },
            { url: '/search', priority: '0.6', changefreq: 'weekly' },
            { url: '/thank-you', priority: '0.2', changefreq: 'monthly' },
            { url: '/cancel', priority: '0.2', changefreq: 'monthly' },
            { url: '/extra', priority: '0.4', changefreq: 'monthly' },
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

        // Fetch dynamic pages from Strapi
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
                    if (page.attributes && page.attributes.slug) {
                        sitemapEntries.push({
                            url: `${baseUrl}/${page.attributes.slug}`,
                            lastmod: page.attributes.updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.8'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching pages from Strapi:', error);
        }

        // Fetch products for dynamic product pages
        try {
            const productsData = await strapiPost('/product/filter', {
                page_size: 1000,
                filter: 'all',
                category: 'false'
            }, themeConfig.TOKEN);

            if (productsData && productsData.data) {
                productsData.data.forEach(product => {
                    if (product.slug) {
                        sitemapEntries.push({
                            url: `${baseUrl}/product/${product.slug}`,
                            lastmod: product.updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.7'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching products from Strapi:', error);
        }

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

        // Generate XML sitemap
        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
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
