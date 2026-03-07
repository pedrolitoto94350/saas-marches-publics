/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Important pour Cloudflare Pages
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig