import ErrorPage from "@/components/common/error/ErrorPage";
import GlobalComponent from "@/components/global/global-component";
import { themeConfig } from "@/config/theamConfig";
import { strapiGet } from "@/lib/api/strapiClient";

export default async function HomePage() {
  try {
    // Pass the token to the strapiGet function
    const pageData = await strapiGet("pages/home", {
      params: { populate: "*" },
      token : themeConfig.TOKEN, // Passing token here
    });

    if (!pageData || !pageData.data || Object.keys(pageData.data).length === 0) {
      throw new Error("Page data is empty");
    }

    return <GlobalComponent data={pageData.data} />;
  } catch (error) {
    return <ErrorPage error={error} />; // Show dynamic error
  }
}
