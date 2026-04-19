import { describe, it, expect } from 'vitest';
import {
  getActiveEvents,
  getNextEvent,
  getVocabBoostCategories,
  isEventActive,
  getEventTimeRemaining,
  EVENT_SCHEDULE,
} from '../eventScheduler.js';
import { FACTION_EVENTS } from '../../data/factionEvents.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Convert hours to minutes for readability. */
const h = (hours) => hours * 60;

// ─────────────────────────────────────────────────────────────────────────────
// EVENT_SCHEDULE sanity
// ─────────────────────────────────────────────────────────────────────────────

describe('EVENT_SCHEDULE', () => {
  it('has an entry for every event in FACTION_EVENTS', () => {
    for (const event of FACTION_EVENTS) {
      expect(EVENT_SCHEDULE).toHaveProperty(event.id);
    }
  });

  it('weekly events have a dayOfWeek property', () => {
    const weeklyEvents = FACTION_EVENTS.filter((e) => e.schedule === 'weekly');
    for (const event of weeklyEvents) {
      const sched = EVENT_SCHEDULE[event.id];
      expect(sched.dayOfWeek).toBeGreaterThanOrEqual(0);
      expect(sched.dayOfWeek).toBeLessThanOrEqual(6);
    }
  });

  it('daily events do NOT have a dayOfWeek property', () => {
    const dailyEvents = FACTION_EVENTS.filter((e) => e.schedule === 'daily');
    for (const event of dailyEvents) {
      const sched = EVENT_SCHEDULE[event.id];
      expect(sched.dayOfWeek).toBeUndefined();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getActiveEvents
// ─────────────────────────────────────────────────────────────────────────────

describe('getActiveEvents', () => {
  it('returns calligraphy_workshop at 14:30 (daily event)', () => {
    const active = getActiveEvents(h(14) + 30, 2); // Tuesday 14:30
    const ids = active.map((e) => e.id);
    expect(ids).toContain('calligraphy_workshop');
  });

  it('does NOT return calligraphy_workshop at 13:00 (before window)', () => {
    const active = getActiveEvents(h(13), 2);
    const ids = active.map((e) => e.id);
    expect(ids).not.toContain('calligraphy_workshop');
  });

  it('does NOT return calligraphy_workshop at 16:00 (at end boundary)', () => {
    const active = getActiveEvents(h(16), 2);
    const ids = active.map((e) => e.id);
    expect(ids).not.toContain('calligraphy_workshop');
  });

  it('returns daily events on any day of the week', () => {
    // training_ground_drill: 06:00-07:00, daily
    for (let day = 0; day <= 6; day++) {
      const active = getActiveEvents(h(6) + 15, day);
      const ids = active.map((e) => e.id);
      expect(ids).toContain('training_ground_drill');
    }
  });

  it('returns scholars_debate on Monday at 16:00 (weekly event)', () => {
    const active = getActiveEvents(h(16), 1); // Monday
    const ids = active.map((e) => e.id);
    expect(ids).toContain('scholars_debate');
  });

  it('does NOT return scholars_debate on Tuesday at 16:00 (wrong day)', () => {
    const active = getActiveEvents(h(16), 2); // Tuesday
    const ids = active.map((e) => e.id);
    expect(ids).not.toContain('scholars_debate');
  });

  it('returns multiple events when their windows overlap', () => {
    // At Monday 16:30: calligraphy_workshop (14-16 NO, past 16),
    //   navigators_circle (16-18 YES), scholars_debate (Mon 15-19 YES)
    const active = getActiveEvents(h(16) + 30, 1);
    const ids = active.map((e) => e.id);
    expect(ids).toContain('navigators_circle');
    expect(ids).toContain('scholars_debate');
  });

  it('returns empty array when no events are active', () => {
    // 02:00 — nothing runs at 2 AM
    const active = getActiveEvents(h(2), 2);
    expect(active).toHaveLength(0);
  });

  it('returns empty array at midnight', () => {
    const active = getActiveEvents(0, 2);
    expect(active).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isEventActive
// ─────────────────────────────────────────────────────────────────────────────

describe('isEventActive', () => {
  it('returns true for an active daily event within its window', () => {
    expect(isEventActive('oud_evening', h(20), 3)).toBe(true);
  });

  it('returns false for a daily event outside its window', () => {
    expect(isEventActive('oud_evening', h(18), 3)).toBe(false);
  });

  it('returns true for a weekly event on correct day and time', () => {
    expect(isEventActive('market_festival', h(12), 3)).toBe(true); // Wednesday noon
  });

  it('returns false for a weekly event on wrong day', () => {
    expect(isEventActive('market_festival', h(12), 1)).toBe(false); // Monday noon
  });

  it('returns false for unknown event ID', () => {
    expect(isEventActive('nonexistent_event', h(12), 3)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNextEvent
// ─────────────────────────────────────────────────────────────────────────────

describe('getNextEvent', () => {
  it('returns the soonest upcoming event', () => {
    // At 05:00 Tuesday, next should be training_ground_drill at 06:00
    const next = getNextEvent(h(5), 2);
    expect(next).not.toBeNull();
    expect(next.event.id).toBe('training_ground_drill');
    expect(next.minutesUntil).toBe(60); // 1 hour
  });

  it('skips events whose windows have already started', () => {
    // At 06:30 on Tuesday, training_ground_drill (06:00) has already started
    const next = getNextEvent(h(6) + 30, 2);
    expect(next).not.toBeNull();
    expect(next.event.id).not.toBe('training_ground_drill');
  });

  it('finds weekly events on future days', () => {
    // At 22:00 on Tuesday (day 2), nothing left today.
    // Next daily = training_ground_drill at 06:00 tomorrow (8h away = 480min)
    const next = getNextEvent(h(22), 2);
    expect(next).not.toBeNull();
    expect(next.minutesUntil).toBeGreaterThan(0);
  });

  it('returns a result with minutesUntil > 0', () => {
    const next = getNextEvent(h(12), 0);
    expect(next).not.toBeNull();
    expect(next.minutesUntil).toBeGreaterThan(0);
  });

  it('returns null only if no events exist (defensive)', () => {
    // With 12 events, there is always a next event within 7 days
    const next = getNextEvent(0, 0);
    expect(next).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getVocabBoostCategories
// ─────────────────────────────────────────────────────────────────────────────

describe('getVocabBoostCategories', () => {
  it('extracts unique categories from active events', () => {
    const events = [
      { vocabBoost: 'academic' },
      { vocabBoost: 'calligraphy' },
      { vocabBoost: 'academic' }, // duplicate
    ];
    const cats = getVocabBoostCategories(events);
    expect(cats).toEqual(['academic', 'calligraphy']);
  });

  it('returns empty array when no events provided', () => {
    expect(getVocabBoostCategories([])).toEqual([]);
  });

  it('works with real active events', () => {
    const active = getActiveEvents(h(14) + 30, 2); // calligraphy_workshop active
    const cats = getVocabBoostCategories(active);
    expect(cats).toContain('calligraphy');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getEventTimeRemaining
// ─────────────────────────────────────────────────────────────────────────────

describe('getEventTimeRemaining', () => {
  it('returns correct remaining minutes for an active event', () => {
    // calligraphy_workshop: 14:00-16:00, at 14:30 = 90 min remaining
    const remaining = getEventTimeRemaining('calligraphy_workshop', h(14) + 30);
    expect(remaining).toBe(90);
  });

  it('returns 0 after event has ended', () => {
    const remaining = getEventTimeRemaining('calligraphy_workshop', h(17));
    expect(remaining).toBe(0);
  });

  it('returns 0 for unknown event', () => {
    expect(getEventTimeRemaining('fake_event', h(12))).toBe(0);
  });

  it('handles event at start boundary', () => {
    // training_ground_drill: 06:00-07:00, at 06:00 = 60 min remaining
    const remaining = getEventTimeRemaining('training_ground_drill', h(6));
    expect(remaining).toBe(60);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe('Edge cases', () => {
  it('handles gameMinutes > 1440 (wraps around)', () => {
    // 1500 minutes = 25 hours = 01:00 next day — should wrap to 1:00
    const active = getActiveEvents(1500, 2);
    // At 01:00 nothing is active
    expect(active).toHaveLength(0);
  });

  it('handles gameMinutes = 1440 (exactly midnight)', () => {
    const active = getActiveEvents(1440, 2);
    expect(active).toHaveLength(0);
  });

  it('handles negative gameMinutes gracefully', () => {
    // Should not crash
    const active = getActiveEvents(-60, 2);
    expect(Array.isArray(active)).toBe(true);
  });

  it('all 12 events are in FACTION_EVENTS', () => {
    expect(FACTION_EVENTS).toHaveLength(12);
  });

  it('caravan_departure is active on Sunday from 08:00-16:00', () => {
    expect(isEventActive('caravan_departure', h(10), 0)).toBe(true);
    expect(isEventActive('caravan_departure', h(7), 0)).toBe(false);
    expect(isEventActive('caravan_departure', h(16), 0)).toBe(false);
    expect(isEventActive('caravan_departure', h(10), 3)).toBe(false); // wrong day
  });
});
