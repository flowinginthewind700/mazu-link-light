"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/components/lib/utils";
import { createNoise3D } from "simplex-noise";

export const WavyBackground = ({
  children,
  className,
  containerClassName,
  colors,
  waveWidth,
  backgroundFill,
  blur = 10,
  speed = "fast",
  waveOpacity = 0.5,
  height = "400px",
  animate = true,
  ...props
}: {
  children?: any;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  waveWidth?: number;
  backgroundFill?: string;
  blur?: number;
  speed?: "slow" | "fast";
  waveOpacity?: number;
  height?: string;
  animate?: boolean;
  [key: string]: any;
}) => {
  const [fallbackToMotion, setFallbackToMotion] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

  const waveColors = colors ?? (isDarkMode
    ? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"]
    : ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#06b6d4"]
  );

  const fillColor = backgroundFill || (isDarkMode ? "rgba(31, 41, 55, 0.5)" : "rgba(255, 255, 255, 0.5)");

  const getSpeed = () => {
    switch (speed) {
      case "slow":
        return 0.001;
      case "fast":
        return 0.002;
      default:
        return 0.001;
    }
  };

  const init = () => {
    canvas = canvasRef.current;
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setFallbackToMotion(true);
      return;
    }
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = parseInt(height, 10);
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    render();
  };

  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5);
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = fillColor;
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    ctx.globalCompositeOperation = 'soft-light';
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, 'rgba(255,255,255,0.5)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    try {
      init();
    } catch (error) {
      console.error("WebGL context could not be created:", error);
      setFallbackToMotion(true);
    }
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode, height]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && !fallbackToMotion) {
        w = canvasRef.current.width = window.innerWidth;
        h = canvasRef.current.height = parseInt(height, 10);
        ctx.filter = `blur(${blur}px)`;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height, blur, fallbackToMotion]);

  if (fallbackToMotion) {
    return (
      <MotionWavyBackground
        height={height}
        colors={waveColors}
        fillColor={fillColor}
        waveOpacity={waveOpacity}
        className={className}
        containerClassName={containerClassName}
        animate={animate}
        {...props}
      >
        {children}
      </MotionWavyBackground>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full rounded-lg overflow-hidden",
        containerClassName
      )}
      style={{ height }}
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full"
        ref={canvasRef}
        id="canvas"
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};

const MotionWavyBackground: React.FC<{
  height: string;
  colors: string[];
  fillColor: string;
  waveOpacity: number;
  className?: string;
  containerClassName?: string;
  animate: boolean;
  children: React.ReactNode;
}> = ({ height, colors, fillColor, waveOpacity, className, containerClassName, animate, children }) => {
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
        "relative rounded-lg overflow-hidden",
        containerClassName
      )}
      style={{ height }}
    >
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
          "absolute inset-0 z-0 opacity-60 blur-xl transition duration-500",
          "bg-[radial-gradient(circle_farthest-side_at_0_100%,#00ccb1,transparent),radial-gradient(circle_farthest-side_at_100%_0,#7b61ff,transparent),radial-gradient(circle_farthest-side_at_100%_100%,#ffc414,transparent),radial-gradient(circle_farthest-side_at_0_0,#1ca0fb,#141316)]"
        )}
      />
      {colors.map((color, index) => (
        <motion.div
          key={index}
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: color,
            opacity: waveOpacity * 0.2,
          }}
          animate={{
            y: ["0%", "100%", "0%"],
          }}
          transition={{
            duration: 10 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      <div
        className="absolute inset-0 z-0"
        style={{ backgroundColor: fillColor, opacity: waveOpacity }}
      />
      <div className={cn("relative z-10", className)}>
        {children}
      </div>
    </div>
  );
};
