import { describe, it, expect } from 'vitest';
import { normalizeArabicNumber, formatAsEasternArabic, formatWithSeparators } from '../arabicNumbers.js';

describe('arabicNumbers', () => {
  describe('normalizeArabicNumber', () => {
    it('converts Eastern Arabic ٨٠٠ to 800', () => {
      expect(normalizeArabicNumber('٨٠٠')).toBe(800);
    });

    it('handles Western Arabic 800 as-is', () => {
      expect(normalizeArabicNumber('800')).toBe(800);
    });

    it('handles mixed input ٨00 = 800', () => {
      expect(normalizeArabicNumber('٨00')).toBe(800);
    });

    it('returns 0 for empty string', () => {
      expect(normalizeArabicNumber('')).toBe(0);
    });

    it('returns 0 for non-numeric input', () => {
      expect(normalizeArabicNumber('abc')).toBe(0);
    });

    it('strips non-digit characters', () => {
      expect(normalizeArabicNumber('٨٠٠ dirhams')).toBe(800);
      expect(normalizeArabicNumber('price: ١٢٣')).toBe(123);
    });

    it('handles single digit ٥ = 5', () => {
      expect(normalizeArabicNumber('٥')).toBe(5);
    });

    it('handles all Eastern Arabic digits ٠-٩', () => {
      expect(normalizeArabicNumber('٠')).toBe(0);
      expect(normalizeArabicNumber('١')).toBe(1);
      expect(normalizeArabicNumber('٢')).toBe(2);
      expect(normalizeArabicNumber('٣')).toBe(3);
      expect(normalizeArabicNumber('٤')).toBe(4);
      expect(normalizeArabicNumber('٥')).toBe(5);
      expect(normalizeArabicNumber('٦')).toBe(6);
      expect(normalizeArabicNumber('٧')).toBe(7);
      expect(normalizeArabicNumber('٨')).toBe(8);
      expect(normalizeArabicNumber('٩')).toBe(9);
    });

    it('caps at 9999', () => {
      expect(normalizeArabicNumber('10000')).toBe(9999);
      expect(normalizeArabicNumber('١٠٠٠٠')).toBe(9999);
      expect(normalizeArabicNumber('99999')).toBe(9999);
    });

    it('handles numeric input directly', () => {
      expect(normalizeArabicNumber(800)).toBe(800);
      expect(normalizeArabicNumber(0)).toBe(0);
      expect(normalizeArabicNumber(5)).toBe(5);
    });

    it('clamps negative numbers to 0', () => {
      expect(normalizeArabicNumber(-50)).toBe(0);
    });

    it('handles null and undefined', () => {
      expect(normalizeArabicNumber(null)).toBe(0);
      expect(normalizeArabicNumber(undefined)).toBe(0);
    });
  });

  describe('formatAsEasternArabic', () => {
    it('converts 800 to ٨٠٠', () => {
      expect(formatAsEasternArabic(800)).toBe('٨٠٠');
    });

    it('converts 0 to ٠', () => {
      expect(formatAsEasternArabic(0)).toBe('٠');
    });

    it('converts 9999 to ٩٩٩٩', () => {
      expect(formatAsEasternArabic(9999)).toBe('٩٩٩٩');
    });

    it('converts all Western digits 0-9', () => {
      expect(formatAsEasternArabic(1234567890)).toBe('١٢٣٤٥٦٧٨٩٠');
    });

    it('handles single digit', () => {
      expect(formatAsEasternArabic(5)).toBe('٥');
    });

    it('preserves non-digit characters in string conversion', () => {
      // formatAsEasternArabic uses String(number) first, so no non-digits
      // But test the replacement logic works
      expect(formatAsEasternArabic(123)).toBe('١٢٣');
    });
  });

  describe('formatWithSeparators', () => {
    it('formats 1234 as 1,234 (Western)', () => {
      expect(formatWithSeparators(1234)).toBe('1,234');
    });

    it('formats 1234 as ١٢٣٤ (Eastern with useEastern=true, no separators)', () => {
      // Current implementation converts to Eastern but doesn't add separators
      expect(formatWithSeparators(1234, true)).toBe('١٢٣٤');
    });

    it('handles numbers under 1000 without separator', () => {
      expect(formatWithSeparators(999)).toBe('999');
      expect(formatWithSeparators(999, true)).toBe('٩٩٩');
    });

    it('handles 0', () => {
      expect(formatWithSeparators(0)).toBe('0');
      expect(formatWithSeparators(0, true)).toBe('٠');
    });

    it('formats large numbers with multiple separators', () => {
      expect(formatWithSeparators(1234567)).toBe('1,234,567');
    });

    it('formats large numbers with Eastern Arabic (no separators)', () => {
      const result = formatWithSeparators(1234567, true);
      // Current implementation: Eastern numerals without separators
      expect(result).toMatch(/[٠-٩]/); // Eastern numerals
      expect(result).toBe('١٢٣٤٥٦٧');
    });
  });
});
