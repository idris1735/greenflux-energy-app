"use client"

import { useEffect, useState } from "react"

interface Splash {
  id: number
  x: number
  y: number
  size: number
  opacity: number
}

export default function SplashCursor() {
  const [splashes, setSplashes] = useState<Splash[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isMoving, setIsMoving] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout
    let lastX = 0
    let lastY = 0
    let splashCounter = 0

    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX
      const currentY = e.clientY

      setMousePosition({ x: currentX, y: currentY })

      // Check if mouse is moving significantly
      const distance = Math.sqrt(Math.pow(currentX - lastX, 2) + Math.pow(currentY - lastY, 2))

      if (distance > 5) {
        setIsMoving(true)
        clearTimeout(timeout)

        // Create a new splash at current position
        if (Math.random() > 0.7) {
          // Only create splash sometimes for performance
          const newSplash = {
            id: splashCounter++,
            x: currentX,
            y: currentY,
            size: Math.random() * 30 + 20,
            opacity: 0.7,
          }

          setSplashes((prev) => [...prev, newSplash])
        }

        timeout = setTimeout(() => setIsMoving(false), 100)
      }

      lastX = currentX
      lastY = currentY
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop for splash effects
    const animationInterval = setInterval(() => {
      setSplashes((prev) =>
        prev
          .map((splash) => ({
            ...splash,
            size: splash.size * 1.05,
            opacity: splash.opacity * 0.95,
          }))
          .filter((splash) => splash.opacity > 0.03),
      )
    }, 16)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearInterval(animationInterval)
      clearTimeout(timeout)
    }
  }, [])

  return (
    <>
      {/* Cursor dot */}
      <div
        className="fixed w-6 h-6 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: "translate(-50%, -50%)",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(16, 185, 129, 0.4) 70%)",
          boxShadow: "0 0 10px rgba(16, 185, 129, 0.6)",
          opacity: isMoving ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Splash effects */}
      {splashes.map((splash) => (
        <div
          key={splash.id}
          className="fixed rounded-full pointer-events-none z-40 mix-blend-screen"
          style={{
            left: `${splash.x}px`,
            top: `${splash.y}px`,
            width: `${splash.size}px`,
            height: `${splash.size}px`,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(16, 185, 129, 0.3) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%)",
            opacity: splash.opacity,
          }}
        />
      ))}
    </>
  )
} 