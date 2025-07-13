"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { SellerRouteGuard } from "@/lib/routeGuard";
import { 
  getProductsBySeller, 
  getInquiriesForSeller,
  getSellerProfile 
} from "@/lib/firebaseHelpers";
import { 
  Package, 
  MessageCircle, 
  TrendingUp, 
  Eye, 
  Star, 
  MapPin, 
  BadgeCheck,
  ShoppingCart,
  Plus,
  ArrowRight,
  DollarSign,
  Users,
  Calendar,
  Target,
  Award,
  Building2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  title: string;
  price: number;
  views_count: number;
  status: string;
  created_at: Date;
  rating: number;
  review_count: number;
}

interface Inquiry {
  id: string;
  status: string;
  created_at: Date;
}

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalInquiries: number;
  convertedInquiries: number;
  conversionRate: number;
  averageViewsPerProduct: number;
  totalRevenue: number;
  averageProductPrice: number;
  topPerformingProduct?: Product;
}

export default function SellerDashboard() {
  const { user, getDisplayName, getDisplayEmail } = useUser();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [profileCompleted, setProfileCompleted] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      // Load products, inquiries, and profile
      const [productsData, inquiriesData, profileData] = await Promise.all([
        getProductsBySeller(user.uid),
        getInquiriesForSeller(user.uid),
        getSellerProfile(user.uid)
      ]);

      // Process products
      const products: Product[] = productsData.map((product: any) => ({
        id: product.id,
        title: product.title || '',
        price: product.price || 0,
        views_count: product.views_count || 0,
        status: product.status || 'active',
        created_at: product.created_at?.toDate() || new Date(),
        rating: product.rating || 0,
        review_count: product.review_count || 0
      }));

      // Process inquiries
      const inquiries: Inquiry[] = inquiriesData.map((inquiry: any) => ({
        id: inquiry.id,
        status: inquiry.status || 'pending',
        created_at: inquiry.created_at?.toDate() || new Date()
      }));

      // Calculate statistics
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'active').length;
      const totalViews = products.reduce((sum, p) => sum + p.views_count, 0);
      const totalInquiries = inquiries.length;
      const convertedInquiries = inquiries.filter(i => i.status === 'converted').length;
      const conversionRate = totalInquiries > 0 ? (convertedInquiries / totalInquiries) * 100 : 0;
      const averageViewsPerProduct = totalProducts > 0 ? totalViews / totalProducts : 0;
      const totalRevenue = convertedInquiries * 50000; // Placeholder: assume average sale of 50k
      const averageProductPrice = totalProducts > 0 ? products.reduce((sum, p) => sum + p.price, 0) / totalProducts : 0;
      
      // Get top performing product (by views)
      const topPerformingProduct = products
        .filter(p => p.status === 'active')
        .sort((a, b) => b.views_count - a.views_count)[0];

      // Get recent products (last 5)
      const recentProducts = products
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(0, 5);

      // Get recent inquiries (last 5)
      const recentInquiries = inquiries
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(0, 5);

      setStats({
        totalProducts,
        activeProducts,
        totalViews,
        totalInquiries,
        convertedInquiries,
        conversionRate,
        averageViewsPerProduct,
        totalRevenue,
        averageProductPrice,
        topPerformingProduct
      });

      setRecentProducts(recentProducts);
      setRecentInquiries(recentInquiries);
      setProfileCompleted(profileData?.profile_completed || false);

    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'text-green-600';
      case 'contacted': return 'text-yellow-600';
      case 'pending': return 'text-blue-600';
      case 'lost': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <SellerRouteGuard>
        <div className="pt-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
          </div>
        </div>
      </SellerRouteGuard>
    );
  }

  if (!stats) {
    return (
      <SellerRouteGuard>
        <div className="pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium">Error</h3>
            <p className="text-red-700 text-sm">{error || "Failed to load dashboard data"}</p>
          </div>
        </div>
      </SellerRouteGuard>
    );
  }

  return (
    <SellerRouteGuard>
      <div className="pt-4">
        {/* Header */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Welcome back, <Link href="/dashboard/seller/profile" className="text-green-600 hover:text-green-700 font-medium">{getDisplayName()}</Link>! Here's your business overview
            </p>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {!profileCompleted && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <h3 className="font-medium text-yellow-800">Complete Your Profile</h3>
                <p className="text-yellow-700 text-sm">
                  Add your business information to improve your visibility and attract more customers.
                </p>
              </div>
              <Link
                href="/dashboard/seller/profile"
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Products</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeProducts}</p>
                <p className="text-sm text-gray-500 mt-1">
                  of {stats.totalProducts} total
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-blue-600">{formatNumber(stats.totalViews)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatNumber(stats.averageViewsPerProduct)} avg per product
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Leads</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.totalInquiries}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.conversionRate.toFixed(1)}% conversion
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-3xl font-bold text-purple-600">{formatPrice(stats.totalRevenue)}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {stats.convertedInquiries} sales
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
              <Link
                href="/dashboard/seller/my-products"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No products yet</p>
                <Link
                  href="/dashboard/seller/my-products/add"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{formatPrice(product.price)}</span>
                        <span>{product.views_count} views</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/seller/my-products/edit/${product.id}`}
                      className="text-green-600 hover:text-green-700"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Leads */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Leads</h3>
              <Link
                href="/dashboard/seller/leads"
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            {recentInquiries.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No leads yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {inquiry.created_at.toLocaleDateString()}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                        {inquiry.status}
                      </span>
                    </div>
                    <Link
                      href="/dashboard/seller/leads"
                      className="text-green-600 hover:text-green-700"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/dashboard/seller/my-products/add"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Add Product</h3>
                <p className="text-sm text-gray-600">List a new solar product</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/seller/leads"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Leads</h3>
                <p className="text-sm text-gray-600">Respond to inquiries</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/seller/analytics"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed insights</p>
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/seller/profile"
            className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Company Profile</h3>
                <p className="text-sm text-gray-600">Manage your business info</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Performance Tips */}
        {stats.activeProducts < 5 && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-start gap-4">
              <Award className="w-6 h-6 text-green-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Boost Your Sales</h3>
                <p className="text-gray-700 mb-3">
                  Add more products to increase your visibility and attract more customers. 
                  Sellers with 5+ products see 3x more leads on average.
                </p>
                <Link
                  href="/dashboard/seller/my-products/add"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add More Products
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </SellerRouteGuard>
  );
} 