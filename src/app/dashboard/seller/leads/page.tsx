"use client";
import { useState, useEffect } from "react";
import { 
  MessageCircle, 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search,
  Filter,
  User,
  Package,
  Calendar,
  AlertCircle
} from "lucide-react";
import { useUser } from "@/lib/UserContext";
import { SellerRouteGuard } from "@/lib/routeGuard";
import { 
  getInquiriesForSeller, 
  updateInquiryStatus,
  getProduct,
  getUserProfile 
} from "@/lib/firebaseHelpers";

interface Inquiry {
  id: string;
  buyer_id: string;
  seller_id: string;
  product_id?: string;
  message: string;
  status: string;
  created_at: Date;
  updated_at?: Date;
  contact_method?: string;
  buyer?: any;
  product?: any;
}

const STATUS_CONFIG = {
  pending: { label: "New", color: "bg-blue-100 text-blue-800", icon: Clock },
  contacted: { label: "Contacted", color: "bg-yellow-100 text-yellow-800", icon: MessageCircle },
  converted: { label: "Converted", color: "bg-green-100 text-green-800", icon: CheckCircle },
  lost: { label: "Lost", color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function SellerLeadsPage() {
  const { user } = useUser();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError("");
      
      const inquiriesData = await getInquiriesForSeller(user.uid);
      
      // Enrich inquiries with buyer and product data
      const enrichedInquiries = await Promise.all(
        inquiriesData.map(async (inquiry: any) => {
          let buyer = null;
          let product = null;
          
          try {
            // Get buyer profile
            buyer = await getUserProfile(inquiry.buyer_id);
            
            // Get product if inquiry is about a specific product
            if (inquiry.product_id) {
              product = await getProduct(inquiry.product_id);
            }
          } catch (err) {
            console.error('Error loading related data:', err);
          }
          
          return {
            id: inquiry.id,
            buyer_id: inquiry.buyer_id,
            seller_id: inquiry.seller_id,
            product_id: inquiry.product_id,
            message: inquiry.message,
            status: inquiry.status || 'pending',
            created_at: inquiry.created_at?.toDate() || new Date(),
            updated_at: inquiry.updated_at?.toDate(),
            contact_method: inquiry.contact_method || 'whatsapp',
            buyer,
            product
          };
        })
      );
      
      setInquiries(enrichedInquiries);
    } catch (err: any) {
      console.error('Error loading inquiries:', err);
      setError(err.message || "Failed to load inquiries");
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

  const updateInquiryStatusHandler = async (inquiryId: string, newStatus: string) => {
    try {
      setUpdatingStatus(inquiryId);
      await updateInquiryStatus(inquiryId, newStatus);
      
      // Update local state
      setInquiries(prev => prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: newStatus, updated_at: new Date() }
          : inquiry
      ));
    } catch (err: any) {
      console.error('Error updating inquiry status:', err);
      setError(err.message || "Failed to update status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const contactCustomer = (inquiry: Inquiry, method: "whatsapp" | "phone") => {
    if (!inquiry.buyer) return;
    
    const contactNumber = inquiry.buyer.phone_number || inquiry.buyer.phone;
    if (!contactNumber) {
      alert("No contact number available for this customer");
      return;
    }
    
    if (method === "whatsapp") {
      const message = `Hi ${inquiry.buyer.first_name || 'there'}, thank you for your inquiry. How can I help you today?`;
      const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(`tel:${contactNumber}`, '_blank');
    }
    
    // Update status to contacted if it was pending
    if (inquiry.status === "pending") {
      updateInquiryStatusHandler(inquiry.id, "contacted");
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const buyerName = inquiry.buyer?.first_name && inquiry.buyer?.last_name 
      ? `${inquiry.buyer.first_name} ${inquiry.buyer.last_name}`
      : inquiry.buyer?.email || 'Unknown';
    
    const productTitle = inquiry.product?.title || 'General Inquiry';
    
    const matchesSearch = buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         productTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inquiry.message.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || inquiry.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusCounts = () => {
    const counts = { pending: 0, contacted: 0, converted: 0, lost: 0 };
    inquiries.forEach(inquiry => {
      counts[inquiry.status as keyof typeof counts]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

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

  return (
    <SellerRouteGuard>
      <div className="pt-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-1">
            Track and respond to customer inquiries
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

        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New</p>
                <p className="text-2xl font-bold text-blue-600">{statusCounts.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Contacted</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.contacted}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Converted</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.converted}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Lost</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.lost}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by customer name, product, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries List */}
        <div className="space-y-4">
          {filteredInquiries.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries found</h3>
              <p className="text-gray-600">
                {inquiries.length === 0 
                  ? "You haven't received any inquiries yet. Your inquiries will appear here once customers contact you."
                  : "No inquiries match your current filters."
                }
              </p>
            </div>
          ) : (
            filteredInquiries.map((inquiry) => {
              const buyerName = inquiry.buyer?.first_name && inquiry.buyer?.last_name 
                ? `${inquiry.buyer.first_name} ${inquiry.buyer.last_name}`
                : inquiry.buyer?.email || 'Unknown Customer';
              
              const productTitle = inquiry.product?.title || 'General Inquiry';
              const productPrice = inquiry.product?.price;
              
              const StatusIcon = STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
              const statusConfig = STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.pending;
              
              return (
                <div key={inquiry.id} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{buyerName}</h3>
                          <p className="text-sm text-gray-500">{getTimeAgo(inquiry.created_at)}</p>
                        </div>
                      </div>
                      
                      {inquiry.product && (
                        <div className="flex items-center gap-3 mb-3">
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{productTitle}</span>
                          {productPrice && (
                            <span className="text-sm font-medium text-gray-900">
                              {formatPrice(productPrice)}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <p className="text-gray-700 mb-4">{inquiry.message}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => contactCustomer(inquiry, "whatsapp")}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        disabled={updatingStatus === inquiry.id}
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </button>
                      
                      {inquiry.buyer?.phone_number && (
                        <button
                          onClick={() => contactCustomer(inquiry, "phone")}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          disabled={updatingStatus === inquiry.id}
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => updateInquiryStatusHandler(inquiry.id, e.target.value)}
                        disabled={updatingStatus === inquiry.id}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="pending">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </SellerRouteGuard>
  );
} 