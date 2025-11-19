/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'randomuser.me',
      'eubiosis.pro'
    ],
    unoptimized: false,
  },
  // Ensure static assets work properly with custom domains
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  trailingSlash: false,
}

module.exports = nextConfig
