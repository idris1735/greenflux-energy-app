"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "./ui/button"
import { Calculator, ShoppingCart, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { QuickCalculatorModal } from "./quick-calculator-modal"

export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-green-500/20">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 md:w-10 md:h-10 relative">
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
              <span className="text-xl md:text-2xl font-bold">
                <span className="text-green-500">GREEN</span>
                <span className="text-yellow-500">FLUX</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/solutions" 
              className={`text-sm transition-colors ${
                pathname === "/solutions" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Solutions
            </Link>
            <Link 
              href="/products" 
              className={`text-sm transition-colors ${
                pathname === "/products" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className={`text-sm transition-colors ${
                pathname === "/about" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className={`text-sm transition-colors ${
                pathname === "/contact" 
                  ? "text-white" 
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Contact
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <QuickCalculatorModal />
            <Link href="/marketplace">
              <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-sm py-1.5">
                <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                Marketplace
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="flex flex-col gap-4">
              <Link 
                href="/solutions" 
                className={`text-sm transition-colors ${
                  pathname === "/solutions" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Solutions
              </Link>
              <Link 
                href="/products" 
                className={`text-sm transition-colors ${
                  pathname === "/products" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/about" 
                className={`text-sm transition-colors ${
                  pathname === "/about" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About Us
              </Link>
              <Link 
                href="/contact" 
                className={`text-sm transition-colors ${
                  pathname === "/contact" 
                    ? "text-white" 
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
              <QuickCalculatorModal />
              <Link href="/marketplace" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-sm py-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Marketplace
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 