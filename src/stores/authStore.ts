import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';
import { AuthService, LoginResponseDto, UserProfileDto, ApiError, TokenManager } from '../services';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitializing: boolean;
}

interface AuthActions {
  loginWithTelegram: (initData: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  updateUser: (updates: Partial<User>) => void;
  refreshToken: () => Promise<void>;
  loadProfile: () => Promise<void>;
  autoLoginForTesting: () => void; // For testing purposes
}

type AuthStore = AuthState & AuthActions;

// Transform backend user to frontend user format
const transformUser = (backendUser: LoginResponseDto['user'] | UserProfileDto): User => ({
  id: backendUser.id,
  email: '', // Backend doesn't have email, using Telegram
  name: backendUser.name,
  role: backendUser.role as 'admin' | 'restaurant_owner',
  avatar: backendUser.avatar,
});

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      isInitializing: false,

      // Actions
      loginWithTelegram: async (initData: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await AuthService.loginWithTelegram(initData);
          const user = transformUser(response.user);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Login failed';
          
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      logout: () => {
        AuthService.logout();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      clearError: () => {
        set({ error: null });
      },

      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...updates },
          });
        }
      },

      refreshToken: async () => {
        try {
          await AuthService.refreshToken();
        } catch (error) {
          // If refresh fails, logout the user
          get().logout();
        }
      },

      loadProfile: async () => {
        const state = get();
        
        // Prevent multiple simultaneous profile loads
        if (state.isInitializing || state.isLoading) {
          console.log('Profile loading already in progress, skipping...');
          return;
        }
        
        // Check if token exists
        if (!AuthService.isAuthenticated()) {
          console.log('No token found, skipping profile load');
          set({ isInitializing: false });
          return;
        }

        set({ isInitializing: true, isLoading: true, error: null });

        try {
          const profile = await AuthService.getProfile();
          const user = transformUser(profile);

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            isInitializing: false,
            error: null,
          });
          
          console.log('Profile loaded successfully:', user.name);
        } catch (error) {
          console.error('Profile loading failed:', error);
          
          // Only logout on auth errors, not on network errors
          if (error instanceof ApiError && error.status === 401) {
            console.log('Auth token invalid, logging out');
            get().logout();
          } else {
            console.log('Profile load failed due to network error, keeping current state');
          }
          
          set({ 
            isLoading: false, 
            isInitializing: false,
            error: error instanceof Error ? error.message : 'Failed to load profile'
          });
        }
      },

      // Auto-login for testing (removed in production)
      autoLoginForTesting: () => {
        console.log('Auto-login for testing disabled in production mode');
        // In production, we don't auto-login - user must authenticate properly
        set({
          isAuthenticated: false,
          isLoading: false,
          isInitializing: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);