import { useSelector } from 'react-redux';
import { selectProfessionByKey } from '../../store/slices/craftingSlice.js';
import { PROFESSIONS } from '../../data/professions.js';
import { calculateProfessionXP } from '../../utils/craftingLogic.js';
import styles from './ProfessionPanel.module.css';

/**
 * ProfessionPanel component
 * Displays profession progress, level, XP, and skill tree
 *
 * Features:
 * - Arabic and English profession names
 * - Level badge with Arabic numeral
 * - XP progress bar
 * - 10 skill names with lock/unlock states
 *
 * @param {string} professionId - Profession ID to display
 */
function ProfessionPanel({ professionId }) {
  const professionState = useSelector((state) =>
    selectProfessionByKey(state, professionId)
  );
  const professionData = PROFESSIONS[professionId];

  if (!professionData) {
    return (
      <div className={styles.panel}>
        <div className={styles.error}>Invalid profession</div>
      </div>
    );
  }

  if (!professionState) {
    return (
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.nameArabic}>{professionData.nameArabic}</div>
          <div className={styles.nameEnglish}>{professionData.nameEnglish}</div>
        </div>
        <div className={styles.notLearned}>
          <p>Not learned yet</p>
          <p className={styles.hint}>
            Find {professionData.nameEnglish} trainer
          </p>
        </div>
      </div>
    );
  }

  // Calculate XP progress
  const { current, required, percent } = calculateProfessionXP(
    professionState.xp,
    professionState.level
  );

  // Convert level to Arabic numerals for display
  const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const levelArabic = professionState.level
    .toString()
    .split('')
    .map((d) => arabicNumerals[parseInt(d)])
    .join('');

  return (
    <div className={styles.panel}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.nameArabic}>{professionData.nameArabic}</div>
        <div className={styles.nameEnglish}>{professionData.nameEnglish}</div>
      </div>

      {/* Level badge */}
      <div className={styles.levelSection}>
        <div className={styles.levelBadge}>
          <span className={styles.levelLabel}>Level</span>
          <span className={styles.levelNumber}>{professionState.level}</span>
          <span className={styles.levelNumberArabic}>{levelArabic}</span>
        </div>
      </div>

      {/* XP progress */}
      <div className={styles.xpSection}>
        <div className={styles.xpLabel}>
          <span>
            {current} / {required} XP
          </span>
          <span className={styles.xpPercent}>{percent}%</span>
        </div>
        <div className={styles.xpBarContainer}>
          <div
            className={styles.xpBarFill}
            style={{ width: `${Math.min(percent, 100)}%` }}
            role="progressbar"
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label={`${percent}% experience progress`}
          />
        </div>
      </div>

      {/* Skills */}
      <div className={styles.skillsSection}>
        <div className={styles.skillsTitle}>Skills</div>
        <div className={styles.skillsList}>
          {professionData.skills.map((skill) => {
            const isUnlocked = professionState.level >= skill.level;

            return (
              <div
                key={skill.level}
                className={`${styles.skill} ${
                  isUnlocked ? styles.skillUnlocked : styles.skillLocked
                }`}
              >
                <div className={styles.skillLevel}>Lv {skill.level}</div>
                <div className={styles.skillNames}>
                  <div className={styles.skillNameArabic}>
                    {skill.nameArabic}
                  </div>
                  <div className={styles.skillNameEnglish}>
                    {skill.nameEnglish}
                  </div>
                </div>
                <div className={styles.skillIcon}>
                  {isUnlocked ? '✓' : '🔒'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Recipes Unlocked</span>
          <span className={styles.statValue}>
            {professionState.recipesUnlocked.length}
          </span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Items Crafted</span>
          <span className={styles.statValue}>{professionState.craftCount}</span>
        </div>
      </div>
    </div>
  );
}

export default ProfessionPanel;
