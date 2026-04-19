import { describe, it, expect } from 'vitest';
import {
  SIDE_QUEST_CHAINS,
  SIDE_CHAIN_COUNT,
  SIDE_QUEST_COUNT,
  getSideQuestChain,
  getSideQuestsByZone,
  getAllSideQuests,
  validateSidePrerequisites,
} from '../sideQuestChains.js';

describe('sideQuestChains data integrity', () => {
  it('has exactly 8 quest chains', () => {
    expect(SIDE_QUEST_CHAINS).toHaveLength(8);
    expect(SIDE_CHAIN_COUNT).toBe(8);
  });

  it('has exactly 24 individual quests (3 per chain)', () => {
    expect(SIDE_QUEST_COUNT).toBe(24);

    for (const chain of SIDE_QUEST_CHAINS) {
      expect(chain.quests, `${chain.chainId}: does not have 3 quests`).toHaveLength(3);
    }
  });

  it('all chain IDs are unique', () => {
    const ids = SIDE_QUEST_CHAINS.map((c) => c.chainId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all individual quest IDs are unique across all chains', () => {
    const allQuests = getAllSideQuests();
    const ids = allQuests.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all chains have required fields', () => {
    const requiredFields = ['chainId', 'zone', 'title', 'titleArabic', 'description', 'quests', 'completionReward'];

    for (const chain of SIDE_QUEST_CHAINS) {
      for (const field of requiredFields) {
        expect(chain[field], `${chain.chainId}: missing ${field}`).toBeDefined();
      }
    }
  });

  it('all chains cover different zones', () => {
    const zones = SIDE_QUEST_CHAINS.map((c) => c.zone);
    expect(new Set(zones).size).toBe(8);
  });

  it('all chain zones are valid', () => {
    const validZones = [
      'oasis-village', 'ancient-library', 'desert-marketplace',
      'bedouin-camp', 'royal-palace', 'mountain-pass',
      'coastal-port', 'hidden-oasis',
    ];

    for (const chain of SIDE_QUEST_CHAINS) {
      expect(validZones, `${chain.chainId}: invalid zone ${chain.zone}`).toContain(chain.zone);
    }
  });

  it('all chain titles have Arabic text', () => {
    const arabicRegex = /[\u0600-\u06FF]/;
    for (const chain of SIDE_QUEST_CHAINS) {
      expect(
        arabicRegex.test(chain.titleArabic),
        `${chain.chainId}: titleArabic has no Arabic characters`,
      ).toBe(true);
    }
  });

  it('all individual quests have required fields', () => {
    const requiredFields = ['id', 'title', 'titleArabic', 'description', 'npcGiver', 'objectives', 'reward', 'prerequisites'];

    for (const chain of SIDE_QUEST_CHAINS) {
      for (const quest of chain.quests) {
        for (const field of requiredFields) {
          expect(quest[field], `${quest.id}: missing ${field}`).toBeDefined();
        }
      }
    }
  });

  it('all quest objectives have required fields', () => {
    const validTypes = ['talk', 'learn', 'explore', 'collect', 'battle'];

    for (const quest of getAllSideQuests()) {
      expect(quest.objectives.length, `${quest.id}: no objectives`).toBeGreaterThanOrEqual(1);
      for (const obj of quest.objectives) {
        expect(obj.id, `${quest.id}: objective missing id`).toBeTruthy();
        expect(obj.description, `${quest.id}: objective missing description`).toBeTruthy();
        expect(obj.descriptionArabic, `${quest.id}: objective missing descriptionArabic`).toBeTruthy();
        expect(obj.type, `${quest.id}: objective missing type`).toBeTruthy();
        expect(validTypes, `${quest.id}: invalid type ${obj.type}`).toContain(obj.type);
      }
    }
  });

  it('all quest rewards have xp and dirhams', () => {
    for (const quest of getAllSideQuests()) {
      expect(typeof quest.reward.xp, `${quest.id}: xp not number`).toBe('number');
      expect(typeof quest.reward.dirhams, `${quest.id}: dirhams not number`).toBe('number');
      expect(quest.reward.xp, `${quest.id}: xp should be positive`).toBeGreaterThan(0);
      expect(quest.reward.dirhams, `${quest.id}: dirhams should be positive`).toBeGreaterThan(0);
    }
  });

  it('all completion rewards have xp, dirhams, and loreEntry', () => {
    for (const chain of SIDE_QUEST_CHAINS) {
      expect(chain.completionReward.xp, `${chain.chainId}: completion xp missing`).toBeGreaterThan(0);
      expect(chain.completionReward.dirhams, `${chain.chainId}: completion dirhams missing`).toBeGreaterThan(0);
      expect(chain.completionReward.loreEntry, `${chain.chainId}: completion loreEntry missing`).toBeTruthy();
    }
  });

  it('all prerequisite references are valid within their chain', () => {
    expect(validateSidePrerequisites()).toBe(true);
  });

  it('first quest in each chain has no prerequisites', () => {
    for (const chain of SIDE_QUEST_CHAINS) {
      expect(
        chain.quests[0].prerequisites,
        `${chain.chainId}: first quest has prerequisites`,
      ).toHaveLength(0);
    }
  });

  it('prerequisite chain is sequential within each chain', () => {
    for (const chain of SIDE_QUEST_CHAINS) {
      const questIndex = {};
      chain.quests.forEach((q, i) => { questIndex[q.id] = i; });

      for (const quest of chain.quests) {
        for (const prereq of quest.prerequisites) {
          expect(
            questIndex[prereq],
            `${quest.id}: prerequisite ${prereq} comes after this quest`,
          ).toBeLessThan(questIndex[quest.id]);
        }
      }
    }
  });

  it('all quests introduce vocabulary', () => {
    for (const quest of getAllSideQuests()) {
      expect(
        quest.vocabularyIntroduced.length,
        `${quest.id}: no vocabularyIntroduced`,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  describe('helper functions', () => {
    it('getSideQuestChain returns correct chain', () => {
      const chain = getSideQuestChain('oasis_mystery');
      expect(chain).toBeDefined();
      expect(chain.title).toBe('The Mystery of the Dry Well');
    });

    it('getSideQuestChain returns null for unknown ID', () => {
      expect(getSideQuestChain('nonexistent')).toBeNull();
    });

    it('getSideQuestsByZone returns correct chains', () => {
      const chains = getSideQuestsByZone('oasis-village');
      expect(chains).toHaveLength(1);
      expect(chains[0].chainId).toBe('oasis_mystery');
    });

    it('getAllSideQuests returns flat array of 24 quests', () => {
      expect(getAllSideQuests()).toHaveLength(24);
    });
  });
});
