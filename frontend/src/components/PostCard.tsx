// src/components/PostCard.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  linkPrefix: string;
}

const PostCard: React.FC<PostCardProps> = ({ post, linkPrefix }) => {
  const coverUrl = post.cover && post.cover.length > 0
    ? `${process.env.NEXT_PUBLIC_CMS_API_BASE_URL}${post.cover[0].url}`
    : '/images/defaultcover.jpg';

  const avatarUrl = post.author?.avatar?.url
    ? `${process.env.NEXT_PUBLIC_CMS_API_BASE_URL}${post.author.avatar.url}`
    : '/images/defaultavatar.jpg';

  return (
    <Link href={`${linkPrefix}/${post.id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden transition-transform transform hover:translate-y-[-10px] hover:shadow-lg h-full flex flex-col">
        <div className="h-48 overflow-hidden">
          <img
            src={coverUrl}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white line-clamp-2">{post.title}</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">{post.description}</p>
          <div className="flex items-center mt-auto">
            {post.author && (
              <>
                <img
                  src={avatarUrl}
                  alt={post.author.name}
                  className="w-6 h-6 rounded-full mr-2"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">{post.author.name}</p>
              </>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 ml-auto">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
