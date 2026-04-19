import { useState, Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { SKILL_TREES, SKILL_TREE_ORDER } from '../../data/skillTrees.js';
import { selectTreeProgress } from '../../store/slices/skillTreeSlice.js';
import styles from './SkillTreeMenu.module.css';

const SkillTreeView = lazy(() => import('./SkillTreeView.jsx'));

/**
 * SkillTreeMenu — Tab-based menu showing all 6 Arabic learning skill trees.
 *
 * Features:
 * - 6 tabs (one per tree) with Arabic name + animated progress bar
 * - Active tab highlights with tree accent colour
 * - SkillTreeView renders the selected tree's nodes
 *
 * @param {Object}   props
 * @param {Function} [props.onBack] - Optional back navigation callback
 */
export default function SkillTreeMenu({ onBack }) {
  const [activeTreeId, setActiveTreeId] = useState(SKILL_TREE_ORDER[0]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        {onBack && (
          <button
            className={styles.backBtn}
            onClick={onBack}
            aria-label="Back"
          >
            ← Back
          </button>
        )}
        <div className={styles.titleBlock}>
          <h1 className={styles.title}>Skill Trees</h1>
          <span className={styles.titleArabic} lang="ar">أشجار المهارات</span>
        </div>
      </div>

      {/* Tab bar */}
      <div className={styles.tabBar} role="tablist" aria-label="Skill trees">
        {SKILL_TREE_ORDER.map((treeId) => (
          <TreeTab
            key={treeId}
            treeId={treeId}
            isActive={activeTreeId === treeId}
            onSelect={() => setActiveTreeId(treeId)}
          />
        ))}
      </div>

      {/* Active tree panel */}
      <div
        className={styles.treePanel}
        role="tabpanel"
        aria-label={SKILL_TREES[activeTreeId]?.name}
        key={activeTreeId}
      >
        {/* Active tree heading */}
        <div
          className={styles.treeHeading}
          style={{ borderColor: SKILL_TREES[activeTreeId]?.color }}
        >
          <span className={styles.treeHeadingName}>
            {SKILL_TREES[activeTreeId]?.name}
          </span>
          <span className={styles.treeHeadingArabic} lang="ar">
            {SKILL_TREES[activeTreeId]?.nameArabic}
          </span>
        </div>

        <Suspense fallback={
          <div style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '8px',
            color: 'var(--color-light-gray)',
            padding: '24px',
            textAlign: 'center'
          }}>
            Loading skill tree...
          </div>
        }>
          <SkillTreeView treeId={activeTreeId} />
        </Suspense>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TreeTab — Individual tab with name, Arabic label, and progress bar
// ─────────────────────────────────────────────────────────────────────────────
function TreeTab({ treeId, isActive, onSelect }) {
  const tree = SKILL_TREES[treeId];
  const progress = useSelector(selectTreeProgress(treeId));

  return (
    <button
      className={`${styles.tab} ${isActive ? styles.tabActive : ''}`}
      onClick={onSelect}
      role="tab"
      aria-selected={isActive}
      aria-label={`${tree.name} — ${progress.percentage}% complete`}
      style={isActive ? { borderBottomColor: tree.color } : undefined}
    >
      {/* Arabic name (primary label in this app) */}
      <span className={styles.tabNameArabic} lang="ar">
        {tree.nameArabic}
      </span>

      {/* English name */}
      <span className={styles.tabName}>{tree.name}</span>

      {/* Progress bar */}
      <div className={styles.progressBarTrack} aria-hidden="true">
        <div
          className={styles.progressBarFill}
          style={{
            width: `${progress.percentage}%`,
            background: tree.color,
          }}
        />
      </div>

      {/* Progress fraction */}
      <span className={styles.progressText}>
        {progress.unlocked}/{progress.total}
      </span>
    </button>
  );
}
