import { strapiGet } from "@/lib/api/strapiClient";
import { Footer } from "./footer"
import { themeConfig } from "@/config/theamConfig";

export async function FooterFooterContainer() {
    try {
        // Fetch both APIs in parallel using strapiGet
        const [menuResponse, settingsResponse] = await Promise.all([
            strapiGet("footer-menu", { params: { populate: "*" }, token: themeConfig.TOKEN }),
            strapiGet("footer-setting", { params: { populate: "*" }, token: themeConfig.TOKEN }),
        ]);

        // Process menu data with validation
        const menuData = Array.isArray(menuResponse?.data?.menu)
            ? menuResponse.data.menu
            : [];

        // Process settings data with validation
        const settingsData = settingsResponse?.data?.[0] || {};

        // Format and validate logo
        const formattedLogo = settingsData.logo || {
            url: "/placeholder.svg?height=40&width=240",
            width: 240,
            height: 40,
        };

        // Format and validate social media
        const formattedSocialMedia = Array.isArray(settingsData.social_media)
            ? settingsData.social_media.map(social => ({
                id: social?.id || Math.random(),
                link: social?.link || "#",
                label: social?.label || "Social Media",
                image: social?.image || null,
                position: social?.position || "0",
            }))
            : [];

        // Format and validate buttons
        const formattedButtons = Array.isArray(settingsData.button)
            ? settingsData.button.map(btn => ({
                id: btn?.id || Math.random(),
                label: btn?.label || "Button",
                link: btn?.link || "#",
                image: btn?.image || null,
            }))
            : [];

        // Create final settings object with formatted data
        const formattedSettings = {
            copyright_label: settingsData.copyright_label || `© ${new Date().getFullYear()} WebbyTemplate.com owned by WebbyCrown Solutions. All rights reserved.`,
            logo: formattedLogo,
            button: formattedButtons,
            social_media: formattedSocialMedia,
        };

        return <Footer footerMenu={menuData} footerSettings={formattedSettings} />;
    } catch (error) {
        // console.error("Error in Footer component:", error);
        // Return empty component in case of error
        // return <Footer footerMenu={[]} footerSettings={{
        //     copyright_label: `© ${new Date().getFullYear()} WebbyTemplate.com owned by WebbyCrown Solutions. All rights reserved.`,
        //     logo: {
        //         url: "/placeholder.svg?height=40&width=240",
        //         width: 240,
        //         height: 40,
        //     },
        //     button: [],
        //     social_media: [],
        // }} />;
        return null
    }
}

