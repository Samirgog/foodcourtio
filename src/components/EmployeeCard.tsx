import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Employee } from '../types';
import { useEmployeeStore, useNotifications } from '../stores';

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const EmployeeInfo = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Username = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:before {
    content: '@';
  }
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.success + '20' : theme.colors.warning + '20'
  };
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.success : theme.colors.warning
  };
  
  &:before {
    content: '';
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

const Details = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.borderLight};
  padding-top: ${({ theme }) => theme.spacing.md};
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
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
          background-color: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: white;
          
          &:hover {
            background-color: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
        `;
      case 'danger':
        return `
          background-color: transparent;
          border-color: ${theme.colors.error};
          color: ${theme.colors.error};
          
          &:hover {
            background-color: ${theme.colors.error};
            color: white;
          }
        `;
      default:
        return `
          background-color: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          
          &:hover {
            background-color: ${theme.colors.backgroundSecondary};
            border-color: ${theme.colors.primary};
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      background-color: transparent;
      border-color: ${({ theme }) => theme.colors.border};
      color: ${({ theme }) => theme.colors.textMuted};
    }
  }
`;

const ToggleSwitch = styled.button<{ isActive: boolean }>`
  position: relative;
  width: 48px;
  height: 24px;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  background-color: ${({ isActive, theme }) => 
    isActive ? theme.colors.success : theme.colors.textMuted
  };
  
  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ isActive }) => isActive ? '26px' : '2px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    transition: ${({ theme }) => theme.transitions.fast};
  }
  
  &:hover {
    opacity: 0.8;
  }
`;

interface EmployeeCardProps {
  employee: Employee;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 48) return 'Yesterday';
  return `${Math.floor(diffInHours / 24)}d ago`;
};

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee }) => {
  const { removeEmployee, updateEmployeeStatus, isLoading } = useEmployeeStore();
  const { addNotification } = useNotifications();
  
  const handleToggleStatus = async () => {
    try {
      await updateEmployeeStatus(employee.id, !employee.isActive);
      addNotification({
        type: 'success',
        title: 'Status Updated',
        message: `${employee.name} is now ${!employee.isActive ? 'active' : 'inactive'}`,
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to Update Status',
        message: 'Please try again later',
      });
    }
  };
  
  const handleRemove = async () => {
    if (window.confirm(`Are you sure you want to remove ${employee.name}? This action cannot be undone.`)) {
      try {
        await removeEmployee(employee.id);
        addNotification({
          type: 'success',
          title: 'Employee Removed',
          message: `${employee.name} has been removed from your team`,
        });
      } catch (error) {
        addNotification({
          type: 'error',
          title: 'Failed to Remove Employee',
          message: 'Please try again later',
        });
      }
    }
  };
  
  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <EmployeeInfo>
          <Name>{employee.name}</Name>
          {employee.username && <Username>{employee.username}</Username>}
        </EmployeeInfo>
        <StatusBadge isActive={employee.isActive}>
          {employee.isActive ? 'Active' : 'Inactive'}
        </StatusBadge>
      </Header>
      
      <Details>
        <DetailRow>
          <DetailLabel>Joined:</DetailLabel>
          <DetailValue>
            {employee.joinedAt ? formatDate(employee.joinedAt) : 'Not joined'}
          </DetailValue>
        </DetailRow>
        {employee.lastSeen && (
          <DetailRow>
            <DetailLabel>Last seen:</DetailLabel>
            <DetailValue>{formatRelativeTime(employee.lastSeen)}</DetailValue>
          </DetailRow>
        )}
        <DetailRow>
          <DetailLabel>Telegram ID:</DetailLabel>
          <DetailValue>{employee.telegramUserId}</DetailValue>
        </DetailRow>
      </Details>
      
      <Actions>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
            {employee.isActive ? 'Active' : 'Inactive'}
          </span>
          <ToggleSwitch
            isActive={employee.isActive}
            onClick={handleToggleStatus}
            disabled={isLoading}
            title={`Set ${employee.isActive ? 'inactive' : 'active'}`}
          />
        </div>
        <ActionButton
          variant="danger"
          onClick={handleRemove}
          disabled={isLoading}
        >
          Remove
        </ActionButton>
      </Actions>
    </Card>
  );
};