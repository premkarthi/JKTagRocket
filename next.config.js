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
        // Server-side rendering configuration with standalone output for Docker
        output: 'standalone',
        images: {
            domains: ['localhost'],
            unoptimized: false
        }
    }),
    allowedDevOrigins: []
}

module.exports = nextConfig
