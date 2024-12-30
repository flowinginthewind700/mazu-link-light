// components/PostsList.tsx
"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from './PostCard';
import { Post } from '../types';

interface PostsListProps {
  category?: string;
  linkPrefix: string;
}

const PostsList: React.FC<PostsListProps> = ({ category, linkPrefix }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const postsPerPage = 9;

  useEffect(() => {
    console.log('Effect triggered. Page:', page, 'Category:', category);
    fetchPosts();
  }, [page, category]);

  const fetchPosts = async () => {
    try {
        const start = (page - 1) * postsPerPage;
        const categoryFilter = category && category !== 'all' ? `&category.name=${category}` : '';
        const url = `${process.env.NEXT_PUBLIC_CMS_API_BASE_URL}/posts?_limit=${postsPerPage}&_start=${start}${categoryFilter}&_sort=id:DESC`;
        
        console.log('Fetching posts from URL:', url);
    
        const response = await axios.get(url);
        
        console.log('API Response:', response.data);
    
        setPosts(response.data);
        // 由于 Strapi v3 不返回分页元数据，我们需要根据返回的数据长度来判断是否还有更多数据
        setHasMore(response.data.length === postsPerPage);
    
        console.log('Posts set:', response.data);
        console.log('Has more:', response.data.length === postsPerPage);
      } catch (error) {
        console.error('Error fetching posts:', error);
        if (axios.isAxiosError(error)) {
          console.error('Error response:', error.response?.data);
          console.error('Error request:', error.request);
        }
      }
  };

  const loadNextPage = () => {
    if (hasMore) {
      console.log('Loading next page');
      setPage(prevPage => prevPage + 1);
    }
  };

  const loadPreviousPage = () => {
    if (page > 1) {
      console.log('Loading previous page');
      setPage(prevPage => prevPage - 1);
    }
  };

  console.log('Rendering PostsList. Posts:', posts);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map(post => (
          <PostCard key={post.id} post={post} linkPrefix={linkPrefix} />
        ))}
      </div>
      <div className="flex justify-center space-x-4">
        <button
          onClick={loadPreviousPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md">
          {page}
        </span>
        <button
          onClick={loadNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          disabled={!hasMore}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PostsList;
