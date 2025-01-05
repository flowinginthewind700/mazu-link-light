"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import ReactMarkdown, { Components } from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface BilibiliEmbedProps {
  videoId: string;
}

const BilibiliEmbed: React.FC<BilibiliEmbedProps> = ({ videoId }) => (
  <div className="relative overflow-hidden pb-[56.25%] h-0">
    <iframe
      src={`https://player.bilibili.com/player.html?bvid=${videoId}&page=1`}
      scrolling="no"
      frameBorder="0"
      allowFullScreen
      title="Embedded bilibili"
      className="absolute top-0 left-0 w-full h-full"
    />
  </div>
);

interface YouTubeEmbedProps {
  videoId: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId }) => (
  <div className="relative overflow-hidden pb-[56.25%] h-0">
    <iframe
      width="853"
      height="480"
      src={`https://www.youtube.com/embed/${videoId}`}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      title="Embedded youtube"
      className="absolute top-0 left-0 w-full h-full"
    />
  </div>
);

interface VideoEmbedProps {
  videoUrl: string;
}

const VideoEmbed: React.FC<VideoEmbedProps> = ({ videoUrl }) => (
  <div className="relative overflow-hidden pb-[56.25%] h-0">
    <video controls className="absolute top-0 left-0 w-full h-full">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);

interface CodeRendererProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ inline, className = "blog-code", children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={a11yDark}
      language={match[1]}
      PreTag="div"
      {...props}
      codeTagProps={{
        className: 'custom-code',
      }}
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  ) : (
    <code
      className={`custom-code ${className}`}
      {...props}
    >
      {children}
    </code>
  );
};

interface BlockNodeProps {
  node?: any;
  className: string;
  children: React.ReactNode;
}

const BlockNode: React.FC<BlockNodeProps> = ({ node, ...props }) => {
  const { className } = props;

  if (className === 'youtube') {
    const youtubeVideoId = node.properties.videoid || node.properties.videoId;
    return youtubeVideoId ? <YouTubeEmbed videoId={youtubeVideoId} /> : null;
  }

  if (className === 'bilibili') {
    const bilibiliVideoId = node.properties.videoid || node.properties.videoId;
    return bilibiliVideoId ? <BilibiliEmbed videoId={bilibiliVideoId} /> : null;
  }

  if (className === 'video') {
    const videoUrl = node.properties.url || node.properties.src;
    return videoUrl ? <VideoEmbed videoUrl={videoUrl} /> : null;
  }

  return <div className={className}>{props.children}</div>;
};

interface PostDetailProps {
  postId: string;
}

interface Post {
  cover: { url: string }[];
  title: string;
  description: string;
  content: string;
  created_at: string;
  author?: {
    name: string;
    avatar?: {
      url: string;
    };
    twitter?: string;
  };
}

const PostDetail: React.FC<PostDetailProps> = ({ postId }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL as string;
  const postDetailRef = useRef<HTMLDivElement>(null);

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

  const renderAuthorInfo = () => {
    if (post.author) {
      const avatarUrl = post.author.avatar?.url
        ? `${apiUrl}${post.author.avatar.url}`
        : '/images/defaultavatar.jpg';

      return (
        <div className="flex items-center mt-4">
          <Image
            src={avatarUrl}
            alt={post.author.name}
            width={40}
            height={40}
            className="rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{post.author.name}</p>
            <p className="text-gray-500">
              {new Date(post.created_at).toLocaleDateString()}
              {post.author.twitter && (
                <>
                  {' • '}
                  <a 
                    href={`https://twitter.com/intent/follow?screen_name=${post.author.twitter}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Follow on Twitter
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="mt-4">
        <p className="text-gray-500">{new Date(post.created_at).toLocaleDateString()} from llmstock.com</p>
      </div>
    );
  };

  const components: Components = {
    code: CodeRenderer as any,
    div: ({ node, ...props }: any) => <BlockNode node={node} {...props} />,
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-10" ref={postDetailRef} style={{ overflowX: 'auto' }}>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-start mb-4 items-center">
          <button
            onClick={() => router.back()}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mr-2 flex items-center button-uniform"
          >
            Back
          </button>
        </div>

        {post.cover && post.cover.length > 0 && (
          <div className="mb-4 overflow-hidden rounded-lg" style={{ maxHeight: '400px' }}>
            <Image
              src={`${apiUrl}${post.cover[0].url}`}
              alt={post.title}
              width={800}
              height={400}
              layout="responsive"
              objectFit="cover"
            />
          </div>
        )}

        <h1 className="text-3xl font-bold mb-4 break-words text-left">{post.title}</h1>

        <div className="mb-8 p-6 bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg">
          <p className="text-lg font-semibold text-gray-800 mb-2">Summary:</p>
          <p className="text-gray-700 break-words leading-6">{post.description}</p>
        </div>
        
        <ReactMarkdown
          className="post-markdown-blog text-left"
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={components}
        >
          {post.content}
        </ReactMarkdown>

        {renderAuthorInfo()}
      </div>
    </div>
  );
};

export default PostDetail;
