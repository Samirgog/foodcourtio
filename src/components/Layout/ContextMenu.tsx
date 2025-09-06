import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useContextMenu } from '../../stores';
import { useClickOutside } from '../../hooks';

const ContextMenuContainer = styled.div<{ x: number; y: number; visible: boolean }>`
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  z-index: 10001;
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.spacing.xs};
  min-width: 180px;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: ${({ visible }) => (visible ? 'scale(1)' : 'scale(0.95)')};
  transition: opacity 0.15s ease-out, transform 0.15s ease-out;
  pointer-events: ${({ visible }) => (visible ? 'auto' : 'none')};
`;

const ContextMenuItem = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: transparent;
  color: ${({ danger, theme }) => 
    danger ? theme.colors.error : theme.colors.text};
  text-align: left;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ danger, theme }) => 
      danger ? theme.colors.error : theme.colors.surfaceHover};
    color: ${({ danger, theme }) => 
      danger ? 'white' : theme.colors.text};
  }

  .icon {
    font-size: ${({ theme }) => theme.fontSizes.md};
    width: 16px;
    text-align: center;
  }

  .label {
    flex: 1;
  }

  .shortcut {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    margin-left: auto;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

export const ContextMenu: React.FC = () => {
  const { contextMenu, closeContextMenu } = useContextMenu();
  const ref = useClickOutside(closeContextMenu);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeContextMenu();
      }
    };

    if (contextMenu?.isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [contextMenu?.isOpen, closeContextMenu]);

  useEffect(() => {
    const handleScroll = () => {
      if (contextMenu?.isOpen) {
        closeContextMenu();
      }
    };

    if (contextMenu?.isOpen) {
      document.addEventListener('scroll', handleScroll, true);
      return () => document.removeEventListener('scroll', handleScroll, true);
    }
  }, [contextMenu?.isOpen, closeContextMenu]);

  // Position adjustment to keep menu within viewport
  const getAdjustedPosition = () => {
    if (!contextMenu) return { x: 0, y: 0 };

    const { x, y } = contextMenu;
    const menuWidth = 180;
    const menuHeight = contextMenu.items.length * 36 + 16; // Approximate height
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let adjustedX = x;
    let adjustedY = y;
    
    // Adjust X position if menu would overflow right
    if (x + menuWidth > viewportWidth) {
      adjustedX = viewportWidth - menuWidth - 10;
    }
    
    // Adjust Y position if menu would overflow bottom
    if (y + menuHeight > viewportHeight) {
      adjustedY = viewportHeight - menuHeight - 10;
    }
    
    // Ensure menu doesn't go off-screen to the left or top
    adjustedX = Math.max(10, adjustedX);
    adjustedY = Math.max(10, adjustedY);
    
    return { x: adjustedX, y: adjustedY };
  };

  if (!contextMenu) return null;

  const { x, y } = getAdjustedPosition();

  const handleItemClick = (action: () => void) => {
    action();
    closeContextMenu();
  };

  return (
    <ContextMenuContainer
      ref={ref}
      x={x}
      y={y}
      visible={contextMenu.isOpen}
    >
      {contextMenu.items.map((item, index) => {
        // Handle dividers
        if (item.label === '---') {
          return <Divider key={index} />;
        }

        return (
          <ContextMenuItem
            key={index}
            danger={item.danger}
            onClick={() => handleItemClick(item.action)}
          >
            {item.icon && <span className="icon">{item.icon}</span>}
            <span className="label">{item.label}</span>
          </ContextMenuItem>
        );
      })}
    </ContextMenuContainer>
  );
};