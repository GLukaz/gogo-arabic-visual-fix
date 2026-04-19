/**
 * CompanionCommentBubble.jsx — Floating speech bubble for companion contextual comments
 *
 * Listens to COMPANION_CONTEXTUAL_COMMENT events via EventBus.
 * Displays Arabic or English comments with transliteration based on player CEFR.
 * Auto-dismisses after 5 seconds. Supports queuing (max 2).
 */

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { COMPANIONS } from '../../data/companions.js';
import styles from './CompanionCommentBubble.module.css';

export default function CompanionCommentBubble() {
  const [currentComment, setCurrentComment] = useState(null);
  const [queue, setQueue] = useState([]);

  const vocabularyRatio = useSelector((state) => state.vocabulary.learnedRatio) || 0;

  // Listen to comment events
  useEffect(() => {
    const handleComment = (data) => {
      // data: { companionId, primary, secondary, transliteration, isArabic }
      const companion = COMPANIONS[data.companionId];
      if (!companion) return;

      const commentData = {
        ...data,
        companionName: companion.name,
        companionColor: companion.colorPalette.primary,
        showTransliteration: vocabularyRatio < 0.7, // Show transliteration if below B2
      };

      // If no current comment, show immediately
      if (!currentComment) {
        setCurrentComment(commentData);
      } else {
        // Add to queue (max 2 items)
        setQueue((prev) => {
          const newQueue = [...prev, commentData];
          return newQueue.slice(-2); // Keep last 2
        });
      }
    };

    EventBus.on(EVENTS.COMPANION_CONTEXTUAL_COMMENT, handleComment);
    return () => EventBus.off(EVENTS.COMPANION_CONTEXTUAL_COMMENT, handleComment);
  }, [currentComment, vocabularyRatio]);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!currentComment) return;

    const timer = setTimeout(() => {
      // Check if there's something in queue
      if (queue.length > 0) {
        const [next, ...rest] = queue;
        setCurrentComment(next);
        setQueue(rest);
      } else {
        setCurrentComment(null);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [currentComment, queue]);

  // Click to dismiss early
  const handleDismiss = () => {
    if (queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrentComment(next);
      setQueue(rest);
    } else {
      setCurrentComment(null);
    }
  };

  if (!currentComment) return null;

  const isArabic = currentComment.isArabic;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 120, damping: 15 }}
        onClick={handleDismiss}
        className={styles.bubble}
        style={{ '--companion-color': currentComment.companionColor }}
      >
        {/* Speech bubble tail */}
        <div
          className={styles.bubbleTail}
        />

        {/* Companion name */}
        <div
          className={styles.companionName}
        >
          {currentComment.companionName}
        </div>

        {/* Primary text */}
        <div
          className={`${styles.primaryText} ${currentComment.secondary ? styles.primaryTextWithSecondary : ''} ${isArabic ? styles.rtl : styles.ltr}`}
        >
          {currentComment.primary}
        </div>

        {/* Secondary text */}
        {currentComment.secondary && (
          <div
            className={`${styles.secondaryText} ${isArabic ? styles.ltr : styles.rtl}`}
          >
            {currentComment.secondary}
          </div>
        )}

        {/* Transliteration */}
        {currentComment.showTransliteration && currentComment.transliteration && (
          <div className={styles.transliteration}>
            {currentComment.transliteration}
          </div>
        )}

        {/* Queue indicator */}
        {queue.length > 0 && (
          <div
            className={styles.queueBadge}
          >
            {queue.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
