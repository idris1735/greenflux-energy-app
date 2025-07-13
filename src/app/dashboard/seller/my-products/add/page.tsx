"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/UserContext";
import { SellerRouteGuard } from "@/lib/routeGuard";
import { addProduct, uploadProductImages, updateProduct } from "@/lib/firebaseHelpers";
import { 
  Package, 
  Upload, 
  X, 
  Plus,
  AlertCircle,
  CheckCircle,
  Camera
} from "lucide-react";
import Link from "next/link";

interface ProductFormData {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  images: string[];
  specifications: {
    power_rating?: string;
    efficiency?: string;
    warranty?: string;
    brand?: string;
    model?: string;
  };
  location: string;
  is_negotiable: boolean;
  quantity_available: number;
}

const CATEGORIES = [
  "Solar Panels",
  "Inverters", 
  "Batteries",
  "Charge Controllers",
  "Mounting Systems",
  "Accessories",
  "Complete Systems"
];

const COMMON_TAGS = [
  "High Efficiency",
  "Premium Quality",
  "Warranty Included",
  "Fast Delivery",
  "Installation Available",
  "Best Price",
  "New Arrival",
  "Limited Stock"
];

export default function AddProductPage() {
  const router = useRouter();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    description: "",
    price: 0,
    category: "",
    tags: [],
    images: [],
    specifications: {
      power_rating: "",
      efficiency: "",
      warranty: "",
      brand: "",
      model: ""
    },
    location: "",
    is_negotiable: false,
    quantity_available: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
              file.type.startsWith('image/') && file.size <= 15 * 1024 * 1024 // 15MB limit (will be compressed if >2MB)
    );

    if (validFiles.length + imageFiles.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }

    setImageFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrls(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError("Product title is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Product description is required");
      return false;
    }
    if (formData.price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }
    if (!formData.category) {
      setError("Please select a category");
      return false;
    }
    if (!formData.location.trim()) {
      setError("Location is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // First, create the product to get the product ID
      const productData = {
        seller_id: user.uid,
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: formData.price,
        category: formData.category,
        tags: formData.tags,
        images: [], // Will be updated after upload
        specifications: formData.specifications,
        location: formData.location.trim(),
        is_negotiable: formData.is_negotiable,
        quantity_available: formData.quantity_available,
        status: "active"
      };

      const productRef = await addProduct(productData);
      const productId = productRef.id;

      // Upload images to Firebase Storage if any
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0) {
        try {
          uploadedImageUrls = await uploadProductImages(imageFiles, user.uid, productId);
          
          // Update the product with the uploaded image paths (not URLs)
          await updateProduct(productId, { image_paths: uploadedImageUrls });
        } catch (uploadError: any) {
          console.error('Error uploading images:', uploadError);
          // Continue without images if upload fails
        }
      }

      setSuccess(true);
      
      // Redirect to products page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/seller/my-products');
      }, 2000);

    } catch (error: any) {
      console.error('Error adding product:', error);
      setError(error.message || "Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SellerRouteGuard>
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
            <p className="text-gray-600">Create a new product listing for the marketplace</p>
          </div>
          <Link
            href="/dashboard/seller/my-products"
            className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          >
            ← Back to Products
          </Link>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
                <h3 className="text-green-800 font-medium">Product Added Successfully!</h3>
                <p className="text-green-700 text-sm">Redirecting to your products page...</p>
              </div>
        </div>
          </div>
        )}

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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Product Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 250W Monocrystalline Solar Panel"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                  Price (NGN) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="75000"
                  min="0"
                  required
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., Lagos, Ikeja"
                  required
                />
              </div>

              <div>
                <label htmlFor="quantity_available" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity Available
                </label>
                <input
                  type="number"
                  id="quantity_available"
                  name="quantity_available"
                  value={formData.quantity_available}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  min="1"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_negotiable"
                  name="is_negotiable"
                  checked={formData.is_negotiable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label htmlFor="is_negotiable" className="ml-2 block text-sm text-gray-700">
                  Price is negotiable
                </label>
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your product in detail..."
                required
              />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Click to upload images</p>
                  <p className="text-sm text-gray-500">Maximum 5 images, 15MB each (auto-compressed if &gt;2MB)</p>
                </label>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
        </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Specifications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="specifications.brand" className="block text-sm font-medium text-gray-700 mb-2">
                  Brand
                </label>
                <input
                  type="text"
                  id="specifications.brand"
                  name="specifications.brand"
                  value={formData.specifications.brand}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., SunPower"
                />
              </div>

              <div>
                <label htmlFor="specifications.model" className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  id="specifications.model"
                  name="specifications.model"
                  value={formData.specifications.model}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., SP-250W"
                />
              </div>

              <div>
                <label htmlFor="specifications.power_rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Power Rating
                </label>
                <input
                  type="text"
                  id="specifications.power_rating"
                  name="specifications.power_rating"
                  value={formData.specifications.power_rating}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 250W"
                />
              </div>

              <div>
                <label htmlFor="specifications.efficiency" className="block text-sm font-medium text-gray-700 mb-2">
                  Efficiency
                </label>
                <input
                  type="text"
                  id="specifications.efficiency"
                  name="specifications.efficiency"
                  value={formData.specifications.efficiency}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 20%"
                />
              </div>

              <div>
                <label htmlFor="specifications.warranty" className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty
                </label>
                <input
                  type="text"
                  id="specifications.warranty"
                  name="specifications.warranty"
                  value={formData.specifications.warranty}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., 25 years"
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tags</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {COMMON_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {formData.tags.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
          </div>
        </div>
            )}
        </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <Link
              href="/dashboard/seller/my-products"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Adding Product..." : "Add Product"}
        </button>
          </div>
      </form>
    </div>
    </SellerRouteGuard>
  );
} 