"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import * as Dialog from '@radix-ui/react-dialog';
import { X, Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';

// Sub-components
import { BilibiliEmbed, YouTubeEmbed, VideoEmbed } from './EmbedComponents';
import { CodeRenderer, BlockNode } from './MarkdownComponents';
import AuthorInfo from './AuthorInfo';

interface Post {
  cover: { url: string }[];
  title: string;
  description: string;
  content: string;
  created_at: string;
  author?: {
    name: string;
    avatar?: { url: string };
    twitter?: string;
  };
}

const ImageZoomDialog: React.FC<{ isOpen: boolean; onClose: () => void; imageUrl: string }> = ({ isOpen, onClose, imageUrl }) => {
  const [dialogSize, setDialogSize] = useState({ width: 'auto', height: 'auto' });

  useEffect(() => {
    if (isOpen && imageUrl) {
      const img = document.createElement('img');
      img.src = imageUrl;
      img.onload = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const imgWidth = img.naturalWidth;
        const imgHeight = img.naturalHeight;

        let width, height;

        if (imgWidth > screenWidth || imgHeight > screenHeight) {
          const widthRatio = screenWidth / imgWidth;
          const heightRatio = screenHeight / imgHeight;
          const ratio = Math.min(widthRatio, heightRatio) * 0.9; // 90% of the screen
          width = Math.round(imgWidth * ratio);
          height = Math.round(imgHeight * ratio);
        } else {
          width = imgWidth;
          height = imgHeight;
        }

        setDialogSize({ 
          width: `${width}px`, 
          height: `${height}px` 
        });
      };
    }
  }, [isOpen, imageUrl]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/75 z-[100]" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] z-[101] flex items-center justify-center p-4"
          style={{ width: dialogSize.width, height: dialogSize.height }}
        >
          <TransformWrapper>
            <TransformComponent>
              <img src={imageUrl} alt="Zoomed image" className="w-full h-full object-contain rounded-lg shadow-xl" />
            </TransformComponent>
          </TransformWrapper>
          <Dialog.Close asChild>
            <button
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

const PostDetail: React.FC<{ postId: string }> = ({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL as string;

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const response = await axios.get(`${apiUrl}/posts/${postId}`);
          setPost(response.data);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      }
    };

    fetchPost();
  }, [postId, apiUrl]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleImageClick = (imageUrl: string) => {
    setZoomedImage(imageUrl);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
  
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedText}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link and title copied to clipboard!');
        break;
    }
  };

  const components = {
    code: CodeRenderer as any,
    div: ({ node, ...props }: any) => <BlockNode node={node} {...props} />,
    a: ({ node, ...props }: any) => <a {...props} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer" />,
    img: ({ node, ...props }: any) => (
      <img
        {...props}
        className="cursor-zoom-in"
        onClick={() => handleImageClick(props.src)}
      />
    ),
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10" style={{ overflowX: 'auto' }}>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => router.back()}
          className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 flex items-center button-uniform mb-4"
        >
          Back
        </button>

        {post.cover && post.cover.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-lg" style={{ maxHeight: '400px' }}>
            <Image
              src={`${apiUrl}${post.cover[0].url}`}
              alt={post.title}
              width={800}
              height={400}
              layout="responsive"
              objectFit="cover"
              className="cursor-zoom-in"
              onClick={() => handleImageClick(`${apiUrl}${post.cover[0].url}`)}
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4 break-words text-left dark:text-white">{post.title}</h1>

        <div className="mb-8 p-6 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg dark:bg-gray-800 dark:bg-opacity-50 dark:text-gray-200">
          <p className="text-lg font-semibold text-gray-800 mb-2 dark:text-gray-200">Summary:</p>
          <p className="text-gray-700 break-words leading-6 dark:text-gray-300">{post.description}</p>
        </div>

        {/* Social Share Buttons */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => handleShare('facebook')} className="p-2 rounded-full bg-[#1877f2] text-white hover:bg-[#1877f2]/90">
            <Facebook className="w-5 h-5" />
          </button>
          <button onClick={() => handleShare('twitter')} className="p-2 rounded-full bg-[#1da1f2] text-white hover:bg-[#1da1f2]/90">
            <Twitter className="w-5 h-5" />
          </button>
          <button onClick={() => handleShare('linkedin')} className="p-2 rounded-full bg-[#0a66c2] text-white hover:bg-[#0a66c2]/90">
            <Linkedin className="w-5 h-5" />
          </button>
          <button onClick={() => handleShare('copy')} className="p-2 rounded-full bg-[#ff4500] text-white hover:bg-[#ff4500]/90">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <ReactMarkdown
          className="prose dark:prose-invert text-left dark:text-gray-300"
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {post.content}
        </ReactMarkdown>

        <AuthorInfo author={post.author} createdAt={post.created_at} />

        <ImageZoomDialog
          isOpen={!!zoomedImage}
          onClose={() => setZoomedImage(null)}
          imageUrl={zoomedImage || ''}
        />
      </div>
    </div>
  );
};

export default PostDetail;