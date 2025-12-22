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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://*.vercel.app chrome-extension://*",
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
