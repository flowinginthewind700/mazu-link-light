import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tool } from './types';

interface ToolCardProps {
  tool: Tool;
  apiUrl: string;
  loading?: boolean; // 新增 loading 状态
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, apiUrl, loading }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(tool.accessLink, '_blank', 'noopener,noreferrer');
  };

  // 如果正在加载，显示骨架屏
  if (loading) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow">
        <div className="flex items-center gap-4">
          {/* 骨架屏：图标 */}
          <div className="relative space-y-5 overflow-hidden rounded-2xl bg-white/5 p-4 shadow-xl shadow-black/5 before:absolute before:inset-0 before:-translate-x-full before:-skew-x-12 before:animate-[shimmer_2s_infinite] before:border-t before:border-white/10 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent">
            <div className="h-12 w-12 rounded-lg bg-white/5"></div>
          </div>
          {/* 骨架屏：文字内容 */}
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/5 rounded-lg bg-white/5"></div>
            <div className="h-3 w-4/5 rounded-lg bg-white/10"></div>
            <div className="h-3 w-2/5 rounded-lg bg-white/5"></div>
          </div>
        </div>
      </div>
    );
  }

  // 正常渲染工具卡片
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 hover:shadow-lg transition-shadow group">
      <Link href={`/agitool/${tool.id}`} className="block">
        <div className="flex items-center gap-4">
          <Image
            src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
            alt={tool.name}
            width={48}
            height={48}
            className="rounded-lg"
            loading="lazy"
          />
          <div>
            <h3 className="font-medium text-foreground hover:underline group-hover:text-gray-900 dark:group-hover:text-gray-100">
              {tool.name}
            </h3>
            <p className="text-sm text-muted-foreground group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {tool.Description}
            </p>
          </div>
        </div>
      </Link>
      {tool.accessLink && !tool.internalPath && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleExternalClick}
                className="absolute top-4 right-4 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <SquareArrowOutUpRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Access External Tool</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {/* 鼠标悬停时的动态效果 */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};