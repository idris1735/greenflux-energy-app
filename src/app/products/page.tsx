"use client"

import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Sun, Battery, Zap, Star, ShoppingCart, Filter, ChevronDown, Check, Shield } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Footer from "../components/footer"

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-gray-50 pt-20">
      {/* Header with Search and Filters */}
      <div className="sticky top-20 z-40 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="w-full md:w-80"
              />
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <select className="border rounded-lg px-3 py-2 bg-white">
                <option>Sort by: Featured</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
              </select>
              <Button variant="outline">
                <ShoppingCart className="w-4 h-4" />
                <span className="ml-2">Cart (0)</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-64 space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Solar Panels (12)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Inverters (8)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Batteries (10)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Accessories (15)</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Under ₦100,000</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>₦100,000 - ₦500,000</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>₦500,000 - ₦1,000,000</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Over ₦1,000,000</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Power Rating</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Under 1kW</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>1kW - 5kW</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>5kW - 10kW</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Over 10kW</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Brand</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Luminous</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Sukam</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Microtek</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>V-Guard</span>
                </label>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Product Card */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src="/sun-product-placeholder.jpg"
                      alt="Solar Product"
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    {i === 0 && (
                      <Badge className="absolute top-2 left-2 bg-green-100 text-green-700">
                        Best Seller
                      </Badge>
                    )}
                    {i === 1 && (
                      <Badge className="absolute top-2 left-2 bg-blue-100 text-blue-700">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-500 ml-1">(24)</span>
                    </div>
                    <h3 className="font-semibold">450W Solar Panel</h3>
                    <p className="text-sm text-gray-600 mt-1">Monocrystalline | 25 Year Warranty</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-lg font-bold text-green-600">₦185,000</div>
                      <Button variant="outline" className="text-sm">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between">
              <Button variant="outline" disabled>Previous</Button>
              <div className="flex items-center gap-2">
                <Button variant="outline" className="bg-green-50">1</Button>
                <Button variant="outline">2</Button>
                <Button variant="outline">3</Button>
                <span>...</span>
                <Button variant="outline">8</Button>
              </div>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
} 