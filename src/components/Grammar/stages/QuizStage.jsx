import { motion } from 'framer-motion';
import styles from './GrammarStages.module.css';

export default function QuizStage({
  lesson, currentIndex, score, answers,
  showFeedback, feedbackMessage,
  onAnswerSelect, onNext, onQuit,
}) {
  const quizItem = lesson.quiz[currentIndex];

  const feedbackClass = feedbackMessage.includes('Correct') ? styles.feedbackCorrect : styles.feedbackWrong;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.header}>
        <button onClick={onQuit} className={styles.pixelBtnDark}>Quit</button>
        <div className={styles.title}>
          Quiz {currentIndex + 1} / {lesson.quiz.length}
        </div>
        <div className={styles.scoreDisplay}>
          Score: {score}/{lesson.quiz.length}
        </div>
      </div>

      <div className={styles.body}>
        <div className={styles.promptCenter}>
          {quizItem.question}
        </div>

        <div className={styles.choicesWrap}>
          {quizItem.options.map((option, idx) => {
            let cls = styles.choiceBase;
            if (showFeedback) {
              if (idx === quizItem.correct) cls = styles.choiceCorrect;
              else if (option === answers[currentIndex]) cls = styles.choiceWrong;
            }
            return (
              <button key={idx} onClick={() => onAnswerSelect(option)} className={cls} disabled={showFeedback}>
                {idx + 1}. {option}
              </button>
            );
          })}
        </div>

        {showFeedback && (
          <>
            <div className={feedbackClass}>
              {feedbackMessage}
              {quizItem.explanation && (
                <div className={styles.quizExplanation}>{quizItem.explanation}</div>
              )}
            </div>
            <button onClick={onNext} className={styles.pixelBtnGoldMt}>
              {currentIndex < lesson.quiz.length - 1 ? 'Next' : 'Finish'}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}
