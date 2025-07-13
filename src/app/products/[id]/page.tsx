"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Share2, 
  Heart, 
  Shield, 
  Check, 
  ChevronRight,
  Sun,
  Battery,
  Zap,
  ShoppingCart,
  ArrowLeft,
  Building2,
  BadgeCheck,
  Eye
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import Footer from "../../components/footer"
import { getProduct, getSellerProfile, saveProductForUser, removeSavedProduct, isProductSavedByUser, updateProduct } from "@/lib/firebaseHelpers"
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

interface SellerProfile {
  business_name: string;
  company_name: string;
  contact_person_name: string;
  email: string;
  phone_number: string;
  company_description: string;
  company_logo_url: string;
  address: string;
  city: string;
  state: string;
  website: string;
  years_in_business: number;
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  is_premium: boolean;
  total_products: number;
  total_sales: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { user, isAuthenticated } = useUser();
  const [selectedImage, setSelectedImage] = useState(0);
  const [contactMethod, setContactMethod] = useState("whatsapp");
  const [product, setProduct] = useState<Product | null>(null);
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (id) {
      loadProductData();
      // Add to recently viewed products in localStorage
      try {
        const key = 'recentlyViewedProducts';
        let viewed = [];
        if (typeof window !== 'undefined') {
          viewed = JSON.parse(localStorage.getItem(key) || '[]');
          // Remove if already present
          viewed = viewed.filter((pid: string) => pid !== id);
          // Add to front
          viewed.unshift(id);
          // Limit to 12
          if (viewed.length > 12) viewed = viewed.slice(0, 12);
          localStorage.setItem(key, JSON.stringify(viewed));
        }
      } catch (err) {
        // Ignore localStorage errors
      }
    }
  }, [id]);

  useEffect(() => {
    if (product && isAuthenticated && user) {
      checkIfSaved();
    }
  }, [product, isAuthenticated, user]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      setError("");

      const productData = await getProduct(id as string);
      if (!productData) {
        setError("Product not found");
        return;
      }

      // Increment views_count
      try {
        await updateProduct(productData.id, {
          views_count: (productData.views_count || 0) + 1
        });
      } catch (err) {
        console.error('Error incrementing product views:', err);
      }

      // Fetch seller profile if seller_id exists
      let sellerData = null;
      if (productData.seller_id) {
        try {
          sellerData = await getSellerProfile(productData.seller_id);
        } catch (error) {
          console.error('Error fetching seller profile:', error);
        }
      }

      setProduct({ ...productData, views_count: (productData.views_count || 0) + 1 } as Product);
      setSeller(sellerData as SellerProfile);
    } catch (err: any) {
      console.error('Error loading product:', err);
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    try {
      const saved = await isProductSavedByUser(user.uid, product!.id);
      setIsSaved(saved);
    } catch (error) {
      console.error('Error checking saved status:', error);
    }
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated || !user) {
      // Redirect to login or show login modal
      return;
    }

    setSaving(true);
    try {
      if (isSaved) {
        await removeSavedProduct(user.uid, product!.id);
        setIsSaved(false);
      } else {
        await saveProductForUser(user.uid, product!.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling saved product:', error);
    } finally {
      setSaving(false);
    }
  };
  
  // Format price to Nigerian Naira
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1833] to-[#1a365d] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0a1833] to-[#1a365d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-400 mb-2">Product Not Found</h1>
            <p className="text-red-300 mb-4">{error || "The product you're looking for doesn't exist."}</p>
            <Link
              href="/marketplace"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const sellerName = seller?.business_name || seller?.company_name || product.seller_name || 'Unknown Seller';
  const sellerVerified = seller?.is_verified || product.seller_verified || false;
  const sellerLogo = seller?.company_logo_url || product.seller_logo || '';

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0a1833] to-[#1a365d] text-white">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center text-sm text-gray-400">
          <Link href="/marketplace" className="hover:text-green-400">
            Marketplace
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href="/products" className="hover:text-green-400">
            Products
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <Link href={`/products?category=${product.category}`} className="hover:text-green-400">
            {product.category || 'Solar'}
          </Link>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-300 truncate">{product.title}</span>
        </div>
      </div>

      {/* Back Button (Mobile) */}
      <div className="md:hidden max-w-7xl mx-auto px-4 mb-4">
        <Link href="/marketplace">
          <Button variant="outline" className="border-white/20 hover:bg-white/10">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>

      {/* Product Details Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Images */}
            <div className="lg:w-1/2">
              <div className="relative aspect-square rounded-xl overflow-hidden mb-4 border border-white/10">
                {product.images && product.images.length > 0 ? (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                {product.is_negotiable && (
                  <Badge className="absolute top-4 right-4 bg-yellow-500/80">
                    Price Negotiable
                  </Badge>
                )}
              </div>
              
              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-green-500"
                        : "border-white/20"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.title} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="lg:w-1/2">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-green-500/20 text-green-400 mb-2">
                    {product.category || 'Solar'}
                  </Badge>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="border-white/20 hover:bg-white/10"
                      onClick={handleSaveToggle}
                      disabled={saving}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button variant="outline" size="icon" className="border-white/20 hover:bg-white/10">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= Math.round(product.rating || 0)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-300">
                    {product.rating || 0} ({product.review_count || 0} reviews)
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {formatPrice(product.price)}
                  </div>
                  <div className="flex items-center text-sm text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {product.location || 'Location not specified'}
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">
                  {product.description}
                </p>

                {/* Seller Information */}
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Seller Information
                  </h3>
                  {seller ? (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                        {seller.is_verified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                        <span className="font-medium text-blue-200 text-lg">
                          {seller.business_name || seller.company_name}
                        </span>
                      </div>
                      <div className="text-sm text-gray-300 mb-1">
                        {seller.city && seller.state && (
                          <span>{seller.city}, {seller.state}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-300 mb-1">
                        {seller.email && <span>Email: {seller.email}</span>}
                      </div>
                      <div className="text-sm text-gray-300 mb-1">
                        {seller.phone_number && <span>Phone: {seller.phone_number}</span>}
                      </div>
                      {/* Add more seller info as needed */}
                    </>
                  ) : (
                    <div className="text-red-400 font-medium">Seller profile not available. This seller has not completed their business profile.</div>
                  )}
                </div>
                
                {/* Specifications */}
                {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Specifications</h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-sm">
                            <span className="text-gray-400">{key}:</span> {value as string}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Tags */}
                {product.tags && product.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <Badge key={index} className="bg-green-500/20 text-green-400">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
                  <span>Category: {product.category || 'Solar'}</span>
                  {product.views_count && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{formatNumber(product.views_count)} views</span>
                    </div>
                  )}
                  </div>
                  
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700">
                      <MessageCircle className="w-4 h-4 mr-2" />
                    Send Inquiry
                    </Button>
                  <Button variant="outline" className="border-white/20 hover:bg-white/10">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Seller
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 