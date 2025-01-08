import React from 'react';
import PostDetail from '@/components/PostDetail';
import { Metadata } from 'next';
import axios from 'axios';
import { Navigation } from '@/components/navigation'
import { BottomNavbar } from '@/components/bottom-navbar'

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  const response = await axios.get(`${apiUrl}/posts/${id}`);
  const post = response.data;

  const title = `${post.title} | LLMStock News`;
  const description = post.description || 'Read this article on LLMStock News';
  const imageUrl = post.cover && post.cover.length > 0 
    ? `${apiUrl}${post.cover[0].url}`
    : 'https://llmstock.com/images/default_blog.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

const NewsDetailPage: React.FC<PageProps> = ({ params }) => {
  return (
    <><Navigation
    currentPage=""
    showMobileMenu={false}
  />
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900 dark:text-white">
      <PostDetail postId={params.id} />
    </div>
    <BottomNavbar />
    </>
  );
};

export default NewsDetailPage;
