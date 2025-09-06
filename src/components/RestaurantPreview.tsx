import React, { useState } from 'react';
import styled from 'styled-components';
import { useRestaurantStore, useCatalogStore } from '../stores';
import { Product } from '../types';
import { Button, Card, Input } from '../styles/theme';

// Helper function to format price
const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

interface PreviewProps {
  show: boolean;
  onClose: () => void;
}

const PreviewOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.md};
`;

const PreviewContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  height: 90vh;
  background: white;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const PreviewHeader = styled.div`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: white;
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .restaurant-info {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    
    .logo {
      width: 60px;
      height: 60px;
      border-radius: ${({ theme }) => theme.borderRadius.md};
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: ${({ theme }) => theme.colors.primary};
      border: 3px solid rgba(255, 255, 255, 0.2);
    }
    
    .details {
      h1 {
        margin: 0;
        font-size: ${({ theme }) => theme.fontSizes.xl};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
      }
      
      p {
        margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
        opacity: 0.9;
        font-size: ${({ theme }) => theme.fontSizes.sm};
      }
    }
  }
  
  .preview-actions {
    display: flex;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const PreviewContent = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const MenuSidebar = styled.div`
  width: 280px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  
  .search-box {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  .categories {
    .category-item {
      display: flex;
      align-items: center;
      gap: ${({ theme }) => theme.spacing.sm};
      padding: ${({ theme }) => theme.spacing.md};
      margin-bottom: ${({ theme }) => theme.spacing.xs};
      border-radius: ${({ theme }) => theme.borderRadius.md};
      cursor: pointer;
      transition: ${({ theme }) => theme.transitions.fast};
      
      &:hover {
        background: ${({ theme }) => theme.colors.backgroundTertiary};
      }
      
      &.active {
        background: ${({ theme }) => theme.colors.primary};
        color: white;
      }
      
      .icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${({ theme }) => theme.colors.background};
        border-radius: ${({ theme }) => theme.borderRadius.sm};
        font-size: 14px;
      }
      
      .name {
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      }
      
      .count {
        margin-left: auto;
        background: rgba(0, 0, 0, 0.1);
        color: ${({ theme }) => theme.colors.textSecondary};
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
      }
      
      &.active .count {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
    }
  }
`;

const MenuDisplay = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  overflow-y: auto;
  
  .category-header {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    h2 {
      margin: 0;
      color: ${({ theme }) => theme.colors.text};
      font-size: ${({ theme }) => theme.fontSizes.xl};
      font-weight: ${({ theme }) => theme.fontWeights.bold};
    }
    
    p {
      margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
      color: ${({ theme }) => theme.colors.textSecondary};
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const ProductCard = styled(Card)`
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  .product-image {
    width: 100%;
    height: 200px;
    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
    border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md} 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: -${({ theme }) => theme.spacing.lg} -${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.md} -${({ theme }) => theme.spacing.lg};
  }
  
  .product-info {
    .name {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      color: ${({ theme }) => theme.colors.text};
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    }
    
    .description {
      color: ${({ theme }) => theme.colors.textSecondary};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      line-height: 1.5;
      margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    }
    
    .price-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .price {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
        color: ${({ theme }) => theme.colors.primary};
      }
      
      .add-button {
        padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

export const RestaurantPreview: React.FC<PreviewProps> = ({ show, onClose }) => {
  const { currentRestaurant } = useRestaurantStore();
  const { categories, products } = useCatalogStore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Helper function to get products by category
  const getProductsByCategory = (categoryId: string): Product[] => {
    return products.filter(product => product.categoryId === categoryId);
  };

  // Auto-select first category if none selected
  React.useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      setSelectedCategory(categories[0].id);
    }
  }, [categories, selectedCategory]);

  const currentCategoryProducts = selectedCategory 
    ? getProductsByCategory(selectedCategory).filter((product: Product) => 
        searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const currentCategoryData = categories.find(cat => cat.id === selectedCategory);

  if (!currentRestaurant) {
    return null;
  }

  return (
    <PreviewOverlay show={show}>
      <PreviewContainer>
        <PreviewHeader>
          <div className="restaurant-info">
            <div className="logo">
              {currentRestaurant.logo ? (
                <img src={currentRestaurant.logo} alt={currentRestaurant.name} />
              ) : (
                '🍽️'
              )}
            </div>
            <div className="details">
              <h1>{currentRestaurant.name}</h1>
              <p>Floor {currentRestaurant.location.floor}, {currentRestaurant.location.section}</p>
            </div>
          </div>
          <div className="preview-actions">
            <Button variant="outline" onClick={onClose} style={{ color: 'white', borderColor: 'white' }}>
              Close Preview
            </Button>
          </div>
        </PreviewHeader>

        <PreviewContent>
          <MenuSidebar>
            <div className="search-box">
              <Input
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="categories">
              {categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  <p>No menu categories yet</p>
                </div>
              ) : (
                categories.map(category => {
                  const productCount = getProductsByCategory(category.id).length;
                  return (
                    <div
                      key={category.id}
                      className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="icon">🍽️</div>
                      <div className="name">{category.name}</div>
                      <div className="count">{productCount}</div>
                    </div>
                  );
                })
              )}
            </div>
          </MenuSidebar>

          <MenuDisplay>
            {currentCategoryData ? (
              <>
                <div className="category-header">
                  <h2>{currentCategoryData.name}</h2>
                  {currentCategoryData.description && (
                    <p>{currentCategoryData.description}</p>
                  )}
                </div>

                {currentCategoryProducts.length === 0 ? (
                  <EmptyState>
                    <div className="icon">🍽️</div>
                    <h3>No items found</h3>
                    <p>
                      {searchQuery 
                        ? `No items match "${searchQuery}"`
                        : 'This category doesn\'t have any items yet'
                      }
                    </p>
                  </EmptyState>
                ) : (
                  <ProductGrid>
                    {currentCategoryProducts.map((product: Product) => (
                      <ProductCard key={product.id}>
                        <div className="product-image">
                          {product.image ? (
                            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            '🍽️'
                          )}
                        </div>
                        <div className="product-info">
                          <h3 className="name">{product.name}</h3>
                          <p className="description">{product.description}</p>
                          <div className="price-section">
                            <div className="price">{formatPrice(product.price)}</div>
                            <Button size="sm" className="add-button">
                              Add to Cart
                            </Button>
                          </div>
                        </div>
                      </ProductCard>
                    ))}
                  </ProductGrid>
                )}
              </>
            ) : (
              <EmptyState>
                <div className="icon">📋</div>
                <h3>No menu available</h3>
                <p>Start by creating some categories and adding products to your menu</p>
              </EmptyState>
            )}
          </MenuDisplay>
        </PreviewContent>
      </PreviewContainer>
    </PreviewOverlay>
  );
};