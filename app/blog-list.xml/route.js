import { strapiGet } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();
        
        // Initialize sitemap entries for blogs only
        const sitemapEntries = [];
        
        // Fetch blogs from Strapi using the specific endpoint
        try {
            const blogsData = await strapiGet('blogs?pagination[page]=1&pagination[pageSize]=1000', {
                token: themeConfig.TOKEN,
            });

            if (blogsData && blogsData.data) {
                blogsData.data.forEach(blog => {
                    const slug = blog.slug;
                    const updatedAt = blog.updatedAt;
                    
                    if (slug) {
                        sitemapEntries.push({
                            url: `${baseUrl}/blog/${slug}`,
                            lastmod: updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.8'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching blogs from Strapi:', error);
        }

        // Generate XML sitemap for blogs only
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
        console.error('Error generating blog sitemap:', error);
        return new Response('Error generating blog sitemap', { status: 500 });
    }
}
