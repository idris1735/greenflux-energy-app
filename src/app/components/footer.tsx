"use client"

import { Input } from "./ui/input"
import { Button } from "./ui/button"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Phone } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0a1833] py-8 sm:py-12 px-4 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Newsletter Column - Takes 5 columns */}
          <div className="sm:col-span-2 lg:col-span-5">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Newsletter</h2>
            <div className="mb-6 sm:mb-8">
              <p className="text-sm text-gray-400 mb-3">
                Subscribe to our newsletter to get updates on our latest offers!
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 text-sm"
                />
                <Button className="bg-gradient-to-r from-green-500 to-yellow-500 hover:from-green-600 hover:to-yellow-600 text-sm whitespace-nowrap">
                  Subscribe
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">GreenFlux Energy</h3>
              <p className="text-sm text-gray-400 mb-4 sm:mb-6">
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

          {/* Quick Links Column - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/solutions" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/calculator" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Solar Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Column - Takes 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Information</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/installation" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Installation Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column - Takes 3 columns */}
          <div className="lg:col-span-3">
            <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+234 800 GREEN FLUX</span>
              </li>
              <li>
                <Link href="/locations" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Find a Store
                </Link>
              </li>
              <li>
                <Link href="/marketplace" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Partner with Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-sm text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900/40 mt-8 sm:mt-12 pt-6 text-center text-xs sm:text-sm text-gray-400">
          <p>Copyright © 2025 GreenFlux Energy - All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
} 