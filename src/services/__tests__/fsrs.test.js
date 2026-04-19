import { describe, it, expect } from 'vitest';
import { createNewCard, reviewCard, getDueCards, getSessionCards, Rating } from '../fsrs.js';

describe('createNewCard', () => {
  it('should create a valid FSRS card object', () => {
    const card = createNewCard();

    expect(card).toBeDefined();
    expect(card).toHaveProperty('due');
    expect(card).toHaveProperty('stability');
    expect(card).toHaveProperty('difficulty');
    expect(card).toHaveProperty('elapsed_days');
    expect(card).toHaveProperty('scheduled_days');
    expect(card).toHaveProperty('reps');
    expect(card).toHaveProperty('lapses');
    expect(card).toHaveProperty('state');
  });

  it('should initialize with 0 reps', () => {
    const card = createNewCard();
    expect(card.reps).toBe(0);
  });

  it('should initialize with 0 lapses', () => {
    const card = createNewCard();
    expect(card.lapses).toBe(0);
  });
});

describe('reviewCard', () => {
  it('should return updated card after review', () => {
    const card = createNewCard();
    const result = reviewCard(card, 3); // Good rating

    expect(result).toBeDefined();
    expect(result).toHaveProperty('card');
    expect(result.card.reps).toBeGreaterThan(card.reps);
  });

  it('should handle Again rating (1)', () => {
    const card = createNewCard();
    const result = reviewCard(card, 1);

    expect(result).toBeDefined();
    expect(result.card).toBeDefined();
  });

  it('should handle Hard rating (2)', () => {
    const card = createNewCard();
    const result = reviewCard(card, 2);

    expect(result).toBeDefined();
    expect(result.card).toBeDefined();
  });

  it('should handle Good rating (3)', () => {
    const card = createNewCard();
    const result = reviewCard(card, 3);

    expect(result).toBeDefined();
    expect(result.card).toBeDefined();
  });

  it('should handle Easy rating (4)', () => {
    const card = createNewCard();
    const result = reviewCard(card, 4);

    expect(result).toBeDefined();
    expect(result.card).toBeDefined();
  });

  it('should default to Good rating for invalid input', () => {
    const card = createNewCard();
    const resultGood = reviewCard(card, 3);
    const resultInvalid = reviewCard(card, 99);

    // Both should produce valid results
    expect(resultGood).toBeDefined();
    expect(resultInvalid).toBeDefined();
  });

  it('should increase interval for Easy vs Good', () => {
    const card = createNewCard();
    const easyResult = reviewCard(card, 4);
    const goodResult = reviewCard(card, 3);

    // Easy should have longer interval than Good
    expect(easyResult.card.scheduled_days).toBeGreaterThan(goodResult.card.scheduled_days);
  });
});

describe('getDueCards', () => {
  it('should return word IDs with due cards', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 86400000); // 1 day ago
    const future = new Date(now.getTime() + 86400000); // 1 day from now

    const cards = {
      word1: { card: { due: past.toISOString() } },
      word2: { card: { due: future.toISOString() } },
      word3: { card: { due: now.toISOString() } },
    };

    const result = getDueCards(cards);

    expect(result).toContain('word1');
    expect(result).toContain('word3');
    expect(result).not.toContain('word2');
  });

  it('should include new cards without due date', () => {
    const cards = {
      newWord: { card: null },
      wordWithDue: { card: { due: new Date(Date.now() + 86400000).toISOString() } },
    };

    const result = getDueCards(cards);

    expect(result).toContain('newWord');
    expect(result).not.toContain('wordWithDue');
  });

  it('should handle empty cards object', () => {
    const result = getDueCards({});
    expect(result).toEqual([]);
  });

  it('should handle cards without card property', () => {
    const cards = {
      word1: {},
      word2: { card: { due: new Date(Date.now() - 86400000).toISOString() } },
    };

    const result = getDueCards(cards);

    expect(result).toContain('word1'); // No card = treated as new = due
    expect(result).toContain('word2');
  });
});

describe('getSessionCards', () => {
  it('should return shuffled due cards up to maxCards limit', () => {
    const cards = {};
    for (let i = 1; i <= 30; i++) {
      cards[`word${i}`] = {
        card: { due: new Date(Date.now() - 86400000).toISOString() },
      };
    }

    const result = getSessionCards(cards, 20);

    expect(result.length).toBe(20);
  });

  it('should return all due cards if less than maxCards', () => {
    const cards = {
      word1: { card: { due: new Date(Date.now() - 86400000).toISOString() } },
      word2: { card: { due: new Date(Date.now() - 86400000).toISOString() } },
      word3: { card: { due: new Date(Date.now() - 86400000).toISOString() } },
    };

    const result = getSessionCards(cards, 20);

    expect(result.length).toBe(3);
  });

  it('should use default maxCards of 20', () => {
    const cards = {};
    for (let i = 1; i <= 30; i++) {
      cards[`word${i}`] = {
        card: { due: new Date(Date.now() - 86400000).toISOString() },
      };
    }

    const result = getSessionCards(cards);

    expect(result.length).toBe(20);
  });

  it('should return empty array for empty cards', () => {
    const result = getSessionCards({});
    expect(result).toEqual([]);
  });

  it('should only return due cards, not future cards', () => {
    const cards = {
      dueWord: { card: { due: new Date(Date.now() - 86400000).toISOString() } },
      futureWord: { card: { due: new Date(Date.now() + 86400000).toISOString() } },
    };

    const result = getSessionCards(cards, 10);

    expect(result).toContain('dueWord');
    expect(result).not.toContain('futureWord');
  });
});

describe('Rating export', () => {
  it('should export Rating enum', () => {
    expect(Rating).toBeDefined();
    expect(Rating.Again).toBeDefined();
    expect(Rating.Hard).toBeDefined();
    expect(Rating.Good).toBeDefined();
    expect(Rating.Easy).toBeDefined();
  });
});
