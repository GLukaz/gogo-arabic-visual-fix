import { describe, it, expect } from 'vitest';
import {
  NPC_DIALOGUE_EXPANSION,
  DIALOGUE_EXPANDED_NPC_IDS,
  getNpcDialogueExpansion,
  getUnlockedDialogues,
} from '../npcDialogueExpansion.js';

describe('npcDialogueExpansion data integrity', () => {
  it('has dialogues for exactly 24 NPCs', () => {
    expect(DIALOGUE_EXPANDED_NPC_IDS).toHaveLength(24);
  });

  it('all 24 expected NPC IDs are present', () => {
    const expectedIds = [
      // Scholars
      'scholar-yusuf', 'librarian-ibrahim', 'scribe-amina', 'astronomer-zain',
      // Merchants
      'merchant-fatima', 'trader-hassan', 'spice-seller-layla', 'carpet-seller-jamal',
      // Artisans
      'blacksmith-daud', 'weaver-zahra', 'baker-yasmin', 'herbalist-maryam',
      // Travelers
      'guide-amira', 'wanderer-ali', 'captain-rashid', 'guide-salim',
      // Guardians
      'guard-hamza', 'vizier-abbas', 'dockmaster-nadia', 'mountain-hermit-idris',
      // Artists
      'storyteller-noor', 'poet-rumi', 'princess-aisha', 'garden-keeper-leila',
    ];

    for (const id of expectedIds) {
      expect(DIALOGUE_EXPANDED_NPC_IDS, `Missing NPC: ${id}`).toContain(id);
    }
  });

  it('all NPCs have friendlyDialogues, closeDialogues, and secretDialogues', () => {
    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];
      expect(expansion.friendlyDialogues, `${npcId}: missing friendlyDialogues`).toBeDefined();
      expect(expansion.closeDialogues, `${npcId}: missing closeDialogues`).toBeDefined();
      expect(expansion.secretDialogues, `${npcId}: missing secretDialogues`).toBeDefined();
      expect(Array.isArray(expansion.friendlyDialogues), `${npcId}: friendlyDialogues not array`).toBe(true);
      expect(Array.isArray(expansion.closeDialogues), `${npcId}: closeDialogues not array`).toBe(true);
      expect(Array.isArray(expansion.secretDialogues), `${npcId}: secretDialogues not array`).toBe(true);
    }
  });

  it('all NPCs have at least 1 dialogue per tier', () => {
    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];
      expect(expansion.friendlyDialogues.length, `${npcId}: no friendlyDialogues`).toBeGreaterThanOrEqual(1);
      expect(expansion.closeDialogues.length, `${npcId}: no closeDialogues`).toBeGreaterThanOrEqual(1);
      expect(expansion.secretDialogues.length, `${npcId}: no secretDialogues`).toBeGreaterThanOrEqual(1);
    }
  });

  it('all dialogues have valid trigger strings', () => {
    const validTriggers = ['friendship_50', 'friendship_75', 'friendship_90'];
    const expectedTriggers = {
      friendlyDialogues: 'friendship_50',
      closeDialogues: 'friendship_75',
      secretDialogues: 'friendship_90',
    };

    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];

      for (const [tierKey, expectedTrigger] of Object.entries(expectedTriggers)) {
        for (const dialogue of expansion[tierKey]) {
          expect(validTriggers, `${npcId}: invalid trigger ${dialogue.trigger}`).toContain(dialogue.trigger);
          expect(dialogue.trigger, `${npcId}: ${tierKey} has wrong trigger`).toBe(expectedTrigger);
        }
      }
    }
  });

  it('all dialogues have a topic string', () => {
    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];

      for (const tier of ['friendlyDialogues', 'closeDialogues', 'secretDialogues']) {
        for (const dialogue of expansion[tier]) {
          expect(dialogue.topic, `${npcId} ${tier}: missing topic`).toBeTruthy();
          expect(typeof dialogue.topic, `${npcId} ${tier}: topic not string`).toBe('string');
        }
      }
    }
  });

  it('all dialogues have non-empty lines array', () => {
    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];

      for (const tier of ['friendlyDialogues', 'closeDialogues', 'secretDialogues']) {
        for (const dialogue of expansion[tier]) {
          expect(dialogue.lines.length, `${npcId} ${tier}: no lines`).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  it('all dialogue lines have speaker, arabic, and english', () => {
    const arabicRegex = /[\u0600-\u06FF]/;

    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];

      for (const tier of ['friendlyDialogues', 'closeDialogues', 'secretDialogues']) {
        for (const dialogue of expansion[tier]) {
          for (const line of dialogue.lines) {
            expect(line.speaker, `${npcId} ${tier}: line missing speaker`).toBeTruthy();
            expect(line.arabic, `${npcId} ${tier}: line missing arabic`).toBeTruthy();
            expect(line.english, `${npcId} ${tier}: line missing english`).toBeTruthy();
            expect(
              arabicRegex.test(line.arabic),
              `${npcId} ${tier}: line arabic has no Arabic characters`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('all dialogues have a teachWord', () => {
    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];

      for (const tier of ['friendlyDialogues', 'closeDialogues', 'secretDialogues']) {
        for (const dialogue of expansion[tier]) {
          expect(dialogue.teachWord, `${npcId} ${tier}: missing teachWord`).toBeTruthy();
          expect(typeof dialogue.teachWord, `${npcId} ${tier}: teachWord not string`).toBe('string');
        }
      }
    }
  });

  it('dialogue lines have valid speakers (npcId or player)', () => {
    for (const npcId of DIALOGUE_EXPANDED_NPC_IDS) {
      const expansion = NPC_DIALOGUE_EXPANSION[npcId];

      for (const tier of ['friendlyDialogues', 'closeDialogues', 'secretDialogues']) {
        for (const dialogue of expansion[tier]) {
          for (const line of dialogue.lines) {
            const validSpeakers = [npcId, 'player'];
            expect(
              validSpeakers,
              `${npcId} ${tier}: invalid speaker ${line.speaker}`,
            ).toContain(line.speaker);
          }
        }
      }
    }
  });

  describe('helper functions', () => {
    it('getNpcDialogueExpansion returns correct data', () => {
      const result = getNpcDialogueExpansion('scholar-yusuf');
      expect(result).toBeDefined();
      expect(result.friendlyDialogues).toBeDefined();
    });

    it('getNpcDialogueExpansion returns null for unknown NPC', () => {
      expect(getNpcDialogueExpansion('nonexistent')).toBeNull();
    });

    it('getUnlockedDialogues returns nothing at friendship 0', () => {
      const result = getUnlockedDialogues('scholar-yusuf', 0);
      expect(result).toHaveLength(0);
    });

    it('getUnlockedDialogues returns friendlyDialogues at friendship 50', () => {
      const result = getUnlockedDialogues('scholar-yusuf', 50);
      expect(result.length).toBeGreaterThanOrEqual(1);
      expect(result.every((d) => d.trigger === 'friendship_50')).toBe(true);
    });

    it('getUnlockedDialogues returns friendly + close at friendship 75', () => {
      const result = getUnlockedDialogues('scholar-yusuf', 75);
      expect(result.length).toBeGreaterThanOrEqual(2);
      const triggers = new Set(result.map((d) => d.trigger));
      expect(triggers).toContain('friendship_50');
      expect(triggers).toContain('friendship_75');
    });

    it('getUnlockedDialogues returns all tiers at friendship 90+', () => {
      const result = getUnlockedDialogues('scholar-yusuf', 100);
      expect(result.length).toBeGreaterThanOrEqual(3);
      const triggers = new Set(result.map((d) => d.trigger));
      expect(triggers).toContain('friendship_50');
      expect(triggers).toContain('friendship_75');
      expect(triggers).toContain('friendship_90');
    });

    it('getUnlockedDialogues returns empty for unknown NPC', () => {
      const result = getUnlockedDialogues('nonexistent', 100);
      expect(result).toHaveLength(0);
    });
  });
});
