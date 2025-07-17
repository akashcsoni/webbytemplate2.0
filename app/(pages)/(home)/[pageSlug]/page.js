import GlobalComponent from "@/components/global/global-component";
import PageNotFound from "@/components/PageNotFound/PageNotFound";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

export default async function DynamicPage({ params }) {
    const { pageSlug } = await params;

    try {
        const pageData = await strapiGet(`pages/${pageSlug}`, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        if (!pageData.result) {
            return <SomethingWrong />;
        }
        
        if (!pageData.result && pageData.status === 404) {
            return <PageNotFound />;
        }

        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            return <SomethingWrong />;
        }

        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            return <PageNotFound />;
        }
        return <GlobalComponent data={pageData.data} />;
    } catch (error) {
        return <SomethingWrong />;
    }
}
