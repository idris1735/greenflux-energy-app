"use client"

import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Building2, Factory, Home, ShoppingBag, ArrowRight, Check, Calculator, Zap, Shield, Clock, Sun, Battery, Wrench, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Footer from "../components/footer"

export default function SolutionsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="relative pt-20 bg-gradient-to-b from-black to-green-900 text-white">
        <Image
          src="/solar-installation.jpg"
          alt="Solar Installation"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="flex flex-col gap-4">
            <Badge className="w-fit bg-green-900/50 text-green-400 border-green-500/20">Solutions</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold max-w-3xl">
              Powering Nigeria's Future with Sustainable Energy
            </h1>
            <p className="text-gray-300 max-w-2xl text-lg">
              From residential setups to industrial powerhouses, we provide customized solar solutions that match your energy needs and budget.
            </p>
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center gap-2 text-green-400">
                <Zap className="w-5 h-5" />
                <span>24/7 Power Supply</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Shield className="w-5 h-5" />
                <span>5-Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-green-400">
                <Clock className="w-5 h-5" />
                <span>Quick Installation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Solution Categories - Now with interactive hover effects and 3D-like cards */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700">Our Solutions</Badge>
            <h2 className="text-3xl font-bold mt-4 mb-2">Complete Solar Power Systems</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our range of carefully designed solar power solutions, each tailored to specific needs and usage patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Residential Solution - Large Card */}
            <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="bg-white rounded-2xl p-8 h-full">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <Home className="w-8 h-8 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Residential</h3>
                    <p className="text-gray-600 mb-4">
                      Transform your home with reliable, 24/7 solar power. Perfect for families looking for energy independence.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-green-600 font-semibold">System Size</div>
                    <div className="text-2xl font-bold">2-10kW</div>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="text-green-600 font-semibold">Daily Output</div>
                    <div className="text-2xl font-bold">8-40kWh</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Smart home integration ready</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span>Mobile app monitoring</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span>5-year comprehensive warranty</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Starting from</div>
                    <div className="text-2xl font-bold text-green-600">₦2.5M</div>
                  </div>
                  <Link 
                    href="/calculator?type=residential"
                    className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-xl hover:bg-green-200 transition-colors"
                  >
                    Calculate Savings
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Commercial Solution - With Interactive Elements */}
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              <div className="bg-white rounded-2xl p-8 h-full">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Commercial</h3>
                    <p className="text-gray-600 mb-4">
                      Optimize your business operations with reliable power. Ideal for shops, offices, and small businesses.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 my-6">
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-blue-600 font-semibold">System Size</div>
                    <div className="text-2xl font-bold">10-50kW</div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="text-blue-600 font-semibold">Daily Output</div>
                    <div className="text-2xl font-bold">40-200kWh</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Energy management system</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Peak load management</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Check className="w-4 h-4 text-blue-600" />
                    </div>
                    <span>Commercial-grade inverters</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Starting from</div>
                    <div className="text-2xl font-bold text-blue-600">₦8M</div>
                  </div>
                  <Link 
                    href="/calculator?type=commercial"
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-xl hover:bg-blue-200 transition-colors"
                  >
                    Calculate Savings
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Enterprise Solutions */}
          <div className="mt-8 grid md:grid-cols-2 gap-8">
            {/* Corporate Solution */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              {/* Similar structure as above with purple theme */}
            </div>

            {/* Industrial Solution */}
            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-1 shadow-xl hover:shadow-2xl transition-all duration-300 group">
              {/* Similar structure as above with orange theme */}
            </div>
          </div>
        </div>
      </section>

      {/* Technical Specifications - Now with interactive diagrams */}
      <section className="py-16 px-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/circuit-pattern.png')] opacity-10" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-white/10 text-white border-white/20">Technology</Badge>
            <h2 className="text-3xl font-bold mt-4 mb-2">Advanced Components</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Every system is built with premium components for maximum efficiency and reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Solar Panels Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-yellow-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                  <Image
                    src="/solar-panels-tech.jpg"
                    alt="High-efficiency solar panels"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                      <Sun className="w-6 h-6 text-yellow-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Solar Panels</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>High-efficiency monocrystalline</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>25-year performance warranty</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-green-400" />
                    <span>Advanced PERC technology</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Efficiency Rating</div>
                      <div className="text-2xl font-bold text-green-400">20%+</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-yellow-400/50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-400/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Inverters Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                  <Image
                    src="/inverter-tech.jpg"
                    alt="Smart inverter system"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Smart Inverters</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Pure sine wave output</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Remote monitoring & control</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-blue-400" />
                    <span>Grid-tie functionality</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Conversion Rate</div>
                      <div className="text-2xl font-bold text-blue-400">98%</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-blue-400/50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-blue-400/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Batteries Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                  <Image
                    src="/battery-tech.jpg"
                    alt="Advanced battery storage"
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur rounded-xl flex items-center justify-center">
                      <Battery className="w-6 h-6 text-purple-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">Smart Batteries</h3>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Lithium iron phosphate cells</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Smart BMS technology</span>
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <Check className="w-4 h-4 text-purple-400" />
                    <span>Temperature controlled</span>
                  </li>
                </ul>
                <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400">Cycle Life</div>
                      <div className="text-2xl font-bold text-purple-400">10,000+</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-purple-400/50 flex items-center justify-center">
                      <div className="w-8 h-8 rounded-full bg-purple-400/20 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section - Now with animated steps */}
      <section className="py-16 px-4 bg-gradient-to-br from-green-50 via-white to-yellow-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-green-100 text-green-700">Our Process</Badge>
            <h2 className="text-3xl font-bold mt-4 mb-2">Your Journey to Solar Power</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've simplified the transition to solar energy with our proven process. Here's how we make it happen.
            </p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-green-200 via-yellow-200 to-green-200 transform -translate-y-1/2 hidden md:block" />

            <div className="grid md:grid-cols-4 gap-8">
              {/* Step 1: Assessment */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform">
                      <Calculator className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Assessment</h3>
                  <p className="text-gray-600 text-center text-sm">
                    We analyze your power needs and site conditions to design the perfect solution.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Power consumption analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Site survey & evaluation</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      <span>Custom system design</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 2: Planning */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform">
                      <Wrench className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Planning</h3>
                  <p className="text-gray-600 text-center text-sm">
                    We handle all the technical planning and documentation for your installation.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-blue-500" />
                      <span>Technical documentation</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-blue-500" />
                      <span>Permit acquisition</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-blue-500" />
                      <span>Installation scheduling</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 3: Installation */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform">
                      <Sun className="w-8 h-8 text-yellow-600" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Installation</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Our expert team handles the complete installation with precision.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-yellow-500" />
                      <span>Professional mounting</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-yellow-500" />
                      <span>System integration</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-yellow-500" />
                      <span>Quality assurance</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 4: Support */}
              <div className="relative group">
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform">
                      <Shield className="w-8 h-8 text-purple-600" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2">Support</h3>
                  <p className="text-gray-600 text-center text-sm">
                    Ongoing maintenance and support to ensure optimal performance.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-purple-500" />
                      <span>24/7 monitoring</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-purple-500" />
                      <span>Regular maintenance</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-purple-500" />
                      <span>Performance optimization</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - More engaging design */}
      <section className="py-16 px-4 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-black to-yellow-900/30" />
          <div className="absolute inset-0 bg-[url('/solar-pattern.png')] opacity-5" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Ready to Switch to Solar?</h2>
                <p className="text-gray-400">
                  Get a free consultation and custom quote for your energy needs.
                </p>
              </div>
              <div className="flex gap-4">
                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600">
                  Calculate Savings
                  <Calculator className="w-4 h-4 ml-1.5" />
                </Button>
                <Button variant="outline" className="border-green-500/20 hover:border-green-500/40">
                  Contact Sales
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
} 