import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  generateSentence,
  generateSentenceBatch,
  classifyWords,
  TEMPLATES,
} from '../sentenceGenerator.js';

describe('sentenceGenerator', () => {
  const knownWords = [
    { id: 'kitab', arabic: 'كِتَاب', english: 'book', partOfSpeech: 'noun' },
    { id: 'qalam', arabic: 'قَلَم', english: 'pen', partOfSpeech: 'noun' },
    { id: 'kabir', arabic: 'كَبِير', english: 'big', partOfSpeech: 'adjective' },
    { id: 'saghir', arabic: 'صَغِير', english: 'small', partOfSpeech: 'adjective' },
    { id: 'kataba', arabic: 'كَتَبَ', english: 'wrote', partOfSpeech: 'verb' },
    { id: 'fi', arabic: 'فِي', english: 'in', partOfSpeech: 'preposition' },
    { id: 'maa', arabic: 'مَاء', english: 'water', partOfSpeech: 'noun' },
  ];

  describe('classifyWords', () => {
    it('should classify words by part of speech', () => {
      const { nouns, adjectives, verbs, prepositions } = classifyWords(knownWords);
      expect(nouns.length).toBeGreaterThanOrEqual(3);
      expect(adjectives.length).toBe(2);
      expect(verbs.length).toBe(1);
      expect(prepositions.length).toBe(1);
    });
  });

  describe('generateSentence', () => {
    it('should generate a sentence with correct structure', () => {
      const sentence = generateSentence(knownWords, []);
      expect(sentence).not.toBeNull();
      expect(sentence.english).toBeTruthy();
      expect(sentence.arabic).toBeTruthy();
      expect(sentence.tiles.length).toBeGreaterThan(0);
      expect(sentence.template).toBeTruthy();
    });

    it('should include distractor tiles', () => {
      const sentence = generateSentence(knownWords, []);
      expect(sentence.distractorTiles).toBeDefined();
      expect(sentence.distractorTiles.length).toBeGreaterThanOrEqual(0);
    });

    it('should return null for insufficient vocabulary', () => {
      const result = generateSentence([{ id: '1', arabic: 'أ', english: 'a' }], []);
      expect(result).toBeNull();
    });

    it('should return null for empty vocabulary', () => {
      expect(generateSentence([], [])).toBeNull();
      expect(generateSentence(null, [])).toBeNull();
    });
  });

  describe('generateSentenceBatch', () => {
    it('should generate multiple unique sentences', () => {
      const batch = generateSentenceBatch(knownWords, [], 3);
      expect(batch.length).toBeGreaterThan(0);
      expect(batch.length).toBeLessThanOrEqual(3);

      // Check uniqueness
      const arabicSet = new Set(batch.map((s) => s.arabic));
      expect(arabicSet.size).toBe(batch.length);
    });
  });

  describe('TEMPLATES', () => {
    it('should have at least 3 templates', () => {
      expect(TEMPLATES.length).toBeGreaterThanOrEqual(3);
    });

    it('each template should have required fields', () => {
      for (const t of TEMPLATES) {
        expect(t.id).toBeTruthy();
        expect(t.pattern).toBeTruthy();
        expect(typeof t.generate).toBe('function');
        expect(Array.isArray(t.requiredGrammar)).toBe(true);
      }
    });
  });
});
