"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowUpDown, Check } from "lucide-react";
import { filterOptions } from "../data/mockProducts";
import "../styles/marketplace.css";

interface MarketplaceSortProps {
  onSortChange: (sortId: string) => void;
  currentSort: string;
}

export function MarketplaceSort({ onSortChange, currentSort }: MarketplaceSortProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentSortLabel = () => {
    return filterOptions.sortOptions.find(option => option.id === currentSort)?.label || 'Sort By';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="sort-dropdown flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
      >
        <ArrowUpDown className="w-4 h-4" />
        <span>{getCurrentSortLabel()}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 right-0 w-48 bg-white rounded-lg shadow-lg overflow-hidden z-40"
            >
              {filterOptions.sortOptions.map(option => (
                <button
                  key={option.id}
                  className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    onSortChange(option.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-sm">{option.label}</span>
                  {currentSort === option.id && (
                    <Check className="w-4 h-4 text-green-500" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 