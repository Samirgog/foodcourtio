// Export all stores
export { useAuthStore } from './authStore';
export { useRestaurantStore } from './restaurantStore';
export { useCatalogStore } from './catalogStore';
export { useUIStore, useNotifications, useModal, useContextMenu } from './uiStore';

// Re-export store types for convenience
export type { AuthStore } from './authStore';
export type { RestaurantStore } from './restaurantStore';
export type { CatalogStore } from './catalogStore';
export type { UIStore } from './uiStore';