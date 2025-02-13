"use client"

import type React from "react"
import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Upload } from "lucide-react"

const HalftoneProcessor: React.FC = () => {
  // State for processing parameters
  const [params, setParams] = useState({
    gridSize: 10,
    brightness: 20,
    contrast: 0,
    gamma: 1.0,
    smoothing: 0,
    ditherType: "None",
  })

  // Refs for media elements
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageElementRef = useRef<HTMLImageElement | null>(null)
  const videoElementRef = useRef<HTMLVideoElement | null>(null)
  const previewURLRef = useRef<string>("")
  const isVideoRef = useRef(false)
  const animationFrameIdRef = useRef<number | null>(null)
  const lastFrameTimeRef = useRef(0)
  const previewDivRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setupCanvasDimensions = useCallback((width: number, height: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const maxWidth = window.innerWidth * 0.8
    const maxHeight = window.innerHeight * 0.6
    let newWidth = width,
      newHeight = height
    const ratio = Math.min(maxWidth / width, maxHeight / height, 1)
    newWidth = width * ratio
    newHeight = height * ratio
    canvas.width = newWidth
    canvas.height = newHeight
  }, [])

  const applyBoxBlur = useCallback((cellValues: Float32Array, numRows: number, numCols: number, strength: number) => {
    let result = new Float32Array(cellValues)
    const passes = Math.floor(strength)

    for (let p = 0; p < passes; p++) {
      const temp = new Float32Array(result.length)
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          let sum = 0,
            count = 0
          for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const r = row + dy,
                c = col + dx
              if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
                sum += result[r * numCols + c]
                count++
              }
            }
          }
          temp[row * numCols + col] = sum / count
        }
      }
      result = temp
    }

    const frac = strength - Math.floor(strength)
    if (frac > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i] = cellValues[i] * (1 - frac) + result[i] * frac
      }
    }

    return result
  }, [])

  const applyFloydSteinbergDithering = useCallback((cellValues: Float32Array, numRows: number, numCols: number) => {
    const threshold = 128
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const index = row * numCols + col
        const oldVal = cellValues[index]
        const newVal = oldVal < threshold ? 0 : 255
        const error = oldVal - newVal
        cellValues[index] = newVal

        if (col + 1 < numCols) {
          cellValues[row * numCols + (col + 1)] += error * (7 / 16)
        }
        if (row + 1 < numRows) {
          if (col - 1 >= 0) {
            cellValues[(row + 1) * numCols + (col - 1)] += error * (3 / 16)
          }
          cellValues[(row + 1) * numCols + col] += error * (5 / 16)
          if (col + 1 < numCols) {
            cellValues[(row + 1) * numCols + (col + 1)] += error * (1 / 16)
          }
        }
      }
    }
  }, [])

  const applyOrderedDithering = useCallback((cellValues: Float32Array, numRows: number, numCols: number) => {
    const bayerMatrix = [
      [0, 2],
      [3, 1],
    ]
    const matrixSize = 2

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const index = row * numCols + col
        const threshold = (bayerMatrix[row % matrixSize][col % matrixSize] + 0.5) * (255 / (matrixSize * matrixSize))
        cellValues[index] = cellValues[index] < threshold ? 0 : 255
      }
    }
  }, [])

  const applyNoiseDithering = useCallback((cellValues: Float32Array, numRows: number, numCols: number) => {
    const threshold = 128
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const index = row * numCols + col
        const noise = (Math.random() - 0.5) * 50
        const adjustedVal = cellValues[index] + noise
        cellValues[index] = adjustedVal < threshold ? 0 : 255
      }
    }
  }, [])

  const generateHalftone = useCallback(
    (scaleFactor = 1) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const previewWidth = canvas.width
      const previewHeight = canvas.height
      const targetWidth = previewWidth * scaleFactor
      const targetHeight = previewHeight * scaleFactor

      const tempCanvas = document.createElement("canvas")
      tempCanvas.width = targetWidth
      tempCanvas.height = targetHeight
      const tempCtx = tempCanvas.getContext("2d")
      if (!tempCtx) return

      if (isVideoRef.current && videoElementRef.current) {
        tempCtx.drawImage(videoElementRef.current, 0, 0, targetWidth, targetHeight)
      } else if (imageElementRef.current) {
        tempCtx.drawImage(imageElementRef.current, 0, 0, targetWidth, targetHeight)
      } else {
        return
      }

      const imgData = tempCtx.getImageData(0, 0, targetWidth, targetHeight)
      const data = imgData.data
      const contrastFactor = (259 * (params.contrast + 255)) / (255 * (259 - params.contrast))

      // Convert to grayscale with adjustments
      const grayData = new Float32Array(targetWidth * targetHeight)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i],
          g = data[i + 1],
          b = data[i + 2]
        let gray = 0.299 * r + 0.587 * g + 0.114 * b
        gray = contrastFactor * (gray - 128) + 128 + params.brightness
        gray = Math.max(0, Math.min(255, gray))
        gray = 255 * Math.pow(gray / 255, 1 / params.gamma)
        grayData[i / 4] = gray
      }

      // Grid setup and processing
      const grid = params.gridSize * scaleFactor
      const numCols = Math.ceil(targetWidth / grid)
      const numRows = Math.ceil(targetHeight / grid)
      let cellValues = new Float32Array(numRows * numCols)

      // Calculate cell values
      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          let sum = 0,
            count = 0
          const startY = row * grid
          const startX = col * grid
          const endY = Math.min(startY + grid, targetHeight)
          const endX = Math.min(startX + grid, targetWidth)

          for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
              sum += grayData[y * targetWidth + x]
              count++
            }
          }
          cellValues[row * numCols + col] = sum / count
        }
      }

      // Apply effects based on parameters
      if (params.smoothing > 0) {
        cellValues = applyBoxBlur(cellValues, numRows, numCols, params.smoothing)
      }

      switch (params.ditherType) {
        case "FloydSteinberg":
          applyFloydSteinbergDithering(cellValues, numRows, numCols)
          break
        case "Ordered":
          applyOrderedDithering(cellValues, numRows, numCols)
          break
        case "Noise":
          applyNoiseDithering(cellValues, numRows, numCols)
          break
      }

      // Draw halftone pattern
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, targetWidth, targetHeight)

      for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numCols; col++) {
          const brightnessValue = cellValues[row * numCols + col]
          const norm = brightnessValue / 255
          const maxRadius = grid / 2
          const radius = maxRadius * (1 - norm)

          if (radius > 0.5) {
            ctx.beginPath()
            const centerX = col * grid + grid / 2
            const centerY = row * grid + grid / 2
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
            ctx.fillStyle = "black"
            ctx.fill()
          }
        }
      }
    },
    [params, applyBoxBlur, applyFloydSteinbergDithering, applyOrderedDithering, applyNoiseDithering],
  )

  const processFrame = useCallback(() => {
    if (!imageElementRef.current && !videoElementRef.current) return
    generateHalftone(1)
  }, [generateHalftone])

  const processVideoFrame = useCallback(
    (timestamp: number) => {
      if (!isVideoRef.current || !videoElementRef.current) return
      const interval = 62.5 // approx 16fps

      if (!lastFrameTimeRef.current) lastFrameTimeRef.current = timestamp
      if (timestamp - lastFrameTimeRef.current >= interval) {
        processFrame()
        lastFrameTimeRef.current = timestamp
      }

      animationFrameIdRef.current = requestAnimationFrame(processVideoFrame)
    },
    [processFrame],
  )

  const cleanupMedia = useCallback(() => {
    if (videoElementRef.current) {
      videoElementRef.current.pause()
      videoElementRef.current.removeAttribute("src")
      videoElementRef.current.load()
      videoElementRef.current = null
    }

    if (imageElementRef.current) {
      imageElementRef.current = null
    }

    if (previewURLRef.current) {
      URL.revokeObjectURL(previewURLRef.current)
      previewURLRef.current = ""
    }

    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current)
      animationFrameIdRef.current = null
    }

    if (previewDivRef.current) {
      previewDivRef.current.innerHTML = ""
    }
  }, [])

  const handleFileUpload = useCallback(
    (file: File) => {
      cleanupMedia()

      // Add a small delay before loading the new media
      setTimeout(() => {
        previewURLRef.current = URL.createObjectURL(file)

        if (file.type.startsWith("video/")) {
          isVideoRef.current = true
          const video = document.createElement("video")
          video.src = previewURLRef.current
          video.autoplay = true
          video.loop = true
          video.muted = true
          video.playsInline = true
          video.crossOrigin = "anonymous"

          const handleVideoLoad = () => {
            setupCanvasDimensions(video.videoWidth, video.videoHeight)
            video.play().catch(console.error)
            if (previewDivRef.current) {
              previewDivRef.current.innerHTML = ""
              video.style.maxWidth = "100%"
              previewDivRef.current.appendChild(video)
            }
            lastFrameTimeRef.current = 0
            animationFrameIdRef.current = requestAnimationFrame(processVideoFrame)
          }

          video.addEventListener("loadeddata", handleVideoLoad)

          video.addEventListener("error", (e) => {
            console.error("Error loading video:", e)
            isVideoRef.current = false
            if (previewDivRef.current) {
              previewDivRef.current.innerHTML = "<p>Error loading video. Please try a different file or format.</p>"
            }
          })

          videoElementRef.current = video
        } else if (file.type.startsWith("image/")) {
          isVideoRef.current = false
          loadImageWithCORS(previewURLRef.current)
            .then((img) => {
              setupCanvasDimensions(img.width, img.height)
              if (previewDivRef.current) {
                previewDivRef.current.innerHTML = ""
                img.style.maxWidth = "100%"
                previewDivRef.current.appendChild(img)
              }
              imageElementRef.current = img
              processFrame()
            })
            .catch((e) => {
              console.error("Error loading image:", e)
              if (previewDivRef.current) {
                previewDivRef.current.innerHTML = "<p>Error loading image. Please try a different file or format.</p>"
              }
            })
        }
      }, 100) // 100ms delay
    },
    [cleanupMedia, setupCanvasDimensions, processVideoFrame, processFrame],
  )

  const resetParameters = useCallback(() => {
    setParams({
      gridSize: 10,
      brightness: 20,
      contrast: 0,
      gamma: 1.0,
      smoothing: 0,
      ditherType: "None",
    })
  }, [])

  const saveResult = useCallback(() => {
    if (!imageElementRef.current && !videoElementRef.current) return
    if (isVideoRef.current) {
      saveVideo()
    } else {
      saveImage()
    }
  }, [])

  const saveImage = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dataURL = canvas.toDataURL("image/png")
    const link = document.createElement("a")
    link.href = dataURL
    link.download = "halftone.png"
    link.click()
  }, [])

  const saveVideo = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !canvas.captureStream) {
      alert("Your browser does not support video recording from canvas.")
      return
    }

    const stream = canvas.captureStream(30) // Increased to 30fps for smoother video
    const options = { mimeType: "video/mp4;codecs=h264" }

    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      alert("MP4 video recording is not supported in your browser. Falling back to WebM.")
      options.mimeType = "video/webm;codecs=vp9"
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        alert("Video recording is not supported in your browser.")
        return
      }
    }

    const mediaRecorder = new MediaRecorder(stream, options)
    const chunks: BlobPart[] = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data)
      }
    }

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: options.mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = options.mimeType.includes("mp4") ? "halftone.mp4" : "halftone.webm"
      a.click()
      URL.revokeObjectURL(url)
    }

    mediaRecorder.start()
    setTimeout(() => {
      mediaRecorder.stop()
    }, 5000) // Record for 5 seconds
  }, [])

  const loadImageWithCORS = (url: string) => {
    return new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = (e) => reject(e)
      img.src = url
    })
  }

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      const files = e.dataTransfer.files
      if (files.length > 0) {
        handleFileUpload(files[0])
      }
    },
    [handleFileUpload],
  )

  useEffect(() => {
    // Load default video when the component mounts
    const defaultVideoUrl = "/videos/Imgur.mp4"
    fetch(defaultVideoUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "default.mp4", { type: "video/mp4" })
        handleFileUpload(file)
      })
      .catch((error) => {
        console.error("Error loading default video:", error)
        if (previewDivRef.current) {
          previewDivRef.current.innerHTML = "<p>Error loading default video. Please try uploading a file manually.</p>"
        }
      })
  }, [])

  useEffect(() => {
    processFrame()
  }, [processFrame])

  return (
    <div className="p-0 max-w-4xl mx-auto">
      <Card className="p-4">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-6 text-center cursor-pointer"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">Drag and drop a file here, or click to select a file</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleFileUpload(file)
            }}
            className="hidden"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Original File:</h2>
            <div ref={previewDivRef} className="border rounded p-2 min-h-[200px]"></div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Processed Result:</h2>
            <canvas ref={canvasRef} className="border rounded w-full"></canvas>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label>Grid Size: {params.gridSize}</Label>
            <Slider
              value={[params.gridSize]}
              min={5}
              max={50}
              step={1}
              onValueChange={(value) => setParams((prev) => ({ ...prev, gridSize: value[0] }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Brightness: {params.brightness}</Label>
            <Slider
              value={[params.brightness]}
              min={-100}
              max={100}
              step={1}
              onValueChange={(value) => setParams((prev) => ({ ...prev, brightness: value[0] }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Contrast: {params.contrast}</Label>
            <Slider
              value={[params.contrast]}
              min={-100}
              max={100}
              step={1}
              onValueChange={(value) => setParams((prev) => ({ ...prev, contrast: value[0] }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Gamma: {params.gamma.toFixed(2)}</Label>
            <Slider
              value={[params.gamma]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={(value) => setParams((prev) => ({ ...prev, gamma: value[0] }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Smoothing: {params.smoothing.toFixed(2)}</Label>
            <Slider
              value={[params.smoothing]}
              min={0}
              max={5}
              step={0.1}
              onValueChange={(value) => setParams((prev) => ({ ...prev, smoothing: value[0] }))}
            />
          </div>

          <div className="space-y-2">
            <Label>Dither Type</Label>
            <Select
              value={params.ditherType}
              onValueChange={(value) => setParams((prev) => ({ ...prev, ditherType: value }))}
            >
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
        </div>

        <div className="mt-6 flex gap-4">
          <Button onClick={resetParameters}>Reset</Button>
          <Button onClick={saveResult}>Save Result</Button>
        </div>
      </Card>
    </div>
  )
}

export default HalftoneProcessor

