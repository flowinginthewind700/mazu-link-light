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
import { X, Facebook, Twitter, Linkedin, Share2, ArrowLeft } from 'lucide-react';

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
    avatar?: string;
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
              <img
                src={imageUrl}
                alt="Zoomed image"
                className="w-full h-full object-contain rounded-lg shadow-xl"
                loading="lazy"
              />
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
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
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
        className="cursor-zoom-in rounded-lg shadow-md my-4"
        onClick={() => handleImageClick(props.src)}
        loading="lazy"
      />
    ),
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-primary hover:underline"
        >
          <ArrowLeft className="mr-2" size={20} /> Back
        </button>

        {post.cover && post.cover.length > 0 && (
          <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={`${apiUrl}${post.cover[0].url}`}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto object-cover cursor-zoom-in"
              onClick={() => handleImageClick(`${apiUrl}${post.cover[0].url}`)}
              loading="lazy"
            />
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="mb-6 text-lg text-muted-foreground">{post.description}</div>

        <div className="flex flex-wrap gap-4 mb-8">
          {['facebook', 'twitter', 'linkedin', 'copy'].map((platform) => (
            <button
              key={platform}
              onClick={() => handleShare(platform)}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {platform === 'facebook' && <Facebook size={20} />}
              {platform === 'twitter' && <Twitter size={20} />}
              {platform === 'linkedin' && <Linkedin size={20} />}
              {platform === 'copy' && <Share2 size={20} />}
            </button>
          ))}
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {post.content}
          </ReactMarkdown>
        </div>

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
