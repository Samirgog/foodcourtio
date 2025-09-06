import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuthStore, useNotifications } from '../stores';
import { Button, Input, Label, ErrorText, Card } from '../styles/theme';
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InputGroup = styled.div`
  text-align: left;
`;

const DemoCredentials = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.info};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  h4 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-family: ${({ theme }) => theme.fonts.mono};
  }
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@foodcourt.io');
  const [password, setPassword] = useState('admin123');
  const { login, isLoading, error, isAuthenticated } = useAuthStore();
  const { showError, showSuccess } = useNotifications();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showError('Validation Error', 'Please fill in all fields');
      return;
    }

    try {
      await login(email, password);
      showSuccess('Welcome!', 'Successfully logged in');
    } catch (error) {
      showError('Login Failed', 'Please check your credentials and try again');
    }
  };

  const fillDemoCredentials = () => {
    setEmail('admin@foodcourt.io');
    setPassword('admin123');
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
            <DemoCredentials>
              <h4>Demo Credentials</h4>
              <p>Email: admin@foodcourt.io</p>
              <p>Password: admin123</p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={fillDemoCredentials}
                  style={{ marginTop: '8px' }}
                >
                  Fill Demo Credentials
                </Button>
              </motion.div>
            </DemoCredentials>
          </FadeInUp>

          <FadeInUp delay={0.6}>
            <Form onSubmit={handleSubmit}>
              <InputGroup>
                <Label>Email Address</Label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isLoading}
                  />
                </motion.div>
              </InputGroup>

              <InputGroup>
                <Label>Password</Label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />
                </motion.div>
                {error && <ErrorText>{error}</ErrorText>}
              </InputGroup>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.1 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  fullWidth
                >
                  {isLoading ? (
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      style={{ display: 'inline-block' }}
                    >
                      ⟳
                    </motion.span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </motion.div>
            </Form>
          </FadeInUp>
        </LoginCard>
      </ScaleIn>
    </LoginContainer>
  );
};

export default LoginPage;