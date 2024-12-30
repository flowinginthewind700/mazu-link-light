// src/app/news/[id]/page.tsx
import React from 'react';
import PostDetail from '@/components/PostDetail';

interface PageProps {
  params: {
    id: string;
  };
}

const NewsDetailPage: React.FC<PageProps> = ({ params }) => {
  return (
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <PostDetail postId={params.id} />
    </div>
  );
};

export default NewsDetailPage;
