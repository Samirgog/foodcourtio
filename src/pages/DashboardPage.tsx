import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRestaurantStore, useCatalogStore, useNotifications } from '../stores';
import { Card, Grid, Button } from '../styles/theme';
import { formatCurrency, formatDate } from '../utils';
import { FadeInUp, StaggerContainer, StaggerItem } from '../components/animations/AnimationComponents';
import { useCardAnimation } from '../hooks/useAnimations';

const DashboardContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  max-width: 1400px;
  margin: 0 auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const WelcomeSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const StatsCard = styled(motion.div).attrs(() => ({
  as: Card
}))`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary}, 
      ${({ theme }) => theme.colors.accent}
    );
  }
  
  .icon {
    font-size: 2.5rem;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    display: block;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 2rem;
      margin-bottom: ${({ theme }) => theme.spacing.sm};
    }
  }
  
  .value {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    line-height: 1.2;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: ${({ theme }) => theme.fontSizes.xl};
    }
  }
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
  
  .change {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin: 0;
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border-radius: ${({ theme }) => theme.borderRadius.full};
    display: inline-block;
    
    &.positive {
      color: ${({ theme }) => theme.colors.success};
      background-color: ${({ theme }) => theme.colors.success}20;
    }
    
    &.negative {
      color: ${({ theme }) => theme.colors.error};
      background-color: ${({ theme }) => theme.colors.error}20;
    }
  }
`;

const ContentSection = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const QuickActionsCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  height: fit-content;
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`;

const OverviewCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  height: fit-content;
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`;

const ActionButton = styled(motion.button).attrs(() => ({
  as: Button
}))`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  height: auto;
  min-height: 100px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.5rem;
    padding: ${({ theme }) => theme.spacing.sm};
    background: ${({ theme }) => theme.colors.primary}15;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    text-align: center;
    line-height: 1.3;
  }
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const RestaurantOverview = styled(motion.div)`
  .restaurant-info {
    display: flex;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      flex-direction: column;
      text-align: center;
    }
    
    .logo {
      width: 80px;
      height: 80px;
      border-radius: ${({ theme }) => theme.borderRadius.lg};
      object-fit: cover;
      flex-shrink: 0;
      
      @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
        width: 60px;
        height: 60px;
        margin: 0 auto;
      }
    }
    
    .details {
      flex: 1;
      
      .name {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
      }
      
      .description {
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
        line-height: 1.5;
        font-size: ${({ theme }) => theme.fontSizes.sm};
      }
      
      .status {
        display: inline-flex;
        align-items: center;
        gap: ${({ theme }) => theme.spacing.xs};
        font-size: ${({ theme }) => theme.fontSizes.sm};
        font-weight: ${({ theme }) => theme.fontWeights.medium};
        
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        &.published {
          color: ${({ theme }) => theme.colors.success};
          
          .dot {
            background-color: ${({ theme }) => theme.colors.success};
          }
        }
        
        &.draft {
          color: ${({ theme }) => theme.colors.warning};
          
          .dot {
            background-color: ${({ theme }) => theme.colors.warning};
          }
        }
      }
    }
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: ${({ theme }) => theme.spacing.lg};
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      grid-template-columns: repeat(3, 1fr);
      gap: ${({ theme }) => theme.spacing.md};
    }
    
    .stat {
      text-align: center;
      
      .value {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.bold};
        color: ${({ theme }) => theme.colors.text};
        margin: 0;
        
        @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
          font-size: ${({ theme }) => theme.fontSizes.md};
        }
      }
      
      .label {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        color: ${({ theme }) => theme.colors.textMuted};
        margin: 0;
      }
    }
  }
`;

const NoRestaurantCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.surface} 0%, 
    ${({ theme }) => theme.colors.backgroundTertiary} 100%
  );
  border: 2px dashed ${({ theme }) => theme.colors.border};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.7;
    
    @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
      font-size: 3rem;
    }
  }
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
    line-height: 1.5;
  }
`;

const DashboardPage: React.FC = () => {
  const { currentRestaurant, fetchRestaurants } = useRestaurantStore();
  const { categories, products, fetchCatalog } = useCatalogStore();
  const { showSuccess } = useNotifications();

  useEffect(() => {
    fetchRestaurants();
    if (currentRestaurant) {
      fetchCatalog(currentRestaurant.id);
    }
  }, [currentRestaurant?.id]);

  const stats = [
    {
      icon: '💰',
      value: formatCurrency(12450),
      label: 'Monthly Revenue',
      change: '+12.5%',
      positive: true
    },
    {
      icon: '📦',
      value: '142',
      label: 'Total Orders',
      change: '+8.2%',
      positive: true
    },
    {
      icon: '👥',
      value: '89',
      label: 'Active Customers',
      change: '+15.1%',
      positive: true
    },
    {
      icon: '⭐',
      value: '4.8',
      label: 'Avg Rating',
      change: '+0.2',
      positive: true
    }
  ];

  const quickActions = [
    {
      icon: '➕',
      label: 'Add Product',
      action: () => showSuccess('Coming Soon', 'Product creation feature')
    },
    {
      icon: '📋',
      label: 'Manage Menu',
      action: () => showSuccess('Coming Soon', 'Menu management feature')
    },
    {
      icon: '📈',
      label: 'View Analytics',
      action: () => showSuccess('Coming Soon', 'Analytics dashboard')
    },
    {
      icon: '🎨',
      label: 'Customize Theme',
      action: () => showSuccess('Coming Soon', 'Theme customization')
    }
  ];

  return (
    <DashboardContainer>
      <FadeInUp>
        <WelcomeSection>
          <h1>Welcome back! 👋</h1>
          <p>Here's what's happening with your restaurant today</p>
        </WelcomeSection>
      </FadeInUp>

      {/* Stats Overview */}
      <FadeInUp delay={0.2}>
        <StatsGrid>
          <StaggerContainer>
            {stats.map((stat, index) => {
              const { controls, cardProps } = useCardAnimation();
              return (
                <StaggerItem key={index}>
                  <StatsCard
                    animate={controls}
                    {...cardProps}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="icon">{stat.icon}</div>
                    <h2 className="value">{stat.value}</h2>
                    <p className="label">{stat.label}</p>
                    <p className={`change ${stat.positive ? 'positive' : 'negative'}`}>
                      {stat.change} from last month
                    </p>
                  </StatsCard>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </StatsGrid>
      </FadeInUp>

      <FadeInUp delay={0.4}>
        <ContentSection>
          <MainContent>
            {/* Restaurant Overview */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {currentRestaurant ? (
                <OverviewCard as={RestaurantOverview}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3>Restaurant Overview</h3>
                  <div className="restaurant-info">
                    <motion.img 
                      src={currentRestaurant.logo || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=80&h=80&fit=crop'}
                      alt={currentRestaurant.name}
                      className="logo"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    />
                    <div className="details">
                      <h3 className="name">{currentRestaurant.name}</h3>
                      <p className="description">{currentRestaurant.description}</p>
                      <span className={`status ${currentRestaurant.isPublished ? 'published' : 'draft'}`}>
                        <span className="dot" />
                        {currentRestaurant.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  <div className="stats">
                    <StaggerContainer staggerDelay={0.1}>
                      <StaggerItem>
                        <div className="stat">
                          <p className="value">{categories.length}</p>
                          <p className="label">Categories</p>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="stat">
                          <p className="value">{products.length}</p>
                          <p className="label">Products</p>
                        </div>
                      </StaggerItem>
                      <StaggerItem>
                        <div className="stat">
                          <p className="value">{formatDate(currentRestaurant.updatedAt).split(',')[0]}</p>
                          <p className="label">Last Updated</p>
                        </div>
                      </StaggerItem>
                    </StaggerContainer>
                  </div>
                </OverviewCard>
              ) : (
                <OverviewCard as={NoRestaurantCard}>
                  <motion.div 
                    className="icon"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >
                    🏪
                  </motion.div>
                  <h3>No Restaurant Found</h3>
                  <p>Get started by creating your first restaurant</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button>Create Restaurant</Button>
                  </motion.div>
                </OverviewCard>
              )}
            </motion.div>
          </MainContent>

          {/* <Sidebar>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <QuickActionsCard>
                <h3>Quick Actions</h3>
                <ActionGrid>
                  <StaggerContainer staggerDelay={0.1}>
                    {quickActions.map((action, index) => (
                      <StaggerItem key={index}>
                        <ActionButton
                          variant="outline"
                          onClick={action.action}
                          whileHover={{ 
                            scale: 1.05,
                            boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
                          }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <motion.span 
                            className="icon"
                            whileHover={{ rotate: 10 }}
                            transition={{ duration: 0.2 }}
                          >
                            {action.icon}
                          </motion.span>
                          <span className="label">{action.label}</span>
                        </ActionButton>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </ActionGrid>
              </QuickActionsCard>
            </motion.div>
          </Sidebar> */}
        </ContentSection>
      </FadeInUp>
    </DashboardContainer>
  );
};

export default DashboardPage;