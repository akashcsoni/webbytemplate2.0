import ErrorPage from "@/components/common/error/ErrorPage";
import GlobalComponent from "@/components/global/global-component";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export default async function DynamicPage({ params }) {
    const { pageSlug } = await params;

    try {
        const pageData = await strapiGet(`pages/${pageSlug}`, {
            params: { populate: "*" },
            token: themeConfig.TOKEN,
        });

        if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
            throw new Error("Page data is empty");
        }

        return <GlobalComponent data={pageData.data} />;
    } catch (error) {
        return <ErrorPage error={error} />;
    }
}
