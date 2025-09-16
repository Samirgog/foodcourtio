// Authentication API service
import { apiClient, TokenManager, ApiError, handleAuthError } from './api';

// Auth DTOs matching backend
export interface TelegramLoginDto {
  initData: string;
}

export interface LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    telegramId: string;
    name: string;
    username?: string;
    avatar?: string;
    role: string;
  };
  isNewUser: boolean;
}

export interface UserProfileDto {
  id: string;
  telegramId: string;
  name: string;
  username?: string;
  avatar?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export class AuthService {
  /**
   * Check if using mock authentication (for development)
   */
  private static isMockAuth(): boolean {
    const token = TokenManager.getToken();
    return token === 'mock-test-token-for-development';
  }

  /**
   * Login with Telegram initData
   */
  static async loginWithTelegram(initData: string): Promise<LoginResponseDto> {
    try {
      const response = await apiClient.post<LoginResponseDto>('/auth/telegram', {
        initData,
      });

      // Store the token
      TokenManager.setToken(response.access_token);

      return response;
    } catch (error) {
      console.error('Telegram login failed:', error);
      throw error;
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(): Promise<UserProfileDto> {
    // Skip API call if using mock auth
    if (this.isMockAuth()) {
      console.log('Mock auth detected, returning mock profile');
      return {
        id: 'test-user-1',
        telegramId: '123456789',
        name: 'Test User',
        username: 'testuser',
        avatar: undefined,
        role: 'restaurant_owner',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    try {
      return await apiClient.get<UserProfileDto>('/auth/profile');
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Refresh JWT token
   */
  static async refreshToken(): Promise<{ access_token: string }> {
    try {
      const response = await apiClient.post<{ access_token: string }>('/auth/refresh');
      
      // Update the stored token
      TokenManager.setToken(response.access_token);
      
      return response;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  }

  /**
   * Logout user
   */
  static logout(): void {
    TokenManager.removeToken();
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return !!TokenManager.getToken();
  }
}