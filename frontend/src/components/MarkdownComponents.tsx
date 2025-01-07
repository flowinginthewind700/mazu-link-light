import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { BilibiliEmbed, YouTubeEmbed, VideoEmbed } from './EmbedComponents';

export const CodeRenderer: React.FC<{ inline?: boolean; className?: string; children?: React.ReactNode }> = ({ inline, className = "blog-code", children, ...props }) => {
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
    <code className={`custom-code ${className}`} {...props}>
      {children}
    </code>
  );
};

export const BlockNode: React.FC<{ node?: any; className: string; children: React.ReactNode }> = ({ node, ...props }) => {
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
