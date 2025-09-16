// Foodcourt API service
import { apiClient, handleAuthError, PaginatedResponse } from './api';

// Foodcourt DTOs
export interface FoodcourtResponseDto {
  id: string;
  name: string;
  location: string;
  description?: string;
  imageUrl?: string;
  city: string;
  timezone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  restaurantsCount?: number;
  activeRestaurantsCount?: number;
}

export interface FoodcourtListResponseDto extends PaginatedResponse<FoodcourtResponseDto> {}

export class FoodcourtService {
  /**
   * Get all foodcourts with pagination
   */
  static async getAll(params?: {
    page?: number;
    limit?: number;
    city?: string;
    search?: string;
  }): Promise<FoodcourtListResponseDto> {
    try {
      return await apiClient.get<FoodcourtListResponseDto>('/foodcourts', params);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get a foodcourt by ID
   */
  static async getById(id: string): Promise<FoodcourtResponseDto> {
    try {
      return await apiClient.get<FoodcourtResponseDto>(`/foodcourts/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get active foodcourts (simplified list for dropdowns)
   */
  static async getActive(): Promise<FoodcourtResponseDto[]> {
    try {
      const response = await apiClient.get<FoodcourtListResponseDto>('/foodcourts', {
        limit: 100, // Get many for dropdowns
        isActive: true
      });
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }
}