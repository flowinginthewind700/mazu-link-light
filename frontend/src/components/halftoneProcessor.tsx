"use client";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HalftoneProcessor: React.FC = () => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [gridSize, setGridSize] = useState(10);
  const [brightness, setBrightness] = useState(20);
  const [contrast, setContrast] = useState(0);
  const [gamma, setGamma] = useState(1.0);
  const [smoothing, setSmoothing] = useState(0);
  const [ditherType, setDitherType] = useState("None");

  const generateHalftone = useCallback(
    (targetCanvas: HTMLCanvasElement, scaleFactor: number) => {
      if (!targetCanvas) return;
      const ctx = targetCanvas.getContext("2d");
      if (!ctx) return;

      const previewWidth = targetCanvas.width;
      const previewHeight = targetCanvas.height;
      const targetWidth = previewWidth * scaleFactor;
      const targetHeight = previewHeight * scaleFactor;

      targetCanvas.width = targetWidth;
      targetCanvas.height = targetHeight;

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = targetWidth;
      tempCanvas.height = targetHeight;
      const tempCtx = tempCanvas.getContext("2d");
      if (!tempCtx) return;

      if (isVideo && videoElement) {
        tempCtx.drawImage(videoElement, 0, 0, targetWidth, targetHeight);
      } else if (imageElement) {
        tempCtx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);
      }

      const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight);
      const data = imgData.data;

      const brightnessAdj = brightness;
      const contrastAdj = contrast;
      const gammaValNum = gamma;
      const contrastFactor =
        (259 * (contrastAdj + 255)) / (255 * (259 - contrastAdj));

      const grayData = new Float32Array(targetWidth * targetHeight);

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2];
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = contrastFactor * (gray - 128) + 128 + brightnessAdj;
        gray = Math.max(0, Math.min(255, gray));
        gray = 255 * Math.pow(gray / 255, 1 / gammaValNum);
        grayData[i / 4] = gray;
      }

      const grid = gridSize * scaleFactor;
      const numCols = Math.ceil(targetWidth / grid);
      const numRows = Math.ceil(targetHeight / grid);
      let cellValues = new Float32Array(numRows * numCols);

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          let sum = 0,
            count = 0;
          const startY = row * grid;
          const startX = col * grid;
          const endY = Math.min(startY + grid, targetHeight);
          const endX = Math.min(startX + grid, targetWidth);

          for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
              sum += grayData[y * targetWidth + x];
              count++;
            }
          }

          cellValues[row * numCols + col] = sum / count;
        }
      }

      if (smoothing > 0) {
        cellValues = applyBoxBlur(cellValues, numRows, numCols, smoothing);
      }

      if (ditherType === "FloydSteinberg") {
        applyFloydSteinbergDithering(cellValues, numRows, numCols);
      } else if (ditherType === "Ordered") {
        applyOrderedDithering(cellValues, numRows, numCols);
      } else if (ditherType === "Noise") {
        applyNoiseDithering(cellValues, numRows, numCols);
      }

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const brightnessValue = cellValues[row * numCols + col];
          const norm = brightnessValue / 255;
          const maxRadius = grid / 2;
          const radius = maxRadius * (1 - norm);

          if (radius > 0.5) {
            ctx.beginPath();
            const centerX = col * grid + grid / 2;
            const centerY = row * grid + grid / 2;
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = "black";
            ctx.fill();
          }
        }
      }
    },
    [
      isVideo,
      videoElement,
      imageElement,
      brightness,
      contrast,
      gamma,
      gridSize,
      smoothing,
      ditherType,
    ]
  );

  const processFrame = useCallback(() => {
    if (!imageElement && !videoElement) return;
    if (canvasRef.current) {
      generateHalftone(canvasRef.current, 1);
    }
  }, [imageElement, videoElement, generateHalftone]);

  const debounce = useCallback((func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  const processVideoFrame = useCallback(() => {
    if (!isVideo || !videoElement) return;

    const interval = 62.5; // 1000/16 ≈ 62.5ms
    let lastTime = 0;

    const frameHandler = (timestamp: number) => {
      if (timestamp - lastTime >= interval) {
        processFrame();
        lastTime = timestamp;
      }
      const id = requestAnimationFrame(frameHandler);
      setAnimationFrameId(id);
    };

    const id = requestAnimationFrame(frameHandler);
    setAnimationFrameId(id);
  }, [isVideo, processFrame, videoElement]);

  const setupCanvasDimensions = useCallback(
    (width: number, height: number) => {
      if (!canvasRef.current) return;

      const maxWidth = window.innerWidth * 0.8;
      const maxHeight = window.innerHeight * 0.6;

      let newWidth = width,
        newHeight = height;

      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        newWidth = width * ratio;
        newHeight = height * ratio;
      }

      canvasRef.current.width = newWidth;
      canvasRef.current.height = newHeight;
    },
    []
  );

  const handleFileUpload = useCallback(
    (file: File) => {
      // 清理旧资源
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
        setVideoElement(null);
      }

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        setAnimationFrameId(null);
      }

      const fileURL = URL.createObjectURL(file);
      setPreview(fileURL);

      if (file.type.startsWith("video/")) {
        setIsVideo(true);

        const video = document.createElement("video");
        video.crossOrigin = "anonymous";
        video.preload = "auto";
        video.src = fileURL;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;

        const controller = new AbortController();

        const handleLoaded = () => {
          setupCanvasDimensions(video.videoWidth, video.videoHeight);
          video.play().catch(console.error);
          setVideoElement(video);
          processVideoFrame();
        };

        const handleError = (e: Event) => {
          console.error("视频加载失败:", e);
          URL.revokeObjectURL(fileURL);
          setPreview("");
          setIsVideo(false);
        };

        video.addEventListener("loadeddata", handleLoaded, {
          signal: controller.signal,
        });
        video.addEventListener("error", handleError, {
          signal: controller.signal,
        });

        return () => {
          controller.abort();
          video.removeEventListener("loadeddata", handleLoaded);
          video.removeEventListener("error", handleError);
        };
      } else if (file.type.startsWith("image/")) {
        setIsVideo(false);

        const img = new Image();
        img.src = fileURL;
        img.crossOrigin = "anonymous";

        const handleImageLoad = () => {
          setupCanvasDimensions(img.width, img.height);
          setImageElement(img);
          processFrame();
          setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
        };

        const handleImageError = (e: ErrorEvent) => {
          console.error("图片加载失败:", e);
          URL.revokeObjectURL(fileURL);
          setPreview("");
          setImageElement(null);
        };

        img.addEventListener("load", handleImageLoad);
        img.addEventListener("error", handleImageError);

        return () => {
          img.removeEventListener("load", handleImageLoad);
          img.removeEventListener("error", handleImageError);
        };
      }
    },
    [
      preview,
      videoElement,
      animationFrameId,
      setupCanvasDimensions,
      processVideoFrame,
      processFrame,
    ]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const applyBoxBlur = useCallback(
    (cellValues: Float32Array, numRows: number, numCols: number, strength: number) => {
      let result = new Float32Array(cellValues);
      const passes = Math.floor(strength);

      for (let p = 0; p < passes; p++) {
        const temp = new Float32Array(result.length);

        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            let sum = 0,
              count = 0;

            for (let dy = -1; dy <= 1; dy++) {
              for (let dx = -1; dx <= 1; dx++) {
                const r = row + dy,
                  c = col + dx;

                if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
                  sum += result[r * numCols + c];
                  count++;
                }
              }
            }

            temp[row * numCols + col] = sum / count;
          }
        }

        result = temp;
      }

      const frac = strength - Math.floor(strength);

      if (frac > 0) {
        for (let i = 0; i < result.length; i++) {
          result[i] = cellValues[i] * (1 - frac) + result[i] * frac;
        }
      }

      return result;
    },
    []
  );

  const applyFloydSteinbergDithering = useCallback(
    (cellValues: Float32Array, numRows: number, numCols: number) => {
      const threshold = 128;

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const index = row * numCols + col;
          const oldVal = cellValues[index];
          const newVal = oldVal < threshold ? 0 : 255;
          const error = oldVal - newVal;

          cellValues[index] = newVal;

          if (col + 1 < numCols) {
            cellValues[row * numCols + (col + 1)] += error * (7 / 16);
          }

          if (row + 1 < numRows) {
            if (col - 1 >= 0) {
              cellValues[(row + 1) * numCols + (col - 1)] += error * (3 / 16);
            }

            cellValues[(row + 1) * numCols + col] += error * (5 / 16);

            if (col + 1 < numCols) {
              cellValues[(row + 1) * numCols + (col + 1)] += error * (1 / 16);
            }
          }
        }
      }
    },
    []
  );

  const applyOrderedDithering = useCallback(
    (cellValues: Float32Array, numRows: number, numCols: number) => {
      const bayerMatrix = [
        [0, 2],
        [3, 1],
      ];
      const matrixSize = 2;

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const index = row * numCols + col;
          const threshold =
            (bayerMatrix[row % matrixSize][col % matrixSize] + 0.5) *
            (255 / (matrixSize * matrixSize));

          cellValues[index] = cellValues[index] < threshold ? 0 : 255;
        }
      }
    },
    []
  );

  const applyNoiseDithering = useCallback(
    (cellValues: Float32Array, numRows: number, numCols: number) => {
      const threshold = 128;

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const index = row * numCols + col;
          const noise = (Math.random() - 0.5) * 50;
          const adjustedVal = cellValues[index] + noise;

          cellValues[index] = adjustedVal < threshold ? 0 : 255;
        }
      }
    },
    []
  );

  const handleReset = () => {
    setGridSize(10);
    setBrightness(20);
    setContrast(0);
    setGamma(1.0);
    setSmoothing(0);
    setDitherType("None");
  };

  const handleSave = () => {
    if (!imageElement && !videoElement) return;

    if (isVideo) {
      saveVideo();
    } else {
      saveImage();
    }
  };

  const saveImage = () => {
    if (!canvasRef.current) return;

    const dataURL = canvasRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "halftone.png";
    link.click();
  };

  const saveVideo = () => {
    if (!canvasRef.current || !videoElement) return;

    const canvas = canvasRef.current;
    const stream = canvas.captureStream(16); // 设置16fps
    const options = { mimeType: "video/webm;codecs=vp9" };

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      alert("当前浏览器不支持视频录制");
      return;
    }

    const mediaRecorder = new MediaRecorder(stream, options);
    const chunks: Blob[] = [];
    let isRecording = true;

    const renderFrame = () => {
      processFrame();

      if (isRecording) {
        setTimeout(renderFrame, 62.5); // 每62.5ms渲染一次（约16fps）
      }
    };

    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "halftone.webm";
      a.click();
      URL.revokeObjectURL(url);
      isRecording = false;
    };

    mediaRecorder.start();
    renderFrame(); // 启动渲染循环

    setTimeout(() => {
      mediaRecorder.stop();
    }, 5000);
  };

  useEffect(() => {
    const init = async () => {
      try {
        await loadDefaultVideo();
      } catch (e) {
        console.error("初始化失败:", e);
      }
    };

    init();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    const debouncedProcessFrame = debounce(processFrame, 150);

    if (imageElement || videoElement) {
      debouncedProcessFrame();
    }
  }, [imageElement, videoElement, debounce, processFrame]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }

      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
      }
    };
  }, [preview, animationFrameId, videoElement]);

  useEffect(() => {
    return () => {
      if (videoElement) {
        videoElement.pause();
        videoElement.src = "";
        videoElement.load();
      }
    };
  }, [videoElement]);

  return (
    <div>
      <h1>Halftone Image Processor</h1>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
        }}
        accept="image/*,video/*"
      />
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: isDragging ? "2px dashed blue" : "2px dashed gray",
          padding: "20px",
          textAlign: "center",
        }}
      >
        Drag and drop an image or video here, or click to select a file
      </div>
      <Button onClick={() => fileInputRef.current?.click()}>Select File</Button>
      {preview && (
        <div>
          Original File:
          {isVideo ? (
            <video src={preview} controls style={{ width: "100%" }} />
          ) : (
            <img src={preview} alt="Preview" style={{ width: "100%" }} />
          )}
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: "block", margin: "20px 0" }} />
      <div>
        <Label>Grid Size: {gridSize}</Label>
        <Input
          type="range"
          min="1"
          max="50"
          value={gridSize}
          onChange={(e) => setGridSize(Number.parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label>Brightness: {brightness}</Label>
        <Input
          type="range"
          min="-100"
          max="100"
          value={brightness}
          onChange={(e) => setBrightness(Number.parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label>Contrast: {contrast}</Label>
        <Input
          type="range"
          min="-100"
          max="100"
          value={contrast}
          onChange={(e) => setContrast(Number.parseInt(e.target.value))}
        />
      </div>
      <div>
        <Label>Gamma: {gamma.toFixed(2)}</Label>
        <Input
          type="range"
          min="0.1"
          max="3.0"
          step="0.01"
          value={gamma}
          onChange={(e) => setGamma(Number.parseFloat(e.target.value))}
        />
      </div>
      <div>
        <Label>Smoothing: {smoothing.toFixed(2)}</Label>
        <Input
          type="range"
          min="0"
          max="5"
          step="0.01"
          value={smoothing}
          onChange={(e) => setSmoothing(Number.parseFloat(e.target.value))}
        />
      </div>
      <div>
        <Label>Dither Type</Label>
        <Select value={ditherType} onValueChange={setDitherType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="None">None</SelectItem>
            <SelectItem value="FloydSteinberg">Floyd-Steinberg</SelectItem>
            <SelectItem value="Ordered">Ordered</SelectItem>
            <SelectItem value="Noise">Noise</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleReset}>Reset</Button>
      <Button onClick={handleSave}>{isVideo ? "Save Video" : "Save Image"}</Button>
    </div>
  );
};

export default HalftoneProcessor;