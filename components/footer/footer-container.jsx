import { Footer } from "./footer"

// Fallback data for footer menu
const fallbackMenuData = {
    data: {
        menu: [
            {
                id: 15,
                label: "Products and Partners",
                positioin: null,
                sub_menu: [
                    { id: 95, label: "WordPress Themes", slug: "/wordpress-themes", tag: null },
                    { id: 96, label: "WooCommerce Themes", slug: "/woocommerce-themes", tag: null },
                    { id: 97, label: "HTML5 Templates", slug: "/html5-templates", tag: null },
                    { id: 98, label: "Shopify Themes", slug: "/shopify-themes", tag: null },
                    { id: 99, label: "Zemez", slug: "/zemez", tag: null },
                    { id: 100, label: "MotoCMS", slug: "/moto-cms", tag: null },
                    { id: 101, label: "Weblium", slug: "/weblium", tag: null },
                    { id: 102, label: "MotoPress", slug: "/moto-press", tag: null },
                    { id: 103, label: "MonsterONE", slug: "/monster-1", tag: null },
                    { id: 104, label: "Novi Builder", slug: "/novi-builder", tag: null },
                ],
            },
            {
                id: 16,
                label: "Topics",
                positioin: null,
                sub_menu: [
                    { id: 105, label: "Business & Services", slug: "/business-and-services", tag: null },
                    { id: 106, label: "Fashion & Beauty", slug: "/fashion-and-beauty", tag: null },
                    { id: 107, label: "Home & Family", slug: "/home-and-family", tag: null },
                    { id: 108, label: "Design & Photography", slug: "/design-and-photography", tag: null },
                    { id: 109, label: "Real Estate", slug: "/real-estate", tag: null },
                    { id: 110, label: "Cars & Motorcycles", slug: "/cars-and-motorcycles", tag: null },
                    { id: 111, label: "Medical", slug: "/medical", tag: null },
                    { id: 112, label: "Sports, Outdoors & Travel", slug: "/sports-outdoors-and-travel", tag: null },
                    { id: 113, label: "Food & Restaurant", slug: "/food-and-restaurant", tag: null },
                    { id: 114, label: "Electronics", slug: "/electronics", tag: null },
                ],
            },
            {
                id: 17,
                label: "Company",
                positioin: null,
                sub_menu: [
                    { id: 115, label: "About Us", slug: "/about-us", tag: null },
                    { id: 116, label: "Licenses", slug: "/licenses", tag: null },
                    { id: 117, label: "Blog", slug: "/blog", tag: null },
                    { id: 118, label: "Promocodes", slug: "/promocodes", tag: null },
                    { id: 119, label: "Best Website Hosting", slug: "/best-website-hosting", tag: null },
                    { id: 120, label: "Service Center", slug: "/service-center", tag: null },
                    { id: 121, label: "Partners' Coupon Codes", slug: "/partners-coupon-codes", tag: null },
                    { id: 122, label: "Certification Center", slug: "/certification-center", tag: null },
                    { id: 123, label: "Contact Us", slug: "/contact-us", tag: null },
                    { id: 124, label: "Top Authors", slug: "/top-authors", tag: null },
                ],
            },
            {
                id: 18,
                label: "Earn",
                positioin: null,
                sub_menu: [
                    { id: 125, label: "Become an author", slug: "/become-an-author", tag: null },
                    { id: 126, label: "Affiliate Program", slug: "/affiliate-program", tag: null },
                ],
            },
            {
                id: 19,
                label: "Support",
                positioin: null,
                sub_menu: [
                    { id: 127, label: "Help Center", slug: "/help-center", tag: null },
                    { id: 128, label: "Sitemap", slug: "/sitemap", tag: null },
                    { id: 129, label: "Knowledgebase", slug: "/knowledgebase", tag: null },
                    { id: 130, label: "Refund Policy", slug: "/refund-policy", tag: null },
                    { id: 131, label: "Privacy Policy", slug: "/privacy-policy", tag: null },
                ],
            },
        ],
    },
}

// Fallback data for footer settings
const fallbackSettingsData = {
    data: [
        {
            id: 1,
            copyright_label: "© 2025 WebbyTemplate.com owned by WebbyCrown Solutions. All rights reserved.",
            logo: {
                url: "/placeholder.svg?height=40&width=240",
                width: 240,
                height: 40,
            },
            button: [
                {
                    id: 1,
                    label: "Contact Us",
                    link: "/contact-us",
                    image: null,
                },
                {
                    id: 2,
                    label: "Schedule Meeting",
                    link: "/schedule-meeting",
                    image: null,
                },
            ],
            social_media: [
                {
                    id: 1,
                    link: "https://www.facebook.com/",
                    label: "Facebook",
                    image: null,
                    position: "1",
                },
                {
                    id: 2,
                    link: "https://x.com/",
                    label: "Twitter",
                    image: null,
                    position: "2",
                },
                {
                    id: 3,
                    link: "https://in.pinterest.com/",
                    label: "Pinterest",
                    image: null,
                    position: "3",
                },
                {
                    id: 4,
                    link: "https://www.youtube.com/",
                    label: "YouTube",
                    image: null,
                    position: "4",
                },
                {
                    id: 5,
                    link: "https://www.instagram.com/",
                    label: "Instagram",
                    image: null,
                    position: "5",
                },
                {
                    id: 6,
                    link: "https://www.linkedin.com/",
                    label: "LinkedIn",
                    image: null,
                    position: "6",
                },
            ],
        },
    ],
}

export async function FooterFooterContainer() {
    try {
        // Fetch both APIs in parallel
        const [menuResponse, settingsResponse] = await Promise.all([
            fetch("https://studio.webbytemplate.com/api/footer-menu", {
                next: { revalidate: 3600 }, // Revalidate every hour
            }),
            fetch("https://studio.webbytemplate.com/api/footer-setting", {
                next: { revalidate: 3600 }, // Revalidate every hour
            }),
        ])

        // Process menu response
        let menuData
        if (!menuResponse.ok) {
            console.error("Failed to fetch footer menu data:", menuResponse.statusText)
            menuData = fallbackMenuData.data.menu
        } else {
            const menuJson = await menuResponse.json()
            menuData = menuJson?.data?.menu || fallbackMenuData.data.menu
        }

        // Process settings response
        let settingsData
        if (!settingsResponse.ok) {
            console.error("Failed to fetch footer settings data:", settingsResponse.statusText)
            settingsData = fallbackSettingsData.data[0]
        } else {
            const settingsJson = await settingsResponse.json()
            settingsData = settingsJson?.data?.[0] || fallbackSettingsData.data[0]
        }

        // Prepare the base URL for images
        const baseUrl = "https://studio.webbytemplate.com"

        // Format the logo URL if it exists
        if (settingsData.logo && settingsData.logo.url && !settingsData.logo.url.startsWith("http")) {
            settingsData.logo.url = `${baseUrl}${settingsData.logo.url}`
        }

        // Format social media image URLs
        if (settingsData.social_media) {
            settingsData.social_media = settingsData.social_media.map((social) => {
                if (social.image && !social.image.startsWith("http")) {
                    social.image = `${baseUrl}${social.image}`
                }
                return social
            })
        }

        // Format button image URLs
        if (settingsData.button) {
            settingsData.button = settingsData.button.map((btn) => {
                if (btn.image && !btn.image.startsWith("http")) {
                    btn.image = `${baseUrl}${btn.image}`
                }
                return btn
            })
        }

        return <Footer footerMenu={menuData} footerSettings={settingsData} />
    } catch (error) {
        console.error("Error in Footer component:", error)
        // Return the client component with fallback data
        return <Footer footerMenu={fallbackMenuData.data.menu} footerSettings={fallbackSettingsData.data[0]} />
    }
}

