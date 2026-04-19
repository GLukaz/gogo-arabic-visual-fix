/**
 * PostBattleReview.jsx — Detailed Arabic usage analytics after each battle.
 *
 * Shows per-word accuracy, grammar combos attempted, status effects encountered,
 * and a "Practice Weak Words" CTA that emits EVENTS.REVIEW_SESSION_OPEN.
 *
 * All numbers displayed in Arabic-Indic numerals. RTL direction throughout.
 * Amiri font for Arabic text.
 */

import { useMemo } from 'react';
import { EventBus } from '../../utils/eventBus.js';
import { EVENTS } from '../../utils/eventBusTypes.js';
import { getStatusEffect, COMPOUND_EFFECTS } from '../../data/statusEffects.js';
import styles from './PostBattleReview.module.css';

/* ─── Arabic numeral conversion ─── */

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/**
 * Convert a number to Arabic-Indic numeral string.
 * @param {number|string} num
 * @returns {string}
 */
function toArabicNumerals(num) {
  return String(num)
    .split('')
    .map((ch) => (ch >= '0' && ch <= '9' ? ARABIC_DIGITS[parseInt(ch, 10)] : ch))
    .join('');
}

/**
 * Format milliseconds into Arabic numeral MM:SS string.
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return toArabicNumerals(`${pad(minutes)}:${pad(seconds)}`);
}

/** Grammar combo type labels in Arabic */
const COMBO_TYPE_LABELS = {
  noun_adj: 'إضافة',
  verb_chain: 'تصريف',
  sentence: 'جملة',
};

/**
 * Get accuracy badge CSS class based on percentage.
 */
function getAccuracyClass(accuracy) {
  if (accuracy >= 80) return styles.accuracyGreen;
  if (accuracy >= 50) return styles.accuracyYellow;
  return styles.accuracyRed;
}

/**
 * Look up effect data from STATUS_EFFECTS or COMPOUND_EFFECTS.
 */
function lookupEffectData(effectId) {
  const statusEffect = getStatusEffect(effectId);
  if (statusEffect) return statusEffect;
  const compound = COMPOUND_EFFECTS[effectId];
  if (compound) {
    return {
      arabic: compound.arabic,
      english: compound.english,
    };
  }
  return null;
}

/**
 * Aggregate arabicUsedThisBattle entries by word.
 * Returns sorted array: weakest accuracy first.
 */
function aggregateVocabulary(arabicUsed) {
  const wordMap = {};

  for (const entry of arabicUsed) {
    const key = entry.word;
    if (!wordMap[key]) {
      wordMap[key] = {
        word: key,
        totalAccuracy: 0,
        count: 0,
        comboType: entry.comboType,
      };
    }
    wordMap[key].totalAccuracy += entry.accuracy;
    wordMap[key].count += 1;
  }

  return Object.values(wordMap)
    .map((w) => ({
      ...w,
      avgAccuracy: Math.round(w.totalAccuracy / w.count),
    }))
    .sort((a, b) => a.avgAccuracy - b.avgAccuracy);
}

/**
 * Extract grammar combo entries from arabicUsedThisBattle.
 */
function extractCombos(arabicUsed) {
  return arabicUsed.filter((entry) => entry.comboType != null);
}

/**
 * PostBattleReview — Full-screen overlay with detailed Arabic usage analytics.
 *
 * @param {Object} props
 * @param {Object} props.battleData — Data from the completed battle
 * @param {Array} props.battleData.arabicUsedThisBattle — [{word, accuracy, timestamp, comboType?}]
 * @param {number} props.battleData.maxStreak — Highest streak this battle
 * @param {number} props.battleData.timeElapsed — Battle duration in ms
 * @param {Array} props.battleData.playerEffects — Status effects that were on the player
 * @param {Array} props.battleData.enemyEffects — Status effects that were on the enemy
 * @param {Array} [props.battleData.grammarCombos] — [{type, input, success, multiplier, correctAnswer?}]
 * @param {Function} props.onClose — Callback when user closes the review
 */
export default function PostBattleReview({ battleData, onClose }) {
  const {
    arabicUsedThisBattle = [],
    maxStreak = 0,
    timeElapsed = 0,
    playerEffects = [],
    enemyEffects = [],
    grammarCombos = [],
  } = battleData || {};

  // Aggregate vocabulary by word, sorted weakest first
  const vocabEntries = useMemo(
    () => aggregateVocabulary(arabicUsedThisBattle),
    [arabicUsedThisBattle]
  );

  // Extract combo attempts from the arabic used data (fallback if grammarCombos not provided)
  const comboEntries = useMemo(
    () => grammarCombos.length > 0 ? grammarCombos : extractCombos(arabicUsedThisBattle),
    [grammarCombos, arabicUsedThisBattle]
  );

  // Overall stats
  const totalWords = arabicUsedThisBattle.length;
  const overallAccuracy = totalWords > 0
    ? Math.round(arabicUsedThisBattle.reduce((sum, e) => sum + e.accuracy, 0) / totalWords)
    : 0;
  const totalEffects = playerEffects.length + enemyEffects.length;

  // Weak words (accuracy < 80%)
  const weakWords = vocabEntries.filter((v) => v.avgAccuracy < 80);
  const hasWeakWords = weakWords.length > 0;

  /** Open vocabulary review session for weak words */
  function handlePracticeWeakWords() {
    const weakWordIds = weakWords.map((w) => w.word);
    EventBus.emit(EVENTS.REVIEW_SESSION_OPEN, { wordIds: weakWordIds });
  }

  return (
    <div className={styles.reviewScreen} role="dialog" aria-label="Post-Battle Arabic Review">
      <div className={styles.reviewPanel}>
        {/* Close button */}
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close review"
        >
          X
        </button>

        {/* Title */}
        <h2 className={styles.reviewTitle} lang="ar">
          مراجعة المعركة
        </h2>

        {/* ── Section 1: Overall Stats ── */}
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <span className={styles.statValue} lang="ar">
              {toArabicNumerals(totalWords)}
            </span>
            <span className={styles.statLabel}>Words Used</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue} lang="ar">
              {toArabicNumerals(overallAccuracy)}%
            </span>
            <span className={styles.statLabel}>Accuracy</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue} lang="ar">
              {formatDuration(timeElapsed)}
            </span>
            <span className={styles.statLabel}>Duration</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue} lang="ar">
              {toArabicNumerals(maxStreak)}
            </span>
            <span className={styles.statLabel}>Max Streak</span>
          </div>
          <div className={styles.statBox}>
            <span className={styles.statValue} lang="ar">
              {toArabicNumerals(totalEffects)}
            </span>
            <span className={styles.statLabel}>Effects Applied</span>
          </div>
        </div>

        {/* ── Section 2: Vocabulary Table ── */}
        <h3 className={styles.sectionTitle} lang="ar">الكلمات المستخدمة</h3>
        {vocabEntries.length > 0 ? (
          <table className={styles.vocabTable}>
            <thead>
              <tr>
                <th>Arabic</th>
                <th>Accuracy</th>
                <th>Times</th>
              </tr>
            </thead>
            <tbody>
              {vocabEntries.map((entry, idx) => (
                <tr key={`${entry.word}-${idx}`}>
                  <td>
                    <span className={styles.arabicWord} lang="ar">
                      {entry.word}
                    </span>
                    {entry.avgAccuracy < 80 && (
                      <span className={styles.reviewTag}>Review</span>
                    )}
                  </td>
                  <td>
                    <span className={`${styles.accuracyBadge} ${getAccuracyClass(entry.avgAccuracy)}`}>
                      {toArabicNumerals(entry.avgAccuracy)}%
                    </span>
                  </td>
                  <td>
                    <span className={styles.timesUsed} lang="ar">
                      {toArabicNumerals(entry.count)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.emptyState}>No Arabic words used this battle.</p>
        )}

        {/* ── Section 3: Grammar Combos ── */}
        {comboEntries.length > 0 && (
          <>
            <h3 className={styles.sectionTitle} lang="ar">تركيبات نحوية</h3>
            <div className={styles.comboSection}>
              {comboEntries.map((combo, idx) => {
                const type = combo.comboType || combo.type;
                const isSuccess = combo.success !== false && combo.accuracy >= 80;
                return (
                  <div key={`combo-${idx}`} className={styles.comboItem}>
                    <span className={styles.comboType} lang="ar">
                      {COMBO_TYPE_LABELS[type] || type || '—'}
                    </span>
                    <span className={styles.comboInput} lang="ar">
                      {combo.input || combo.word || ''}
                    </span>
                    <span className={isSuccess ? styles.comboResultSuccess : styles.comboResultFail}>
                      {isSuccess ? 'SUCCESS' : 'FAIL'}
                    </span>
                    {combo.multiplier && (
                      <span className={styles.comboMultiplier} lang="ar">
                        x{toArabicNumerals(combo.multiplier)}
                      </span>
                    )}
                    {!isSuccess && combo.correctAnswer && (
                      <div className={styles.comboCorrection} lang="ar">
                        {combo.correctAnswer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Section 4: Status Effects Encountered ── */}
        {(playerEffects.length > 0 || enemyEffects.length > 0) && (
          <>
            <h3 className={styles.sectionTitle} lang="ar">التأثيرات</h3>
            <div className={styles.effectSection}>
              {playerEffects.map((effect, idx) => {
                const data = lookupEffectData(effect.id);
                if (!data) return null;
                return (
                  <div key={`pe-${idx}`} className={styles.effectItem}>
                    <span className={styles.effectArabic} lang="ar">
                      {data.arabic}
                    </span>
                    <span className={styles.effectEnglish}>
                      {data.english}
                    </span>
                    <span className={styles.effectTarget}>Player</span>
                    <span className={styles.effectTurns} lang="ar">
                      {toArabicNumerals(effect.remainingTurns || 0)}
                    </span>
                  </div>
                );
              })}
              {enemyEffects.map((effect, idx) => {
                const data = lookupEffectData(effect.id);
                if (!data) return null;
                return (
                  <div key={`ee-${idx}`} className={styles.effectItem}>
                    <span className={styles.effectArabic} lang="ar">
                      {data.arabic}
                    </span>
                    <span className={styles.effectEnglish}>
                      {data.english}
                    </span>
                    <span className={styles.effectTarget}>Enemy</span>
                    <span className={styles.effectTurns} lang="ar">
                      {toArabicNumerals(effect.remainingTurns || 0)}
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── Section 5: Practice Weak Words CTA ── */}
        {hasWeakWords && (
          <button
            className={styles.practiceButton}
            onClick={handlePracticeWeakWords}
          >
            Practice Weak Words ({toArabicNumerals(weakWords.length)})
          </button>
        )}
      </div>
    </div>
  );
}
