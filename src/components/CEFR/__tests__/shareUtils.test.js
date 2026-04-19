import { describe, it, expect } from 'vitest';
import { buildShareText } from '../shareUtils.js';

describe('buildShareText', () => {
  it('includes current CEFR level', () => {
    const text = buildShareText({ currentLevel: 'A2', wordsLearned: 150, playerLevel: 8 });
    expect(text).toContain('A2');
  });

  it('includes words learned count', () => {
    const text = buildShareText({ currentLevel: 'B1', wordsLearned: 300, playerLevel: 12 });
    expect(text).toContain('300');
  });

  it('includes player level', () => {
    const text = buildShareText({ currentLevel: 'A1', wordsLearned: 50, playerLevel: 3 });
    expect(text).toContain('Level 3');
  });

  it('includes gogo-arabic.com URL', () => {
    const text = buildShareText({ currentLevel: 'A1', wordsLearned: 10, playerLevel: 1 });
    expect(text).toContain('gogo-arabic.com');
  });
});
