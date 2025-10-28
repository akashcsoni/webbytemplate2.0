import { strapiPost } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();
        
        // Initialize sitemap entries for products only
        const sitemapEntries = [];
        
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
                            priority: '0.8' // Higher priority for product-specific sitemap
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching products from Strapi:', error);
        }

        // Generate XML sitemap for products only
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
                'X-Robots-Tag': 'noindex, nofollow', // Prevent indexing of sitemap XML files
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating product sitemap:', error);
        return new Response('Error generating product sitemap', { status: 500 });
    }
}
