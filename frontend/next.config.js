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
          hostname: 'scnet-vfs-waswac.org.cn',
         port: '2337',
         pathname: '/**',
       },
     ],
   }
};

module.exports = nextConfig;