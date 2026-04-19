import { useEffect, useState } from 'react';

/**
 * Hook to detect user's prefers-reduced-motion setting
 * Returns true if user prefers reduced motion
 *
 * Usage:
 * const prefersReducedMotion = useReducedMotion();
 * const transition = prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 };
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

/**
 * Returns animation props for motion components based on reduced motion preference
 * Returns empty object if reduced motion is preferred, otherwise returns whileHover/whileTap props
 *
 * Usage:
 * const buttonProps = useMotionProps();
 * <motion.button {...buttonProps}>Click me</motion.button>
 */
export function useMotionProps(
  hoverScale = 1.05,
  tapScale = 0.95
) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {};
  }

  return {
    whileHover: { scale: hoverScale },
    whileTap: { scale: tapScale },
  };
}
