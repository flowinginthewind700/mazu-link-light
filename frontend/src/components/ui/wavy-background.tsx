"use client";
import { cn } from "@/components/lib/utils";
import React, { useEffect, useRef, useState } from "react";
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
  height = "400px", // 默认高度，可以通过 props 覆盖
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
  height?: string; // 新增高度属性
  [key: string]: any;
}) => {
  const noise = createNoise3D();
  let w: number,
    h: number,
    nt: number,
    i: number,
    x: number,
    ctx: any,
    canvas: any;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 获取当前主题
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(darkModeMediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleChange);
    return () => darkModeMediaQuery.removeEventListener("change", handleChange);
  }, []);

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
    ctx = canvas.getContext("2d");
    w = ctx.canvas.width = window.innerWidth;
    h = ctx.canvas.height = parseInt(height, 10); // 使用传入的高度
    ctx.filter = `blur(${blur}px)`;
    nt = 0;
    window.onresize = function () {
      w = ctx.canvas.width = window.innerWidth;
      h = ctx.canvas.height = parseInt(height, 10); // 使用传入的高度
      ctx.filter = `blur(${blur}px)`;
    };
    render();
  };

  // 根据主题动态设置波浪颜色
  const waveColors = colors ?? (isDarkMode
    ? ["#38bdf8", "#818cf8", "#c084fc", "#e879f9", "#22d3ee"] // 深色模式下的颜色
    : ["#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#06b6d4"] // 浅色模式下的颜色
  );

  // 根据主题动态设置背景填充颜色
  const fillColor = backgroundFill || (isDarkMode ? "black" : "white");

  const drawWave = (n: number) => {
    nt += getSpeed();
    for (i = 0; i < n; i++) {
      ctx.beginPath();
      ctx.lineWidth = waveWidth || 50;
      ctx.strokeStyle = waveColors[i % waveColors.length];
      for (x = 0; x < w; x += 5) {
        var y = noise(x / 800, 0.3 * i, nt) * 100;
        ctx.lineTo(x, y + h * 0.5); // 调整波浪高度
      }
      ctx.stroke();
      ctx.closePath();
    }
  };

  let animationId: number;
  const render = () => {
    ctx.fillStyle = fillColor;
    ctx.globalAlpha = waveOpacity || 0.5;
    ctx.fillRect(0, 0, w, h);
    drawWave(5);
    animationId = requestAnimationFrame(render);
  };

  useEffect(() => {
    init();
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isDarkMode, height]); // 依赖 isDarkMode 和 height，主题或高度变化时重新渲染

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    // 检测是否为 Safari 浏览器
    setIsSafari(
      typeof window !== "undefined" &&
        navigator.userAgent.includes("Safari") &&
        !navigator.userAgent.includes("Chrome")
    );
  }, []);

  return (
    <div
      className={cn(
        "relative w-full", // 移除 h-screen，改为 relative
        containerClassName
      )}
      style={{ height }} // 通过 style 设置高度
    >
      <canvas
        className="absolute inset-0 z-0 w-full h-full" // 确保 canvas 充满容器
        ref={canvasRef}
        id="canvas"
        style={{
          ...(isSafari ? { filter: `blur(${blur}px)` } : {}),
        }}
      ></canvas>
      <div className={cn("relative z-10", className)} {...props}>
        {children}
      </div>
    </div>
  );
};