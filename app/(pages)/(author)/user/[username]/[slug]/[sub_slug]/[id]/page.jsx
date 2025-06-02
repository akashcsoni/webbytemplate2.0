import ErrorPage from "@/components/common/error/ErrorPage";
import GlobalComponent from "@/components/global/global-component";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";
import { Suspense } from "react";
import Loading from "../../../../loading";

export default async function DynamicPage({ params }) {
  const { slug, sub_slug } = await params;

  try {
    const pageData = await strapiGet(`customers/${slug}-${sub_slug}`, {
      params: { populate: "*" },
      token: themeConfig.TOKEN,
    });

    if (
      !pageData ||
      !pageData.data ||
      Object.keys(pageData.data).length === 0
    ) {
      throw new Error("Page data is empty");
    }

    return (
      <Suspense fallback={<Loading />}>
        <GlobalComponent data={pageData.data} params={params}/>
      </Suspense>
    );
  } catch (error) {
    return <ErrorPage error={error} />;
  }
}
