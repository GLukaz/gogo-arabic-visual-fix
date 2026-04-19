import { describe, it, expect, beforeEach } from 'vitest';
import { getRootFamily, clearRootFamilyCache } from '../rootFamilyService.js';

// Mock rootsData module
import { vi } from 'vitest';

vi.mock('../../data/rootsData.js', () => ({
  getRootWords: vi.fn((root) => {
    const mockRoots = {
      'كتب': {
        root: 'كتب',
        rootSpaced: 'ك ت ب',
        meaning: 'to write',
        words: ['كَتَبَ', 'مَكْتَبَة', 'كَاتِب', 'كِتَاب', 'مَكْتُوب'],
      },
      'علم': {
        root: 'علم',
        rootSpaced: 'ع ل م',
        meaning: 'to know',
        words: ['عَلِمَ', 'عِلْم', 'عَالِم', 'مَعْلُوم'],
      },
    };
    return mockRoots[root] || null;
  }),
  getWordRoot: vi.fn((arabic) => {
    if (arabic === 'كِتَاب') {
      return {
        root: 'كتب',
        rootSpaced: 'ك ت ب',
        meaning: 'to write',
        words: ['كَتَبَ', 'مَكْتَبَة', 'كَاتِب', 'كِتَاب', 'مَكْتُوب'],
      };
    }
    return null;
  }),
}));

describe('rootFamilyService', () => {
  beforeEach(() => {
    clearRootFamilyCache();
  });

  it('should return family words for a known root via rootLetters', () => {
    const result = getRootFamily('kitab_1', 'كِتَاب', 'ك-ت-ب');
    expect(result).not.toBeNull();
    expect(result.root).toBe('ك ت ب');
    expect(result.rootMeaning).toBe('to write');
    expect(result.familyWords.length).toBeGreaterThan(0);
  });

  it('should exclude the current word from family list', () => {
    const result = getRootFamily('kitab_1', 'كِتَاب', 'ك-ت-ب');
    const familyArabic = result.familyWords.map((w) => w.arabic);
    expect(familyArabic).not.toContain('كِتَاب');
  });

  it('should fall back to getWordRoot when rootLetters is null', () => {
    const result = getRootFamily('kitab_2', 'كِتَاب', null);
    expect(result).not.toBeNull();
    expect(result.root).toBe('ك ت ب');
  });

  it('should return null for unknown words', () => {
    const result = getRootFamily('unknown_1', 'مجهول', null);
    expect(result).toBeNull();
  });

  it('should cache results', () => {
    const r1 = getRootFamily('kitab_1', 'كِتَاب', 'ك-ت-ب');
    const r2 = getRootFamily('kitab_1', 'كِتَاب', 'ك-ت-ب');
    expect(r1).toBe(r2); // Same reference
  });

  it('should limit family words to 4', () => {
    const result = getRootFamily('katab_1', 'كَتَبَ', 'ك-ت-ب');
    // Root has 5 words, minus current word = 4, which matches limit
    expect(result.familyWords.length).toBeLessThanOrEqual(4);
  });

  it('should handle spaced root letters (ك ت ب)', () => {
    const result = getRootFamily('kitab_3', 'كِتَاب', 'ك ت ب');
    expect(result).not.toBeNull();
  });

  it('should clear cache when clearRootFamilyCache is called', () => {
    getRootFamily('kitab_1', 'كِتَاب', 'ك-ت-ب');
    clearRootFamilyCache();
    // After clearing, it will recompute (still return same result)
    const result = getRootFamily('kitab_1', 'كِتَاب', 'ك-ت-ب');
    expect(result).not.toBeNull();
  });
});
