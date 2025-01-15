"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils";

interface CanvasRevealEffectProps {
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

export const CanvasRevealEffect: React.FC<CanvasRevealEffectProps> = ({
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}) => {
  return (
    <MotionDotMatrix
      colors={colors}
      dotSize={dotSize}
      opacities={opacities}
      containerClassName={containerClassName}
      showGradient={showGradient}
    />
  );
};

interface MotionDotMatrixProps {
  colors: number[][];
  dotSize: number;
  opacities: number[];
  containerClassName?: string;
  showGradient?: boolean;
}

const MotionDotMatrix: React.FC<MotionDotMatrixProps> = ({
  colors,
  dotSize,
  opacities,
  containerClassName,
  showGradient
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const dots = useMemo(() => {
    const dotsArray = [];
    const totalSize = 20;
    const numDotsX = Math.ceil(dimensions.width / totalSize);
    const numDotsY = Math.ceil(dimensions.height / totalSize);

    for (let y = 0; y < numDotsY; y++) {
      for (let x = 0; x < numDotsX; x++) {
        dotsArray.push({
          x: x * totalSize,
          y: y * totalSize,
          color: colors[Math.floor(Math.random() * colors.length)],
          opacity: opacities[Math.floor(Math.random() * opacities.length)]
        });
      }
    }

    return dotsArray;
  }, [dimensions, colors, opacities]);

  return (
    <div className={cn("h-full relative bg-white dark:bg-neutral-900 w-full", containerClassName)}>
      {dots.map((dot, index) => (
        <motion.div
          key={index}
          style={{
            position: 'absolute',
            left: dot.x,
            top: dot.y,
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: `rgb(${dot.color[0]}, ${dot.color[1]}, ${dot.color[2]})`,
            opacity: dot.opacity
          }}
          animate={{
            opacity: [dot.opacity, dot.opacity * 0.5, dot.opacity],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ))}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%] dark:from-gray-900 dark:to-[84%]" />
      )}
    </div>
  );
};

export default CanvasRevealEffect;
