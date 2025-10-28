import { strapiGet } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();

        // Initialize page entries
        const pageEntries = [];

        // Add home page only
        pageEntries.push({
            url: `${baseUrl}`,
            lastmod: currentDate,
            changefreq: 'daily',
            priority: '1.0'
        });

        // Fetch dynamic pages from Strapi
        try {
            // Try different endpoints to find the correct one
            const endpoints = [
                'pages',
                'pages?populate=*',
                'pages?pagination[limit]=1000&populate=*'
            ];
            
            let pagesData = null;
            let workingEndpoint = null;
            
            for (const endpoint of endpoints) {
                try {
                    pagesData = await strapiGet(endpoint, {
                        params: {
                            populate: '*',
                            pagination: { limit: 1000 }
                        },
                        token: themeConfig.TOKEN,
                    });
                    
                    if (pagesData && (pagesData.data || pagesData.result)) {
                        workingEndpoint = endpoint;
                        break;
                    }
                } catch (err) {
                    // Continue to next endpoint
                }
            }
            
            if (pagesData) {
                // Handle different response structures
                let pages = [];
                
                if (pagesData.data && Array.isArray(pagesData.data)) {
                    pages = pagesData.data;
                } else if (pagesData.result && Array.isArray(pagesData.result)) {
                    pages = pagesData.result;
                } else if (Array.isArray(pagesData)) {
                    pages = pagesData;
                }
                
                pages.forEach(page => {
                    // Handle different page structures
                    let slug = null;
                    let updatedAt = null;
                    
                    if (page.attributes && page.attributes.slug) {
                        slug = page.attributes.slug;
                        updatedAt = page.attributes.updatedAt;
                    } else if (page.slug) {
                        slug = page.slug;
                        updatedAt = page.updatedAt;
                    }
                    
                    if (slug && slug !== 'home') {
                        pageEntries.push({
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


        // Generate XML page list
        const pageListXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pageEntries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

        return new Response(pageListXml, {
            status: 200,
            headers: {
                'Content-Type': 'application/xml',
                'X-Robots-Tag': 'noindex, follow', // Prevent indexing of sitemap XML files
                'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Error generating page list:', error);
        return new Response('Error generating page list', { status: 500 });
    }
}
