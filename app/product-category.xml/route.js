import { strapiGet } from '@/lib/api/strapiClient';
import { themeConfig } from '@/config/theamConfig';

export async function GET() {
    try {
        const baseUrl = themeConfig.SITE_URL;
        const currentDate = new Date().toISOString();
        
        // Initialize sitemap entries for product categories only
        const sitemapEntries = [];
        
        // Fetch product categories from Strapi using the specific endpoint
        try {
            const categoriesData = await strapiGet('categories?filters[parent_category][id][$null]=true&populate=sub_categories&pagination[page]=1&pagination[pageSize]=1000', {
                token: themeConfig.TOKEN,
            });

            if (categoriesData && categoriesData.data) {
                categoriesData.data.forEach(category => {
                    const slug = category.slug;
                    const updatedAt = category.updatedAt;
                    
                    if (slug) {
                        // Add main category
                        sitemapEntries.push({
                            url: `${baseUrl}/category/${slug}`,
                            lastmod: updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: '0.8'
                        });

                        // Add sub-categories with hierarchical URLs
                        if (category.sub_categories && Array.isArray(category.sub_categories)) {
                            category.sub_categories.forEach(subCategory => {
                                const subSlug = subCategory.slug;
                                const subUpdatedAt = subCategory.updatedAt;
                                
                                if (subSlug) {
                                    // Create hierarchical URL: /category/parent/sub-category
                                    sitemapEntries.push({
                                        url: `${baseUrl}/category/${slug}/${subSlug}`,
                                        lastmod: subUpdatedAt || currentDate,
                                        changefreq: 'weekly',
                                        priority: '0.7'
                                    });
                                }
                            });
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching product categories from Strapi:', error);
        }

        // Generate XML sitemap for product categories only
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
        console.error('Error generating product category sitemap:', error);
        return new Response('Error generating product category sitemap', { status: 500 });
    }
}
