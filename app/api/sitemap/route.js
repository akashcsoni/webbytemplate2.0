import { strapiGet, strapiPost } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();

        // Initialize sitemap entries
        const sitemapEntries = [];

        // Add reference to page-list.xml
        sitemapEntries.push({
            url: `${baseUrl}/page-list.xml`,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: '0.9'
        });

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
                'X-Robots-Tag': 'noindex, follow', // Prevent indexing of sitemap XML files
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating sitemap:', error);
        return new Response('Error generating sitemap', { status: 500 });
    }
}
