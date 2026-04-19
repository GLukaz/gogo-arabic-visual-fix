import { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { selectPlayerStats } from '../../store/slices/playerSlice.js';
import SyncIndicator from './SyncIndicator.jsx';
import styles from './StatsPanel.module.css';

function StatsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { wordsLearned, dirhams, streak } = useSelector(selectPlayerStats);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={styles.container}>
      <button
        className={styles.toggleBtn}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls="stats-panel"
        aria-label={isOpen ? 'Hide stats' : 'Show stats'}
      >
        <span className={styles.toggleArrow}>{isOpen ? '▼' : '▶'}</span> Stats
      </button>
      <div
        id="stats-panel"
        className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        aria-hidden={!isOpen}
      >
        <div className={styles.stat}>
          <span className={styles.statLabel}>Words:</span>
          <span className={styles.statValue}>{wordsLearned}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Dirhams:</span>
          <span className={styles.statValue}>{dirhams} D</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statLabel}>Streak:</span>
          <span className={styles.statValue}>{streak} days</span>
        </div>
        <SyncIndicator />
      </div>
    </div>
  );
}

// Memoize to prevent re-renders when parent HUD updates
export default memo(StatsPanel);
