import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotifications } from '../../stores';

const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const NotificationsContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  max-width: 400px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    top: ${({ theme }) => theme.spacing.md};
    right: ${({ theme }) => theme.spacing.md};
    left: ${({ theme }) => theme.spacing.md};
    max-width: none;
  }
`;

const NotificationItem = styled.div<{ 
  type: 'success' | 'error' | 'warning' | 'info';
  isExiting: boolean;
}>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.border;
    }
  }};
  border-left: 4px solid ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.border;
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${({ isExiting }) => isExiting ? slideOutRight : slideInRight} 0.3s ease-out;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  &:hover {
    transform: translateX(-4px);
  }
`;

const IconContainer = styled.div<{ type: 'success' | 'error' | 'warning' | 'info' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.border;
    }
  }};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex-shrink: 0;
`;

const Content = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.4;
`;

const Message = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  flex-shrink: 0;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.borderLight};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ProgressBar = styled.div<{ duration: number; type: string }>`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background-color: ${({ type, theme }) => {
    switch (type) {
      case 'success': return theme.colors.success;
      case 'error': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.info;
      default: return theme.colors.border;
    }
  }};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius.md} ${({ theme }) => theme.borderRadius.md};
  animation: shrink ${({ duration }) => duration}ms linear;

  @keyframes shrink {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

const NotificationWrapper = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✕';
    case 'warning': return '⚠';
    case 'info': return 'ℹ';
    default: return '•';
  }
};

export const Notifications: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  const handleClose = (id: string) => {
    removeNotification(id);
  };

  return (
    <NotificationsContainer>
      {notifications.map((notification) => (
        <NotificationWrapper key={notification.id}>
          <NotificationItem
            type={notification.type}
            isExiting={false}
            onClick={() => handleClose(notification.id)}
          >
            <IconContainer type={notification.type}>
              {getNotificationIcon(notification.type)}
            </IconContainer>
            
            <Content>
              <Title>{notification.title}</Title>
              {notification.message && (
                <Message>{notification.message}</Message>
              )}
            </Content>
            
            <CloseButton onClick={() => handleClose(notification.id)}>
              ✕
            </CloseButton>
          </NotificationItem>
          
          {notification.duration && notification.duration > 0 && (
            <ProgressBar 
              duration={notification.duration} 
              type={notification.type}
            />
          )}
        </NotificationWrapper>
      ))}
    </NotificationsContainer>
  );
};