"use client"

import { useEffect, useRef } from "react"
import { Canvas } from "@react-three/fiber"
import RealisticSun from "./components/realistic-sun"
import SplashCursor from "./components/splash-cursor"
import FiberOpticText from "./components/fiber-optic-text"
import Navigation from "./components/navigation"
import { ChevronDown, Zap, Leaf, Globe, ArrowRight, Play, Pause } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Card, CardContent } from "./components/ui/card"
import { Badge } from "./components/ui/badge"
import { Star, Home, Users, Facebook, Twitter, Instagram } from "lucide-react"

export default function HomePage() {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-x-hidden">
      {/* Navigation */}
      <Navigation />

      {/* Splash Cursor Effect */}
      <SplashCursor />

      {/* Hero Section (100vh) */}
      <section className="relative w-full h-screen min-h-[100vh] flex flex-col md:flex-row items-center justify-center overflow-hidden bg-black">
        {/* Particle Background (only in hero) */}
        <ParticleBackground />

        {/* 3D Realistic Sun - Mobile (top, full width, centered) */}
        <div className="block md:hidden w-full flex justify-center items-center pt-4 pb-4 z-10">
          <div className="w-4/5 max-w-xs sm:max-w-sm h-64">
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
              <RealisticSun />
            </Canvas>
          </div>
        </div>

        {/* 3D Realistic Sun - Desktop (right side) */}
        <div className="hidden md:block absolute md:static top-0 right-0 w-full md:w-1/2 h-1/2 md:h-full pointer-events-none select-none">
          <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
            <RealisticSun />
          </Canvas>
        </div>

        {/* Hero Content */}
        <div className="relative w-full md:w-1/2 h-full flex items-center justify-center p-4 md:p-8 z-10">
          <HeroTitle />
        </div>
      </section>

      {/* More Energy More Savings and following sections */}
      <FeaturesAndMoreSections />
    </div>
  )
}

function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
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

function HeroTitle() {
  return (
    <div className="text-center space-y-8 relative z-10">
      <div className="logo-container">
        <FiberOpticText />
      </div>

      <div className="space-y-4">
        <p className="text-base md:text-xl text-gray-200 max-w-xs md:max-w-xl mx-auto leading-relaxed">
          Experience the future of energy with our revolutionary solar solutions. <br />
          <span className="font-bold bg-gradient-to-r from-green-400 via-blue-400 to-yellow-400 bg-clip-text text-transparent text-lg md:text-2xl">
            Interactive, intelligent, infinite.
          </span>
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-4 md:mt-8">
          <button className="group relative px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-[#fb923c] via-[#4ade80] to-[#f59e0b] rounded-full text-white font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25 text-base md:text-lg">
            <span className="relative z-10">Explore the Future</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#fb923c] via-[#4ade80] to-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          <button className="px-6 md:px-8 py-3 md:py-4 border-2 border-white/30 rounded-full text-white font-semibold backdrop-blur-sm hover:border-white/60 hover:bg-white/10 transition-all duration-300 text-base md:text-lg">
            Learn More
          </button>
        </div>
      </div>

      {/* Floating elements */}
      <div className="hidden sm:block absolute -top-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="hidden sm:block absolute -bottom-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
    </div>
  )
}

function FeaturesAndMoreSections() {
  return (
    <>
      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">More Energy More Savings</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Experience the future
              <br />
              of Solar Power.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card>
              <CardContent className="p-0">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Making Everything From Renewable</h3>
                  <Image
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80"
                    alt="Solar installation"
                    width={300}
                    height={200}
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-80">Rating:</p>
                      <p className="text-2xl font-bold">
                        610 <span className="text-sm">kW</span>
                      </p>
                    </div>
                    <div className="w-16 h-16 border-4 border-green-400 rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-green-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="p-6">
              <CardContent className="p-0">
                <Star className="w-8 h-8 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">Solar Energy Best Production</h3>
                <p className="text-gray-600 mb-4">
                  Solar energy is the radiant light and heat from the sun, harnessed through technologies to generate
                  electricity and provide sustainable power solutions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="p-6">
              <CardContent className="p-0">
                <Home className="w-8 h-8 text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">We Are Building Better Future</h3>
                <p className="text-gray-600 mb-4">
                  Solar energy is the radiant light and heat from the sun, harnessed through technologies to generate
                  electricity and provide sustainable power solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Energy Savings Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-green-100 text-green-700">More Energy More Savings</Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Energy Savings Made Easy With The Solar</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Solar energy is the radiant light and heat emitted by the sun, harnessed through various technologies to
                generate electricity and provide sustainable power solutions for residential and commercial use.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Provides insights into budget performance.</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span>Provides insights into budget performance.</span>
                </div>
              </div>

              <Button>
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80"
                alt="Modern house with solar panels"
                width={500}
                height={600}
                className="rounded-2xl"
              />

              {/* Floating Stats */}
              <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-500">700</p>
                  <p className="text-sm text-gray-600">kW Solar Power</p>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Zap className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-gray-500">Energy Efficiency</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transform Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-700">More Energy More Savings</Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Transform Your Home's A<br />
              Powerful Of The Force.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden group cursor-pointer bg-white text-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=600&q=80"
                alt="Wind turbines"
                width={300}
                height={400}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <Star className="w-6 h-6 mb-2" />
                <h3 className="text-xl font-bold mb-2">The Mission Of Energy</h3>
                <p className="text-sm opacity-90">Sustainable power solutions for a better tomorrow</p>
              </div>
            </Card>

            <Card className="relative overflow-hidden group cursor-pointer bg-white text-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80"
                alt="Coastal landscape"
                width={300}
                height={400}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <Star className="w-6 h-6 mb-2" />
                <h3 className="text-xl font-bold mb-2">Serenity Of The Steppe</h3>
                <p className="text-sm opacity-90">Harnessing natural energy from vast landscapes</p>
              </div>
            </Card>

            <Card className="relative overflow-hidden group cursor-pointer bg-white text-gray-900">
              <Image
                src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80"
                alt="Sunset landscape"
                width={300}
                height={400}
                className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <Star className="w-6 h-6 mb-2" />
                <h3 className="text-xl font-bold mb-2">Echoes Of The Past</h3>
                <p className="text-sm opacity-90">Building on traditional wisdom with modern technology</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="relative py-20 px-6 bg-gray-50">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80" alt="Forest landscape" fill className="object-cover" />
          <div className="absolute inset-0 bg-white/80" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-500/20 text-green-400 border-green-400">More Power Efficiency</Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Where sustainability
              <br />
              meets style.
            </h2>
            <Button>Get Started</Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm border-white/20 text-gray-900">
              <CardContent className="p-6">
                <Image
                  src="https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=400&q=80"
                  alt="Solar installation"
                  width={250}
                  height={150}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="font-bold mb-2">Experience the future of Solar Power</h3>
                <p className="text-sm opacity-80">Ready, from a million solar installations worldwide</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 text-gray-900">
              <CardContent className="p-6">
                <Image
                  src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
                  alt="Green landscape"
                  width={250}
                  height={150}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="font-bold mb-2">Experience the future of Solar Power</h3>
                <p className="text-sm opacity-80">Sustainable energy solutions for modern living</p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-white/20 text-gray-900">
              <CardContent className="p-6">
                <Image
                  src="https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80"
                  alt="Modern architecture"
                  width={250}
                  height={150}
                  className="w-full rounded-lg mb-4"
                />
                <h3 className="font-bold mb-2">Clean Energy For A Better Future</h3>
                <p className="text-sm opacity-80">
                  A daily national electricity that makes everything from thermostats to water
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Renova Home Is Working With Leading Brands There Making There Everything From Thermostats To Water. Of
                The Heaters, Integrating New Energy. Energy. To Savings Made Easy With. Nuclearle & Making There
                Everything From Thermostats To Water. Of The Heaters, Integrating
              </h2>

              <div className="flex items-center gap-4 mt-8">
                <Image
                  src="/placeholder.svg?height=50&width=50"
                  alt="Author"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <p className="font-semibold">John Doe</p>
                  <p className="text-gray-600 text-sm">Solar Energy Expert</p>
                </div>
                <Button className="ml-auto">
                  <Users className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <Image
                src="/placeholder.svg?height=400&width=500"
                alt="Modern house"
                width={500}
                height={400}
                className="rounded-2xl"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                <span className="text-sm font-semibold">4.9★</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-[#0a1833] py-16 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-bold mb-8">Newsletter</h2>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Subscribe to newsletter</h3>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button>Subscribe</Button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">GreenFlux Energy</h3>
                <p className="text-gray-600 text-sm mb-6">
                  Sustainable power solutions for the Internet generation. Making clean energy accessible to everyone.
                </p>

                <div className="flex gap-4">
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter className="w-5 h-5" />
                  </Link>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Quick links</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Information</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Discover</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Solutions
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Case Studies
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-white transition-colors">
                      Resources
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-blue-900 mt-12 pt-8 text-center text-sm text-white">
            <p>Copyright 2024 GreenFlux Energy - All Rights Reserved</p>
          </div>
        </div>
      </section>
    </>
  )
}
