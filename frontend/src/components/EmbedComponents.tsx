import React from 'react';

export const BilibiliEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
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

export const YouTubeEmbed: React.FC<{ videoId: string }> = ({ videoId }) => (
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

export const VideoEmbed: React.FC<{ videoUrl: string }> = ({ videoUrl }) => (
  <div className="relative overflow-hidden pb-[56.25%] h-0">
    <video controls className="absolute top-0 left-0 w-full h-full">
      <source src={videoUrl} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>
);
