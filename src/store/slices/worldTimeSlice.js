/**
 * worldTimeSlice.js — In-game time and per-zone weather system.
 *
 * Tracks a 60-minute real-time cycle divided into four periods:
 *   dawn  (0-14)
 *   day   (15-29)
 *   dusk  (30-44)
 *   night (45-59)
 *
 * Weather is tracked per zone and re-rolled each period using a deterministic
 * seeded RNG so tests remain reproducible.
 *
 * FEAT-034 — Weather and time-of-day system
 */

import { createSlice } from '@reduxjs/toolkit';
import { ZONES } from '../../data/zones.js';

// ── Constants ─────────────────────────────────────────────────────────────────

export const TIME_PERIODS = {
  DAWN: 'dawn',
  DAY: 'day',
  DUSK: 'dusk',
  NIGHT: 'night',
};

export const WEATHER_TYPES = ['clear', 'sandstorm', 'rain', 'fog'];

/** Weighted probability tables per zone (must sum to 1.0). */
export const ZONE_WEATHER_PROBS = {
  oasis_village:      { clear: 0.60, sandstorm: 0.25, rain: 0.05, fog: 0.10 },
  ancient_library:    { clear: 0.50, sandstorm: 0.20, rain: 0.10, fog: 0.20 },
  desert_marketplace: { clear: 0.50, sandstorm: 0.35, rain: 0.05, fog: 0.10 },
  farmland:           { clear: 0.50, sandstorm: 0.10, rain: 0.30, fog: 0.10 },
  bedouin_camp:       { clear: 0.40, sandstorm: 0.40, rain: 0.05, fog: 0.15 },
  mountain_village:   { clear: 0.45, sandstorm: 0.05, rain: 0.25, fog: 0.25 },
  coastal_port:       { clear: 0.50, sandstorm: 0.05, rain: 0.30, fog: 0.15 },
  royal_palace:       { clear: 0.65, sandstorm: 0.15, rain: 0.10, fog: 0.10 },
};

const DEFAULT_WEATHER_PROBS = { clear: 0.50, sandstorm: 0.20, rain: 0.20, fog: 0.10 };

// ── Pure helpers ──────────────────────────────────────────────────────────────

/**
 * One step of a 32-bit LCG. Returns a float in [0, 1).
 * Deterministic: same seed always produces the same float.
 *
 * @param {number} seed — unsigned 32-bit integer
 * @returns {number} float in [0, 1)
 */
export function seededRandom(seed) {
  const s = (Math.imul(seed >>> 0, 1664525) + 1013904223) >>> 0;
  return s / 0x100000000;
}

/**
 * Roll a weather type for a zone using a deterministic seed.
 *
 * @param {string} zoneId
 * @param {number} seed — integer seed (e.g. Date.now())
 * @returns {'clear'|'sandstorm'|'rain'|'fog'}
 */
export function rollWeather(zoneId, seed) {
  const probs = ZONE_WEATHER_PROBS[zoneId] || DEFAULT_WEATHER_PROBS;
  const rand = seededRandom(seed);
  let cumulative = 0;
  for (const [weather, prob] of Object.entries(probs)) {
    cumulative += prob;
    if (rand < cumulative) return weather;
  }
  return 'clear';
}

/**
 * Return the time period for a given currentTime value (0-59).
 *
 * @param {number} currentTime — integer 0-59
 * @returns {'dawn'|'day'|'dusk'|'night'}
 */
export function getTimePeriodFromValue(currentTime) {
  if (currentTime < 15) return TIME_PERIODS.DAWN;
  if (currentTime < 30) return TIME_PERIODS.DAY;
  if (currentTime < 45) return TIME_PERIODS.DUSK;
  return TIME_PERIODS.NIGHT;
}

/**
 * Return active NPCs for a zone filtered by time period.
 * NPCs without a `schedule` field are always considered active.
 *
 * @param {string} zoneId
 * @param {'dawn'|'day'|'dusk'|'night'} timePeriod
 * @returns {Array}
 */
export function getActiveNpcs(zoneId, timePeriod) {
  const zone = ZONES[zoneId];
  if (!zone || !Array.isArray(zone.npcs)) return [];
  return zone.npcs.filter((npc) => {
    if (!npc.schedule) return true; // No schedule = always active
    return npc.schedule.includes(timePeriod);
  });
}

// ── Slice ─────────────────────────────────────────────────────────────────────

const initialState = {
  /** Current position in the 60-minute real-time cycle (0-59). */
  currentTime: 0,
  /** Weather keyed by zoneId: { oasis_village: 'clear', ... } */
  weatherByZone: {},
};

const worldTimeSlice = createSlice({
  name: 'worldTime',
  initialState,
  reducers: {
    /** Advance the clock by 1 minute (wraps at 60). */
    tickWorldTime: (state) => {
      state.currentTime = (state.currentTime + 1) % 60;
    },

    /** Set weather for a single zone. */
    setZoneWeather: (state, action) => {
      const { zoneId, weather } = action.payload;
      state.weatherByZone[zoneId] = weather;
    },

    /**
     * Set weather for multiple zones in one dispatch.
     * payload: { [zoneId]: weather }
     */
    setWeatherBatch: (state, action) => {
      Object.assign(state.weatherByZone, action.payload);
    },
  },
});

export const { tickWorldTime, setZoneWeather, setWeatherBatch } = worldTimeSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────

export const selectCurrentTime = (state) => state.worldTime.currentTime;

/** Returns the current time period derived from worldTime state. */
export const getCurrentTimePeriod = (state) =>
  getTimePeriodFromValue(state.worldTime.currentTime);

export const selectZoneWeather = (zoneId) => (state) =>
  state.worldTime.weatherByZone[zoneId] || 'clear';

export default worldTimeSlice.reducer;
