import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { BilibiliEmbed, YouTubeEmbed, VideoEmbed } from './EmbedComponents';
import { CSSProperties } from 'react';

// 自定义主题
const customTheme: { [key: string]: CSSProperties } = {
  'code[class*="language-"]': {
    color: 'var(--syntax-color)',
    background: 'var(--syntax-bg)',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
  },
  'pre[class*="language-"]': {
    color: 'var(--syntax-color)',
    background: 'var(--syntax-bg)',
    fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
    fontSize: '1em',
    textAlign: 'left',
    whiteSpace: 'pre',
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    tabSize: '4',
    hyphens: 'none',
    padding: '1em',
    margin: '0.5em 0',
    overflow: 'auto',
    borderRadius: '0.3em',
  },
  'comment': { color: 'var(--syntax-comment)' },
  'prolog': { color: 'var(--syntax-prolog)' },
  'doctype': { color: 'var(--syntax-doctype)' },
  'cdata': { color: 'var(--syntax-cdata)' },
  'punctuation': { color: 'var(--syntax-punctuation)' },
  'property': { color: 'var(--syntax-property)' },
  'tag': { color: 'var(--syntax-tag)' },
  'boolean': { color: 'var(--syntax-boolean)' },
  'number': { color: 'var(--syntax-number)' },
  'constant': { color: 'var(--syntax-constant)' },
  'symbol': { color: 'var(--syntax-symbol)' },
  'selector': { color: 'var(--syntax-selector)' },
  'attr-name': { color: 'var(--syntax-attr-name)' },
  'string': { color: 'var(--syntax-string)' },
  'char': { color: 'var(--syntax-char)' },
  'builtin': { color: 'var(--syntax-builtin)' },
  'inserted': { color: 'var(--syntax-inserted)' },
  'operator': { color: 'var(--syntax-operator)' },
  'entity': { color: 'var(--syntax-entity)', cursor: 'help' },
  'url': { color: 'var(--syntax-url)' },
  '.language-css .token.string': { color: 'var(--syntax-css-string)' },
  '.style .token.string': { color: 'var(--syntax-style-string)' },
  'variable': { color: 'var(--syntax-variable)' },
  'atrule': { color: 'var(--syntax-atrule)' },
  'attr-value': { color: 'var(--syntax-attr-value)' },
  'function': { color: 'var(--syntax-function)' },
  'class-name': { color: 'var(--syntax-class-name)' },
  'keyword': { color: 'var(--syntax-keyword)' },
  'regex': { color: 'var(--syntax-regex)' },
  'important': { color: 'var(--syntax-important)', fontWeight: 'bold' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' },
  'deleted': { color: 'var(--syntax-deleted)' },
};

export const CodeRenderer: React.FC<{ inline?: boolean; className?: string; children?: React.ReactNode }> = ({ inline, className = "blog-code", children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  return !inline && match ? (
    <SyntaxHighlighter
      style={customTheme}
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