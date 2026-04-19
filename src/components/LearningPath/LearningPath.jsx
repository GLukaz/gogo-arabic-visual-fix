import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGameNavigation } from '../../hooks/useGameNavigation.js';
import { selectCompletedGroups } from '../../store/slices/alphabetSlice.js';
import { selectLearnedWordCount, selectReviewQueueCount } from '../../store/slices/vocabularySlice.js';
import { selectGrammarProgress } from '../../store/slices/grammarSlice.js';
import styles from './LearningPath.module.css';

/**
 * LearningPath - Visual progression menu showing alphabet -> vocabulary -> grammar path
 *
 * Features:
 * - 3-stage vertical progression with connecting lines
 * - Real progress data from Redux for each learning domain
 * - "Start Here" badge for new players on alphabet stage
 * - Soft-lock indicators for stages that recommend prerequisites
 * - Navigation to each learning module
 *
 * @param {Object} props
 * @param {Function} props.onBack - Navigate back callback
 */
export default function LearningPath({ onBack }) {
  const { goToAlphabet, goToReview, goToGrammar } = useGameNavigation();

  // Redux state
  const completedGroups = useSelector(selectCompletedGroups);
  const learnedWordCount = useSelector(selectLearnedWordCount);
  const reviewQueueCount = useSelector(selectReviewQueueCount);
  const grammarProgress = useSelector(selectGrammarProgress);

  const completedGroupCount = completedGroups.length;

  // Compute progress percentages
  const alphabetPercentage = useMemo(() => {
    // 7 groups total (28 letters / 4 per group)
    return Math.round((completedGroupCount / 7) * 100);
  }, [completedGroupCount]);

  const vocabPercentage = useMemo(() => {
    return Math.round((learnedWordCount / 1220) * 100);
  }, [learnedWordCount]);

  // Animation settings
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.15 : 0.4, ease: 'easeOut' },
    },
  };

  const buttonProps = reduceMotion
    ? {}
    : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={styles.content}>
        {/* Header */}
        <motion.div className={styles.header} variants={itemVariants}>
          <motion.button
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Go back"
            {...buttonProps}
          >
            &larr;
          </motion.button>
          <h1 className={styles.title}>Learning Path</h1>
        </motion.div>

        {/* Stage 1: Alphabet */}
        <motion.div className={styles.stage} variants={itemVariants}>
          {completedGroupCount === 0 && (
            <span className={`${styles.startHere} ${reduceMotion ? styles.noAnimation : ''}`}>
              Start Here
            </span>
          )}
          <div className={styles.stageTop}>
            <span className={styles.stageIcon} aria-hidden="true">
              {'ا'}
            </span>
            <div className={styles.stageTitleGroup}>
              <span className={styles.stageNumber}>Stage 1</span>
              <h2 className={styles.stageTitle}>Alphabet</h2>
            </div>
          </div>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarFill} ${alphabetPercentage >= 100 ? styles.progressBarComplete : ''}`}
              style={{ width: `${Math.min(alphabetPercentage, 100)}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {completedGroupCount}/7 groups completed ({completedGroupCount * 4}/28 letters)
          </p>
          <motion.button
            className={styles.stageBtn}
            onClick={goToAlphabet}
            {...buttonProps}
          >
            Learn Letters
          </motion.button>
        </motion.div>

        {/* Connector 1-2 */}
        <div className={styles.stageConnector} aria-hidden="true" />

        {/* Stage 2: Vocabulary */}
        <motion.div
          className={`${styles.stage} ${completedGroupCount < 2 ? styles.softLock : ''}`}
          variants={itemVariants}
        >
          <div className={styles.stageTop}>
            <span className={styles.stageIcon} aria-hidden="true">
              {'ك'}
            </span>
            <div className={styles.stageTitleGroup}>
              <span className={styles.stageNumber}>Stage 2</span>
              <h2 className={styles.stageTitle}>Vocabulary</h2>
            </div>
            {reviewQueueCount > 0 && (
              <span className={styles.reviewBadge}>{reviewQueueCount}</span>
            )}
          </div>
          {completedGroupCount < 2 && (
            <p className={styles.softLockText}>
              <span className={styles.lockIcon} aria-hidden="true">{'🔒'}</span>
              Complete 2 letter groups first
            </p>
          )}
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarFill} ${vocabPercentage >= 100 ? styles.progressBarComplete : ''}`}
              style={{ width: `${Math.min(vocabPercentage, 100)}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {learnedWordCount}/1220 words learned
          </p>
          <motion.button
            className={styles.stageBtn}
            onClick={goToReview}
            {...buttonProps}
          >
            Review Words
          </motion.button>
        </motion.div>

        {/* Connector 2-3 */}
        <div className={styles.stageConnector} aria-hidden="true" />

        {/* Stage 3: Grammar */}
        <motion.div
          className={`${styles.stage} ${completedGroupCount < 4 ? styles.softLock : ''}`}
          variants={itemVariants}
        >
          <div className={styles.stageTop}>
            <span className={styles.stageIcon} aria-hidden="true">
              {'ق'}
            </span>
            <div className={styles.stageTitleGroup}>
              <span className={styles.stageNumber}>Stage 3</span>
              <h2 className={styles.stageTitle}>Grammar</h2>
            </div>
          </div>
          {completedGroupCount < 4 && (
            <p className={styles.softLockText}>
              <span className={styles.lockIcon} aria-hidden="true">{'🔒'}</span>
              Complete 4 letter groups first
            </p>
          )}
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressBarFill} ${grammarProgress >= 100 ? styles.progressBarComplete : ''}`}
              style={{ width: `${Math.min(grammarProgress, 100)}%` }}
            />
          </div>
          <p className={styles.progressText}>
            {grammarProgress}% completed
          </p>
          <motion.button
            className={styles.stageBtn}
            onClick={goToGrammar}
            {...buttonProps}
          >
            Study Grammar
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
