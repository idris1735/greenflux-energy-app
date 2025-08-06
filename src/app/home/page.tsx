"use client"

import { useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import RealisticSun from "../components/realistic-sun"
import SplashCursor from "../components/splash-cursor"
import FiberOpticText from "../components/fiber-optic-text"
import Navigation from "../components/navigation"
import { ChevronDown, Zap, Leaf, Globe, ArrowRight, Play, Pause, Sun, Battery, Calculator, ShoppingCart, TrendingUp, Check } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Star, Home, Users, Facebook, Twitter, Instagram, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* Splash Cursor Effect */}
      <SplashCursor />

      {/* Hero Section (100vh) */}
      {/*
      <section className="relative w-full h-screen min-h-[100vh] flex flex-col md:flex-row items-center justify-center overflow-hidden bg-black">
        <ParticleBackground />
        <div className="relative w-full md:w-1/2 h-full flex items-center justify-center p-4 md:p-6 z-10">
          <div className="text-center md:text-left space-y-6 mt-16 md:mt-0">
            <Badge className="bg-green-900/50 text-green-400 mt-16 border-green-500/20 mb-3 text-xs">
              Nigeria's Leading Solar Provider
            </Badge>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 via-yellow-300 to-green-400 bg-clip-text text-transparent">
                Reliable Power
              </span>
              <br />
              <span className="text-white">
                For Every Nigerian Home
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-300 max-w-xl leading-relaxed">
              Experience uninterrupted power supply with our state-of-the-art solar solutions. 
              Say goodbye to generator noise and hello to clean, renewable energy.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start items-center mt-6">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-sm py-2">
                Calculate Your Savings
                <Calculator className="w-4 h-4 ml-1.5" />
              </Button>
              <Button variant="outline" className="w-full sm:w-auto border-green-500/20 hover:border-green-500/40 text-sm py-2">
                Watch Installation
                <Play className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-green-400">5000+</div>
                <div className="text-xs text-gray-400">Installations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">₦50M+</div>
                <div className="text-xs text-gray-400">Customer Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">24/7</div>
                <div className="text-xs text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-8 h-8 text-green-400" />
        </div>
      </section>
      */}

      {/* Features and More Sections */}
      <FeaturesAndMoreSections />
    </div>
  )
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    // Create particles
    for (let i = 0; i < 200; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.8 + 0.2,
      })
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.fill()

        // Add twinkle effect
        particle.opacity += (Math.random() - 0.5) * 0.02
        particle.opacity = Math.max(0.1, Math.min(0.9, particle.opacity))
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }} />
}

function FeaturesAndMoreSections() {
  return (
    <>
      {/* Features Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-green-100 text-green-700 text-xs">Nigerian Solar Solutions</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Powering Nigeria's Future
              <br />
              with Solar Energy
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Experience reliable power supply with our cutting-edge solar solutions, 
              designed specifically for Nigerian homes and businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="bg-white shadow-xl">
              <CardContent className="p-4">
                <div className="mb-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mb-2">
                    <Zap className="w-4 h-4 text-green-600" />
                  </div>
                  <h3 className="text-base font-bold mb-2">24/7 Power Supply</h3>
                  <p className="text-xs text-gray-600">
                    Say goodbye to power outages with our reliable solar systems, 
                    backed by high-capacity battery storage.
                  </p>
                </div>
                <Image
                  src="/power-outage.jpg"
                  alt="Solar powered home"
                  width={240}
                  height={160}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Average Daily Output</p>
                    <p className="text-lg font-bold text-green-600">
                      8-12 <span className="text-xs">kWh</span>
                    </p>
                  </div>
                  <div className="w-12 h-12 border-3 border-green-400 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-white shadow-xl">
              <CardContent className="p-4">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mb-2">
                  <Star className="w-4 h-4 text-orange-600" />
                </div>
                <h3 className="text-base font-bold mb-2">Premium Installation</h3>
                <Image
                  src="/solar-engineers.jpg"
                  alt="Solar installation process"
                  width={240}
                  height={160}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-xs text-gray-600 mb-2">
                  Professional installation by certified Nigerian engineers, 
                  ensuring optimal performance and longevity.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-100 text-orange-700 text-xs">5 Year Warranty</Badge>
                  <Badge className="bg-green-100 text-green-700 text-xs">Free Maintenance</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-white shadow-xl">
              <CardContent className="p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                  <Home className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="text-base font-bold mb-2">Smart Home Integration</h3>
                <Image
                  src="/track-solar.jpg"
                  alt="Smart home controls"
                  width={240}
                  height={160}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <p className="text-xs text-gray-600 mb-2">
                  Monitor and control your solar system from your smartphone, 
                  with real-time energy consumption tracking.
                </p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-700 text-xs">Mobile App</Badge>
                  <Badge className="bg-purple-100 text-purple-700 text-xs">AI-Powered</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nigeria Solar Facts Section */}
      <section className="py-16 px-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black to-yellow-900/30" />
          <div className="absolute inset-0 bg-[url('/placeholder-pattern.jpg')] opacity-5" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-3 bg-yellow-900/50 text-yellow-400 border-yellow-500/20 text-xs">
              Nigeria's Solar Revolution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Future is Bright with
              <br />
              Solar Energy in Nigeria
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Join the solar revolution and be part of Nigeria's sustainable energy future
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Fact cards with reduced padding */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
                <Sun className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-400 mb-1">7.0 kWh/m²</div>
              <p className="text-xs text-gray-400">Average Daily Solar Radiation in Nigeria</p>
            </div>

            {/* Fact 2 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                <Battery className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">60%</div>
              <p className="text-xs text-gray-400">Reduction in Energy Costs with Solar</p>
            </div>

            {/* Fact 3 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">25% YoY</div>
              <p className="text-xs text-gray-400">Solar Adoption Growth Rate in Nigeria</p>
            </div>

            {/* Fact 4 */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-4 border border-white/10 transform hover:scale-105 transition-all duration-300">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">2030</div>
              <p className="text-xs text-gray-400">Nigeria's Solar Energy Target: 30% Power Generation</p>
            </div>
          </div>

          <div className="mt-12 grid md:grid-cols-2 gap-6 items-center">
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-xl font-bold mb-4">Why Solar is Booming in Nigeria</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-300">Abundant sunshine with over 2,500 hours of sunlight annually</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-300">Government incentives and policies supporting renewable energy</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-300">Rising electricity costs and unreliable grid power supply</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <p className="text-sm text-gray-300">Decreasing cost of solar technology and installation</p>
                </li>
              </ul>
            </div>

            <div className="relative">
              <Image
                src="/solar-association.jpg"
                alt="Solar installation growth in Nigeria"
                width={500}
                height={300}
                className="rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm text-gray-300">Source: Nigerian Solar Energy Association, 2025 Projections</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 