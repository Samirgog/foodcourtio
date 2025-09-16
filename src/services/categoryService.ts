// Category API service
import { apiClient, handleAuthError } from './api';

// Category DTOs
export interface CreateCategoryDto {
  name: string;
  description?: string;
  priority?: number;
  isActive?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
  priority?: number;
  isActive?: boolean;
}

export interface CategoryResponseDto {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  priority: number;
  isActive: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  productsCount?: number;
  products?: ProductResponseDto[];
}

export interface ProductResponseDto {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  image?: string;
  price: number;
  weight?: string;
  volume?: string;
  isAvailable: boolean;
  isPublished: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  variants?: ProductVariantDto[];
}

export interface ProductVariantDto {
  id: string;
  name: string;
  priceModifier: number;
  isDefault?: boolean;
}

export interface ReorderCategoriesDto {
  categoryIds: string[];
}

export interface PublishCategoryDto {
  isPublished: boolean;
}

export class CategoryService {
  /**
   * Create a new category
   */
  static async create(restaurantId: string, data: CreateCategoryDto): Promise<CategoryResponseDto> {
    try {
      return await apiClient.post<CategoryResponseDto>(`/restaurants/${restaurantId}/categories`, data);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get all categories for a restaurant
   */
  static async getAllByRestaurant(
    restaurantId: string, 
    includeDrafts = true
  ): Promise<CategoryResponseDto[]> {
    try {
      return await apiClient.get<CategoryResponseDto[]>(
        `/restaurants/${restaurantId}/categories`, 
        { includeDrafts }
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get published categories (for public use)
   */
  static async getPublished(restaurantId: string): Promise<CategoryResponseDto[]> {
    try {
      return await apiClient.get<CategoryResponseDto[]>(
        `/restaurants/${restaurantId}/categories/published`
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get a category by ID
   */
  static async getById(restaurantId: string, id: string): Promise<CategoryResponseDto> {
    try {
      return await apiClient.get<CategoryResponseDto>(`/restaurants/${restaurantId}/categories/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Update a category
   */
  static async update(
    restaurantId: string, 
    id: string, 
    data: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    try {
      return await apiClient.patch<CategoryResponseDto>(
        `/restaurants/${restaurantId}/categories/${id}`, 
        data
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Delete a category
   */
  static async delete(restaurantId: string, id: string): Promise<{ message: string }> {
    try {
      return await apiClient.delete<{ message: string }>(`/restaurants/${restaurantId}/categories/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Reorder categories
   */
  static async reorder(
    restaurantId: string, 
    data: ReorderCategoriesDto
  ): Promise<CategoryResponseDto[]> {
    try {
      return await apiClient.patch<CategoryResponseDto[]>(
        `/restaurants/${restaurantId}/categories/reorder`, 
        data
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Toggle category published status
   */
  static async togglePublish(
    restaurantId: string, 
    id: string, 
    isPublished: boolean
  ): Promise<CategoryResponseDto> {
    try {
      return await apiClient.patch<CategoryResponseDto>(
        `/restaurants/${restaurantId}/categories/${id}/publish`, 
        { isPublished }
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Duplicate a category
   */
  static async duplicate(restaurantId: string, id: string): Promise<CategoryResponseDto> {
    try {
      return await apiClient.post<CategoryResponseDto>(
        `/restaurants/${restaurantId}/categories/${id}/duplicate`
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Auto-save category changes
   */
  static async autoSave(
    restaurantId: string, 
    id: string, 
    data: UpdateCategoryDto
  ): Promise<CategoryResponseDto> {
    try {
      return await apiClient.patch<CategoryResponseDto>(
        `/restaurants/${restaurantId}/categories/${id}/autosave`, 
        data
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }
}