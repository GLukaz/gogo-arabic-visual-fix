/**
 * seasonalAutomationMiddleware.js — Auto-activate/deactivate seasonal events
 *
 * Checks the current date on app start (@@redux/INIT or persist/REHYDRATE)
 * and schedules a midnight UTC check each day. Dispatches checkForEvent
 * to seasonalEventSlice when the active event changes or on a new day.
 *
 * Events tracked (in priority order):
 *   1. Eid al-Fitr     — Hijri month 10, day 1-3
 *   2. Eid al-Adha     — Hijri month 12, day 10-13
 *   3. Ramadan         — Hijri month 9, day 1-30
 *   4. Islamic New Year — Hijri month 1, day 1-3
 *   5. Arabic Language Day — December 18 (Gregorian)
 */

import { gregorianToHijri, getHijriYear } from '../../utils/hijriCalendar.js';
import { SEASONAL_EVENT_CONFIGS } from '../../data/seasonalEventConfig.js';
import { checkForEvent } from '../slices/seasonalEventSlice.js';

// ── Date helpers ─────────────────────────────────────────────────────────────

/**
 * Return ISO date string (YYYY-MM-DD) for the given date in UTC.
 */
export function getISODateString(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/**
 * Return a Date representing the next UTC midnight after the given date.
 * e.g. 2026-04-06T15:30Z → 2026-04-07T00:00Z
 */
export function getNextMidnightUTC(date = new Date()) {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1)
  );
}

// ── Event detection ──────────────────────────────────────────────────────────

/**
 * Check whether a single event config is active on the given date.
 *
 * Hijri events: convert date to Hijri and compare month + day range.
 * Gregorian events: compare UTC month + day.
 *
 * @param {Object} config — one entry from SEASONAL_EVENT_CONFIGS
 * @param {Date}   date
 * @returns {boolean}
 */
export function isEventActive(config, date) {
  if (config.startDate.calendar === 'hijri') {
    const hijri = gregorianToHijri(date);
    return (
      hijri.month === config.startDate.month &&
      hijri.day >= config.startDate.day &&
      hijri.day <= config.endDate.day
    );
  }
  // Gregorian
  const gregMonth = date.getUTCMonth() + 1;
  const gregDay = date.getUTCDate();
  return (
    gregMonth === config.startDate.month &&
    gregDay >= config.startDate.day &&
    gregDay <= config.endDate.day
  );
}

/**
 * Return the ID of the first active seasonal event for the given date,
 * or null if no event is active.
 *
 * Checks events in the priority order defined in SEASONAL_EVENT_CONFIGS.
 *
 * @param {Date} [date=new Date()]
 * @returns {string|null}
 */
export function detectActiveEvent(date = new Date()) {
  for (const config of Object.values(SEASONAL_EVENT_CONFIGS)) {
    if (isEventActive(config, date)) {
      return config.id;
    }
  }
  return null;
}

// ── Core check function ──────────────────────────────────────────────────────

/**
 * Detect the active event for the given date and dispatch checkForEvent
 * to seasonalEventSlice. Skips if the date was already checked today.
 *
 * Exported so it can be called directly in tests and for explicit checks.
 *
 * @param {Object} store — Redux store
 * @param {Date}   [date=new Date()]
 */
export function checkAndDispatch(store, date = new Date()) {
  const dateISO = getISODateString(date);
  const state = store.getState();

  // Skip if already checked today
  if (state.seasonalEvent?.lastCheckedDate === dateISO) return;

  const detectedEvent = detectActiveEvent(date);
  const hijriYear = getHijriYear(date);

  store.dispatch(checkForEvent({ detectedEvent, dateISO, hijriYear }));
}

// ── Midnight timer ───────────────────────────────────────────────────────────

let _midnightTimer = null;

/**
 * Cancel any pending midnight check timer.
 * Exported for test teardown.
 */
export function clearMidnightTimer() {
  if (_midnightTimer !== null) {
    clearTimeout(_midnightTimer);
    _midnightTimer = null;
  }
}

function scheduleMidnightCheck(store) {
  clearMidnightTimer();
  const now = new Date();
  const nextMidnight = getNextMidnightUTC(now);
  const delay = nextMidnight.getTime() - now.getTime();

  _midnightTimer = setTimeout(() => {
    _midnightTimer = null;
    checkAndDispatch(store);
    scheduleMidnightCheck(store);
  }, delay);
}

// ── Middleware ────────────────────────────────────────────────────────────────

export const seasonalAutomationMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Trigger on redux-persist rehydration (app start in production).
  // For environments without redux-persist, call checkAndDispatch(store)
  // explicitly after configureStore (see store.js).
  if (action.type === 'persist/REHYDRATE') {
    checkAndDispatch(store);
    scheduleMidnightCheck(store);
  }

  return result;
};
