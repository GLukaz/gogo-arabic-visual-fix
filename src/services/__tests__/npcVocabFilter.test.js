import { describe, it, expect } from 'vitest';
import {
  filterDialogue,
  buildVocabLookup,
  filterDialogueBatch,
  filterDialogueForPlayer,
} from '../npcVocabFilter.js';

describe('npcVocabFilter', () => {
  const vocabAll = [
    { id: 'kitab', arabic: 'كِتَاب', transliteration: 'kitaab' },
    { id: 'qalam', arabic: 'قَلَم', transliteration: 'qalam' },
    { id: 'maadir', arabic: 'مَادِر', transliteration: 'maadir' },
    { id: 'ahlan', arabic: 'أَهْلاً', transliteration: 'ahlan' },
  ];

  describe('buildVocabLookup', () => {
    it('should build known set from word IDs', () => {
      const { knownArabicSet } = buildVocabLookup(['kitab', 'ahlan'], vocabAll);
      expect(knownArabicSet.size).toBeGreaterThan(0);
    });

    it('should build transliteration map for all words', () => {
      const { transliterationMap } = buildVocabLookup([], vocabAll);
      expect(transliterationMap.size).toBe(vocabAll.length);
    });
  });

  describe('filterDialogue', () => {
    it('should annotate known and unknown words', () => {
      const { knownArabicSet, transliterationMap } = buildVocabLookup(['kitab'], vocabAll);

      const result = filterDialogue(
        { arabic: 'كِتَاب قَلَم', english: 'book pen' },
        knownArabicSet,
        transliterationMap
      );

      expect(result.annotations.length).toBe(2);
      expect(result.hasUnknownWords).toBe(true);

      const kitabAnnotation = result.annotations.find((a) => a.arabic === 'كِتَاب');
      expect(kitabAnnotation.known).toBe(true);

      const qalamAnnotation = result.annotations.find((a) => a.arabic === 'قَلَم');
      expect(qalamAnnotation.known).toBe(false);
    });

    it('should report no unknown words when all are known', () => {
      const { knownArabicSet, transliterationMap } = buildVocabLookup(
        ['kitab', 'qalam'],
        vocabAll
      );

      const result = filterDialogue(
        { arabic: 'كِتَاب قَلَم', english: 'book pen' },
        knownArabicSet,
        transliterationMap
      );

      expect(result.hasUnknownWords).toBe(false);
    });

    it('should include transliteration for unknown words', () => {
      const { knownArabicSet, transliterationMap } = buildVocabLookup([], vocabAll);

      const result = filterDialogue(
        { arabic: 'قَلَم', english: 'pen' },
        knownArabicSet,
        transliterationMap
      );

      expect(result.annotations[0].transliteration).toBe('qalam');
    });
  });

  describe('filterDialogueBatch', () => {
    it('should filter multiple dialogue lines', () => {
      const lines = [
        { arabic: 'كِتَاب', english: 'book' },
        { arabic: 'قَلَم', english: 'pen' },
      ];
      const results = filterDialogueBatch(lines, ['kitab'], vocabAll);
      expect(results.length).toBe(2);
      expect(results[0].hasUnknownWords).toBe(false);
      expect(results[1].hasUnknownWords).toBe(true);
    });
  });

  describe('filterDialogueForPlayer', () => {
    it('marks known words as known', () => {
      const result = filterDialogueForPlayer(
        { arabic: 'كِتَاب', english: 'book' },
        ['kitab'],
        vocabAll
      );
      expect(result.annotations[0].known).toBe(true);
    });

    it('marks unknown words as unknown with transliteration hint', () => {
      const result = filterDialogueForPlayer(
        { arabic: 'قَلَم', english: 'pen' },
        [],
        vocabAll
      );
      expect(result.annotations[0].known).toBe(false);
      expect(result.annotations[0].transliteration).toBe('qalam');
    });

    it('sets hasUnknownWords true when any word is unknown', () => {
      const result = filterDialogueForPlayer(
        { arabic: 'كِتَاب قَلَم', english: 'book pen' },
        ['kitab'],
        vocabAll
      );
      expect(result.hasUnknownWords).toBe(true);
    });

    it('sets hasUnknownWords false when all words are known', () => {
      const result = filterDialogueForPlayer(
        { arabic: 'كِتَاب قَلَم', english: 'book pen' },
        ['kitab', 'qalam'],
        vocabAll
      );
      expect(result.hasUnknownWords).toBe(false);
    });

    it('accepts a Set of known word IDs', () => {
      const result = filterDialogueForPlayer(
        { arabic: 'كِتَاب', english: 'book' },
        new Set(['kitab']),
        vocabAll
      );
      expect(result.annotations[0].known).toBe(true);
    });

    it('handles empty dialogue gracefully', () => {
      const result = filterDialogueForPlayer(
        { arabic: '', english: '' },
        ['kitab'],
        vocabAll
      );
      expect(result.annotations).toEqual([]);
      expect(result.hasUnknownWords).toBe(false);
    });
  });
});
