import { useSelector } from 'react-redux';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import vocabulary from '../../data/vocabularyAll.js';
import styles from './DialogueOverlay.module.css';

/**
 * TeacherWordCard
 * The word teaching card shown during vocabulary lessons
 */
export default function TeacherWordCard({ wordId }) {
  const cards = useSelector((s) => s.vocabulary.fsrsCards);
  const formatArabic = useFormatArabic();

  const word = vocabulary.find((w) => w.id === wordId);
  if (!word) return null;

  const alreadyKnown = !!cards[wordId];

  return (
    <div className={styles.teachContainer}>
      <span className={styles.teachBadge}>
        {alreadyKnown ? 'Review' : 'New Word!'}
      </span>
      <div className={styles.wordCard}>
        <div className={styles.wordCardArabic}>{formatArabic(word.arabic)}</div>
        <div className={styles.wordCardEnglish}>{word.english}</div>
        <div className={styles.wordCardTranslit}>{word.transliteration}</div>
        {word.cefrLevel && (
          <div className={styles.cefrBadge} data-level={word.cefrLevel}>
            {word.cefrLevel}
          </div>
        )}
      </div>
    </div>
  );
}
