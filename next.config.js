/** @type {import('next').NextConfig} */
const nextConfig = {
    // Only use static export if explicitly set
    ...(process.env.STATIC_EXPORT === 'true' ? {
        output: 'export',
        trailingSlash: true,
        images: {
            unoptimized: true
        }
    } : {
        // Server-side rendering configuration
        images: {
            domains: ['localhost'],
            unoptimized: false
        }
    }),
    allowedDevOrigins: []
}

module.exports = nextConfig
