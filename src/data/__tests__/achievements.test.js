/**
 * Achievement data integrity tests
 *
 * Tests for:
 * - TIER constants and tier field on all entries
 * - RARITY_TO_TIER mapping
 * - New v12.0 categories (SKILL_TREE, QUIZ, CEFR)
 * - New v12.0 requirement types
 * - Data completeness (count >= 260, unique IDs, required fields)
 */

import { describe, it, expect } from 'vitest';
import {
  ACHIEVEMENTS,
  ACHIEVEMENT_CATEGORIES,
  RARITY,
  TIER,
  TIER_COLORS,
  RARITY_TO_TIER,
} from '../../data/achievements.js';

describe('Achievement data integrity', () => {
  // Test 1
  it('ACHIEVEMENTS array has at least 260 entries', () => {
    expect(ACHIEVEMENTS.length).toBeGreaterThanOrEqual(260);
  });

  // Test 2
  it('every achievement entry has a tier field', () => {
    const missing = ACHIEVEMENTS.filter((a) => !('tier' in a));
    expect(missing.map((a) => a.id)).toEqual([]);
  });

  // Test 3
  it('every tier value is one of Bronze, Silver, Gold, Legendary', () => {
    const validTiers = ['Bronze', 'Silver', 'Gold', 'Legendary'];
    const invalid = ACHIEVEMENTS.filter((a) => !validTiers.includes(a.tier));
    expect(invalid.map((a) => ({ id: a.id, tier: a.tier }))).toEqual([]);
  });

  // Test 4
  it('TIER constant has exactly 4 keys: BRONZE, SILVER, GOLD, LEGENDARY', () => {
    expect(Object.keys(TIER)).toEqual(['BRONZE', 'SILVER', 'GOLD', 'LEGENDARY']);
  });

  // Test 5
  it('TIER_COLORS has entries for Bronze, Silver, Gold, Legendary', () => {
    expect(TIER_COLORS).toHaveProperty('Bronze');
    expect(TIER_COLORS).toHaveProperty('Silver');
    expect(TIER_COLORS).toHaveProperty('Gold');
    expect(TIER_COLORS).toHaveProperty('Legendary');
  });

  // Test 6
  it('RARITY_TO_TIER maps all 5 rarity values to valid tiers', () => {
    expect(RARITY_TO_TIER[RARITY.COMMON]).toBe('Bronze');
    expect(RARITY_TO_TIER[RARITY.UNCOMMON]).toBe('Bronze');
    expect(RARITY_TO_TIER[RARITY.RARE]).toBe('Silver');
    expect(RARITY_TO_TIER[RARITY.EPIC]).toBe('Gold');
    expect(RARITY_TO_TIER[RARITY.LEGENDARY]).toBe('Legendary');
  });

  // Test 7
  it('ACHIEVEMENT_CATEGORIES contains SKILL_TREE, QUIZ, and CEFR keys', () => {
    expect(ACHIEVEMENT_CATEGORIES).toHaveProperty('SKILL_TREE');
    expect(ACHIEVEMENT_CATEGORIES).toHaveProperty('QUIZ');
    expect(ACHIEVEMENT_CATEGORIES).toHaveProperty('CEFR');
  });

  // Test 8
  it('at least 1 achievement has requirement type skill_tree_nodes', () => {
    const found = ACHIEVEMENTS.filter((a) => a.requirement.type === 'skill_tree_nodes');
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  // Test 9
  it('at least 1 achievement has requirement type skill_tree_complete', () => {
    const found = ACHIEVEMENTS.filter((a) => a.requirement.type === 'skill_tree_complete');
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  // Test 10
  it('at least 1 achievement has requirement type quiz_type_streak', () => {
    const found = ACHIEVEMENTS.filter((a) => a.requirement.type === 'quiz_type_streak');
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  // Test 11
  it('at least 1 achievement has requirement type cefr_level_reached', () => {
    const found = ACHIEVEMENTS.filter((a) => a.requirement.type === 'cefr_level_reached');
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  // Test 12
  it('at least 1 achievement has requirement type placement_complete', () => {
    const found = ACHIEVEMENTS.filter((a) => a.requirement.type === 'placement_complete');
    expect(found.length).toBeGreaterThanOrEqual(1);
  });

  // Test 13
  it('all achievement IDs are unique (no duplicates)', () => {
    const ids = ACHIEVEMENTS.map((a) => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  // Test 14
  it('every achievement has required fields: id, name, description, category, icon, requirement, xpReward, rarity, tier', () => {
    const requiredFields = ['id', 'name', 'description', 'category', 'icon', 'requirement', 'xpReward', 'rarity', 'tier'];
    const missing = ACHIEVEMENTS.filter((a) =>
      requiredFields.some((field) => !(field in a))
    );
    expect(missing.map((a) => a.id)).toEqual([]);
  });
});
