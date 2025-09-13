// Core data types for the FoodCourt Admin Panel

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'restaurant_owner';
  avatar?: string;
}

export interface FoodCourt {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  totalRestaurants: number;
  availableSpots: number;
}

export interface PaymentProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  supportedCountries: string[];
  fees: {
    percentage: number;
    fixedFee?: number;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  foodCourtId: string;
  ownerId: string;
  paymentProvider?: PaymentProvider;
  location?: {
    floor: number;
    section: string;
    spotNumber?: string;
  };
  theme: RestaurantTheme;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantTheme {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  cardStyle: 'minimal' | 'elevated' | 'outlined';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  priority: number;
  isActive: boolean;
  products: Product[];
}

export interface ProductVariant {
  id: string;
  name: string;
  priceModifier: number; // Can be positive or negative
  isDefault?: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  weight?: string;
  volume?: string;
  variants?: ProductVariant[];
  isAvailable: boolean;
  priority: number;
}

export interface AIGeneratorRequest {
  prompt: string;
  restaurantType?: string;
  numberOfCategories?: number;
  itemsPerCategory?: number;
}

export interface AIGeneratorResponse {
  categories: Omit<Category, 'id' | 'restaurantId'>[];
  products: Omit<Product, 'id' | 'categoryId'>[];
}

// UI State types
export interface UIState {
  sidebarOpen: boolean;
  activeModal: string | null;
  loading: boolean;
  previewMode: boolean;
  selectedTheme: string;
}

// Form types
export interface RestaurantFormData {
  name: string;
  description: string;
  foodCourtId: string;
  logo?: File;
  banner?: File;
  paymentProviderId?: string;
  location?: {
    floor: number;
    section: string;
    spotNumber?: string;
  };
  themeId: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  priority: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  weight?: string;
  volume?: string;
  image?: File;
  variants?: Omit<ProductVariant, 'id'>[];
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Employee Management types
export interface Employee {
  id: string;
  restaurantId: string;
  telegramUserId: string;
  name: string;
  username?: string;
  isActive: boolean;
  invitedAt: string;
  joinedAt?: string;
  lastSeen?: string;
}

export interface InviteLink {
  id: string;
  restaurantId: string;
  token: string;
  url: string;
  expiresAt: string;
  createdAt: string;
  usedBy?: string;
  isUsed: boolean;
}

export interface EmployeeInviteRequest {
  restaurantId: string;
  expiresInHours?: number; // Default 24 hours
}

export interface EmployeeStatusUpdate {
  employeeId: string;
  isActive: boolean;
}