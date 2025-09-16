import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore, useUIStore } from './stores';
import { lightTheme, darkTheme, GlobalStyle } from './styles/theme';
import { AppLayout } from './components/Layout';
import { AuthService } from './services';

// Page components (we'll create these)
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RestaurantPage from './pages/RestaurantPage';
import CatalogPage from './pages/CatalogPage';
import OrdersPage from './pages/OrdersPage';
import AnalyticsPage from './pages/AnalyticsPage';
import CustomersPage from './pages/CustomersPage';
import ThemesPage from './pages/ThemesPage';
import AIAssistantPage from './pages/AIAssistantPage';
import SettingsPage from './pages/SettingsPage';
import BillingPage from './pages/BillingPage';
import SupportPage from './pages/SupportPage';
import { EmployeesPage } from './pages/EmployeesPage';

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected route wrapper with loading state
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, isInitializing } = useAuthStore();
  
  // Show loading during authentication initialization or profile loading
  if (isInitializing || isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        gap: '16px'
      }}>
        <div>Loading...</div>
        <div style={{ fontSize: '14px', opacity: 0.7 }}>
          {isInitializing ? 'Initializing...' : 'Loading profile...'}
        </div>
      </div>
    );
  }
  
  // Only redirect to login if we're certain the user is not authenticated
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
};

// Authentication wrapper component
const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loadProfile, isAuthenticated, isInitializing, autoLoginForTesting } = useAuthStore();
  const [hasInitialized, setHasInitialized] = React.useState(false);
  
  useEffect(() => {
    // Only initialize once
    if (!hasInitialized) {
      console.log('Initializing authentication...');
      setHasInitialized(true);
      
      // Check if there's a stored token and load profile if needed
      if (AuthService.isAuthenticated() && !isAuthenticated && !isInitializing) {
        console.log('Found stored token, loading profile...');
        loadProfile();
      }
    }
  }, [loadProfile, isAuthenticated, isInitializing, hasInitialized, autoLoginForTesting]);
  
  return <>{children}</>;
};

function App() {
  const { isDarkMode } = useUIStore();
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AuthInitializer>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            <Route path="/restaurant" element={
              <ProtectedRoute>
                <RestaurantPage />
              </ProtectedRoute>
            } />
            <Route path="/catalog" element={
              <ProtectedRoute>
                <CatalogPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } />
            <Route path="/customers" element={
              <ProtectedRoute>
                <CustomersPage />
              </ProtectedRoute>
            } />
            <Route path="/employees" element={
              <ProtectedRoute>
                <EmployeesPage />
              </ProtectedRoute>
            } />
            <Route path="/themes" element={
              <ProtectedRoute>
                <ThemesPage />
              </ProtectedRoute>
            } />
            <Route path="/ai-assistant" element={
              <ProtectedRoute>
                <AIAssistantPage />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            <Route path="/billing" element={
              <ProtectedRoute>
                <BillingPage />
              </ProtectedRoute>
            } />
            <Route path="/support" element={
              <ProtectedRoute>
                <SupportPage />
              </ProtectedRoute>
            } />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthInitializer>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;