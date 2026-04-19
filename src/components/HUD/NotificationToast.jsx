import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { clearNotification } from '../../store/slices/uiSlice.js';
import { COLORS } from '../../styles/theme.js';
import styles from './NotificationToast.module.css';

/**
 * Notification type color mapping
 * - xp: gold highlight for XP gains
 * - dirhams: gold for currency gains
 * - quest: green for quest progress/completion
 * - word: blue for new words learned
 * - level-up: special gradient for level-up celebrations
 * - warning: orange/amber for storage quota warnings and system alerts
 */
const TYPE_STYLES = {
  xp: {
    background: COLORS.brown,
    border: `3px solid ${COLORS.xpGold}`,
    color: COLORS.xpGold,
    icon: '+XP',
  },
  dirhams: {
    background: COLORS.brown,
    border: `3px solid ${COLORS.xpGold}`,
    color: COLORS.xpGold,
    icon: 'D',
  },
  quest: {
    background: '#0d2b1a',
    border: `3px solid ${COLORS.green}`,
    color: COLORS.green,
    icon: '!',
  },
  word: {
    background: '#0d1b2b',
    border: `3px solid ${COLORS.blue}`,
    color: COLORS.blue,
    icon: 'Aa',
  },
  'level-up': {
    background: `linear-gradient(135deg, ${COLORS.brown} 0%, #3d1a00 50%, ${COLORS.brown} 100%)`,
    border: `3px solid ${COLORS.xpGold}`,
    color: COLORS.xpGold,
    icon: 'LV',
    isLevelUp: true,
  },
  warning: {
    background: '#2b1a0d',
    border: '3px solid #ff9800',
    color: '#ff9800',
    icon: '!',
  },
};

const DISMISS_DELAY = 3000; // 3 seconds before auto-dismiss

export default function NotificationToast() {
  const dispatch = useDispatch();
  const notification = useSelector((s) => s.ui.notification);
  const timerRef = useRef(null);

  // Handle notification lifecycle
  useEffect(() => {
    // Clear any existing timers when notification changes
    if (timerRef.current) clearTimeout(timerRef.current);

    if (notification) {
      // Auto-dismiss after delay
      timerRef.current = setTimeout(() => {
        dispatch(clearNotification());
      }, DISMISS_DELAY);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [notification, dispatch]);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const toastVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -8 },
  };

  const toastVariantsReduced = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const transition = reduceMotion
    ? { duration: 0.2 }
    : { duration: 0.3, ease: 'easeOut' };

  if (!notification) return null;

  const { message, type } = notification;
  const typeStyle = TYPE_STYLES[type] || TYPE_STYLES.xp;

  // Dynamic inline styles for type-specific colors and backgrounds
  const toastInlineStyle = {
    background: typeStyle.isLevelUp ? undefined : typeStyle.background,
    backgroundImage: typeStyle.isLevelUp ? typeStyle.background : undefined,
    border: typeStyle.border,
    color: typeStyle.color,
  };

  return (
    <div className={styles.wrapper}>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${type}-${message}`}
          className={styles.toast}
          style={toastInlineStyle}
          variants={reduceMotion ? toastVariantsReduced : toastVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          {/* Type icon badge */}
          <span className={styles.iconBadge} style={{ color: typeStyle.color }}>
            {typeStyle.icon}
          </span>

          {/* Message text */}
          <span className={`${styles.message} ${typeStyle.isLevelUp ? styles.levelUpGlow : ''}`}>
            {message}
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
