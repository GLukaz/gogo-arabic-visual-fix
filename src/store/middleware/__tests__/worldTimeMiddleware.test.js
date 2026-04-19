/**
 * worldTimeMiddleware.test.js
 *
 * Tests for FEAT-034 — Weather and time-of-day system.
 * Covers: time cycling, period transitions, weather generation,
 * NPC schedule filtering, deterministic RNG, middleware clock.
 */

import { describe, it, expect, afterEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import worldTimeReducer, {
  tickWorldTime,
  setZoneWeather,
  setWeatherBatch,
  getCurrentTimePeriod,
  getTimePeriodFromValue,
  getActiveNpcs,
  rollWeather,
  seededRandom,
  selectCurrentTime,
  selectZoneWeather,
  WEATHER_TYPES,
} from '../../slices/worldTimeSlice.js';
import {
  worldTimeMiddleware,
  clearWorldTimeClock,
  rollAllZoneWeather,
  CORE_ZONE_IDS,
} from '../worldTimeMiddleware.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeStore(preloadedTime = {}) {
  return configureStore({
    reducer: { worldTime: worldTimeReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(worldTimeMiddleware),
    preloadedState: {
      worldTime: { ...worldTimeReducer(undefined, { type: '@@INIT' }), ...preloadedTime },
    },
  });
}

afterEach(() => {
  clearWorldTimeClock();
});

// ─────────────────────────────────────────────────────────────────────────────
// Slice reducers
// ─────────────────────────────────────────────────────────────────────────────

describe('worldTimeSlice — reducers', () => {
  it('tickWorldTime increments currentTime by 1', () => {
    const s0 = worldTimeReducer(undefined, { type: '@@INIT' });
    const s1 = worldTimeReducer(s0, tickWorldTime());
    expect(s1.currentTime).toBe(1);
  });

  it('tickWorldTime wraps from 59 back to 0', () => {
    const base = { currentTime: 59, weatherByZone: {} };
    const next = worldTimeReducer(base, tickWorldTime());
    expect(next.currentTime).toBe(0);
  });

  it('setZoneWeather stores weather for a zone', () => {
    const s0 = worldTimeReducer(undefined, { type: '@@INIT' });
    const s1 = worldTimeReducer(s0, setZoneWeather({ zoneId: 'oasis_village', weather: 'sandstorm' }));
    expect(s1.weatherByZone.oasis_village).toBe('sandstorm');
  });

  it('setWeatherBatch sets weather for multiple zones at once', () => {
    const s0 = worldTimeReducer(undefined, { type: '@@INIT' });
    const batch = { oasis_village: 'rain', coastal_port: 'fog' };
    const s1 = worldTimeReducer(s0, setWeatherBatch(batch));
    expect(s1.weatherByZone.oasis_village).toBe('rain');
    expect(s1.weatherByZone.coastal_port).toBe('fog');
  });

  it('setWeatherBatch merges with existing weather (does not clear other zones)', () => {
    const base = { currentTime: 0, weatherByZone: { farmland: 'clear' } };
    const s1 = worldTimeReducer(base, setWeatherBatch({ oasis_village: 'sandstorm' }));
    expect(s1.weatherByZone.farmland).toBe('clear');
    expect(s1.weatherByZone.oasis_village).toBe('sandstorm');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Time period logic
// ─────────────────────────────────────────────────────────────────────────────

describe('getTimePeriodFromValue — period boundaries', () => {
  it('returns dawn for 0', () => expect(getTimePeriodFromValue(0)).toBe('dawn'));
  it('returns dawn for 14 (last dawn minute)', () => expect(getTimePeriodFromValue(14)).toBe('dawn'));
  it('returns day for 15 (first day minute)', () => expect(getTimePeriodFromValue(15)).toBe('day'));
  it('returns day for 29 (last day minute)', () => expect(getTimePeriodFromValue(29)).toBe('day'));
  it('returns dusk for 30', () => expect(getTimePeriodFromValue(30)).toBe('dusk'));
  it('returns dusk for 44 (last dusk minute)', () => expect(getTimePeriodFromValue(44)).toBe('dusk'));
  it('returns night for 45', () => expect(getTimePeriodFromValue(45)).toBe('night'));
  it('returns night for 59 (last night minute)', () => expect(getTimePeriodFromValue(59)).toBe('night'));
});

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

describe('selectors', () => {
  it('selectCurrentTime reads currentTime from state', () => {
    const state = { worldTime: { currentTime: 22, weatherByZone: {} } };
    expect(selectCurrentTime(state)).toBe(22);
  });

  it('getCurrentTimePeriod selector returns correct period from full state', () => {
    const state = { worldTime: { currentTime: 30, weatherByZone: {} } };
    expect(getCurrentTimePeriod(state)).toBe('dusk');
  });

  it('selectZoneWeather returns zone weather or clear fallback', () => {
    const state = { worldTime: { currentTime: 0, weatherByZone: { farmland: 'fog' } } };
    expect(selectZoneWeather('farmland')(state)).toBe('fog');
    expect(selectZoneWeather('coastal_port')(state)).toBe('clear');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic weather generation
// ─────────────────────────────────────────────────────────────────────────────

describe('seededRandom', () => {
  it('returns a float in [0, 1)', () => {
    const v = seededRandom(12345);
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });

  it('is deterministic — same seed → same value', () => {
    expect(seededRandom(99999)).toBe(seededRandom(99999));
  });

  it('different seeds produce different values', () => {
    expect(seededRandom(1)).not.toBe(seededRandom(2));
  });
});

describe('rollWeather', () => {
  it('returns a valid weather type for a known zone', () => {
    const w = rollWeather('oasis_village', 42);
    expect(WEATHER_TYPES).toContain(w);
  });

  it('is deterministic — same zone + seed → same weather', () => {
    expect(rollWeather('farmland', 777)).toBe(rollWeather('farmland', 777));
  });

  it('falls back to default probs for unknown zone and still returns valid weather', () => {
    const w = rollWeather('unknown_zone', 100);
    expect(WEATHER_TYPES).toContain(w);
  });

  it('all 8 core zones produce valid weather', () => {
    CORE_ZONE_IDS.forEach((zoneId) => {
      expect(WEATHER_TYPES).toContain(rollWeather(zoneId, 555));
    });
  });

  it('different seeds can produce different weather for the same zone', () => {
    // Not guaranteed every pair differs, but with enough seeds at least two should differ
    const results = new Set(
      Array.from({ length: 10 }, (_, i) => rollWeather('oasis_village', i * 1000 + 1))
    );
    expect(results.size).toBeGreaterThan(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// NPC schedule filtering
// ─────────────────────────────────────────────────────────────────────────────

describe('getActiveNpcs', () => {
  it('returns empty array for unknown zone', () => {
    expect(getActiveNpcs('nonexistent_zone', 'day')).toEqual([]);
  });

  it('returns all NPCs for a zone when none have a schedule field', () => {
    // oasis_village NPCs have no schedule in zones.js — all should be returned
    const npcs = getActiveNpcs('oasis_village', 'day');
    expect(npcs.length).toBeGreaterThan(0);
  });

  it('returns same NPCs regardless of period when no schedule is set (always active)', () => {
    const dawn = getActiveNpcs('oasis_village', 'dawn');
    const night = getActiveNpcs('oasis_village', 'night');
    expect(dawn.length).toBe(night.length);
  });

  it('returns NPCs for other core zones', () => {
    // Verify each core zone has NPCs accessible via getActiveNpcs
    const withNpcs = CORE_ZONE_IDS.filter((zoneId) => {
      const npcs = getActiveNpcs(zoneId, 'day');
      return npcs.length > 0;
    });
    // At least some zones should have NPCs
    expect(withNpcs.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// rollAllZoneWeather
// ─────────────────────────────────────────────────────────────────────────────

describe('rollAllZoneWeather', () => {
  it('returns weather for all 8 core zones', () => {
    const batch = rollAllZoneWeather(12345);
    CORE_ZONE_IDS.forEach((zoneId) => {
      expect(batch).toHaveProperty(zoneId);
      expect(WEATHER_TYPES).toContain(batch[zoneId]);
    });
  });

  it('is deterministic — same seed → same batch', () => {
    const b1 = rollAllZoneWeather(42);
    const b2 = rollAllZoneWeather(42);
    expect(b1).toEqual(b2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Middleware — clock and period transitions
// ─────────────────────────────────────────────────────────────────────────────

describe('worldTimeMiddleware — clock', () => {
  it('dispatching tickWorldTime directly advances currentTime', () => {
    const store = makeStore({ currentTime: 10 });
    store.dispatch(tickWorldTime());
    expect(store.getState().worldTime.currentTime).toBe(11);
  });

  it('clock advances through a full period cycle via manual ticks', () => {
    const store = makeStore({ currentTime: 0 });

    // Tick to boundary of day
    for (let i = 0; i < 15; i++) store.dispatch(tickWorldTime());
    expect(getCurrentTimePeriod(store.getState())).toBe('day');

    // Tick to dusk
    for (let i = 0; i < 15; i++) store.dispatch(tickWorldTime());
    expect(getCurrentTimePeriod(store.getState())).toBe('dusk');

    // Tick to night
    for (let i = 0; i < 15; i++) store.dispatch(tickWorldTime());
    expect(getCurrentTimePeriod(store.getState())).toBe('night');

    // Tick back to dawn
    for (let i = 0; i < 15; i++) store.dispatch(tickWorldTime());
    expect(getCurrentTimePeriod(store.getState())).toBe('dawn');
  });

  it('setWeatherBatch from middleware populates all 8 zones', () => {
    const store = makeStore({ currentTime: 0 });
    const batch = rollAllZoneWeather(999);
    store.dispatch(setWeatherBatch(batch));
    CORE_ZONE_IDS.forEach((zoneId) => {
      expect(WEATHER_TYPES).toContain(store.getState().worldTime.weatherByZone[zoneId]);
    });
  });
});
