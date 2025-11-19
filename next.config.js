/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'randomuser.me',
      'raw.githubusercontent.com'
    ],
  },
}

module.exports = nextConfig
