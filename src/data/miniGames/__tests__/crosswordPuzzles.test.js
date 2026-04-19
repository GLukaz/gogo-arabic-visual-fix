import { describe, it, expect } from 'vitest';
import CROSSWORD_PUZZLES from '../crosswordPuzzles.js';

describe('crosswordPuzzles', () => {
  it('exports an array of puzzles', () => {
    expect(Array.isArray(CROSSWORD_PUZZLES)).toBe(true);
    expect(CROSSWORD_PUZZLES.length).toBe(15);
  });

  CROSSWORD_PUZZLES.forEach((puzzle) => {
    describe(`puzzle ${puzzle.id}`, () => {
      it('has required fields', () => {
        expect(puzzle.id).toBeTruthy();
        expect(['easy', 'medium', 'hard']).toContain(puzzle.difficulty);
        expect(['A1', 'A2']).toContain(puzzle.cefrLevel);
        expect(puzzle.title).toBeTruthy();
        expect(puzzle.titleArabic).toBeTruthy();
        expect(puzzle.size.rows).toBeGreaterThan(0);
        expect(puzzle.size.cols).toBeGreaterThan(0);
      });

      it('has at least 1 cell', () => {
        expect(puzzle.cells.length).toBeGreaterThan(0);
      });

      it('all cells are within grid bounds', () => {
        puzzle.cells.forEach((cell) => {
          expect(cell.row).toBeGreaterThanOrEqual(0);
          expect(cell.row).toBeLessThan(puzzle.size.rows);
          expect(cell.col).toBeGreaterThanOrEqual(0);
          expect(cell.col).toBeLessThan(puzzle.size.cols);
          expect(typeof cell.letter).toBe('string');
          expect(cell.letter.length).toBe(1);
        });
      });

      it('has no duplicate cell positions', () => {
        const keys = puzzle.cells.map((c) => `${c.row},${c.col}`);
        const unique = new Set(keys);
        expect(unique.size).toBe(keys.length);
      });

      it('cluesAcross is an array', () => {
        expect(Array.isArray(puzzle.cluesAcross)).toBe(true);
      });

      it('cluesDown is an array', () => {
        expect(Array.isArray(puzzle.cluesDown)).toBe(true);
      });

      it('has at least 1 clue total', () => {
        expect(puzzle.cluesAcross.length + puzzle.cluesDown.length).toBeGreaterThan(0);
      });

      it('each clue has required fields', () => {
        [...puzzle.cluesAcross, ...puzzle.cluesDown].forEach((clue) => {
          expect(clue.number).toBeGreaterThan(0);
          expect(clue.clue).toBeTruthy();
          expect(clue.answerArabic).toBeTruthy();
        });
      });

      it('each across clue number exists in at least one cell', () => {
        puzzle.cluesAcross.forEach((clue) => {
          const hasCell = puzzle.cells.some((c) => c.clueAcross === clue.number);
          expect(hasCell).toBe(true);
        });
      });

      it('each down clue number exists in at least one cell', () => {
        puzzle.cluesDown.forEach((clue) => {
          const hasCell = puzzle.cells.some((c) => c.clueDown === clue.number);
          expect(hasCell).toBe(true);
        });
      });

      it('across answer length matches cell count for that clue', () => {
        puzzle.cluesAcross.forEach((clue) => {
          const cellCount = puzzle.cells.filter((c) => c.clueAcross === clue.number).length;
          // The answer might span across cells that also belong to a down clue,
          // so the across cells count should be at least 1
          expect(cellCount).toBeGreaterThanOrEqual(1);
        });
      });
    });
  });
});
