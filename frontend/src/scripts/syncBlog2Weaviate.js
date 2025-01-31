require('dotenv').config({ path: '.env.local' });
const { v5: uuidv5, validate: uuidValidate } = require('uuid');
const axios = require('axios');

const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3343';
const STRAPI_API_URL = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;

const WEAVIATE_SERVER = process.env.NEXT_PUBLIC_WEAVIATE_URL;
const WEAVIATE_URL = `${WEAVIATE_SERVER}/v1/objects`;

const WEAVIATE_CLASS_NAME = 'BlogPost';
const POSTS_PER_PAGE = 20;
const EXCLUDED_CATEGORY_IDS = []; // 填入你想要排除的分类 ID

if (!STRAPI_API_URL) {
  console.error('Error: NEXT_PUBLIC_CMS_API_BASE_URL environment variable is not set.');
  process.exit(1);
}

const fetchBlogPostById = async (id) => {
  const query = `
    query($id: ID!) {
      post(id: $id) {
        id
        title
        description
        slug
        date
        content
        category {
          id
          name
          slug
        }
        cover {
          formats
        }
      }
    }
  `;

  try {
    const response = await axios.post(`${STRAPI_API_URL}/graphql`, {
      query,
      variables: { id },
    });
    return response.data.data.post;
  } catch (error) {
    console.error('Error fetching blog post by id:', error.response?.data || error.message);
    return null;
  }
};

const fetchBlogPosts = async (start = 0, limit = POSTS_PER_PAGE) => {
  const query = `
    query($start: Int!, $limit: Int!) {
      posts(
        where: { category: { id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} } }
        start: $start
        limit: $limit
        sort: "date:DESC"
      ) {
        id
        title
        description
        slug
        date
        content
        category {
          id
          name
          slug
        }
        cover {
          formats
        }
      }
      postsConnection(where: { category: { id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} } }) {
        aggregate {
          count
        }
      }
    }
  `;

  try {
    const response = await axios.post(`${STRAPI_API_URL}/graphql`, {
      query,
      variables: { start, limit },
    });
    return {
      posts: response.data.data.posts,
      totalCount: response.data.data.postsConnection.aggregate.count,
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error.response?.data || error.message);
    return { posts: [], totalCount: 0 };
  }
};

const syncToWeaviate = async (post) => {
  try {
    let id = uuidv5(post.id.toString(), UUID_NAMESPACE);

    const payload = {
      class: WEAVIATE_CLASS_NAME,
      properties: {
        strapiId: post.id.toString(),
        title: post.title,
        description: post.description,
        slug: post.slug,
        date: post.date,
        content: post.content,
        category: {
          id: post.category.id,
          name: post.category.name,
          slug: post.category.slug,
        },
        coverUrl: post.cover && post.cover[0]?.formats?.small?.url,
      },
    };

    try {
      await axios.get(`${WEAVIATE_URL}/${WEAVIATE_CLASS_NAME}/${id}`);
      const response = await axios.patch(`${WEAVIATE_URL}/${WEAVIATE_CLASS_NAME}/${id}`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(`Updated blog post ${post.title} in Weaviate:`, response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        const createPayload = { ...payload, id };
        const response = await axios.post(WEAVIATE_URL, createPayload, {
          headers: { 'Content-Type': 'application/json' },
        });
        console.log(`Created new blog post ${post.title} in Weaviate:`, response.data);
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error('Error syncing to Weaviate:', error.response?.data || error.message);
  }
};

const syncSingleBlogPostToWeaviate = async (id) => {
  const post = await fetchBlogPostById(id);
  if (!post) {
    console.error(`Blog post with id ${id} not found.`);
    return;
  }
  await syncToWeaviate(post);
};

const syncAllBlogPostsToWeaviate = async () => {
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const { posts, totalCount } = await fetchBlogPosts(start, POSTS_PER_PAGE);
    if (posts.length === 0) {
      hasMore = false;
      break;
    }

    for (const post of posts) {
      await syncToWeaviate(post);
    }

    start += POSTS_PER_PAGE;
    console.log(`Synced ${start} blog posts so far...`);

    if (start >= totalCount) {
      hasMore = false;
    }
  }
};

const showHelp = () => {
  console.log(`
Usage:
  node syncBlogPostsToWeaviate.js [options]

Options:
  --id <id>       Sync a single blog post by ID
  --all           Sync all blog posts
  --help          Show this help message

Examples:
  Sync a single blog post:
    node syncBlogPostsToWeaviate.js --id 123

  Sync all blog posts:
    node syncBlogPostsToWeaviate.js --all
  `);
};

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
    console.log(`Syncing blog post with id: ${id}`);
    await syncSingleBlogPostToWeaviate(id);
  } else if (args.includes('--all')) {
    console.log('Syncing all blog posts...');
    await syncAllBlogPostsToWeaviate();
  } else {
    console.error('Error: No valid option provided.');
    showHelp();
  }

  console.log('Sync completed!');
};

if (require.main === module) {
  main();
}
