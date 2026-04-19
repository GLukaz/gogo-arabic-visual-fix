import { motion } from 'framer-motion';
import styles from './GrammarStages.module.css';

export default function RulesStage({ lesson, onBack, onNext }) {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <button onClick={onBack} className={styles.pixelBtnDark}>Back</button>
        <div className={styles.title}>Key Rules</div>
        <div className={styles.spacer} />
      </div>

      <div className={styles.body}>
        <div className={styles.sectionTitle}>Remember these rules:</div>

        {lesson.rules.map((rule, idx) => (
          <div key={idx} className={styles.exampleBox}>
            <div className={styles.ruleText}>
              {rule.rule}
            </div>
            <div className={styles.ruleExample}>
              Example: {rule.example}
            </div>
          </div>
        ))}

        <button onClick={onNext} className={styles.pixelBtnGoldMt}>Start Exercises</button>
      </div>
    </motion.div>
  );
}
