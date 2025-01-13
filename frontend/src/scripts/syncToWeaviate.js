require('dotenv').config({ path: '.env.local' });
const { v5: uuidv5, validate: uuidValidate } = require('uuid');

const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3343';

const axios = require('axios');

const STRAPI_API_URL = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;

if (!STRAPI_API_URL) {
  console.error('Error: NEXT_PUBLIC_CMS_API_BASE_URL environment variable is not set.');
  process.exit(1);
}

const WEAVIATE_URL = 'http://weaviate:8080/v1/objects';
const WEAVIATE_CLASS_NAME = 'Agitool';

// 根据 id 获取单条 Agitool
const fetchAgitoolById = async (id) => {
  const query = `
    query($id: ID!) {
      agitool(id: $id) {
        id
        name
        Description
        price
        accessLink
        internalPath
        author {
          name
          avatar
          twitter
        }
        submissionDate
        content
        screenshot {
          url
        }
        imagelarge {
          url
        }
        iconimage {
          url
        }
        agitooltags {
          id
          tagname
        }
      }
    }
  `;

  try {
    const response = await axios.post(`${STRAPI_API_URL}/graphql`, {
      query,
      variables: { id },
    });
    return response.data.data.agitool;
  } catch (error) {
    console.error('Error fetching agitool by id:', error.response?.data || error.message);
    return null;
  }
};

// 获取所有 Agitool
const fetchAgitools = async (limit = 20, start = 0) => {
  const query = `
    query($limit: Int!, $start: Int!) {
      agitools(limit: $limit, start: $start) {
        id
        name
        Description
        price
        accessLink
        internalPath
        author {
          name
          avatar
          twitter
        }
        submissionDate
        content
        screenshot {
          url
        }
        imagelarge {
          url
        }
        iconimage {
          url
        }
        agitooltags {
          id
          tagname
        }
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
    console.error('Error fetching agitools:', error.response?.data || error.message);
    return [];
  }
};

// 同步单条 Agitool 到 Weaviate
const syncSingleAgitoolToWeaviate = async (id) => {
  const agitool = await fetchAgitoolById(id);
  if (!agitool) {
    console.error(`Agitool with id ${id} not found.`);
    return;
  }

  await syncToWeaviate(agitool);
};

// 同步所有 Agitool 到 Weaviate
const syncAllAgitoolsToWeaviate = async () => {
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
};

// 检查对象是否存在
const checkObjectExists = async (id) => {
  try {
    const response = await axios.get(`${WEAVIATE_URL}/${WEAVIATE_CLASS_NAME}/${id}`);
    return response.status === 200;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

// 同步 Agitool 到 Weaviate
const syncToWeaviate = async (data) => {
  try {
    let id;
    if (uuidValidate(data.id)) {
      id = data.id;
    } else {
      id = uuidv5(data.id.toString(), UUID_NAMESPACE);
    }

    const objectExists = await checkObjectExists(id);

    const payload = {
      class: WEAVIATE_CLASS_NAME,
      id: id,
      properties: {
        strapiId: data.id.toString(), // 保存 Strapi 的 id 作为一个字符串
        name: data.name,
        description: data.Description,
        price: data.price,
        accessLink: data.accessLink,
        internalPath: data.internalPath,
        author: data.author ? {
          name: data.author.name,
          avatar: data.author.avatar,
          twitter: data.author.twitter
        } : null,
        submissionDate: data.submissionDate,
        content: data.content,
        screenshotUrl: data.screenshot ? data.screenshot.url : null,
        imageLargeUrl: data.imagelarge ? data.imagelarge.url : null,
        iconimageUrl: data.iconimage ? data.iconimage.url : null, // 新增 iconimage 字段
        tags: data.agitooltags ? data.agitooltags.map(tag => tag.tagname) : []
      },
    };

    let response;
    if (objectExists) {
      // 如果对象存在，使用 PUT 更新
      response = await axios.put(`${WEAVIATE_URL}/${WEAVIATE_CLASS_NAME}/${id}`, payload);
      console.log(`Updated tool ${data.name} in Weaviate:`, response.data);
    } else {
      // 如果对象不存在，使用 POST 创建
      response = await axios.post(`${WEAVIATE_URL}/${WEAVIATE_CLASS_NAME}`, payload);
      console.log(`Created tool ${data.name} in Weaviate:`, response.data);
    }
  } catch (error) {
    console.error('Error syncing to Weaviate:', error.response?.data || error.message);
  }
};

// 显示帮助信息
const showHelp = () => {
  console.log(`
Usage:
  node syncToWeaviate.js [options]

Options:
  --id <id>       Sync a single Agitool by ID
  --all           Sync all Agitools
  --help          Show this help message

Examples:
  Sync a single Agitool:
    node syncToWeaviate.js --id 123

  Sync all Agitools:
    node syncToWeaviate.js --all
  `);
};

// 主函数
const main = async () => {
  const args = process.argv.slice(2);

  if (args.includes('--help')) {
    showHelp();
    return;
  }

  if (args.includes('--id')) {
    const idIndex = args.indexOf('--id') + 1;
    if (idIndex >= args.length) {
      console.error('Error: --id requires a value.');
      showHelp();
      return;
    }
    const id = args[idIndex];
    console.log(`Syncing Agitool with id: ${id}`);
    await syncSingleAgitoolToWeaviate(id);
  } else if (args.includes('--all')) {
    console.log('Syncing all Agitools...');
    await syncAllAgitoolsToWeaviate();
  } else {
    console.error('Error: No valid option provided.');
    showHelp();
  }

  console.log('Sync completed!');
};

if (require.main === module) {
  main();
}