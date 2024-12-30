import React, { useEffect, useRef } from 'react';

interface ScrollingTextProps {
  text: string;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({ text }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const textWidth = scrollElement.scrollWidth;
      const containerWidth = scrollElement.offsetWidth;
      const animationDuration = textWidth / 50; // Adjust speed here

      scrollElement.style.setProperty('--text-width', `-${textWidth}px`);
      scrollElement.style.setProperty('--container-width', `${containerWidth}px`);
      scrollElement.style.setProperty('--animation-duration', `${animationDuration}s`);
    }
  }, [text]);

  return (
    <div className="overflow-hidden whitespace-nowrap w-full">
      <div
        ref={scrollRef}
        className="inline-block animate-scroll-text"
      >
        {text}
      </div>
    </div>
  );
};

export default ScrollingText;
