/**
 * EventBanner.jsx — Compact top-of-screen banner for active faction events (Phase 77)
 *
 * Displays when one or more events are active:
 *   - Faction icon + event name (English & Arabic)
 *   - Vocab boost badge
 *   - Time remaining
 *   - Click opens EventOverlay
 *
 * Shows the first active event; if multiple are active, a "+N more" indicator appears.
 */

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectActiveEvents } from '../../store/slices/eventSlice.js';
import { selectGameTime } from '../../store/slices/timeSlice.js';
import { getEventTimeRemaining } from '../../services/eventScheduler.js';
import styles from './EventBanner.module.css';

const FACTION_COLORS = {
  scholars:  '#4A90D9',
  merchants: '#D4A017',
  artisans:  '#8B4513',
  travelers: '#2E8B57',
  guardians: '#8B0000',
  artists:   '#9B59B6',
};

/**
 * Format remaining minutes into a human-readable string.
 * @param {number} minutes
 * @returns {string}
 */
function formatTimeRemaining(minutes) {
  if (minutes <= 0) return 'ending';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  return `${m}m`;
}

function EventBanner({ onOpenOverlay }) {
  const activeEvents = useSelector(selectActiveEvents);
  const gameTime = useSelector(selectGameTime);

  const gameMinutes = gameTime.hour * 60 + gameTime.minute;

  // Primary event to display (first in list)
  const primary = activeEvents[0];
  const extraCount = activeEvents.length - 1;

  const remaining = useMemo(() => {
    if (!primary) return 0;
    return getEventTimeRemaining(primary.id, gameMinutes);
  }, [primary, gameMinutes]);

  if (!primary) return null;

  const factionColor = FACTION_COLORS[primary.factionId] || '#FFD700';

  return (
    <button
      className={styles.banner}
      onClick={onOpenOverlay}
      aria-label={`Active event: ${primary.name}. Click for details.`}
      type="button"
    >
      {/* Faction icon */}
      <span className={styles.factionIcon} aria-hidden="true">
        {primary.factionIcon}
      </span>

      {/* Colour dot */}
      <span
        className={styles.factionDot}
        style={{ backgroundColor: factionColor, color: factionColor }}
        aria-hidden="true"
      />

      {/* Event name */}
      <div className={styles.eventInfo}>
        <span className={styles.eventName}>{primary.name}</span>
        <span className={styles.eventNameArabic} dir="rtl">
          {primary.nameArabic}
        </span>
      </div>

      {/* Vocab boost */}
      <span className={styles.boostBadge} aria-label={`Vocab boost: ${primary.vocabBoost}`}>
        +{primary.vocabBoost}
      </span>

      {/* Time remaining */}
      <span className={styles.timeRemaining} aria-label={`${formatTimeRemaining(remaining)} remaining`}>
        {formatTimeRemaining(remaining)}
      </span>

      {/* Extra events indicator */}
      {extraCount > 0 && (
        <span className={styles.multiIndicator}>+{extraCount}</span>
      )}
    </button>
  );
}

export default EventBanner;
