"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter,
  X,
  ChevronDown,
  Check,
  Star,
  Truck,
  Wrench
} from "lucide-react";
import { filterOptions, brands, categories } from "../data/mockProducts";
import "../styles/marketplace.css";

interface FilterState {
  priceRange: string;
  powerOutput: string;
  rating: string;
  brands: string[];
  categories: string[];
  subCategories: string[];
  availability: string[];
}

interface MarketplaceFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  totalProducts: number;
  activeFiltersCount: number;
}

export function MarketplaceFilters({ 
  onFilterChange, 
  totalProducts,
  activeFiltersCount 
}: MarketplaceFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: '',
    powerOutput: '',
    rating: '',
    brands: [],
    categories: [],
    subCategories: [],
    availability: []
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      priceRange: '',
      powerOutput: '',
      rating: '',
      brands: [],
      categories: [],
      subCategories: [],
      availability: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
      >
        <Filter className="w-4 h-4" />
        <span>Filters</span>
        {activeFiltersCount > 0 && (
          <span className="badge badge-new px-2 py-0.5 text-white text-xs rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Filter Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="filter-panel fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Filters</h2>
                  <p className="text-sm text-gray-500">
                    {totalProducts} products
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Filter Content */}
              <div className="p-6 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {filterOptions.priceRanges.map(range => (
                      <label
                        key={range.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          checked={filters.priceRange === range.id}
                          onChange={() => handleFilterChange({ priceRange: range.id })}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Power Output */}
                <div>
                  <h3 className="font-medium mb-3">Power Output</h3>
                  <div className="space-y-2">
                    {filterOptions.powerOutputRanges.map(range => (
                      <label
                        key={range.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="radio"
                          name="powerOutput"
                          checked={filters.powerOutput === range.id}
                          onChange={() => handleFilterChange({ powerOutput: range.id })}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="font-medium mb-3">Brands</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {brands.map(brand => (
                      <label
                        key={brand.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.brands.includes(brand.id)}
                          onChange={(e) => {
                            const newBrands = e.target.checked
                              ? [...filters.brands, brand.id]
                              : filters.brands.filter(id => id !== brand.id);
                            handleFilterChange({ brands: newBrands });
                          }}
                          className="w-4 h-4 rounded text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm">{brand.name}</span>
                        <span className="text-xs text-gray-500">({brand.origin})</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id}>
                        <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                          <input
                            type="checkbox"
                            checked={filters.categories.includes(category.id)}
                            onChange={(e) => {
                              const newCategories = e.target.checked
                                ? [...filters.categories, category.id]
                                : filters.categories.filter(id => id !== category.id);
                              handleFilterChange({ categories: newCategories });
                            }}
                            className="w-4 h-4 rounded text-green-500 focus:ring-green-500"
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </label>
                        {filters.categories.includes(category.id) && (
                          <div className="ml-6 mt-2 space-y-2">
                            {category.subCategories.map(sub => (
                              <label
                                key={sub}
                                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                              >
                                <input
                                  type="checkbox"
                                  checked={filters.subCategories.includes(sub)}
                                  onChange={(e) => {
                                    const newSubs = e.target.checked
                                      ? [...filters.subCategories, sub]
                                      : filters.subCategories.filter(s => s !== sub);
                                    handleFilterChange({ subCategories: newSubs });
                                  }}
                                  className="w-4 h-4 rounded text-green-500 focus:ring-green-500"
                                />
                                <span className="text-sm">{sub}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <h3 className="font-medium mb-3">Rating</h3>
                  <div className="space-y-2">
                    {filterOptions.ratings.map(rating => (
                      <label
                        key={rating.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating.id}
                          onChange={() => handleFilterChange({ rating: rating.id })}
                          className="w-4 h-4 text-green-500 focus:ring-green-500"
                        />
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{rating.label}</span>
                          {rating.value > 0 && (
                            <div className="rating-stars flex text-yellow-400">
                              {[...Array(rating.value)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current" />
                              ))}
                            </div>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="font-medium mb-3">Availability</h3>
                  <div className="space-y-2">
                    {filterOptions.availability.map(option => (
                      <label
                        key={option.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={filters.availability.includes(option.id)}
                          onChange={(e) => {
                            const newAvailability = e.target.checked
                              ? [...filters.availability, option.id]
                              : filters.availability.filter(id => id !== option.id);
                            handleFilterChange({ availability: newAvailability });
                          }}
                          className="w-4 h-4 rounded text-green-500 focus:ring-green-500"
                        />
                        <span className="text-sm">{option.label}</span>
                        {option.id === 'freeDelivery' && <Truck className="w-4 h-4 text-green-500" />}
                        {option.id === 'installation' && <Wrench className="w-4 h-4 text-green-500" />}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t p-4 flex items-center gap-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 