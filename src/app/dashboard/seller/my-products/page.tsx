"use client";
import { useState, useEffect } from "react";
import { useUser } from "@/lib/UserContext";
import { SellerRouteGuard } from "@/lib/routeGuard";
import { getProductsBySeller, deleteProduct, getSellerProfile } from "@/lib/firebaseHelpers";
import ProductImageSlider from "@/app/components/product-image-slider";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Star, 
  Search,
  Filter,
  MoreVertical
} from "lucide-react";
import Link from "next/link";
import { ProductCard } from "@/app/components/product-card";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  views_count: number;
  rating: number;
  review_count: number;
  created_at: Date;
  category?: string;
  images?: string[];
  image_paths?: string[]; // New field for Firebase Storage paths
}

export default function SellerProductsPage() {
  const { user, userProfile } = useUser();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deletingProduct, setDeletingProduct] = useState<string | null>(null);
  const [sellerInfo, setSellerInfo] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadProducts();
      loadSellerInfo();
    }
  }, [user]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await getProductsBySeller(user.uid);
      const typedProducts = productsData.map((product: any) => ({
        id: product.id,
        title: product.title || '',
        description: product.description || '',
        price: product.price || 0,
        status: product.status || 'active',
        views_count: product.views_count || 0,
        rating: product.rating || 0,
        review_count: product.review_count || 0,
        created_at: product.created_at || new Date(),
        category: product.category || '',
        images: product.images || [],
        image_paths: product.image_paths || []
      }));
      setProducts(typedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerInfo = async () => {
    try {
      const seller = await getSellerProfile(user.uid);
      setSellerInfo(seller);
    } catch (error) {
      setSellerInfo(null);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeletingProduct(productId);
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeletingProduct(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { 
      style: 'currency', 
      currency: 'NGN', 
      minimumFractionDigits: 0 
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "sold":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <SellerRouteGuard>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your products...</p>
          </div>
        </div>
      </SellerRouteGuard>
    );
  }

  return (
    <SellerRouteGuard>
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
    <div>
            <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
            <p className="text-gray-600">Manage your solar product listings</p>
          </div>
          <Link
            href="/dashboard/seller/my-products/add"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="sold">Sold</option>
            </select>
            <div className="text-sm text-gray-600 flex items-center justify-end">
              {filteredProducts.length} of {products.length} products
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {products.length === 0 ? 'No products yet' : 'No products found'}
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0 
                ? 'Start by adding your first product to the marketplace'
                : 'Try adjusting your search criteria'
              }
            </p>
            {products.length === 0 && (
              <Link
                href="/dashboard/seller/my-products/add"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Your First Product
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  seller_id: user?.uid,
                  seller_name: sellerInfo?.business_name || sellerInfo?.company_name || "",
                  seller_verified: sellerInfo?.is_verified || false,
                  location: sellerInfo?.city || sellerInfo?.state ? [sellerInfo?.city, sellerInfo?.state].filter(Boolean).join(", ") : "",
                }}
                showActions={false}
              />
            ))}
          </div>
        )}
    </div>
    </SellerRouteGuard>
  );
} 