import { describe, it, expect } from 'vitest';
import {
  getBossForZone,
  isBossDefeated,
  calculateBossDamage,
  zoneBossData,
} from '../zoneBosses.js';
import { OPPONENT_ZONES } from '../battleOpponents.js';

// ─── getBossForZone ──────────────────────────────────────────────────────────

describe('getBossForZone', () => {
  it('returns a boss for each of the 8 zones', () => {
    for (const zone of OPPONENT_ZONES) {
      const boss = getBossForZone(zone);
      expect(boss, `Expected boss for zone: ${zone}`).toBeDefined();
      expect(boss.zone).toBe(zone);
    }
  });

  it('returns undefined for an unknown zone', () => {
    expect(getBossForZone('unknown_zone')).toBeUndefined();
  });

  it('returns undefined for empty string zone', () => {
    expect(getBossForZone('')).toBeUndefined();
  });

  it('returns the correct boss for ancient_library', () => {
    const boss = getBossForZone('ancient_library');
    expect(boss.id).toBe('grammar_master_library');
  });

  it('returned boss has all required fields', () => {
    const boss = getBossForZone('oasis_village');
    expect(boss).toHaveProperty('id');
    expect(boss).toHaveProperty('name');
    expect(boss).toHaveProperty('zone');
    expect(boss).toHaveProperty('level');
    expect(boss).toHaveProperty('baseHP');
    expect(boss).toHaveProperty('rewards');
    expect(boss).toHaveProperty('specialMechanic');
    expect(boss).toHaveProperty('dialogue');
  });
});

// ─── isBossDefeated ─────────────────────────────────────────────────────────

describe('isBossDefeated', () => {
  it('returns false when flag is not set', () => {
    const playerState = { worldState: { flags: {}, counters: {} } };
    expect(isBossDefeated('oasis_village', playerState)).toBe(false);
  });

  it('returns true when defeat flag is set for the zone', () => {
    const playerState = {
      worldState: { flags: { boss_defeated_oasis_village: true }, counters: {} },
    };
    expect(isBossDefeated('oasis_village', playerState)).toBe(true);
  });

  it('returns false when a different zone flag is set', () => {
    const playerState = {
      worldState: { flags: { boss_defeated_ancient_library: true }, counters: {} },
    };
    expect(isBossDefeated('oasis_village', playerState)).toBe(false);
  });

  it('returns false for null playerState', () => {
    expect(isBossDefeated('oasis_village', null)).toBe(false);
  });

  it('returns false for undefined playerState', () => {
    expect(isBossDefeated('oasis_village', undefined)).toBe(false);
  });

  it('returns false when worldState is missing', () => {
    expect(isBossDefeated('oasis_village', {})).toBe(false);
  });

  it('correctly reads defeat flags for all 8 zones', () => {
    for (const zone of OPPONENT_ZONES) {
      const key = `boss_defeated_${zone}`;
      const playerState = { worldState: { flags: { [key]: true }, counters: {} } };
      expect(isBossDefeated(zone, playerState)).toBe(true);
    }
  });
});

// ─── calculateBossDamage ────────────────────────────────────────────────────

describe('calculateBossDamage', () => {
  it('returns 0 when answer is incorrect', () => {
    expect(calculateBossDamage(false, 1, 1)).toBe(0);
    expect(calculateBossDamage(false, 0.5, 2)).toBe(0);
  });

  it('returns base damage of 10 for correct answer with no bonus', () => {
    expect(calculateBossDamage(true, 0, 1)).toBe(10);
  });

  it('adds time bonus up to 10 for maximum speed (timeBonus=1)', () => {
    expect(calculateBossDamage(true, 1, 1)).toBe(20); // 10 + 10 * 1
  });

  it('adds partial time bonus for timeBonus=0.5', () => {
    // speedBonus = floor(0.5 * 10) = 5 → (10 + 5) * 1 = 15
    expect(calculateBossDamage(true, 0.5, 1)).toBe(15);
  });

  it('applies combo multiplier correctly', () => {
    // (10 + 0) * 2 = 20
    expect(calculateBossDamage(true, 0, 2)).toBe(20);
  });

  it('applies both time bonus and combo together', () => {
    // speedBonus = floor(0.5 * 10) = 5 → (10 + 5) * 2 = 30
    expect(calculateBossDamage(true, 0.5, 2)).toBe(30);
  });

  it('clamps timeBonus above 1 to 1', () => {
    expect(calculateBossDamage(true, 2, 1)).toBe(20); // same as timeBonus=1
  });

  it('clamps negative timeBonus to 0', () => {
    expect(calculateBossDamage(true, -1, 1)).toBe(10); // same as timeBonus=0
  });

  it('uses combo=1 as default', () => {
    expect(calculateBossDamage(true, 0)).toBe(10);
  });

  it('uses timeBonus=0 as default', () => {
    expect(calculateBossDamage(true)).toBe(10);
  });

  it('combo below 1 is treated as 1 (minimum multiplier)', () => {
    expect(calculateBossDamage(true, 0, 0.5)).toBe(10);
  });

  it('returns a non-negative integer', () => {
    const damage = calculateBossDamage(true, 0.33, 1.5);
    expect(damage).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(damage)).toBe(true);
  });
});

// ─── zoneBossData export ─────────────────────────────────────────────────────

describe('zoneBossData default export', () => {
  it('re-exports all 8 boss encounters', () => {
    expect(Array.isArray(zoneBossData)).toBe(true);
    expect(zoneBossData).toHaveLength(8);
  });
});
