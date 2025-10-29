/** @type {import('next').NextConfig} */
const nextConfig = {
    // Redirects configuration
    async redirects() {
        return [
            {
                source: '/(.*)',
                has: [
                    {
                        type: 'host',
                        value: 'webbytemplate.com',
                    },
                ],
                destination: 'https://www.webbytemplate.com/:path*',
                permanent: true,
            },
            // Blog URL redirects (when blog slugs are changed in Strapi)
            {
                source: '/blog/best-pet-and-animal-website-templates-free-download',
                destination: '/blog/top-pet-care-website-templates',
                permanent: true,
            },
            // Product URL redirects (when product slugs are changed in Strapi)
            {
                source: '/product/fashino-responsive-shop-html-email-template',
                destination: '/product/quickbasket-fashion-ecommerce-store-tailwindcss-template',
                permanent: true,
            }
        ];
    },
    
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'studio.webbytemplate.com',
            },
            {
                protocol: 'https',
                hostname: 'webbytemplate-store-com.s3.ap-south-1.amazonaws.com',
            },
            {
                protocol: 'https',
                hostname: 'flagcdn.com',
            }
        ],
        // Optimize image loading
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    
    // Performance optimizations
    experimental: {
        optimizePackageImports: ['@heroui/react', 'framer-motion', 'swiper'],
    },
    
    // Compress responses
    compress: true,
    
    // Optimize bundle
    webpack: (config, { dev, isServer }) => {
        // Optimize bundle splitting
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                    common: {
                        name: 'common',
                        minChunks: 2,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            };
        }
        
        return config;
    },
};

module.exports = nextConfig;
