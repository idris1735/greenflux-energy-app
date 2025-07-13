"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getSellerProfile, getProductsBySeller } from "@/lib/firebaseHelpers";
import { ProductCard } from "@/app/components/product-card";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Calendar, 
  Award,
  Star,
  Package,
  Users,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SellerProfile {
  // Personal information
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone_number: string;
  
  // Business information
  business_name: string;
  company_name: string;
  contact_person_name: string;
  company_description: string;
  company_logo_url: string;
  address: string;
  city: string;
  state: string;
  website: string;
  years_in_business: number;
  specialties: string[];
  certifications: string[];
  service_areas: string[];
  average_rating: number;
  review_count: number;
  is_verified: boolean;
  is_premium: boolean;
  total_products: number;
  total_sales: number;
  created_at: any;
}

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  images?: string[];
  rating?: number;
  review_count?: number;
  location?: string;
  category?: string;
  tags?: string[];
  views_count?: number;
  status?: string;
  created_at: any;
}

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;
  
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sellerId) {
      loadSellerData();
    }
  }, [sellerId]);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      setError("");

      const [sellerData, productsData] = await Promise.all([
        getSellerProfile(sellerId),
        getProductsBySeller(sellerId)
      ]);

      if (!sellerData) {
        setError("Seller not found");
        return;
      }

      setSeller(sellerData as SellerProfile);
      
      // Filter only active products
      const activeProducts = productsData
        .filter((product: any) => product.status === 'active')
        .map((product: any) => ({
          id: product.id,
          title: product.title || '',
          description: product.description || '',
          price: product.price || 0,
          images: product.images || [],
          rating: product.rating || 0,
          review_count: product.review_count || 0,
          location: product.location || '',
          category: product.category || '',
          tags: product.tags || [],
          views_count: product.views_count || 0,
          status: product.status || 'active',
          created_at: product.created_at
        }));

      setProducts(activeProducts);
    } catch (err: any) {
      console.error('Error loading seller data:', err);
      setError(err.message || "Failed to load seller data");
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller profile...</p>
        </div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h1 className="text-2xl font-bold text-red-800 mb-2">Seller Not Found</h1>
            <p className="text-red-700 mb-4">{error || "The seller you're looking for doesn't exist."}</p>
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

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Company Logo */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                {seller.company_logo_url ? (
                  <Image
                    src={seller.company_logo_url}
                    alt={seller.company_name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-12 h-12 text-gray-400" />
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{seller.business_name || seller.company_name}</h1>
                {seller.is_verified && (
                  <CheckCircle className="w-6 h-6 text-blue-500" />
                )}
                {seller.is_premium && (
                  <Award className="w-6 h-6 text-yellow-500" />
                )}
              </div>

              {seller.company_description && (
                <p className="text-gray-600 mb-4 text-lg">{seller.company_description}</p>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{seller.total_products || products.length}</div>
                  <div className="text-sm text-gray-500">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatNumber(seller.review_count || 0)}</div>
                  <div className="text-sm text-gray-500">Reviews</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{seller.average_rating?.toFixed(1) || '0.0'}</div>
                  <div className="text-sm text-gray-500">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{seller.years_in_business || 0}</div>
                  <div className="text-sm text-gray-500">Years</div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {seller.address && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{seller.address}, {seller.city}, {seller.state}</span>
                  </div>
                )}
                {seller.phone_number && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{seller.phone_number}</span>
                  </div>
                )}
                {seller.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    <span>{seller.email}</span>
                  </div>
                )}
                {seller.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="w-4 h-4" />
                    <a 
                      href={seller.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                    >
                      <span>Website</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Specialties and Certifications */}
        {(seller.specialties?.length > 0 || seller.certifications?.length > 0) && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {seller.specialties?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Specialties
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {seller.specialties.map((specialty, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {seller.certifications?.length > 0 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Certifications
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {seller.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-6 h-6" />
              Products ({products.length})
            </h2>
            <Link
              href="/marketplace"
              className="text-green-600 hover:text-green-700 font-medium hover:underline"
            >
              View All Products
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products available</h3>
              <p className="text-gray-600">
                This seller hasn't listed any products yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showSellerInfo={false}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 