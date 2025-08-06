"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingCart, 
  User, 
  Bell, 
  Heart, 
  Star, 
  Clock, 
  Grid3X3, 
  Package, 
  Watch, 
  Home,
  Filter,
  X,
  Sun,
  Battery,
  Zap,
  Settings,
  Wrench,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Award,
  Phone
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { mockProducts, filterOptions, categories } from "./data/mockProducts";
import type { Product } from "./data/mockProducts";
import { ProductCard } from "./components/product-card";
import "./styles/marketplace.css";
import { QuickCalculatorModal } from "./components/quick-calculator-modal";
import ToasterClient from "./components/ToasterClient";
import toast from "react-hot-toast";
import { useUser } from "../lib/UserContext";
import CartModal from "./components/CartModal";
import { logout } from "../lib/firebaseAuthHelpers";
import { useCart } from "../lib/CartContext";
import { getAllProductsWithSellers } from "../lib/firebaseHelpers";

// Map category IDs to icons
const categoryIcons = {
  panels: Sun,
  batteries: Battery,
  inverters: Zap,
  controllers: Settings,
  mounts: Wrench,
  accessories: Package
};

// Comment out hero slides array
/*
const heroSlides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=1920",
    title: "Uninterrupted Power",
    subtitle: "Reliable Backup Solutions for Your Home",
    tag: "#Energy Independence",
    discount: "Premium Batteries",
    cta: "Explore",
    theme: "dark"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=1920",
    title: "Professional Installation",
    subtitle: "Expert Solar Installation Services Nationwide",
    tag: "#Certified Installers",
    discount: "Free Consultation",
    cta: "Find Installers",
    theme: "dark"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?q=80&w=1920",
    title: "Smart Solar Solutions",
    subtitle: "Monitor & Optimize Your Energy Production",
    tag: "#Smart Technology",
    discount: "Live Tracking",
    cta: "Learn More",
    theme: "dark"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=1920",
    title: "Sustainable Living",
    subtitle: "Transform Your Home with Clean Solar Energy",
    tag: "#Go Green",
    discount: "50% OFF",
    cta: "Shop Now",
    theme: "dark"
  }
];
*/

function mapToProduct(raw: any): Product {
  return {
    id: raw.id,
    title: raw.title || '',
    description: raw.description || '',
    price: raw.price || 0,
    originalPrice: raw.originalPrice,
    images: raw.images || [],
    rating: raw.rating || 0,
    reviewCount: raw.reviewCount || 0,
    seller: raw.seller || {
      id: raw.seller_id || '',
      name: raw.seller_name || '',
      isVerified: raw.seller_verified || false,
      rating: 0,
    },
    category: raw.category || '',
    subCategory: raw.subCategory || '',
    powerOutput: raw.powerOutput || '',
    energyRating: raw.energyRating || '',
    specifications: raw.specifications || {},
    features: raw.features || [],
    stock: raw.stock || 0,
    tags: raw.tags || [],
    isNew: raw.isNew || false,
    isBestSeller: raw.isBestSeller || false,
    installationAvailable: raw.installationAvailable || false,
    deliveryFee: raw.deliveryFee || 0,
    createdAt: raw.createdAt || '',
  };
}

export default function MarketplacePage() {
  // Remove currentSlide state since we're commenting out the banner
  // const [currentSlide, setCurrentSlide] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [selectedPowerRanges, setSelectedPowerRanges] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const { user, userProfile, userType, isAuthenticated, getDisplayName } = useUser();
  const { cart, addToCart, removeFromCart, cartCount } = useCart();

  // Replace mockProducts with fetched products using the canonical adapter
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => {
    async function fetchProducts() {
      const data = await getAllProductsWithSellers(50);
      setProducts(data.map(mapToProduct));
    }
    fetchProducts();
  }, []);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        try {
          setWishlist(JSON.parse(storedWishlist));
        } catch (error) {
          console.error('Error loading wishlist from localStorage:', error);
        }
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist]);

  // Close profile menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileMenuOpen]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const getProfileLink = () => {
    if (userType === 'seller') {
      return '/dashboard/seller/profile';
    }
    if (userType === 'installer') {
      return '/dashboard/installer/profile';
    }
    if (userType === 'buyer') {
      return '/dashboard/buyer';
    }
    return '/dashboard';
  };

  const handleToggleWishlist = (product: Product, liked: boolean) => {
    if (liked) {
      setWishlist(prev => prev.filter(p => p.id !== product.id));
      toast.success(`${product.title} removed from wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      toast.success(`${product.title} added to wishlist`);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = products.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.subCategory.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 5));
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
    }
  };

  // Get flash sale products (20 products)
  const flashSaleProducts = products
    .filter(p => p.originalPrice && p.originalPrice > p.price)
    .slice(0, 20);

  // Get today's picks (20 products)
  const todaysPicks = products
    .filter(p => p.rating >= 4.5 || p.isBestSeller)
    .slice(0, 20);

  // Filter logic
  const applyFilters = (products: Product[]) => {
    return products.filter(product => {
      // Price
      let priceMatch = true;
      if (selectedPriceRanges.length > 0 && product.price) {
        priceMatch = filterOptions.priceRanges.some(range =>
          selectedPriceRanges.includes(range.id) &&
          product.price >= range.min && product.price <= range.max
        );
      }
      // Power Output
      let powerMatch = true;
      if (selectedPowerRanges.length > 0 && product.powerOutput) {
        const powerValue = parseInt(product.powerOutput.replace(/\D/g, ''));
        powerMatch = filterOptions.powerOutputRanges.some(range =>
          selectedPowerRanges.includes(range.id) &&
          powerValue >= range.min && powerValue <= range.max
        );
      }
      // Rating
      let ratingMatch = true;
      if (selectedRatings.length > 0 && product.rating) {
        ratingMatch = filterOptions.ratings.some(rating =>
          selectedRatings.includes(rating.id) &&
          product.rating >= rating.value
        );
      }
      // Stock/Availability
      let availabilityMatch = true;
      if (selectedAvailability.length > 0) {
        availabilityMatch = selectedAvailability.some(option => {
          if (option === 'inStock') return product.stock > 0;
          if (option === 'installation') return product.installationAvailable;
          if (option === 'freeDelivery') return product.deliveryFee === 0;
          return true;
        });
      }
      return priceMatch && powerMatch && ratingMatch && availabilityMatch;
    });
  };

  // Filtered products
  const filteredFlashSaleProducts = applyFilters(flashSaleProducts);
  const filteredTodaysPicks = applyFilters(todaysPicks);

  // Handlers for filter checkboxes
  const handleFilterChange = (type: string, id: string, checked: boolean) => {
    if (type === 'price') {
      setSelectedPriceRanges(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    } else if (type === 'power') {
      setSelectedPowerRanges(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    } else if (type === 'rating') {
      setSelectedRatings(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    } else if (type === 'availability') {
      setSelectedAvailability(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
    }
  };

  const handleClearFilters = () => {
    setSelectedPriceRanges([]);
    setSelectedPowerRanges([]);
    setSelectedRatings([]);
    setSelectedAvailability([]);
  };

  // Get certified installers (keep as is)
  const certifiedInstallers = [
    {
      id: 1,
      name: "SolarTech Solutions",
      image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?q=80&w=400",
      location: "Lagos, Nigeria",
      rating: 4.8,
      reviews: 156,
      certifications: ["NABCEP Certified", "ISO 9001"],
      services: ["Installation", "Maintenance", "Consultation"]
    },
    {
      id: 2,
      name: "GreenPower Experts",
      image: "https://images.unsplash.com/photo-1581092162384-8987c1d64926?q=80&w=400",
      location: "Abuja, Nigeria",
      rating: 4.7,
      reviews: 124,
      certifications: ["SEI Certified", "IEC Standards"],
      services: ["Installation", "Repairs", "System Design"]
    },
    {
      id: 3,
      name: "EcoSolar Nigeria",
      image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=400",
      location: "Port Harcourt, Nigeria",
      rating: 4.9,
      reviews: 98,
      certifications: ["NABCEP Certified", "Quality Management"],
      services: ["Installation", "Monitoring", "Maintenance"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <ToasterClient />
      
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Home */}
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
              <Link href="/home">
                <Button className="ml-2 bg-green-600 hover:bg-green-700 text-white px-2 py-2 rounded-full flex items-center" size="icon">
                  <Home className="w-5 h-5 text-white" />
                </Button>
              </Link>
            </div>

            {/* Search bar (hidden on mobile) */}
            <div className="flex-1 max-w-2xl mx-8 hidden md:block">
              <div className="relative">
                <Input
                  placeholder="Search solar products, inverters, batteries..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-4 pr-12 h-10 focus:ring-2 focus:ring-green-500 transition-all"
                />
                <Button 
                  size="sm" 
                  className="absolute right-1 top-1 h-8 bg-green-600 hover:bg-green-700 transition-colors"
                >
                  <Search className="w-4 h-4" />
                </Button>
                
                {/* Search Results Dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      <div className="max-h-[70vh] overflow-y-auto">
                        {searchResults.map((product) => (
                          <Link
                            key={product.id}
                            href={`/products/${product.id}`}
                            className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                            onClick={() => setShowSearchResults(false)}
                          >
                            <div className="relative w-16 h-16">
                              <Image
                                src={product.images[0]}
                                alt={product.title}
                                fill
                                className="object-cover rounded-lg"
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {product.title}
                              </h4>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.category} • {product.subCategory}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-sm font-semibold text-green-600">
                                  ₦{product.price.toLocaleString()}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs text-gray-500 line-through">
                                    ₦{product.originalPrice.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        No products found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop nav actions */}
            <div className="hidden md:flex items-center gap-4">
              <QuickCalculatorModal />
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <div className="relative">
                  <Heart className="w-5 h-5" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon" onClick={handleCartClick}>
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
              <div className="relative" ref={profileMenuRef}>
                <Button variant="ghost" size="icon" onClick={() => setProfileMenuOpen((v) => !v)} aria-label="Profile menu">
                  {userProfile?.profile_picture_url ? (
                    <Image
                      src={userProfile.profile_picture_url}
                      alt="avatar"
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
                {profileMenuOpen && (
                  <div className="absolute right-0 top-full w-56 bg-white rounded shadow-2xl py-2 z-50">
                    {isAuthenticated && user ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <Link 
                            href={getProfileLink()}
                            className="text-gray-800 font-semibold hover:text-green-600 transition-colors block"
                            onClick={() => setProfileMenuOpen(false)}
                          >
                            {getDisplayName()}
                          </Link>
                        </div>
                        <Link href="/dashboard" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Dashboard</Link>
                        {userType === 'seller' && (
                          <Link href="/dashboard/seller/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Company Profile</Link>
                        )}
                        {userType === 'installer' && (
                          <Link href="/dashboard/installer/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Company Profile</Link>
                        )}
                        {userType === 'buyer' && (
                          <Link href="/dashboard/buyer" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>My Account</Link>
                        )}
                        <Link href="/dashboard/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Settings</Link>
                        <button onClick={() => { logout(); setProfileMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100 text-gray-800 font-semibold">Not logged in</div>
                        <Link href="/login" className="block px-4 py-2 text-green-600 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Login</Link>
                        <Link href="/register" className="block px-4 py-2 text-yellow-600 hover:bg-gray-100" onClick={() => setProfileMenuOpen(false)}>Register</Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Hamburger for mobile */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              aria-label="Open navigation menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile nav menu */}
          <AnimatePresence>
            {mobileNavOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg z-50 border-b"
              >
                <div className="flex flex-col items-stretch p-4 gap-2">
                  <QuickCalculatorModal />
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="justify-start"
                    onClick={() => {
                      setMobileNavOpen(false);
                      toast.success("No new notifications");
                    }}
                  >
                    <Bell className="w-5 h-5 mr-2" /> Notifications
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="justify-start"
                    onClick={() => {
                      setMobileNavOpen(false);
                      toast.success(`You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist`);
                    }}
                  >
                    <div className="relative">
                      <Heart className="w-5 h-5 mr-2" />
                      {wishlist.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                          {wishlist.length}
                        </span>
                      )}
                    </div>
                    Wishlist
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="justify-start"
                    onClick={() => {
                      setMobileNavOpen(false);
                      handleCartClick();
                    }}
                  >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full px-1.5 py-0.5 font-bold">
                          {cartCount}
                        </span>
                      )}
                    </div>
                    Cart
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="lg" 
                    className="justify-start"
                    onClick={() => {
                      setMobileNavOpen(false);
                      setProfileMenuOpen(true);
                    }}
                  >
                    <User className="w-5 h-5 mr-2" /> Profile
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Categories */}
      <section className="bg-white py-8 border-b">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
          </div>
          
          {/* Horizontal scrollable categories on mobile */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category, index) => {
              const Icon = categoryIcons[category.id as keyof typeof categoryIcons];
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategories(prev => 
                      isSelected
                        ? prev.filter(id => id !== category.id)
                        : [...prev, category.id]
                    );
                  }}
                  className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-green-50 border-green-200 text-green-700'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="text-sm font-medium whitespace-nowrap">
                    {category.name}
                  </span>
                  {isSelected && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flash Sale */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-2xl font-bold">Flash Sale</h2>
              </div>
              <div className="flex items-center space-x-2">
                <motion.div
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  05
                </motion.div>
                <span>:</span>
                <motion.div
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.33 }}
                >
                  10
                </motion.div>
                <span>:</span>
                <motion.div
                  className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.66 }}
                >
                  45
                </motion.div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setShowFilters(true)} className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Link href="/products?filter=sale" passHref>
                <Button variant="outline">See All</Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredFlashSaleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={!!wishlist.find(p => p.id === product.id)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certified Installers */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-2"
              >
                Certified Installers
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600"
              >
                Professional installation services nationwide
              </motion.p>
            </div>

            <Link href="/installers" passHref>
              <Button variant="outline">View All</Button>
                  </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifiedInstallers.map((installer, index) => (
              <motion.div
                key={installer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/installers/${installer.id}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative h-48">
                        <Image
                          src={installer.image}
                          alt={installer.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-lg mb-1">{installer.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{installer.location}</p>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">
                              {installer.rating}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            ({installer.reviews} reviews)
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {installer.certifications.map((cert, i) => (
                            <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700">
                              {cert}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {installer.services.map((service, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Today's For You */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-2xl font-bold mb-2"
              >
                Today's For You!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-gray-600"
              >
                Curated selections based on your preferences
              </motion.p>
            </div>

            <div className="flex gap-2">
              <Link href="/products?filter=best-seller" passHref>
                <Badge variant="secondary" className="bg-green-100 text-green-700 cursor-pointer hover:scale-105 transition-transform">
                  Best Seller
                </Badge>
                  </Link>
              <Link href="/products?filter=eco-friendly" passHref>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 cursor-pointer hover:scale-105 transition-transform">
                  Eco Friendly
                </Badge>
                  </Link>
              <Link href="/products?filter=special-discount" passHref>
                <Badge variant="secondary" className="bg-green-100 text-green-700 cursor-pointer hover:scale-105 transition-transform">
                  Special Discount
                </Badge>
                  </Link>
              <Link href="/products?filter=installation" passHref>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 cursor-pointer hover:scale-105 transition-transform">
                  Installation
                </Badge>
                  </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTodaysPicks.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard
                  product={product}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  isWishlisted={!!wishlist.find(p => p.id === product.id)}
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/products" passHref>
              <Button variant="outline" size="lg" className="hover:bg-green-50">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Filters Sidebar */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50"
              onClick={() => setShowFilters(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
          </div>

              <div className="p-4 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {filterOptions.priceRanges.map(range => (
                      <label key={range.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="rounded text-green-500 focus:ring-green-500"
                          checked={selectedPriceRanges.includes(range.id)}
                          onChange={e => handleFilterChange('price', range.id, e.target.checked)}
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Power Output */}
                <div>
                  <h3 className="font-medium mb-3">Power Output</h3>
                  <div className="space-y-2">
                    {filterOptions.powerOutputRanges.map(range => (
                      <label key={range.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="rounded text-green-500 focus:ring-green-500"
                          checked={selectedPowerRanges.includes(range.id)}
                          onChange={e => handleFilterChange('power', range.id, e.target.checked)}
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-3">Rating</h3>
                  <div className="space-y-2">
                    {filterOptions.ratings.map(rating => (
                      <label key={rating.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="rounded text-green-500 focus:ring-green-500"
                          checked={selectedRatings.includes(rating.id)}
                          onChange={e => handleFilterChange('rating', rating.id, e.target.checked)}
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{rating.label}</span>
                          {rating.value > 0 && (
                            <div className="flex text-yellow-400">
                              {[...Array(rating.value)].map((_, i) => (
                                <Star key={i} className="w-3 h-3 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="space-y-2">
                    {filterOptions.availability.map(option => (
                      <label key={option.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <input
                          type="checkbox"
                          className="rounded text-green-500 focus:ring-green-500"
                          checked={selectedAvailability.includes(option.id)}
                          onChange={e => handleFilterChange('availability', option.id, e.target.checked)}
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={handleClearFilters}>
                    Clear All
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
                </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-500">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl font-bold text-white mb-4"
            >
              Ready to Switch to Solar?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-green-50 mb-8"
            >
              Join thousands of satisfied customers who have made the switch to clean, renewable energy.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Link href="/calculator" passHref>
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50">
                  Calculate Your Savings
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li><Link href="/products?category=solar-panels" className="hover:text-white transition-colors">Solar Panels</Link></li>
                <li><Link href="/products?category=inverters" className="hover:text-white transition-colors">Inverters</Link></li>
                <li><Link href="/products?category=batteries" className="hover:text-white transition-colors">Batteries</Link></li>
                <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li><Link href="/installers" className="hover:text-white transition-colors">Installation</Link></li>
                <li><Link href="/calculator" className="hover:text-white transition-colors">Solar Calculator</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Consultation</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/warranty" className="hover:text-white transition-colors">Warranty</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} GreenFlux Energy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Click outside handler for search results */}
      {showSearchResults && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowSearchResults(false)}
        />
      )}
      <CartModal
        open={showCartModal}
        onClose={() => setShowCartModal(false)}
        cart={cart}
        onRemove={removeFromCart}
      />
    </div>
  );
}
