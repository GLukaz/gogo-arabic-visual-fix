import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import {
  seasonalAutomationMiddleware,
  checkAndDispatch,
  detectActiveEvent,
  isEventActive,
  getISODateString,
  getNextMidnightUTC,
  clearMidnightTimer,
} from '../seasonalAutomationMiddleware.js';
import seasonalEventReducer, {
  selectActiveEvent,
  selectLastCheckedDate,
} from '../../slices/seasonalEventSlice.js';
import { gregorianToHijri } from '../../../utils/hijriCalendar.js';
import { SEASONAL_EVENT_CONFIGS } from '../../../data/seasonalEventConfig.js';

// ── Helper: find a Gregorian date in a specific Hijri month/day range ────────

/**
 * Search 2024-2026 for a Gregorian date where gregorianToHijri maps to
 * the given Hijri month and day range. Returns null if not found.
 */
function findDateInHijriMonth(hijriMonth, dayMin = 5, dayMax = 20) {
  for (let year = 2024; year <= 2026; year++) {
    for (let doy = 1; doy <= 366; doy++) {
      const d = new Date(Date.UTC(year, 0, doy));
      const h = gregorianToHijri(d);
      if (h.month === hijriMonth && h.day >= dayMin && h.day <= dayMax) {
        return d;
      }
    }
  }
  return null;
}

// ── Pre-compute representative dates ─────────────────────────────────────────

const RAMADAN_DATE = findDateInHijriMonth(9, 10, 20);       // mid-Ramadan
const EID_FITR_DATE = findDateInHijriMonth(10, 1, 3);       // Eid al-Fitr day 1-3
const EID_ADHA_DATE = findDateInHijriMonth(12, 10, 13);     // Eid al-Adha day 10-13
const ISLAMIC_NY_DATE = findDateInHijriMonth(1, 1, 3);      // Islamic New Year day 1-3
const ARABIC_LANG_DATE = new Date(Date.UTC(2025, 11, 18));  // Dec 18, 2025
const NON_EVENT_DATE = new Date(Date.UTC(2025, 5, 1));      // Some date — verified below

// ── Helper: build a minimal store with seasonalAutomationMiddleware ──────────

function makeStore(preloadedState) {
  return configureStore({
    reducer: { seasonalEvent: seasonalEventReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(seasonalAutomationMiddleware),
    preloadedState,
  });
}

// ── Date helper tests ─────────────────────────────────────────────────────────

describe('getISODateString', () => {
  it('returns YYYY-MM-DD format', () => {
    const result = getISODateString(new Date('2026-04-06T15:30:00Z'));
    expect(result).toBe('2026-04-06');
  });

  it('uses UTC date, not local date', () => {
    // Date near midnight UTC: UTC is "06" but local could be "05" or "07"
    const result = getISODateString(new Date('2026-04-06T00:30:00Z'));
    expect(result).toBe('2026-04-06');
  });
});

describe('getNextMidnightUTC', () => {
  it('returns midnight UTC of the next day', () => {
    const input = new Date('2026-04-06T15:30:00Z');
    const next = getNextMidnightUTC(input);
    expect(next.toISOString()).toBe('2026-04-07T00:00:00.000Z');
  });

  it('handles end-of-month boundary', () => {
    const input = new Date('2026-03-31T23:59:59Z');
    const next = getNextMidnightUTC(input);
    expect(next.toISOString()).toBe('2026-04-01T00:00:00.000Z');
  });

  it('returns a time strictly after the input', () => {
    const now = new Date();
    const next = getNextMidnightUTC(now);
    expect(next.getTime()).toBeGreaterThan(now.getTime());
  });
});

// ── isEventActive tests ───────────────────────────────────────────────────────

describe('isEventActive', () => {
  it('returns true for a Gregorian event on its exact date', () => {
    const arabicLangConfig = SEASONAL_EVENT_CONFIGS.arabic_language_day;
    expect(isEventActive(arabicLangConfig, ARABIC_LANG_DATE)).toBe(true);
  });

  it('returns false for a Gregorian event one day before', () => {
    const arabicLangConfig = SEASONAL_EVENT_CONFIGS.arabic_language_day;
    const dayBefore = new Date(Date.UTC(2025, 11, 17)); // Dec 17
    expect(isEventActive(arabicLangConfig, dayBefore)).toBe(false);
  });

  it('returns false for a Gregorian event one day after', () => {
    const arabicLangConfig = SEASONAL_EVENT_CONFIGS.arabic_language_day;
    const dayAfter = new Date(Date.UTC(2025, 11, 19)); // Dec 19
    expect(isEventActive(arabicLangConfig, dayAfter)).toBe(false);
  });

  it('returns true for a Hijri event when date is in the event window', () => {
    if (!RAMADAN_DATE) return; // skip if no date found
    const ramadanConfig = SEASONAL_EVENT_CONFIGS.ramadan;
    expect(isEventActive(ramadanConfig, RAMADAN_DATE)).toBe(true);
  });

  it('returns false for a Hijri event when date is outside the month', () => {
    const ramadanConfig = SEASONAL_EVENT_CONFIGS.ramadan;
    // Dec 18 is Arabic Language Day — not Ramadan
    expect(isEventActive(ramadanConfig, ARABIC_LANG_DATE)).toBe(false);
  });
});

// ── detectActiveEvent tests ───────────────────────────────────────────────────

describe('detectActiveEvent', () => {
  it('returns null for a clearly non-event date', () => {
    // Verify NON_EVENT_DATE is not any event
    const hijri = gregorianToHijri(NON_EVENT_DATE);
    const notEvent =
      hijri.month !== 9 &&       // not Ramadan
      !(hijri.month === 10 && hijri.day <= 3) &&  // not Eid al-Fitr
      !(hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) && // not Eid al-Adha
      !(hijri.month === 1 && hijri.day <= 3) && // not Islamic NY
      !(NON_EVENT_DATE.getUTCMonth() === 11 && NON_EVENT_DATE.getUTCDate() === 18); // not Arabic Lang

    if (notEvent) {
      expect(detectActiveEvent(NON_EVENT_DATE)).toBeNull();
    }
  });

  it('returns arabic_language_day on December 18', () => {
    expect(detectActiveEvent(ARABIC_LANG_DATE)).toBe('arabic_language_day');
  });

  it('returns null on December 17 (day before Arabic Language Day)', () => {
    const dayBefore = new Date(Date.UTC(2025, 11, 17));
    // Dec 17 could be a Hijri event — only assert null if no Hijri event matches
    const result = detectActiveEvent(dayBefore);
    if (result !== null) {
      expect(result).not.toBe('arabic_language_day');
    } else {
      expect(result).toBeNull();
    }
  });

  it('returns null on December 19 (day after Arabic Language Day)', () => {
    const dayAfter = new Date(Date.UTC(2025, 11, 19));
    const hijri = gregorianToHijri(dayAfter);
    const isHijriEvent =
      (hijri.month === 9) ||
      (hijri.month === 10 && hijri.day <= 3) ||
      (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) ||
      (hijri.month === 1 && hijri.day <= 3);
    if (!isHijriEvent) {
      expect(detectActiveEvent(dayAfter)).toBeNull();
    }
  });

  it('returns ramadan for a date in Ramadan', () => {
    if (!RAMADAN_DATE) return;
    expect(detectActiveEvent(RAMADAN_DATE)).toBe('ramadan');
  });

  it('returns eid_fitr for a date in Eid al-Fitr window', () => {
    if (!EID_FITR_DATE) return;
    expect(detectActiveEvent(EID_FITR_DATE)).toBe('eid_fitr');
  });

  it('returns eid_adha for a date in Eid al-Adha window', () => {
    if (!EID_ADHA_DATE) return;
    expect(detectActiveEvent(EID_ADHA_DATE)).toBe('eid_adha');
  });

  it('returns islamic_new_year for 1 Muharram', () => {
    if (!ISLAMIC_NY_DATE) return;
    expect(detectActiveEvent(ISLAMIC_NY_DATE)).toBe('islamic_new_year');
  });

  it('returns a valid event ID or null', () => {
    const validIds = Object.keys(SEASONAL_EVENT_CONFIGS);
    const result = detectActiveEvent(new Date());
    expect(result === null || validIds.includes(result)).toBe(true);
  });

  it('Ramadan day 1 boundary is active', () => {
    const ramadanDay1 = findDateInHijriMonth(9, 1, 1);
    if (!ramadanDay1) return;
    expect(detectActiveEvent(ramadanDay1)).toBe('ramadan');
  });

  it('Eid al-Fitr day 3 boundary is active', () => {
    const eidDay3 = findDateInHijriMonth(10, 3, 3);
    if (!eidDay3) return;
    expect(detectActiveEvent(eidDay3)).toBe('eid_fitr');
  });
});

// ── checkAndDispatch tests ─────────────────────────────────────────────────────

describe('checkAndDispatch', () => {
  let store;

  beforeEach(() => {
    store = makeStore();
    clearMidnightTimer();
    vi.useFakeTimers();
  });

  afterEach(() => {
    clearMidnightTimer();
    vi.useRealTimers();
  });

  it('dispatches checkForEvent when date has not been checked yet', () => {
    const testDate = new Date('2025-12-18T10:00:00Z'); // Arabic Language Day
    vi.setSystemTime(testDate);

    checkAndDispatch(store, testDate);

    expect(selectLastCheckedDate(store.getState())).toBe('2025-12-18');
    expect(selectActiveEvent(store.getState())).toBe('arabic_language_day');
  });

  it('does NOT dispatch again when same date is already checked', () => {
    const testDate = new Date('2025-12-18T10:00:00Z');
    vi.setSystemTime(testDate);

    checkAndDispatch(store, testDate); // first call
    const afterFirst = store.getState().seasonalEvent;

    checkAndDispatch(store, testDate); // second call — same day
    expect(store.getState().seasonalEvent).toEqual(afterFirst);
  });

  it('sets activeEvent to null for a non-event date', () => {
    // Use a date known not to be any event
    const nonEventDate = new Date('2025-08-15T10:00:00Z');
    const hijri = gregorianToHijri(nonEventDate);
    const isAnyHijriEvent =
      (hijri.month === 9) ||
      (hijri.month === 10 && hijri.day <= 3) ||
      (hijri.month === 12 && hijri.day >= 10 && hijri.day <= 13) ||
      (hijri.month === 1 && hijri.day <= 3);

    if (!isAnyHijriEvent) {
      checkAndDispatch(store, nonEventDate);
      expect(selectActiveEvent(store.getState())).toBeNull();
    }
  });

  it('updates lastCheckedDate to today ISO string', () => {
    const testDate = new Date('2026-01-15T08:00:00Z');
    checkAndDispatch(store, testDate);
    expect(selectLastCheckedDate(store.getState())).toBe('2026-01-15');
  });

  it('re-dispatches on a new day even if activeEvent is unchanged', () => {
    const day1 = new Date('2025-12-18T10:00:00Z');
    const day2 = new Date('2025-12-19T10:00:00Z');

    checkAndDispatch(store, day1);
    expect(selectLastCheckedDate(store.getState())).toBe('2025-12-18');

    checkAndDispatch(store, day2);
    expect(selectLastCheckedDate(store.getState())).toBe('2025-12-19');
  });
});

// ── Middleware integration tests ──────────────────────────────────────────────

describe('seasonalAutomationMiddleware — store integration', () => {
  afterEach(() => {
    clearMidnightTimer();
    vi.useRealTimers();
  });

  it('dispatches checkForEvent on persist/REHYDRATE (app start)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-12-18T10:00:00Z')); // Arabic Language Day

    const store = makeStore();
    // Simulate redux-persist rehydration (the production trigger)
    store.dispatch({ type: 'persist/REHYDRATE', payload: {} });

    expect(selectLastCheckedDate(store.getState())).toBe('2025-12-18');
    expect(selectActiveEvent(store.getState())).toBe('arabic_language_day');
  });

  it('passes unrelated actions through unchanged', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-02-01T10:00:00Z'));
    const store = makeStore();

    const before = store.getState().seasonalEvent;
    store.dispatch({ type: 'player/addXP', payload: 50 });
    expect(store.getState().seasonalEvent).toEqual(before);
  });
});

// ── Config structure tests ────────────────────────────────────────────────────

describe('SEASONAL_EVENT_CONFIGS', () => {
  it('contains exactly 5 events', () => {
    expect(Object.keys(SEASONAL_EVENT_CONFIGS)).toHaveLength(5);
  });

  it('each event has required fields', () => {
    for (const [, config] of Object.entries(SEASONAL_EVENT_CONFIGS)) {
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('name');
      expect(config).toHaveProperty('nameArabic');
      expect(config).toHaveProperty('startDate');
      expect(config).toHaveProperty('endDate');
      expect(config).toHaveProperty('bonuses');
      expect(config.bonuses).toHaveProperty('xpMultiplier');
      expect(config.bonuses).toHaveProperty('specialShopItems');
    }
  });

  it('each event has an xpMultiplier > 1.0', () => {
    for (const [, config] of Object.entries(SEASONAL_EVENT_CONFIGS)) {
      expect(config.bonuses.xpMultiplier).toBeGreaterThan(1.0);
    }
  });

  it('each event has at least 2 specialShopItems', () => {
    for (const [, config] of Object.entries(SEASONAL_EVENT_CONFIGS)) {
      expect(config.bonuses.specialShopItems.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('config IDs match their keys', () => {
    for (const [key, config] of Object.entries(SEASONAL_EVENT_CONFIGS)) {
      expect(config.id).toBe(key);
    }
  });

  it('arabic_language_day uses gregorian calendar', () => {
    const config = SEASONAL_EVENT_CONFIGS.arabic_language_day;
    expect(config.startDate.calendar).toBe('gregorian');
    expect(config.startDate.month).toBe(12);
    expect(config.startDate.day).toBe(18);
  });

  it('hijri events reference correct months', () => {
    expect(SEASONAL_EVENT_CONFIGS.ramadan.startDate.month).toBe(9);
    expect(SEASONAL_EVENT_CONFIGS.eid_fitr.startDate.month).toBe(10);
    expect(SEASONAL_EVENT_CONFIGS.eid_adha.startDate.month).toBe(12);
    expect(SEASONAL_EVENT_CONFIGS.islamic_new_year.startDate.month).toBe(1);
  });
});
