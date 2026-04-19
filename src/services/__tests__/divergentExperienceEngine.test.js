import { describe, it, expect } from 'vitest';
import {
  shouldShowDivergentContent,
  getActivePathForPlayer,
  getZoneVariation,
  getDivergentEntryText,
  getAvailableQuests,
  getNextQuestInChain,
  getDivergentQuestById,
  getFactionForQuest,
  getAllPathsStatus,
} from '../divergentExperienceEngine.js';
import { DIVERGENT_PATHS } from '../../data/divergentPaths.js';
import { FACTION_IDS } from '../../data/factions.js';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — build minimal faction/quest state objects
// ─────────────────────────────────────────────────────────────────────────────

function makeFactionState(overrides = {}) {
  return {
    alignment: {
      scholars: 0,
      merchants: 0,
      artisans: 0,
      travelers: 0,
      guardians: 0,
      artists: 0,
      ...overrides,
    },
    primaryFaction: null,
  };
}

function withPrimary(state) {
  const sorted = Object.entries(state.alignment).sort(([, a], [, b]) => b - a);
  const primary = sorted[0]?.[1] > 0 ? sorted[0][0] : null;
  return { ...state, primaryFaction: primary };
}

function makeQuestState(questStatuses = {}) {
  return {
    quests: Object.fromEntries(
      Object.entries(questStatuses).map(([id, status]) => [id, { status }])
    ),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// shouldShowDivergentContent
// ─────────────────────────────────────────────────────────────────────────────

describe('shouldShowDivergentContent', () => {
  it('returns false when no faction is above 0', () => {
    expect(shouldShowDivergentContent(makeFactionState())).toBe(false);
  });

  it('returns false when highest faction is below 25', () => {
    expect(
      shouldShowDivergentContent(makeFactionState({ scholars: 24 }))
    ).toBe(false);
  });

  it('returns true when one faction is exactly 25', () => {
    expect(
      shouldShowDivergentContent(makeFactionState({ scholars: 25 }))
    ).toBe(true);
  });

  it('returns true when multiple factions are above 25', () => {
    expect(
      shouldShowDivergentContent(makeFactionState({ scholars: 50, merchants: 30 }))
    ).toBe(true);
  });

  it('returns false for null/undefined state', () => {
    expect(shouldShowDivergentContent(null)).toBe(false);
    expect(shouldShowDivergentContent(undefined)).toBe(false);
    expect(shouldShowDivergentContent({})).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getActivePathForPlayer
// ─────────────────────────────────────────────────────────────────────────────

describe('getActivePathForPlayer', () => {
  it('returns null when no faction has alignment', () => {
    expect(getActivePathForPlayer(makeFactionState())).toBeNull();
  });

  it('returns null when primary faction is below friendly', () => {
    const state = withPrimary(makeFactionState({ scholars: 20 }));
    expect(getActivePathForPlayer(state)).toBeNull();
  });

  it('returns scholars path when scholars is primary at 25+', () => {
    const state = withPrimary(makeFactionState({ scholars: 30 }));
    const result = getActivePathForPlayer(state);
    expect(result).not.toBeNull();
    expect(result.factionId).toBe('scholars');
    expect(result.path.theme).toBe('The Pursuit of Knowledge');
  });

  it('returns merchants path when merchants is highest', () => {
    const state = withPrimary(makeFactionState({ merchants: 40, scholars: 20 }));
    const result = getActivePathForPlayer(state);
    expect(result.factionId).toBe('merchants');
    expect(result.path.themeArabic).toBe('طريق التجارة');
  });

  it('returns guardians path at exactly 25 alignment', () => {
    const state = withPrimary(makeFactionState({ guardians: 25 }));
    const result = getActivePathForPlayer(state);
    expect(result.factionId).toBe('guardians');
  });

  it('returns path for each faction when that faction is primary', () => {
    const factionIds = Object.values(FACTION_IDS);
    for (const fid of factionIds) {
      const state = withPrimary(makeFactionState({ [fid]: 50 }));
      const result = getActivePathForPlayer(state);
      expect(result).not.toBeNull();
      expect(result.factionId).toBe(fid);
      expect(result.path).toBeDefined();
      expect(result.path.questChain).toHaveLength(5);
    }
  });

  it('derives primary from alignment when primaryFaction is null', () => {
    const state = makeFactionState({ artists: 60 });
    // primaryFaction is null, should derive from alignment
    const result = getActivePathForPlayer(state);
    expect(result.factionId).toBe('artists');
  });

  it('handles null state gracefully', () => {
    expect(getActivePathForPlayer(null)).toBeNull();
    expect(getActivePathForPlayer(undefined)).toBeNull();
    expect(getActivePathForPlayer({})).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getZoneVariation
// ─────────────────────────────────────────────────────────────────────────────

describe('getZoneVariation', () => {
  it('returns null when player has no divergent path', () => {
    expect(getZoneVariation(makeFactionState(), 'oasis-village')).toBeNull();
  });

  it('returns zone variation for oasis-village when scholars is primary', () => {
    const state = withPrimary(makeFactionState({ scholars: 30 }));
    const variation = getZoneVariation(state, 'oasis-village');
    expect(variation).not.toBeNull();
    expect(variation.entryText).toBeDefined();
    expect(variation.entryText.arabic).toBeTruthy();
    expect(variation.entryText.english).toBeTruthy();
    expect(variation.availableNpcs).toBeDefined();
    expect(Array.isArray(variation.availableNpcs)).toBe(true);
    expect(variation.hiddenInteractions).toBeDefined();
  });

  it('returns null for unknown zone name', () => {
    const state = withPrimary(makeFactionState({ scholars: 50 }));
    expect(getZoneVariation(state, 'nonexistent-zone')).toBeNull();
  });

  it('returns different variations per faction for the same zone', () => {
    const scholarsState = withPrimary(makeFactionState({ scholars: 50 }));
    const merchantsState = withPrimary(makeFactionState({ merchants: 50 }));

    const scholarsVar = getZoneVariation(scholarsState, 'oasis-village');
    const merchantsVar = getZoneVariation(merchantsState, 'oasis-village');

    expect(scholarsVar.entryText.english).not.toBe(merchantsVar.entryText.english);
    expect(scholarsVar.availableNpcs).not.toEqual(merchantsVar.availableNpcs);
  });

  it('covers all 8 zones for each faction', () => {
    const zones = [
      'oasis-village', 'ancient-library', 'desert-marketplace', 'bedouin-camp',
      'royal-palace', 'mountain-pass', 'coastal-port', 'hidden-oasis',
    ];
    const factionIds = Object.values(FACTION_IDS);

    for (const fid of factionIds) {
      const state = withPrimary(makeFactionState({ [fid]: 50 }));
      for (const zone of zones) {
        const variation = getZoneVariation(state, zone);
        expect(variation).not.toBeNull();
        expect(variation.entryText.arabic).toBeTruthy();
        expect(variation.entryText.english).toBeTruthy();
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getDivergentEntryText
// ─────────────────────────────────────────────────────────────────────────────

describe('getDivergentEntryText', () => {
  it('returns entry text for a valid zone and faction', () => {
    const state = withPrimary(makeFactionState({ travelers: 40 }));
    const text = getDivergentEntryText(state, 'mountain-pass');
    expect(text).not.toBeNull();
    expect(text.arabic).toBeTruthy();
    expect(text.english).toBeTruthy();
  });

  it('returns null when no path is active', () => {
    expect(getDivergentEntryText(makeFactionState(), 'oasis-village')).toBeNull();
  });

  it('returns null for unknown zone', () => {
    const state = withPrimary(makeFactionState({ scholars: 50 }));
    expect(getDivergentEntryText(state, 'fake-zone')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getAvailableQuests
// ─────────────────────────────────────────────────────────────────────────────

describe('getAvailableQuests', () => {
  it('returns empty array when no faction is at friendly', () => {
    expect(
      getAvailableQuests(makeFactionState(), makeQuestState())
    ).toEqual([]);
  });

  it('returns the first quest when no prerequisites exist and no quests started', () => {
    const state = withPrimary(makeFactionState({ scholars: 30 }));
    const quests = getAvailableQuests(state, makeQuestState());
    expect(quests).toHaveLength(1);
    expect(quests[0].id).toBe('scholars_path_1');
  });

  it('returns the second quest when the first is completed', () => {
    const state = withPrimary(makeFactionState({ scholars: 30 }));
    const questState = makeQuestState({ scholars_path_1: 'completed' });
    const quests = getAvailableQuests(state, questState);
    expect(quests).toHaveLength(1);
    expect(quests[0].id).toBe('scholars_path_2');
  });

  it('returns no quests when the first is active (not completed)', () => {
    const state = withPrimary(makeFactionState({ scholars: 30 }));
    const questState = makeQuestState({ scholars_path_1: 'active' });
    const quests = getAvailableQuests(state, questState);
    // First quest is active, second has unmet prereqs — neither available
    expect(quests).toHaveLength(0);
  });

  it('handles full chain completion — no quests left', () => {
    const state = withPrimary(makeFactionState({ merchants: 50 }));
    const questState = makeQuestState({
      merchants_path_1: 'completed',
      merchants_path_2: 'completed',
      merchants_path_3: 'completed',
      merchants_path_4: 'completed',
      merchants_path_5: 'completed',
    });
    const quests = getAvailableQuests(state, questState);
    expect(quests).toHaveLength(0);
  });

  it('only returns quests for the primary faction', () => {
    // Merchants is primary but scholars also at friendly
    const state = withPrimary(makeFactionState({ merchants: 50, scholars: 30 }));
    const quests = getAvailableQuests(state, makeQuestState());
    expect(quests).toHaveLength(1);
    expect(quests[0].id).toBe('merchants_path_1');
  });

  it('handles null quest state gracefully', () => {
    const state = withPrimary(makeFactionState({ artists: 30 }));
    const quests = getAvailableQuests(state, null);
    expect(quests).toHaveLength(1);
    expect(quests[0].id).toBe('artists_path_1');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getNextQuestInChain
// ─────────────────────────────────────────────────────────────────────────────

describe('getNextQuestInChain', () => {
  it('returns the second quest after completing the first', () => {
    const next = getNextQuestInChain('scholars_path_1');
    expect(next).not.toBeNull();
    expect(next.id).toBe('scholars_path_2');
  });

  it('returns null after completing the last quest in a chain', () => {
    expect(getNextQuestInChain('scholars_path_5')).toBeNull();
    expect(getNextQuestInChain('merchants_path_5')).toBeNull();
    expect(getNextQuestInChain('artisans_path_5')).toBeNull();
    expect(getNextQuestInChain('travelers_path_5')).toBeNull();
    expect(getNextQuestInChain('guardians_path_5')).toBeNull();
    expect(getNextQuestInChain('artists_path_5')).toBeNull();
  });

  it('returns null for a non-divergent quest ID', () => {
    expect(getNextQuestInChain('tutorial_welcome')).toBeNull();
    expect(getNextQuestInChain('nonexistent')).toBeNull();
  });

  it('chains correctly through the middle of a sequence', () => {
    const next2 = getNextQuestInChain('guardians_path_2');
    expect(next2.id).toBe('guardians_path_3');

    const next3 = getNextQuestInChain('guardians_path_3');
    expect(next3.id).toBe('guardians_path_4');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getDivergentQuestById
// ─────────────────────────────────────────────────────────────────────────────

describe('getDivergentQuestById', () => {
  it('returns quest data for a valid divergent quest ID', () => {
    const quest = getDivergentQuestById('travelers_path_3');
    expect(quest).not.toBeNull();
    expect(quest.title).toBe('The Mountain Crossing');
    expect(quest.titleArabic).toBe('عبور الجبل');
    expect(quest.zone).toBe('mountain-pass');
    expect(quest.type).toBe('side');
    expect(quest.reward).toBeDefined();
    expect(quest.reward.xp).toBeGreaterThan(0);
  });

  it('returns null for a non-divergent quest ID', () => {
    expect(getDivergentQuestById('tutorial_welcome')).toBeNull();
    expect(getDivergentQuestById('')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getFactionForQuest
// ─────────────────────────────────────────────────────────────────────────────

describe('getFactionForQuest', () => {
  it('returns the correct faction for each divergent quest', () => {
    expect(getFactionForQuest('scholars_path_3')).toBe('scholars');
    expect(getFactionForQuest('merchants_path_1')).toBe('merchants');
    expect(getFactionForQuest('artisans_path_5')).toBe('artisans');
    expect(getFactionForQuest('travelers_path_2')).toBe('travelers');
    expect(getFactionForQuest('guardians_path_4')).toBe('guardians');
    expect(getFactionForQuest('artists_path_1')).toBe('artists');
  });

  it('returns null for non-divergent quests', () => {
    expect(getFactionForQuest('tutorial_welcome')).toBeNull();
    expect(getFactionForQuest('random_id')).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getAllPathsStatus
// ─────────────────────────────────────────────────────────────────────────────

describe('getAllPathsStatus', () => {
  it('returns 6 entries (one per faction)', () => {
    const statuses = getAllPathsStatus(makeFactionState());
    expect(statuses).toHaveLength(6);
  });

  it('marks all paths as locked when alignment is 0', () => {
    const statuses = getAllPathsStatus(makeFactionState());
    for (const s of statuses) {
      expect(s.unlocked).toBe(false);
      expect(s.isPrimary).toBe(false);
    }
  });

  it('marks a path as unlocked and primary when its faction is highest at 25+', () => {
    const state = withPrimary(makeFactionState({ artisans: 50 }));
    const statuses = getAllPathsStatus(state);

    const artisansStatus = statuses.find((s) => s.factionId === 'artisans');
    expect(artisansStatus.unlocked).toBe(true);
    expect(artisansStatus.isPrimary).toBe(true);

    const scholarsStatus = statuses.find((s) => s.factionId === 'scholars');
    expect(scholarsStatus.unlocked).toBe(false);
    expect(scholarsStatus.isPrimary).toBe(false);
  });

  it('marks multiple paths as unlocked when multiple factions are at 25+', () => {
    const state = withPrimary(makeFactionState({ scholars: 50, merchants: 30 }));
    const statuses = getAllPathsStatus(state);

    const scholarsStatus = statuses.find((s) => s.factionId === 'scholars');
    expect(scholarsStatus.unlocked).toBe(true);
    expect(scholarsStatus.isPrimary).toBe(true);

    const merchantsStatus = statuses.find((s) => s.factionId === 'merchants');
    expect(merchantsStatus.unlocked).toBe(true);
    expect(merchantsStatus.isPrimary).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases: tied factions
// ─────────────────────────────────────────────────────────────────────────────

describe('tied factions', () => {
  it('returns a path when two factions are tied (first in sort order wins)', () => {
    const state = withPrimary(makeFactionState({ scholars: 40, merchants: 40 }));
    const result = getActivePathForPlayer(state);
    // With equal scores, sort is stable — one of them wins as primary
    expect(result).not.toBeNull();
    expect(['scholars', 'merchants']).toContain(result.factionId);
  });

  it('returns consistent results for the same tied state', () => {
    const state = withPrimary(makeFactionState({ scholars: 40, merchants: 40 }));
    const result1 = getActivePathForPlayer(state);
    const result2 = getActivePathForPlayer(state);
    expect(result1.factionId).toBe(result2.factionId);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Data integrity — verify DIVERGENT_PATHS structure
// ─────────────────────────────────────────────────────────────────────────────

describe('DIVERGENT_PATHS data integrity', () => {
  const factionIds = Object.values(FACTION_IDS);

  it('has exactly 6 path definitions', () => {
    expect(Object.keys(DIVERGENT_PATHS)).toHaveLength(6);
  });

  it('every faction has a path definition', () => {
    for (const fid of factionIds) {
      expect(DIVERGENT_PATHS[fid]).toBeDefined();
    }
  });

  it('every path has 5 quests', () => {
    for (const fid of factionIds) {
      expect(DIVERGENT_PATHS[fid].questChain).toHaveLength(5);
    }
  });

  it('every path has 8 zone variations', () => {
    for (const fid of factionIds) {
      expect(Object.keys(DIVERGENT_PATHS[fid].zoneVariations)).toHaveLength(8);
    }
  });

  it('30 total quests across all paths', () => {
    const totalQuests = Object.values(DIVERGENT_PATHS).reduce(
      (sum, path) => sum + path.questChain.length, 0
    );
    expect(totalQuests).toBe(30);
  });

  it('48 total zone variations across all paths', () => {
    const totalVariations = Object.values(DIVERGENT_PATHS).reduce(
      (sum, path) => sum + Object.keys(path.zoneVariations).length, 0
    );
    expect(totalVariations).toBe(48);
  });

  it('all quest IDs are unique', () => {
    const allIds = Object.values(DIVERGENT_PATHS).flatMap(
      (p) => p.questChain.map((q) => q.id)
    );
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('every quest has required fields', () => {
    for (const fid of factionIds) {
      for (const quest of DIVERGENT_PATHS[fid].questChain) {
        expect(quest.id).toBeTruthy();
        expect(quest.title).toBeTruthy();
        expect(quest.titleArabic).toBeTruthy();
        expect(quest.description).toBeTruthy();
        expect(quest.zone).toBeTruthy();
        expect(quest.type).toBe('side');
        expect(quest.target).toBeGreaterThan(0);
        expect(quest.trackEvent).toBeTruthy();
        expect(Array.isArray(quest.prerequisites)).toBe(true);
        expect(quest.reward).toBeDefined();
        expect(quest.reward.xp).toBeGreaterThan(0);
        expect(quest.reward.dirhams).toBeGreaterThan(0);
      }
    }
  });

  it('quest chain prerequisites form a valid sequence', () => {
    for (const fid of factionIds) {
      const chain = DIVERGENT_PATHS[fid].questChain;
      // First quest has no prerequisites
      expect(chain[0].prerequisites).toHaveLength(0);
      // Each subsequent quest requires the previous one
      for (let i = 1; i < chain.length; i++) {
        expect(chain[i].prerequisites).toContain(chain[i - 1].id);
      }
    }
  });

  it('every zone variation has entryText with arabic and english', () => {
    for (const fid of factionIds) {
      for (const [, variation] of Object.entries(DIVERGENT_PATHS[fid].zoneVariations)) {
        expect(variation.entryText).toBeDefined();
        expect(typeof variation.entryText.arabic).toBe('string');
        expect(typeof variation.entryText.english).toBe('string');
        expect(variation.entryText.arabic.length).toBeGreaterThan(0);
        expect(variation.entryText.english.length).toBeGreaterThan(0);
      }
    }
  });

  it('every path has theme, themeArabic, and description', () => {
    for (const fid of factionIds) {
      const path = DIVERGENT_PATHS[fid];
      expect(path.theme).toBeTruthy();
      expect(path.themeArabic).toBeTruthy();
      expect(path.description).toBeTruthy();
    }
  });
});
