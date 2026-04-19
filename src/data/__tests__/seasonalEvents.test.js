/**
 * seasonalEvents.test.js — Data integrity tests for seasonal event definitions (Phase 86)
 *
 * Tests:
 *   - SEASONAL_EVENTS structure and required fields
 *   - Vocabulary counts (Ramadan=20, Eid al-Fitr=10, Eid al-Adha=10)
 *   - Vocabulary field completeness (id, arabic, english, transliteration, category)
 *   - Quest field completeness (id, title, target, trackEvent, reward)
 *   - XP multiplier values
 *   - Unique IDs across all vocabulary and quests
 *   - Helper function correctness
 */

import { describe, it, expect } from 'vitest';
import {
  SEASONAL_EVENTS,
  getSeasonalEvent,
  getSeasonalVocabulary,
  getSeasonalQuests,
  getRamadanDailyTheme,
} from '../../data/seasonalEvents.js';

// ── SEASONAL_EVENTS structure ───────────────────────────────────────────────

describe('SEASONAL_EVENTS structure', () => {
  it('Test 1: has exactly 3 events: ramadan, eid_fitr, eid_adha', () => {
    const keys = Object.keys(SEASONAL_EVENTS);
    expect(keys).toContain('ramadan');
    expect(keys).toContain('eid_fitr');
    expect(keys).toContain('eid_adha');
    expect(keys).toHaveLength(3);
  });

  it('Test 2: each event has required top-level fields', () => {
    const requiredFields = [
      'id', 'name', 'nameArabic', 'greeting', 'greetingEnglish',
      'description', 'descriptionArabic', 'duration', 'xpMultiplier',
      'themeColor', 'accentColor', 'icon', 'specialVocabulary', 'quests',
    ];
    for (const [key, event] of Object.entries(SEASONAL_EVENTS)) {
      for (const field of requiredFields) {
        expect(event).toHaveProperty(field);
      }
    }
  });

  it('Test 3: event IDs match their object keys', () => {
    for (const [key, event] of Object.entries(SEASONAL_EVENTS)) {
      expect(event.id).toBe(key);
    }
  });

  it('Test 4: all event names are non-empty strings', () => {
    for (const event of Object.values(SEASONAL_EVENTS)) {
      expect(typeof event.name).toBe('string');
      expect(event.name.length).toBeGreaterThan(0);
      expect(typeof event.nameArabic).toBe('string');
      expect(event.nameArabic.length).toBeGreaterThan(0);
    }
  });

  it('Test 5: all greetings are non-empty strings', () => {
    for (const event of Object.values(SEASONAL_EVENTS)) {
      expect(typeof event.greeting).toBe('string');
      expect(event.greeting.length).toBeGreaterThan(0);
      expect(typeof event.greetingEnglish).toBe('string');
      expect(event.greetingEnglish.length).toBeGreaterThan(0);
    }
  });
});

// ── XP Multipliers ──────────────────────────────────────────────────────────

describe('XP multipliers', () => {
  it('Test 6: Ramadan has 1.25x XP multiplier', () => {
    expect(SEASONAL_EVENTS.ramadan.xpMultiplier).toBe(1.25);
  });

  it('Test 7: Eid al-Fitr has 1.5x XP multiplier', () => {
    expect(SEASONAL_EVENTS.eid_fitr.xpMultiplier).toBe(1.5);
  });

  it('Test 8: Eid al-Adha has 1.5x XP multiplier', () => {
    expect(SEASONAL_EVENTS.eid_adha.xpMultiplier).toBe(1.5);
  });

  it('Test 9: all multipliers are greater than 1', () => {
    for (const event of Object.values(SEASONAL_EVENTS)) {
      expect(event.xpMultiplier).toBeGreaterThan(1);
    }
  });
});

// ── Event Durations ─────────────────────────────────────────────────────────

describe('Event durations', () => {
  it('Test 10: Ramadan lasts 30 days', () => {
    expect(SEASONAL_EVENTS.ramadan.duration).toBe(30);
  });

  it('Test 11: Eid al-Fitr lasts 3 days', () => {
    expect(SEASONAL_EVENTS.eid_fitr.duration).toBe(3);
  });

  it('Test 12: Eid al-Adha lasts 4 days', () => {
    expect(SEASONAL_EVENTS.eid_adha.duration).toBe(4);
  });
});

// ── Vocabulary ──────────────────────────────────────────────────────────────

describe('Vocabulary data', () => {
  it('Test 13: Ramadan has exactly 20 vocabulary words', () => {
    expect(SEASONAL_EVENTS.ramadan.specialVocabulary).toHaveLength(20);
  });

  it('Test 14: Eid al-Fitr has exactly 10 vocabulary words', () => {
    expect(SEASONAL_EVENTS.eid_fitr.specialVocabulary).toHaveLength(10);
  });

  it('Test 15: Eid al-Adha has exactly 10 vocabulary words', () => {
    expect(SEASONAL_EVENTS.eid_adha.specialVocabulary).toHaveLength(10);
  });

  it('Test 16: every vocabulary word has required fields', () => {
    const requiredFields = ['id', 'arabic', 'english', 'transliteration', 'category'];
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const word of event.specialVocabulary) {
        for (const field of requiredFields) {
          expect(word).toHaveProperty(field);
          expect(typeof word[field]).toBe('string');
          expect(word[field].length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('Test 17: all vocabulary IDs are unique across all events', () => {
    const allIds = [];
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const word of event.specialVocabulary) {
        allIds.push(word.id);
      }
    }
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('Test 18: all Arabic text contains Arabic characters', () => {
    const arabicRegex = /[\u0600-\u06FF]/;
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const word of event.specialVocabulary) {
        expect(arabicRegex.test(word.arabic)).toBe(true);
      }
    }
  });

  it('Test 19: vocabulary categories are valid', () => {
    const validCategories = ['religion', 'food', 'culture'];
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const word of event.specialVocabulary) {
        expect(validCategories).toContain(word.category);
      }
    }
  });

  it('Test 20: Ramadan vocabulary covers food, religion, and culture categories', () => {
    const categories = new Set(
      SEASONAL_EVENTS.ramadan.specialVocabulary.map((w) => w.category)
    );
    expect(categories.has('food')).toBe(true);
    expect(categories.has('religion')).toBe(true);
    expect(categories.has('culture')).toBe(true);
  });
});

// ── Quests ──────────────────────────────────────────────────────────────────

describe('Quest data', () => {
  it('Test 21: Ramadan has 3 quests', () => {
    expect(SEASONAL_EVENTS.ramadan.quests).toHaveLength(3);
  });

  it('Test 22: Eid al-Fitr has 1 quest', () => {
    expect(SEASONAL_EVENTS.eid_fitr.quests).toHaveLength(1);
  });

  it('Test 23: Eid al-Adha has 1 quest', () => {
    expect(SEASONAL_EVENTS.eid_adha.quests).toHaveLength(1);
  });

  it('Test 24: every quest has required fields', () => {
    const requiredFields = ['id', 'title', 'titleArabic', 'description', 'target', 'trackEvent', 'reward'];
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const quest of event.quests) {
        for (const field of requiredFields) {
          expect(quest).toHaveProperty(field);
        }
      }
    }
  });

  it('Test 25: all quest IDs are unique across all events', () => {
    const allIds = [];
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const quest of event.quests) {
        allIds.push(quest.id);
      }
    }
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);
  });

  it('Test 26: all quest targets are positive integers', () => {
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const quest of event.quests) {
        expect(quest.target).toBeGreaterThan(0);
        expect(Number.isInteger(quest.target)).toBe(true);
      }
    }
  });

  it('Test 27: all quest rewards have xp and dirhams', () => {
    for (const event of Object.values(SEASONAL_EVENTS)) {
      for (const quest of event.quests) {
        expect(quest.reward).toHaveProperty('xp');
        expect(quest.reward).toHaveProperty('dirhams');
        expect(quest.reward.xp).toBeGreaterThan(0);
        expect(quest.reward.dirhams).toBeGreaterThan(0);
      }
    }
  });
});

// ── Ramadan Daily Themes ────────────────────────────────────────────────────

describe('Ramadan daily themes', () => {
  it('Test 28: Ramadan has dailyThemes array', () => {
    expect(Array.isArray(SEASONAL_EVENTS.ramadan.dailyThemes)).toBe(true);
    expect(SEASONAL_EVENTS.ramadan.dailyThemes.length).toBeGreaterThan(0);
  });

  it('Test 29: each theme has day, theme, and themeArabic fields', () => {
    for (const theme of SEASONAL_EVENTS.ramadan.dailyThemes) {
      expect(theme).toHaveProperty('day');
      expect(theme).toHaveProperty('theme');
      expect(theme).toHaveProperty('themeArabic');
    }
  });

  it('Test 30: theme days are in ascending order', () => {
    const days = SEASONAL_EVENTS.ramadan.dailyThemes.map((t) => t.day);
    for (let i = 1; i < days.length; i++) {
      expect(days[i]).toBeGreaterThan(days[i - 1]);
    }
  });
});

// ── Helper Functions ────────────────────────────────────────────────────────

describe('getSeasonalEvent', () => {
  it('Test 31: returns Ramadan event for "ramadan" ID', () => {
    const event = getSeasonalEvent('ramadan');
    expect(event).not.toBeNull();
    expect(event.name).toBe('Ramadan');
  });

  it('Test 32: returns null for unknown event ID', () => {
    expect(getSeasonalEvent('christmas')).toBeNull();
  });
});

describe('getSeasonalVocabulary', () => {
  it('Test 33: returns 20 words for Ramadan', () => {
    expect(getSeasonalVocabulary('ramadan')).toHaveLength(20);
  });

  it('Test 34: returns empty array for unknown event', () => {
    expect(getSeasonalVocabulary('unknown')).toEqual([]);
  });
});

describe('getSeasonalQuests', () => {
  it('Test 35: returns 3 quests for Ramadan', () => {
    expect(getSeasonalQuests('ramadan')).toHaveLength(3);
  });

  it('Test 36: returns empty array for unknown event', () => {
    expect(getSeasonalQuests('unknown')).toEqual([]);
  });
});

describe('getRamadanDailyTheme', () => {
  it('Test 37: returns first theme for day 1', () => {
    const theme = getRamadanDailyTheme(1);
    expect(theme).not.toBeNull();
    expect(theme.day).toBe(1);
  });

  it('Test 38: returns "Mercy" theme for day 15 (closest <= 15 is day 10)', () => {
    const theme = getRamadanDailyTheme(15);
    expect(theme).not.toBeNull();
    expect(theme.day).toBe(10);
    expect(theme.theme).toBe('Mercy');
  });

  it('Test 39: returns null for day 0', () => {
    expect(getRamadanDailyTheme(0)).toBeNull();
  });

  it('Test 40: returns null for day 31', () => {
    expect(getRamadanDailyTheme(31)).toBeNull();
  });

  it('Test 41: returns the last theme for day 30', () => {
    const theme = getRamadanDailyTheme(30);
    expect(theme).not.toBeNull();
    expect(theme.day).toBe(30);
    expect(theme.theme).toBe('Farewell');
  });
});
