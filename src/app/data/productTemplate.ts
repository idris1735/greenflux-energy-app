/**
 * Product Template for AI Generation
 * 
 * Instructions:
 * 1. Use this template to generate more products
 * 2. Keep the structure and data types consistent
 * 3. Use realistic values for specifications and features
 * 4. Maintain the same image format from Unsplash
 * 5. Generate unique IDs following the pattern: [category_code][3-digit-number]
 *    - sp: Solar Panels
 *    - inv: Inverters
 *    - bat: Batteries
 *    - ctrl: Controllers
 *    - acc: Accessories
 * 
 * Example Usage:
 * Replace the placeholder values with appropriate data while maintaining the structure.
 */

export interface ProductTemplate {
  id: string;                 // Format: [category_code][3-digit-number] (e.g., 'sp001')
  title: string;             // Product name with brand and model
  description: string;       // 1-2 sentences describing key features
  price: number;            // Current price in kobo (multiply by 100)
  originalPrice?: number;    // Optional original price for discounts
  images: string[];         // Array of Unsplash image URLs
  rating: number;           // Rating between 1-5 with one decimal
  reviewCount: number;      // Number of reviews
  seller: {                 // Use existing seller from sellers array
    id: string;
    name: string;
    isVerified: boolean;
    rating: number;
  };
  category: string;         // Main category
  subCategory: string;      // Specific subcategory
  powerOutput: string;      // Power rating with unit
  energyRating: string;     // Energy efficiency rating
  specifications: {         // Technical specifications
    brand: string;
    model: string;
    warranty: string;
    dimensions: string;
    weight: string;
    certification: string;
    efficiency?: string;
    [key: string]: string | undefined;  // Allow undefined for optional properties
  };
  features: string[];       // Array of 5 key features
  stock: number;            // Current stock quantity
  tags: string[];          // 2-4 relevant tags
  isNew: boolean;          // Released within last 30 days
  isBestSeller: boolean;   // High sales volume product
  installationAvailable: boolean;  // Installation service available
  deliveryFee: number;     // Delivery fee in kobo
  createdAt: string;       // ISO date string
}

// Sample product following the template
export const sampleProduct: ProductTemplate = {
  id: 'sp007',
  title: 'Longi Hi-MO 5m 540W Panel',
  description: 'Ultra-high power bifacial module with advanced cell technology and superior low-light performance.',
  price: 380000,
  originalPrice: 420000,
  images: [
    'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800',
    'https://images.unsplash.com/photo-1613665813446-79a7c40a0e7b?q=80&w=800'
  ],
  rating: 4.8,
  reviewCount: 134,
  seller: {
    id: 'seller1',
    name: 'SolarTech Solutions',
    isVerified: true,
    rating: 4.9
  },
  category: 'Solar Panels',
  subCategory: 'Monocrystalline',
  powerOutput: '540W',
  energyRating: 'A++',
  specifications: {
    brand: 'Longi Solar',
    model: 'LR5-72HPH-540M',
    warranty: '25 years',
    dimensions: '2256 x 1133 x 35 mm',
    weight: '32.3 kg',
    certification: 'IEC 61215'
  },
  features: [
    'Bifacial technology',
    'Smart soldering technology',
    'Enhanced weather resistance',
    'High snow/wind load',
    'Anti-PID performance'
  ],
  stock: 25,
  tags: ['High-Power', 'Bifacial', 'Commercial'],
  isNew: true,
  isBestSeller: false,
  installationAvailable: true,
  deliveryFee: 8000,
  createdAt: '2024-01-05'
};

/**
 * Available Categories and Subcategories:
 * 
 * Solar Panels:
 * - Monocrystalline
 * - Polycrystalline
 * - Bifacial
 * - Thin Film
 * 
 * Inverters:
 * - String Inverters
 * - Microinverters
 * - Hybrid Inverters
 * - Central Inverters
 * 
 * Batteries:
 * - Lithium-Ion
 * - Lead Acid
 * - Flow Batteries
 * - Saltwater Batteries
 * 
 * Controllers:
 * - MPPT
 * - PWM
 * - Hybrid Controllers
 * - Smart Controllers
 * 
 * Accessories:
 * - Mounting
 * - Cables
 * - Safety
 * - Maintenance
 * 
 * Common Tags:
 * - Premium
 * - High-Efficiency
 * - Smart
 * - Commercial
 * - Residential
 * - Essential
 * - Professional
 * - Eco-Friendly
 * - High-Power
 * - Expandable
 * - Durable
 * - Advanced
 * - Modular
 * - Compact
 */ 