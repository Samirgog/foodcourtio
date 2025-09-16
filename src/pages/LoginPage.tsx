import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuthStore, useNotifications } from '../stores';
import { Button, Card, Textarea } from '../styles/theme';
import { FadeInUp, ScaleIn } from '../components/animations/AnimationComponents';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary} 0%, 
    ${({ theme }) => theme.colors.accent} 100%);
  padding: ${({ theme }) => theme.spacing.lg};
`;

const LoginCard = styled(motion.div).attrs(() => ({
  as: Card
}))`
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
`;

const Logo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  img {
    width: 64px;
    height: 64px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    margin: ${({ theme }) => theme.spacing.sm} 0 0 0;
  }
`;

const TelegramButton = styled(motion.button)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: #0088cc;
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #0077b3;
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .telegram-icon {
    font-size: 24px;
  }
`;

const Instructions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.info};
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    line-height: 1.5;
  }
`;

const DevTools = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: #fff3cd;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid #ffc107;
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: #856404;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
  
  .dev-toggle {
    background: none;
    border: none;
    color: #007bff;
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    text-decoration: underline;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const LoginPage: React.FC = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showDevTools, setShowDevTools] = useState(false);
  const [initData, setInitData] = useState('');
  const { loginWithTelegram, isLoading, error, isAuthenticated } = useAuthStore();
  const { showError, showSuccess } = useNotifications();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check for Telegram initData in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const telegramInitData = urlParams.get('initData');
    
    if (telegramInitData) {
      // Process Telegram authentication
      handleTelegramAuth(telegramInitData);
    }
  }, []);

  const handleTelegramAuth = async (initData: string) => {
    if (!initData.trim()) {
      showError('Validation Error', 'Please provide Telegram initData');
      return;
    }
    
    setIsRedirecting(true);
    
    try {
      await loginWithTelegram(initData);
      showSuccess('Welcome!', 'Successfully logged in with Telegram');
    } catch (error) {
      showError('Login Failed', 'Failed to authenticate with Telegram');
      setIsRedirecting(false);
    }
  };

  const redirectToTelegramBot = () => {
    // Replace with your actual Telegram bot username
    const botUsername = 'FoodCourtIOBot'; // You'll need to create this bot
    const redirectUrl = encodeURIComponent(window.location.origin + window.location.pathname);
    
    // This would redirect to your Telegram bot which then redirects back with initData
    window.location.href = `https://t.me/${botUsername}?start=auth_redirect_${redirectUrl}`;
  };

  return (
    <LoginContainer>
      <ScaleIn duration={0.6}>
        <LoginCard
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <FadeInUp delay={0.2}>
            <Logo>
              <motion.img 
                src="https://images.unsplash.com/photo-1567521464027-f127ff144326?w=64&h=64&fit=crop" 
                alt="FoodCourt.io"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <h1>FoodCourt.io</h1>
              <p>Admin Panel</p>
            </Logo>
          </FadeInUp>

          <FadeInUp delay={0.4}>
            <TelegramButton
              onClick={redirectToTelegramBot}
              disabled={isLoading || isRedirecting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.1 }}
            >
              <span className="telegram-icon">📱</span>
              {isRedirecting ? 'Authenticating...' : 'Login with Telegram'}
            </TelegramButton>
          </FadeInUp>

          <FadeInUp delay={0.6}>
            <Instructions>
              <h3>How to Login</h3>
              <p>
                Click the "Login with Telegram" button to authenticate with our Telegram bot. 
                You'll be redirected to Telegram, and after authentication, you'll be brought back here.
              </p>
            </Instructions>
          </FadeInUp>

          {/* Development Tools - Only visible in development mode */}
          {import.meta.env.DEV && (
            <FadeInUp delay={0.8}>
              <DevTools>
                <h3>Development Tools</h3>
                <button 
                  className="dev-toggle"
                  onClick={() => setShowDevTools(!showDevTools)}
                >
                  {showDevTools ? 'Hide' : 'Show'} Manual Authentication
                </button>
                
                {showDevTools && (
                  <div style={{ marginTop: '1rem' }}>
                    <p style={{ fontSize: '0.85rem', color: '#856404' }}>
                      For development: Paste Telegram initData below to test authentication
                    </p>
                    <Textarea
                      value={initData}
                      onChange={(e) => setInitData(e.target.value)}
                      placeholder="Paste Telegram initData here..."
                      rows={3}
                      style={{ width: '100%', marginBottom: '0.5rem' }}
                    />
                    <Button
                      onClick={() => handleTelegramAuth(initData)}
                      disabled={isLoading || isRedirecting}
                      fullWidth
                    >
                      {isRedirecting ? 'Authenticating...' : 'Test Auth with InitData'}
                    </Button>
                  </div>
                )}
              </DevTools>
            </FadeInUp>
          )}

          {error && (
            <FadeInUp delay={0.9}>
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                backgroundColor: '#fee', 
                border: '1px solid #fcc', 
                borderRadius: '0.5rem',
                color: '#c33'
              }}>
                {error}
              </div>
            </FadeInUp>
          )}
        </LoginCard>
      </ScaleIn>
    </LoginContainer>
  );
};

export default LoginPage;