import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable';
import {
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCatalogStore, useNotifications } from '../stores';
import { Category, Product, CategoryFormData, ProductFormData } from '../types';
import { Card, Button, Input, Label, ErrorText, Textarea, Grid, Flex } from '../styles/theme';
import { validateImageFile, createImageUrl, generateId } from '../utils';
import { ContextMenu, useContextMenu, RestaurantPreview, AICatalogGenerator, FadeInUp, StaggerContainer, StaggerItem } from '../components';
import { useCardAnimation } from '../hooks/useAnimations';

// Animated gradient keyframe for AI Generate button
const gradientFlow = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const subtlePulse = keyframes`
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
`;

// Animated AI Generate Button
const AIGenerateButton = styled(Button)`
  background: linear-gradient(
    45deg,
    #667eea 0%,
    #764ba2 25%,
    #f093fb 50%,
    #f5576c 75%,
    #4facfe 100%
  );
  background-size: 300% 300%;
  animation: ${gradientFlow} 3s ease infinite, ${subtlePulse} 4s ease-in-out infinite;
  color: white;
  border: none;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover {
    animation: ${gradientFlow} 1.5s ease infinite;
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0) scale(1);
  }
`;

const CatalogContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  height: calc(100vh - 140px);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    height: auto;
  }
`;

const CategoryPanel = styled.div`
  width: 300px;
  flex-shrink: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
  }
`;

const ProductPanel = styled.div`
  flex: 1;
  min-width: 0;
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

const CategoryList = styled.div`
  max-height: 60vh;
  overflow-y: auto;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding: 2px;
`;

const CategoryItem = styled(motion.div)<{ selected: boolean; isDragging?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  background-color: ${({ selected, theme }) => 
    selected ? theme.colors.primaryLight + '20' : theme.colors.background};
  opacity: ${({ isDragging }) => isDragging ? 0.5 : 1};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    transform: ${({ isDragging }) => isDragging ? 'none' : 'translateY(-1px)'};
  }
  
  .category-header {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    
    .drag-handle {
      cursor: grab;
      padding: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: 1.2rem;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      transition: ${({ theme }) => theme.transitions.fast};
      
      &:hover {
        color: ${({ theme }) => theme.colors.text};
        background-color: ${({ theme }) => theme.colors.backgroundSecondary};
      }
      
      &:active {
        cursor: grabbing;
        background-color: ${({ theme }) => theme.colors.primary + '20'};
      }
    }
    
    .category-info {
      flex: 1;
    }
  }
  
  .name {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .description {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .product-count {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.md};
  max-height: 60vh;
  overflow-y: auto;
  padding: 2px;
`;

const ProductCard = styled(motion.div).attrs(() => ({
  as: Card
}))<{ isDragging?: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  opacity: ${({ isDragging }) => isDragging ? 0.5 : 1};
  
  &:hover {
    transform: ${({ isDragging }) => isDragging ? 'none' : 'translateY(-2px)'};
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
  
  .product-header {
    display: flex;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    .drag-handle {
      cursor: grab;
      padding: ${({ theme }) => theme.spacing.xs};
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: 1rem;
      margin-top: ${({ theme }) => theme.spacing.xs};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      transition: ${({ theme }) => theme.transitions.fast};
      
      &:hover {
        color: ${({ theme }) => theme.colors.text};
        background-color: ${({ theme }) => theme.colors.backgroundSecondary};
      }
      
      &:active {
        cursor: grabbing;
        background-color: ${({ theme }) => theme.colors.primary + '20'};
      }
    }
  }
  
  .product-image {
    width: 100%;
    height: 150px;
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    opacity: 0.6;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: ${({ theme }) => theme.borderRadius.md};
    }
  }
  
  .name {
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .description {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .price {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
  
  .availability {
    margin-top: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    
    &.available {
      background-color: ${({ theme }) => theme.colors.success + '20'};
      color: ${({ theme }) => theme.colors.success};
    }
    
    &.unavailable {
      background-color: ${({ theme }) => theme.colors.error + '20'};
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const FormModal = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const FormCard = styled(Card)`
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  .form-group {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  }
  
  &.has-image {
    padding: 0;
    
    img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: ${({ theme }) => theme.borderRadius.lg};
    }
  }
  
  input[type="file"] {
    display: none;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

type FormType = 'category' | 'product' | null;
type FormMode = 'create' | 'edit';

// Sortable Category Component
interface SortableCategoryProps {
  category: Category;
  productCount: number;
  selected: boolean;
  onSelect: (category: Category) => void;
  onEdit: (category: Category) => void;
  onDuplicate: (category: Category) => void;
  onDelete: (category: Category) => void;
  onContextMenu: (event: React.MouseEvent, category: Category) => void;
}

const SortableCategory: React.FC<SortableCategoryProps> = ({
  category,
  productCount,
  selected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
  onContextMenu
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <CategoryItem
      ref={setNodeRef}
      style={style}
      selected={selected}
      isDragging={isDragging}
      onClick={() => !isDragging && onSelect(category)}
      onContextMenu={(e) => onContextMenu(e, category)}
    >
      <div className="category-header">
        <div className="drag-handle" {...attributes} {...listeners}>
          ⋮⋮
        </div>
        <div className="category-info">
          <h3 className="name">{category.name}</h3>
          <p className="description">{category.description}</p>
          <p className="product-count">{productCount} products</p>
        </div>
      </div>
      
      <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(category);
          }}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate(category);
          }}
        >
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(category);
          }}
        >
          Delete
        </Button>
      </div>
    </CategoryItem>
  );
};

// Sortable Product Component
interface SortableProductProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (product: Product) => void;
  onContextMenu: (event: React.MouseEvent, product: Product) => void;
}

const SortableProduct: React.FC<SortableProductProps> = ({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  onContextMenu
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: product.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <ProductCard 
      ref={setNodeRef} 
      style={style} 
      isDragging={isDragging}
      onContextMenu={(e) => onContextMenu(e, product)}
    >
      <div className="product-header">
        <div className="drag-handle" {...attributes} {...listeners}>
          ⋮⋮
        </div>
      </div>
      
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          '🍽️'
        )}
      </div>
      
      <h3 className="name">{product.name}</h3>
      <p className="description">{product.description}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      
      <div className={`availability ${product.isAvailable ? 'available' : 'unavailable'}`}>
        {product.isAvailable ? 'Available' : 'Unavailable'}
      </div>
      
      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(product)}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDuplicate(product)}
        >
          Duplicate
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onDelete(product)}
        >
          Delete
        </Button>
      </div>
    </ProductCard>
  );
};

const CatalogPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState<FormType>(null);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [editingItem, setEditingItem] = useState<Category | Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<Category | Product | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  // Context menu hook
  const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
  
  const {
    categories,
    products,
    isLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    duplicateCategory,
    reorderCategories,
    reorderProducts,
    fetchCatalog,
    setSelectedCategory: setStoreCategorySelection
  } = useCatalogStore();
  
  const { showSuccess, showError } = useNotifications();
  
  const categoryForm = useForm<CategoryFormData>();
  const productForm = useForm<ProductFormData>();
  
  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  useEffect(() => {
    fetchCatalog('1'); // Mock restaurant ID
  }, [fetchCatalog]);
  
  const selectedCategoryProducts = selectedCategory 
    ? products.filter(p => p.categoryId === selectedCategory.id)
        .sort((a, b) => a.priority - b.priority)
    : [];
  
  // Type guards for better drag detection
  const isProduct = (item: Category | Product): item is Product => {
    return 'categoryId' in item;
  };
  
  const isCategory = (item: Category | Product): item is Category => {
    return 'restaurantId' in item;
  };
  
  // Category drag handlers
  const handleCategoryDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const category = categories.find(c => c.id === active.id);
    setDraggedItem(category || null);
  };
  
  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      setDraggedItem(null);
      return;
    }
    
    const activeCategory = categories.find(c => c.id === active.id);
    const overCategory = categories.find(c => c.id === over.id);
    
    if (activeCategory && overCategory) {
      const oldIndex = categories.findIndex(c => c.id === active.id);
      const newIndex = categories.findIndex(c => c.id === over.id);
      const reorderedCategories = arrayMove(categories, oldIndex, newIndex);
      reorderCategories(reorderedCategories);
      showSuccess('Reordered!', 'Category order updated');
    }
    
    setActiveId(null);
    setDraggedItem(null);
  };
  
  // Product drag handlers
  const handleProductDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    
    const product = selectedCategoryProducts.find(p => p.id === active.id);
    setDraggedItem(product || null);
  };
  
  const handleProductDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      setDraggedItem(null);
      return;
    }
    
    const activeProduct = selectedCategoryProducts.find(p => p.id === active.id);
    const overProduct = selectedCategoryProducts.find(p => p.id === over.id);
    
    if (activeProduct && overProduct && activeProduct.categoryId === overProduct.categoryId) {
      const oldIndex = selectedCategoryProducts.findIndex(p => p.id === active.id);
      const newIndex = selectedCategoryProducts.findIndex(p => p.id === over.id);
      const reorderedProducts = arrayMove(selectedCategoryProducts, oldIndex, newIndex);
      
      const updatedProducts = reorderedProducts.map((product, index) => ({
        ...product,
        priority: index + 1
      }));
      
      reorderProducts(updatedProducts);
      showSuccess('Reordered!', 'Product order updated');
    }
    
    setActiveId(null);
    setDraggedItem(null);
  };
  
  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setStoreCategorySelection(category);
  };
  
  const handleCreateCategory = () => {
    setFormMode('create');
    setEditingItem(null);
    setShowForm('category');
    categoryForm.reset();
  };
  
  const handleEditCategory = (category: Category) => {
    setFormMode('edit');
    setEditingItem(category);
    setShowForm('category');
    categoryForm.reset({
      name: category.name,
      description: category.description,
      priority: category.priority
    });
  };
  
  const handleCreateProduct = () => {
    if (!selectedCategory) {
      showError('No Category Selected', 'Please select a category first');
      return;
    }
    setFormMode('create');
    setEditingItem(null);
    setShowForm('product');
    productForm.reset();
    setImageFile(null);
  };
  
  const handleEditProduct = (product: Product) => {
    setFormMode('edit');
    setEditingItem(product);
    setShowForm('product');
    productForm.reset({
      name: product.name,
      description: product.description,
      price: product.price,
      weight: product.weight,
      volume: product.volume,
      variants: product.variants
    });
    setImageFile(null);
  };
  
  const handleImageUpload = (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError('Invalid Image', validation.error!);
      return;
    }
    setImageFile(file);
  };
  
  const onCategorySubmit = async (data: CategoryFormData) => {
    try {
      if (formMode === 'create') {
        await createCategory('1', data); // Mock restaurant ID
        showSuccess('Success!', 'Category created successfully');
      } else if (editingItem) {
        await updateCategory(editingItem.id, data);
        showSuccess('Success!', 'Category updated successfully');
      }
      setShowForm(null);
    } catch (error) {
      showError('Error', 'Failed to save category');
    }
  };
  
  const onProductSubmit = async (data: ProductFormData) => {
    if (!selectedCategory) return;
    
    try {
      if (formMode === 'create') {
        const productData: ProductFormData = {
          ...data,
          image: imageFile || undefined
        };
        await createProduct(selectedCategory.id, productData);
        showSuccess('Success!', 'Product created successfully');
      } else if (editingItem) {
        const updates: Partial<Product> = {
          name: data.name,
          description: data.description,
          price: data.price,
          weight: data.weight,
          volume: data.volume,
          variants: data.variants?.map(v => ({ ...v, id: generateId() })),
          image: imageFile ? createImageUrl(imageFile) : undefined
        };
        await updateProduct(editingItem.id, updates);
        showSuccess('Success!', 'Product updated successfully');
      }
      setShowForm(null);
    } catch (error) {
      showError('Error', 'Failed to save product');
    }
  };
  
  const handleDeleteCategory = async (category: Category) => {
    if (window.confirm(`Are you sure you want to delete "${category.name}"? This will also delete all products in this category.`)) {
      try {
        await deleteCategory(category.id);
        showSuccess('Success!', 'Category deleted successfully');
        if (selectedCategory?.id === category.id) {
          setSelectedCategory(null);
        }
      } catch (error) {
        showError('Error', 'Failed to delete category');
      }
    }
  };
  
  const handleDeleteProduct = async (product: Product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await deleteProduct(product.id);
        showSuccess('Success!', 'Product deleted successfully');
      } catch (error) {
        showError('Error', 'Failed to delete product');
      }
    }
  };
  
  const handleDuplicateCategory = async (category: Category) => {
    try {
      await duplicateCategory(category.id);
      showSuccess('Success!', 'Category duplicated successfully');
    } catch (error) {
      showError('Error', 'Failed to duplicate category');
    }
  };
  
  const handleDuplicateProduct = async (product: Product) => {
    try {
      await duplicateProduct(product.id);
      showSuccess('Success!', 'Product duplicated successfully');
    } catch (error) {
      showError('Error', 'Failed to duplicate product');
    }
  };
  
  // Context menu handlers
  const handleCategoryContextMenu = (event: React.MouseEvent, category: Category) => {
    const menuItems = [
      {
        label: 'Edit Category',
        icon: '✏️',
        onClick: () => handleEditCategory(category),
        variant: 'default' as const
      },
      {
        label: 'Duplicate Category',
        icon: '📋',
        onClick: () => handleDuplicateCategory(category),
        variant: 'default' as const
      },
      {
        label: 'separator',
        icon: '',
        onClick: () => {},
        variant: 'default' as const
      },
      {
        label: 'Delete Category',
        icon: '🗑️',
        onClick: () => handleDeleteCategory(category),
        variant: 'danger' as const
      }
    ];
    
    showContextMenu(event, menuItems);
  };
  
  const handleProductContextMenu = (event: React.MouseEvent, product: Product) => {
    const menuItems = [
      {
        label: 'Edit Product',
        icon: '✏️',
        onClick: () => handleEditProduct(product),
        variant: 'default' as const
      },
      {
        label: 'Duplicate Product',
        icon: '📋',
        onClick: () => handleDuplicateProduct(product),
        variant: 'default' as const
      },
      {
        label: product.isAvailable ? 'Mark Unavailable' : 'Mark Available',
        icon: product.isAvailable ? '❌' : '✅',
        onClick: () => updateProduct(product.id, { isAvailable: !product.isAvailable }),
        variant: 'default' as const
      },
      {
        label: 'separator',
        icon: '',
        onClick: () => {},
        variant: 'default' as const
      },
      {
        label: 'Delete Product',
        icon: '🗑️',
        onClick: () => handleDeleteProduct(product),
        variant: 'danger' as const
      }
    ];
    
    showContextMenu(event, menuItems);
  };
  
  return (
    <>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h1>Catalog Management</h1>
          <Button
            variant="outline"
            onClick={() => setShowPreview(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            👁️ Preview Restaurant
          </Button>
        </div>
        <p style={{ color: 'var(--text-secondary)', margin: '0' }}>
          Manage your restaurant's categories and products. Drag to reorder, right-click for quick actions.
        </p>
      </div>
      
      <CatalogContainer>
        {/* Category Panel with its own isolated DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleCategoryDragStart}
          onDragEnd={handleCategoryDragEnd}
        >
          <CategoryPanel>
            <Flex justify="between" align="center">
              <h2>Categories</h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '16px' }}>
                <Button size="sm" onClick={handleCreateCategory}>
                  + Add Category
                </Button>
                <AIGenerateButton 
                  size="sm"
                  onClick={() => setShowAIGenerator(true)}
                >
                  🤖 AI Generate
                </AIGenerateButton>
              </div>
            </Flex>
            
            <CategoryList>
              <SortableContext
                items={categories.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {categories
                  .sort((a, b) => a.priority - b.priority)
                  .map((category) => {
                    const productCount = products.filter(p => p.categoryId === category.id).length;
                    return (
                      <SortableCategory
                        key={category.id}
                        category={category}
                        productCount={productCount}
                        selected={selectedCategory?.id === category.id}
                        onSelect={handleCategorySelect}
                        onEdit={handleEditCategory}
                        onDuplicate={handleDuplicateCategory}
                        onDelete={handleDeleteCategory}
                        onContextMenu={handleCategoryContextMenu}
                      />
                    );
                  })}
              </SortableContext>
            </CategoryList>
          </CategoryPanel>
          
          {/* Category DragOverlay */}
          <DragOverlay dropAnimation={null}>
            {draggedItem && activeId && isCategory(draggedItem) && (
              <div style={{ 
                opacity: 0.95, 
                transform: 'rotate(2deg)', 
                pointerEvents: 'none',
                cursor: 'grabbing',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}>
                <CategoryItem selected={false} isDragging={false}>
                  <div className="category-header">
                    <div className="drag-handle">⋮⋮</div>
                    <div className="category-info">
                      <h3 className="name">{draggedItem.name}</h3>
                      <p className="description">{draggedItem.description}</p>
                    </div>
                  </div>
                </CategoryItem>
              </div>
            )}
          </DragOverlay>
        </DndContext>
        
        {/* Product Panel with its own isolated DndContext */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleProductDragStart}
          onDragEnd={handleProductDragEnd}
        >
          <ProductPanel>
            <Flex justify="between" align="center" gap="1rem" wrap>
              <h2 style={{ margin: 0, minWidth: 0, flex: '1 1 auto', marginRight: '1rem' }}>
                {selectedCategory ? `Products in ${selectedCategory.name}` : 'Select a Category'}
              </h2>
              {selectedCategory && (
                <Button onClick={handleCreateProduct} style={{ flexShrink: 0 }}>
                  + Add Product
                </Button>
              )}
            </Flex>
            
            {selectedCategory ? (
              <ProductGrid>
                <SortableContext
                  items={selectedCategoryProducts.map(p => p.id)}
                  strategy={horizontalListSortingStrategy}
                >
                  {selectedCategoryProducts.map((product) => (
                    <SortableProduct
                      key={product.id}
                      product={product}
                      onEdit={handleEditProduct}
                      onDuplicate={handleDuplicateProduct}
                      onDelete={handleDeleteProduct}
                      onContextMenu={handleProductContextMenu}
                    />
                  ))}
                </SortableContext>
              </ProductGrid>
            ) : (
              <div style={{ 
                textAlign: 'center', 
                padding: '3rem', 
                color: 'var(--text-muted)' 
              }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem', opacity: 0.5 }}>📋</div>
                <h3>No Category Selected</h3>
                <p>Select a category from the left panel to view and manage products</p>
              </div>
            )}
          </ProductPanel>
          
          {/* Product DragOverlay */}
          <DragOverlay dropAnimation={null}>
            {draggedItem && activeId && isProduct(draggedItem) && (
              <div style={{ 
                opacity: 0.95, 
                transform: 'rotate(2deg)', 
                pointerEvents: 'none',
                cursor: 'grabbing',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}>
                <ProductCard>
                  <div className="product-header">
                    <div className="drag-handle">⋮⋮</div>
                  </div>
                  <div className="product-image">
                    {draggedItem.image ? (
                      <img src={draggedItem.image} alt={draggedItem.name} />
                    ) : (
                      '🍽️'
                    )}
                  </div>
                  <h3 className="name">{draggedItem.name}</h3>
                  <p className="price">${draggedItem.price?.toFixed(2)}</p>
                </ProductCard>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </CatalogContainer>
      
      {/* Category Form Modal */}
      <FormModal show={showForm === 'category'}>
        <FormCard>
          <h2>{formMode === 'create' ? 'Create Category' : 'Edit Category'}</h2>
          
          <form onSubmit={categoryForm.handleSubmit(onCategorySubmit)}>
            <div className="form-group">
              <Label>Category Name *</Label>
              <Input
                {...categoryForm.register('name', { required: 'Category name is required' })}
                placeholder="Enter category name"
              />
              {categoryForm.formState.errors.name && (
                <ErrorText>{categoryForm.formState.errors.name.message}</ErrorText>
              )}
            </div>
            
            <div className="form-group">
              <Label>Description</Label>
              <Textarea
                {...categoryForm.register('description')}
                placeholder="Describe this category..."
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <Label>Priority</Label>
              <Input
                type="number"
                min="1"
                {...categoryForm.register('priority', { valueAsNumber: true })}
                placeholder="Display order (1 = first)"
              />
            </div>
            
            <ActionButtons>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (formMode === 'create' ? 'Create Category' : 'Update Category')}
              </Button>
            </ActionButtons>
          </form>
        </FormCard>
      </FormModal>
      
      {/* Product Form Modal */}
      <FormModal show={showForm === 'product'}>
        <FormCard>
          <h2>{formMode === 'create' ? 'Create Product' : 'Edit Product'}</h2>
          
          <form onSubmit={productForm.handleSubmit(onProductSubmit)}>
            <div className="form-group">
              <Label>Product Name *</Label>
              <Input
                {...productForm.register('name', { required: 'Product name is required' })}
                placeholder="Enter product name"
              />
              {productForm.formState.errors.name && (
                <ErrorText>{productForm.formState.errors.name.message}</ErrorText>
              )}
            </div>
            
            <div className="form-group">
              <Label>Description *</Label>
              <Textarea
                {...productForm.register('description', { required: 'Description is required' })}
                placeholder="Describe this product..."
                rows={3}
              />
              {productForm.formState.errors.description && (
                <ErrorText>{productForm.formState.errors.description.message}</ErrorText>
              )}
            </div>
            
            <div className="form-group">
              <Label>Product Image</Label>
              <ImageUpload 
                className={imageFile ? 'has-image' : ''}
                onClick={() => document.getElementById('product-image-upload')?.click()}
              >
                {imageFile ? (
                  <img src={createImageUrl(imageFile)} alt="Product preview" />
                ) : (
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📷</div>
                    <div>Click to upload image</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>PNG, JPG up to 5MB</div>
                  </div>
                )}
                <input
                  id="product-image-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                />
              </ImageUpload>
            </div>
            
            <Grid columns={3} gap="1rem">
              <div className="form-group">
                <Label>Price *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  {...productForm.register('price', { 
                    required: 'Price is required',
                    valueAsNumber: true,
                    min: { value: 0, message: 'Price must be positive' }
                  })}
                  placeholder="0.00"
                />
                {productForm.formState.errors.price && (
                  <ErrorText>{productForm.formState.errors.price.message}</ErrorText>
                )}
              </div>
              
              <div className="form-group">
                <Label>Weight (g)</Label>
                <Input
                  type="number"
                  min="0"
                  {...productForm.register('weight', { valueAsNumber: true })}
                  placeholder="Optional"
                />
              </div>
              
              <div className="form-group">
                <Label>Volume (ml)</Label>
                <Input
                  type="number"
                  min="0"
                  {...productForm.register('volume', { valueAsNumber: true })}
                  placeholder="Optional"
                />
              </div>
            </Grid>
            
            <ActionButtons>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Saving...' : (formMode === 'create' ? 'Create Product' : 'Update Product')}
              </Button>
            </ActionButtons>
          </form>
        </FormCard>
      </FormModal>
      
      {/* Context Menu */}
      <ContextMenu
        items={contextMenu.items}
        x={contextMenu.x}
        y={contextMenu.y}
        show={contextMenu.show}
        onClose={hideContextMenu}
      />
      
      {/* AI Catalog Generator */}
      <AICatalogGenerator
        show={showAIGenerator}
        onClose={() => setShowAIGenerator(false)}
      />
      
      {/* Restaurant Preview */}
      <RestaurantPreview
        show={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default CatalogPage;