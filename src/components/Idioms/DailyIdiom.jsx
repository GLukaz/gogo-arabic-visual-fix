/**
 * DailyIdiom — Idiom-of-the-day widget with deterministic daily selection.
 * Phase 94 (IDIOM-04): Same date = same idiom for all players.
 */

import { useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setDailyIdiom,
  learnIdiom,
  toggleFavorite,
  selectDailyIdiomId,
  selectLastDailyDate,
  selectIdiomIsLearned,
  selectIdiomIsFavorite,
} from '../../store/slices/idiomSlice.js';
import { ARABIC_IDIOMS, getIdiomById } from '../../data/arabicIdioms.js';
import { getDailyIdiomId } from '../../utils/idiomHelpers.js';
import styles from './DailyIdiom.module.css';

export default function DailyIdiom({ size = 'medium', showExample = true, onClick }) {
  const dispatch = useDispatch();
  const dailyIdiomId = useSelector(selectDailyIdiomId);
  const lastDailyDate = useSelector(selectLastDailyDate);

  // Set daily idiom on mount if date changed
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (lastDailyDate !== today) {
      const id = getDailyIdiomId(today, ARABIC_IDIOMS);
      dispatch(setDailyIdiom({ idiomId: id, date: today }));
    }
  }, [lastDailyDate, dispatch]);

  const dailyIdiom = useMemo(
    () => (dailyIdiomId ? getIdiomById(dailyIdiomId) : null),
    [dailyIdiomId]
  );

  // These selectors need the actual ID, guard with fallback
  const effectiveId = dailyIdiomId || '__none__';
  const isLearned = useSelector(selectIdiomIsLearned(effectiveId));
  const isFavorite = useSelector(selectIdiomIsFavorite(effectiveId));

  if (!dailyIdiom) {
    return (
      <div className={`${styles.card} ${styles[size]}`} data-testid="daily-idiom-card">
        <div className={styles.loading}>Loading daily idiom...</div>
      </div>
    );
  }

  // ── Small Card ──
  if (size === 'small') {
    return (
      <div
        className={`${styles.card} ${styles.small}`}
        data-testid="daily-idiom-card"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClick?.();
        }}
      >
        <div className={styles.smallArabic} dir="rtl">
          {dailyIdiom.arabic}
        </div>
        <div className={styles.smallMeaning}>{dailyIdiom.meaning}</div>
      </div>
    );
  }

  // ── Large Card ──
  if (size === 'large') {
    return (
      <div className={`${styles.card} ${styles.large}`} data-testid="daily-idiom-card">
        <div className={styles.cardLabel}>Idiom of the Day</div>
        <div className={styles.arabicText} dir="rtl">
          {dailyIdiom.arabic}
        </div>
        <div className={styles.transliteration}>{dailyIdiom.transliteration}</div>
        <div className={styles.literalText}>{dailyIdiom.literal}</div>
        <div className={styles.meaningText}>{dailyIdiom.meaning}</div>
        <div className={styles.equivalentText}>
          English: {dailyIdiom.englishEquivalent}
        </div>

        {showExample && (
          <div className={styles.usageBlock}>
            <div className={styles.usageArabic} dir="rtl">
              {dailyIdiom.usageExample.arabic}
            </div>
            <div className={styles.usageEnglish}>
              {dailyIdiom.usageExample.english}
            </div>
          </div>
        )}

        {dailyIdiom.origin && (
          <div className={styles.origin}>Origin: {dailyIdiom.origin}</div>
        )}
        {dailyIdiom.funFact && (
          <div className={styles.funFact}>{dailyIdiom.funFact}</div>
        )}

        <div className={styles.largeActions}>
          <button
            className={isLearned ? styles.learnedBtn : styles.learnBtn}
            onClick={() => dispatch(learnIdiom(dailyIdiomId))}
          >
            {isLearned ? 'Learned' : 'Learn'}
          </button>
          <button
            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
            onClick={() => dispatch(toggleFavorite(dailyIdiomId))}
          >
            {isFavorite ? '\u2665' : '\u2661'}
          </button>
          {onClick && (
            <button className={styles.learnMoreBtn} onClick={onClick}>
              Learn More
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── Medium Card (default) ──
  return (
    <div className={`${styles.card} ${styles.medium}`} data-testid="daily-idiom-card">
      <div className={styles.cardLabel}>Idiom of the Day</div>
      <div className={styles.arabicText} dir="rtl">
        {dailyIdiom.arabic}
      </div>
      <div className={styles.literalText}>{dailyIdiom.literal}</div>
      <div className={styles.meaningText}>{dailyIdiom.meaning}</div>

      {showExample && (
        <div className={styles.usageBlock}>
          <div className={styles.usageArabic} dir="rtl">
            {dailyIdiom.usageExample.arabic}
          </div>
          <div className={styles.usageEnglish}>
            {dailyIdiom.usageExample.english}
          </div>
        </div>
      )}

      {onClick && (
        <button className={styles.learnMoreBtn} onClick={onClick}>
          Learn More
        </button>
      )}
    </div>
  );
}
