require('dotenv').config({ path: '.env.local' }); // 加载 .env.local 文件
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// 从环境变量中读取配置
const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL; // CMS API 地址
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // 你的域名
const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml'); // 输出文件路径

// 检查环境变量是否配置正确
if (!apiUrl || !baseUrl) {
  console.error('Error: Please check your .env.local file. NEXT_PUBLIC_CMS_API_BASE_URL and NEXT_PUBLIC_BASE_URL are required.');
  process.exit(1);
}

// 获取所有 AI 图片
async function fetchAllAIImages() {
  const allImages = [];
  let hasMore = true;
  let start = 0;
  const limit = 100; // 每次查询的数量

  while (hasMore) {
    try {
      const query = `
        query($start: Int!, $limit: Int!) {
          t2Iexamples(start: $start, limit: $limit, sort: "id:DESC") {
            id
          }
        }
      `;
      const response = await axios.post(apiUrl + '/graphql', {
        query,
        variables: { start, limit },
      });

      const images = response.data.data.t2Iexamples;
      allImages.push(...images);

      if (images.length < limit) {
        hasMore = false;
      } else {
        start += limit;
      }
    } catch (error) {
      console.error('Error fetching AI images:', error);
      hasMore = false;
    }
  }

  return allImages;
}

// 获取所有博客文章
async function fetchAllBlogPosts() {
  const allPosts = [];
  let hasMore = true;
  let start = 0;
  const limit = 100; // 每次查询的数量

  while (hasMore) {
    try {
      const query = `
        query($start: Int!, $limit: Int!) {
          posts(start: $start, limit: $limit, sort: "date:DESC") {
            id
            slug
            date
          }
        }
      `;
      const response = await axios.post(apiUrl + '/graphql', {
        query,
        variables: { start, limit },
      });

      const posts = response.data.data.posts;
      allPosts.push(...posts);

      if (posts.length < limit) {
        hasMore = false;
      } else {
        start += limit;
      }
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      hasMore = false;
    }
  }

  return allPosts;
}

// 获取所有 Agitools
async function fetchAllAgitools() {
  const allTools = [];
  let hasMore = true;
  let start = 0;
  const limit = 100; // 每次查询的数量

  while (hasMore) {
    try {
      const query = `
        query($start: Int!, $limit: Int!) {
          agitools(start: $start, limit: $limit) {
            id
          }
        }
      `;
      const response = await axios.post(apiUrl + '/graphql', {
        query,
        variables: { start, limit },
      });

      const tools = response.data.data.agitools;
      allTools.push(...tools);

      if (tools.length < limit) {
        hasMore = false;
      } else {
        start += limit;
      }
    } catch (error) {
      console.error('Error fetching agitools:', error);
      hasMore = false;
    }
  }

  return allTools;
}

// 生成站点地图
async function generateSitemap() {
  // 静态页面
  const staticPages = [
    '',
    '/blog',
    '/tools',
    '/ai-image',
    '/about',
    '/privacy',
    '/terms',
    '/tools/image-compression',
    '/tools/favicon-downloader',
  ];

  const staticUrls = staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastmod: new Date().toISOString(),
    changefreq: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? '1.0' : '0.8',
  }));

  // 动态页面
  const aiImages = await fetchAllAIImages();
  const aiImageUrls = aiImages.map((image) => ({
    url: `${baseUrl}/ai-image/${image.id}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: '0.5',
  }));

  const blogPosts = await fetchAllBlogPosts();
  const blogUrls = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastmod: new Date(post.date).toISOString(),
    changefreq: 'monthly',
    priority: '0.6',
  }));

  const agitools = await fetchAllAgitools();
  const agitoolUrls = agitools.map((tool) => ({
    url: `${baseUrl}/agitool/${tool.id}`,
    lastmod: new Date().toISOString(),
    changefreq: 'monthly',
    priority: '0.7',
  }));

  // 合并所有 URL
  const allUrls = [...staticUrls, ...aiImageUrls, ...blogUrls, ...agitoolUrls];

  // 生成 XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      ({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('')}
</urlset>`;

  // 写入文件
  fs.writeFileSync(outputPath, sitemap);
  console.log(`Sitemap generated at ${outputPath}`);
}

// 运行脚本
generateSitemap().catch(console.error);