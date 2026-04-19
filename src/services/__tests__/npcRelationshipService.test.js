/**
 * npcRelationshipService.test.js
 * GROW-017 — NPC relationship consequences
 */
import { describe, it, expect } from 'vitest';
import {
  getTier,
  getShopDiscount,
  getAvailableQuests,
  getDialogueVariant,
  getBattleAssistChance,
  RELATIONSHIP_TIERS,
} from '../npcRelationshipService.js';

describe('getTier', () => {
  it('returns Hostile for values < 20', () => {
    expect(getTier(0).key).toBe('hostile');
    expect(getTier(19).key).toBe('hostile');
  });

  it('returns Cold for 20-39', () => {
    expect(getTier(20).key).toBe('cold');
    expect(getTier(39).key).toBe('cold');
  });

  it('returns Neutral for 40-59', () => {
    expect(getTier(40).key).toBe('neutral');
    expect(getTier(59).key).toBe('neutral');
  });

  it('returns Friendly for 60-79', () => {
    expect(getTier(60).key).toBe('friendly');
    expect(getTier(79).key).toBe('friendly');
  });

  it('returns Beloved for 80-100', () => {
    expect(getTier(80).key).toBe('beloved');
    expect(getTier(100).key).toBe('beloved');
  });

  it('clamps out-of-range values', () => {
    expect(getTier(-10).key).toBe('hostile');
    expect(getTier(150).key).toBe('beloved');
  });
});

describe('getShopDiscount', () => {
  it('returns 0 for hostile', () => {
    expect(getShopDiscount('npc_1', 10)).toBe(0);
  });

  it('returns 0 for cold', () => {
    expect(getShopDiscount('npc_1', 30)).toBe(0);
  });

  it('returns 0.05 for neutral', () => {
    expect(getShopDiscount('npc_1', 50)).toBe(0.05);
  });

  it('returns 0.15 for friendly', () => {
    expect(getShopDiscount('npc_1', 65)).toBe(0.15);
  });

  it('returns 0.25 for beloved', () => {
    expect(getShopDiscount('npc_1', 90)).toBe(0.25);
  });

  it('returns 0 for null npcId', () => {
    expect(getShopDiscount(null, 100)).toBe(0);
  });
});

describe('getAvailableQuests', () => {
  const quests = [
    { id: 'q1', npcGiver: 'npc_1', minRelationship: 0 },
    { id: 'q2', npcGiver: 'npc_1', minRelationship: 60 },
    { id: 'q3', npcGiver: 'npc_1', minRelationship: 80 },
    { id: 'q4', npcGiver: 'npc_2' }, // different NPC
  ];

  it('returns [] for hostile relationship', () => {
    expect(getAvailableQuests('npc_1', 10, quests)).toHaveLength(0);
  });

  it('returns only quests meeting minRelationship at neutral', () => {
    const result = getAvailableQuests('npc_1', 50, quests);
    expect(result.map((q) => q.id)).toContain('q1');
    expect(result.map((q) => q.id)).not.toContain('q2');
  });

  it('returns more quests at friendly level', () => {
    const result = getAvailableQuests('npc_1', 65, quests);
    expect(result.map((q) => q.id)).toContain('q1');
    expect(result.map((q) => q.id)).toContain('q2');
    expect(result.map((q) => q.id)).not.toContain('q3');
  });

  it('filters by npcGiver', () => {
    const result = getAvailableQuests('npc_1', 100, quests);
    expect(result.map((q) => q.id)).not.toContain('q4');
  });

  it('returns [] for null npcId', () => {
    expect(getAvailableQuests(null, 100, quests)).toHaveLength(0);
  });
});

describe('getDialogueVariant', () => {
  it('returns correct tier key for each range', () => {
    expect(getDialogueVariant('npc_1', 10)).toBe('hostile');
    expect(getDialogueVariant('npc_1', 30)).toBe('cold');
    expect(getDialogueVariant('npc_1', 50)).toBe('neutral');
    expect(getDialogueVariant('npc_1', 70)).toBe('friendly');
    expect(getDialogueVariant('npc_1', 90)).toBe('beloved');
  });

  it('returns neutral for null npcId', () => {
    expect(getDialogueVariant(null, 100)).toBe('neutral');
  });
});

describe('getBattleAssistChance', () => {
  it('returns 0 for hostile', () => {
    expect(getBattleAssistChance('npc_1', 10)).toBe(0);
  });

  it('returns 0 for cold', () => {
    expect(getBattleAssistChance('npc_1', 30)).toBe(0);
  });

  it('returns 0 for neutral', () => {
    expect(getBattleAssistChance('npc_1', 50)).toBe(0);
  });

  it('returns 0.07 for friendly', () => {
    expect(getBattleAssistChance('npc_1', 70)).toBe(0.07);
  });

  it('returns 0.15 for beloved', () => {
    expect(getBattleAssistChance('npc_1', 90)).toBe(0.15);
  });

  it('returns 0 for null npcId', () => {
    expect(getBattleAssistChance(null, 100)).toBe(0);
  });
});

describe('RELATIONSHIP_TIERS constants', () => {
  it('all 5 tiers defined with correct keys', () => {
    const keys = Object.values(RELATIONSHIP_TIERS).map((t) => t.key);
    expect(keys).toContain('hostile');
    expect(keys).toContain('cold');
    expect(keys).toContain('neutral');
    expect(keys).toContain('friendly');
    expect(keys).toContain('beloved');
  });
});
