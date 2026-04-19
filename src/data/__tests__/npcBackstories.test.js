import { describe, it, expect } from 'vitest';
import {
  NPC_BACKSTORIES,
  BACKSTORY_BY_NPC_ID,
  BACKSTORIED_NPC_IDS,
  FACTION_NPC_MAP,
} from '../npcBackstories.js';

describe('npcBackstories data integrity', () => {
  it('has exactly 24 NPC backstories', () => {
    expect(NPC_BACKSTORIES).toHaveLength(24);
  });

  it('all NPC IDs are unique', () => {
    const ids = NPC_BACKSTORIES.map((b) => b.npcId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all backstories have required string fields', () => {
    const requiredStrings = [
      'npcId',
      'fullName',
      'fullNameArabic',
      'backstory',
      'backstoryArabic',
      'teachingStyle',
    ];

    for (const backstory of NPC_BACKSTORIES) {
      for (const field of requiredStrings) {
        expect(backstory[field], `${backstory.npcId}: missing ${field}`).toBeTruthy();
        expect(typeof backstory[field], `${backstory.npcId}: ${field} not string`).toBe('string');
      }
    }
  });

  it('all backstories have non-empty motivations array', () => {
    for (const backstory of NPC_BACKSTORIES) {
      expect(Array.isArray(backstory.motivations), `${backstory.npcId}: motivations not array`).toBe(true);
      expect(backstory.motivations.length, `${backstory.npcId}: motivations empty`).toBeGreaterThanOrEqual(1);
    }
  });

  it('all backstories have non-empty secrets array', () => {
    for (const backstory of NPC_BACKSTORIES) {
      expect(Array.isArray(backstory.secrets), `${backstory.npcId}: secrets not array`).toBe(true);
      expect(backstory.secrets.length, `${backstory.npcId}: secrets empty`).toBeGreaterThanOrEqual(1);
    }
  });

  it('all backstories have non-empty favoriteTopics array', () => {
    for (const backstory of NPC_BACKSTORIES) {
      expect(Array.isArray(backstory.favoriteTopics), `${backstory.npcId}: favoriteTopics not array`).toBe(true);
      expect(backstory.favoriteTopics.length, `${backstory.npcId}: favoriteTopics empty`).toBeGreaterThanOrEqual(1);
    }
  });

  it('all backstories have valid relationshipQuotes with all 4 tiers', () => {
    const tiers = ['cold', 'cautious', 'friendly', 'close'];

    for (const backstory of NPC_BACKSTORIES) {
      expect(backstory.relationshipQuotes, `${backstory.npcId}: missing relationshipQuotes`).toBeDefined();

      for (const tier of tiers) {
        const quote = backstory.relationshipQuotes[tier];
        expect(quote, `${backstory.npcId}: missing ${tier} quote`).toBeDefined();
        expect(quote.arabic, `${backstory.npcId}: ${tier} missing arabic`).toBeTruthy();
        expect(quote.english, `${backstory.npcId}: ${tier} missing english`).toBeTruthy();
      }
    }
  });

  it('all Arabic text contains Arabic characters', () => {
    const arabicRegex = /[\u0600-\u06FF]/;

    for (const backstory of NPC_BACKSTORIES) {
      expect(
        arabicRegex.test(backstory.fullNameArabic),
        `${backstory.npcId}: fullNameArabic has no Arabic characters`,
      ).toBe(true);

      expect(
        arabicRegex.test(backstory.backstoryArabic),
        `${backstory.npcId}: backstoryArabic has no Arabic characters`,
      ).toBe(true);

      for (const tier of ['cold', 'cautious', 'friendly', 'close']) {
        expect(
          arabicRegex.test(backstory.relationshipQuotes[tier].arabic),
          `${backstory.npcId}: ${tier} quote arabic has no Arabic characters`,
        ).toBe(true);
      }
    }
  });

  it('backstory text is 3-5 sentences long', () => {
    for (const backstory of NPC_BACKSTORIES) {
      // Count sentences by periods, excluding abbreviations
      const sentences = backstory.backstory.split(/\.\s/).filter((s) => s.length > 10);
      expect(sentences.length, `${backstory.npcId}: backstory has ${sentences.length} sentences`).toBeGreaterThanOrEqual(3);
      expect(sentences.length, `${backstory.npcId}: backstory has ${sentences.length} sentences`).toBeLessThanOrEqual(6);
    }
  });

  describe('BACKSTORY_BY_NPC_ID lookup', () => {
    it('has entries for all 24 NPCs', () => {
      expect(Object.keys(BACKSTORY_BY_NPC_ID)).toHaveLength(24);
    });

    it('returns correct backstory for known NPC', () => {
      const yusuf = BACKSTORY_BY_NPC_ID['scholar-yusuf'];
      expect(yusuf).toBeDefined();
      expect(yusuf.npcId).toBe('scholar-yusuf');
    });
  });

  describe('BACKSTORIED_NPC_IDS', () => {
    it('has exactly 24 IDs', () => {
      expect(BACKSTORIED_NPC_IDS).toHaveLength(24);
    });
  });

  describe('FACTION_NPC_MAP', () => {
    it('has exactly 6 factions', () => {
      expect(Object.keys(FACTION_NPC_MAP)).toHaveLength(6);
    });

    it('each faction has exactly 4 NPCs', () => {
      for (const [faction, npcs] of Object.entries(FACTION_NPC_MAP)) {
        expect(npcs, `${faction} does not have 4 NPCs`).toHaveLength(4);
      }
    });

    it('total NPCs across factions equals 24', () => {
      const total = Object.values(FACTION_NPC_MAP).flat();
      expect(total).toHaveLength(24);
    });

    it('all faction NPCs have backstories', () => {
      const allNpcs = Object.values(FACTION_NPC_MAP).flat();
      for (const npcId of allNpcs) {
        expect(BACKSTORY_BY_NPC_ID[npcId], `${npcId}: no backstory found`).toBeDefined();
      }
    });
  });
});
