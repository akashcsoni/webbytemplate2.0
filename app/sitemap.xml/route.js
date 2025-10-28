import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();

        // Generate sitemap index XML
        const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/page-list.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/product-list.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/blog-list.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/product-category.xml</loc>
    <lastmod>${currentDate}</lastmod>
  </sitemap>
</sitemapindex>`;

        return new Response(sitemapIndex, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'X-Robots-Tag': 'noindex, follow', // Prevent indexing of sitemap XML files
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating sitemap index:', error);
        return new Response('Error generating sitemap index', { status: 500 });
    }
}