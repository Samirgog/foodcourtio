import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../../stores';
import { useBreakpoint } from '../../hooks/useResponsive';
import { Sidebar } from './Sidebar';
import { TopToolbar } from './TopToolbar';
import { Notifications } from './Notifications';
import { ContextMenu } from './ContextMenu';

const LayoutContainer = styled.div<{ sidebarOpen: boolean; sidebarCollapsed: boolean }>`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  transition: ${({ theme }) => theme.transitions.normal};
`;

const SidebarContainer = styled(motion.div)<{ isOpen: boolean; isCollapsed: boolean; isMobile: boolean }>`
  position: ${({ isMobile }) => (isMobile ? 'fixed' : 'relative')};
  top: 0;
  left: 0;
  height: 100vh;
  z-index: 1000;
  
  ${({ isMobile }) => isMobile && `
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  `}
`;

const MainContainer = styled.main<{ sidebarOpen: boolean; sidebarCollapsed: boolean; isMobile: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  margin-left: 0;
  transition: margin-left ${({ theme }) => theme.transitions.normal};
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

const Overlay = styled(motion.div)<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { sidebarOpen, sidebarCollapsed, setSidebarOpen } = useUIStore();
  const { isMobile, isTablet } = useBreakpoint();

  const handleOverlayClick = () => {
    if (isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <LayoutContainer sidebarOpen={sidebarOpen} sidebarCollapsed={sidebarCollapsed}>
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <SidebarContainer 
            isOpen={sidebarOpen} 
            isCollapsed={sidebarCollapsed}
            isMobile={isMobile}
            initial={isMobile ? { x: '-100%' } : false}
            animate={{ x: 0 }}
            exit={isMobile ? { x: '-100%' } : {}}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.3
            }}
          >
            <Sidebar />
          </SidebarContainer>
        )}
      </AnimatePresence>

      <MainContainer 
        sidebarOpen={sidebarOpen} 
        sidebarCollapsed={sidebarCollapsed}
        isMobile={isMobile}
      >
        <TopToolbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ContentArea>
            {children}
          </ContentArea>
        </motion.div>
      </MainContainer>

      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <Overlay 
            show={true}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Global components */}
      <Notifications />
      <ContextMenu />
    </LayoutContainer>
  );
};