import { describe, it, expect } from 'vitest';
import {
  createSeededRng,
  dateToInt,
  dateToWeekInt,
  scaleTarget,
  scaleXp,
  generateDailyQuests,
  generateWeeklyQuest,
} from '../questGenerator.js';

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

describe('createSeededRng', () => {
  it('produces values in [0, 1)', () => {
    const rng = createSeededRng(42);
    for (let i = 0; i < 100; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it('same seed produces same sequence', () => {
    const a = createSeededRng(12345);
    const b = createSeededRng(12345);
    for (let i = 0; i < 10; i++) {
      expect(a()).toBe(b());
    }
  });

  it('different seeds produce different sequences', () => {
    const a = createSeededRng(1);
    const b = createSeededRng(2);
    const aVals = Array.from({ length: 5 }, () => a());
    const bVals = Array.from({ length: 5 }, () => b());
    expect(aVals).not.toEqual(bVals);
  });
});

describe('dateToInt', () => {
  it('converts a Date to YYYYMMDD integer', () => {
    expect(dateToInt(new Date('2026-04-06T00:00:00Z'))).toBe(20260406);
  });

  it('converts a date string', () => {
    expect(dateToInt('2026-01-01T00:00:00Z')).toBe(20260101);
  });

  it('handles December 31', () => {
    expect(dateToInt(new Date('2026-12-31T00:00:00Z'))).toBe(20261231);
  });
});

describe('dateToWeekInt', () => {
  it('returns an integer year+week', () => {
    const result = dateToWeekInt(new Date('2026-04-06T00:00:00Z'));
    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThan(202600);
  });

  it('same week returns same integer', () => {
    // Monday and Sunday of the same ISO week
    const mon = dateToWeekInt(new Date('2026-03-30T00:00:00Z'));
    const sun = dateToWeekInt(new Date('2026-04-05T00:00:00Z'));
    expect(mon).toBe(sun);
  });

  it('consecutive weeks return different integers', () => {
    const w1 = dateToWeekInt(new Date('2026-03-30T00:00:00Z'));
    const w2 = dateToWeekInt(new Date('2026-04-06T00:00:00Z'));
    expect(w1).not.toBe(w2);
  });
});

describe('scaleTarget', () => {
  it('returns base at level 1', () => {
    expect(scaleTarget(5, 2, 5, 20, 1)).toBe(5);
  });

  it('increases at level 5', () => {
    expect(scaleTarget(5, 2, 5, 20, 5)).toBe(7);
  });

  it('clamps to max', () => {
    expect(scaleTarget(5, 2, 5, 20, 100)).toBe(20);
  });

  it('clamps to min', () => {
    expect(scaleTarget(10, 2, 10, 20, 0)).toBe(10);
  });
});

describe('scaleXp', () => {
  it('returns base at level 1', () => {
    expect(scaleXp(100, 1)).toBe(100);
  });

  it('increases with level', () => {
    expect(scaleXp(100, 10)).toBeGreaterThan(100);
  });

  it('scales by 10% per level above 1', () => {
    expect(scaleXp(100, 2)).toBe(110);
    expect(scaleXp(100, 3)).toBe(120);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateDailyQuests
// ─────────────────────────────────────────────────────────────────────────────

describe('generateDailyQuests', () => {
  const date = new Date('2026-04-06T00:00:00Z');
  const playerState = { level: 5 };

  it('returns exactly 3 quests', () => {
    const quests = generateDailyQuests(playerState, date);
    expect(quests).toHaveLength(3);
  });

  it('is deterministic — same date + level = same quests', () => {
    const a = generateDailyQuests(playerState, date);
    const b = generateDailyQuests(playerState, date);
    expect(a.map(q => q.id)).toEqual(b.map(q => q.id));
  });

  it('different date → different quests', () => {
    const other = new Date('2026-04-07T00:00:00Z');
    const a = generateDailyQuests(playerState, date);
    const b = generateDailyQuests(playerState, other);
    // At least one quest should differ
    const sameIds = a.map(q => q.id).every((id, i) => id === b[i].id);
    expect(sameIds).toBe(false);
  });

  it('different level → different quests', () => {
    const a = generateDailyQuests({ level: 1 }, date);
    const b = generateDailyQuests({ level: 20 }, date);
    expect(a.map(q => q.id)).not.toEqual(b.map(q => q.id));
  });

  it('all quests have required fields', () => {
    const quests = generateDailyQuests(playerState, date);
    for (const q of quests) {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('title');
      expect(q).toHaveProperty('titleArabic');
      expect(q).toHaveProperty('description');
      expect(q).toHaveProperty('descriptionArabic');
      expect(q).toHaveProperty('type', 'daily');
      expect(q).toHaveProperty('target');
      expect(q).toHaveProperty('trackEvent');
      expect(q).toHaveProperty('autoStart', true);
      expect(q).toHaveProperty('prerequisites');
      expect(q.prerequisites).toEqual([]);
      expect(q).toHaveProperty('reward');
      expect(q.reward).toHaveProperty('xp');
      expect(q.reward).toHaveProperty('dirhams');
      expect(q).toHaveProperty('isGenerated', true);
    }
  });

  it('generates 3 distinct template types (no template repeats)', () => {
    const quests = generateDailyQuests(playerState, date);
    const types = quests.map(q => q.templateType);
    const unique = new Set(types);
    expect(unique.size).toBe(3);
  });

  it('all 4 template types can appear across different dates', () => {
    const seen = new Set();
    for (let day = 1; day <= 30; day++) {
      const d = new Date(`2026-04-${String(day).padStart(2, '0')}T00:00:00Z`);
      const quests = generateDailyQuests(playerState, d);
      quests.forEach(q => seen.add(q.templateType));
    }
    expect(seen.has('vocab_collection')).toBe(true);
    expect(seen.has('battle_wins')).toBe(true);
    expect(seen.has('crafting')).toBe(true);
    expect(seen.has('npc_interaction')).toBe(true);
  });

  it('difficulty scales with level — higher level has larger targets', () => {
    const low = generateDailyQuests({ level: 1 }, date);
    const high = generateDailyQuests({ level: 50 }, date);
    const lowTotal = low.reduce((s, q) => s + q.target, 0);
    const highTotal = high.reduce((s, q) => s + q.target, 0);
    expect(highTotal).toBeGreaterThanOrEqual(lowTotal);
  });

  it('targets are positive integers', () => {
    const quests = generateDailyQuests(playerState, date);
    for (const q of quests) {
      expect(q.target).toBeGreaterThan(0);
      expect(Number.isInteger(q.target)).toBe(true);
    }
  });

  it('XP rewards are positive and scale with level', () => {
    const low = generateDailyQuests({ level: 1 }, date);
    const high = generateDailyQuests({ level: 50 }, date);
    for (const q of low) {
      expect(q.reward.xp).toBeGreaterThan(0);
    }
    const lowXpTotal = low.reduce((s, q) => s + q.reward.xp, 0);
    const highXpTotal = high.reduce((s, q) => s + q.reward.xp, 0);
    expect(highXpTotal).toBeGreaterThan(lowXpTotal);
  });

  it('handles missing level gracefully (defaults to 1)', () => {
    expect(() => generateDailyQuests({}, date)).not.toThrow();
    expect(() => generateDailyQuests(null, date)).not.toThrow();
  });

  it('date string works as well as Date object', () => {
    const a = generateDailyQuests(playerState, new Date('2026-04-06T00:00:00Z'));
    const b = generateDailyQuests(playerState, '2026-04-06T00:00:00Z');
    expect(a.map(q => q.id)).toEqual(b.map(q => q.id));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// generateWeeklyQuest
// ─────────────────────────────────────────────────────────────────────────────

describe('generateWeeklyQuest', () => {
  const date = new Date('2026-04-06T00:00:00Z');
  const playerState = { level: 5 };

  it('returns exactly 1 quest', () => {
    const quest = generateWeeklyQuest(playerState, date);
    expect(typeof quest).toBe('object');
    expect(Array.isArray(quest)).toBe(false);
  });

  it('quest has type weekly', () => {
    const quest = generateWeeklyQuest(playerState, date);
    expect(quest.type).toBe('weekly');
  });

  it('is deterministic — same week + level = same quest', () => {
    // Monday and Friday of the same week
    const mon = new Date('2026-03-30T00:00:00Z');
    const fri = new Date('2026-04-03T00:00:00Z');
    const a = generateWeeklyQuest(playerState, mon);
    const b = generateWeeklyQuest(playerState, fri);
    expect(a.id).toBe(b.id);
  });

  it('different week → potentially different quest', () => {
    const w1 = new Date('2026-03-30T00:00:00Z');
    const w2 = new Date('2026-04-06T00:00:00Z');
    // They could differ (not guaranteed but seeded differently)
    const a = generateWeeklyQuest(playerState, w1);
    const b = generateWeeklyQuest(playerState, w2);
    expect(a.id).not.toBe(b.id);
  });

  it('has a larger target than corresponding daily quests', () => {
    const weekly = generateWeeklyQuest(playerState, date);
    const daily = generateDailyQuests(playerState, date);
    const maxDailyTarget = Math.max(...daily.map(q => q.target));
    expect(weekly.target).toBeGreaterThan(maxDailyTarget);
  });

  it('has all required quest fields', () => {
    const q = generateWeeklyQuest(playerState, date);
    expect(q).toHaveProperty('id');
    expect(q).toHaveProperty('title');
    expect(q).toHaveProperty('titleArabic');
    expect(q).toHaveProperty('description');
    expect(q).toHaveProperty('type', 'weekly');
    expect(q).toHaveProperty('target');
    expect(q).toHaveProperty('trackEvent');
    expect(q).toHaveProperty('reward');
    expect(q.reward.xp).toBeGreaterThan(0);
    expect(q).toHaveProperty('isGenerated', true);
  });
});
