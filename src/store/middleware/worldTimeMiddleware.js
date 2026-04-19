/**
 * worldTimeMiddleware.js — Advances the in-game clock every real minute.
 *
 * On `persist/REHYDRATE` (app start), starts a setInterval that fires every
 * 60 000 ms (1 real minute) and dispatches `tickWorldTime()`. When the time
 * period changes (e.g. dawn → day), it re-rolls weather for all 8 core zones
 * using the current timestamp as a seed, ensuring deterministic but varied
 * weather across sessions.
 *
 * Exports `clearWorldTimeClock()` for test teardown.
 *
 * FEAT-034 — Weather and time-of-day system
 */

import {
  tickWorldTime,
  setWeatherBatch,
  rollWeather,
  getTimePeriodFromValue,
} from '../slices/worldTimeSlice.js';

/** The 8 core gameplay zones that participate in the weather system. */
export const CORE_ZONE_IDS = [
  'oasis_village',
  'ancient_library',
  'desert_marketplace',
  'farmland',
  'bedouin_camp',
  'mountain_village',
  'coastal_port',
  'royal_palace',
];

// ── Timer state ───────────────────────────────────────────────────────────────

let _clockInterval = null;
let _lastPeriod = null;

/**
 * Cancel the running world-time interval.
 * Call this in test `afterEach` hooks to prevent timer leaks.
 */
export function clearWorldTimeClock() {
  if (_clockInterval !== null) {
    clearInterval(_clockInterval);
    _clockInterval = null;
  }
  _lastPeriod = null;
}

// ── Internal helpers ──────────────────────────────────────────────────────────

/**
 * Roll weather for all core zones using seed derived from Date.now().
 * Each zone gets a slightly different seed offset so adjacent zones can
 * differ even with the same timestamp.
 *
 * @param {number} seed — base seed integer
 * @returns {{ [zoneId]: string }} weather map
 */
export function rollAllZoneWeather(seed) {
  const batch = {};
  CORE_ZONE_IDS.forEach((zoneId, i) => {
    batch[zoneId] = rollWeather(zoneId, seed + i);
  });
  return batch;
}

function startClock(store) {
  clearWorldTimeClock();

  // Initialise _lastPeriod from current state so we don't roll weather
  // immediately on the first tick when the period hasn't actually changed.
  const initialTime = store.getState().worldTime?.currentTime ?? 0;
  _lastPeriod = getTimePeriodFromValue(initialTime);

  _clockInterval = setInterval(() => {
    store.dispatch(tickWorldTime());

    const currentTime = store.getState().worldTime?.currentTime ?? 0;
    const period = getTimePeriodFromValue(currentTime);

    if (period !== _lastPeriod) {
      _lastPeriod = period;
      const weatherBatch = rollAllZoneWeather(Date.now());
      store.dispatch(setWeatherBatch(weatherBatch));
    }
  }, 60_000);
}

// ── Middleware ────────────────────────────────────────────────────────────────

export const worldTimeMiddleware = (store) => (next) => (action) => {
  const result = next(action);

  // Start the clock on app initialisation / rehydration.
  if (action.type === 'persist/REHYDRATE' || action.type === '@@redux/INIT') {
    startClock(store);
  }

  return result;
};
