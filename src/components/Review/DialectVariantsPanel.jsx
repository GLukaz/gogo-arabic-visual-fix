/**
 * DialectVariantsPanel.jsx — WIRE-010
 * Shows MSA vs Egyptian vs Levantine vs Gulf variants for a vocabulary word.
 * MSA is marked as the default study dialect.
 */
import { useMemo } from 'react';
import { selectDialectVariants } from '../../store/slices/vocabularySlice.js';
import styles from './DialectVariantsPanel.module.css';

const DIALECTS = [
  { key: 'msa', label: 'MSA', isDefault: true },
  { key: 'egyptian', label: 'Egyptian' },
  { key: 'levantine', label: 'Levantine' },
  { key: 'gulf', label: 'Gulf' },
];

export default function DialectVariantsPanel({ wordId }) {
  const variants = useMemo(() => selectDialectVariants(wordId), [wordId]);

  if (!variants) return null;

  return (
    <div className={styles.panel} aria-label="Dialect variants">
      <div className={styles.title}>Dialect Variants</div>
      <div className={styles.grid}>
        {DIALECTS.map(({ key, label, isDefault }) => {
          const form = variants[key];
          if (!form) return null;
          return (
            <div
              key={key}
              className={`${styles.dialectItem} ${isDefault ? styles.dialectDefault : ''}`}
              aria-label={`${label}${isDefault ? ' (your dialect)' : ''}`}
            >
              <div className={styles.dialectLabel}>
                {label}
                {isDefault && <span className={styles.defaultBadge}>★</span>}
              </div>
              <div className={styles.dialectArabic} lang="ar">{form.arabic}</div>
              <div className={styles.dialectTranslit}>{form.transliteration}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
