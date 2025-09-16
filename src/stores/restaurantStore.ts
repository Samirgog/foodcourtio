import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Restaurant, RestaurantFormData, FoodCourt, PaymentProvider } from '../types';
import { 
  RestaurantService, 
  FoodcourtService, 
  RestaurantResponseDto, 
  CreateRestaurantDto,
  UpdateRestaurantDto,
  ApiError,
  TokenManager
} from '../services';
import { generateId } from '../utils';

interface RestaurantState {
  currentRestaurant: Restaurant | null;
  restaurants: Restaurant[];
  foodCourts: FoodCourt[];
  paymentProviders: PaymentProvider[];
  isLoading: boolean;
  error: string | null;
  lastFetchTime: number;
  isInitialized: boolean;
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
  
  // File uploads
  uploadLogo: (id: string, file: File) => Promise<void>;
  uploadBanner: (id: string, file: File) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type RestaurantStore = RestaurantState & RestaurantActions;

// Transform backend restaurant to frontend format
const transformRestaurant = (backendRestaurant: RestaurantResponseDto): Restaurant => ({
  id: backendRestaurant.id,
  name: backendRestaurant.name,
  description: backendRestaurant.description,
  logo: backendRestaurant.logo,
  banner: backendRestaurant.banner,
  foodCourtId: backendRestaurant.foodcourtId,
  ownerId: backendRestaurant.ownerId,
  paymentProvider: undefined, // Will be populated separately
  location: backendRestaurant.location,
  theme: backendRestaurant.theme || {
    id: 'default',
    name: 'Default',
    primaryColor: '#2563eb',
    secondaryColor: '#1e40af',
    accentColor: '#3b82f6',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    cardStyle: 'minimal',
    borderRadius: 'medium'
  },
  isPublished: backendRestaurant.isPublished,
  createdAt: backendRestaurant.createdAt,
  updatedAt: backendRestaurant.updatedAt,
});

// Mock payment providers for now - these would come from the backend in a real app
const mockPaymentProviders: PaymentProvider[] = [
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
];

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
      lastFetchTime: 0,
      isInitialized: false,

      // Actions
      createRestaurant: async (data: RestaurantFormData) => {
        set({ isLoading: true, error: null });

        try {
          const createData: CreateRestaurantDto = {
            name: data.name,
            description: data.description,
            foodcourtId: data.foodCourtId,
            location: data.location,
            theme: {
              primaryColor: '#2563eb',
              secondaryColor: '#1e40af',
              accentColor: '#3b82f6',
              backgroundColor: '#ffffff',
              textColor: '#1f2937',
              cardStyle: 'minimal',
              borderRadius: 'medium'
            }
          };

          const response = await RestaurantService.create(createData);
          const newRestaurant = transformRestaurant(response);

          set(state => ({
            restaurants: [...state.restaurants, newRestaurant],
            currentRestaurant: newRestaurant,
            isLoading: false,
          }));

          return newRestaurant;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create restaurant';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateRestaurant: async (id: string, updates: Partial<Restaurant>) => {
        set({ isLoading: true, error: null });

        try {
          const updateData: UpdateRestaurantDto = {
            name: updates.name,
            description: updates.description,
            foodcourtId: updates.foodCourtId,
            location: updates.location,
            theme: updates.theme
          };

          const response = await RestaurantService.update(id, updateData);
          const updatedRestaurant = transformRestaurant(response);

          set(state => ({
            restaurants: state.restaurants.map(r =>
              r.id === id ? updatedRestaurant : r
            ),
            currentRestaurant: state.currentRestaurant?.id === id
              ? updatedRestaurant
              : state.currentRestaurant,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update restaurant';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      deleteRestaurant: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await RestaurantService.delete(id);

          set(state => ({
            restaurants: state.restaurants.filter(r => r.id !== id),
            currentRestaurant: state.currentRestaurant?.id === id ? null : state.currentRestaurant,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete restaurant';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      setCurrentRestaurant: (restaurant: Restaurant | null) => {
        set({ currentRestaurant: restaurant });
      },

      fetchRestaurants: async () => {
        const state = get();
        const now = Date.now();
        const timeSinceLastFetch = now - state.lastFetchTime;
        const MIN_FETCH_INTERVAL = 5000; // 5 seconds minimum between fetches
        
        // Prevent too frequent API calls
        if (state.isInitialized && timeSinceLastFetch < MIN_FETCH_INTERVAL) {
          console.log('Skipping fetch due to rate limiting');
          return;
        }
        
        if (state.isLoading) {
          console.log('Skipping fetch - already loading');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          // Check if using mock auth - return mock data
          const token = TokenManager.getToken();
          if (token === 'mock-test-token-for-development') {
            console.log('Mock auth detected, returning mock restaurants');
            
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockRestaurants: Restaurant[] = [
              {
                id: 'mock-restaurant-1',
                name: 'Test Pizza Place',
                description: 'A test restaurant for development',
                foodCourtId: 'mock-foodcourt-1',
                ownerId: 'test-user-1',
                theme: {
                  id: 'default',
                  name: 'Default',
                  primaryColor: '#2563eb',
                  secondaryColor: '#1e40af',
                  accentColor: '#3b82f6',
                  backgroundColor: '#ffffff',
                  textColor: '#1f2937',
                  cardStyle: 'minimal',
                  borderRadius: 'medium'
                },
                isPublished: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }
            ];

            set({
              restaurants: mockRestaurants,
              currentRestaurant: mockRestaurants[0],
              isLoading: false,
              lastFetchTime: now,
              isInitialized: true,
            });
            return;
          }

          const response = await RestaurantService.getAll({ limit: 100 });
          const restaurants = response.data.map(transformRestaurant);

          set({
            restaurants,
            currentRestaurant: restaurants[0] || null,
            isLoading: false,
            lastFetchTime: now,
            isInitialized: true,
          });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch restaurants';
          console.error('Failed to fetch restaurants:', error);
          set({
            isLoading: false,
            error: errorMessage,
            lastFetchTime: now,
          });
        }
      },

      fetchFoodCourts: async () => {
        try {
          const foodcourts = await FoodcourtService.getActive();
          const transformedFoodcourts: FoodCourt[] = foodcourts.map(fc => ({
            id: fc.id,
            name: fc.name,
            location: fc.location,
            description: fc.description || '',
            imageUrl: fc.imageUrl,
            city: fc.city,
            totalRestaurants: fc.restaurantsCount || 0,
            availableSpots: Math.max(0, 50 - (fc.restaurantsCount || 0)) // Mock calculation
          }));
          
          set({
            foodCourts: transformedFoodcourts,
          });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch food courts';
          set({
            error: errorMessage,
          });
        }
      },

      fetchPaymentProviders: async () => {
        try {
          // For now, use mock data
          // In the future, this would be an API call
          set({
            paymentProviders: mockPaymentProviders,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch payment providers';
          set({
            error: errorMessage,
          });
        }
      },

      publishRestaurant: async (id: string) => {
        try {
          const response = await RestaurantService.togglePublished(id, true);
          const updatedRestaurant = transformRestaurant(response);
          
          set(state => ({
            restaurants: state.restaurants.map(r =>
              r.id === id ? updatedRestaurant : r
            ),
            currentRestaurant: state.currentRestaurant?.id === id
              ? updatedRestaurant
              : state.currentRestaurant,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to publish restaurant';
          set({ error: errorMessage });
        }
      },

      unpublishRestaurant: async (id: string) => {
        try {
          const response = await RestaurantService.togglePublished(id, false);
          const updatedRestaurant = transformRestaurant(response);
          
          set(state => ({
            restaurants: state.restaurants.map(r =>
              r.id === id ? updatedRestaurant : r
            ),
            currentRestaurant: state.currentRestaurant?.id === id
              ? updatedRestaurant
              : state.currentRestaurant,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to unpublish restaurant';
          set({ error: errorMessage });
        }
      },

      uploadLogo: async (id: string, file: File) => {
        set({ isLoading: true, error: null });

        try {
          const response = await RestaurantService.uploadLogo(id, file);
          const updatedRestaurant = transformRestaurant(response);
          
          set(state => ({
            restaurants: state.restaurants.map(r =>
              r.id === id ? updatedRestaurant : r
            ),
            currentRestaurant: state.currentRestaurant?.id === id
              ? updatedRestaurant
              : state.currentRestaurant,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to upload logo';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      uploadBanner: async (id: string, file: File) => {
        set({ isLoading: true, error: null });

        try {
          const response = await RestaurantService.uploadBanner(id, file);
          const updatedRestaurant = transformRestaurant(response);
          
          set(state => ({
            restaurants: state.restaurants.map(r =>
              r.id === id ? updatedRestaurant : r
            ),
            currentRestaurant: state.currentRestaurant?.id === id
              ? updatedRestaurant
              : state.currentRestaurant,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to upload banner';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
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