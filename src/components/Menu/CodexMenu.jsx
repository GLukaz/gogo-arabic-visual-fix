/**
 * CodexMenu.jsx — Read-only codex browser
 *
 * Shows unlocked entries and overall progress (X / 308).
 * codex.js data file is not yet created — renders progress stats
 * and an "explore to unlock entries" message alongside unlocked entry IDs.
 *
 * @param {Function} [props.onBack] - Optional back navigation callback
 */
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectUnlockedEntries,
  selectCodexProgress,
  selectNewEntryCount,
  clearNewCount,
  markRead,
} from '../../store/slices/codexSlice.js';
import styles from './CodexMenu.module.css';

const TOTAL_ENTRIES = 308;

export default function CodexMenu({ onBack }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const unlockedEntries = useSelector(selectUnlockedEntries);
  const progress = useSelector(selectCodexProgress);
  const newCount = useSelector(selectNewEntryCount);

  // Clear "new" badge count when player views the codex
  if (newCount > 0) {
    dispatch(clearNewCount());
  }

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        {/* Header */}
        <div className={styles.title}>Codex</div>
        <div className={styles.subtitle}>الموسوعة</div>

        {/* Progress bar */}
        <div className={styles.progressLabel}>
          <span>Entries Unlocked</span>
          <span>
            {progress.unlocked} / {TOTAL_ENTRIES} ({progress.percentage}%)
          </span>
        </div>
        <div className={styles.progressBarTrack}>
          <div className={styles.progressBarFill} style={{ width: `${progress.percentage}%` }} />
        </div>

        {/* Entries section */}
        {unlockedEntries.length === 0 ? (
          <div className={styles.emptyMsg}>
            No entries yet — discover lore by talking to NPCs and exploring the world.
            <br />
            <span className={styles.emptyMsgHint}>
              Cultural notes from dialogue will unlock entries here.
            </span>
          </div>
        ) : (
          <>
            <div className={styles.sectionHeading}>Unlocked Entries</div>
            <div className={styles.entryGrid}>
              {unlockedEntries.map((entryId) => (
                <div
                  key={entryId}
                  className={styles.entryCard}
                  onClick={() => dispatch(markRead(entryId))}
                  title={entryId}
                >
                  {entryId.replace(/_/g, ' ')}
                </div>
              ))}
            </div>

            {/* Locked slots preview */}
            {unlockedEntries.length < TOTAL_ENTRIES && (
              <>
                <div className={styles.sectionHeading}>
                  Locked ({TOTAL_ENTRIES - unlockedEntries.length} remaining)
                </div>
                <div className={styles.entryGrid}>
                  {Array.from({
                    length: Math.min(20, TOTAL_ENTRIES - unlockedEntries.length),
                  }).map((_, i) => (
                    <div key={`locked_${i}`} className={styles.lockedCard}>
                      ???
                    </div>
                  ))}
                  {TOTAL_ENTRIES - unlockedEntries.length > 20 && (
                    <div className={styles.lockedCardMore}>
                      +{TOTAL_ENTRIES - unlockedEntries.length - 20} more...
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {/* Back button */}
        <button className={styles.backBtn} onClick={handleBack} aria-label="Back">
          Back
        </button>
      </div>
    </div>
  );
}
