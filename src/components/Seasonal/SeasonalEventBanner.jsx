/**
 * SeasonalEventBanner.jsx — Compact top-of-screen banner for seasonal events (Phase 86)
 *
 * Displays when a seasonal Islamic event is active:
 *   - Event icon (crescent moon for Ramadan, star for Eid)
 *   - Event name + greeting in Arabic
 *   - XP bonus badge
 *   - Click opens SeasonalEventOverlay
 *
 * 40px height, semi-transparent, positioned at top.
 */

import { useSelector } from 'react-redux';
import {
  selectActiveEvent,
  selectActiveEventData,
} from '../../store/slices/seasonalEventSlice.js';
import { getDaysIntoRamadan } from '../../utils/hijriCalendar.js';
import styles from './SeasonalEventBanner.module.css';

function SeasonalEventBanner({ onOpenOverlay }) {
  const activeEventId = useSelector(selectActiveEvent);
  const eventData = useSelector(selectActiveEventData);

  if (!activeEventId || !eventData) return null;

  const bonusPercent = Math.round((eventData.xpMultiplier - 1) * 100);

  // Ramadan day counter
  const ramadanDay = activeEventId === 'ramadan' ? getDaysIntoRamadan(new Date()) : null;

  return (
    <button
      className={styles.banner}
      onClick={onOpenOverlay}
      aria-label={`Active seasonal event: ${eventData.name}. ${eventData.greetingEnglish}. Click for details.`}
      type="button"
    >
      {/* Event icon */}
      <span className={styles.eventIcon} aria-hidden="true">
        {eventData.icon}
      </span>

      {/* Event info */}
      <div className={styles.eventInfo}>
        <span className={styles.eventName}>{eventData.name}</span>
        <span className={styles.eventGreeting} dir="rtl">
          {eventData.greeting}
        </span>
      </div>

      {/* Ramadan day counter */}
      {ramadanDay && (
        <span className={styles.dayCounter}>
          Day {ramadanDay}
        </span>
      )}

      {/* XP Bonus badge */}
      <span className={styles.xpBadge} aria-label={`${bonusPercent}% XP bonus`}>
        +{bonusPercent}% XP
      </span>
    </button>
  );
}

export default SeasonalEventBanner;
