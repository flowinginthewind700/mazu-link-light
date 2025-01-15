"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface WavyBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  waveOpacity?: number;
  height?: string;
  animate?: boolean;
  [key: string]: any;
}

export const WavyBackground: React.FC<WavyBackgroundProps> = ({
  children,
  className,
  containerClassName,
  waveOpacity = 0.5,
  height = "400px",
  animate = true,
  ...props
}) => {
  const variants = {
    initial: {
      backgroundPosition: "0 50%",
    },
    animate: {
      backgroundPosition: ["0, 50%", "100% 50%", "0 50%"],
    },
  };

  return (
    <div
      className={cn(
        "relative rounded-3xl overflow-hidden",
        containerClassName
      )}
      style={{ height }}
    >
      {/* 背景渐变层 */}
      <motion.div
        variants={animate ? variants : undefined}
        initial={animate ? "initial" : undefined}
        animate={animate ? "animate" : undefined}
        transition={
          animate
            ? {
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }
            : undefined
        }
        style={{
          backgroundSize: animate ? "400% 400%" : undefined,
        }}
        className={cn(
          "absolute inset-0 z-0 opacity-60 group-hover:opacity-100 blur-xl transition duration-500",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,hsl(var(--muted)),transparent),radial-gradient(circle_farthest-side_at_100%_0,hsl(var(--accent)),transparent),radial-gradient(circle_farthest-side_at_100%_100%,hsl(var(--primary)),transparent),radial-gradient(circle_farthest-side_at_0_0,hsl(var(--secondary)),hsl(var(--background)))]"
        )}
      />
      {/* 波浪层 */}
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: `hsl(var(--${index === 0 ? "muted" : index === 1 ? "accent" : "primary"}))`,
            opacity: waveOpacity * (index === 0 ? 0.3 : index === 1 ? 0.2 : 0.1),
          }}
          animate={{
            y: ["0%", "100%", "0%"],
            x: [`${index * 5}%`, `${(index + 1) * 10}%`, `${index * 5}%`],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* 背景填充层 */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{ backgroundColor: `hsl(var(--background) / 0.9)` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: waveOpacity * 0.8 }}
        transition={{ duration: 1 }}
      />
      {/* 内容层 */}
      <motion.div
        className={cn("relative z-20", className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default WavyBackground;