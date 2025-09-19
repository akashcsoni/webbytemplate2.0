/** @type {import('next').NextConfig} */
const nextConfig = {
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
    },
};

module.exports = nextConfig;
