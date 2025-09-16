// Product API service
import { apiClient, handleAuthError } from './api';

// Product DTOs
export interface CreateProductDto {
  categoryId: string;
  name: string;
  description: string;
  price: number;
  weight?: string;
  volume?: string;
  image?: string;
  isAvailable?: boolean;
  priority?: number;
  variants?: CreateProductVariantDto[];
}

export interface CreateProductVariantDto {
  name: string;
  priceModifier: number;
  isDefault?: boolean;
}

export interface UpdateProductDto {
  categoryId?: string;
  name?: string;
  description?: string;
  price?: number;
  weight?: string;
  volume?: string;
  image?: string;
  isAvailable?: boolean;
  priority?: number;
  variants?: CreateProductVariantDto[];
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
  variants?: ProductVariantResponseDto[];
  category?: {
    id: string;
    name: string;
    restaurantId: string;
  };
}

export interface ProductVariantResponseDto {
  id: string;
  productId: string;
  name: string;
  priceModifier: number;
  isDefault: boolean;
}

export interface ReorderProductsDto {
  productIds: string[];
}

export interface ProductStatisticsDto {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  avgPrice: number;
  mostExpensive: {
    id: string;
    name: string;
    price: number;
  };
  cheapest: {
    id: string;
    name: string;
    price: number;
  };
  categoriesBreakdown: Array<{
    categoryId: string;
    categoryName: string;
    productCount: number;
    avgPrice: number;
  }>;
}

export interface UploadImageResponseDto {
  filename: string;
  path: string;
  size: number;
}

export class ProductService {
  /**
   * Create a new product
   */
  static async create(data: CreateProductDto): Promise<ProductResponseDto> {
    try {
      return await apiClient.post<ProductResponseDto>('/products', data);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Upload product image
   */
  static async uploadImage(file: File): Promise<UploadImageResponseDto> {
    try {
      return await apiClient.uploadFile<UploadImageResponseDto>('/products/upload-image', file, 'image');
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get all products in a category
   */
  static async getAllByCategory(
    categoryId: string, 
    includeDrafts = true
  ): Promise<ProductResponseDto[]> {
    try {
      return await apiClient.get<ProductResponseDto[]>(
        `/products/category/${categoryId}`, 
        { includeDrafts }
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get all products in a restaurant
   */
  static async getAllByRestaurant(
    restaurantId: string, 
    includeDrafts = true
  ): Promise<ProductResponseDto[]> {
    try {
      return await apiClient.get<ProductResponseDto[]>(
        `/products/restaurant/${restaurantId}`, 
        { includeDrafts }
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get product statistics for a restaurant
   */
  static async getStatistics(restaurantId: string): Promise<ProductStatisticsDto> {
    try {
      return await apiClient.get<ProductStatisticsDto>(
        `/products/restaurant/${restaurantId}/statistics`
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Get a product by ID
   */
  static async getById(id: string): Promise<ProductResponseDto> {
    try {
      return await apiClient.get<ProductResponseDto>(`/products/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Update a product
   */
  static async update(id: string, data: UpdateProductDto): Promise<ProductResponseDto> {
    try {
      return await apiClient.patch<ProductResponseDto>(`/products/${id}`, data);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Auto-save product changes (draft mode)
   */
  static async autoSave(id: string, data: Partial<CreateProductDto>): Promise<ProductResponseDto> {
    try {
      return await apiClient.patch<ProductResponseDto>(`/products/${id}/autosave`, data);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Publish a product (remove from draft)
   */
  static async publish(id: string): Promise<ProductResponseDto> {
    try {
      return await apiClient.patch<ProductResponseDto>(`/products/${id}/publish`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Duplicate a product
   */
  static async duplicate(id: string): Promise<ProductResponseDto> {
    try {
      return await apiClient.post<ProductResponseDto>(`/products/${id}/duplicate`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Reorder products within a category
   */
  static async reorder(categoryId: string, data: ReorderProductsDto): Promise<ProductResponseDto[]> {
    try {
      return await apiClient.patch<ProductResponseDto[]>(
        `/products/category/${categoryId}/reorder`, 
        data
      );
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  static async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/products/${id}`);
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }
}