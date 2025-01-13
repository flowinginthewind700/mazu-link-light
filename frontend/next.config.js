const path = require('path');

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
   async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap.xml',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;