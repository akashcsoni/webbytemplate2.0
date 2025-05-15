import ErrorPage from "@/components/common/error/ErrorPage";
import GlobalComponent from "@/components/global/global-component";
import SinglePage from "@/components/SinglePage";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export default async function DynamicPage({ params }) {
    const { pageSlug, itemSlug } = await params;

    try {
        const pageData = await strapiGet(`${pageSlug}/${itemSlug}`, {
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
                    <GlobalComponent data={pageData.data} />;
                </>
            )
        } else if (pageSlug === 'blog') {
            return (
                <>
                    <div>
                        Single Blog Page
                    </div>
                    <GlobalComponent data={pageData.data} />;
                </>
            )
        }
        return <GlobalComponent data={pageData.data} />;
    } catch (error) {
        return <ErrorPage error={error} />;
    }
}

