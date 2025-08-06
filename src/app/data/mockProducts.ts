export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  seller: {
    id: string;
    name: string;
    isVerified: boolean;
    rating: number;
  };
  category: string;
  subCategory: string;
  powerOutput: string;
  energyRating: string;
  specifications: {
    brand: string;
    model: string;
    warranty: string;
    dimensions: string;
    weight: string;
    [key: string]: string;
  };
  features: string[];
  stock: number;
  tags: string[];
  isNew: boolean;
  isBestSeller: boolean;
  installationAvailable: boolean;
  deliveryFee: number;
  createdAt: string;
}

export const brands = [
  { id: 'sunpower', name: 'SunPower', origin: 'USA' },
  { id: 'lg', name: 'LG Solar', origin: 'South Korea' },
  { id: 'jinko', name: 'Jinko Solar', origin: 'China' },
  { id: 'canadian', name: 'Canadian Solar', origin: 'Canada' },
  { id: 'tesla', name: 'Tesla', origin: 'USA' },
  { id: 'enphase', name: 'Enphase', origin: 'USA' },
  { id: 'fronius', name: 'Fronius', origin: 'Austria' },
  { id: 'growatt', name: 'Growatt', origin: 'China' },
];

export const categories = [
  {
    id: 'panels',
    name: 'Solar Panels',
    subCategories: ['Monocrystalline', 'Polycrystalline', 'Thin-Film']
  },
  {
    id: 'inverters',
    name: 'Inverters',
    subCategories: ['String Inverters', 'Microinverters', 'Hybrid Inverters']
  },
  {
    id: 'batteries',
    name: 'Batteries',
    subCategories: ['Lithium-Ion', 'Lead-Acid', 'Flow Batteries']
  },
  {
    id: 'controllers',
    name: 'Controllers',
    subCategories: ['PWM', 'MPPT', 'Smart Controllers']
  },
  {
    id: 'mounts',
    name: 'Mounting',
    subCategories: ['Roof Mounts', 'Ground Mounts', 'Tracking Systems']
  },
  {
    id: 'accessories',
    name: 'Accessories',
    subCategories: ['Cables', 'Connectors', 'Monitoring Systems']
  }
];

export const sellers = [
  {
    id: 'greenenergy',
    name: 'Green Energy Solutions',
    isVerified: true,
    rating: 4.8,
    joinedDate: '2020-01-15',
    totalSales: 1500,
    responseRate: 98
  },
  {
    id: 'solartechpro',
    name: 'SolarTech Pro',
    isVerified: true,
    rating: 4.9,
    joinedDate: '2019-06-22',
    totalSales: 2300,
    responseRate: 95
  },
  // Add more sellers...
];

// Generate 50 mock products
export const mockProducts: Product[] = [
  {
    id: 'sp001',
    title: 'SunPower Maxeon 400W Solar Panel',
    description: 'High-efficiency monocrystalline solar panel with industry-leading 22.6% efficiency and 40-year warranty.',
    price: 285000,
    originalPrice: 320000,
    images: [
      'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800',
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 245,
    seller: sellers[0],
    category: 'Solar Panels',
    subCategory: 'Monocrystalline',
    powerOutput: '400W',
    energyRating: 'A+',
    specifications: {
      brand: 'SunPower',
      model: 'SPR-MAX3-400',
      warranty: '40 years',
      dimensions: '1690 x 1046 x 40 mm',
      weight: '19 kg',
      efficiency: '22.6%',
      cells: '104 Maxeon Gen 3',
      certification: 'IEC 61215, IEC 61730'
    },
    features: [
      'Highest efficiency available',
      'Best warranty in industry',
      'Superior low-light performance',
      'Better hot-weather performance',
      'Anti-reflective glass'
    ],
    stock: 50,
    tags: ['Premium', 'High-Efficiency', 'Long Warranty'],
    isNew: true,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 5000,
    createdAt: '2024-01-15'
  },
  {
    id: 'inv001',
    title: 'Enphase IQ8 Microinverter',
    description: 'Smart grid-forming microinverter with advanced features for optimal performance.',
    price: 125000,
    images: [
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61d?q=80&w=800',
      'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 312,
    seller: sellers[0],
    category: 'Inverters',
    subCategory: 'Microinverters',
    powerOutput: '384W',
    energyRating: 'A+',
    specifications: {
      brand: 'Enphase',
      model: 'IQ8-60-2-US',
      warranty: '25 years',
      dimensions: '212 x 175 x 30.2 mm',
      weight: '1.08 kg',
      efficiency: '97%',
      certification: 'UL 1741, IEEE 1547'
    },
    features: [
      'Grid-forming capability',
      'Rapid shutdown compliant',
      'Built-in revenue grade metering',
      'Wireless communication',
      'Energy monitoring'
    ],
    stock: 100,
    tags: ['Smart', 'High-Efficiency', 'Grid-Forming'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 2000,
    createdAt: '2024-01-20'
  },
  {
    id: 'bat001',
    title: 'Tesla Powerwall 2',
    description: 'Compact home battery system with 13.5 kWh capacity and integrated inverter.',
    price: 850000,
    originalPrice: 950000,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800',
      'https://images.unsplash.com/photo-1593941707822-8c74e298a74f?q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 156,
    seller: sellers[1],
    category: 'Batteries',
    subCategory: 'Lithium-Ion',
    powerOutput: '7kW peak / 5kW continuous',
    energyRating: 'A+',
    specifications: {
      brand: 'Tesla',
      model: 'Powerwall 2',
      warranty: '10 years',
      dimensions: '1150 x 755 x 155 mm',
      weight: '114 kg',
      capacity: '13.5 kWh',
      certification: 'UL 9540, IEC 62109'
    },
    features: [
      'Integrated inverter',
      'Liquid thermal control',
      'Gateway monitoring',
      'Backup power capability',
      'Time-based control'
    ],
    stock: 15,
    tags: ['Premium', 'Battery Storage', 'Smart Home'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 10000,
    createdAt: '2024-01-05'
  },
  // Add more products...
  {
    id: 'sp002',
    title: 'LG NeON 2 350W Solar Panel',
    description: 'Premium bifacial solar panel with enhanced performance and sleek design.',
    price: 245000,
    originalPrice: 280000,
    images: [
      'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?q=80&w=800',
      'https://images.unsplash.com/photo-1611365892023-c3b5610e0b8e?q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 189,
    seller: sellers[1],
    category: 'Solar Panels',
    subCategory: 'Monocrystalline',
    powerOutput: '350W',
    energyRating: 'A',
    specifications: {
      brand: 'LG',
      model: 'LG350N2W-V5',
      warranty: '25 years',
      dimensions: '1686 x 1016 x 40 mm',
      weight: '17.5 kg',
      efficiency: '21.1%',
      cells: '60 Cell',
      certification: 'IEC 61215, IEC 61730'
    },
    features: [
      'Cello Technology',
      'Enhanced performance warranty',
      'Bifacial cells',
      'High wind resistance',
      'PID resistance'
    ],
    stock: 35,
    tags: ['Premium', 'Bifacial', 'Warranty'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 5000,
    createdAt: '2024-01-10'
  },
  {
    id: 'mnt001',
    title: 'Adjustable Solar Panel Mounting System',
    description: 'Professional-grade mounting system for optimal solar panel positioning.',
    price: 75000,
    images: [
      'https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800',
      'https://images.unsplash.com/photo-1592833159037-bb6f8f6f4ba8?q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 92,
    seller: sellers[0],
    category: 'Mounting',
    subCategory: 'Roof Mounts',
    powerOutput: 'N/A',
    energyRating: 'N/A',
    specifications: {
      brand: 'SolarMount',
      model: 'PRO-ADJ-100',
      warranty: '15 years',
      dimensions: 'Adjustable',
      weight: '45 kg',
      material: 'Aluminum',
      certification: 'ISO 9001'
    },
    features: [
      'Adjustable tilt angle',
      'Corrosion resistant',
      'Easy installation',
      'Wind tunnel tested',
      'Universal compatibility'
    ],
    stock: 25,
    tags: ['Professional', 'Durable', 'Adjustable'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 8000,
    createdAt: '2024-01-18'
  },
  {
    id: 'ctrl001',
    title: 'MPPT Solar Charge Controller 60A',
    description: 'High-efficiency MPPT charge controller for optimal battery charging.',
    price: 85000,
    originalPrice: 95000,
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800',
      'https://images.unsplash.com/photo-1581092580496-e2d81312c2f2?q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 128,
    seller: sellers[0],
    category: 'Controllers',
    subCategory: 'MPPT',
    powerOutput: '60A',
    energyRating: 'A',
    specifications: {
      brand: 'Victron',
      model: 'SmartSolar MPPT 60A',
      warranty: '5 years',
      dimensions: '246 x 295 x 103 mm',
      weight: '4.5 kg',
      efficiency: '98%',
      certification: 'CE, RoHS'
    },
    features: [
      'Advanced MPPT algorithm',
      'Bluetooth connectivity',
      'LCD display',
      'Multiple battery types',
      'Temperature compensation'
    ],
    stock: 40,
    tags: ['Smart', 'Efficient', 'Bluetooth'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 2000,
    createdAt: '2024-01-12'
  },
  {
    id: 'acc001',
    title: 'Solar Cable Kit 6mm² 20m',
    description: 'Professional-grade solar cable kit with MC4 connectors.',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1586920740280-b3fe2e8bb4eb?q=80&w=800',
      'https://images.unsplash.com/photo-1586920740668-5c06921cc8c5?q=80&w=800'
    ],
    rating: 4.5,
    reviewCount: 75,
    seller: sellers[1],
    category: 'Accessories',
    subCategory: 'Cables',
    powerOutput: 'N/A',
    energyRating: 'N/A',
    specifications: {
      brand: 'SolarFlex',
      model: 'PRO-6-20',
      warranty: '10 years',
      dimensions: '20m length',
      weight: '3.2 kg',
      material: 'Copper',
      certification: 'TÜV'
    },
    features: [
      'Double insulated',
      'UV resistant',
      'MC4 connectors included',
      'Temperature resistant',
      'Color coded'
    ],
    stock: 150,
    tags: ['Professional', 'Essential', 'Quality'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: false,
    deliveryFee: 1500,
    createdAt: '2024-01-19'
  },
  {
    id: 'sp003',
    title: 'Canadian Solar 450W HiKu Panel',
    description: 'High-power solar panel with advanced cell technology.',
    price: 320000,
    originalPrice: 350000,
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800',
      'https://images.unsplash.com/photo-1613665813446-79a7c40a0e7b?q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 167,
    seller: sellers[0],
    category: 'Solar Panels',
    subCategory: 'Monocrystalline',
    powerOutput: '450W',
    energyRating: 'A+',
    specifications: {
      brand: 'Canadian Solar',
      model: 'CS3W-450MS',
      warranty: '25 years',
      dimensions: '2108 x 1048 x 40 mm',
      weight: '24.9 kg',
      efficiency: '20.4%',
      certification: 'IEC 61215'
    },
    features: [
      'Bifacial technology',
      'Low temperature coefficient',
      'High snow load capacity',
      'Salt mist resistant',
      'PID resistant'
    ],
    stock: 45,
    tags: ['High-Power', 'Reliable', 'Commercial'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 6000,
    createdAt: '2024-01-17'
  },
  {
    id: 'inv002',
    title: 'Fronius Symo 10kW Three-Phase Inverter',
    description: 'Commercial-grade three-phase inverter with smart monitoring.',
    price: 950000,
    originalPrice: 1100000,
    images: [
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61d?q=80&w=800',
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61e?q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 89,
    seller: sellers[1],
    category: 'Inverters',
    subCategory: 'String Inverters',
    powerOutput: '10kW',
    energyRating: 'A++',
    specifications: {
      brand: 'Fronius',
      model: 'Symo 10.0-3-M',
      warranty: '10 years',
      dimensions: '725 x 510 x 225 mm',
      weight: '34.8 kg',
      efficiency: '98.1%',
      certification: 'VDE, CE'
    },
    features: [
      'Dynamic Peak Manager',
      'Smart Grid Ready',
      'Integrated WLAN',
      'Remote monitoring',
      'Arc fault protection'
    ],
    stock: 12,
    tags: ['Commercial', 'Three-Phase', 'Smart'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 15000,
    createdAt: '2024-01-16'
  },
  {
    id: 'bat002',
    title: 'BYD Premium HVM 22.1kWh Battery',
    description: 'High-voltage modular battery system for residential and commercial use.',
    price: 1250000,
    originalPrice: 1400000,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800',
      'https://images.unsplash.com/photo-1593941707822-8c74e298a74f?q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 45,
    seller: sellers[0],
    category: 'Batteries',
    subCategory: 'Lithium-Ion',
    powerOutput: '22.1kWh',
    energyRating: 'A++',
    specifications: {
      brand: 'BYD',
      model: 'Premium HVM 22.1',
      warranty: '10 years',
      dimensions: '1150 x 650 x 350 mm',
      weight: '164 kg',
      capacity: '22.1 kWh',
      certification: 'TÜV, CE'
    },
    features: [
      'Modular design',
      'High voltage system',
      'IP55 protection',
      'Built-in BMS',
      'Cobalt-free chemistry'
    ],
    stock: 8,
    tags: ['Premium', 'High-Capacity', 'Commercial'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 20000,
    createdAt: '2024-01-15'
  },
  {
    id: 'inv003',
    title: 'SolarEdge HD-Wave 6kW Inverter',
    description: 'High-efficiency single-phase inverter with advanced monitoring.',
    price: 450000,
    originalPrice: 520000,
    images: [
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61d?q=80&w=800',
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61e?q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 78,
    seller: sellers[1],
    category: 'Inverters',
    subCategory: 'String Inverters',
    powerOutput: '6kW',
    energyRating: 'A+',
    specifications: {
      brand: 'SolarEdge',
      model: 'SE6000H',
      warranty: '12 years',
      dimensions: '450 x 370 x 174 mm',
      weight: '16.5 kg',
      efficiency: '99%',
      certification: 'VDE, CE'
    },
    features: [
      'HD-Wave technology',
      'Built-in monitoring',
      'SafeDC™',
      'Arc fault protection',
      'Compact design'
    ],
    stock: 15,
    tags: ['Premium', 'Smart', 'Efficient'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 8000,
    createdAt: '2024-01-14'
  },
  {
    id: 'sp004',
    title: 'Jinko Solar Tiger 460W Panel',
    description: 'High-power mono PERC panel with excellent low-light performance.',
    price: 275000,
    originalPrice: 310000,
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800',
      'https://images.unsplash.com/photo-1613665813446-79a7c40a0e7b?q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 134,
    seller: sellers[0],
    category: 'Solar Panels',
    subCategory: 'Monocrystalline',
    powerOutput: '460W',
    energyRating: 'A+',
    specifications: {
      brand: 'Jinko Solar',
      model: 'JKM460M-7RL3',
      warranty: '25 years',
      dimensions: '2182 x 1029 x 35 mm',
      weight: '23.5 kg',
      efficiency: '20.93%',
      certification: 'IEC 61215'
    },
    features: [
      'Tiling Ribbon technology',
      'Multi-busbar design',
      'PID resistance',
      'Salt mist resistant',
      'High snow load'
    ],
    stock: 60,
    tags: ['High-Power', 'Durable', 'Commercial'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 7000,
    createdAt: '2024-01-13'
  },
  {
    id: 'acc002',
    title: 'Solar Panel Mounting Kit',
    description: 'Complete mounting system for residential installations.',
    price: 95000,
    images: [
      'https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800',
      'https://images.unsplash.com/photo-1592833159037-bb6f8f6f4ba8?q=80&w=800'
    ],
    rating: 4.5,
    reviewCount: 67,
    seller: sellers[1],
    category: 'Accessories',
    subCategory: 'Mounting',
    powerOutput: 'N/A',
    energyRating: 'N/A',
    specifications: {
      brand: 'IronRidge',
      model: 'XR100',
      warranty: '20 years',
      dimensions: 'Adjustable',
      weight: '35 kg',
      material: 'Aluminum',
      certification: 'UL 2703'
    },
    features: [
      'Universal compatibility',
      'Corrosion resistant',
      'Pre-assembled components',
      'Integrated grounding',
      'Wind tunnel tested'
    ],
    stock: 45,
    tags: ['Essential', 'Professional', 'Durable'],
    isNew: false,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 12000,
    createdAt: '2024-01-11'
  },
  {
    id: 'ctrl002',
    title: 'Schneider Conext MPPT 80A',
    description: 'Advanced MPPT charge controller for large systems.',
    price: 180000,
    originalPrice: 220000,
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800',
      'https://images.unsplash.com/photo-1581092580496-e2d81312c2f2?q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 92,
    seller: sellers[0],
    category: 'Controllers',
    subCategory: 'MPPT',
    powerOutput: '80A',
    energyRating: 'A+',
    specifications: {
      brand: 'Schneider',
      model: 'Conext MPPT 80 600',
      warranty: '5 years',
      dimensions: '760 x 220 x 220 mm',
      weight: '13.5 kg',
      efficiency: '98%',
      certification: 'CE, UL'
    },
    features: [
      'Fast MPPT tracking',
      'Battery temperature compensation',
      'Configurable auxiliary output',
      'Remote monitoring',
      'Multi-bank charging'
    ],
    stock: 18,
    tags: ['Professional', 'High-Capacity', 'Smart'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 5000,
    createdAt: '2024-01-10'
  },
  {
    id: 'bat003',
    title: 'LG RESU 16H Prime Battery',
    description: 'High-voltage residential battery with smart features.',
    price: 980000,
    originalPrice: 1150000,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800',
      'https://images.unsplash.com/photo-1593941707822-8c74e298a74f?q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 56,
    seller: sellers[1],
    category: 'Batteries',
    subCategory: 'Lithium-Ion',
    powerOutput: '16kWh',
    energyRating: 'A++',
    specifications: {
      brand: 'LG Energy Solution',
      model: 'RESU16H Prime',
      warranty: '10 years',
      dimensions: '744 x 907 x 206 mm',
      weight: '159 kg',
      capacity: '16 kWh',
      certification: 'UL 1973'
    },
    features: [
      'Smart TMS',
      'Expandable design',
      'High power output',
      'Compact size',
      'Easy installation'
    ],
    stock: 12,
    tags: ['Premium', 'Smart', 'High-Capacity'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 15000,
    createdAt: '2024-01-09'
  },
  {
    id: 'sp005',
    title: 'REC Alpha Pure 400W Panel',
    description: 'Lead-free solar panel with advanced cell technology.',
    price: 295000,
    originalPrice: 330000,
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800',
      'https://images.unsplash.com/photo-1613665813446-79a7c40a0e7b?q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 112,
    seller: sellers[0],
    category: 'Solar Panels',
    subCategory: 'Monocrystalline',
    powerOutput: '400W',
    energyRating: 'A++',
    specifications: {
      brand: 'REC',
      model: 'Alpha Pure-R',
      warranty: '25 years',
      dimensions: '1721 x 1016 x 30 mm',
      weight: '19.5 kg',
      efficiency: '21.9%',
      certification: 'IEC 61215'
    },
    features: [
      'Lead-free construction',
      'Heterojunction cells',
      'Split cell design',
      'Low temperature coefficient',
      'Advanced cell connection'
    ],
    stock: 30,
    tags: ['Premium', 'Eco-Friendly', 'High-Efficiency'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 7000,
    createdAt: '2024-01-08'
  },
  {
    id: 'inv004',
    title: 'Huawei SUN2000 8KTL Inverter',
    description: 'Smart three-phase inverter with AI monitoring.',
    price: 520000,
    originalPrice: 580000,
    images: [
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61d?q=80&w=800',
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61e?q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 87,
    seller: sellers[1],
    category: 'Inverters',
    subCategory: 'String Inverters',
    powerOutput: '8kW',
    energyRating: 'A+',
    specifications: {
      brand: 'Huawei',
      model: 'SUN2000-8KTL-M1',
      warranty: '10 years',
      dimensions: '525 x 470 x 166 mm',
      weight: '17 kg',
      efficiency: '98.6%',
      certification: 'IEC 62109'
    },
    features: [
      'AI-powered MPPT',
      'Smart IV diagnosis',
      'Arc fault protection',
      'Built-in PID recovery',
      'Smart dongle monitoring'
    ],
    stock: 25,
    tags: ['Smart', 'Three-Phase', 'Commercial'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 10000,
    createdAt: '2024-01-07'
  },
  {
    id: 'acc003',
    title: 'Solar Edge Protection Kit',
    description: 'Complete safety and protection equipment for installation.',
    price: 45000,
    images: [
      'https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800',
      'https://images.unsplash.com/photo-1592833159037-bb6f8f6f4ba8?q=80&w=800'
    ],
    rating: 4.4,
    reviewCount: 45,
    seller: sellers[0],
    category: 'Accessories',
    subCategory: 'Safety',
    powerOutput: 'N/A',
    energyRating: 'N/A',
    specifications: {
      brand: 'SafeSolar',
      model: 'PRO-EDGE-KIT',
      warranty: '2 years',
      dimensions: 'Various',
      weight: '8.5 kg',
      material: 'Various',
      certification: 'EN 1263-1'
    },
    features: [
      'Edge protection rails',
      'Safety harness points',
      'Warning signs',
      'Anti-slip mats',
      'Installation guide'
    ],
    stock: 75,
    tags: ['Safety', 'Essential', 'Professional'],
    isNew: false,
    isBestSeller: false,
    installationAvailable: false,
    deliveryFee: 3000,
    createdAt: '2024-01-06'
  },
  {
    id: 'ctrl003',
    title: 'Outback FLEXmax 100 MPPT',
    description: 'High-power MPPT controller for advanced systems.',
    price: 225000,
    originalPrice: 250000,
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800',
      'https://images.unsplash.com/photo-1581092580496-e2d81312c2f2?q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 67,
    seller: sellers[1],
    category: 'Controllers',
    subCategory: 'MPPT',
    powerOutput: '100A',
    energyRating: 'A++',
    specifications: {
      brand: 'Outback',
      model: 'FLEXmax 100',
      warranty: '5 years',
      dimensions: '410 x 220 x 190 mm',
      weight: '18.3 kg',
      efficiency: '98.8%',
      certification: 'ETL, CE'
    },
    features: [
      'Advanced MPPT algorithm',
      'Programmable aux control',
      'Extensive data logging',
      'RTS compensation',
      'MATE3s compatible'
    ],
    stock: 15,
    tags: ['Professional', 'High-Power', 'Advanced'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 6000,
    createdAt: '2024-01-05'
  },
  {
    id: 'bat004',
    title: 'Pylontech US3000C Battery',
    description: 'Modular lithium battery system for residential use.',
    price: 650000,
    originalPrice: 720000,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800',
      'https://images.unsplash.com/photo-1593941707822-8c74e298a74f?q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 89,
    seller: sellers[0],
    category: 'Batteries',
    subCategory: 'Lithium-Ion',
    powerOutput: '3.5kWh',
    energyRating: 'A+',
    specifications: {
      brand: 'Pylontech',
      model: 'US3000C',
      warranty: '10 years',
      dimensions: '442 x 420 x 132 mm',
      weight: '32 kg',
      capacity: '3.5 kWh',
      certification: 'TÜV, CE'
    },
    features: [
      'Modular design',
      'Built-in BMS',
      'LCD display',
      'CAN communication',
      'Stackable up to 16 units'
    ],
    stock: 20,
    tags: ['Modular', 'Residential', 'Smart'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 12000,
    createdAt: '2024-01-04'
  },
  {
    id: 'sp006',
    title: 'Trina Solar Vertex S 425W Panel',
    description: 'High-efficiency mono PERC panel with innovative cell design.',
    price: 265000,
    originalPrice: 295000,
    images: [
      'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?q=80&w=800',
      'https://images.unsplash.com/photo-1613665813446-79a7c40a0e7b?q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 156,
    seller: sellers[1],
    category: 'Solar Panels',
    subCategory: 'Monocrystalline',
    powerOutput: '425W',
    energyRating: 'A+',
    specifications: {
      brand: 'Trina Solar',
      model: 'TSM-425DE09.08',
      warranty: '25 years',
      dimensions: '1754 x 1096 x 30 mm',
      weight: '21 kg',
      efficiency: '21.5%',
      certification: 'IEC 61215'
    },
    features: [
      'Multi-busbar technology',
      'Half-cell design',
      'High density layout',
      'Low light performance',
      'PID resistant'
    ],
    stock: 40,
    tags: ['High-Efficiency', 'Premium', 'Commercial'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 7000,
    createdAt: '2024-01-03'
  },
  {
    id: 'inv005',
    title: 'Sungrow SG25CX-P Commercial Inverter',
    description: 'High-power commercial string inverter with smart monitoring.',
    price: 1250000,
    originalPrice: 1400000,
    images: [
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61d?q=80&w=800',
      'https://images.unsplash.com/photo-1559302995-f1d7e0b9d61e?q=80&w=800'
    ],
    rating: 4.8,
    reviewCount: 45,
    seller: sellers[0],
    category: 'Inverters',
    subCategory: 'String Inverters',
    powerOutput: '25kW',
    energyRating: 'A++',
    specifications: {
      brand: 'Sungrow',
      model: 'SG25CX-P',
      warranty: '10 years',
      dimensions: '702 x 595 x 310 mm',
      weight: '50 kg',
      efficiency: '98.7%',
      certification: 'IEC 62109'
    },
    features: [
      'Smart IV curve scanning',
      'String-level monitoring',
      'Built-in PID recovery',
      'Arc fault protection',
      'Smart air cooling'
    ],
    stock: 10,
    tags: ['Commercial', 'High-Power', 'Smart'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 20000,
    createdAt: '2024-01-02'
  },
  {
    id: 'acc004',
    title: 'Solar Panel Cleaning Kit Pro',
    description: 'Professional cleaning kit for solar panel maintenance.',
    price: 35000,
    images: [
      'https://images.unsplash.com/photo-1592833159155-c62df1b65634?q=80&w=800',
      'https://images.unsplash.com/photo-1592833159037-bb6f8f6f4ba8?q=80&w=800'
    ],
    rating: 4.6,
    reviewCount: 89,
    seller: sellers[1],
    category: 'Accessories',
    subCategory: 'Maintenance',
    powerOutput: 'N/A',
    energyRating: 'N/A',
    specifications: {
      brand: 'SolarCare',
      model: 'PRO-CLEAN-KIT',
      warranty: '1 year',
      dimensions: 'Various',
      weight: '4.5 kg',
      material: 'Various',
      certification: 'ISO 9001'
    },
    features: [
      'Extendable handle',
      'Microfiber cloths',
      'Biodegradable cleaner',
      'Water-fed brush',
      'Storage bag'
    ],
    stock: 100,
    tags: ['Maintenance', 'Professional', 'Essential'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: false,
    deliveryFee: 2000,
    createdAt: '2024-01-01'
  },
  {
    id: 'ctrl004',
    title: 'Morningstar TriStar MPPT 60A',
    description: 'Professional MPPT controller for medium to large systems.',
    price: 165000,
    originalPrice: 185000,
    images: [
      'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=800',
      'https://images.unsplash.com/photo-1581092580496-e2d81312c2f2?q=80&w=800'
    ],
    rating: 4.9,
    reviewCount: 76,
    seller: sellers[0],
    category: 'Controllers',
    subCategory: 'MPPT',
    powerOutput: '60A',
    energyRating: 'A+',
    specifications: {
      brand: 'Morningstar',
      model: 'TS-MPPT-60',
      warranty: '5 years',
      dimensions: '291 x 130 x 142 mm',
      weight: '4.2 kg',
      efficiency: '99%',
      certification: 'CE, RoHS'
    },
    features: [
      'TrakStar MPPT technology',
      'Custom charging profiles',
      'Remote monitoring',
      'Extensive data logging',
      'Parallel capability'
    ],
    stock: 25,
    tags: ['Professional', 'High-Efficiency', 'Smart'],
    isNew: false,
    isBestSeller: true,
    installationAvailable: true,
    deliveryFee: 4000,
    createdAt: '2023-12-31'
  },
  {
    id: 'bat005',
    title: 'Alpha ESS SMILE5 Battery',
    description: 'Smart residential battery system with expandable capacity.',
    price: 750000,
    originalPrice: 850000,
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800',
      'https://images.unsplash.com/photo-1593941707822-8c74e298a74f?q=80&w=800'
    ],
    rating: 4.7,
    reviewCount: 65,
    seller: sellers[1],
    category: 'Batteries',
    subCategory: 'Lithium-Ion',
    powerOutput: '5kWh',
    energyRating: 'A+',
    specifications: {
      brand: 'Alpha ESS',
      model: 'SMILE5',
      warranty: '10 years',
      dimensions: '650 x 565 x 180 mm',
      weight: '67 kg',
      capacity: '5.0 kWh',
      certification: 'IEC 62619'
    },
    features: [
      'Modular design',
      'Smart monitoring',
      'Emergency power supply',
      'High cycle life',
      'Low maintenance'
    ],
    stock: 15,
    tags: ['Smart', 'Residential', 'Expandable'],
    isNew: true,
    isBestSeller: false,
    installationAvailable: true,
    deliveryFee: 15000,
    createdAt: '2023-12-30'
  }
  // ... continue with more products
];

export const filterOptions = {
  priceRanges: [
    { id: 'under100k', label: 'Under ₦100,000', min: 0, max: 100000 },
    { id: '100k-250k', label: '₦100,000 - ₦250,000', min: 100000, max: 250000 },
    { id: '250k-500k', label: '₦250,000 - ₦500,000', min: 250000, max: 500000 },
    { id: 'over500k', label: 'Over ₦500,000', min: 500000, max: Infinity }
  ],
  powerOutputRanges: [
    { id: 'under200w', label: 'Under 200W', min: 0, max: 200 },
    { id: '200w-400w', label: '200W - 400W', min: 200, max: 400 },
    { id: '400w-600w', label: '400W - 600W', min: 400, max: 600 },
    { id: 'over600w', label: 'Over 600W', min: 600, max: Infinity }
  ],
  ratings: [
    { id: '4plus', label: '4+ Stars', value: 4 },
    { id: '3plus', label: '3+ Stars', value: 3 },
    { id: 'all', label: 'All Ratings', value: 0 }
  ],
  sortOptions: [
    { id: 'popular', label: 'Most Popular' },
    { id: 'newest', label: 'Newest First' },
    { id: 'priceAsc', label: 'Price: Low to High' },
    { id: 'priceDesc', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' }
  ],
  availability: [
    { id: 'inStock', label: 'In Stock' },
    { id: 'installation', label: 'Installation Available' },
    { id: 'freeDelivery', label: 'Free Delivery' }
  ]
}; 