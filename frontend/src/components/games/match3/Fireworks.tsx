"use client"

import type React from "react"
import { useEffect, useRef } from "react"

const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Particle[] = []

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = canvasHeight
        this.size = Math.random() * 2 + 1
        this.speedX = Math.random() * 6 - 3
        this.speedY = Math.random() * -15
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.size > 0.1) this.size -= 0.1
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function createParticles() {
      if (!canvas) return // Ensure canvas is not null
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    function animateParticles() {
      if (!canvas || !ctx) return // Ensure canvas and ctx are not null
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle, index) => {
        particle.update()
        particle.draw(ctx)
        if (particle.size <= 0.1) {
          particles.splice(index, 1)
        }
      })
      requestAnimationFrame(animateParticles)
    }

    createParticles()
    animateParticles()

    const interval = setInterval(createParticles, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

export default Fireworks