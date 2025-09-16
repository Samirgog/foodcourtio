import React from 'react';
import styled from 'styled-components';
import { useUIStore, useRestaurantStore, useAuthStore } from '../../stores';
import { useMediaQuery } from '../../hooks';
import { Button } from '../../styles/theme';
import { RestaurantSelector } from '../RestaurantSelector';

const ToolbarContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 80px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const MenuButton = styled.button<{ isOpen?: boolean }>`
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryLight};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:active {
    transform: translateY(0);
  }

  .burger-line {
    width: 20px;
    height: 2px;
    background-color: currentColor;
    border-radius: 2px;
    transition: ${({ theme }) => theme.transitions.fast};
    transform-origin: center;
  }

  .burger-line:nth-child(1) {
    transform: ${({ isOpen }) => isOpen ? 'rotate(45deg) translateY(6px)' : 'rotate(0) translateY(-3px)'};
  }

  .burger-line:nth-child(2) {
    opacity: ${({ isOpen }) => isOpen ? '0' : '1'};
    transform: ${({ isOpen }) => isOpen ? 'translateX(20px)' : 'translateX(0)'};
  }

  .burger-line:nth-child(3) {
    transform: ${({ isOpen }) => isOpen ? 'rotate(-45deg) translateY(-6px)' : 'rotate(0) translateY(3px)'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  
  .separator {
    color: ${({ theme }) => theme.colors.border};
  }
  
  .crumb {
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: none;
    transition: ${({ theme }) => theme.transitions.fast};
    
    &:hover {
      color: ${({ theme }) => theme.colors.text};
    }
    
    &.active {
      color: ${({ theme }) => theme.colors.text};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const StatusIndicator = styled.div<{ published: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ published, theme }) => 
    published ? theme.colors.success : theme.colors.warning};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  
  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    .text {
      display: none;
    }
  }
`;

const ThemeToggle = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const PreviewButton = styled(Button)<{ active: boolean }>`
  background-color: ${({ active, theme }) => 
    active ? theme.colors.accent : theme.colors.surface};
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.text};
  border: 1px solid ${({ active, theme }) => 
    active ? theme.colors.accent : theme.colors.border};
  
  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.accent : theme.colors.surfaceHover};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const PublishButton = styled(Button)<{ published: boolean }>`
  background-color: ${({ published, theme }) => 
    published ? theme.colors.warning : theme.colors.success};
  
  &:hover {
    background-color: ${({ published, theme }) => 
      published ? '#d97706' : '#059669'};
  }
`;

const NotificationBadge = styled.div`
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.error};
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.surface};
  }
`;

interface TopToolbarProps {
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({ 
  title = 'Dashboard',
  breadcrumbs = [{ label: 'Dashboard' }]
}) => {
  const { 
    sidebarOpen,
    toggleSidebar, 
    isDarkMode, 
    toggleDarkMode, 
    previewMode, 
    setPreviewMode 
  } = useUIStore();
  
  const { currentRestaurant, publishRestaurant, unpublishRestaurant } = useRestaurantStore();
  const { user, logout } = useAuthStore();
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  const handlePublishToggle = async () => {
    if (!currentRestaurant) return;
    
    if (currentRestaurant.isPublished) {
      await unpublishRestaurant(currentRestaurant.id);
    } else {
      await publishRestaurant(currentRestaurant.id);
    }
  };

  return (
    <ToolbarContainer>
      <LeftSection>
        <MenuButton onClick={toggleSidebar} isOpen={sidebarOpen}>
          <div className="burger-line"></div>
          <div className="burger-line"></div>
          <div className="burger-line"></div>
        </MenuButton>
        
        <div>
          <PageTitle>{title}</PageTitle>
          <Breadcrumbs>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <span className="separator">/</span>}
                <a 
                  href={crumb.href || '#'} 
                  className={`crumb ${index === breadcrumbs.length - 1 ? 'active' : ''}`}
                >
                  {crumb.label}
                </a>
              </React.Fragment>
            ))}
          </Breadcrumbs>
        </div>
                <RestaurantSelector />

      </LeftSection>

      <RightSection>
        
        {currentRestaurant && (
          <StatusIndicator published={currentRestaurant.isPublished}>
            <div className="dot" />
            <span className="text">
              {currentRestaurant.isPublished ? 'Published' : 'Draft'}
            </span>
          </StatusIndicator>
        )}

        <ActionButtons>
          <ThemeToggle onClick={toggleDarkMode} title="Toggle dark mode">
            {isDarkMode ? '☀️' : '🌙'}
          </ThemeToggle>

          <PreviewButton 
            active={previewMode} 
            onClick={handlePreviewToggle}
            size="sm"
          >
            {previewMode ? '✏️' : '👁️'} {!isMobile && (previewMode ? 'Edit' : 'Preview')}
          </PreviewButton>

          {currentRestaurant && (
            <PublishButton 
              published={currentRestaurant.isPublished}
              onClick={handlePublishToggle}
              size="sm"
            >
              {currentRestaurant.isPublished ? 'Unpublish' : 'Publish'}
            </PublishButton>
          )}

          <NotificationBadge>
            <ThemeToggle title="Notifications">
              🔔
            </ThemeToggle>
          </NotificationBadge>

          <ThemeToggle onClick={logout} title="Logout">
            🚪
          </ThemeToggle>
        </ActionButtons>
      </RightSection>
    </ToolbarContainer>
  );
};