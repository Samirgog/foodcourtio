import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/theme';

interface ContextMenuItem {
  label: string;
  icon?: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'primary';
  disabled?: boolean;
}

interface ContextMenuProps {
  items: ContextMenuItem[];
  x: number;
  y: number;
  show: boolean;
  onClose: () => void;
}

const ContextMenuContainer = styled.div<{ x: number; y: number; show: boolean }>`
  position: fixed;
  top: ${({ y }) => y}px;
  left: ${({ x }) => x}px;
  z-index: 10000;
  display: ${({ show }) => show ? 'block' : 'none'};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 180px;
  padding: ${({ theme }) => theme.spacing.xs};
  animation: ${({ show }) => show ? 'contextMenuFadeIn 0.15s ease-out' : 'none'};
  
  @keyframes contextMenuFadeIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-4px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const ContextMenuItem = styled.button<{ variant?: 'default' | 'danger' | 'primary' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background: transparent;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'danger':
        return theme.colors.error;
      case 'primary':
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  }};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: left;
  
  &:hover:not(:disabled) {
    background: ${({ variant, theme }) => {
      switch (variant) {
        case 'danger':
          return theme.colors.error + '10';
        case 'primary':
          return theme.colors.primary + '10';
        default:
          return theme.colors.backgroundSecondary;
      }
    }};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .icon {
    font-size: 1rem;
    width: 16px;
    text-align: center;
  }
`;

const ContextMenuSeparator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

export const ContextMenu: React.FC<ContextMenuProps> = ({
  items,
  x,
  y,
  show,
  onClose
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [adjustedPosition, setAdjustedPosition] = useState({ x, y });

  useEffect(() => {
    if (show && menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      let newX = x;
      let newY = y;
      
      // Adjust horizontal position if menu would overflow
      if (x + menuRect.width > windowWidth) {
        newX = windowWidth - menuRect.width - 10;
      }
      
      // Adjust vertical position if menu would overflow
      if (y + menuRect.height > windowHeight) {
        newY = windowHeight - menuRect.height - 10;
      }
      
      // Ensure menu doesn't go off the left edge
      if (newX < 10) {
        newX = 10;
      }
      
      // Ensure menu doesn't go off the top edge
      if (newY < 10) {
        newY = 10;
      }
      
      setAdjustedPosition({ x: newX, y: newY });
    }
  }, [show, x, y]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [show, onClose]);

  const handleItemClick = (item: ContextMenuItem) => {
    if (!item.disabled) {
      item.onClick();
      onClose();
    }
  };

  return (
    <ContextMenuContainer
      ref={menuRef}
      x={adjustedPosition.x}
      y={adjustedPosition.y}
      show={show}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.label === 'separator' ? (
            <ContextMenuSeparator />
          ) : (
            <ContextMenuItem
              variant={item.variant}
              disabled={item.disabled}
              onClick={() => handleItemClick(item)}
            >
              {item.icon && <span className="icon">{item.icon}</span>}
              {item.label}
            </ContextMenuItem>
          )}
        </React.Fragment>
      ))}
    </ContextMenuContainer>
  );
};

// Hook for managing context menu state
export const useContextMenu = () => {
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    items: ContextMenuItem[];
  }>({
    show: false,
    x: 0,
    y: 0,
    items: []
  });

  const showContextMenu = (
    event: React.MouseEvent,
    items: ContextMenuItem[]
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenu({
      show: true,
      x: event.clientX,
      y: event.clientY,
      items
    });
  };

  const hideContextMenu = () => {
    setContextMenu(prev => ({ ...prev, show: false }));
  };

  return {
    contextMenu,
    showContextMenu,
    hideContextMenu
  };
};