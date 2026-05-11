import { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { updateFsrsCard } from '../../store/slices/vocabularySlice.js';
import { incrementReviews } from '../../store/slices/achievementSlice.js';
import { addXP } from '../../store/slices/playerSlice.js';
import { reviewCard } from '../../services/fsrs.js';
import { XP_REWARDS } from '../../utils/xpCalculator.js';
import { audioManager } from '../../services/audio.js';
import vocabulary from '../../data/vocabularyAll.js';
import { shuffle } from '../../utils/shuffle.js';
import styles from './MicroReviewOverlay.module.css';

/**
 * MicroReviewOverlay — Compact 2-3 word review triggered on zone entry.
 * Shows one word at a time with 4 English multiple-choice options.
 * Props:
 *   wordIds  — array of 2-3 FSRS-due word IDs to review
 *   onClose  — callback when review completes or is skipped
 */
export default function MicroReviewOverlay({ wordIds, onClose }) {
  const dispatch = useDispatch();
  const fsrsCards = useSelector((s) => s.vocabulary.fsrsCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [_score, setScore] = useState(0);

  // Resolve word objects from IDs
  const words = wordIds
    .map((id) => vocabulary.find((w) => w.id === id))
    .filter(Boolean);

  const currentWord = words[currentIndex];

  // Generate 4 choices for the current word (1 correct + 3 distractors)
  const [choices, setChoices] = useState([]);
  useEffect(() => {
    if (!currentWord) return;
    const correct = currentWord.english;
    const pool = vocabulary.filter(
      (w) => w.english !== correct && w.category === currentWord.category
    );
    const distractors = shuffle(pool).slice(0, 3).map((w) => w.english);
    // Fallback if not enough same-category distractors
    while (distractors.length < 3) {
      const fallback = vocabulary[Math.floor(Math.random() * vocabulary.length)];
      if (fallback.english !== correct && !distractors.includes(fallback.english)) {
        distractors.push(fallback.english);
      }
    }
    setChoices(shuffle([correct, ...distractors]));
  }, [currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = useCallback(
    (answer) => {
      if (feedback) return;
      const correct = answer === currentWord.english;
      setFeedback({ correct, answer });
      audioManager.playSFX(correct ? 'correct' : 'wrong');

      if (correct) setScore((s) => s + 1);

      // Update FSRS card
      const card = fsrsCards[currentWord.id]?.card;
      if (card) {
        const rating = correct ? 3 : 1; // Good or Again
        const result = reviewCard(card, rating);
        dispatch(updateFsrsCard({ wordId: currentWord.id, card: result.card, log: result.log }));
      }
      dispatch(incrementReviews());
      if (correct) dispatch(addXP(XP_REWARDS.CORRECT_ANSWER));

      // Auto-advance after short delay
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 >= words.length) {
          onClose();
        } else {
          setCurrentIndex((i) => i + 1);
        }
      }, 800);
    },
    [feedback, currentWord, currentIndex, words.length, fsrsCards, dispatch, onClose]
  );

  const handleSkip = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!currentWord || words.length === 0) {
    onClose();
    return null;
  }

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.25 }}
    >
      <div className={styles.card}>
        <div className={styles.header}>
          <span>Quick Review</span>
          <span>
            {currentIndex + 1}/{words.length}
          </span>
          <button className={styles.skipBtn} onClick={handleSkip}>
            Skip
          </button>
        </div>

        <div className={styles.prompt} lang="ar" dir="rtl">
          {currentWord.arabic}
        </div>

        <div className={styles.choices}>
          {choices.map((choice) => {
            let cls = styles.choiceBtn;
            if (feedback) {
              if (choice === currentWord.english) cls += ' ' + styles.correct;
              else if (choice === feedback.answer && !feedback.correct)
                cls += ' ' + styles.wrong;
            }
            return (
              <button
                key={choice}
                className={cls}
                onClick={() => handleAnswer(choice)}
                disabled={!!feedback}
              >
                {choice}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
