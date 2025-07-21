import GlobalComponent from "@/components/global/global-component";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export const dynamic = 'force-dynamic'; // SSR on every request

export default async function HomePage() {
  let pageData = null;

  try {
    pageData = await strapiGet("pages/home", {
      params: { populate: "*" },
      token: themeConfig.TOKEN,
    });

    if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
      throw new Error("Page data is empty");
    }

    return <GlobalComponent data={pageData.data} />;
  } catch (error) {
    return (
      <SomethingWrong message={error?.message} />
    )
  }
}
