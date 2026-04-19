/**
 * Test suite for sync merge utilities
 * Run with: npm test -- syncMerge.test.js
 */

import { describe, it, expect } from 'vitest';
import {
  mergeMax,
  mergeArraysUnion,
  mergeLatestDate,
  mergeQuest,
  mergeQuests,
  mergeFsrsCard,
  mergeFsrsCards,
  mergeGameStates,
} from '../src/utils/syncMerge.js';

describe('syncMerge utilities', () => {
  describe('mergeMax', () => {
    it('should return the maximum of two numbers', () => {
      expect(mergeMax(5, 10)).toBe(10);
      expect(mergeMax(20, 15)).toBe(20);
      expect(mergeMax(0, 0)).toBe(0);
    });

    it('should handle null/undefined with default value', () => {
      expect(mergeMax(null, null, 100)).toBe(100);
      expect(mergeMax(undefined, 50, 0)).toBe(50);
      expect(mergeMax(30, null, 0)).toBe(30);
    });
  });

  describe('mergeArraysUnion', () => {
    it('should merge two arrays with no duplicates', () => {
      const arr1 = ['a', 'b', 'c'];
      const arr2 = ['b', 'c', 'd'];
      const result = mergeArraysUnion(arr1, arr2);
      expect(result.sort()).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should handle empty arrays', () => {
      expect(mergeArraysUnion([], ['a', 'b'])).toEqual(['a', 'b']);
      expect(mergeArraysUnion(['a', 'b'], [])).toEqual(['a', 'b']);
      expect(mergeArraysUnion([], [])).toEqual([]);
    });

    it('should handle null/undefined', () => {
      expect(mergeArraysUnion(null, ['a'])).toEqual(['a']);
      expect(mergeArraysUnion(['a'], undefined)).toEqual(['a']);
    });
  });

  describe('mergeLatestDate', () => {
    it('should return the more recent date', () => {
      const date1 = '2026-02-01T10:00:00.000Z';
      const date2 = '2026-02-08T10:00:00.000Z';
      expect(mergeLatestDate(date1, date2)).toBe(date2);
      expect(mergeLatestDate(date2, date1)).toBe(date2);
    });

    it('should handle null dates', () => {
      const date = '2026-02-08T10:00:00.000Z';
      expect(mergeLatestDate(null, date)).toBe(date);
      expect(mergeLatestDate(date, null)).toBe(date);
      expect(mergeLatestDate(null, null)).toBeNull();
    });
  });

  describe('mergeQuest', () => {
    it('should prefer completed over active', () => {
      const quest1 = { id: 'q1', status: 'active', progress: 5 };
      const quest2 = { id: 'q1', status: 'completed', progress: 10 };
      const result = mergeQuest(quest1, quest2);
      expect(result.status).toBe('completed');
    });

    it('should prefer active over available', () => {
      const quest1 = { id: 'q1', status: 'available', progress: 0 };
      const quest2 = { id: 'q1', status: 'active', progress: 3 };
      const result = mergeQuest(quest1, quest2);
      expect(result.status).toBe('active');
    });

    it('should take higher progress if same status', () => {
      const quest1 = { id: 'q1', status: 'active', progress: 8 };
      const quest2 = { id: 'q1', status: 'active', progress: 5 };
      const result = mergeQuest(quest1, quest2);
      expect(result.progress).toBe(8);
    });

    it('should handle null quests', () => {
      const quest = { id: 'q1', status: 'active', progress: 5 };
      expect(mergeQuest(null, quest)).toEqual(quest);
      expect(mergeQuest(quest, null)).toEqual(quest);
    });
  });

  describe('mergeQuests', () => {
    it('should merge quest collections', () => {
      const quests1 = {
        q1: { id: 'q1', status: 'active', progress: 5 },
        q2: { id: 'q2', status: 'completed', progress: 10 },
      };
      const quests2 = {
        q1: { id: 'q1', status: 'completed', progress: 10 },
        q3: { id: 'q3', status: 'available', progress: 0 },
      };
      const result = mergeQuests(quests1, quests2);

      expect(result.q1.status).toBe('completed');
      expect(result.q2.status).toBe('completed');
      expect(result.q3.status).toBe('available');
    });
  });

  describe('mergeFsrsCard', () => {
    it('should prefer card with later due date', () => {
      const card1 = { card: { due: '2026-02-10T10:00:00.000Z' } };
      const card2 = { card: { due: '2026-02-15T10:00:00.000Z' } };
      const result = mergeFsrsCard(card1, card2);
      expect(result).toEqual(card2);
    });

    it('should handle cards without due dates', () => {
      const card1 = { card: {} };
      const card2 = { card: { due: '2026-02-15T10:00:00.000Z' } };
      const result = mergeFsrsCard(card1, card2);
      expect(result).toEqual(card2);
    });

    it('should handle null cards', () => {
      const card = { card: { due: '2026-02-15T10:00:00.000Z' } };
      expect(mergeFsrsCard(null, card)).toEqual(card);
      expect(mergeFsrsCard(card, null)).toEqual(card);
    });
  });

  describe('mergeFsrsCards', () => {
    it('should merge FSRS card collections', () => {
      const cards1 = {
        word1: { card: { due: '2026-02-10T10:00:00.000Z' } },
        word2: { card: { due: '2026-02-12T10:00:00.000Z' } },
      };
      const cards2 = {
        word1: { card: { due: '2026-02-15T10:00:00.000Z' } },
        word3: { card: { due: '2026-02-14T10:00:00.000Z' } },
      };
      const result = mergeFsrsCards(cards1, cards2);

      expect(result.word1.card.due).toBe('2026-02-15T10:00:00.000Z');
      expect(result.word2).toEqual(cards1.word2);
      expect(result.word3).toEqual(cards2.word3);
    });
  });

  describe('mergeGameStates', () => {
    it('should merge complete game states with correct strategy', () => {
      const clientState = {
        player: {
          level: 5,
          xp: 500,
          dirhams: 100,
          streak: 7,
          wordsLearned: 50,
          inventory: ['sword', 'shield'],
          character: { outfit: 'thobe_blue' },
        },
        settings: {
          volumeAmbience: 0.5,
          showDiacritics: true,
        },
      };

      const serverState = {
        player: {
          level: 4,
          xp: 600,
          dirhams: 80,
          streak: 10,
          wordsLearned: 45,
          inventory: ['shield', 'potion'],
          character: { outfit: 'thobe_white' },
        },
        settings: {
          volumeAmbience: 0.3,
          showTransliteration: true,
        },
      };

      const merged = mergeGameStates(clientState, serverState);

      // Should take max values
      expect(merged.player.level).toBe(5);
      expect(merged.player.xp).toBe(600);
      expect(merged.player.dirhams).toBe(100);
      expect(merged.player.streak).toBe(10);
      expect(merged.player.wordsLearned).toBe(50);

      // Should union inventory
      expect(merged.player.inventory.sort()).toEqual(['potion', 'shield', 'sword']);

      // Should prefer client character
      expect(merged.player.character.outfit).toBe('thobe_blue');

      // Should prefer client settings (merged)
      expect(merged.settings.volumeAmbience).toBe(0.5); // client
      expect(merged.settings.showDiacritics).toBe(true); // client
      expect(merged.settings.showTransliteration).toBe(true); // server
    });

    it('should handle missing player data gracefully', () => {
      const clientState = { player: { level: 5 } };
      const serverState = { player: { xp: 100 } };

      const merged = mergeGameStates(clientState, serverState);

      expect(merged.player.level).toBe(5);
      expect(merged.player.xp).toBe(100);
    });

    it('should merge with default values when both states are empty', () => {
      const merged = mergeGameStates({}, {});

      expect(merged.player.level).toBe(1);
      expect(merged.player.xp).toBe(0);
      expect(merged.player.dirhams).toBe(0);
      expect(merged.player.inventory).toEqual([]);
    });
  });
});
