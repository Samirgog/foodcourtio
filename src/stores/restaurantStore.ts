import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant, RestaurantFormData, FoodCourt, PaymentProvider } from '../types';
import { mockRestaurant, mockFoodCourts, mockPaymentProviders } from '../data/mockData';
import { generateId } from '../utils';

interface RestaurantState {
  currentRestaurant: Restaurant | null;
  restaurants: Restaurant[];
  foodCourts: FoodCourt[];
  paymentProviders: PaymentProvider[];
  isLoading: boolean;
  error: string | null;
}

interface RestaurantActions {
  // Restaurant CRUD
  createRestaurant: (data: RestaurantFormData) => Promise<Restaurant>;
  updateRestaurant: (id: string, updates: Partial<Restaurant>) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  setCurrentRestaurant: (restaurant: Restaurant | null) => void;
  
  // Data fetching
  fetchRestaurants: () => Promise<void>;
  fetchFoodCourts: () => Promise<void>;
  fetchPaymentProviders: () => Promise<void>;
  
  // Publishing
  publishRestaurant: (id: string) => Promise<void>;
  unpublishRestaurant: (id: string) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type RestaurantStore = RestaurantState & RestaurantActions;

export const useRestaurantStore = create<RestaurantStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentRestaurant: null,
      restaurants: [],
      foodCourts: [],
      paymentProviders: [],
      isLoading: false,
      error: null,

      // Actions
      createRestaurant: async (data: RestaurantFormData) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1500));

          const selectedFoodCourt = get().foodCourts.find(fc => fc.id === data.foodCourtId);
          const selectedPaymentProvider = get().paymentProviders.find(pp => pp.id === data.paymentProviderId);

          const newRestaurant: Restaurant = {
            id: generateId(),
            name: data.name,
            description: data.description,
            foodCourtId: data.foodCourtId,
            ownerId: '1', // Mock user ID
            paymentProvider: selectedPaymentProvider,
            location: data.location,
            theme: { id: data.themeId } as any, // Will be populated from themes
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set(state => ({
            restaurants: [...state.restaurants, newRestaurant],
            currentRestaurant: newRestaurant,
            isLoading: false,
          }));

          return newRestaurant;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create restaurant',
          });
          throw error;
        }
      },

      updateRestaurant: async (id: string, updates: Partial<Restaurant>) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 800));

          set(state => ({
            restaurants: state.restaurants.map(r =>
              r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
            ),
            currentRestaurant: state.currentRestaurant?.id === id
              ? { ...state.currentRestaurant, ...updates, updatedAt: new Date().toISOString() }
              : state.currentRestaurant,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update restaurant',
          });
        }
      },

      deleteRestaurant: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            restaurants: state.restaurants.filter(r => r.id !== id),
            currentRestaurant: state.currentRestaurant?.id === id ? null : state.currentRestaurant,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete restaurant',
          });
        }
      },

      setCurrentRestaurant: (restaurant: Restaurant | null) => {
        set({ currentRestaurant: restaurant });
      },

      fetchRestaurants: async () => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock data - in real app, this would fetch from API
          set({
            restaurants: [mockRestaurant],
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch restaurants',
          });
        }
      },

      fetchFoodCourts: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({
            foodCourts: mockFoodCourts,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch food courts',
          });
        }
      },

      fetchPaymentProviders: async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set({
            paymentProviders: mockPaymentProviders,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to fetch payment providers',
          });
        }
      },

      publishRestaurant: async (id: string) => {
        await get().updateRestaurant(id, { isPublished: true });
      },

      unpublishRestaurant: async (id: string) => {
        await get().updateRestaurant(id, { isPublished: false });
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({
        currentRestaurant: state.currentRestaurant,
        restaurants: state.restaurants,
      }),
    }
  )
);