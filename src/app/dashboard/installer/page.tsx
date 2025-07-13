"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { InstallerRouteGuard } from "@/lib/routeGuard";
import { 
  getInstallerProfile, 
  getInstallerStats,
  getLeadsForInstaller,
  getReviewsForInstaller
} from "@/lib/firebaseHelpers";
import { 
  User, 
  MessageCircle, 
  Star, 
  Calendar,
  TrendingUp,
  DollarSign,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  Award
} from "lucide-react";
import Link from "next/link";

interface Lead {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  project_type: string;
  location: string;
  description: string;
  status: string;
  created_at: Date;
  amount?: number;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: Date;
}

export default function InstallerDashboard() {
  const { user, userProfile, getDisplayName } = useUser();
  const [installerProfile, setInstallerProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    total_leads: 0,
    completed_leads: 0,
    pending_leads: 0,
    total_earnings: 0,
    average_rating: 0,
    review_count: 0,
    is_available: false
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [recentReviews, setRecentReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load installer profile and stats
      const [profile, statsData] = await Promise.all([
        getInstallerProfile(user.uid),
        getInstallerStats(user.uid)
      ]);
      
      setInstallerProfile(profile);
      setStats(statsData);

      // Load recent leads and reviews
      const [leads, reviews] = await Promise.all([
        getLeadsForInstaller(user.uid),
        getReviewsForInstaller(user.uid)
      ]);
      
      setRecentLeads(leads.slice(0, 5) as Lead[]);
      setRecentReviews(reviews.slice(0, 3) as Review[]);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
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
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const contactCustomer = (lead: Lead, method: "phone" | "email") => {
    if (method === "phone") {
      window.open(`tel:${lead.customer_phone}`, '_blank');
    } else {
      window.open(`mailto:${lead.customer_email}`, '_blank');
    }
  };

  if (loading) {
    return (
      <InstallerRouteGuard>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </InstallerRouteGuard>
    );
  }

  return (
    <InstallerRouteGuard>
      <div className="pt-4">
        {/* Welcome Section */}
        <div className="mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, <Link href="/dashboard/installer/profile" className="text-blue-600 hover:text-blue-700 font-medium">{getDisplayName()}</Link>!
            </h1>
            <p className="text-gray-600">
              Manage your installation services and track your business
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-500 mb-2">{stats.total_leads}</div>
                <div className="text-gray-600 text-sm">Total Leads</div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-500 mb-2">{stats.completed_leads}</div>
                <div className="text-gray-600 text-sm">Completed Jobs</div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-500 mb-2">{formatPrice(stats.total_earnings)}</div>
                <div className="text-gray-600 text-sm">Total Earnings</div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-500 mb-2">{stats.average_rating.toFixed(1)}</div>
                <div className="text-gray-600 text-sm">Average Rating</div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link 
            href="/dashboard/installer/profile" 
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">My Profile</h3>
              <User className="w-5 h-5" />
            </div>
            <p className="text-blue-100 text-sm">
              Update your profile and certifications
            </p>
          </Link>

          <Link 
            href="/dashboard/installer/leads" 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Manage Leads</h3>
              <MessageCircle className="w-5 h-5" />
            </div>
            <p className="text-green-100 text-sm">
              View and respond to installation requests
            </p>
          </Link>

          <Link 
            href="/dashboard/installer/availability" 
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow hover:from-purple-600 hover:to-purple-700 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Availability</h3>
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-purple-100 text-sm">
              Set your schedule and availability
            </p>
          </Link>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Leads */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Leads</h2>
                <Link 
                  href="/dashboard/installer/leads" 
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {recentLeads.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No leads yet</p>
                  <p className="text-gray-400 text-sm mt-1">New installation requests will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentLeads.map((lead) => (
                    <div key={lead.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-sm">
                            {lead.project_type} Installation
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">{lead.customer_name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <MapPin className="w-3 h-3" />
                          <span>{lead.location}</span>
                        </div>
                        <p className="text-xs text-gray-700 line-clamp-2">{lead.description}</p>
                        {lead.amount && (
                          <p className="text-xs font-medium text-green-600 mt-1">
                            {formatPrice(lead.amount)}
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {getTimeAgo(lead.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => contactCustomer(lead, "phone")}
                          className="text-green-600 hover:text-green-700 text-sm"
                          title="Call customer"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => contactCustomer(lead, "email")}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                          title="Email customer"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-xl shadow border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Reviews</h2>
                <Link 
                  href="/dashboard/installer/reviews" 
                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                >
                  View all
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              {recentReviews.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No reviews yet</p>
                  <p className="text-gray-400 text-sm mt-1">Customer reviews will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {review.reviewer_name}
                        </h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{review.comment}</p>
                      <p className="text-xs text-gray-500">
                        {getTimeAgo(review.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Completion Banner */}
        {installerProfile && !installerProfile.business_name && (
          <div className="mt-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Complete Your Profile</h3>
                <p className="text-yellow-100">
                  Add your business information to get more leads and build trust with customers
                </p>
              </div>
              <Link 
                href="/dashboard/installer/profile"
                className="bg-white text-yellow-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </InstallerRouteGuard>
  );
} 