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

const syncToWeaviate = async (data) => {
  try {
    let id;
    if (uuidValidate(data.id)) {
      id = data.id;
    } else {
      id = uuidv5(data.id.toString(), UUID_NAMESPACE);
    }

    const response = await axios.post(WEAVIATE_URL, {
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
    });
    console.log(`Synced tool ${data.name} to Weaviate:`, response.data);
  } catch (error) {
    console.error('Error syncing to Weaviate:', error.response?.data || error.message);
  }
};

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

if (require.main === module) {
  main();
}