"use client"

import { useState, useEffect } from "react"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Sun, Battery, Zap, Star, ShoppingCart, Filter, ChevronDown, Check, Shield, MapPin, BadgeCheck, Eye, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import Footer from "../components/footer"
import { getAllProducts, getSellerProfile, saveProductForUser, removeSavedProduct, isProductSavedByUser } from "@/lib/firebaseHelpers"
import { useUser } from "@/lib/UserContext"

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  rating?: number;
  review_count?: number;
  seller_id?: string;
  seller_name?: string;
  seller_verified?: boolean;
  seller_logo?: string;
  location?: string;
  category?: string;
  tags?: string[];
  views_count?: number;
  status?: string;
  specifications?: any;
  is_negotiable?: boolean;
  quantity_available?: number;
  created_at: any;
}

const CATEGORIES = [
  "Solar Panels",
  "Inverters", 
  "Batteries",
  "Charge Controllers",
  "Mounting Systems",
  "Accessories",
  "Complete Systems"
];

const PRICE_RANGES = [
  { label: "Under ₦100,000", min: 0, max: 100000 },
  { label: "₦100,000 - ₦500,000", min: 100000, max: 500000 },
  { label: "₦500,000 - ₦1,000,000", min: 500000, max: 1000000 },
  { label: "Over ₦1,000,000", min: 1000000, max: Infinity }
];

export default function ProductsPage() {
  const { user, isAuthenticated } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [savedProducts, setSavedProducts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategories, selectedPriceRange, sortBy]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadSavedProducts();
    }
  }, [isAuthenticated, user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getAllProducts(50);
      
      // Fetch seller profiles for all products
      const productsWithSellers = await Promise.all(
        productsData.map(async (product: any) => {
          if (product.seller_id) {
            try {
              const sellerProfile = await getSellerProfile(product.seller_id);
              return {
                ...product,
                seller_name: sellerProfile?.business_name || sellerProfile?.company_name || 'Unknown Seller',
                seller_verified: sellerProfile?.is_verified || false,
                seller_logo: sellerProfile?.company_logo_url || '',
                seller_id: product.seller_id
              } as Product;
            } catch (error) {
              console.error('Error fetching seller profile:', error);
              return {
                ...product,
                seller_name: 'Unknown Seller',
                seller_verified: false,
                seller_logo: '',
                seller_id: product.seller_id
              } as Product;
            }
          }
          return product as Product;
        })
      );
      
      setProducts(productsWithSellers);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSavedProducts = async () => {
    try {
      const savedProductsData = await getAllProducts(1000); // Get all products to check saved status
      const savedIds = new Set<string>();
      
      for (const product of savedProductsData) {
        const isSaved = await isProductSavedByUser(user.uid, product.id);
        if (isSaved) {
          savedIds.add(product.id);
        }
      }
      
      setSavedProducts(savedIds);
    } catch (error) {
      console.error('Error loading saved products:', error);
    }
  };

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.tags?.some((tag: string) => 
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => 
        selectedCategories.includes(product.category || '')
      );
    }

    // Price range filter
    if (selectedPriceRange) {
      const range = PRICE_RANGES.find(r => r.label === selectedPriceRange);
      if (range) {
        filtered = filtered.filter(product => 
          product.price >= range.min && product.price <= range.max
        );
      }
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case "price_low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "popular":
        filtered.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
        break;
    }

    setFilteredProducts(filtered);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSaveToggle = async (productId: string) => {
    if (!isAuthenticated || !user) {
      // Redirect to login or show login modal
      return;
    }

    try {
      if (savedProducts.has(productId)) {
        await removeSavedProduct(user.uid, productId);
        setSavedProducts(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        await saveProductForUser(user.uid, productId);
        setSavedProducts(prev => new Set([...prev, productId]));
      }
    } catch (error) {
      console.error('Error toggling saved product:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedPriceRange("");
    setSortBy("newest");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
            <div className="flex items-center gap-4">
              <select 
                className="border rounded-lg px-3 py-2 bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Sort by: Newest First</option>
                <option value="oldest">Sort by: Oldest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
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
                {CATEGORIES.map((category) => (
                  <label key={category} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="rounded"
                      checked={selectedCategories.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                    />
                    <span>{category}</span>
                </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label key={range.label} className="flex items-center gap-2">
                    <input 
                      type="radio" 
                      name="priceRange"
                      className="rounded"
                      checked={selectedPriceRange === range.label}
                      onChange={() => setSelectedPriceRange(range.label)}
                    />
                    <span>{range.label}</span>
                </label>
                ))}
              </div>
            </div>

            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Results Summary */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search criteria or browse all products
                </p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative aspect-square">
                      {product.images && product.images.length > 0 ? (
                    <Image
                          src={product.images[0]}
                          alt={product.title}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100 rounded-t-lg">
                          <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Save Button */}
                      <button
                        onClick={() => handleSaveToggle(product.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
                          savedProducts.has(product.id)
                            ? 'bg-red-500 text-white hover:bg-red-600' 
                            : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${savedProducts.has(product.id) ? 'fill-current' : ''}`} />
                      </button>

                      {/* Status Badge */}
                      {product.status && product.status !== 'active' && (
                        <Badge className="absolute top-3 left-3 bg-yellow-500 text-white">
                          {product.status}
                      </Badge>
                    )}
                  </div>
                    
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                            className={`w-4 h-4 ${star <= Math.round(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                        <span className="text-sm text-gray-500 ml-1">
                          ({product.review_count || 0})
                        </span>
                      </div>
                      
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-semibold hover:text-green-600 transition-colors">
                          {product.title}
                        </h3>
                      </Link>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {product.category || 'Solar'} | {product.description?.substring(0, 50)}...
                      </p>

                      {/* Seller Info */}
                      {product.seller_name && (
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            {product.seller_verified && (
                              <BadgeCheck className="w-4 h-4 text-blue-500" />
                            )}
                            {product.seller_id ? (
                              <Link 
                                href={`/sellers/${product.seller_id}`}
                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                {product.seller_name}
                              </Link>
                            ) : (
                              <span className="font-medium">{product.seller_name}</span>
                            )}
                          </div>
                          {product.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>{product.location}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                        <span>Category: {product.category || 'Solar'}</span>
                        {product.views_count && (
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>{formatNumber(product.views_count)} views</span>
                          </div>
                        )}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        <div className="text-lg font-bold text-green-600">
                          {formatPrice(product.price)}
                        </div>
                        <Link href={`/products/${product.id}`}>
                      <Button variant="outline" className="text-sm">
                            View Details
                      </Button>
                        </Link>
                      </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Pagination */}
            {filteredProducts.length > 0 && (
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
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
} 