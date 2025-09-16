import React from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUIStore, useAuthStore } from '../../stores';
import { useMediaQuery } from '../../hooks';

const SidebarContainer = styled.aside<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? '80px' : '280px')};
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.surface};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  flex-direction: column;
  transition: width ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

const Logo = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 80px;
  
  img {
    width: 52px;
    height: 52px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    flex-shrink: 0;
  }
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    transition: opacity ${({ theme }) => theme.transitions.normal};
    white-space: nowrap;
    overflow: hidden;
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md} 0;
  overflow-y: auto;
  overflow-x: hidden;
`;

const NavSection = styled.div<{ collapsed: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3<{ collapsed: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
  transition: opacity ${({ theme }) => theme.transitions.normal};
`;

const NavItem = styled.button<{ active: boolean; collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 90%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  margin: 2px ${({ theme }) => theme.spacing.sm};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primaryLight : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.text};
  text-align: left;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ active, theme }) => 
    active ? theme.fontWeights.medium : theme.fontWeights.normal};

  &:hover {
    background-color: ${({ active, theme }) => 
      active ? theme.colors.primaryLight : theme.colors.surfaceHover};
  }

  .icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .label {
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    transition: opacity ${({ theme }) => theme.transitions.normal};
    white-space: nowrap;
    overflow: hidden;
  }

  .badge {
    margin-left: auto;
    padding: 2px 6px;
    background-color: ${({ theme }) => theme.colors.accent};
    color: white;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    font-size: ${({ theme }) => theme.fontSizes.xs};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }
`;

const UserSection = styled.div<{ collapsed: boolean }>`
  padding: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: auto;
`;

const UserInfo = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    background-color: ${({ theme }) => theme.colors.primary};
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    flex-shrink: 0;

    img {
        width: 100%;
    }
  }
  
  .info {
    opacity: ${({ collapsed }) => (collapsed ? 0 : 1)};
    transition: opacity ${({ theme }) => theme.transitions.normal};
    
    .name {
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.colors.text};
      margin: 0;
    }
    
    .role {
      font-size: ${({ theme }) => theme.fontSizes.xs};
      color: ${({ theme }) => theme.colors.textMuted};
      margin: 0;
    }
  }
`;

const CollapseButton = styled.button<{ collapsed: boolean }>`
  position: absolute;
  top: 20px;
  right: ${({ collapsed }) => collapsed ? '-12px' : '-12px'};
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.primaryHover});
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.fast};
  z-index: 1000;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    border-color: ${({ theme }) => theme.colors.primaryHover};
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  .icon {
    font-size: 14px;
    transition: ${({ theme }) => theme.transitions.fast};
    transform: ${({ collapsed }) => collapsed ? 'rotate(180deg)' : 'rotate(0deg)'};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Icons (using Unicode symbols for now - in real app you'd use an icon library)
const icons = {
  dashboard: '📊',
  restaurant: '🏪',
  menu: '📋',
  orders: '📦',
  analytics: '📈',
  customers: '👥',
  employees: '👨‍💼',
  settings: '⚙️',
  support: '❓',
  billing: '💳',
  themes: '🎨',
  ai: '🤖',
  collapse: '⏸️',
  expand: '▶️',
};

const navigationItems = [
  {
    section: 'Main',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: icons.dashboard },
      { path: '/restaurant', label: 'Restaurant Setup', icon: icons.restaurant },
      { path: '/catalog', label: 'Menu Catalog', icon: icons.menu },
      { path: '/orders', label: 'Orders', icon: icons.orders },
      { path: '/employees', label: 'Employees', icon: icons.employees },
    ],
  },
  // {
  //   section: 'Business',
  //   items: [
  //     { path: '/analytics', label: 'Analytics', icon: icons.analytics },
  //     { path: '/customers', label: 'Customers', icon: icons.customers },
  //     { path: '/themes', label: 'Themes', icon: icons.themes },
  //     { path: '/ai-assistant', label: 'AI Assistant', icon: icons.ai },
  //   ],
  // },
  {
    section: 'Account',
    items: [
      { path: '/settings', label: 'Settings', icon: icons.settings },
      { path: '/billing', label: 'Billing', icon: icons.billing },
      { path: '/support', label: 'Support', icon: icons.support },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebarCollapse, setSidebarOpen } = useUIStore();
  const { user } = useAuthStore();
  const isMobile = useMediaQuery(`(max-width: 768px)`);

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarContainer collapsed={sidebarCollapsed}>
      <Logo collapsed={sidebarCollapsed}>
        <img 
          src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=40&h=40&fit=crop" 
          alt="FoodCourt.io"
        />
        <h1>FoodCourt.io</h1>
      </Logo>

      <Navigation>
        {navigationItems.map((section) => (
          <NavSection key={section.section} collapsed={sidebarCollapsed}>
            <SectionTitle collapsed={sidebarCollapsed}>
              {section.section}
            </SectionTitle>
            {section.items.map((item) => (
              <NavItem
                key={item.path}
                active={location.pathname === item.path}
                collapsed={sidebarCollapsed}
                onClick={() => handleNavigation(item.path)}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
                {item.badge && <span className="badge">{item.badge}</span>}
              </NavItem>
            ))}
          </NavSection>
        ))}
      </Navigation>

      <UserSection collapsed={sidebarCollapsed}>
        <UserInfo collapsed={sidebarCollapsed}>
          <div className="avatar">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              getUserInitials(user?.name || 'U')
            )}
          </div>
          <div className="info">
            <p className="name">{user?.name}</p>
            <p className="role">{user?.role?.replace('_', ' ')}</p>
          </div>
        </UserInfo>
      </UserSection>

      {!isMobile && (
        <CollapseButton onClick={toggleSidebarCollapse} collapsed={sidebarCollapsed}>
          <span className="icon">◀</span>
        </CollapseButton>
      )}
    </SidebarContainer>
  );
};