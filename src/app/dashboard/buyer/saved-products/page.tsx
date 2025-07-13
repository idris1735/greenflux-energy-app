"use client";
import { useState, useEffect } from "react";
import { Heart, Trash2, Eye, MessageCircle, Phone, Star, MapPin, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/lib/UserContext";
import { 
  getSavedProductsForUser, 
  getProduct, 
  getSellerProfile,
  removeSavedProduct 
} from "@/lib/firebaseHelpers";

interface SavedProduct {
  id: string;
  product_id: string;
  saved_at: Date;
  product?: any;
  seller?: any;
}

export default function SavedProductsPage() {
  const { user, userProfile } = useUser();
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (user) {
      loadSavedProducts();
    }
  }, [user]);

  const loadSavedProducts = async () => {
    try {
      setLoading(true);
      
      // Load saved products
      const savedProductsData = await getSavedProductsForUser(user.uid);
      const savedProductsWithDetails = await Promise.all(
        savedProductsData.map(async (saved: any) => {
          const [product, seller] = await Promise.all([
            getProduct(saved.product_id),
            saved.seller_id ? getSellerProfile(saved.seller_id) : null
          ]);
          return { 
            id: saved.id,
            product_id: saved.product_id,
            saved_at: saved.saved_at,
            product,
            seller 
          };
        })
      );
      setSavedProducts(savedProductsWithDetails);
    } catch (error) {
      console.error('Error loading saved products:', error);
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

  const removeFromSaved = async (productId: string) => {
    try {
      await removeSavedProduct(user.uid, productId);
      setSavedProducts(prev => prev.filter(product => product.product_id !== productId));
    } catch (error) {
      console.error('Error removing saved product:', error);
    }
  };

  const contactSeller = (product: any, method: "whatsapp" | "phone") => {
    if (!product.seller) return;
    
    const contactNumber = product.seller.contact_phone || product.seller.contact_whatsapp;
    if (!contactNumber) return;

    if (method === "whatsapp") {
      const message = `Hi, I'm interested in your ${product.title} for ${formatPrice(product.price)}. Is it still available?`;
      const whatsappUrl = `https://wa.me/${contactNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      window.open(`tel:${contactNumber}`, '_blank');
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Products</h1>
          <p className="text-gray-600 mt-1">
            {savedProducts.length} product{savedProducts.length !== 1 ? 's' : ''} saved
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg ${viewMode === "list" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"}`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {savedProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved products yet</h3>
          <p className="text-gray-600 mb-6">Start exploring our marketplace and save products you're interested in.</p>
          <Link 
            href="/marketplace" 
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {savedProducts.map((saved) => (
            <div key={saved.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="relative">
                <Image
                  src={saved.product?.main_image || saved.product?.images?.[0] || "/sun-product-placeholder.jpg"}
                  alt={saved.product?.title || 'Product'}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => removeFromSaved(saved.product_id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {saved.product?.is_negotiable && (
                  <div className="absolute top-3 left-3">
                    <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-semibold">
                      Negotiable
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                    {saved.product?.title || 'Product'}
                  </h3>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {saved.product?.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{saved.product.rating}</span>
                      <span className="text-sm text-gray-500">({saved.product.review_count || 0})</span>
                    </div>
                  )}
                  {saved.product?.location && (
                    <div className="flex items-center gap-1 text-gray-500">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{saved.product.location}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-green-600">
                      {formatPrice(saved.product?.price || 0)}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {saved.seller?.is_verified && (
                      <BadgeCheck className="w-4 h-4 text-blue-500" />
                    )}
                    <span className="text-sm text-gray-600">{saved.seller?.business_name || 'Seller'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      onClick={() => contactSeller(saved.product, "whatsapp")}
                      className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Contact
                    </button>
                    <button
                      onClick={() => contactSeller(saved.product, "phone")}
                      className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium"
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>
                  </div>
                  <Link
                    href={`/products/${saved.product_id}`}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Saved on {formatDate(saved.saved_at)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 