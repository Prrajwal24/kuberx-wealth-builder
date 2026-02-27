export interface PurchaseItem {
  id: string;
  name: string;
  averagePrice: number;
  category: string;
  type: 'essential' | 'lifestyle' | 'investment';
  depreciationLevel: 'high' | 'medium' | 'low' | 'none';
  financialImpact: 'low' | 'medium' | 'high';
  icon?: string;
}

export interface PurchaseCategory {
  id: string;
  name: string;
  icon: string;
  items: PurchaseItem[];
}

export const purchaseCategories: PurchaseCategory[] = [
  {
    id: 'gadgets-tech',
    name: 'Gadgets & Tech',
    icon: '📱',
    items: [
      { id: 'iphone', name: 'iPhone / Premium Smartphone', averagePrice: 80000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'high' },
      { id: 'android-phone', name: 'Android Flagship Phone', averagePrice: 70000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'high' },
      { id: 'laptop', name: 'Laptop (MacBook / Windows)', averagePrice: 90000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'high' },
      { id: 'tablet', name: 'Tablet / iPad', averagePrice: 45000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'medium' },
      { id: 'smartwatch', name: 'Smartwatch', averagePrice: 25000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'medium' },
      { id: 'earbuds', name: 'Wireless Earbuds', averagePrice: 15000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'low' },
      { id: 'gaming-console', name: 'Gaming Console', averagePrice: 35000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'medium' },
      { id: 'mechanical-keyboard', name: 'Mechanical Keyboard', averagePrice: 10000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'medium', financialImpact: 'low' },
      { id: 'monitor', name: 'External Monitor', averagePrice: 20000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'medium', financialImpact: 'low' },
      { id: 'camera', name: 'Camera / GoPro', averagePrice: 50000, category: 'Gadgets & Tech', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'medium' },
    ]
  },
  {
    id: 'gaming-entertainment',
    name: 'Gaming & Entertainment',
    icon: '🎮',
    items: [
      { id: 'gaming-pc', name: 'Gaming PC', averagePrice: 120000, category: 'Gaming & Entertainment', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'high' },
      { id: 'ps5-xbox', name: 'PlayStation / Xbox', averagePrice: 50000, category: 'Gaming & Entertainment', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'medium' },
      { id: 'gaming-accessories', name: 'Gaming Accessories', averagePrice: 8000, category: 'Gaming & Entertainment', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'low' },
      { id: 'in-game-purchases', name: 'In-game Purchases', averagePrice: 2000, category: 'Gaming & Entertainment', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'low' },
      { id: 'streaming-subs', name: 'Streaming Subscriptions', averagePrice: 500, category: 'Gaming & Entertainment', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'low' },
      { id: 'movie-tickets', name: 'Movie Tickets', averagePrice: 400, category: 'Gaming & Entertainment', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'low' },
    ]
  },
  {
    id: 'vehicles-transport',
    name: 'Vehicles & Transport',
    icon: '🚗',
    items: [
      { id: 'bike-motorcycle', name: 'Bike / Motorcycle', averagePrice: 150000, category: 'Vehicles & Transport', type: 'essential', depreciationLevel: 'medium', financialImpact: 'high' },
      { id: 'e-scooter', name: 'Electric Scooter', averagePrice: 45000, category: 'Vehicles & Transport', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'medium' },
      { id: 'used-car', name: 'Used Car', averagePrice: 400000, category: 'Vehicles & Transport', type: 'essential', depreciationLevel: 'medium', financialImpact: 'high' },
      { id: 'new-car', name: 'New Car', averagePrice: 800000, category: 'Vehicles & Transport', type: 'essential', depreciationLevel: 'high', financialImpact: 'high' },
    ]
  },
  {
    id: 'travel-experiences',
    name: 'Travel & Experiences',
    icon: '✈️',
    items: [
      { id: 'domestic-trip', name: 'Domestic Trip', averagePrice: 15000, category: 'Travel & Experiences', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'medium' },
      { id: 'international-trip', name: 'International Trip', averagePrice: 120000, category: 'Travel & Experiences', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'high' },
      { id: 'weekend-getaway', name: 'Weekend Getaway', averagePrice: 7000, category: 'Travel & Experiences', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'low' },
      { id: 'concert-festival', name: 'Concert / Music Festival', averagePrice: 5000, category: 'Travel & Experiences', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'low' },
      { id: 'adventure-activity', name: 'Adventure Activity', averagePrice: 10000, category: 'Travel & Experiences', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'medium' },
    ]
  },
  {
    id: 'fashion-lifestyle',
    name: 'Fashion & Lifestyle',
    icon: '👠',
    items: [
      { id: 'premium-sneakers', name: 'Premium Sneakers', averagePrice: 12000, category: 'Fashion & Lifestyle', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'low' },
      { id: 'designer-clothes', name: 'Designer Clothes', averagePrice: 10000, category: 'Fashion & Lifestyle', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'low' },
      { id: 'gym-membership', name: 'Gym Membership (Annual)', averagePrice: 20000, category: 'Fashion & Lifestyle', type: 'essential', depreciationLevel: 'none', financialImpact: 'low' },
      { id: 'fitness-equipment', name: 'Fitness Equipment', averagePrice: 15000, category: 'Fashion & Lifestyle', type: 'lifestyle', depreciationLevel: 'medium', financialImpact: 'low' },
      { id: 'luxury-watch', name: 'Luxury Watch', averagePrice: 50000, category: 'Fashion & Lifestyle', type: 'lifestyle', depreciationLevel: 'low', financialImpact: 'medium' },
      { id: 'sunglasses', name: 'Sunglasses', averagePrice: 5000, category: 'Fashion & Lifestyle', type: 'lifestyle', depreciationLevel: 'high', financialImpact: 'low' },
    ]
  },
  {
    id: 'education-skills',
    name: 'Education & Skill Building',
    icon: '📚',
    items: [
      { id: 'online-course', name: 'Online Course', averagePrice: 8000, category: 'Education & Skill Building', type: 'investment', depreciationLevel: 'none', financialImpact: 'low' },
      { id: 'certification', name: 'Certification Program', averagePrice: 25000, category: 'Education & Skill Building', type: 'investment', depreciationLevel: 'none', financialImpact: 'medium' },
      { id: 'bootcamp', name: 'Coding Bootcamp', averagePrice: 100000, category: 'Education & Skill Building', type: 'investment', depreciationLevel: 'none', financialImpact: 'high' },
      { id: 'workshop', name: 'Professional Workshop', averagePrice: 10000, category: 'Education & Skill Building', type: 'investment', depreciationLevel: 'none', financialImpact: 'low' },
    ]
  },
  {
    id: 'home-living',
    name: 'Home & Living',
    icon: '🏠',
    items: [
      { id: 'furniture', name: 'Furniture Purchase', averagePrice: 50000, category: 'Home & Living', type: 'essential', depreciationLevel: 'medium', financialImpact: 'medium' },
      { id: 'home-office', name: 'Home Office Setup', averagePrice: 40000, category: 'Home & Living', type: 'essential', depreciationLevel: 'medium', financialImpact: 'medium' },
      { id: 'kitchen-appliances', name: 'Kitchen Appliances', averagePrice: 30000, category: 'Home & Living', type: 'essential', depreciationLevel: 'low', financialImpact: 'medium' },
    ]
  },
  {
    id: 'financial-decisions',
    name: 'Financial Decisions',
    icon: '💰',
    items: [
      { id: 'sip-investment', name: 'Start SIP Investment', averagePrice: 5000, category: 'Financial Decisions', type: 'investment', depreciationLevel: 'none', financialImpact: 'medium' },
      { id: 'buy-gold', name: 'Buy Gold', averagePrice: 50000, category: 'Financial Decisions', type: 'investment', depreciationLevel: 'low', financialImpact: 'medium' },
      { id: 'buy-crypto', name: 'Buy Crypto', averagePrice: 25000, category: 'Financial Decisions', type: 'investment', depreciationLevel: 'high', financialImpact: 'high' },
      { id: 'credit-card-upgrade', name: 'Credit Card Upgrade', averagePrice: 5000, category: 'Financial Decisions', type: 'lifestyle', depreciationLevel: 'none', financialImpact: 'low' },
      { id: 'bnpl-purchase', name: 'Buy Now Pay Later Purchase', averagePrice: 20000, category: 'Financial Decisions', type: 'lifestyle', depreciationLevel: 'medium', financialImpact: 'medium' },
      { id: 'personal-loan', name: 'Take Personal Loan', averagePrice: 200000, category: 'Financial Decisions', type: 'essential', depreciationLevel: 'none', financialImpact: 'high' },
    ]
  },
];

// Flatten all items for easy lookup
export const allPurchaseItems = purchaseCategories.flatMap(cat => cat.items);

export function getPurchaseItemById(id: string): PurchaseItem | undefined {
  return allPurchaseItems.find(item => item.id === id);
}

export function getPurchasesByCategory(categoryId: string): PurchaseItem[] {
  const category = purchaseCategories.find(cat => cat.id === categoryId);
  return category ? category.items : [];
}

export function getPopularPurchases(): PurchaseItem[] {
  return [
    getPurchaseItemById('iphone'),
    getPurchaseItemById('international-trip'),
    getPurchaseItemById('gaming-console'),
  ].filter((item): item is PurchaseItem => item !== undefined);
}
