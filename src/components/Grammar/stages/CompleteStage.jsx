import { motion } from 'framer-motion';
import styles from './GrammarStages.module.css';

const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  PERFECT_LESSON: 100,
};

export default function CompleteStage({ lesson, exerciseScore, quizScore, onBack }) {
  const totalQuestions = lesson.exercises.length + lesson.quiz.length;
  const totalCorrect = exerciseScore + quizScore;
  const percentage = Math.round((totalCorrect / totalQuestions) * 100);
  const isPerfect = totalCorrect === totalQuestions;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.header}>
        <div className={styles.spacer} />
        <div className={styles.title}>Lesson Complete!</div>
        <div className={styles.spacer} />
      </div>

      <div className={styles.bodyCenter}>
        <div className={styles.completeEmoji}>
          {isPerfect ? '🏆' : percentage >= 80 ? '⭐' : percentage >= 60 ? '👍' : '📖'}
        </div>

        <div className={styles.completeHeading}>
          {isPerfect ? 'Perfect Score!' : percentage >= 80 ? 'Great Job!' : percentage >= 60 ? 'Good Effort!' : 'Keep Practicing!'}
        </div>

        <div className={styles.completeScore}>
          Score: {totalCorrect} / {totalQuestions} ({percentage}%)
        </div>

        <div className={styles.completeXp}>
          +{isPerfect ? XP_REWARDS.PERFECT_LESSON : XP_REWARDS.LESSON_COMPLETE} XP
        </div>

        <button onClick={onBack} className={styles.pixelBtnGoldSmall}>
          Back to Grammar
        </button>
      </div>
    </motion.div>
  );
}
