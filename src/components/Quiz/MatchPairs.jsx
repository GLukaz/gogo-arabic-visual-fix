import { useState, useCallback } from 'react';
import { shuffle } from '../../utils/shuffle.js';
import { useFormatArabic } from '../../hooks/useFormatArabic.js';
import styles from './MatchPairs.module.css';

export default function MatchPairs({ words, onComplete }) {
  const formatArabic = useFormatArabic();
  const [arabicOrder] = useState(() => shuffle(words));
  const [englishOrder] = useState(() => shuffle(words));
  const [selectedArabic, setSelectedArabic] = useState(null);
  const [selectedEnglish, setSelectedEnglish] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [wrongPair, setWrongPair] = useState(null);
  const [errors, setErrors] = useState(0);

  const checkMatch = useCallback((arId, enId) => {
    if (arId === enId) {
      const newMatched = new Set(matched);
      newMatched.add(arId);
      setMatched(newMatched);
      setSelectedArabic(null);
      setSelectedEnglish(null);
      if (newMatched.size === words.length) { setTimeout(() => onComplete(errors === 0), 500); }
    } else {
      setErrors((e) => e + 1);
      setWrongPair({ arabic: arId, english: enId });
      setTimeout(() => { setWrongPair(null); setSelectedArabic(null); setSelectedEnglish(null); }, 800);
    }
  }, [matched, words.length, errors, onComplete]);

  const handleArabicClick = (wordId) => {
    if (matched.has(wordId) || wrongPair) return;
    setSelectedArabic(wordId);
    if (selectedEnglish !== null) { checkMatch(wordId, selectedEnglish); }
  };

  const handleEnglishClick = (wordId) => {
    if (matched.has(wordId) || wrongPair) return;
    setSelectedEnglish(wordId);
    if (selectedArabic !== null) { checkMatch(selectedArabic, wordId); }
  };

  const getArabicCls = (wordId) => {
    const base = `${styles.card} ${styles.cardArabic}`;
    if (matched.has(wordId)) return `${base} ${styles.cardMatched}`;
    if (wrongPair?.arabic === wordId) return `${base} ${styles.cardWrong}`;
    if (selectedArabic === wordId) return `${base} ${styles.cardSelected}`;
    return base;
  };

  const getEnglishCls = (wordId) => {
    const base = `${styles.card} ${styles.cardEnglish}`;
    if (matched.has(wordId)) return `${base} ${styles.cardMatched}`;
    if (wrongPair?.english === wordId) return `${base} ${styles.cardWrong}`;
    if (selectedEnglish === wordId) return `${base} ${styles.cardSelected}`;
    return base;
  };

  return (
    <div role="group" aria-label="Match pairs: connect Arabic words to English meanings">
      <div className={styles.instruction} id="match-instruction">Match the Arabic words to their English meanings:</div>
      <div className={styles.grid} role="group" aria-describedby="match-instruction">
        <div className={styles.column} role="group" aria-label="Arabic words">
          <div className={styles.columnHeader}>Arabic</div>
          {arabicOrder.map((w) => (
            <button key={`ar-${w.id}`} className={getArabicCls(w.id)} onClick={() => handleArabicClick(w.id)} disabled={matched.has(w.id) || !!wrongPair} aria-label={`Arabic: ${w.transliteration || w.arabic}${matched.has(w.id) ? ' (matched)' : ''}${selectedArabic === w.id ? ' (selected)' : ''}`}>{formatArabic(w.arabic)}</button>
          ))}
        </div>
        <div className={styles.column} role="group" aria-label="English words">
          <div className={styles.columnHeader}>English</div>
          {englishOrder.map((w) => (
            <button key={`en-${w.id}`} className={getEnglishCls(w.id)} onClick={() => handleEnglishClick(w.id)} disabled={matched.has(w.id) || !!wrongPair} aria-label={`English: ${w.english}${matched.has(w.id) ? ' (matched)' : ''}${selectedEnglish === w.id ? ' (selected)' : ''}`}>{w.english}</button>
          ))}
        </div>
      </div>
      <div className={styles.resultRow} aria-live="polite">{matched.size}/{words.length} matched</div>
    </div>
  );
}
