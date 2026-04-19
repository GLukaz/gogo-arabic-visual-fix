import { describe, it, expect } from 'vitest';
import { getXPForLevel, getLevelFromXP, XP_REWARDS, DIRHAM_REWARDS } from '../xpCalculator.js';

describe('getXPForLevel', () => {
  it('should return 0 for level 1 or below', () => {
    expect(getXPForLevel(1)).toBe(0);
    expect(getXPForLevel(0)).toBe(0);
    expect(getXPForLevel(-5)).toBe(0);
  });

  it('should return correct XP thresholds for levels 2-20', () => {
    expect(getXPForLevel(2)).toBe(100);
    expect(getXPForLevel(3)).toBe(250);
    expect(getXPForLevel(5)).toBe(700);
    expect(getXPForLevel(10)).toBe(2800);
    expect(getXPForLevel(15)).toBe(7000);
    expect(getXPForLevel(20)).toBe(14000);
  });

  it('should calculate correct XP for levels above 20', () => {
    // Level 21 = XP_TABLE[19] + (21 - 20) * 2000 = 14000 + 2000 = 16000
    expect(getXPForLevel(21)).toBe(16000);

    // Level 25 = 14000 + (5 * 2000) = 24000
    expect(getXPForLevel(25)).toBe(24000);

    // Level 50 = 14000 + (30 * 2000) = 74000
    expect(getXPForLevel(50)).toBe(74000);
  });

  it('should return increasing values for higher levels', () => {
    const level5XP = getXPForLevel(5);
    const level10XP = getXPForLevel(10);
    const level15XP = getXPForLevel(15);

    expect(level10XP).toBeGreaterThan(level5XP);
    expect(level15XP).toBeGreaterThan(level10XP);
  });
});

describe('getLevelFromXP', () => {
  it('should return level 1 for 0 XP', () => {
    expect(getLevelFromXP(0)).toBe(1);
  });

  it('should return level 1 for XP below level 2 threshold', () => {
    expect(getLevelFromXP(50)).toBe(1);
    expect(getLevelFromXP(99)).toBe(1);
  });

  it('should return correct levels for various XP amounts', () => {
    // Level 2 requires 100 XP total
    expect(getLevelFromXP(100)).toBe(2);
    expect(getLevelFromXP(150)).toBe(2);

    // Level 3 requires cumulative: 100 + 250 = 350 XP total, so 250 is still level 2
    expect(getLevelFromXP(250)).toBe(2);

    // getLevelFromXP sums getXPForLevel() values: 0+100+250+450=800 for level 4
    // 700 < 800, so 700 XP = level 3
    expect(getLevelFromXP(700)).toBe(3);
  });

  it('should handle very high XP values', () => {
    const highXP = 100000;
    const level = getLevelFromXP(highXP);

    expect(level).toBeGreaterThanOrEqual(20);
    expect(level).toBeLessThanOrEqual(100);
  });

  it('should cap at level 100', () => {
    const veryHighXP = 999999999;
    expect(getLevelFromXP(veryHighXP)).toBe(100);
  });

  it('should be consistent with getXPForLevel', () => {
    // If we have exactly the XP for a level, we should be at that level
    const level10Cumulative = [2, 3, 4, 5, 6, 7, 8, 9, 10]
      .reduce((sum, lvl) => sum + getXPForLevel(lvl), 0);

    expect(getLevelFromXP(level10Cumulative)).toBe(10);
  });
});

describe('XP_REWARDS', () => {
  it('should have all expected reward types', () => {
    expect(XP_REWARDS).toHaveProperty('CORRECT_ANSWER');
    expect(XP_REWARDS).toHaveProperty('STREAK_BONUS');
    expect(XP_REWARDS).toHaveProperty('PERFECT_QUIZ');
    expect(XP_REWARDS).toHaveProperty('NEW_WORD');
    expect(XP_REWARDS).toHaveProperty('QUEST_STEP');
    expect(XP_REWARDS).toHaveProperty('MAIN_QUEST');
  });

  it('should have numeric values for all rewards', () => {
    Object.values(XP_REWARDS).forEach(value => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should have sensible reward scaling', () => {
    // Main quest should reward more than side quest
    expect(XP_REWARDS.MAIN_QUEST).toBeGreaterThan(XP_REWARDS.SIDE_QUEST);

    // Perfect quiz should reward more than single correct answer
    expect(XP_REWARDS.PERFECT_QUIZ).toBeGreaterThan(XP_REWARDS.CORRECT_ANSWER);

    // Review Easy should reward more than Review Hard
    expect(XP_REWARDS.REVIEW_EASY).toBeGreaterThan(XP_REWARDS.REVIEW_HARD);
  });
});

describe('DIRHAM_REWARDS', () => {
  it('should have all expected reward types', () => {
    expect(DIRHAM_REWARDS).toHaveProperty('QUEST_STEP');
    expect(DIRHAM_REWARDS).toHaveProperty('MAIN_QUEST');
    expect(DIRHAM_REWARDS).toHaveProperty('TREASURE_CHEST_MIN');
    expect(DIRHAM_REWARDS).toHaveProperty('TREASURE_CHEST_MAX');
  });

  it('should have numeric values for all rewards', () => {
    Object.values(DIRHAM_REWARDS).forEach(value => {
      expect(typeof value).toBe('number');
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should have treasure chest max greater than min', () => {
    expect(DIRHAM_REWARDS.TREASURE_CHEST_MAX).toBeGreaterThan(DIRHAM_REWARDS.TREASURE_CHEST_MIN);
  });
});
