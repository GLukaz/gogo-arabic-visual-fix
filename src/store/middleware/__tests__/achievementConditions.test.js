import { describe, it, expect } from 'vitest';
import { evaluateAchievementConditions } from '../achievementMiddleware.js';

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeState(overrides = {}) {
  return {
    player: {
      wordsLearned: 0,
      level: 1,
      xp: 0,
      streak: 0,
      dirhams: 0,
      unlockedZones: [],
      openedChests: [],
      readBooks: [],
    },
    vocabulary: { fsrsCards: {} },
    quests: { quests: {} },
    alphabet: { completedGroups: [] },
    achievements: {
      unlockedAchievements: {},
      stats: {
        totalReviews: 0,
        reviewStreakDays: 0,
        perfectQuizzes: 0,
        shopPurchases: 0,
        dirhamsSpent: 0,
        quizTypeStats: {},
      },
    },
    skillTree: { unlockedNodes: {} },
    cefrProgress: { currentLevel: null },
    placement: { hasCompleted: false },
    faction: { alignment: { scholar: 0, traveler: 0, historian: 0 }, primaryFaction: null },
    npc: { friendship: {} },
    grammar: { completedLessons: [] },
    ...overrides,
  };
}

function makeAchievement(req) {
  return { id: 'test_ach', title: 'Test', requirement: req, xpReward: 0 };
}

// ─── Vocabulary milestone triggers ───────────────────────────────────────────

describe('vocabulary triggers (words_learned)', () => {
  it('returns false below milestone', () => {
    const ach = makeAchievement({ type: 'words_learned', threshold: 10 });
    const state = makeState({ player: { ...makeState().player, wordsLearned: 9 } });
    expect(evaluateAchievementConditions(ach, state)).toBe(false);
  });

  it('returns true at milestone 10', () => {
    const ach = makeAchievement({ type: 'words_learned', threshold: 10 });
    const state = makeState({ player: { ...makeState().player, wordsLearned: 10 } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns true at milestone 50', () => {
    const ach = makeAchievement({ type: 'words_learned', threshold: 50 });
    const state = makeState({ player: { ...makeState().player, wordsLearned: 50 } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns true at milestone 100', () => {
    const ach = makeAchievement({ type: 'words_learned', threshold: 100 });
    const state = makeState({ player: { ...makeState().player, wordsLearned: 150 } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns true at milestone 500', () => {
    const ach = makeAchievement({ type: 'words_learned', threshold: 500 });
    const state = makeState({ player: { ...makeState().player, wordsLearned: 500 } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns false below 1000 milestone', () => {
    const ach = makeAchievement({ type: 'words_learned', threshold: 1000 });
    const state = makeState({ player: { ...makeState().player, wordsLearned: 999 } });
    expect(evaluateAchievementConditions(ach, state)).toBe(false);
  });
});

// ─── CEFR level triggers ──────────────────────────────────────────────────────

describe('CEFR triggers (cefr_level_reached)', () => {
  it('returns false when no CEFR level set', () => {
    const ach = makeAchievement({ type: 'cefr_level_reached', level: 'A2' });
    expect(evaluateAchievementConditions(ach, makeState())).toBe(false);
  });

  it('returns true when player has reached required level', () => {
    const ach = makeAchievement({ type: 'cefr_level_reached', level: 'A2' });
    const state = makeState({ cefrProgress: { currentLevel: 'B1' } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns false when player level is below required', () => {
    const ach = makeAchievement({ type: 'cefr_level_reached', level: 'B1' });
    const state = makeState({ cefrProgress: { currentLevel: 'A1' } });
    expect(evaluateAchievementConditions(ach, state)).toBe(false);
  });

  it('returns true when player is exactly at required CEFR level', () => {
    const ach = makeAchievement({ type: 'cefr_level_reached', level: 'B1' });
    const state = makeState({ cefrProgress: { currentLevel: 'B1' } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });
});

// ─── Skill tree triggers ──────────────────────────────────────────────────────

describe('skill tree triggers', () => {
  it('returns true when first node unlocked (threshold=1)', () => {
    const ach = makeAchievement({ type: 'skill_tree_nodes', threshold: 1 });
    const state = makeState({ skillTree: { unlockedNodes: { vocab: ['node1'] } } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns false when no nodes unlocked', () => {
    const ach = makeAchievement({ type: 'skill_tree_nodes', threshold: 1 });
    expect(evaluateAchievementConditions(ach, makeState())).toBe(false);
  });
});

// ─── Economy triggers ─────────────────────────────────────────────────────────

describe('economy triggers', () => {
  it('returns true when dirhams spent milestone reached', () => {
    const ach = makeAchievement({ type: 'dirhams_spent', threshold: 100 });
    const state = makeState({
      achievements: {
        ...makeState().achievements,
        stats: { ...makeState().achievements.stats, dirhamsSpent: 100 },
      },
    });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns false when dirhams spent below milestone', () => {
    const ach = makeAchievement({ type: 'dirhams_spent', threshold: 500 });
    const state = makeState({
      achievements: {
        ...makeState().achievements,
        stats: { ...makeState().achievements.stats, dirhamsSpent: 499 },
      },
    });
    expect(evaluateAchievementConditions(ach, state)).toBe(false);
  });

  it('returns true when shop purchase milestone reached (haggles counted as purchases)', () => {
    const ach = makeAchievement({ type: 'shop_purchases', threshold: 5 });
    const state = makeState({
      achievements: {
        ...makeState().achievements,
        stats: { ...makeState().achievements.stats, shopPurchases: 5 },
      },
    });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });
});

// ─── Faction triggers ─────────────────────────────────────────────────────────

describe('faction triggers (faction_alignment)', () => {
  it('returns false when faction alignment is 0 (not joined)', () => {
    const ach = makeAchievement({ type: 'faction_alignment', faction: 'scholar' });
    expect(evaluateAchievementConditions(ach, makeState())).toBe(false);
  });

  it('returns true when player has joined faction (any alignment > 0)', () => {
    const ach = makeAchievement({ type: 'faction_alignment', faction: 'scholar' });
    const state = makeState({
      faction: { alignment: { scholar: 10, traveler: 0, historian: 0 } },
    });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns true when player has max reputation (threshold=100)', () => {
    const ach = makeAchievement({ type: 'faction_alignment', faction: 'traveler', threshold: 100 });
    const state = makeState({
      faction: { alignment: { scholar: 0, traveler: 100, historian: 0 } },
    });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns false when reputation below max threshold', () => {
    const ach = makeAchievement({ type: 'faction_alignment', faction: 'traveler', threshold: 100 });
    const state = makeState({
      faction: { alignment: { scholar: 0, traveler: 99, historian: 0 } },
    });
    expect(evaluateAchievementConditions(ach, state)).toBe(false);
  });

  it('handles missing faction gracefully (returns false)', () => {
    const ach = makeAchievement({ type: 'faction_alignment', faction: 'unknown' });
    expect(evaluateAchievementConditions(ach, makeState())).toBe(false);
  });
});

// ─── NPC max relationship triggers ────────────────────────────────────────────

describe('npc_max_relationship triggers', () => {
  it('returns true when specific NPC reaches friendship threshold', () => {
    const ach = makeAchievement({ type: 'npc_max_relationship', npcId: 'guide-amira', threshold: 75 });
    const state = makeState({ npc: { friendship: { 'guide-amira': 80 } } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });

  it('returns false when specific NPC friendship below threshold', () => {
    const ach = makeAchievement({ type: 'npc_max_relationship', npcId: 'guide-amira', threshold: 75 });
    const state = makeState({ npc: { friendship: { 'guide-amira': 74 } } });
    expect(evaluateAchievementConditions(ach, state)).toBe(false);
  });

  it('returns true when any NPC reaches close tier (no npcId specified)', () => {
    const ach = makeAchievement({ type: 'npc_max_relationship' });
    const state = makeState({ npc: { friendship: { 'scholar-yusuf': 80 } } });
    expect(evaluateAchievementConditions(ach, state)).toBe(true);
  });
});
