'use client'

import React, { useRef, useEffect, useState } from 'react'

export default function LogoParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePositionRef = useRef({ x: 0, y: 0 })
  const isTouchingRef = useRef(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let img = new window.Image()
    img.src = '/greenflux-logo.png'
    img.crossOrigin = 'Anonymous'

    let animationFrameId: number
    let particles: any[] = []
    let logoImageData: ImageData | null = null

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
    }

    updateCanvasSize()

    function sampleLogoPixels() {
      if (!ctx || !canvas) return
      // Draw logo centered
      const logoWidth = isMobile ? 180 : 320
      const logoHeight = isMobile ? 120 : 220
      const x = (canvas.width - logoWidth) / 2
      const y = (canvas.height - logoHeight) / 2
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, x, y, logoWidth, logoHeight)
      logoImageData = ctx.getImageData(x, y, logoWidth, logoHeight)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return { x, y, logoWidth, logoHeight }
    }

    function createParticles(bounds: { x: number, y: number, logoWidth: number, logoHeight: number }) {
      if (!logoImageData) return
      particles = []
      const gap = 3 // pixel gap between particles
      for (let py = 0; py < logoImageData.height; py += gap) {
        for (let px = 0; px < logoImageData.width; px += gap) {
          const idx = (py * logoImageData.width + px) * 4
          const alpha = logoImageData.data[idx + 3]
          if (alpha > 128) {
            const color = `rgba(${logoImageData.data[idx]},${logoImageData.data[idx+1]},${logoImageData.data[idx+2]},${logoImageData.data[idx+3]/255})`
            particles.push({
              baseX: bounds.x + px,
              baseY: bounds.y + py,
              x: bounds.x + px + (Math.random()-0.5)*30,
              y: bounds.y + py + (Math.random()-0.5)*30,
              color,
              size: 2 + Math.random(),
              life: Math.random()*100+100
            })
          }
        }
      }
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const { x: mouseX, y: mouseY } = mousePositionRef.current
      const maxDistance = 120
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        if (distance < maxDistance && (isTouchingRef.current || !('ontouchstart' in window))) {
          const force = (maxDistance - distance) / maxDistance
          const angle = Math.atan2(dy, dx)
          const moveX = Math.cos(angle) * force * 30
          const moveY = Math.sin(angle) * force * 30
          p.x = p.baseX - moveX
          p.y = p.baseY - moveY
        } else {
          p.x += (p.baseX - p.x) * 0.08
          p.y += (p.baseY - p.y) * 0.08
        }
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI)
        ctx.fill()
        p.life--
        if (p.life <= 0) {
          p.x = p.baseX + (Math.random()-0.5)*30
          p.y = p.baseY + (Math.random()-0.5)*30
          p.life = Math.random()*100+100
        }
      }
      animationFrameId = requestAnimationFrame(animate)
    }

    img.onload = () => {
      const bounds = sampleLogoPixels()
      if (bounds) {
        createParticles(bounds)
        animate()
      }
    }

    const handleResize = () => {
      updateCanvasSize()
      const bounds = sampleLogoPixels()
      if (bounds) {
        createParticles(bounds)
      }
    }

    const handleMove = (x: number, y: number) => {
      mousePositionRef.current = { x, y }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX, e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault()
        handleMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const handleTouchStart = () => {
      isTouchingRef.current = true
    }

    const handleTouchEnd = () => {
      isTouchingRef.current = false
      mousePositionRef.current = { x: 0, y: 0 }
    }

    const handleMouseLeave = () => {
      if (!('ontouchstart' in window)) {
        mousePositionRef.current = { x: 0, y: 0 }
      }
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('touchstart', handleTouchStart)
    canvas.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('resize', handleResize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('touchstart', handleTouchStart)
      canvas.removeEventListener('touchend', handleTouchEnd)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isMobile])

  return (
    <div className="relative w-full h-dvh flex flex-col items-center justify-center bg-white">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full absolute top-0 left-0 touch-none"
        aria-label="GreenFlux Energy logo particle effect"
      />
    </div>
  )
} 