require('dotenv').config({ path: '.env.local' });

const axios = require('axios');

const WEAVIATE_URL = 'http://weaviate:8080/v1';

// 从命令行参数获取类名
const className = process.argv[2];

if (!className) {
  console.error('Please provide a class name as an argument.');
  console.error('Usage: node clearWeaviateClass.js <className>');
  process.exit(1);
}

const deleteAllObjects = async (className) => {
  try {
    // 构建 GraphQL 查询来获取所有对象的 ID
    const query = `
    {
      Get {
        ${className} {
          _additional {
            id
          }
        }
      }
    }
    `;

    // 发送 GraphQL 查询
    const response = await axios.post(`${WEAVIATE_URL}/graphql`, { query });

    // 从响应中提取所有对象的 ID
    const objects = response.data.data.Get[className];

    if (!objects || objects.length === 0) {
      console.log(`No objects found in class '${className}'.`);
      return;
    }

    console.log(`Found ${objects.length} objects to delete.`);

    // 逐个删除对象
    for (const obj of objects) {
      const id = obj._additional.id;
      await axios.delete(`${WEAVIATE_URL}/objects/${className}/${id}`);
      console.log(`Deleted object with ID: ${id}`);
    }

    console.log('All objects deleted successfully.');
  } catch (error) {
    console.error('Error deleting objects:', error.response?.data || error.message);
  }
};

const main = async () => {
  console.log(`Starting to delete all objects in class '${className}'...`);
  await deleteAllObjects(className);
  console.log('Deletion process completed.');
};

if (require.main === module) {
  main();
}
