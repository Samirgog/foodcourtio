import { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

// Breakpoint hook
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setBreakpoint('sm');
        setIsMobile(true);
        setIsTablet(false);
        setIsDesktop(false);
      } else if (width < 768) {
        setBreakpoint('md');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else if (width < 1024) {
        setBreakpoint('lg');
        setIsMobile(false);
        setIsTablet(true);
        setIsDesktop(false);
      } else {
        setBreakpoint('xl');
        setIsMobile(false);
        setIsTablet(false);
        setIsDesktop(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { breakpoint, isMobile, isTablet, isDesktop };
};

// Screen size hook
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

// Responsive Grid Component
interface ResponsiveGridProps {
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid = styled.div<ResponsiveGridProps>`
  display: grid;
  gap: ${({ gap = '1rem' }) => gap};
  
  grid-template-columns: repeat(${({ columns }) => columns?.sm || 1}, 1fr);
  
  @media (min-width: 640px) {
    grid-template-columns: repeat(${({ columns }) => columns?.md || columns?.sm || 2}, 1fr);
  }
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(${({ columns }) => columns?.lg || columns?.md || 3}, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(${({ columns }) => columns?.xl || columns?.lg || 4}, 1fr);
  }
`;

// Responsive Container
export const ResponsiveContainer = styled.div<{
  maxWidth?: string;
  padding?: string;
}>`
  width: 100%;
  max-width: ${({ maxWidth = '1200px' }) => maxWidth};
  margin: 0 auto;
  padding: ${({ padding = '0 1rem' }) => padding};
  
  @media (min-width: 640px) {
    padding: ${({ padding = '0 1.5rem' }) => padding};
  }
  
  @media (min-width: 768px) {
    padding: ${({ padding = '0 2rem' }) => padding};
  }
  
  @media (min-width: 1024px) {
    padding: ${({ padding = '0 2.5rem' }) => padding};
  }
`;

// Responsive Flex
interface ResponsiveFlexProps {
  direction?: {
    sm?: 'row' | 'column';
    md?: 'row' | 'column';
    lg?: 'row' | 'column';
    xl?: 'row' | 'column';
  };
  gap?: string;
  align?: string;
  justify?: string;
}

export const ResponsiveFlex = styled.div<ResponsiveFlexProps>`
  display: flex;
  gap: ${({ gap = '1rem' }) => gap};
  align-items: ${({ align = 'stretch' }) => align};
  justify-content: ${({ justify = 'flex-start' }) => justify};
  
  flex-direction: ${({ direction }) => direction?.sm || 'column'};
  
  @media (min-width: 640px) {
    flex-direction: ${({ direction }) => direction?.md || direction?.sm || 'row'};
  }
  
  @media (min-width: 768px) {
    flex-direction: ${({ direction }) => direction?.lg || direction?.md || 'row'};
  }
  
  @media (min-width: 1024px) {
    flex-direction: ${({ direction }) => direction?.xl || direction?.lg || 'row'};
  }
`;

// Hide/Show on breakpoints
export const HideOn = styled.div<{
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
}>`
  ${({ breakpoint }) => {
    const breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    };
    
    return css`
      @media (max-width: ${breakpoints[breakpoint]}) {
        display: none;
      }
    `;
  }}
`;

export const ShowOn = styled.div<{
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
}>`
  display: none;
  
  ${({ breakpoint }) => {
    const breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    };
    
    return css`
      @media (min-width: ${breakpoints[breakpoint]}) {
        display: block;
      }
    `;
  }}
`;

// Responsive Text
export const ResponsiveText = styled.div<{
  size?: {
    sm?: string;
    md?: string;
    lg?: string;
    xl?: string;
  };
}>`
  font-size: ${({ size }) => size?.sm || '0.875rem'};
  
  @media (min-width: 640px) {
    font-size: ${({ size }) => size?.md || size?.sm || '1rem'};
  }
  
  @media (min-width: 768px) {
    font-size: ${({ size }) => size?.lg || size?.md || '1.125rem'};
  }
  
  @media (min-width: 1024px) {
    font-size: ${({ size }) => size?.xl || size?.lg || '1.25rem'};
  }
`;

// Mobile Navigation Hook
export const useMobileNavigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isMobile } = useBreakpoint();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when screen size changes to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile]);

  return {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
    isMobile
  };
};

// Touch gesture hook
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    return { isLeftSwipe, isRightSwipe, distance };
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

// Responsive spacing utility
export const getResponsiveSpacing = (base: string) => css`
  padding: calc(${base} * 0.5);
  
  @media (min-width: 640px) {
    padding: calc(${base} * 0.75);
  }
  
  @media (min-width: 768px) {
    padding: ${base};
  }
  
  @media (min-width: 1024px) {
    padding: calc(${base} * 1.25);
  }
`;

// Responsive font size utility
export const getResponsiveFontSize = (base: string) => css`
  font-size: calc(${base} * 0.875);
  
  @media (min-width: 640px) {
    font-size: calc(${base} * 0.9375);
  }
  
  @media (min-width: 768px) {
    font-size: ${base};
  }
  
  @media (min-width: 1024px) {
    font-size: calc(${base} * 1.125);
  }
`;