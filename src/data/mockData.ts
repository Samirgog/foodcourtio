import { 
  FoodCourt, 
  PaymentProvider, 
  Restaurant, 
  RestaurantTheme,
  Category,
  Product,
  User
} from '../types';

export const mockUser: User = {
  id: '1',
  email: 'owner@example.com',
  name: 'John Doe',
  role: 'restaurant_owner',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
};

export const mockFoodCourts: FoodCourt[] = [
  {
    id: '1',
    name: 'Central Food Hall',
    location: 'Downtown Plaza, Level 2',
    description: 'Premium food court in the heart of the city',
    imageUrl: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=400&h=200&fit=crop',
    totalRestaurants: 24,
    availableSpots: 3
  },
  {
    id: '2',
    name: 'Mall Express Dining',
    location: 'Shopping Center West Wing',
    description: 'Popular family dining destination',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=200&fit=crop',
    totalRestaurants: 18,
    availableSpots: 5
  },
  {
    id: '3',
    name: 'Business District Eats',
    location: 'Financial Tower, Ground Floor',
    description: 'Quick service for busy professionals',
    imageUrl: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=200&fit=crop',
    totalRestaurants: 12,
    availableSpots: 2
  }
];

export const mockPaymentProviders: PaymentProvider[] = [
  {
    id: 'stripe',
    name: 'Stripe',
    logo: 'https://stripe.com/img/v3/newsroom/social.png',
    description: 'Global payment processing with great developer tools',
    supportedCountries: ['US', 'CA', 'GB', 'AU', 'EU'],
    fees: { percentage: 2.9, fixedFee: 0.30 }
  },
  {
    id: 'square',
    name: 'Square',
    logo: 'https://squareup.com/us/en/press/brand',
    description: 'Simple payment solutions for small businesses',
    supportedCountries: ['US', 'CA', 'AU', 'JP'],
    fees: { percentage: 2.6, fixedFee: 0.10 }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    logo: 'https://www.paypal.com/en_US/i/logo/paypal_logo.gif',
    description: 'Trusted payment platform worldwide',
    supportedCountries: ['US', 'CA', 'GB', 'AU', 'EU', 'JP'],
    fees: { percentage: 3.49, fixedFee: 0.49 }
  }
];

export const mockThemes: RestaurantTheme[] = [
  {
    id: 'modern',
    name: 'Modern Minimal',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    cardStyle: 'minimal',
    borderRadius: 'medium'
  },
  {
    id: 'warm',
    name: 'Warm & Cozy',
    primaryColor: '#ea580c',
    secondaryColor: '#c2410c',
    accentColor: '#fb923c',
    backgroundColor: '#fef7ed',
    textColor: '#431407',
    cardStyle: 'elevated',
    borderRadius: 'large'
  },
  {
    id: 'fresh',
    name: 'Fresh & Clean',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#10b981',
    backgroundColor: '#f0fdf4',
    textColor: '#064e3b',
    cardStyle: 'outlined',
    borderRadius: 'small'
  },
  {
    id: 'elegant',
    name: 'Elegant Dark',
    primaryColor: '#7c3aed',
    secondaryColor: '#6d28d9',
    accentColor: '#8b5cf6',
    backgroundColor: '#1f2937',
    textColor: '#f9fafb',
    cardStyle: 'elevated',
    borderRadius: 'medium'
  }
];

export const mockRestaurant: Restaurant = {
  id: '1',
  name: 'Bella Vista Pizza',
  description: 'Authentic Italian pizza made with fresh ingredients',
  logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop',
  banner: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=300&fit=crop',
  foodCourtId: '1',
  ownerId: '1',
  paymentProvider: mockPaymentProviders[0],
  location: {
    floor: 2,
    section: 'A',
    spotNumber: '12'
  },
  theme: mockThemes[0],
  isPublished: false,
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z'
};

export const mockCategories: Category[] = [
  {
    id: '1',
    restaurantId: '1',
    name: 'Classic Pizzas',
    description: 'Our signature traditional pizzas',
    priority: 1,
    isActive: true,
    products: []
  },
  {
    id: '2',
    restaurantId: '1',
    name: 'Gourmet Specials',
    description: 'Premium pizzas with unique toppings',
    priority: 2,
    isActive: true,
    products: []
  },
  {
    id: '3',
    restaurantId: '1',
    name: 'Sides & Appetizers',
    description: 'Perfect starters and sides',
    priority: 3,
    isActive: true,
    products: []
  },
  {
    id: '4',
    restaurantId: '1',
    name: 'Beverages',
    description: 'Refreshing drinks and beverages',
    priority: 4,
    isActive: true,
    products: []
  }
];

export const mockProducts: Product[] = [
  // Classic Pizzas
  {
    id: '1',
    categoryId: '1',
    name: 'Margherita',
    description: 'Fresh tomato sauce, mozzarella, and basil',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=200&fit=crop',
    price: 12.99,
    weight: '350g',
    variants: [
      { id: '1', name: 'Small (10")', priceModifier: -3.00 },
      { id: '2', name: 'Medium (12")', priceModifier: 0, isDefault: true },
      { id: '3', name: 'Large (14")', priceModifier: 4.00 }
    ],
    isAvailable: true,
    priority: 1
  },
  {
    id: '2',
    categoryId: '1',
    name: 'Pepperoni',
    description: 'Classic pepperoni with mozzarella cheese',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=300&h=200&fit=crop',
    price: 14.99,
    weight: '380g',
    variants: [
      { id: '4', name: 'Small (10")', priceModifier: -3.00 },
      { id: '5', name: 'Medium (12")', priceModifier: 0, isDefault: true },
      { id: '6', name: 'Large (14")', priceModifier: 4.00 }
    ],
    isAvailable: true,
    priority: 2
  },
  // Gourmet Specials
  {
    id: '3',
    categoryId: '2',
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms with truffle oil and parmesan',
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=300&h=200&fit=crop',
    price: 18.99,
    weight: '400g',
    isAvailable: true,
    priority: 1
  },
  // Sides
  {
    id: '4',
    categoryId: '3',
    name: 'Garlic Bread',
    description: 'Freshly baked bread with garlic butter',
    image: 'https://images.unsplash.com/photo-1619985632461-f33748ef8291?w=300&h=200&fit=crop',
    price: 5.99,
    weight: '200g',
    isAvailable: true,
    priority: 1
  },
  // Beverages
  {
    id: '5',
    categoryId: '4',
    name: 'Italian Soda',
    description: 'Sparkling water with fruit syrups',
    image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&h=200&fit=crop',
    price: 3.99,
    volume: '350ml',
    variants: [
      { id: '7', name: 'Lemon', priceModifier: 0, isDefault: true },
      { id: '8', name: 'Orange', priceModifier: 0 },
      { id: '9', name: 'Berry', priceModifier: 0.50 }
    ],
    isAvailable: true,
    priority: 1
  }
];

// AI Generator mock responses
export const mockAIResponses = {
  'pizza menu': {
    categories: [
      { name: 'Classic Pizzas', description: 'Traditional Italian favorites', priority: 1, isActive: true, products: [] },
      { name: 'Gourmet Pizzas', description: 'Premium specialty pizzas', priority: 2, isActive: true, products: [] },
      { name: 'Appetizers', description: 'Perfect starters', priority: 3, isActive: true, products: [] },
      { name: 'Desserts', description: 'Sweet endings', priority: 4, isActive: true, products: [] },
      { name: 'Beverages', description: 'Drinks and sodas', priority: 5, isActive: true, products: [] }
    ]
  },
  'burger joint': {
    categories: [
      { name: 'Burgers', description: 'Juicy handcrafted burgers', priority: 1, isActive: true, products: [] },
      { name: 'Chicken', description: 'Crispy chicken options', priority: 2, isActive: true, products: [] },
      { name: 'Sides', description: 'Fries and more', priority: 3, isActive: true, products: [] },
      { name: 'Shakes', description: 'Thick milkshakes', priority: 4, isActive: true, products: [] }
    ]
  }
};

export const generateMockCatalog = (prompt: string) => {
  // Simple AI simulation - in real app this would call an AI service
  const lowercasePrompt = prompt.toLowerCase();
  
  if (lowercasePrompt.includes('pizza')) {
    return mockAIResponses['pizza menu'];
  } else if (lowercasePrompt.includes('burger')) {
    return mockAIResponses['burger joint'];
  } else {
    // Generic restaurant menu
    return {
      categories: [
        { name: 'Main Dishes', description: 'Our signature dishes', priority: 1, isActive: true, products: [] },
        { name: 'Appetizers', description: 'Start your meal right', priority: 2, isActive: true, products: [] },
        { name: 'Beverages', description: 'Drinks and refreshments', priority: 3, isActive: true, products: [] }
      ]
    };
  }
};