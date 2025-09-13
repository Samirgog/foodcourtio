import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { EmployeeCard } from '../components/EmployeeCard';
import { InviteLinkModal } from '../components/InviteLinkModal';
import { useEmployeeManagement } from '../hooks';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h1`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`;

const ActionSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
    align-items: stretch;
  }
`;

const ActionInfo = styled.div`
  flex: 1;
`;

const ActionTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const ActionSubtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GenerateButton = styled.button<{ loading?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primaryHover};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  ${({ loading }) => loading && `
    &:after {
      content: '';
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `}
`;

const EmployeesSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const EmployeeCount = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

const EmployeeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  text-align: center;
  background: ${({ theme }) => theme.colors.surface};
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const EmptyIcon = styled.div`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const EmptyTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyDescription = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  max-width: 400px;
`;

const EmptyAction = styled.button`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.xl}`};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxl};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  text-align: center;
`;

const ErrorTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorMessage = styled.p`
  margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RetryButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    opacity: 0.8;
  }
`;

export const EmployeesPage: React.FC = () => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  
  const {
    employees,
    activeEmployees,
    inactiveEmployees,
    hasEmployees,
    isLoading,
    error,
    generateInvite,
    lastGeneratedInvite,
    clearLastGeneratedInvite,
    isGeneratingInvite,
    restaurantId,
    refetch,
  } = useEmployeeManagement();

  const handleGenerateInvite = async () => {
    if (!restaurantId) return;
    
    const inviteLink = await generateInvite(restaurantId, 24);
    if (inviteLink) {
      setShowInviteModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowInviteModal(false);
    clearLastGeneratedInvite();
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <PageContainer>
        <Header>
          <Title>Employees</Title>
          <Description>Manage employees who can receive order notifications in Telegram.</Description>
        </Header>
        <LoadingState>Loading employees...</LoadingState>
      </PageContainer>
    );
  }

  if (error && !hasEmployees) {
    return (
      <PageContainer>
        <Header>
          <Title>Employees</Title>
          <Description>Manage employees who can receive order notifications in Telegram.</Description>
        </Header>
        <ErrorState>
          <ErrorTitle>Failed to load employees</ErrorTitle>
          <ErrorMessage>{error}</ErrorMessage>
          <RetryButton onClick={handleRetry}>
            Try Again
          </RetryButton>
        </ErrorState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <Title>Employees</Title>
        <Description>
          Manage employees who can receive order notifications in Telegram.
        </Description>
      </Header>

      <ActionSection>
        <ActionInfo>
          <ActionTitle>Invite New Employee</ActionTitle>
          <ActionSubtitle>
            Generate an invite link to add employees to your restaurant's notification system.
          </ActionSubtitle>
        </ActionInfo>
        <GenerateButton
          onClick={handleGenerateInvite}
          disabled={isGeneratingInvite || !restaurantId}
          loading={isGeneratingInvite}
        >
          {isGeneratingInvite ? 'Generating...' : 'Generate Invite Link'}
        </GenerateButton>
      </ActionSection>

      <EmployeesSection>
        <SectionHeader>
          <SectionTitle>Team Members</SectionTitle>
          <EmployeeCount>
            {employees.length} {employees.length === 1 ? 'employee' : 'employees'}
          </EmployeeCount>
        </SectionHeader>

        {!hasEmployees ? (
          <EmptyState
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <EmptyIcon>👥</EmptyIcon>
            <EmptyTitle>No employees yet</EmptyTitle>
            <EmptyDescription>
              Generate an invite link to add your first employee. They'll be able to receive 
              order notifications directly in Telegram once they join.
            </EmptyDescription>
            <EmptyAction onClick={handleGenerateInvite} disabled={isGeneratingInvite}>
              Generate First Invite Link
            </EmptyAction>
          </EmptyState>
        ) : (
          <EmployeeGrid>
            <AnimatePresence>
              {employees.map((employee, index) => (
                <motion.div
                  key={employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <EmployeeCard employee={employee} />
                </motion.div>
              ))}
            </AnimatePresence>
          </EmployeeGrid>
        )}
      </EmployeesSection>

      {/* Statistics */}
      {hasEmployees && (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginTop: '2rem' 
        }}>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              {activeEmployees.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Active</div>
          </div>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
              {inactiveEmployees.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Inactive</div>
          </div>
          <div style={{ 
            padding: '1rem', 
            background: 'var(--surface)', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {employees.length}
            </div>
            <div style={{ color: 'var(--text-secondary)' }}>Total</div>
          </div>
        </div>
      )}

      <InviteLinkModal
        inviteLink={lastGeneratedInvite}
        isOpen={showInviteModal}
        onClose={handleCloseModal}
      />
    </PageContainer>
  );
};