/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true, // optional, for static site compatibility
    images: {
        unoptimized: true
    },
    allowedDevOrigins: []
}

module.exports = nextConfig
