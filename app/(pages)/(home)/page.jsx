import GlobalComponent from "@/components/global/global-component";
import SomethingWrong from "@/components/somethingWrong/page";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export const dynamic = 'force-dynamic'; // Force no caching, SSR on every request

export default async function HomePage() {
  try {
    // Pass the token to the strapiGet function
    const pageData = await strapiGet("pages/home", {
      params: { populate: "*" },
      token: themeConfig.TOKEN, // Passing token here
    });

    if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
      throw new Error("Page data is empty");
    }

    return <GlobalComponent data={pageData.data} />;
  } catch (error) {
    return <SomethingWrong error={error} />; // Show dynamic error
  }
}
