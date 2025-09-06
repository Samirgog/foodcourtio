import { css } from 'styled-components';

// Enhanced breakpoints for mobile-first design
export const breakpoints = {
  xs: '480px',     // Extra small devices (phones)
  sm: '640px',     // Small devices (phones)
  md: '768px',     // Medium devices (tablets)
  lg: '1024px',    // Large devices (desktops)
  xl: '1280px',    // Extra large devices
  xxl: '1536px',   // 2X large devices
};

// Media query helpers
export const media = {
  xs: `@media (min-width: ${breakpoints.xs})`,
  sm: `@media (min-width: ${breakpoints.sm})`,
  md: `@media (min-width: ${breakpoints.md})`,
  lg: `@media (min-width: ${breakpoints.lg})`,
  xl: `@media (min-width: ${breakpoints.xl})`,
  xxl: `@media (min-width: ${breakpoints.xxl})`,
  
  // Max-width queries
  maxXs: `@media (max-width: ${breakpoints.xs})`,
  maxSm: `@media (max-width: ${breakpoints.sm})`,
  maxMd: `@media (max-width: ${breakpoints.md})`,
  maxLg: `@media (max-width: ${breakpoints.lg})`,
  maxXl: `@media (max-width: ${breakpoints.xl})`,
};

// Responsive spacing system
export const responsiveSpacing = {
  xs: {
    mobile: '0.125rem',   // 2px
    tablet: '0.25rem',    // 4px
    desktop: '0.25rem',   // 4px
  },
  sm: {
    mobile: '0.25rem',    // 4px
    tablet: '0.5rem',     // 8px
    desktop: '0.5rem',    // 8px
  },
  md: {
    mobile: '0.5rem',     // 8px
    tablet: '0.75rem',    // 12px
    desktop: '1rem',      // 16px
  },
  lg: {
    mobile: '0.75rem',    // 12px
    tablet: '1rem',       // 16px
    desktop: '1.5rem',    // 24px
  },
  xl: {
    mobile: '1rem',       // 16px
    tablet: '1.5rem',     // 24px
    desktop: '2rem',      // 32px
  },
  xxl: {
    mobile: '1.5rem',     // 24px
    tablet: '2rem',       // 32px
    desktop: '3rem',      // 48px
  },
  xxxl: {
    mobile: '2rem',       // 32px
    tablet: '3rem',       // 48px
    desktop: '4rem',      // 64px
  },
};

// Responsive font sizes
export const responsiveFontSizes = {
  xs: {
    mobile: '0.625rem',   // 10px
    tablet: '0.75rem',    // 12px
    desktop: '0.75rem',   // 12px
  },
  sm: {
    mobile: '0.75rem',    // 12px
    tablet: '0.875rem',   // 14px
    desktop: '0.875rem',  // 14px
  },
  md: {
    mobile: '0.875rem',   // 14px
    tablet: '1rem',       // 16px
    desktop: '1rem',      // 16px
  },
  lg: {
    mobile: '1rem',       // 16px
    tablet: '1.125rem',   // 18px
    desktop: '1.125rem',  // 18px
  },
  xl: {
    mobile: '1.125rem',   // 18px
    tablet: '1.25rem',    // 20px
    desktop: '1.25rem',   // 20px
  },
  xxl: {
    mobile: '1.25rem',    // 20px
    tablet: '1.5rem',     // 24px
    desktop: '1.5rem',    // 24px
  },
  xxxl: {
    mobile: '1.5rem',     // 24px
    tablet: '2rem',       // 32px
    desktop: '2rem',      // 32px
  },
};

// Responsive container widths
export const containerWidths = {
  sm: '100%',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  xxl: '1536px',
};

// Responsive grid system
export const getResponsiveGrid = (columns: {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}) => css`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(${columns.xs || 1}, 1fr);
  
  ${media.sm} {
    grid-template-columns: repeat(${columns.sm || columns.xs || 2}, 1fr);
  }
  
  ${media.md} {
    grid-template-columns: repeat(${columns.md || columns.sm || 3}, 1fr);
  }
  
  ${media.lg} {
    grid-template-columns: repeat(${columns.lg || columns.md || 4}, 1fr);
  }
  
  ${media.xl} {
    grid-template-columns: repeat(${columns.xl || columns.lg || 4}, 1fr);
  }
`;

// Responsive padding utility
export const getResponsivePadding = (size: keyof typeof responsiveSpacing) => css`
  padding: ${responsiveSpacing[size].mobile};
  
  ${media.sm} {
    padding: ${responsiveSpacing[size].tablet};
  }
  
  ${media.lg} {
    padding: ${responsiveSpacing[size].desktop};
  }
`;

// Responsive margin utility
export const getResponsiveMargin = (size: keyof typeof responsiveSpacing) => css`
  margin: ${responsiveSpacing[size].mobile};
  
  ${media.sm} {
    margin: ${responsiveSpacing[size].tablet};
  }
  
  ${media.lg} {
    margin: ${responsiveSpacing[size].desktop};
  }
`;

// Responsive font size utility
export const getResponsiveFontSize = (size: keyof typeof responsiveFontSizes) => css`
  font-size: ${responsiveFontSizes[size].mobile};
  
  ${media.sm} {
    font-size: ${responsiveFontSizes[size].tablet};
  }
  
  ${media.lg} {
    font-size: ${responsiveFontSizes[size].desktop};
  }
`;

// Mobile-first container
export const responsiveContainer = css`
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
  
  ${media.sm} {
    padding: 0 1.5rem;
    max-width: ${containerWidths.sm};
  }
  
  ${media.md} {
    padding: 0 2rem;
    max-width: ${containerWidths.md};
  }
  
  ${media.lg} {
    padding: 0 2.5rem;
    max-width: ${containerWidths.lg};
  }
  
  ${media.xl} {
    padding: 0 3rem;
    max-width: ${containerWidths.xl};
  }
  
  ${media.xxl} {
    max-width: ${containerWidths.xxl};
  }
`;

// Responsive flex utility
export const responsiveFlex = (direction: {
  mobile?: 'row' | 'column';
  tablet?: 'row' | 'column';
  desktop?: 'row' | 'column';
}) => css`
  display: flex;
  flex-direction: ${direction.mobile || 'column'};
  
  ${media.sm} {
    flex-direction: ${direction.tablet || direction.mobile || 'row'};
  }
  
  ${media.lg} {
    flex-direction: ${direction.desktop || direction.tablet || 'row'};
  }
`;

// Responsive visibility utilities
export const hideOnMobile = css`
  ${media.maxSm} {
    display: none;
  }
`;

export const hideOnTablet = css`
  ${media.maxMd} {
    display: none;
  }
`;

export const hideOnDesktop = css`
  ${media.lg} {
    display: none;
  }
`;

export const showOnMobile = css`
  display: block;
  
  ${media.sm} {
    display: none;
  }
`;

export const showOnTablet = css`
  display: none;
  
  ${media.sm} {
    display: block;
  }
  
  ${media.lg} {
    display: none;
  }
`;

export const showOnDesktop = css`
  display: none;
  
  ${media.lg} {
    display: block;
  }
`;

// Touch-friendly button sizes
export const touchTarget = css`
  min-height: 44px;
  min-width: 44px;
  
  ${media.lg} {
    min-height: 36px;
    min-width: 36px;
  }
`;

// Responsive z-index scale
export const zIndex = {
  dropdown: 1000,
  overlay: 1010,
  modal: 1020,
  notification: 1030,
  tooltip: 1040,
};