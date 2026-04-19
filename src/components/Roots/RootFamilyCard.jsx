import { useMemo } from 'react';
import styles from './RootFamilyCard.module.css';
import { getRootFamily } from '../../services/rootFamilyService.js';

/**
 * RootFamilyCard — Shown during vocabulary teaching moments.
 *
 * Displays the Arabic root letters and related words from the same root family.
 * Example: "Root: ك ت ب → كَاتِب (writer), مَكْتَبَة (library), مَكْتُوب (written)"
 *
 * @param {{ wordId: string, arabic: string, rootLetters: string|null }} props
 */
export default function RootFamilyCard({ wordId, arabic, rootLetters }) {
  const family = useMemo(
    () => getRootFamily(wordId, arabic, rootLetters),
    [wordId, arabic, rootLetters]
  );

  if (!family || family.familyWords.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.rootHeader}>
        <span className={styles.rootLabel}>Root</span>
        <span className={styles.rootLetters} dir="rtl">
          {family.root}
        </span>
      </div>
      {family.rootMeaning && (
        <p className={styles.rootMeaning}>{family.rootMeaning}</p>
      )}
      <div className={styles.familyList}>
        <span className={styles.familyLabel}>Word Family:</span>
        {family.familyWords.map((w, i) => (
          <span key={i} className={styles.familyWord} dir="rtl">
            {w.arabic}
          </span>
        ))}
      </div>
    </div>
  );
}
