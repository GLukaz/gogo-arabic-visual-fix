import { describe, it, expect } from 'vitest';
import { shuffle } from '../shuffle.js';

describe('shuffle', () => {
  it('should return a new array without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const original = [...input];
    const result = shuffle(input);

    expect(input).toEqual(original);
    expect(result).not.toBe(input);
  });

  it('should return an array with the same length as input', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const result = shuffle(input);

    expect(result).toHaveLength(input.length);
  });

  it('should contain all the same elements as input', () => {
    const input = ['apple', 'banana', 'cherry', 'date', 'elderberry'];
    const result = shuffle(input);

    expect(result).toHaveLength(input.length);
    input.forEach(item => {
      expect(result).toContain(item);
    });
  });

  it('should handle empty array', () => {
    const result = shuffle([]);
    expect(result).toEqual([]);
  });

  it('should handle single-element array', () => {
    const result = shuffle([42]);
    expect(result).toEqual([42]);
  });

  it('should handle array with duplicate elements', () => {
    const input = [1, 1, 2, 2, 3, 3];
    const result = shuffle(input);

    expect(result).toHaveLength(6);
    expect(result.filter(x => x === 1)).toHaveLength(2);
    expect(result.filter(x => x === 2)).toHaveLength(2);
    expect(result.filter(x => x === 3)).toHaveLength(2);
  });

  it('should produce different results on consecutive calls (statistically)', () => {
    // This test verifies randomness - it may fail very rarely due to chance
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const results = new Set();

    // Run shuffle 10 times, expect at least 3 different orderings
    for (let i = 0; i < 10; i++) {
      results.add(JSON.stringify(shuffle(input)));
    }

    expect(results.size).toBeGreaterThan(2);
  });

  it('should work with non-numeric arrays', () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const result = shuffle(input);

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(input));
  });
});
