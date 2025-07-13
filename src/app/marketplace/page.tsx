"use client";
import { useState, useEffect } from "react";
import { getAllProducts, getSellerProfile } from "@/lib/firebaseHelpers";
import { ProductCard } from "@/app/components/product-card";
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  SlidersHorizontal,
  Star,
  MapPin,
  TrendingUp
} from "lucide-react";

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
  created_at: any;
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "Solar Panels",
    "Inverters", 
    "Batteries",
    "Charge Controllers",
    "Mounting Systems",
    "Accessories"
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

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
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange.min && product.price <= priceRange.max
    );

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

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange({ min: 0, max: 1000000 });
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Solar Marketplace</h1>
          <p className="text-gray-600 text-lg">
            Discover high-quality solar products from trusted sellers across Nigeria
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products, categories, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price Range and View Mode */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Price Range:</span>
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <span className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </span>
            {(searchTerm || selectedCategory || priceRange.min > 0 || priceRange.max < 1000000) && (
              <span className="text-sm text-green-600 bg-green-100 px-3 py-1 rounded-full">
                Filtered Results
              </span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or browse all products
            </p>
            <button
              onClick={clearFilters}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
              : "grid-cols-1"
          }`}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                className={viewMode === "list" ? "flex" : ""}
              />
            ))}
          </div>
        )}

        {/* Load More */}
        {filteredProducts.length > 0 && filteredProducts.length < products.length && (
          <div className="text-center mt-8">
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-lg border border-gray-300 font-medium transition-colors">
              Load More Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 