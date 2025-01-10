"use client";

import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React, { useState } from "react";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";
import { cn } from "@/components/lib/utils";

interface CardSpotlightProps {
  children: React.ReactNode;
  radius?: number;
  color?: string;
  className?: string;
  [key: string]: any;
}

export const CardSpotlight: React.FC<CardSpotlightProps> = ({
  children,
  radius = 350,
  color = "rgba(120, 120, 120, 0.1)", // 半透明颜色，兼容深色和浅色模式
  className,
  ...props
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);

  return (
    <div
      className={cn(
        "group/spotlight relative rounded-lg border bg-background dark:bg-neutral-900 overflow-hidden", // 兼容深色和浅色模式
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* 光斑效果 */}
      <motion.div
        className="pointer-events-none absolute z-0 -inset-px rounded-lg opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          backgroundColor: color,
          maskImage: useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `,
        }}
      />

      {/* CanvasRevealEffect 动画 */}
      {isHovering && (
        <CanvasRevealEffect
          animationSpeed={5}
          containerClassName="bg-transparent absolute inset-0 pointer-events-none"
          colors={[
            [59, 130, 246], // 蓝色
            [139, 92, 246], // 紫色
          ]}
          dotSize={3}
        />
      )}

      {/* 卡片内容 */}
      <div className="relative z-10 p-6">{children}</div>
    </div>
  );
};