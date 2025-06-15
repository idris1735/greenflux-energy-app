"use client"

import { useState } from "react"
import { ChevronDown, Menu, X } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  const sections = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" },
  ]

  return (
    <nav className="sticky top-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-green-400/30 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 relative">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Sun */}
              <circle cx="35" cy="25" r="12" fill="#F59E0B" />
              <rect x="32" y="8" width="6" height="8" rx="3" fill="#F59E0B" />
              <rect x="45" y="12" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(45 48 16)" />
              <rect x="45" y="28" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(90 48 32)" />
              <rect x="19" y="28" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(90 22 32)" />
              <rect x="19" y="12" width="6" height="8" rx="3" fill="#F59E0B" transform="rotate(-45 22 16)" />
              
              {/* Wrench */}
              <path d="M45 35 L65 55 L68 52 L58 42 L62 38 L68 44 L72 40 L58 26 L45 35Z" fill="#EA580C" />
              <circle cx="68" cy="44" r="3" fill="white" />
              
              {/* Shopping Cart */}
              <path d="M15 45 L20 45 L25 70 L70 70 L75 55 L30 55 L25 45 L85 45" 
                    stroke="#059669" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="35" cy="80" r="4" fill="#059669" />
              <circle cx="60" cy="80" r="4" fill="#059669" />
            </svg>
          </div>
          <div className="text-2xl font-bold">
            <span className="text-green-400">GREEN</span>
            <span className="text-orange-400">FLUX</span>
          </div>
        </div>
        {/* Desktop Navigation - Centered */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-8 bg-black/40 px-8 py-2 rounded-full shadow-md border border-green-900/20">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`px-6 py-2 rounded-full font-semibold text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-400/60 focus:ring-offset-2
                  ${activeSection === section.id
                    ? "bg-gradient-to-r from-[#fb923c] via-[#4ade80] to-[#f59e0b] text-white shadow-lg shadow-green-400/10 scale-105"
                    : "text-gray-200 hover:bg-gradient-to-r hover:from-[#fb923c] hover:via-[#4ade80] hover:to-[#f59e0b] hover:text-white hover:scale-105 hover:shadow-md hover:shadow-green-400/20"}
                `}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-green-700/30 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 px-4 pb-4">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(section.id)
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2 rounded-lg font-semibold text-lg transition-all duration-300
                ${activeSection === section.id
                  ? "bg-green-700 text-green-200 shadow"
                  : "text-gray-200 hover:bg-green-600/80 hover:text-white"}
              `}
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  )
} 