"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrls } from "@/lib/firebaseHelpers";

interface ProductImageSliderProps {
  images: string[];
  alt: string;
  className?: string;
  arePaths?: boolean; // If true, images are Firebase Storage paths that need to be converted to URLs
}

export default function ProductImageSlider({ 
  images, 
  alt, 
  className = "", 
  arePaths = false 
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (!images || images.length === 0) {
        setImageUrls([]);
        return;
      }

      if (arePaths) {
        setLoading(true);
        try {
          const urls = await getImageUrls(images);
          setImageUrls(urls);
        } catch (error) {
          console.error('Error loading image URLs:', error);
          setImageUrls([]);
        } finally {
          setLoading(false);
        }
      } else {
        setImageUrls(images);
      }
    };

    loadImages();
  }, [images, arePaths]);

  if (loading) {
    return (
      <div className={`relative bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Loading images...</p>
        </div>
      </div>
    );
  }

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className={`relative bg-gradient-to-br from-green-100 to-yellow-100 flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-gray-400 text-2xl">📦</span>
          </div>
          <p className="text-gray-500 text-sm">No images</p>
        </div>
      </div>
    );
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + imageUrls.length) % imageUrls.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Main Image */}
      <div className="relative">
        <img
          src={imageUrls[currentIndex]}
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {imageUrls.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Image Indicators */}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {imageUrls.map((_, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white shadow-md' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {imageUrls.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
          {currentIndex + 1} / {imageUrls.length}
        </div>
      )}
    </div>
  );
} 