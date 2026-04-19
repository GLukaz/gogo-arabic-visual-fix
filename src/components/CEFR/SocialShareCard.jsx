import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { selectCefrLevel } from '../../store/slices/cefrProgressSlice.js';
import { selectPlayerStats } from '../../store/slices/playerSlice.js';
import { selectLearnedWordCount } from '../../store/slices/vocabularySlice.js';
import { showNotification } from '../../store/slices/uiSlice.js';
import { buildShareText, handleShare } from './shareUtils.js';
import styles from './SocialShareCard.module.css';
import PropTypes from 'prop-types';

/**
 * SocialShareCard — SVG-only shareable Arabic learning milestone card.
 *
 * Reads CEFR level, words learned, and player level from Redux.
 * Share button uses Web Share API on supported browsers; falls back to clipboard.writeText.
 * No external image requests — purely SVG with inline text elements.
 *
 * @param {{ onClose: () => void }} props
 */
function SocialShareCard({ onClose }) {
  const dispatch = useDispatch();
  const currentLevel = useSelector(selectCefrLevel);
  const { level: playerLevel } = useSelector(selectPlayerStats);
  const wordsLearned = useSelector(selectLearnedWordCount);

  const shareText = buildShareText({ currentLevel, wordsLearned, playerLevel });

  const onShare = async () => {
    await handleShare(shareText, dispatch, showNotification);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const panelVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 12 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15 } },
  };

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Share your Arabic learning progress"
    >
      <motion.div
        className={styles.panel}
        variants={panelVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        role="document"
      >
        <svg
          viewBox="0 0 400 240"
          className={styles.cardSvg}
          xmlns="http://www.w3.org/2000/svg"
          aria-label={`CEFR ${currentLevel} milestone card`}
        >
          {/* Background gradient */}
          <defs>
            <linearGradient id="cardBg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1a1a2e" />
              <stop offset="100%" stopColor="#16213e" />
            </linearGradient>
          </defs>
          <rect width="400" height="240" rx="16" fill="url(#cardBg)" />

          {/* Gold border */}
          <rect x="4" y="4" width="392" height="232" rx="14" fill="none" stroke="#e2b659" strokeWidth="2" />

          {/* Arabic decorative text */}
          <text x="200" y="40" textAnchor="middle" fill="#e2b659" fontSize="20" fontWeight="bold" fontFamily="serif">
            عربي
          </text>

          {/* Title */}
          <text x="200" y="70" textAnchor="middle" fill="#ffffff" fontSize="16" fontWeight="bold">
            Gogo Arabic
          </text>

          {/* CEFR Level */}
          <text x="200" y="110" textAnchor="middle" fill="#e2b659" fontSize="36" fontWeight="bold">
            {currentLevel || '?'}
          </text>
          <text x="200" y="130" textAnchor="middle" fill="#c8c8c8" fontSize="11">
            CEFR Level Achieved
          </text>

          {/* Stats row */}
          <text x="120" y="170" textAnchor="middle" fill="#ffffff" fontSize="14">
            {wordsLearned}
          </text>
          <text x="120" y="186" textAnchor="middle" fill="#888" fontSize="10">
            words learned
          </text>
          <text x="280" y="170" textAnchor="middle" fill="#ffffff" fontSize="14">
            Level {playerLevel}
          </text>
          <text x="280" y="186" textAnchor="middle" fill="#888" fontSize="10">
            player level
          </text>

          {/* Divider line */}
          <line x1="200" y1="155" x2="200" y2="195" stroke="#3a373b" strokeWidth="1" />

          {/* Footer */}
          <text x="200" y="220" textAnchor="middle" fill="#666" fontSize="9">
            gogo-arabic.com
          </text>
        </svg>

        <div className={styles.actions}>
          <button
            className={styles.shareBtn}
            onClick={onShare}
            type="button"
            aria-label="Share your Arabic learning milestone"
          >
            Share
          </button>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            type="button"
            aria-label="Close share card"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}

SocialShareCard.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SocialShareCard;
