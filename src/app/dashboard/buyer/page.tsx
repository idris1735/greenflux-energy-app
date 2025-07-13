"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { BuyerRouteGuard } from "@/lib/routeGuard";
import { 
  getSavedProductsForUser, 
  getInquiriesForBuyer, 
  getAllProducts,
  getProduct,
  getSellerProfile,
  removeSavedProduct 
} from "@/lib/firebaseHelpers";
import { 
  Heart, 
  MessageCircle, 
  TrendingUp, 
  Eye, 
  Star, 
  MapPin, 
  BadgeCheck,
  ShoppingCart,
  Calculator,
  ArrowRight,
  Clock,
  Package,
  DollarSign
} from "lucide-react";
import Link from "next/link";

interface SavedProduct {
  id: string;
  product_id: string;
  saved_at: Date;
  product?: any;
}

interface Inquiry {
  id: string;
  product_id: string;
  seller_id: string;
  message: string;
  status: string;
  created_at: Date;
  product?: any;
  seller?: any;
}

export default function BuyerDashboard() {
  const { user, userProfile, getDisplayName } = useUser();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  // Remove the totalViews and potentialSavings stats from the stats object and UI
  const [stats, setStats] = useState({
    savedCount: 0,
    inquiryCount: 0
  });

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  // Fetch recently viewed products from localStorage
  useEffect(() => {
    async function fetchRecentlyViewed() {
      if (typeof window !== 'undefined') {
        const key = 'recentlyViewedProducts';
        const ids = JSON.parse(localStorage.getItem(key) || '[]');
        if (ids.length > 0) {
          // Fetch product details for each ID
          const prods = await Promise.all(ids.map(async (pid: string) => {
            try {
              return await getProduct(pid);
            } catch {
              return null;
            }
          }));
          setRecentlyViewed(prods.filter(Boolean));
        } else {
          setRecentlyViewed([]);
        }
      }
    }
    fetchRecentlyViewed();
  }, [loading]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load saved products
      const savedProductsData = await getSavedProductsForUser(user.uid);
      const savedProductsWithDetails = await Promise.all(
        savedProductsData.map(async (saved: any) => {
          const product = await getProduct(saved.product_id);
          return { 
            id: saved.id,
            product_id: saved.product_id,
            saved_at: saved.saved_at,
            product 
          };
        })
      );
      setSavedProducts(savedProductsWithDetails);

      // Load inquiries
      const inquiriesData = await getInquiriesForBuyer(user.uid);
      const inquiriesWithDetails = await Promise.all(
        inquiriesData.map(async (inquiry: any) => {
          const [product, seller] = await Promise.all([
            getProduct(inquiry.product_id),
            getSellerProfile(inquiry.seller_id)
          ]);
          return { 
            id: inquiry.id,
            product_id: inquiry.product_id,
            seller_id: inquiry.seller_id,
            message: inquiry.message,
            status: inquiry.status,
            created_at: inquiry.created_at,
            product, 
            seller 
          };
        })
      );
      setInquiries(inquiriesWithDetails);

      // Load recent marketplace products
      const recentProductsData = await getAllProducts(6);
      setRecentProducts(recentProductsData);

      // Calculate stats
      setStats({
        savedCount: savedProductsWithDetails.length,
        inquiryCount: inquiriesWithDetails.length
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSaved = async (productId: string) => {
    try {
      await removeSavedProduct(user.uid, productId);
      setSavedProducts(prev => prev.filter(item => item.product_id !== productId));
      setStats(prev => ({ ...prev, savedCount: prev.savedCount - 1 }));
    } catch (error) {
      console.error('Error removing saved product:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <BuyerRouteGuard>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </BuyerRouteGuard>
    );
  }

  return (
    <BuyerRouteGuard>
      <div className="pt-4 max-w-7xl mx-auto px-4">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, <Link href="/dashboard/buyer" className="text-green-600 hover:text-green-700 font-medium">{typeof getDisplayName === "function" ? getDisplayName() : (userProfile?.full_name || userProfile?.first_name || user?.email || "User")}</Link>!
            </h1>
            <p className="text-gray-600">
              Track your solar journey and manage your inquiries
            </p>
          </div>
          <div>
            <Link href="/dashboard/settings" className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
              Profile & Settings
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-green-600">{stats.savedCount}</span>
            <span className="text-gray-600 mt-2">Saved Products</span>
          </div>
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-blue-600">{stats.inquiryCount}</span>
            <span className="text-gray-600 mt-2">Inquiries</span>
          </div>
        </div>

        {/* Recently Viewed Products Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-blue-500" />
            Recently Viewed Products
          </h2>
          {recentlyViewed.length === 0 ? (
            <div className="text-gray-400 text-center py-8 italic">You have not viewed any products recently.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewed.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-bold text-green-600">
                        {formatPrice(product.price)}
                      </span>
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">{product.rating}</span>
                          <span className="text-xs text-gray-500">({product.review_count})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <Link href={`/products/${product.id}`} className="text-green-600 hover:underline text-sm">View Product</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Saved Products Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Saved Products
          </h2>
          {savedProducts.length === 0 ? (
            <div className="text-gray-400 text-center py-8 italic">You have no saved products yet. Browse the marketplace and save products you like!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProducts.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  {item.product ? (
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-green-600">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium">{item.product.rating}</span>
                            <span className="text-xs text-gray-500">({item.product.review_count})</span>
                          </div>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {item.product.description}
                      </p>
                      <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                        {item.product.seller_name ? (
                          <span className="font-medium">{item.product.seller_name}</span>
                        ) : (
                          <span className="text-gray-400">Unknown Seller</span>
                        )}
                      </div>
                      <button onClick={() => handleRemoveSaved(item.product_id)} className="text-red-500 hover:underline text-sm">Remove</button>
                    </div>
                  ) : (
                    <div className="p-4 text-red-400 font-medium">This product is no longer available.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inquiries Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            Inquiries
          </h2>
          {inquiries.length === 0 ? (
            <div className="text-gray-400 text-center py-8 italic">You have not made any inquiries yet. Inquire about a product to get started!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inquiries.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                  {item.product && item.seller ? (
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
                        {item.product.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                        <span className="font-medium">Seller:</span>
                        <span>{item.seller.business_name || item.seller.company_name || "Unknown Seller"}</span>
                      </div>
                      <div className="text-sm text-gray-500 mb-2">Status: {item.status}</div>
                      <div className="text-xs text-gray-400 mb-2">{getTimeAgo(new Date(item.created_at))}</div>
                      <Link href={`/products/${item.product.id}`} className="text-green-600 hover:underline text-sm">View Product</Link>
                    </div>
                  ) : (
                    <div className="p-4 text-red-400 font-medium">This inquiry is no longer available (product or seller missing).</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BuyerRouteGuard>
  );
} 