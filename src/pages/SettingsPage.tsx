import React from 'react';
import styled from 'styled-components';
import { Card } from '../styles/theme';
import { FadeInUp } from '../components/animations/AnimationComponents';

const SettingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
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
    line-height: 1.6;
  }
`;

const PlaceholderCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const SettingsPage: React.FC = () => {
  return (
    <SettingsContainer>
      <FadeInUp>
        <Header>
          <h1>⚙️ Settings</h1>
          <p>
            Configure your account settings, preferences, and system configurations.
          </p>
        </Header>

        <PlaceholderCard>
          <div className="icon">🔧</div>
          <h3>Settings Panel Coming Soon</h3>
          <p>
            This page will contain user preferences, account settings, notification 
            preferences, and system configuration options.
          </p>
        </PlaceholderCard>
      </FadeInUp>
    </SettingsContainer>
  );
};

export default SettingsPage;