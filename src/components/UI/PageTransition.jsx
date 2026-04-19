import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import styles from './PageTransition.module.css';

/**
 * PageTransition wrapper for route transitions
 * Provides smooth fade + slide animations when navigating between routes
 *
 * Usage:
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 */

// Check for reduced motion preference
function usePrefersReducedMotion() {
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

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const pageVariantsReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function PageTransition({ children }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const variants = prefersReducedMotion ? pageVariantsReduced : pageVariants;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={styles.wrapper}
    >
      {children}
    </motion.div>
  );
}
