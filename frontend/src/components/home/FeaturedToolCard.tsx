import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface FeatureTool {
  id: number;
  title: string;
  description: string;
  linkType: 'internal' | 'external';
  link: string;
  image: {
    url: string;
  };
}

interface FeaturedToolCardProps {
  tool: FeatureTool;
}

const apiUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL;

export const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  const CardWrapper = tool.linkType === 'internal' ? Link : 'a';
  const cardProps = tool.linkType === 'internal' 
    ? { href: tool.link } 
    : { href: tool.link, target: "_blank", rel: "noopener noreferrer" };

  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const element = descriptionRef.current;
    if (element) {
      if (element.scrollWidth > element.clientWidth) {
        element.classList.add('animate-marquee');
      } else {
        element.classList.remove('animate-marquee');
      }
    }
  }, [tool.description]);

  return (
    <CardWrapper {...cardProps}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group relative aspect-[2/1] rounded-lg overflow-hidden bg-white/80 dark:bg-gray-800/80 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <Image
          src={`${apiUrl}${tool.image.url}`}
          alt={tool.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent p-2 sm:p-3 flex flex-col justify-end">
          <h3 className="text-white font-semibold text-xs sm:text-sm md:text-base truncate">{tool.title}</h3>
          <div className="relative overflow-hidden">
            <p 
              ref={descriptionRef} 
              className="text-white/90 text-xs sm:text-sm whitespace-nowrap inline-block"
            >
              {tool.description}
            </p>
          </div>
        </div>
      </motion.div>
    </CardWrapper>
  );
};
