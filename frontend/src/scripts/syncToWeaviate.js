const axios = require('axios');

// Weaviate 配置
const WEAVIATE_URL = 'http://weaviate:8080/v1/objects';
const WEAVIATE_CLASS_NAME = 'Agitool'; // Weaviate 中的类名

// Strapi GraphQL API 配置
const STRAPI_API_URL = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;

// 分页获取 agitool 数据
const fetchAgitools = async (limit = 20, start = 0) => {
  const query = `
    query($limit: Int!, $start: Int!) {
      agitools(limit: $limit, start: $start) {
        id
        name
        Description
        content
      }
    }
  `;

  try {
    const response = await axios.post(`${STRAPI_API_URL}/graphql`, {
      query,
      variables: { limit, start },
    });
    return response.data.data.agitools;
  } catch (error) {
    console.error('Error fetching agitools:', error);
    return [];
  }
};

// 同步数据到 Weaviate
const syncToWeaviate = async (data) => {
  try {
    const response = await axios.post(WEAVIATE_URL, {
      class: WEAVIATE_CLASS_NAME,
      properties: {
        id: data.id,
        name: data.name,
        description: data.Description,
        content: data.content,
      },
    });
    console.log(`Synced tool ${data.name} to Weaviate:`, response.data);
  } catch (error) {
    console.error('Error syncing to Weaviate:', error);
  }
};

// 主函数：分页同步数据
const main = async () => {
  let start = 0;
  const limit = 20;
  let hasMore = true;

  while (hasMore) {
    const agitools = await fetchAgitools(limit, start);
    if (agitools.length === 0) {
      hasMore = false;
      break;
    }

    for (const tool of agitools) {
      await syncToWeaviate(tool);
    }

    start += limit;
    console.log(`Synced ${start} tools so far...`);
  }

  console.log('Sync completed!');
};

// 手动调用
if (require.main === module) {
  main();
}