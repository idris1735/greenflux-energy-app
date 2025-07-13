"use client";
import { useState, useEffect } from "react";
import { MessageCircle, Phone, Clock, CheckCircle, XCircle, Eye, Star, MapPin, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/UserContext";
import { 
  getInquiriesForBuyer, 
  getProduct, 
  getSellerProfile 
} from "@/lib/firebaseHelpers";

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

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "bg-blue-100 text-blue-800", icon: Clock },
  responded: { label: "Responded", color: "bg-yellow-100 text-yellow-800", icon: MessageCircle },
  completed: { label: "Completed", color: "bg-green-100 text-green-800", icon: CheckCircle },
  lost: { label: "Lost", color: "bg-red-100 text-red-800", icon: XCircle }
};

export default function MyInquiriesPage() {
  const { user, userProfile } = useUser();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  useEffect(() => {
    if (user) {
      loadInquiries();
    }
  }, [user]);

  const loadInquiries = async () => {
    try {
      setLoading(true);
      
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
    } catch (error) {
      console.error('Error loading inquiries:', error);
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  const contactSeller = (inquiry: Inquiry, method: "whatsapp" | "phone") => {
    if (!inquiry.seller) return;
    
    const contactNumber = inquiry.seller.contact_phone || inquiry.seller.contact_whatsapp;
    if (!contactNumber) return;

    if (method === "whatsapp") {
      const message = `Hi, following up on my previous inquiry about ${inquiry.product?.title || "your product"}.`;
      const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(`tel:${contactNumber}`, '_blank');
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    return filterStatus === "all" || inquiry.status === filterStatus;
  });

  const getStatusCounts = () => {
    const counts = { pending: 0, responded: 0, completed: 0, lost: 0 };
    inquiries.forEach(inquiry => {
      counts[inquiry.status as keyof typeof counts]++;
    });
    return counts;
  };

  const statusCounts = getStatusCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Inquiries</h1>
        <p className="text-gray-600 mt-1">
          Track all your inquiries to sellers
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => {
          const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
          const Icon = config.icon;
          return (
            <div key={status} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{count}</div>
                  <div className="text-sm text-gray-600 capitalize">{status}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="responded">Responded</option>
          <option value="completed">Completed</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Inquiries List */}
      {filteredInquiries.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No inquiries found</h3>
          <p className="text-gray-600 mb-6">
            {filterStatus !== "all" 
              ? "Try adjusting your filters to see more results."
              : "Start exploring our marketplace and contact sellers."
            }
          </p>
          <Link 
            href="/marketplace" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => {
            const statusConfig = STATUS_CONFIG[inquiry.status as keyof typeof STATUS_CONFIG];
            const StatusIcon = statusConfig.icon;
            
            return (
              <div key={inquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <Image
                      src={inquiry.product?.main_image || inquiry.product?.images?.[0] || "/sun-product-placeholder.jpg"}
                      alt={inquiry.product?.title || 'Product'}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {inquiry.product?.title || 'Product Inquiry'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-600">
                            {inquiry.seller?.business_name || 'Seller'}
                          </span>
                          {inquiry.seller?.is_verified && (
                            <BadgeCheck className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <div className="flex items-center gap-1">
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.label}
                          </div>
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                      {inquiry.message}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{getTimeAgo(inquiry.created_at)}</span>
                        {inquiry.product?.price && (
                          <span className="font-medium text-green-600">
                            {formatPrice(inquiry.product.price)}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => contactSeller(inquiry, "whatsapp")}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Contact
                        </button>
                        <button
                          onClick={() => contactSeller(inquiry, "phone")}
                          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          <Phone className="w-4 h-4" />
                          Call
                        </button>
                        <Link
                          href={`/products/${inquiry.product_id}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 