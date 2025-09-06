import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Product, CategoryFormData, ProductFormData, AIGeneratorRequest } from '../types';
import { mockCategories, mockProducts, generateMockCatalog } from '../data/mockData';
import { generateId } from '../utils';

interface CatalogState {
  categories: Category[];
  products: Product[];
  selectedCategory: Category | null;
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  aiGenerating: boolean;
}

interface CatalogActions {
  // Category management
  createCategory: (restaurantId: string, data: CategoryFormData) => Promise<Category>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategories: (categories: Category[]) => void;
  setSelectedCategory: (category: Category | null) => void;

  // Product management
  createProduct: (categoryId: string, data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<Product>;
  reorderProducts: (products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;

  // Bulk operations
  duplicateCategory: (id: string) => Promise<Category>;
  moveProductToCategory: (productId: string, categoryId: string) => Promise<void>;

  // AI Catalog Generator
  generateCatalogWithAI: (request: AIGeneratorRequest) => Promise<void>;

  // Data fetching
  fetchCatalog: (restaurantId: string) => Promise<void>;

  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type CatalogStore = CatalogState & CatalogActions;

export const useCatalogStore = create<CatalogStore>()(
  persist(
    (set, get) => ({
      // Initial state
      categories: [],
      products: [],
      selectedCategory: null,
      selectedProduct: null,
      isLoading: false,
      error: null,
      aiGenerating: false,

      // Category actions
      createCategory: async (restaurantId: string, data: CategoryFormData) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 800));

          const newCategory: Category = {
            id: generateId(),
            restaurantId,
            name: data.name,
            description: data.description,
            priority: data.priority,
            isActive: true,
            products: [],
          };

          set(state => ({
            categories: [...state.categories, newCategory],
            isLoading: false,
          }));

          return newCategory;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create category',
          });
          throw error;
        }
      },

      updateCategory: async (id: string, updates: Partial<Category>) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            categories: state.categories.map(c =>
              c.id === id ? { ...c, ...updates } : c
            ),
            selectedCategory: state.selectedCategory?.id === id
              ? { ...state.selectedCategory, ...updates }
              : state.selectedCategory,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update category',
          });
        }
      },

      deleteCategory: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            categories: state.categories.filter(c => c.id !== id),
            products: state.products.filter(p => p.categoryId !== id),
            selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete category',
          });
        }
      },

      reorderCategories: (categories: Category[]) => {
        // Update priorities based on new order
        const updatedCategories = categories.map((category, index) => ({
          ...category,
          priority: index + 1,
        }));

        set({ categories: updatedCategories });
      },

      setSelectedCategory: (category: Category | null) => {
        set({ selectedCategory: category });
      },

      // Product actions
      createProduct: async (categoryId: string, data: ProductFormData) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const categoryProducts = get().products.filter(p => p.categoryId === categoryId);
          const maxPriority = Math.max(0, ...categoryProducts.map(p => p.priority));

          const newProduct: Product = {
            id: generateId(),
            categoryId,
            name: data.name,
            description: data.description,
            price: data.price,
            weight: data.weight,
            volume: data.volume,
            variants: data.variants?.map(v => ({ ...v, id: generateId() })),
            isAvailable: true,
            priority: maxPriority + 1,
          };

          set(state => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));

          return newProduct;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create product',
          });
          throw error;
        }
      },

      updateProduct: async (id: string, updates: Partial<Product>) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 500));

          set(state => ({
            products: state.products.map(p =>
              p.id === id ? { ...p, ...updates } : p
            ),
            selectedProduct: state.selectedProduct?.id === id
              ? { ...state.selectedProduct, ...updates }
              : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to update product',
          });
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 400));

          set(state => ({
            products: state.products.filter(p => p.id !== id),
            selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to delete product',
          });
        }
      },

      duplicateProduct: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 600));

          const originalProduct = get().products.find(p => p.id === id);
          if (!originalProduct) {
            throw new Error('Product not found');
          }

          const duplicatedProduct: Product = {
            ...originalProduct,
            id: generateId(),
            name: `${originalProduct.name} (Copy)`,
            variants: originalProduct.variants?.map(v => ({ ...v, id: generateId() })),
          };

          set(state => ({
            products: [...state.products, duplicatedProduct],
            isLoading: false,
          }));

          return duplicatedProduct;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to duplicate product',
          });
          throw error;
        }
      },

      reorderProducts: (products: Product[]) => {
        // Update priorities based on new order
        const updatedProducts = products.map((product, index) => ({
          ...product,
          priority: index + 1
        }));
        
        set(state => ({
          products: state.products.map(p => {
            const updated = updatedProducts.find(up => up.id === p.id);
            return updated || p;
          }),
        }));
      },

      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },

      // Bulk operations
      duplicateCategory: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          const originalCategory = get().categories.find(c => c.id === id);
          if (!originalCategory) {
            throw new Error('Category not found');
          }

          const categoryProducts = get().products.filter(p => p.categoryId === id);
          const newCategoryId = generateId();

          const duplicatedCategory: Category = {
            ...originalCategory,
            id: newCategoryId,
            name: `${originalCategory.name} (Copy)`,
            priority: get().categories.length + 1,
            products: [],
          };

          const duplicatedProducts: Product[] = categoryProducts.map(product => ({
            ...product,
            id: generateId(),
            categoryId: newCategoryId,
            variants: product.variants?.map(v => ({ ...v, id: generateId() })),
          }));

          set(state => ({
            categories: [...state.categories, duplicatedCategory],
            products: [...state.products, ...duplicatedProducts],
            isLoading: false,
          }));

          return duplicatedCategory;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to duplicate category',
          });
          throw error;
        }
      },

      moveProductToCategory: async (productId: string, categoryId: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 400));

          set(state => ({
            products: state.products.map(p =>
              p.id === productId ? { ...p, categoryId } : p
            ),
            isLoading: false,
          }));
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to move product',
          });
        }
      },

      // AI Catalog Generator
      generateCatalogWithAI: async (request: AIGeneratorRequest) => {
        set({ aiGenerating: true, error: null });

        try {
          // Simulate AI processing time
          await new Promise(resolve => setTimeout(resolve, 2000));

          const aiResponse = generateMockCatalog(request.prompt);
          const restaurantId = '1'; // Mock restaurant ID

          // Generate categories with IDs
          const newCategories: Category[] = aiResponse.categories.map((cat, index) => ({
            id: generateId(),
            restaurantId,
            name: cat.name,
            description: cat.description,
            priority: get().categories.length + index + 1,
            isActive: true,
            products: [],
          }));

          set(state => ({
            categories: [...state.categories, ...newCategories],
            aiGenerating: false,
          }));

        } catch (error) {
          set({
            aiGenerating: false,
            error: error instanceof Error ? error.message : 'AI catalog generation failed',
          });
        }
      },

      fetchCatalog: async (restaurantId: string) => {
        set({ isLoading: true, error: null });

        try {
          await new Promise(resolve => setTimeout(resolve, 1000));

          // Mock data - filter by restaurant ID in real app
          set({
            categories: mockCategories,
            products: mockProducts,
            isLoading: false,
          });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to fetch catalog',
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
      name: 'catalog-storage',
      partialize: (state) => ({
        categories: state.categories,
        products: state.products,
      }),
    }
  )
);