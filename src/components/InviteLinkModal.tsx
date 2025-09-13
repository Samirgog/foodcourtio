import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { InviteLink } from '../types';
import { useNotifications } from '../stores';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Modal = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: ${({ theme }) => theme.spacing.lg};
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Title = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const LinkSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const LinkContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LinkInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const CopyButton = styled.button<{ copied: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ copied, theme }) => 
    copied ? theme.colors.success : theme.colors.primary
  };
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  min-width: 100px;
  
  &:hover {
    background: ${({ copied, theme }) => 
      copied ? theme.colors.success : theme.colors.primaryHover
    };
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const InfoLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const Instructions = styled.div`
  background: ${({ theme }) => theme.colors.info}20;
  border: 1px solid ${({ theme }) => theme.colors.info}40;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const InstructionsTitle = styled.h3`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.info};
`;

const InstructionsList = styled.ol`
  margin: 0;
  padding-left: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  
  li {
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    line-height: 1.5;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  border: 2px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  ${({ variant, theme }) => {
    if (variant === 'primary') {
      return `
        background: ${theme.colors.primary};
        border-color: ${theme.colors.primary};
        color: white;
        
        &:hover {
          background: ${theme.colors.primaryHover};
          border-color: ${theme.colors.primaryHover};
        }
      `;
    } else {
      return `
        background: transparent;
        border-color: ${theme.colors.border};
        color: ${theme.colors.text};
        
        &:hover {
          background: ${theme.colors.backgroundSecondary};
          border-color: ${theme.colors.primary};
        }
      `;
    }
  }}
`;

interface InviteLinkModalProps {
  inviteLink: InviteLink | null;
  isOpen: boolean;
  onClose: () => void;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatTimeRemaining = (expiresAt: string) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diffInMs = expiry.getTime() - now.getTime();
  
  if (diffInMs <= 0) return 'Expired';
  
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

export const InviteLinkModal: React.FC<InviteLinkModalProps> = ({
  inviteLink,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleCopy = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink.url);
      setCopied(true);
      addNotification({
        type: 'success',
        title: 'Link Copied',
        message: 'Invite link has been copied to clipboard',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Copy Failed',
        message: 'Please try selecting and copying manually',
      });
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!inviteLink) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleOverlayClick}
        >
          <Modal
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
          >
            <CloseButton onClick={onClose}>
              ✕
            </CloseButton>

            <Header>
              <Title>Employee Invite Link</Title>
              <Subtitle>
                Share this link with your employees to invite them to your restaurant's notification system.
              </Subtitle>
            </Header>

            <LinkSection>
              <LinkContainer>
                <LinkInput
                  value={inviteLink.url}
                  readOnly
                  onFocus={(e) => e.target.select()}
                />
                <CopyButton
                  copied={copied}
                  onClick={handleCopy}
                >
                  {copied ? '✓ Copied' : 'Copy'}
                </CopyButton>
              </LinkContainer>
            </LinkSection>

            <InfoGrid>
              <InfoItem>
                <InfoLabel>Created</InfoLabel>
                <InfoValue>{formatDate(inviteLink.createdAt)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Expires</InfoLabel>
                <InfoValue>{formatTimeRemaining(inviteLink.expiresAt)}</InfoValue>
              </InfoItem>
            </InfoGrid>

            <Instructions>
              <InstructionsTitle>How to use this invite link:</InstructionsTitle>
              <InstructionsList>
                <li>Share this link with your employee via any messaging app</li>
                <li>They'll be redirected to the FoodCourt.io Telegram bot</li>
                <li>Once they start the bot, they'll automatically join your restaurant</li>
                <li>They'll start receiving order notifications immediately</li>
              </InstructionsList>
            </Instructions>

            <Actions>
              <ActionButton onClick={onClose}>
                Done
              </ActionButton>
            </Actions>
          </Modal>
        </Overlay>
      )}
    </AnimatePresence>
  );
};