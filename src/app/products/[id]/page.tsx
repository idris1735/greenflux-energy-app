"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { mockProducts, type Product } from "../../data/mockProducts";
import { Star, Heart, ShoppingCart, Truck, Shield, Check, ArrowLeft, Share2 } from "lucide-react";
import { useCart } from "../../../lib/CartContext";
import toast from "react-hot-toast";
import { useUser } from "../../../lib/UserContext";

interface ProductPageProps {
  params: {
  id: string;
  };
}

export default function ProductDescriptionPage({ params }: ProductPageProps) {
  const { id } = params;
  const { addToCart } = useCart();
  const { isAuthenticated } = useUser();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Find the product by ID
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <Link href="/marketplace">
            <Button variant="outline" className="mb-4">&larr; Back to Marketplace</Button>
          </Link>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/marketplace">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Add the product quantity times
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart!`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      toast.error("Please login to add items to wishlist");
      return;
    }
    toast.success("Added to wishlist!");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
      </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                {product.isNew && (
                  <Badge className="absolute top-4 left-4 bg-green-500">New</Badge>
                )}
                {product.isBestSeller && (
                  <Badge className="absolute top-4 right-4 bg-orange-500">Best Seller</Badge>
                )}
              </div>
              
              {/* Image Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-green-500' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image}
                        alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{product.category}</Badge>
                  <Badge variant="outline">{product.subCategory}</Badge>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-green-600">
                    ₦{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-400 line-through">
                      ₦{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <Badge className="bg-red-500 text-white">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 leading-relaxed">{product.description}</p>

              {/* Key Features */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Key Features</h3>
                <ul className="space-y-1">
                  {product.features.slice(0, 5).map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                </div>
                
              {/* Stock Status */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-sm">
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck className="w-4 h-4" />
                  Delivery: ₦{product.deliveryFee.toLocaleString()}
                </div>
                  </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleWishlist}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                  {product.installationAvailable && (
                    <Button variant="outline" className="flex-1">
                      <Shield className="w-4 h-4 mr-2" />
                      Installation Available
                    </Button>
                  )}
                </div>
              </div>

              {/* Seller Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold">
                          {product.seller.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold">{product.seller.name}</h4>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(product.seller.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.seller.rating} rating
                          </span>
                          {product.seller.isVerified && (
                            <Badge className="bg-blue-500 text-white text-xs">Verified</Badge>
                        )}
                      </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Contact Seller
                    </Button>
                  </div>
                </CardContent>
              </Card>
                      </div>
                </div>
                
                {/* Specifications */}
          <div className="border-t p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Product Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand</span>
                    <span className="font-medium">{product.specifications.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Model</span>
                    <span className="font-medium">{product.specifications.model}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Power Output</span>
                    <span className="font-medium">{product.powerOutput}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Energy Rating</span>
                    <span className="font-medium">{product.energyRating}</span>
                      </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty</span>
                    <span className="font-medium">{product.specifications.warranty}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Physical Specifications</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-medium">{product.specifications.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{product.specifications.weight}</span>
                  </div>
                  {product.specifications.efficiency && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Efficiency</span>
                      <span className="font-medium">{product.specifications.efficiency}</span>
                    </div>
                  )}
                  {product.specifications.cells && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cells</span>
                      <span className="font-medium">{product.specifications.cells}</span>
                  </div>
                )}
                  {product.specifications.certification && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Certification</span>
                      <span className="font-medium">{product.specifications.certification}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 