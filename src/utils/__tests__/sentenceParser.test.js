/**
 * Unit tests for sentenceParser utility functions
 */

import {
  removeDiacritics,
  splitSentence,
  validateSentence,
  findTargetWordIndex,
  generateDistractors,
  prepareSentenceQuiz,
} from '../sentenceParser.js';

describe('sentenceParser', () => {
  describe('removeDiacritics', () => {
    it('removes Arabic diacritics from text', () => {
      expect(removeDiacritics('كَبِيرٌ')).toBe('كبير');
      expect(removeDiacritics('هٰذَا بَيْتٌ كَبِيرٌ')).toBe('هذا بيت كبير');
    });

    it('handles text without diacritics', () => {
      expect(removeDiacritics('كبير')).toBe('كبير');
    });

    it('handles empty or null input', () => {
      expect(removeDiacritics('')).toBe('');
      expect(removeDiacritics(null)).toBe('');
    });
  });

  describe('splitSentence', () => {
    it('splits Arabic sentence into words', () => {
      const words = splitSentence('هذا بيت كبير');
      expect(words).toEqual(['هذا', 'بيت', 'كبير']);
    });

    it('handles Arabic punctuation', () => {
      const words = splitSentence('هذا بيت، كبير؟');
      expect(words).toEqual(['هذا', 'بيت', 'كبير']);
    });

    it('handles empty or null input', () => {
      expect(splitSentence('')).toEqual([]);
      expect(splitSentence(null)).toEqual([]);
    });
  });

  describe('validateSentence', () => {
    it('validates correct word order', () => {
      const correct = ['هذا', 'بيت', 'كبير'];
      const user = ['هذا', 'بيت', 'كبير'];
      expect(validateSentence(user, correct)).toBe(true);
    });

    it('validates with diacritics normalized', () => {
      const correct = ['هٰذَا', 'بَيْتٌ', 'كَبِيرٌ'];
      const user = ['هذا', 'بيت', 'كبير'];
      expect(validateSentence(user, correct)).toBe(true);
    });

    it('rejects incorrect word order', () => {
      const correct = ['هذا', 'بيت', 'كبير'];
      const user = ['بيت', 'هذا', 'كبير'];
      expect(validateSentence(user, correct)).toBe(false);
    });

    it('rejects different length arrays', () => {
      const correct = ['هذا', 'بيت', 'كبير'];
      const user = ['هذا', 'بيت'];
      expect(validateSentence(user, correct)).toBe(false);
    });
  });

  describe('findTargetWordIndex', () => {
    it('finds target word in sentence', () => {
      const sentenceWords = ['هذا', 'بيت', 'كبير'];
      const index = findTargetWordIndex('كبير', sentenceWords);
      expect(index).toBe(2);
    });

    it('finds target word with diacritics normalized', () => {
      const sentenceWords = ['هٰذَا', 'بَيْتٌ', 'كَبِيرٌ'];
      const index = findTargetWordIndex('كبير', sentenceWords);
      expect(index).toBe(2);
    });

    it('returns -1 when word not found', () => {
      const sentenceWords = ['هذا', 'بيت', 'كبير'];
      const index = findTargetWordIndex('صغير', sentenceWords);
      expect(index).toBe(-1);
    });
  });

  describe('generateDistractors', () => {
    const mockVocab = [
      { id: '1', arabic: 'كبير', category: 'adjectives', difficulty: 2 },
      { id: '2', arabic: 'صغير', category: 'adjectives', difficulty: 2 },
      { id: '3', arabic: 'جديد', category: 'adjectives', difficulty: 2 },
      { id: '4', arabic: 'قديم', category: 'adjectives', difficulty: 2 },
      { id: '5', arabic: 'بيت', category: 'nouns', difficulty: 1 },
    ];

    it('generates distractors from same category', () => {
      const targetWord = mockVocab[0]; // كبير
      const distractors = generateDistractors(targetWord, mockVocab, 3);

      expect(distractors.length).toBe(3);
      expect(distractors).not.toContain('كبير'); // Should not include target
    });

    it('does not include the target word', () => {
      const targetWord = mockVocab[0];
      const distractors = generateDistractors(targetWord, mockVocab, 3);

      expect(distractors.includes(targetWord.arabic)).toBe(false);
    });

    it('handles empty vocabulary pool', () => {
      const targetWord = mockVocab[0];
      const distractors = generateDistractors(targetWord, [], 3);

      expect(distractors).toEqual([]);
    });
  });

  describe('prepareSentenceQuiz', () => {
    const mockVocab = [
      { id: '1', arabic: 'كبير', english: 'big', category: 'adjectives', difficulty: 2 },
      { id: '2', arabic: 'صغير', english: 'small', category: 'adjectives', difficulty: 2 },
      { id: '3', arabic: 'بيت', english: 'house', category: 'nouns', difficulty: 1 },
    ];

    const mockWord = {
      id: '1',
      arabic: 'كبير',
      english: 'big',
      exampleSentence: {
        arabic: 'هذا بيت كبير',
        english: 'This is a big house',
        transliteration: 'haadha baytun kabiir',
      },
      category: 'adjectives',
      difficulty: 2,
    };

    it('prepares quiz data with all required fields', () => {
      const quizData = prepareSentenceQuiz(mockWord, mockVocab);

      expect(quizData).toBeTruthy();
      expect(quizData.correctWords).toBeTruthy();
      expect(quizData.allWords).toBeTruthy();
      expect(quizData.englishSentence).toBe('This is a big house');
      expect(quizData.targetWord).toBe('كبير');
      expect(quizData.targetWordEnglish).toBe('big');
    });

    it('includes distractors in allWords', () => {
      const quizData = prepareSentenceQuiz(mockWord, mockVocab);

      // allWords should have more words than correctWords (due to distractors)
      expect(quizData.allWords.length).toBeGreaterThan(quizData.correctWords.length);
    });

    it('returns null for word without example sentence', () => {
      const wordNoSentence = { ...mockWord, exampleSentence: null };
      const quizData = prepareSentenceQuiz(wordNoSentence, mockVocab);

      expect(quizData).toBeNull();
    });
  });
});
