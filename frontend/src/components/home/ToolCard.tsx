import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SquareArrowOutUpRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tool } from './types';
import { CardSpotlight } from "@/components/ui/card-spotlight";

interface ToolCardProps {
  tool: Tool;
  apiUrl: string;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, apiUrl }) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(tool.accessLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <CardSpotlight>
      <Link href={`/agitool/${tool.id}`} className="block">
        <div className="flex items-center gap-4">
          <Image
            src={`${apiUrl}${tool.iconimage.formats?.thumbnail?.url || tool.iconimage.url}`}
            alt={tool.name}
            width={48}
            height={48}
            className="rounded-lg"
          />
          <div>
            <h3 className="font-medium text-foreground hover:underline">{tool.name}</h3>
            <p className="text-sm text-muted-foreground">{tool.Description}</p>
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
    </CardSpotlight>
  );
};