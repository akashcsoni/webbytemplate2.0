/** @type {import('next').NextConfig} */
const nextConfig = {
  // Redirects configuration
  async redirects() {
    const pairs = [
      { from: "/cityscapes", to: "/category/cityscapes" },
      { from: "/product-displays", to: "/category/product-displays" },
      { from: "/digital-marketing", to: "/category/digital-marketing" },
      {
        from: "/blog/top-wedding-planner-website-templates-free-download",
        to: "/product/kia-weds-wedding-planner-website-html-templates",
      },
      {
        from: "/fashion-themes",
        to: "/product/quickbasket-fashion-ecommerce-store-tailwindcss-template",
      },
      {
        from: "/blog/top-wordpress-themes-for-creating-exceptional-medical-websites",
        to: "/product/medicare-medical-hospital-clinic-html-template",
      },
      { from: "/patterns", to: "/category/patterns" },
      {
        from: "/blog/how-to-choose-the-best-seo-friendly-wordpress-theme",
        to: "/category/seo-plugins",
      },
      {
        from: "/blog/effective-powerpoint-strategies-for-engaging-presentations",
        to: "/category/presentation-templates",
      },
      { from: "/front-end-development", to: "/category/front-end-development" },
      { from: "/videos", to: "/category/videos" },
      {
        from: "/blog/best-portfolio-website-templates-download-free-premium",
        to: "/category/portfolio-themes",
      },
      {
        from: "/blog/sketch-vs-figma-which-ui-design-tool-is-better-in-2023",
        to: "/category/ux-ui-design",
      },
      { from: "/open-cart-extensions", to: "/category/open-cart-extensions" },
      { from: "/ux-ui-design", to: "/category/ux-ui-design" },
      { from: "/food-photos", to: "/category/photos" },
      { from: "/productivity-tools", to: "/category/productivity-tools" },
      { from: "/motion-graphics", to: "/category/motion-graphics" },
      {
        from: "/blog/discover-the-best-woocommerce-dropshipping-plugins-of-2023",
        to: "/category/plugins/woocommerce",
      },
      {
        from: "/product/connect-pinecone-and-woocommerce-integration",
        to: "/product/connect-pinecone-and-woo-commerce-integration-for-smarter-e-commerce",
      },
      {
        from: "/blog/choose-the-perfect-watch-website-template-for-your-watch-business",
        to: "/product/timora-nextjs-watch-website-template",
      },
      { from: "/events", to: "/category/events" },
      { from: "/stock", to: "/category/stock" },
      { from: "/digital-painting", to: "/category/illustrations" },
      {
        from: "/shopify-fashion-themes",
        to: "/product/quickbasket-fashion-ecommerce-store-tailwindcss-template",
      },
      { from: "/vintage", to: "/category/illustrations" },
      { from: "/cms-themes", to: "/category/cms-themes" },
      {
        from: "/blog/headless-cms-website-templates-download-free-premium",
        to: "/product/clare-nextjs-ecommerce-website-template",
      },
      {
        from: "/blog/important-branding-factors-to-growing-your-small-business-in-2023",
        to: "/category/business",
      },
      { from: "/seo-copywriting", to: "/category/content-writing" },
      { from: "/website-templates", to: "/category/website-templates" },
      {
        from: "/product/wt-quick-reorder",
        to: "/category/plugins/woocommerce",
      },
      { from: "/ecommerce-templates", to: "/category/ecommerce-templates" },
      {
        from: "/blog/6-best-woocommerce-dynamic-pricing-plugins-in-2023",
        to: "/product/wt-woocommerce-dynamic-pricing-and-discount",
      },
      {
        from: "/blog/best-insurance-website-templates-free-to-download",
        to: "/product/medicare-medical-hospital-clinic-html-template",
      },
      {
        from: "/blog/simplifying-idex-online-diamond-data-integration-for-jewelry-e-commerce",
        to: "/product/rapnet-diamond-instant-inventory-for-woocommerce-plugin",
      },
      {
        from: "/blog/a-comprehensive-guide-to-wp-store-locator-plugin-for-wordpress",
        to: "/category/plugins/wordpress",
      },
      {
        from: "/blog/best-free-calendar-plugins-for-wordpress-website-in-2023",
        to: "/category/productivity-tools",
      },
      { from: "/fiction", to: "/category/fiction" },
      { from: "/website-optimisation", to: "/category/website-optimisation" },
      { from: "/blog", to: "/category/blog-templates" },
      { from: "/resume-templates", to: "/category/resume-templates" },
      {
        from: "/product/execstep-shoes-website-template",
        to: "/product/quickbasket-fashion-ecommerce-store-tailwindcss-template",
      },
      {
        from: "/product/furnisera-modern-furniture-ecommerce-website-template",
        to: "/product/furnisera-nextjs-furniture-ecommerce-website-template",
      },
      {
        from: "/blog/category/woocommerce",
        to: "/category/woo-commerce-add-ons",
      },
      {
        from: "/blog/explore-best-blog-website-templates-for-bloggers",
        to: "/product/glowist-multipurpose-blog-theme-ghost",
      },
      { from: "/stock-footage", to: "/category/stock-footage" },
      { from: "/nature-photos", to: "/category/photos" },
      {
        from: "/blog/best-bootstrap-calendar-examples",
        to: "/category/productivity-tools",
      },
      { from: "/concept-art", to: "/category/illustrations" },
      { from: "/presentations", to: "/category/presentation-templates" },
      { from: "/genres", to: "/category/genres" },
      {
        from: "/remarketing-strategies",
        to: "/category/remarketing-strategies",
      },
      { from: "/sketch-templates", to: "/category/sketch-templates" },
      { from: "/self-help", to: "/category/self-help" },
      { from: "/blog/category/[slug]", to: "/category/plugins/woocommerce" },
      { from: "/ui-templates", to: "/category/ui-templates" },
      {
        from: "/blog/best-gsap-animation-templates-will-inspire-you",
        to: "/category/motion-graphics",
      },
      {
        from: "/blog/best-fashion-website-templates-create-clothing-website",
        to: "/product/quickbasket-fashion-ecommerce-store-tailwindcss-template",
      },
      {
        from: "/blog/the-advantages-of-using-premium-html-templates",
        to: "/category/html-templates",
      },
      { from: "/e-commerce-solutions", to: "/category/e-commerce-solutions" },
      {
        from: "/blog/yoga-website-templates-premium-and-free-download",
        to: "/category/html-templates/bootstrap",
      },
      {
        from: "/blog/7-best-cookie-consent-plugins-for-gdpr-ccpa",
        to: "/category/plugins",
      },
      { from: "/support", to: "/category/customer-support" },
      { from: "/nextjs", to: "/category/headless-templates/nextjs" },
      { from: "/joomla-extensions", to: "/category/joomla-extensions" },
      { from: "/photos", to: "/category/photos" },
      {
        from: "/blog/best-guide-to-optimizing-robotstxt-in-wordpress-with-real-examples",
        to: "/category/performance-optimization",
      },
      {
        from: "/blog/best-free-wordpress-themes-for-food-blog-website",
        to: "/product/yummy-nextjs-food-and-restaurant-website-template",
      },
      { from: "/marketing-layouts", to: "/category/marketing-layouts" },
      { from: "/print-media", to: "/category/print-media" },
      {
        from: "/blog/top-most-popular-wordpress-themes-for-travel-blogs-in-2023",
        to: "/product/journeya-tours-travel-agency-react-next-js-template",
      },
      { from: "/jamstack-templates", to: "/category/joomla-extensions" },
      { from: "/technical-illustration", to: "/category/illustrations" },
      {
        from: "/blog/the-7-best-bootstrap-templates-for-cryptocurrency-websites",
        to: "/product/orion-construction-react-nextjs-cms-admin-dashboard-template",
      },
      { from: "/drupal-themes", to: "/category/drupal-themes" },
      { from: "/sales-pages", to: "/category/sales-pages" },
      { from: "/web-development", to: "/category/web-development" },
      { from: "/food-themes", to: "/category/food-themes" },
      { from: "/blog-templates", to: "/category/blog-templates" },
      { from: "/magento-themes", to: "/category/magento-themes" },
      { from: "/woo-commerce-add-ons", to: "/category/woo-commerce-add-ons" },
      { from: "/prestashop-themes", to: "/category/prestashop-themes" },
      {
        from: "/blog/fetching-strapi-content-using-rest-vs-graphql-in-nextjs",
        to: "/category/jamstack-templates",
      },
      {
        from: "/blog/best-free-education-website-templates-download",
        to: "/category/education-and-training",
      },
      {
        from: "/blog/where-to-buy-website-templates-in-2023",
        to: "/category/website-templates",
      },
      {
        from: "/blog/explore-the-html-and-its-compelling-benefits",
        to: "/category/html-templates",
      },
      {
        from: "/blog/how-seo-empowers-business-growth-and-amplifies-success",
        to: "/category/seo-and-marketing",
      },
      {
        from: "/blog/top-5-woocommerce-product-filter-plugins-for-maximize-your-e-commerce-potential",
        to: "/product/wt-product-gallery-slider-for-woocommerce",
      },
      {
        from: "/blog/best-6-health-medical-wordpress-themes-2023",
        to: "/product/medicare-medical-hospital-clinic-html-template",
      },
      {
        from: "/blog/top-5-must-have-woocommerce-plugins-to-engage-your-readers",
        to: "/product/wt-woocommerce-dynamic-pricing-and-discount",
      },
      { from: "/product/office-locator", to: "/category/plugins/wordpress" },
      {
        from: "/blog/best-social-media-marketing-agency-website-templates",
        to: "/product/email-marketing-newsletter-bundle-figma-template",
      },
      {
        from: "/blog/best-shoe-store-html-website-templates-free-download",
        to: "/product/quickbasket-fashion-ecommerce-store-tailwindcss-template",
      },
      { from: "/blog/category/photos", to: "/category/photos" },
      {
        from: "/blog/build-your-dream-website-with-our-best-wordpress-templates",
        to: "/product/medicare-medical-hospital-clinic-html-template",
      },
      {
        from: "/blog/6-best-multipurpose-shopify-themes-that-help-you-boost-sales",
        to: "/category/fashion-themes",
      },
      {
        from: "/blog/best-typo3-templates-for-typo3-website-download-free",
        to: "/category/business",
      },
      {
        from: "/blog/best-gardening-and-landscaping-website-templates",
        to: "/category/html-templates/bootstrap",
      },
      {
        from: "/blog/best-auto-repair-shop-website-templates",
        to: "/category/website-templates",
      },
      {
        from: "/blog/best-free-hair-salon-website-templates-free-download",
        to: "/product/leonie-nextjs-beauty-salon-website-template",
      },
      {
        from: "/blog/8-best-nextjs-website-templates-free-and-paid",
        to: "/category/headless-templates/nextjs",
      },
      {
        from: "/blog/romantic-love-website-templates-perfect-designs-to-celebrate-your-love-story",
        to: "/product/kiaweds-wedding-planner-website-template-next-js",
      },
      {
        from: "/blog/thank-you-for-your-purchase-best-email-templates",
        to: "/product/christmas-html-email-template",
      },
      {
        from: "/blog/consulting-website-templates-and-themes-free-download",
        to: "/product/syndicate-consultancy-website-template-nextjs",
      },
      {
        from: "/blog/top-6-free-bootstrap-admin-templates-2023",
        to: "/category/html-templates/bootstrap",
      },
      {
        from: "/blog/bank-website-templates-premium-and-free-to-download",
        to: "/product/urban-bank-fema-template-for-bank-website",
      },
      {
        from: "/blog/best-voice-over-artist-portfolio-website-templates-free-download",
        to: "/product/rihan-anasya-modeline-tailwind-html-template",
      },
      {
        from: "/blog/best-custom-ring-builder-plugin-for-jewelry-woocommerce-stores",
        to: "/product/christmas-html-email-template",
      },
      {
        from: "/blog/responsive-html-email-templates-download-free-premium",
        to: "/blog/html-email-template-design-development",
      },
    ];

    const bulk = pairs.map((p) => ({
      source: p.from,
      destination: p.to,
      permanent: true,
    }));

    return [
      {
        source: "/(.*)",
        has: [
          {
            type: "host",
            value: "webbytemplate.com",
          },
        ],
        destination: "https://www.webbytemplate.com/:path*",
        permanent: true,
      },
      // Blog URL redirects (when blog slugs are changed in Strapi)
      {
        source: "/blog/best-pet-and-animal-website-templates-free-download",
        destination: "/blog/top-pet-care-website-templates",
        permanent: true,
      },
      {
        source: "/blog/best-charity-website-templates-premium-free-download",
        destination: "/blog/charity-template-converts-donations",
        permanent: true,
      },
      {
        source: "/blog/best-fashion-website-templates-create-clothing-website",
        destination: "/blog/best-fashion-website-templates",
        permanent: true,
      },
      {
        source: "/blog/best-tours-and-travel-website-templates-free-download",
        destination: "/blog/best-tours-travel-templates-agencies",
        permanent: true,
      },
      // Product URL redirects (when product slugs are changed in Strapi)
      {
        source: "/product/fashino-responsive-shop-html-email-template",
        destination:
          "/product/quickbasket-fashion-ecommerce-store-tailwindcss-template",
        permanent: true,
      },
      ...bulk,
    ];
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "studio.webbytemplate.com" },
      { protocol: "https", hostname: "webbytemplate-store-com.s3.ap-south-1.amazonaws.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  experimental: {
    optimizePackageImports: ["@heroui/react", "framer-motion", "swiper"],
  },

  compress: true,

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;