import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuthStore, useUIStore, useNotifications } from '../stores';

const SettingsContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
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

const SettingsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const SettingsSection = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const SectionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const SectionTitle = styled.div`
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SettingItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &:first-child {
    padding-top: 0;
  }
`;

const SettingLabel = styled.div`
  .title {
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .description {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const Toggle = styled.button<{ active: boolean }>`
  position: relative;
  width: 50px;
  height: 26px;
  border: none;
  border-radius: 13px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  background-color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.textMuted};
  
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ active }) => active ? '26px' : '2px'};
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: white;
    transition: ${({ theme }) => theme.transitions.fast};
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  transition: ${({ theme }) => theme.transitions.fast};
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: white;
          
          &:hover {
            background: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          border-color: ${theme.colors.error};
          color: white;
          
          &:hover {
            background: #dc2626;
            border-color: #dc2626;
          }
        `;
      default:
        return `
          background: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          
          &:hover {
            background: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.primary};
          }
        `;
    }
  }}
`;

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const { addNotification } = useNotifications();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    orderAlerts: true,
    marketingEmails: false,
    soundEnabled: true,
    autoLogout: false,
  });
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    
    addNotification({
      type: 'success',
      title: 'Settings Updated',
      message: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${settings[key] ? 'disabled' : 'enabled'}`,
    });
  };
  
  const handleSaveProfile = () => {
    // Here you would typically save to your backend
    addNotification({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been saved successfully',
    });
  };
  
  const handlePasswordReset = () => {
    addNotification({
      type: 'info',
      title: 'Password Reset',
      message: 'Password reset email has been sent to your email address',
    });
  };

  return (
    <SettingsContainer>
      <Header>
        <h1>⚙️ Settings</h1>
        <p>
          Manage your account settings, preferences, and notification options.
        </p>
      </Header>

      <SettingsGrid>
        {/* Account Settings */}
        <SettingsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <SectionHeader>
            <SectionIcon>👤</SectionIcon>
            <SectionTitle>
              <h3>Account Settings</h3>
              <p>Update your personal information and account details</p>
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Full Name</div>
              <div className="description">Your display name in the application</div>
            </SettingLabel>
            <Input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Email Address</div>
              <div className="description">Used for notifications and account recovery</div>
            </SettingLabel>
            <Input 
              type="email" 
              value={profileData.email}
              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Password</div>
              <div className="description">Change your account password</div>
            </SettingLabel>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button variant="secondary" onClick={handlePasswordReset}>
                Reset Password
              </Button>
            </div>
          </SettingItem>
          
          <div style={{ marginTop: '24px', textAlign: 'right' }}>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </div>
        </SettingsSection>

        {/* App Preferences */}
        <SettingsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <SectionHeader>
            <SectionIcon>🎨</SectionIcon>
            <SectionTitle>
              <h3>App Preferences</h3>
              <p>Customize your app experience</p>
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Dark Mode</div>
              <div className="description">Switch between light and dark themes</div>
            </SettingLabel>
            <Toggle active={isDarkMode} onClick={toggleDarkMode} />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Sound Effects</div>
              <div className="description">Enable notification sounds and UI feedback</div>
            </SettingLabel>
            <Toggle 
              active={settings.soundEnabled} 
              onClick={() => handleToggle('soundEnabled')} 
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Auto Logout</div>
              <div className="description">Automatically log out after 30 minutes of inactivity</div>
            </SettingLabel>
            <Toggle 
              active={settings.autoLogout} 
              onClick={() => handleToggle('autoLogout')} 
            />
          </SettingItem>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <SectionHeader>
            <SectionIcon>🔔</SectionIcon>
            <SectionTitle>
              <h3>Notifications</h3>
              <p>Control how and when you receive notifications</p>
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Email Notifications</div>
              <div className="description">Receive important updates via email</div>
            </SettingLabel>
            <Toggle 
              active={settings.emailNotifications} 
              onClick={() => handleToggle('emailNotifications')} 
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Push Notifications</div>
              <div className="description">Get real-time notifications in your browser</div>
            </SettingLabel>
            <Toggle 
              active={settings.pushNotifications} 
              onClick={() => handleToggle('pushNotifications')} 
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Order Alerts</div>
              <div className="description">Instant notifications for new orders</div>
            </SettingLabel>
            <Toggle 
              active={settings.orderAlerts} 
              onClick={() => handleToggle('orderAlerts')} 
            />
          </SettingItem>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Marketing Emails</div>
              <div className="description">Receive promotional content and feature updates</div>
            </SettingLabel>
            <Toggle 
              active={settings.marketingEmails} 
              onClick={() => handleToggle('marketingEmails')} 
            />
          </SettingItem>
        </SettingsSection>

        {/* Danger Zone */}
        <SettingsSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <SectionHeader>
            <SectionIcon>⚠️</SectionIcon>
            <SectionTitle>
              <h3>Danger Zone</h3>
              <p>Irreversible and destructive actions</p>
            </SectionTitle>
          </SectionHeader>
          
          <SettingItem>
            <SettingLabel>
              <div className="title">Delete Account</div>
              <div className="description">Permanently remove your account and all associated data</div>
            </SettingLabel>
            <Button 
              variant="danger" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                  addNotification({
                    type: 'info',
                    title: 'Account Deletion',
                    message: 'Account deletion request has been submitted',
                  });
                }
              }}
            >
              Delete Account
            </Button>
          </SettingItem>
        </SettingsSection>
      </SettingsGrid>
    </SettingsContainer>
  );
};

export default SettingsPage;