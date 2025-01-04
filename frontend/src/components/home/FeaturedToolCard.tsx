import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FeatureTool } from './types';

interface FeaturedToolCardProps {
  tool: FeatureTool;
}

export const FeaturedToolCard: React.FC<FeaturedToolCardProps> = ({ tool }) => {
  const CardWrapper = tool.linkType === 'internal' ? Link : 'a';
  const cardProps = tool.linkType === 'internal' 
    ? { href: tool.link } 
    : { href: tool.link, target: "_blank", rel: "noopener noreferrer" };

  return (
    <CardWrapper {...cardProps}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="group relative aspect-[2/1] rounded-lg overflow-hidden bg-gradient-to-r from-accent to-accent/50 hover:shadow-lg transition-all duration-200"
      >
        <Image
          src={tool.image}
          alt={tool.title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-4 flex flex-col justify-end">
          <h3 className="text-white font-semibold">{tool.title}</h3>
          <p className="text-white/80 text-sm">{tool.description}</p>
        </div>
      </motion.div>
    </CardWrapper>
  );
};
