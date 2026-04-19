/**
 * companionBackstories.test.js
 * GROW-014 — companion backstory data expansion
 */
import { describe, it, expect } from 'vitest';
import {
  COMPANION_BACKSTORIES,
  selectCompanionBackstory,
  selectGiftReaction,
} from '../companionBackstories.js';

const EXPECTED_IDS = [
  'companion_amira', 'companion_khalid', 'companion_zahra', 'companion_omar',
  'companion_layla', 'companion_hassan', 'companion_fatima', 'companion_ali',
  'companion_maryam', 'companion_samir', 'companion_nadia', 'companion_tariq',
];

describe('COMPANION_BACKSTORIES dataset', () => {
  it('has exactly 12 companions', () => {
    expect(COMPANION_BACKSTORIES).toHaveLength(12);
  });

  it('contains all expected companion IDs', () => {
    const ids = COMPANION_BACKSTORIES.map((c) => c.id);
    for (const id of EXPECTED_IDS) {
      expect(ids).toContain(id);
    }
  });

  it.each(EXPECTED_IDS)('%s has required fields', (id) => {
    const c = COMPANION_BACKSTORIES.find((x) => x.id === id);
    expect(c.name).toBeTruthy();
    expect(c.nameArabic).toBeTruthy();
    expect(Array.isArray(c.personality)).toBe(true);
    expect(c.personality.length).toBeGreaterThanOrEqual(3);
    expect(Array.isArray(c.backstory)).toBe(true);
    expect(c.backstory.length).toBeGreaterThanOrEqual(3);
    expect(Array.isArray(c.giftPreferences.loved)).toBe(true);
    expect(Array.isArray(c.giftPreferences.liked)).toBe(true);
    expect(Array.isArray(c.giftPreferences.disliked)).toBe(true);
  });

  it.each(EXPECTED_IDS)('%s has all 4 dialogue triggers with arabic+english', (id) => {
    const c = COMPANION_BACKSTORIES.find((x) => x.id === id);
    const { dialogueTriggers } = c;
    const keys = ['onLevelUp', 'onBattleWin', 'onQuestComplete', 'onLowHealth'];
    for (const key of keys) {
      expect(dialogueTriggers[key], `${id}: missing ${key}`).toBeDefined();
      expect(dialogueTriggers[key].arabic, `${id}.${key}: missing arabic`).toBeTruthy();
      expect(dialogueTriggers[key].english, `${id}.${key}: missing english`).toBeTruthy();
    }
  });
});

describe('selectCompanionBackstory', () => {
  it('returns backstory for a known id', () => {
    const result = selectCompanionBackstory('companion_amira');
    expect(result).not.toBeNull();
    expect(result.name).toBe('Amira');
  });

  it('returns null for unknown id', () => {
    expect(selectCompanionBackstory('companion_unknown')).toBeNull();
  });

  it('returns null for falsy input', () => {
    expect(selectCompanionBackstory(null)).toBeNull();
    expect(selectCompanionBackstory(undefined)).toBeNull();
  });
});

describe('selectGiftReaction', () => {
  it('returns "loved" for a loved item', () => {
    const c = COMPANION_BACKSTORIES[0]; // amira
    const lovedItem = c.giftPreferences.loved[0];
    expect(selectGiftReaction(c.id, lovedItem)).toBe('loved');
  });

  it('returns "liked" for a liked item', () => {
    const c = COMPANION_BACKSTORIES[0];
    const likedItem = c.giftPreferences.liked[0];
    expect(selectGiftReaction(c.id, likedItem)).toBe('liked');
  });

  it('returns "disliked" for a disliked item', () => {
    const c = COMPANION_BACKSTORIES[0];
    const dislikedItem = c.giftPreferences.disliked[0];
    expect(selectGiftReaction(c.id, dislikedItem)).toBe('disliked');
  });

  it('returns "neutral" for an unlisted item', () => {
    expect(selectGiftReaction('companion_amira', 'some_random_item')).toBe('neutral');
  });

  it('returns "neutral" for unknown companion', () => {
    expect(selectGiftReaction('companion_unknown', 'prayer_beads')).toBe('neutral');
  });

  it('returns "neutral" for falsy itemId', () => {
    expect(selectGiftReaction('companion_amira', null)).toBe('neutral');
  });
});
