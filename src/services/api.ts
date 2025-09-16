// API client configuration and base HTTP client

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Types for API responses
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

// Error types
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Auth token management
class TokenManager {
  private static readonly TOKEN_KEY = 'foodcourtio_token';

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}

// Base HTTP client
class HttpClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Default headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Add auth token if available
    const token = TokenManager.getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle non-JSON responses (like file uploads)
      const contentType = response.headers.get('content-type');
      let data: any;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const apiError = new ApiError(
          data?.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
          data
        );
        
        // Log the error for debugging
        console.error(`API Error [${response.status}] ${endpoint}:`, apiError.message);
        
        throw apiError;
      }

      return data;
    } catch (error) {
      // Handle network errors differently from API errors
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network error
      const networkError = new ApiError(
        error instanceof Error ? error.message : 'Network error occurred',
        0  // 0 indicates network error
      );
      
      console.error(`Network Error ${endpoint}:`, networkError.message);
      throw networkError;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params 
      ? '?' + new URLSearchParams(
          Object.entries(params).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value);
            }
            return acc;
          }, {} as Record<string, string>)
        ).toString()
      : '';

    return this.request<T>(`${endpoint}${searchParams}`);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  // Special method for file uploads
  async uploadFile<T>(endpoint: string, file: File, field = 'image'): Promise<T> {
    const formData = new FormData();
    formData.append(field, file);

    const token = TokenManager.getToken();
    const headers: Record<string, string> = {};
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
      headers,
    });
  }
}

// Create the main API client instance
export const apiClient = new HttpClient(API_BASE_URL);

// Export token manager for use in stores
export { TokenManager };

// Auth error handling utility
class AuthErrorHandler {
  private static isRedirecting = false;
  private static redirectTimeout: number | null = null;

  static handleAuthError(error: unknown): void {
    if (error instanceof ApiError && error.status === 401) {
      // Prevent multiple simultaneous redirects
      if (this.isRedirecting) {
        console.log('Auth error handling already in progress, skipping...');
        return;
      }

      this.isRedirecting = true;
      console.log('Authentication failed, cleaning up and redirecting to login');
      
      // Clear the token
      TokenManager.removeToken();
      
      // Clear any existing redirect timeout
      if (this.redirectTimeout) {
        clearTimeout(this.redirectTimeout);
      }
      
      // Delay the redirect slightly to prevent rapid loops
      this.redirectTimeout = window.setTimeout(() => {
        // Only redirect if we're not already on the login page
        if (window.location.pathname !== '/login') {
        //   window.location.href = '/login';
        }
        
        // Reset the flag after redirect
        window.setTimeout(() => {
          this.isRedirecting = false;
        }, 1000);
      }, 100);
    }
  }

  static reset(): void {
    this.isRedirecting = false;
    if (this.redirectTimeout) {
      clearTimeout(this.redirectTimeout);
      this.redirectTimeout = null;
    }
  }
}

export const handleAuthError = AuthErrorHandler.handleAuthError.bind(AuthErrorHandler);