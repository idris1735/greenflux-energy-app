"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, Star, ShoppingBag, Check } from "lucide-react";
import type { Product } from "../data/mockProducts";
import "../styles/marketplace.css";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onToggleWishlist?: (product: Product, liked: boolean) => void;
  isWishlisted?: boolean;
}

export function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onAddToCart) onAddToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  const handleCardClick = () => {
    router.push(`/products/${product.id}`);
  };

  return (
    <motion.div
      className="product-card cursor-pointer"
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Image Container */}
      <div className="product-image-container">
        <Image
          src={product.images[0] || '/sun-product-placeholder.jpg'}
          alt={product.title}
          fill
          className="product-image object-cover"
        />
        
        {/* Wishlist Button */}
        <button 
          className={`wishlist-button absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white ${isWishlisted ? 'active' : ''}`}
          onClick={e => { e.stopPropagation(); onToggleWishlist && onToggleWishlist(product, !isWishlisted); }}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
        </button>

        {/* Quick Buy Button */}
        <motion.button
          className="quick-buy-button absolute inset-x-4 bottom-4 py-2 bg-white text-gray-900 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-gray-100 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
        >
          <ShoppingBag className="w-4 h-4" />
          Quick Buy
        </motion.button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h3>

        {/* Specs */}
        <div className="product-specs mt-2">
          <span className="spec-badge">
            {product.powerOutput}
          </span>
          <span className="spec-badge">
            {product.energyRating}
          </span>
        </div>

        {/* Seller & Rating */}
        <div className="flex items-center justify-between text-sm mb-2">
          <div className="seller-info">
            <span className="text-gray-600">{product.seller.name}</span>
            {product.seller.isVerified && (
              <Check className="verified-badge" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) ? 'fill-current' : ''
                  }`}
                />
              ))}
            </div>
            <span className="review-count">
              ({product.reviewCount})
            </span>
          </div>
        </div>

        {/* Price */}
        <div className="price-tag">
          <span className="current-price">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {/* Add to Cart Button */}
        <button
          className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
          onClick={handleAddToCart}
          type="button"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
} 