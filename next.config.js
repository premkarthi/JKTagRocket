/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',
    trailingSlash: true, // optional, for static site compatibility
    images: {
        unoptimized: true
    },
    allowedDevOrigins: ['jktagrocket.onrender.com']
}

module.exports = nextConfig
