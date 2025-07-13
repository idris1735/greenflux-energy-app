"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { 
  saveProductForUser, 
  removeSavedProduct, 
  isProductSavedByUser, 
  getSellerProfile 
} from "@/lib/firebaseHelpers";
import { 
  Heart, 
  Star, 
  MapPin, 
  BadgeCheck, 
  Eye, 
  MessageCircle,
  ShoppingCart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  product: {
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
    location?: string;
    category?: string;
    tags?: string[];
    views_count?: number;
    status?: string;
  };
  showActions?: boolean;
  showSellerInfo?: boolean;
  className?: string;
}

export function ProductCard({ 
  product, 
  showActions = true, 
  showSellerInfo = true,
  className = "" 
}: ProductCardProps) {
  const { user, isAuthenticated } = useUser();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sellerInfo, setSellerInfo] = useState<{
    business_name?: string;
    company_name?: string;
    is_verified?: boolean;
    company_logo_url?: string;
    address?: string;
    city?: string;
    state?: string;
  } | null>(null);

  useEffect(() => {
    async function fetchSeller() {
      if (product.seller_id && !product.seller_name) {
        const seller = await getSellerProfile(product.seller_id);
        setSellerInfo(seller);
      }
    }
    fetchSeller();
  }, [product.seller_id, product.seller_name]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated || !user) {
      // Redirect to login or show login modal
      return;
    }

    setIsLoading(true);
    try {
      if (isSaved) {
        await removeSavedProduct(user.uid, product.id);
        setIsSaved(false);
      } else {
        await saveProductForUser(user.uid, product.id);
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling saved product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInquiry = () => {
    if (!isAuthenticated || !user) {
      // Redirect to login or show login modal
      return;
    }
    // Navigate to product detail page with inquiry modal
    window.location.href = `/products/${product.id}?inquiry=true`;
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 ${className}`}>
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0]}
            alt={product.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-yellow-100">
            <ShoppingCart className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Save Button */}
        {showActions && (
          <button
            onClick={handleSaveToggle}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
              isSaved 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        )}

        {/* Status Badge */}
        {product.status && product.status !== 'active' && (
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full">
              {product.status}
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Title and Price */}
        <div className="mb-3">
          <Link href={`/products/${product.id}`} className="block">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 hover:text-green-600 transition-colors line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-600">
              {formatPrice(product.price)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {product.rating}
                </span>
                {product.review_count && (
                  <span className="text-xs text-gray-500">
                    ({product.review_count})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Seller Info */}
        {showSellerInfo && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              {(product.seller_verified || sellerInfo?.is_verified) && (
                <BadgeCheck className="w-4 h-4 text-blue-500" />
              )}
              {product.seller_id ? (
                <Link 
                  href={`/sellers/${product.seller_id}`}
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {product.seller_name || sellerInfo?.business_name || sellerInfo?.company_name || "Unknown Seller"}
                </Link>
              ) : (
                <span className="font-medium">{product.seller_name || sellerInfo?.business_name || sellerInfo?.company_name || "Unknown Seller"}</span>
              )}
            </div>
            {(product.location || sellerInfo?.city || sellerInfo?.state) && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                <span>{product.location || [sellerInfo?.city, sellerInfo?.state].filter(Boolean).join(", ")}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{product.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span>Category: {product.category || 'Solar'}</span>
          {product.views_count && (
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{product.views_count} views</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex gap-2">
            <Link
              href={`/products/${product.id}`}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={handleInquiry}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 