import GlobalComponent from "@/components/global/global-component";
import SinglePage from "@/components/SinglePage";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export default async function DynamicPage({ params }) {
    const { pageSlug, itemSlug } = await params;

    try {
        let endpoint = `${pageSlug}/${itemSlug}`;

        // If the page is a category page, get custom endpoint from themeConfig
        if (pageSlug === 'category') {
            const categoryBasePath = themeConfig.CATEGORY_API_ROUTE || 'category'; // fallback if not defined
            endpoint = `${categoryBasePath}/${itemSlug}`;
        }

        const pageData = await strapiGet(endpoint, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });
        
        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            throw new Error("Page data is empty");
        }

        if (pageSlug === 'product') {
            return (
                <>
                    <SinglePage pageData={pageData.data} />
                    <GlobalComponent data={pageData.data} />
                </>
            );
        } else if (pageSlug === 'blog') {
            return (
                <>
                    <GlobalComponent data={pageData.data} />
                </>
            );
        } else if (pageSlug === 'category') {
            return (
                <>
                    <GlobalComponent data={pageData.data} />
                </>
            );
        }
        return <GlobalComponent data={pageData.data} />;
    } catch (error) {
        return <SomethingWrong error={error} />;
    }
}
