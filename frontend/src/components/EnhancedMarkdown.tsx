"use client";

import React from 'react';
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

interface EnhancedMarkdownProps {
  content: string;
  className?: string;
}

const EnhancedMarkdown: React.FC<EnhancedMarkdownProps> = ({ content, className = "post-markdown-blog text-left" }) => {
  const components: Components = {
    code: CodeRenderer as any,
    div: ({ node, ...props }: any) => <BlockNode node={node} {...props} />,
  };

  return (
    <ReactMarkdown
      className={className}
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default EnhancedMarkdown;
