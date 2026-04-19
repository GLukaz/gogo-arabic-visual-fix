import { describe, it, expect } from 'vitest';
import WORD_SEARCH_PUZZLES, { FILLER_LETTERS } from '../wordSearchPuzzles.js';

describe('wordSearchPuzzles', () => {
  it('exports an array of puzzles', () => {
    expect(Array.isArray(WORD_SEARCH_PUZZLES)).toBe(true);
    expect(WORD_SEARCH_PUZZLES.length).toBe(20);
  });

  it('exports FILLER_LETTERS with 28 Arabic letters', () => {
    expect(FILLER_LETTERS.length).toBe(28);
  });

  WORD_SEARCH_PUZZLES.forEach((puzzle) => {
    describe(`puzzle ${puzzle.id}`, () => {
      it('has required fields', () => {
        expect(puzzle.id).toBeTruthy();
        expect(['easy', 'medium', 'hard']).toContain(puzzle.difficulty);
        expect(['A1', 'A2', 'B1', 'B2']).toContain(puzzle.cefrLevel);
        expect(puzzle.title).toBeTruthy();
        expect(puzzle.titleArabic).toBeTruthy();
      });

      it('has a 10x10 grid', () => {
        expect(puzzle.grid.length).toBe(10);
        puzzle.grid.forEach((row) => {
          expect(row.length).toBe(10);
        });
      });

      it('has at least 2 words', () => {
        expect(puzzle.words.length).toBeGreaterThanOrEqual(2);
      });

      it('has valid word positions within grid bounds', () => {
        puzzle.words.forEach((word) => {
          expect(word.startRow).toBeGreaterThanOrEqual(0);
          expect(word.startCol).toBeGreaterThanOrEqual(0);
          expect(word.startRow).toBeLessThan(10);
          expect(word.startCol).toBeLessThan(10);
          expect(word.length).toBeGreaterThan(0);
          expect(['horizontal', 'vertical', 'diagonal']).toContain(word.direction);
          expect(word.arabic).toBeTruthy();
          expect(word.english).toBeTruthy();
        });
      });

      it('words do not extend outside grid', () => {
        puzzle.words.forEach((word) => {
          const dirMap = {
            horizontal: { dr: 0, dc: 1 },
            vertical: { dr: 1, dc: 0 },
            diagonal: { dr: 1, dc: 1 },
          };
          const { dr, dc } = dirMap[word.direction];
          const endRow = word.startRow + (word.length - 1) * dr;
          const endCol = word.startCol + (word.length - 1) * dc;
          expect(endRow).toBeLessThan(10);
          expect(endCol).toBeLessThan(10);
        });
      });

      it('grid cells contain single characters', () => {
        puzzle.grid.forEach((row) => {
          row.forEach((cell) => {
            expect(typeof cell).toBe('string');
            expect(cell.length).toBe(1);
          });
        });
      });

      it('word letters match grid letters at declared positions', () => {
        puzzle.words.forEach((word) => {
          const dirMap = {
            horizontal: { dr: 0, dc: 1 },
            vertical: { dr: 1, dc: 0 },
            diagonal: { dr: 1, dc: 1 },
          };
          const { dr, dc } = dirMap[word.direction];
          const arabicLetters = word.arabic.split('');

          for (let i = 0; i < word.length; i++) {
            const r = word.startRow + i * dr;
            const c = word.startCol + i * dc;
            const gridLetter = puzzle.grid[r][c];
            const wordLetter = arabicLetters[i];
            expect(gridLetter).toBe(wordLetter);
          }
        });
      });
    });
  });
});
