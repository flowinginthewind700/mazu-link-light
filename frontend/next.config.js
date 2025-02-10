const path = require('path');

const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com https://partner.googleadservices.com https://tpc.googlesyndication.com https://www.googletagservices.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: http:;
  font-src 'self' https://fonts.gstatic.com;
  frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com;
  frame-ancestors 'self' https://www.google.com;
  connect-src 'self' https://pagead2.googlesyndication.com https://cms.llmstock.com https://llmstock.com;
`.replace(/\s{2,}/g, ' ').trim();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname, './src');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sdimage-1253436389.cos.ap-nanjing.myqcloud.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cms.llmstock.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(sitemap.xml|ads.txt|robots.txt)',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/plain',
          },
        ],
      },
      {
        // 应用 CSP 到所有页面
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy,
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
