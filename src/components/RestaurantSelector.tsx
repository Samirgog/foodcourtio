import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestaurantStore } from '../stores/restaurantStore';
import { useClickOutside } from '../hooks';
import { Restaurant } from '../types';

const SelectorContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SelectorButton = styled.button<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  min-width: 200px;
  justify-content: space-between;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    min-width: 160px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: 120px;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  }
`;

const RestaurantInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
  text-align: left;
`;

const RestaurantIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 24px;
    height: 24px;
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

const RestaurantDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const RestaurantName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.xs};
  }
`;

const RestaurantStatus = styled.div<{ published: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ published, theme }) => published ? theme.colors.success : theme.colors.warning};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const DropdownIcon = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  transform: ${({ isOpen }) => isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: ${({ theme }) => theme.transitions.fast};
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing.xs});
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 1000;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    left: -50px;
    right: -50px;
  }
`;

const DropdownHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  
  .title {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .subtitle {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

const RestaurantList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const RestaurantOption = styled.button<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: none;
  background-color: ${({ isSelected, theme }) => 
    isSelected ? theme.colors.primaryLight + '20' : 'transparent'};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: left;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
  
  &:focus {
    outline: none;
    background-color: ${({ theme }) => theme.colors.primaryLight}30;
  }
`;

const OptionDetails = styled.div`
  flex: 1;
  min-width: 0;
`;

const OptionName = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OptionDescription = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const OptionStatus = styled.div<{ published: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ published, theme }) => published ? theme.colors.success : theme.colors.warning};
  }
  
  .text {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ published, theme }) => published ? theme.colors.success : theme.colors.warning};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  
  .icon {
    font-size: 2rem;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  .message {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin: 0;
  }
`;

const LoadingState = styled.div`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  
  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-top: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto ${({ theme }) => theme.spacing.sm};
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const RestaurantSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    currentRestaurant, 
    restaurants, 
    isLoading, 
    setCurrentRestaurant, 
    fetchRestaurants 
  } = useRestaurantStore();
  
  const containerRef = useClickOutside(() => setIsOpen(false));

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && restaurants.length === 0) {
      fetchRestaurants();
    }
  };

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    setCurrentRestaurant(restaurant);
    setIsOpen(false);
  };

  const getRestaurantInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusText = (published: boolean) => {
    return published ? 'Live' : 'Draft';
  };

  return (
    <SelectorContainer ref={containerRef}>
      <SelectorButton isOpen={isOpen} onClick={handleToggle}>
        <RestaurantInfo>
          <RestaurantIcon>
            {currentRestaurant ? getRestaurantInitials(currentRestaurant.name) : '??'}
          </RestaurantIcon>
          <RestaurantDetails>
            <RestaurantName>
              {currentRestaurant?.name || 'Select Restaurant'}
            </RestaurantName>
            {currentRestaurant && (
              <RestaurantStatus published={currentRestaurant.isPublished}>
                {getStatusText(currentRestaurant.isPublished)}
              </RestaurantStatus>
            )}
          </RestaurantDetails>
        </RestaurantInfo>
        <DropdownIcon isOpen={isOpen}>▼</DropdownIcon>
      </SelectorButton>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <DropdownHeader>
              <div className="title">Switch Restaurant</div>
              <div className="subtitle">Select which restaurant to manage</div>
            </DropdownHeader>

            <RestaurantList>
              {isLoading ? (
                <LoadingState>
                  <div className="spinner" />
                  <div>Loading restaurants...</div>
                </LoadingState>
              ) : restaurants.length === 0 ? (
                <EmptyState>
                  <div className="icon">🏪</div>
                  <p className="message">No restaurants found</p>
                </EmptyState>
              ) : (
                restaurants.map((restaurant) => (
                  <RestaurantOption
                    key={restaurant.id}
                    isSelected={currentRestaurant?.id === restaurant.id}
                    onClick={() => handleRestaurantSelect(restaurant)}
                  >
                    <RestaurantIcon>
                      {getRestaurantInitials(restaurant.name)}
                    </RestaurantIcon>
                    <OptionDetails>
                      <OptionName>{restaurant.name}</OptionName>
                      <OptionDescription>{restaurant.description}</OptionDescription>
                    </OptionDetails>
                    <OptionStatus published={restaurant.isPublished}>
                      <div className="dot" />
                      <div className="text">{getStatusText(restaurant.isPublished)}</div>
                    </OptionStatus>
                  </RestaurantOption>
                ))
              )}
            </RestaurantList>
          </DropdownMenu>
        )}
      </AnimatePresence>
    </SelectorContainer>
  );
};