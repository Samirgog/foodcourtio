import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Category, Product, CategoryFormData, ProductFormData, AIGeneratorRequest } from '../types';
import { 
  CategoryService, 
  ProductService, 
  CategoryResponseDto, 
  ProductDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateProductDto,
  UpdateProductDto,
  ApiError 
} from '../services';

interface CatalogState {
  categories: Category[];
  products: Product[];
  selectedCategory: Category | null;
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  aiGenerating: boolean;
  lastFetchTime: number;
  fetchedRestaurantId: string | null;
}

interface CatalogActions {
  // Category management
  createCategory: (restaurantId: string, data: CategoryFormData) => Promise<Category>;
  updateCategory: (restaurantId: string, id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (restaurantId: string, id: string) => Promise<void>;
  reorderCategories: (restaurantId: string, categories: Category[]) => void;
  setSelectedCategory: (category: Category | null) => void;
  duplicateCategory: (restaurantId: string, id: string) => Promise<Category>;
  toggleCategoryPublish: (restaurantId: string, id: string, isPublished: boolean) => Promise<void>;

  // Product management
  createProduct: (data: ProductFormData) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<Product>;
  reorderProducts: (categoryId: string, products: Product[]) => void;
  setSelectedProduct: (product: Product | null) => void;
  toggleProductPublish: (id: string, isPublished: boolean) => Promise<void>;
  uploadProductImage: (file: File) => Promise<string>;

  // Bulk operations
  moveProductToCategory: (productId: string, categoryId: string) => Promise<void>;

  // AI Catalog Generator (mock for now)
  generateCatalogWithAI: (request: AIGeneratorRequest) => Promise<void>;

  // Data fetching
  fetchCatalog: (restaurantId: string) => Promise<void>;

  // Utilities
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

type CatalogStore = CatalogState & CatalogActions;

// Transform backend category to frontend format
const transformCategory = (backendCategory: CategoryResponseDto): Category => ({
  id: backendCategory.id,
  restaurantId: backendCategory.restaurantId,
  name: backendCategory.name,
  description: backendCategory.description,
  priority: backendCategory.priority,
  isActive: backendCategory.isActive,
  products: [], // Products will be loaded separately
});

// Transform backend product to frontend format
const transformProduct = (backendProduct: ProductDto): Product => ({
  id: backendProduct.id,
  categoryId: backendProduct.categoryId,
  name: backendProduct.name,
  description: backendProduct.description,
  image: backendProduct.image,
  price: backendProduct.price,
  weight: backendProduct.weight,
  volume: backendProduct.volume,
  variants: backendProduct.variants?.map(v => ({
    id: v.id,
    name: v.name,
    priceModifier: v.priceModifier,
    isDefault: v.isDefault
  })),
  isAvailable: backendProduct.isAvailable,
  priority: backendProduct.priority,
});

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
      lastFetchTime: 0,
      fetchedRestaurantId: null,

      // Category actions
      createCategory: async (restaurantId: string, data: CategoryFormData) => {
        set({ isLoading: true, error: null });

        try {
          const createData: CreateCategoryDto = {
            name: data.name,
            description: data.description,
            priority: data.priority,
            isActive: true
          };

          const response = await CategoryService.create(restaurantId, createData);
          const newCategory = transformCategory(response);

          set(state => ({
            categories: [...state.categories, newCategory],
            isLoading: false,
          }));

          return newCategory;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create category';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateCategory: async (restaurantId: string, id: string, updates: Partial<Category>) => {
        set({ isLoading: true, error: null });

        try {
          const updateData: UpdateCategoryDto = {
            name: updates.name,
            description: updates.description,
            priority: updates.priority,
            isActive: updates.isActive
          };

          const response = await CategoryService.update(restaurantId, id, updateData);
          const updatedCategory = transformCategory(response);

          set(state => ({
            categories: state.categories.map(c =>
              c.id === id ? updatedCategory : c
            ),
            selectedCategory: state.selectedCategory?.id === id
              ? updatedCategory
              : state.selectedCategory,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update category';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      deleteCategory: async (restaurantId: string, id: string) => {
        set({ isLoading: true, error: null });

        try {
          await CategoryService.delete(restaurantId, id);

          set(state => ({
            categories: state.categories.filter(c => c.id !== id),
            products: state.products.filter(p => p.categoryId !== id),
            selectedCategory: state.selectedCategory?.id === id ? null : state.selectedCategory,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete category';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      reorderCategories: async (restaurantId: string, categories: Category[]) => {
        try {
          const categoryIds = categories.map(c => c.id);
          await CategoryService.reorder(restaurantId, { categoryIds });
          
          // Update local state with new order
          const updatedCategories = categories.map((category, index) => ({
            ...category,
            priority: index + 1,
          }));

          set({ categories: updatedCategories });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to reorder categories';
          set({ error: errorMessage });
        }
      },

      setSelectedCategory: (category: Category | null) => {
        set({ selectedCategory: category });
      },

      duplicateCategory: async (restaurantId: string, id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await CategoryService.duplicate(restaurantId, id);
          const duplicatedCategory = transformCategory(response);

          set(state => ({
            categories: [...state.categories, duplicatedCategory],
            isLoading: false,
          }));

          return duplicatedCategory;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to duplicate category';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      toggleCategoryPublish: async (restaurantId: string, id: string, isPublished: boolean) => {
        try {
          const response = await CategoryService.togglePublish(restaurantId, id, isPublished);
          const updatedCategory = transformCategory(response);
          
          set(state => ({
            categories: state.categories.map(c =>
              c.id === id ? updatedCategory : c
            ),
            selectedCategory: state.selectedCategory?.id === id
              ? updatedCategory
              : state.selectedCategory,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update category publish status';
          set({ error: errorMessage });
        }
      },

      // Product actions
      createProduct: async (data: ProductFormData) => {
        set({ isLoading: true, error: null });

        try {
          const createData: CreateProductDto = {
            categoryId: get().selectedCategory?.id || '',
            name: data.name,
            description: data.description,
            price: data.price,
            weight: data.weight,
            volume: data.volume,
            isAvailable: true,
            variants: data.variants?.map(v => ({
              name: v.name,
              priceModifier: v.priceModifier,
              isDefault: v.isDefault
            }))
          };

          const response = await ProductService.create(createData);
          const newProduct = transformProduct(response);

          set(state => ({
            products: [...state.products, newProduct],
            isLoading: false,
          }));

          return newProduct;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to create product';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      updateProduct: async (id: string, updates: Partial<Product>) => {
        set({ isLoading: true, error: null });

        try {
          const updateData: UpdateProductDto = {
            name: updates.name,
            description: updates.description,
            price: updates.price,
            weight: updates.weight,
            volume: updates.volume,
            image: updates.image,
            isAvailable: updates.isAvailable,
            variants: updates.variants?.map(v => ({
              name: v.name,
              priceModifier: v.priceModifier,
              isDefault: v.isDefault
            }))
          };

          const response = await ProductService.update(id, updateData);
          const updatedProduct = transformProduct(response);

          set(state => ({
            products: state.products.map(p =>
              p.id === id ? updatedProduct : p
            ),
            selectedProduct: state.selectedProduct?.id === id
              ? updatedProduct
              : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update product';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      deleteProduct: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          await ProductService.delete(id);

          set(state => ({
            products: state.products.filter(p => p.id !== id),
            selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to delete product';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      duplicateProduct: async (id: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await ProductService.duplicate(id);
          const duplicatedProduct = transformProduct(response);

          set(state => ({
            products: [...state.products, duplicatedProduct],
            isLoading: false,
          }));

          return duplicatedProduct;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to duplicate product';
          set({
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      reorderProducts: async (categoryId: string, products: Product[]) => {
        try {
          const productIds = products.map(p => p.id);
          await ProductService.reorder(categoryId, { productIds });
          
          // Update local state with new order
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
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to reorder products';
          set({ error: errorMessage });
        }
      },

      setSelectedProduct: (product: Product | null) => {
        set({ selectedProduct: product });
      },

      toggleProductPublish: async (id: string, isPublished: boolean) => {
        try {
          if (isPublished) {
            const response = await ProductService.publish(id);
            const updatedProduct = transformProduct(response);
            
            set(state => ({
              products: state.products.map(p =>
                p.id === id ? updatedProduct : p
              ),
              selectedProduct: state.selectedProduct?.id === id
                ? updatedProduct
                : state.selectedProduct,
            }));
          }
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to update product publish status';
          set({ error: errorMessage });
        }
      },

      uploadProductImage: async (file: File) => {
        try {
          const response = await ProductService.uploadImage(file);
          return response.path;
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to upload image';
          set({ error: errorMessage });
          throw error;
        }
      },

      // Bulk operations
      moveProductToCategory: async (productId: string, categoryId: string) => {
        set({ isLoading: true, error: null });

        try {
          const updateData: UpdateProductDto = { categoryId };
          const response = await ProductService.update(productId, updateData);
          const updatedProduct = transformProduct(response);

          set(state => ({
            products: state.products.map(p =>
              p.id === productId ? updatedProduct : p
            ),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to move product';
          set({
            isLoading: false,
            error: errorMessage,
          });
        }
      },

      // AI Catalog Generator (mock implementation)
      generateCatalogWithAI: async (request: AIGeneratorRequest) => {
        set({ aiGenerating: true, error: null });

        try {
          // Simulate AI processing time
          await new Promise(resolve => setTimeout(resolve, 2000));
          set({ aiGenerating: false });
        } catch (error) {
          set({
            aiGenerating: false,
            error: error instanceof Error ? error.message : 'AI catalog generation failed',
          });
        }
      },

      fetchCatalog: async (restaurantId: string) => {
        const state = get();
        const now = Date.now();
        const timeSinceLastFetch = now - state.lastFetchTime;
        const MIN_FETCH_INTERVAL = 3000; // 3 seconds minimum between fetches
        
        // Prevent too frequent API calls for the same restaurant
        if (state.fetchedRestaurantId === restaurantId && timeSinceLastFetch < MIN_FETCH_INTERVAL) {
          console.log('Skipping catalog fetch due to rate limiting');
          return;
        }
        
        if (state.isLoading) {
          console.log('Skipping catalog fetch - already loading');
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const [categoriesData, productsData] = await Promise.all([
            CategoryService.getAllByRestaurant(restaurantId, true),
            ProductService.getAllByRestaurant(restaurantId, true)
          ]);

          const categories = categoriesData.map(transformCategory);
          const products = productsData.map(transformProduct);

          set({
            categories,
            products,
            isLoading: false,
            lastFetchTime: now,
            fetchedRestaurantId: restaurantId,
          });
        } catch (error) {
          const errorMessage = error instanceof ApiError ? error.message : 'Failed to fetch catalog';
          console.error('Failed to fetch catalog:', error);
          set({
            isLoading: false,
            error: errorMessage,
            lastFetchTime: now,
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