/**
 * eventScheduler.js — Pure-function module for faction event scheduling (Phase 77)
 *
 * Determines which of the 12 faction events are currently active based on
 * game time (minutes since midnight) and day of the week. Daily events repeat
 * every day; weekly events fire on a specific day.
 *
 * All functions are stateless and side-effect free — the Redux eventSlice
 * is responsible for persisting active-event state.
 */

import { FACTION_EVENTS } from '../data/factionEvents.js';

// ── Schedule Mapping ────────────────────────────────────────────────────────
// Maps each event ID to its time window (and day for weekly events).
// startHour/endHour are in 24-hour format. dayOfWeek uses JS convention (0=Sun … 6=Sat).

export const EVENT_SCHEDULE = Object.freeze({
  // Daily events
  calligraphy_workshop:  { startHour: 14, endHour: 16 },
  counting_house_drill:  { startHour: 10, endHour: 11 },
  workshop_open_day:     { startHour:  9, endHour: 12 },
  navigators_circle:     { startHour: 16, endHour: 18 },
  training_ground_drill: { startHour:  6, endHour:  7 },
  oud_evening:           { startHour: 19, endHour: 21 },

  // Weekly events — dayOfWeek required
  scholars_debate:       { dayOfWeek: 1, startHour: 15, endHour: 19 },
  market_festival:       { dayOfWeek: 3, startHour: 10, endHour: 16 },
  guild_showcase:        { dayOfWeek: 5, startHour: 11, endHour: 16 },
  caravan_departure:     { dayOfWeek: 0, startHour:  8, endHour: 16 },
  honour_ceremony:       { dayOfWeek: 4, startHour: 17, endHour: 19 },
  poetry_circle:         { dayOfWeek: 6, startHour: 18, endHour: 21 },
});

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Convert gameMinutes (total minutes since midnight) to current hour (0-23).
 * @param {number} gameMinutes — minutes into the current day (0-1439)
 * @returns {number} hour (0-23)
 */
const _minutesToHour = (gameMinutes) => {
  const clamped = ((gameMinutes % 1440) + 1440) % 1440; // handle negatives
  return Math.floor(clamped / 60);
};

/**
 * Convert gameMinutes to fractional hours for precise comparisons.
 * @param {number} gameMinutes
 * @returns {number}
 */
const minutesToFractionalHour = (gameMinutes) => {
  const clamped = ((gameMinutes % 1440) + 1440) % 1440;
  return clamped / 60;
};

/**
 * Check whether a single event is active right now.
 * @param {Object} schedule — entry from EVENT_SCHEDULE
 * @param {Object} event    — entry from FACTION_EVENTS
 * @param {number} gameMinutes — minutes into the current day (0-1439)
 * @param {number} dayOfWeek   — 0 (Sun) through 6 (Sat)
 * @returns {boolean}
 */
const isScheduleActive = (schedule, event, gameMinutes, dayOfWeek) => {
  if (!schedule) return false;

  // Weekly events must match the day
  if (event.schedule === 'weekly') {
    if (schedule.dayOfWeek !== dayOfWeek) return false;
  }

  const currentHour = minutesToFractionalHour(gameMinutes);
  return currentHour >= schedule.startHour && currentHour < schedule.endHour;
};

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Get all currently active faction events.
 *
 * @param {number} gameMinutes — minutes into the current day (0-1439)
 * @param {number} dayOfWeek   — 0 (Sun) through 6 (Sat)
 * @returns {import('../data/factionEvents.js').FactionEvent[]} active events
 */
export function getActiveEvents(gameMinutes, dayOfWeek) {
  return FACTION_EVENTS.filter((event) => {
    const schedule = EVENT_SCHEDULE[event.id];
    return isScheduleActive(schedule, event, gameMinutes, dayOfWeek);
  });
}

/**
 * Check whether a specific event is active.
 *
 * @param {string} eventId     — event ID from FACTION_EVENTS
 * @param {number} gameMinutes — minutes into the current day
 * @param {number} dayOfWeek   — 0-6
 * @returns {boolean}
 */
export function isEventActive(eventId, gameMinutes, dayOfWeek) {
  const event = FACTION_EVENTS.find((e) => e.id === eventId);
  if (!event) return false;
  const schedule = EVENT_SCHEDULE[eventId];
  return isScheduleActive(schedule, event, gameMinutes, dayOfWeek);
}

/**
 * Get the next upcoming event, with minutes until it starts.
 *
 * Searches forward through the current day and up to 7 more days to find
 * the nearest event that has not yet started. Returns null if none found.
 *
 * @param {number} gameMinutes — minutes into the current day
 * @param {number} dayOfWeek   — 0-6
 * @returns {{ event: import('../data/factionEvents.js').FactionEvent, minutesUntil: number } | null}
 */
export function getNextEvent(gameMinutes, dayOfWeek) {
  let best = null;

  for (let dayOffset = 0; dayOffset <= 7; dayOffset++) {
    const checkDay = (dayOfWeek + dayOffset) % 7;

    for (const event of FACTION_EVENTS) {
      const schedule = EVENT_SCHEDULE[event.id];
      if (!schedule) continue;

      // Weekly events only on their assigned day
      if (event.schedule === 'weekly' && schedule.dayOfWeek !== checkDay) continue;

      const eventStartMinutes = schedule.startHour * 60;

      // For current day (offset 0), event must start in the future
      if (dayOffset === 0 && eventStartMinutes <= gameMinutes) continue;

      const minutesUntil =
        dayOffset === 0
          ? eventStartMinutes - gameMinutes
          : (dayOffset * 1440) - gameMinutes + eventStartMinutes;

      if (!best || minutesUntil < best.minutesUntil) {
        best = { event, minutesUntil };
      }
    }
  }

  return best;
}

/**
 * Extract the set of vocab-boost categories from currently active events.
 *
 * @param {import('../data/factionEvents.js').FactionEvent[]} activeEvents
 * @returns {string[]} unique category strings
 */
export function getVocabBoostCategories(activeEvents) {
  return [...new Set(activeEvents.map((e) => e.vocabBoost))];
}

/**
 * Get the remaining minutes for an active event.
 *
 * @param {string} eventId     — event ID
 * @param {number} gameMinutes — current minutes into the day
 * @returns {number} minutes remaining, or 0 if event not found / not active
 */
export function getEventTimeRemaining(eventId, gameMinutes) {
  const schedule = EVENT_SCHEDULE[eventId];
  if (!schedule) return 0;

  const endMinutes = schedule.endHour * 60;
  const currentMinutes = ((gameMinutes % 1440) + 1440) % 1440;

  if (currentMinutes >= endMinutes) return 0;
  return endMinutes - currentMinutes;
}
