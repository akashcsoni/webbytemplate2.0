
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
            const categoriesData = await strapiGet('categories?filters[no_index][$eq]=false&pagination[page]=1&pagination[pageSize]=1000&populate[parent_category][populate]=*', {
                token: themeConfig.TOKEN,
            });
            
            if (categoriesData && categoriesData.data) {
                categoriesData.data.forEach(category => {
                    const categoryAttributes = category.attributes || category;
                    const slug = categoryAttributes.slug || category.slug;
                    const updatedAt = categoryAttributes.updatedAt || category.updatedAt;
                    
                    // Get parent category from ARRAY (parent_category is an array, not object!)
                    let parentSlug = null;
                    
                    // Check if parent_category array exists and has at least one item
                    if (categoryAttributes.parent_category && 
                        Array.isArray(categoryAttributes.parent_category) && 
                        categoryAttributes.parent_category.length > 0) {
                        
                        const parentCategory = categoryAttributes.parent_category[0];
                        parentSlug = parentCategory.slug;
                    }
                    
                    if (slug) {
                        let categoryUrl;
                        
                        // Create URL based on whether parent exists
                        if (parentSlug) {
                            // Has parent: /category/parent-slug/category-slug/
                            categoryUrl = `${baseUrl}/category/${parentSlug}/${slug}/`;
                        } else {
                            // No parent: /category/category-slug/
                            categoryUrl = `${baseUrl}/category/${slug}/`;
                        }
                        
                        sitemapEntries.push({
                            url: categoryUrl,
                            lastmod: updatedAt || currentDate,
                            changefreq: 'weekly',
                            priority: parentSlug ? '0.7' : '0.8'
                        });
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
                'X-Robots-Tag': 'noindex, follow',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600',
            },
        });
    } catch (error) {
        console.error('Error generating product category sitemap:', error);
        return new Response('Error generating product category sitemap', { status: 500 });
    }
}