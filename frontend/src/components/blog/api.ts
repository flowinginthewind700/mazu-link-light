// lib/api.ts

import axios from 'axios';
import { Category, BlogPost, BlogPostsResponse } from '@/components/blog/types'';

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL || '';
const EXCLUDED_CATEGORY_IDS = ["1", "4"];

export const fetchCategories = async (): Promise<Category[]> => {
  const query = `
    query {
      categories(where: { id_nin: ${JSON.stringify(EXCLUDED_CATEGORY_IDS)} }) {
        id
        name
        slug
      }
    }
  `;

  try {
    const response = await axios.post(`${apiUrl}/graphql`, { query });
    const fetchedCategories: Category[] = response.data.data.categories;
    return [{ id: 'all', name: 'All', slug: 'all' }, ...fetchedCategories];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchBlogPosts = async (
  selectedCategory: string,
  currentPage: number,
  postsPerPage: number,
  excludedCategoryIds: string[]
): Promise<BlogPostsResponse> => {
  let query: string;
  let variables: Record<string, any>;

  if (selectedCategory === 'all') {
    query = `
      query($start: Int!, $limit: Int!) {
        posts(
          where: { category: { id_nin: ${JSON.stringify(excludedCategoryIds)} } }
          start: $start
          limit: $limit
          sort: "date:DESC"
        ) {
          id
          title
          description
          slug
          date
          category {
            id
            name
            slug
          }
          cover {
            formats
          }
        }
        postsConnection(where: { category: { id_nin: ${JSON.stringify(excludedCategoryIds)} } }) {
          aggregate {
            count
          }
        }
      }
    `;
    variables = {
      start: (currentPage - 1) * postsPerPage,
      limit: postsPerPage,
    };
  } else {
    query = `
      query($start: Int!, $limit: Int!, $categoryId: ID!) {
        posts(
          where: { category: { id: $categoryId, id_nin: ${JSON.stringify(excludedCategoryIds)} } }
          start: $start
          limit: $limit
          sort: "date:DESC"
        ) {
          id
          title
          description
          slug
          date
          category {
            id
            name
            slug
          }
          cover {
            formats
          }
        }
        postsConnection(where: { category: { id: $categoryId, id_nin: ${JSON.stringify(excludedCategoryIds)} } }) {
          aggregate {
            count
          }
        }
      }
    `;
    variables = {
      start: (currentPage - 1) * postsPerPage,
      limit: postsPerPage,
      categoryId: selectedCategory,
    };
  }

  try {
    const response = await axios.post(`${apiUrl}/graphql`, { query, variables });
    const fetchedPosts: BlogPost[] = response.data.data.posts;
    const totalCount = response.data.data.postsConnection.aggregate.count;
    return { posts: fetchedPosts, totalCount };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], totalCount: 0 };
  }
};

// You can add a search function here if you're implementing search functionality
export const searchBlogPosts = async (query: string): Promise<BlogPost[]> => {
  // Implement your search logic here
  // This could involve making a request to your Weaviate instance
  // For now, we'll return an empty array
  return [];
};
