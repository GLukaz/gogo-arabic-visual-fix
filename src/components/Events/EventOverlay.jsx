/**
 * EventOverlay.jsx — Full overlay showing event details, schedule, and history (Phase 77)
 *
 * Sections:
 *   1. Active Events — currently running events with descriptions
 *   2. Vocab Boosts  — categories currently boosted
 *   3. Today's Schedule — all events that run today with times
 *   4. Weekly Schedule  — weekly events and their days
 *   5. Event History    — attendance records
 */

import { useMemo, useCallback, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  selectActiveEvents,
  selectVocabBoosts,
  selectEventHistory,
} from '../../store/slices/eventSlice.js';
import { selectGameTime, selectDayCount } from '../../store/slices/timeSlice.js';
import { FACTION_EVENTS } from '../../data/factionEvents.js';
import { FACTION_BY_ID } from '../../data/factions.js';
import {
  EVENT_SCHEDULE,
  getEventTimeRemaining,
} from '../../services/eventScheduler.js';
import styles from './EventOverlay.module.css';

// ── Constants ───────────────────────────────────────────────────────────────

const FACTION_COLORS = {
  scholars:  '#4A90D9',
  merchants: '#D4A017',
  artisans:  '#8B4513',
  travelers: '#2E8B57',
  guardians: '#8B0000',
  artists:   '#9B59B6',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_NAMES_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Format hour to 12-hour string.
 * @param {number} hour — 0-23
 * @returns {string}
 */
function formatHour(hour) {
  const h = hour % 12 || 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h}${ampm}`;
}

/**
 * Format a time window string.
 * @param {number} startHour
 * @param {number} endHour
 * @returns {string}
 */
function formatWindow(startHour, endHour) {
  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
}

/**
 * Format remaining minutes.
 * @param {number} minutes
 * @returns {string}
 */
function formatTimeRemaining(minutes) {
  if (minutes <= 0) return 'ending';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h > 0 && m > 0) return `${h}h ${m}m left`;
  if (h > 0) return `${h}h left`;
  return `${m}m left`;
}

// ── Component ───────────────────────────────────────────────────────────────

function EventOverlay({ onClose }) {
  const activeEvents = useSelector(selectActiveEvents);
  const vocabBoosts = useSelector(selectVocabBoosts);
  const eventHistory = useSelector(selectEventHistory);
  const gameTime = useSelector(selectGameTime);
  const dayCount = useSelector(selectDayCount);

  const panelRef = useRef(null);
  const gameMinutes = gameTime.hour * 60 + gameTime.minute;

  // Derive current day of week from dayCount (day 1 = Monday)
  const dayOfWeek = (dayCount % 7);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback(
    (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  // ── Today's schedule (daily events + weekly events that match today) ────
  const todaySchedule = useMemo(() => {
    return FACTION_EVENTS
      .map((event) => {
        const schedule = EVENT_SCHEDULE[event.id];
        if (!schedule) return null;

        // Weekly events only show if today is their day
        if (event.schedule === 'weekly' && schedule.dayOfWeek !== dayOfWeek) return null;

        const faction = FACTION_BY_ID[event.factionId];
        return {
          ...event,
          schedule: EVENT_SCHEDULE[event.id],
          factionIcon: faction?.icon,
          factionColor: FACTION_COLORS[event.factionId] || '#FFD700',
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.schedule.startHour - b.schedule.startHour);
  }, [dayOfWeek]);

  // ── Weekly schedule (only weekly events) ────────────────────────────────
  const weeklySchedule = useMemo(() => {
    return FACTION_EVENTS
      .filter((e) => e.schedule === 'weekly')
      .map((event) => {
        const schedule = EVENT_SCHEDULE[event.id];
        const faction = FACTION_BY_ID[event.factionId];
        return {
          ...event,
          scheduleData: schedule,
          factionIcon: faction?.icon,
          factionColor: FACTION_COLORS[event.factionId] || '#FFD700',
        };
      })
      .sort((a, b) => (a.scheduleData?.dayOfWeek ?? 0) - (b.scheduleData?.dayOfWeek ?? 0));
  }, []);

  // ── History entries (only events the player has attended) ────────────────
  const historyEntries = useMemo(() => {
    return Object.entries(eventHistory)
      .map(([eventId, record]) => {
        const event = FACTION_EVENTS.find((e) => e.id === eventId);
        if (!event) return null;
        return { event, ...record };
      })
      .filter(Boolean)
      .sort((a, b) => b.timesAttended - a.timesAttended);
  }, [eventHistory]);

  // Active event IDs for highlighting
  const activeIds = useMemo(
    () => new Set(activeEvents.map((e) => e.id)),
    [activeEvents]
  );

  return (
    <div
      className={styles.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Faction Events"
    >
      <div className={styles.panel} ref={panelRef}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>Faction Events</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close event overlay"
            type="button"
          >
            ESC
          </button>
        </div>

        {/* Scrollable content */}
        <div className={styles.content}>

          {/* ── Active Events ──────────────────────────────────────────── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Active Now</h3>
            {activeEvents.length === 0 ? (
              <p className={styles.emptyState}>No events active right now</p>
            ) : (
              activeEvents.map((event) => {
                const schedule = EVENT_SCHEDULE[event.id];
                const remaining = getEventTimeRemaining(event.id, gameMinutes);
                const factionColor = FACTION_COLORS[event.factionId] || '#FFD700';

                return (
                  <div
                    key={event.id}
                    className={styles.eventCard}
                    style={{ borderLeftColor: factionColor }}
                  >
                    <span className={styles.eventCardIcon} aria-hidden="true">
                      {event.factionIcon}
                    </span>
                    <div className={styles.eventCardBody}>
                      <div className={styles.eventCardNameRow}>
                        <span className={styles.eventCardName}>{event.name}</span>
                        <span className={styles.eventCardNameArabic} dir="rtl">
                          {event.nameArabic}
                        </span>
                      </div>
                      <p className={styles.eventCardDesc}>{event.description}</p>
                      <div className={styles.eventCardMeta}>
                        <span className={`${styles.badge} ${styles.badgeActive}`}>LIVE</span>
                        <span className={`${styles.badge} ${styles.badgeBoost}`}>
                          +{event.vocabBoost}
                        </span>
                        <span className={`${styles.badge} ${styles.badgeTime}`}>
                          {formatTimeRemaining(remaining)}
                        </span>
                        {schedule && (
                          <span className={`${styles.badge} ${styles.badgeSchedule}`}>
                            {formatWindow(schedule.startHour, schedule.endHour)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Vocab Boosts ───────────────────────────────────────────── */}
          {vocabBoosts.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Vocab Boosts Active</h3>
              <div className={styles.boostList}>
                {vocabBoosts.map((category) => (
                  <span key={category} className={styles.boostChip}>
                    +XP {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Today's Schedule ───────────────────────────────────────── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Today&apos;s Schedule ({DAY_NAMES_FULL[dayOfWeek]})
            </h3>
            {todaySchedule.length === 0 ? (
              <p className={styles.emptyState}>No events scheduled today</p>
            ) : (
              todaySchedule.map((event) => {
                const isActive = activeIds.has(event.id);
                return (
                  <div key={event.id} className={styles.scheduleRow}>
                    <span
                      className={styles.scheduleDot}
                      style={{ backgroundColor: event.factionColor }}
                      aria-hidden="true"
                    />
                    <span className={styles.scheduleName}>
                      {event.factionIcon} {event.name}
                    </span>
                    {isActive && (
                      <span className={`${styles.badge} ${styles.badgeActive}`}>LIVE</span>
                    )}
                    <span className={styles.scheduleTime}>
                      {formatWindow(event.schedule.startHour, event.schedule.endHour)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Weekly Schedule ─────────────────────────────────────────── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Weekly Events</h3>
            {weeklySchedule.map((event) => {
              const sched = event.scheduleData;
              const isActive = activeIds.has(event.id);
              return (
                <div key={event.id} className={styles.scheduleRow}>
                  <span
                    className={styles.scheduleDot}
                    style={{ backgroundColor: event.factionColor }}
                    aria-hidden="true"
                  />
                  <span className={styles.scheduleName}>
                    {event.factionIcon} {event.name}
                  </span>
                  {isActive && (
                    <span className={`${styles.badge} ${styles.badgeActive}`}>LIVE</span>
                  )}
                  <span className={styles.scheduleDay}>
                    {sched ? DAY_NAMES[sched.dayOfWeek] : '—'}
                  </span>
                  <span className={styles.scheduleTime}>
                    {sched ? formatWindow(sched.startHour, sched.endHour) : '—'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* ── Event History ───────────────────────────────────────────── */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Attendance History</h3>
            {historyEntries.length === 0 ? (
              <p className={styles.emptyState}>No events attended yet</p>
            ) : (
              historyEntries.map(({ event, timesAttended }) => (
                <div key={event.id} className={styles.historyRow}>
                  <span className={styles.historyName}>
                    {FACTION_BY_ID[event.factionId]?.icon} {event.name}
                  </span>
                  <span className={styles.historyCount}>
                    {timesAttended}x attended
                  </span>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default EventOverlay;
