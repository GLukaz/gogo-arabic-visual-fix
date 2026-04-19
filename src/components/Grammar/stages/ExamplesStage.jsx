import { motion } from 'framer-motion';
import styles from './GrammarStages.module.css';

export default function ExamplesStage({ lesson, formatArabic, onBack, onNext }) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <button onClick={onBack} className={styles.pixelBtnDark}>Back</button>
        <div className={styles.title}>Examples</div>
        <div className={styles.spacer} />
      </div>

      <div className={styles.body}>
        <div className={styles.sectionTitle}>Study these examples:</div>

        {lesson.examples.map((example, idx) => (
          <div key={idx} className={styles.exampleBox}>
            <div className={styles.exampleArabic}>
              {formatArabic(example.arabic)}
            </div>
            <div className={styles.exampleEnglish}>
              {example.english}
            </div>
            <div className={styles.exampleTranslit}>
              {example.transliteration}
            </div>
            <div className={styles.exampleBreakdown}>
              {example.breakdown}
            </div>
          </div>
        ))}

        <button onClick={onNext} className={styles.pixelBtnGoldMt}>Continue to Rules</button>
      </div>
    </motion.div>
  );
}
