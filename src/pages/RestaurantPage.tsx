import React from 'react';
import styled from 'styled-components';
import { Card } from '../styles/theme';

const PlaceholderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

const PlaceholderCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  max-width: 400px;
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.7;
  }
  
  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    line-height: 1.6;
  }
`;

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  return (
    <PlaceholderContainer>
      <PlaceholderCard>
        <div className="icon">{icon}</div>
        <h2>{title}</h2>
        <p>{description}</p>
      </PlaceholderCard>
    </PlaceholderContainer>
  );
};

// Individual page components
const RestaurantPage: React.FC = () => (
  <PlaceholderPage
    title="Restaurant Setup"
    description="Configure your restaurant details, upload images, select payment providers, and set up your location within the food court."
    icon="🏪"
  />
);

const CatalogPage: React.FC = () => (
  <PlaceholderPage
    title="Menu Catalog"
    description="Manage your restaurant's menu with categories, products, prices, and variants. Use drag & drop to reorder items and AI to generate content."
    icon="📋"
  />
);

const OrdersPage: React.FC = () => (
  <PlaceholderPage
    title="Orders Management"
    description="View and manage incoming orders, track order status, and communicate with customers about their orders."
    icon="📦"
  />
);

const AnalyticsPage: React.FC = () => (
  <PlaceholderPage
    title="Analytics Dashboard"
    description="Analyze your restaurant's performance with detailed insights on sales, popular items, customer behavior, and revenue trends."
    icon="📈"
  />
);

const CustomersPage: React.FC = () => (
  <PlaceholderPage
    title="Customer Management"
    description="View customer profiles, order history, feedback, and manage customer relationships to improve satisfaction."
    icon="👥"
  />
);

const ThemesPage: React.FC = () => (
  <PlaceholderPage
    title="Theme Customization"
    description="Customize the visual appearance of your restaurant's storefront with different themes, colors, and layout options."
    icon="🎨"
  />
);

const AIAssistantPage: React.FC = () => (
  <PlaceholderPage
    title="AI Assistant"
    description="Use AI-powered tools to generate menu content, optimize descriptions, suggest pricing, and automate catalog creation."
    icon="🤖"
  />
);

const SettingsPage: React.FC = () => (
  <PlaceholderPage
    title="Settings"
    description="Configure your account settings, notification preferences, security options, and restaurant operational settings."
    icon="⚙️"
  />
);

const BillingPage: React.FC = () => (
  <PlaceholderPage
    title="Billing & Payments"
    description="Manage your subscription, view invoices, update payment methods, and track your platform usage and fees."
    icon="💳"
  />
);

const SupportPage: React.FC = () => (
  <PlaceholderPage
    title="Support Center"
    description="Get help with platform features, contact support, access documentation, and find answers to frequently asked questions."
    icon="❓"
  />
);

// Export all pages
export default RestaurantPage;
export {
  CatalogPage,
  OrdersPage,
  AnalyticsPage,
  CustomersPage,
  ThemesPage,
  AIAssistantPage,
  SettingsPage,
  BillingPage,
  SupportPage
};