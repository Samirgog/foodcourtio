import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 }
};

export const slideInRight: Variants = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
};

// Animation wrapper components
interface AnimatedProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export const FadeInUp: React.FC<AnimatedProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.5,
  className 
}) => (
  <motion.div
    className={className}
    variants={fadeInUp}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

export const FadeIn: React.FC<AnimatedProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.3,
  className 
}) => (
  <motion.div
    className={className}
    variants={fadeIn}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay }}
  >
    {children}
  </motion.div>
);

export const SlideInLeft: React.FC<AnimatedProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.4,
  className 
}) => (
  <motion.div
    className={className}
    variants={slideInLeft}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const SlideInRight: React.FC<AnimatedProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.4,
  className 
}) => (
  <motion.div
    className={className}
    variants={slideInRight}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

export const ScaleIn: React.FC<AnimatedProps> = ({ 
  children, 
  delay = 0, 
  duration = 0.3,
  className 
}) => (
  <motion.div
    className={className}
    variants={scaleIn}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration, delay, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

interface StaggerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerProps> = ({ 
  children, 
  className,
  staggerDelay = 0.1
}) => (
  <motion.div
    className={className}
    variants={staggerContainer}
    initial="initial"
    animate="animate"
    transition={{ staggerChildren: staggerDelay }}
  >
    {children}
  </motion.div>
);

export const StaggerItem: React.FC<AnimatedProps> = ({ 
  children, 
  duration = 0.5,
  className 
}) => (
  <motion.div
    className={className}
    variants={staggerItem}
    transition={{ duration, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// Modal animation wrapper
interface ModalAnimationProps {
  children: React.ReactNode;
  isOpen: boolean;
}

export const ModalAnimation: React.FC<ModalAnimationProps> = ({ children, isOpen }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Button hover animation
export const ButtonHover = motion.button;

export const buttonHoverVariants: Variants = {
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.98,
    transition: { duration: 0.1 }
  }
};

// Card hover animation
export const CardHover = motion.div;

export const cardHoverVariants: Variants = {
  hover: { 
    y: -4,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: { duration: 0.3 }
  }
};

// Loading spinner animation
export const LoadingSpinner: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <motion.div
    style={{
      width: size,
      height: size,
      border: '3px solid #f3f3f3',
      borderTop: '3px solid #3498db',
      borderRadius: '50%',
    }}
    animate={{ rotate: 360 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }}
  />
);