// Restaurant API service
import { apiClient, ApiError, handleAuthError, PaginatedResponse } from './api';

// Restaurant DTOs matching backend
export interface CreateRestaurantDto {
  name: string;
  description: string;
  foodcourtId: string;
  location?: {
    floor: number;
    section: string;
    spotNumber?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    cardStyle?: 'minimal' | 'elevated' | 'outlined';
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
  };
}

export interface UpdateRestaurantDto {
  name?: string;
  description?: string;
  foodcourtId?: string;
  location?: {
    floor: number;
    section: string;
    spotNumber?: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    backgroundColor?: string;
    textColor?: string;
    cardStyle?: 'minimal' | 'elevated' | 'outlined';
    borderRadius?: 'none' | 'small' | 'medium' | 'large';
  };
}

export interface RestaurantResponseDto {
  id: string;
  name: string;
  description: string;
  logo?: string;
  banner?: string;
  foodcourtId: string;
  ownerId: string;
  location?: {
    floor: number;
    section: string;
    spotNumber?: string;
  };
  theme?: any;
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED';
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  foodcourt?: {
    id: string;
    name: string;
    location: string;
  };
  categoriesCount?: number;
  productsCount?: number;
}

export interface RestaurantListResponseDto extends PaginatedResponse<RestaurantResponseDto> {}

export interface RestaurantStatsDto {
  totalRevenue: number;
  totalOrders: number;
  avgOrderValue: number;
  revenueChange: number;
  ordersChange: number;
  avgOrderValueChange: number;
  topProducts: Array<{
    id: string;
    name: string;
    revenue: number;
    orders: number;
  }>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export interface RestaurantPublishDto {
  isPublished: boolean;
}

export class RestaurantService {
  /**
   * Create a new restaurant
   */
  static async create(data: CreateRestaurantDto): Promise<RestaurantResponseDto> {
    try {
      return await apiClient.post<RestaurantResponseDto>('/restaurants', data);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get all restaurants for current user with pagination
   */
  static async getAll(params?: {
    page?: number;
    limit?: number;
    foodcourtId?: string;
    status?: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED';
    search?: string;
  }): Promise<RestaurantListResponseDto> {
    try {
      return await apiClient.get<RestaurantListResponseDto>('/restaurants', params);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get a restaurant by ID
   */
  static async getById(id: string): Promise<RestaurantResponseDto> {
    try {
      return await apiClient.get<RestaurantResponseDto>(`/restaurants/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Update a restaurant
   */
  static async update(id: string, data: UpdateRestaurantDto): Promise<RestaurantResponseDto> {
    try {
      return await apiClient.patch<RestaurantResponseDto>(`/restaurants/${id}`, data);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Delete a restaurant
   */
  static async delete(id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/restaurants/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Toggle restaurant published status
   */
  static async togglePublished(id: string, isPublished: boolean): Promise<RestaurantResponseDto> {
    try {
      return await apiClient.patch<RestaurantResponseDto>(`/restaurants/${id}/publish`, {
        isPublished,
      });
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get restaurant statistics
   */
  static async getStatistics(id: string): Promise<RestaurantStatsDto> {
    try {
      return await apiClient.get<RestaurantStatsDto>(`/restaurants/${id}/statistics`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Upload restaurant logo
   */
  static async uploadLogo(id: string, file: File): Promise<RestaurantResponseDto> {
    try {
      return await apiClient.uploadFile<RestaurantResponseDto>(`/restaurants/${id}/upload-logo`, file, 'image');
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Upload restaurant banner
   */
  static async uploadBanner(id: string, file: File): Promise<RestaurantResponseDto> {
    try {
      return await apiClient.uploadFile<RestaurantResponseDto>(`/restaurants/${id}/upload-banner`, file, 'image');
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }
}