import { useEffect, useState } from 'react';
import { useAnimation } from 'framer-motion';

// Hook for page load animations
export const usePageAnimation = () => {
  const controls = useAnimation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const animateIn = async () => {
      await controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
      });
      setIsLoaded(true);
    };

    animateIn();
  }, [controls]);

  return { controls, isLoaded };
};

// Hook for stagger animations
export const useStaggerAnimation = (itemCount: number, delay: number = 0.1) => {
  const controls = useAnimation();

  useEffect(() => {
    const animateItems = async () => {
      await controls.start((i) => ({
        opacity: 1,
        y: 0,
        transition: {
          delay: i * delay,
          duration: 0.5,
          ease: "easeOut"
        }
      }));
    };

    animateItems();
  }, [controls, itemCount, delay]);

  return controls;
};

// Hook for scroll-triggered animations
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const [elementRef, setElementRef] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!elementRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(elementRef);
        }
      },
      { threshold }
    );

    observer.observe(elementRef);

    return () => {
      if (elementRef) {
        observer.unobserve(elementRef);
      }
    };
  }, [elementRef, threshold]);

  return { isVisible, ref: setElementRef };
};

// Hook for hover animations
export const useHoverAnimation = () => {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
  };

  return { isHovered, hoverProps };
};

// Hook for loading states with animation
export const useLoadingAnimation = (isLoading: boolean) => {
  const controls = useAnimation();

  useEffect(() => {
    if (isLoading) {
      controls.start({
        opacity: 0.7,
        scale: 0.98,
        transition: { duration: 0.2 }
      });
    } else {
      controls.start({
        opacity: 1,
        scale: 1,
        transition: { duration: 0.2 }
      });
    }
  }, [isLoading, controls]);

  return controls;
};

// Hook for form field animations
export const useFormFieldAnimation = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fieldProps = {
    onFocus: () => setIsFocused(true),
    onBlur: () => setIsFocused(false),
  };

  const getAnimationProps = () => ({
    animate: {
      borderColor: hasError ? '#e74c3c' : isFocused ? '#3498db' : '#e1e5e9',
      scale: isFocused ? 1.02 : 1,
    },
    transition: { duration: 0.2 }
  });

  return { 
    fieldProps, 
    getAnimationProps, 
    setHasError,
    isFocused,
    hasError
  };
};

// Hook for card animations
export const useCardAnimation = () => {
  const controls = useAnimation();
  const [isHovered, setIsHovered] = useState(false);

  const cardProps = {
    onMouseEnter: () => {
      setIsHovered(true);
      controls.start({
        y: -6,
        boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
        transition: { duration: 0.3, ease: "easeOut" }
      });
    },
    onMouseLeave: () => {
      setIsHovered(false);
      controls.start({
        y: 0,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        transition: { duration: 0.3, ease: "easeOut" }
      });
    }
  };

  return { controls, cardProps, isHovered };
};

// Hook for button press animations
export const useButtonAnimation = () => {
  const controls = useAnimation();

  const buttonProps = {
    onMouseDown: () => {
      controls.start({
        scale: 0.95,
        transition: { duration: 0.1 }
      });
    },
    onMouseUp: () => {
      controls.start({
        scale: 1,
        transition: { duration: 0.1 }
      });
    },
    onMouseLeave: () => {
      controls.start({
        scale: 1,
        transition: { duration: 0.1 }
      });
    }
  };

  return { controls, buttonProps };
};