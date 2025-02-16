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
    const fireworks: Firework[] = []

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number

      constructor(x: number, y: number, color: string) {
        this.x = x
        this.y = y
        this.size = Math.random() * 3 + 2
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 3 + 2
        this.speedX = Math.cos(angle) * speed
        this.speedY = Math.sin(angle) * speed
        this.color = color
        this.alpha = 1
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.speedY += 0.05 // gravity
        this.alpha -= 0.01
        if (this.size > 0.1) this.size -= 0.1
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Firework {
      x: number
      y: number
      color: string
      particles: Particle[]

      constructor(canvasWidth: number, canvasHeight: number) {
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight * 0.5
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`
        this.particles = []

        for (let i = 0; i < 200; i++) {
          this.particles.push(new Particle(this.x, this.y, this.color))
        }
      }

      update() {
        this.particles.forEach((particle, index) => {
          particle.update()
          if (particle.alpha <= 0) {
            this.particles.splice(index, 1)
          }
        })
      }

      draw(ctx: CanvasRenderingContext2D) {
        this.particles.forEach((particle) => particle.draw(ctx))
      }
    }

    function createFirework() {
      if (!canvas) return
      fireworks.push(new Firework(canvas.width, canvas.height))
    }

    function animateFireworks() {
      if (!canvas || !ctx) return
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      fireworks.forEach((firework, index) => {
        firework.update()
        firework.draw(ctx)
        if (firework.particles.length === 0) {
          fireworks.splice(index, 1)
        }
      })

      requestAnimationFrame(animateFireworks)
    }

    // Create initial fireworks
    for (let i = 0; i < 5; i++) {
      createFirework()
    }

    animateFireworks()

    const interval = setInterval(createFirework, 1000)

    return () => {
      clearInterval(interval)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
}

export default Fireworks

