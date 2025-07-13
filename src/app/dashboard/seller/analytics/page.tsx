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
  TrendingUp, 
  TrendingDown, 
  Eye, 
  MessageCircle, 
  DollarSign, 
  Package,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  AlertCircle
} from "lucide-react";

interface Product {
  id: string;
  title: string;
  price: number;
  views_count: number;
  status: string;
  created_at: Date;
}

interface Inquiry {
  id: string;
  status: string;
  created_at: Date;
  product_id?: string;
}

interface AnalyticsData {
  totalProducts: number;
  activeProducts: number;
  totalViews: number;
  totalInquiries: number;
  conversionRate: number;
  averageViewsPerProduct: number;
  topPerformingProducts: Product[];
  recentInquiries: Inquiry[];
  monthlyStats: {
    products: number;
    views: number;
    inquiries: number;
  };
}

export default function SellerAnalyticsPage() {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState("30"); // days

  useEffect(() => {
    if (user) {
      loadAnalytics();
    }
  }, [user, timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      // Load products and inquiries
      const [productsData, inquiriesData] = await Promise.all([
        getProductsBySeller(user.uid),
        getInquiriesForSeller(user.uid)
      ]);

      // Process products data
      const products: Product[] = productsData.map((product: any) => ({
        id: product.id,
        title: product.title || '',
        price: product.price || 0,
        views_count: product.views_count || 0,
        status: product.status || 'active',
        created_at: product.created_at?.toDate() || new Date()
      }));

      // Process inquiries data
      const inquiries: Inquiry[] = inquiriesData.map((inquiry: any) => ({
        id: inquiry.id,
        status: inquiry.status || 'pending',
        created_at: inquiry.created_at?.toDate() || new Date(),
        product_id: inquiry.product_id
      }));

      // Calculate analytics
      const totalProducts = products.length;
      const activeProducts = products.filter(p => p.status === 'active').length;
      const totalViews = products.reduce((sum, p) => sum + p.views_count, 0);
      const totalInquiries = inquiries.length;
      const convertedInquiries = inquiries.filter(i => i.status === 'converted').length;
      const conversionRate = totalInquiries > 0 ? (convertedInquiries / totalInquiries) * 100 : 0;
      const averageViewsPerProduct = totalProducts > 0 ? totalViews / totalProducts : 0;

      // Get top performing products (by views)
      const topPerformingProducts = products
        .filter(p => p.status === 'active')
        .sort((a, b) => b.views_count - a.views_count)
        .slice(0, 5);

      // Get recent inquiries
      const recentInquiries = inquiries
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
        .slice(0, 10);

      // Calculate monthly stats (last 30 days)
      const daysAgo = new Date();
      daysAgo.setDate(daysAgo.getDate() - parseInt(timeRange));
      
      const monthlyProducts = products.filter(p => p.created_at >= daysAgo).length;
      const monthlyInquiries = inquiries.filter(i => i.created_at >= daysAgo).length;
      const monthlyViews = products
        .filter(p => p.created_at >= daysAgo)
        .reduce((sum, p) => sum + p.views_count, 0);

      setAnalyticsData({
        totalProducts,
        activeProducts,
        totalViews,
        totalInquiries,
        conversionRate,
        averageViewsPerProduct,
        topPerformingProducts,
        recentInquiries,
        monthlyStats: {
          products: monthlyProducts,
          views: monthlyViews,
          inquiries: monthlyInquiries
        }
      });

    } catch (err: any) {
      console.error('Error loading analytics:', err);
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-NG').format(num);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      minimumFractionDigits: 0 
    }).format(amount);
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

  if (!analyticsData) {
    return (
      <SellerRouteGuard>
        <div className="pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm">{error || "Failed to load analytics"}</p>
              </div>
            </div>
          </div>
        </div>
      </SellerRouteGuard>
    );
  }

  return (
    <SellerRouteGuard>
      <div className="pt-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your business performance and insights
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Time Range Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Time Range:</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.totalProducts)}</p>
                <p className="text-sm text-green-600 mt-1">
                  {analyticsData.activeProducts} active
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.totalViews)}</p>
                <p className="text-sm text-green-600 mt-1">
                  {formatNumber(analyticsData.averageViewsPerProduct)} avg per product
                </p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Inquiries</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.totalInquiries)}</p>
                <p className="text-sm text-green-600 mt-1">
                  {analyticsData.conversionRate.toFixed(1)}% conversion rate
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Activity</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(analyticsData.monthlyStats.inquiries)}</p>
                <p className="text-sm text-green-600 mt-1">
                  {formatNumber(analyticsData.monthlyStats.views)} views this month
                </p>
              </div>
              <Activity className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Charts and Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Performing Products */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            
            {analyticsData.topPerformingProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No products with views yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {analyticsData.topPerformingProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-600">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatNumber(product.views_count)}</p>
                      <p className="text-sm text-gray-600">views</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Inquiries */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Inquiries</h3>
              <MessageCircle className="w-5 h-5 text-blue-500" />
            </div>
            
            {analyticsData.recentInquiries.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No inquiries yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {analyticsData.recentInquiries.slice(0, 5).map((inquiry) => (
                  <div key={inquiry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600">
                        {inquiry.created_at.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-900">
                        {inquiry.product_id ? 'Product inquiry' : 'General inquiry'}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Target className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Conversion Rate</h4>
              <p className="text-2xl font-bold text-green-600">
                {analyticsData.conversionRate.toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {analyticsData.totalInquiries} total inquiries
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Avg Views per Product</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatNumber(analyticsData.averageViewsPerProduct)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {analyticsData.activeProducts} active products
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <PieChart className="w-8 h-8 text-purple-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">Product Activity</h4>
              <p className="text-2xl font-bold text-purple-600">
                {analyticsData.monthlyStats.products}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                new products this month
              </p>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          
          <div className="space-y-3">
            {analyticsData.totalProducts === 0 && (
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-blue-500" />
                <p className="text-gray-700">Add your first product to start receiving inquiries</p>
              </div>
            )}
            
            {analyticsData.averageViewsPerProduct < 10 && analyticsData.totalProducts > 0 && (
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-yellow-500" />
                <p className="text-gray-700">Consider optimizing your product descriptions and images to increase views</p>
              </div>
            )}
            
            {analyticsData.conversionRate < 20 && analyticsData.totalInquiries > 0 && (
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-red-500" />
                <p className="text-gray-700">Focus on responding quickly to inquiries to improve conversion rates</p>
              </div>
            )}
            
            {analyticsData.activeProducts < 5 && (
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <p className="text-gray-700">Adding more products can increase your visibility and sales opportunities</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SellerRouteGuard>
  );
} 