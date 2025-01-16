import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tool } from './types';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: Tool;
  apiUrl: string;
  loading?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, apiUrl, loading }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(tool.accessLink, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
            <div className="h-16 w-16 rounded-lg bg-white/5"></div>
          </div>
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/5 rounded-lg bg-white/5"></div>
            <div className="h-3 w-4/5 rounded-lg bg-white/10"></div>
            <div className="h-3 w-2/5 rounded-lg bg-white/5"></div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="relative overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-all group cursor-pointer"
    >
      <Link href={`/agitool/${tool.id}`} passHref>
        <div className="flex items-center gap-4">
          <motion.div 
            whileHover={{ rotate: 360 }} 
            transition={{ duration: 0.5 }}
            className="relative w-16 h-16 rounded-lg overflow-hidden shadow-md z-10"
          >
            <Image
              src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
              alt={tool.name}
              layout="fill"
              objectFit="cover"
              className="rounded-lg transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground group-hover:text-gray-900 dark:group-hover:text-gray-100 truncate">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300 line-clamp-2">
              {tool.Description}
            </p>
          </div>
        </div>
      </Link>
      {tool.accessLink && !tool.internalPath && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleExternalClick}
                className="absolute top-4 right-4 p-1 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Access External Tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {/* Border Animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-0 h-0 border-t-2 border-l-2 border-gray-300 dark:border-gray-600 transition-all duration-300 group-hover:w-full group-hover:h-full"></div>
        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-2 border-r-2 border-gray-300 dark:border-gray-600 transition-all duration-300 group-hover:w-full group-hover:h-full"></div>
      </div>
    </motion.div>
  );
};

export default ToolCard;