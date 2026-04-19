import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { addFsrsCard } from '../../store/slices/vocabularySlice.js';
import { showNotification } from '../../store/slices/uiSlice.js';
import { createNewCard } from '../../services/fsrs.js';
import styles from './FilteredArabicLine.module.css';

/**
 * FilteredArabicLine
 *
 * Renders annotated Arabic dialogue from npcVocabFilter.
 * Known words render normally. Unknown words show a transliteration hint
 * and can be tapped/clicked to add to the FSRS learning queue.
 */
export default function FilteredArabicLine({ annotations, vocabAll, knownWordIds }) {
  const dispatch = useDispatch();

  // Build Arabic → wordId map for tap-to-learn lookups
  const arabicToWordId = useMemo(() => {
    const map = new Map();
    for (const w of (vocabAll || [])) {
      map.set(w.arabic, w.id);
      // Also map diacritic-stripped version for flexible matching
      map.set(w.arabic.replace(/[\u064B-\u0652\u0670]/g, ''), w.id);
    }
    return map;
  }, [vocabAll]);

  const handleAddToLearning = (arabicWord) => {
    const cleaned = arabicWord.replace(/[.,،!?؟:;۔]/g, '').trim();
    const stripped = cleaned.replace(/[\u064B-\u0652\u0670]/g, '');
    const wordId = arabicToWordId.get(cleaned) || arabicToWordId.get(stripped);
    if (!wordId) return;
    if (knownWordIds instanceof Set ? knownWordIds.has(wordId) : (knownWordIds || []).includes(wordId)) return;
    dispatch(addFsrsCard({ wordId, card: createNewCard(), source: 'npc_tap_to_learn' }));
    dispatch(showNotification({ message: 'Word added to your learning queue!', type: 'info' }));
  };

  if (!annotations || annotations.length === 0) return null;

  return (
    <span className={styles.filteredLine} dir="rtl">
      {annotations.map((ann, idx) => {
        if (ann.known) {
          return (
            <span key={idx} className={styles.knownWord}>
              {ann.arabic}{' '}
            </span>
          );
        }
        return (
          <button
            key={idx}
            className={styles.unknownWord}
            onClick={(e) => { e.stopPropagation(); handleAddToLearning(ann.arabic); }}
            title={ann.transliteration ? `${ann.transliteration} — tap to learn` : 'Tap to add to learning queue'}
            aria-label={`Unknown word: ${ann.arabic}${ann.transliteration ? `, pronunciation: ${ann.transliteration}` : ''}. Tap to add to learning queue.`}
          >
            {ann.arabic}
            {ann.transliteration && (
              <span className={styles.translitHint}>({ann.transliteration})</span>
            )}
          </button>
        );
      })}
    </span>
  );
}
