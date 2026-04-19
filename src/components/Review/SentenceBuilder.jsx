import { useState, useEffect, useCallback, memo } from 'react';
import { validateSentence } from '../../utils/sentenceParser.js';
import styles from './SentenceBuilder.module.css';

function SentenceBuilder({
  quizData,
  onComplete,
  disabled = false,
}) {
  const [userAnswer, setUserAnswer] = useState([]);
  const [availableWords, setAvailableWords] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (quizData && quizData.allWords) {
      setAvailableWords([...quizData.allWords]);
      setUserAnswer([]);
      setIsSubmitted(false);
      setIsCorrect(false);
      setAttempts(0);
    }
  }, [quizData]);

  const handleTileClick = useCallback((word, isInAnswer) => {
    if (disabled || isSubmitted) return;

    if (isInAnswer) {
      setUserAnswer(prev => prev.filter(w => w !== word));
      setAvailableWords(prev => [...prev, word]);
    } else {
      setUserAnswer(prev => [...prev, word]);
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  }, [disabled, isSubmitted]);

  const handleSubmit = useCallback(() => {
    if (disabled || isSubmitted || userAnswer.length === 0) return;

    const correct = validateSentence(userAnswer, quizData.correctWords);
    setIsCorrect(correct);
    setIsSubmitted(true);
    setAttempts(prev => prev + 1);

    if (onComplete) {
      onComplete({
        correct,
        attempts: attempts + 1,
        userAnswer,
        correctAnswer: quizData.correctWords,
      });
    }
  }, [disabled, isSubmitted, userAnswer, quizData, onComplete, attempts]);

  const handleReset = useCallback(() => {
    if (disabled || !isSubmitted || isCorrect) return;

    setAvailableWords([...quizData.allWords]);
    setUserAnswer([]);
    setIsSubmitted(false);
  }, [disabled, isSubmitted, isCorrect, quizData]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (disabled) return;

      if (e.key === 'Enter' && !isSubmitted) {
        handleSubmit();
      } else if (e.key === 'Backspace' && !isSubmitted && userAnswer.length > 0) {
        e.preventDefault();
        const lastWord = userAnswer[userAnswer.length - 1];
        handleTileClick(lastWord, true);
      } else if (e.key === 'Escape' && isSubmitted && !isCorrect) {
        handleReset();
      } else if (e.key >= '1' && e.key <= '9' && !isSubmitted) {
        const index = parseInt(e.key) - 1;
        if (index < availableWords.length) {
          handleTileClick(availableWords[index], false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [disabled, isSubmitted, isCorrect, userAnswer, availableWords, handleSubmit, handleTileClick, handleReset]);

  if (!quizData) {
    return (
      <div className={styles.container}>
        <div className={styles.englishPrompt}>No sentence data available</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* English prompt */}
      <div className={styles.englishPrompt}>
        {quizData.englishSentence}
      </div>

      {/* Target word hint */}
      <div className={styles.targetWordHint}>
        Build the Arabic sentence using:{' '}
        <span className={styles.targetWordHighlight}>
          {quizData.targetWordEnglish}
        </span>
      </div>

      {/* Answer area */}
      <div
        className={`${styles.answerArea} ${isSubmitted && isCorrect ? styles.answerAreaCorrect : ''} ${isSubmitted && !isCorrect ? styles.answerAreaWrong : ''}`}
      >
        {userAnswer.length === 0 ? (
          <div className={styles.emptyHint}>Tap words below to build the sentence</div>
        ) : (
          userAnswer.map((word, index) => (
            <button
              key={`answer-${index}`}
              className={`${styles.wordTile} ${styles.wordTileInAnswer} ${isSubmitted ? styles.wordTileDisabled : ''}`}
              onClick={() => handleTileClick(word, true)}
              disabled={isSubmitted}
            >
              {word}
            </button>
          ))
        )}
      </div>

      {/* Divider */}
      <div className={styles.divider} />

      {/* Available word tiles */}
      <div className={styles.tilesArea}>
        {availableWords.map((word, index) => (
          <button
            key={`tile-${index}`}
            className={`${styles.wordTile} ${isSubmitted ? styles.wordTileDisabled : ''}`}
            onClick={() => handleTileClick(word, false)}
            disabled={isSubmitted}
          >
            {word}
          </button>
        ))}
      </div>

      {/* Feedback area */}
      {isSubmitted && (
        <div className={styles.feedbackArea}>
          {isCorrect ? (
            <>
              <div className={styles.correctSentence}>
                {quizData.correctWords.join(' ')}
              </div>
              {quizData.transliteration && (
                <div className={styles.transliterationText}>
                  {quizData.transliteration}
                </div>
              )}
            </>
          ) : (
            <>
              <div className={styles.correctSentence}>
                Correct: {quizData.correctWords.join(' ')}
              </div>
              {quizData.transliteration && (
                <div className={styles.transliterationText}>
                  {quizData.transliteration}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Instructions */}
      {!isSubmitted && (
        <div className={styles.instructionsText}>
          Keyboard: 1-9 to select tiles | Backspace to undo | Enter to submit
        </div>
      )}
    </div>
  );
}

// Memoize to prevent re-renders when parent re-renders
export default memo(SentenceBuilder);
