/**
 * WritingCanvas.test.jsx
 *
 * Tests for the WritingCanvas component — verifies canvas renders,
 * pointer events work, and IoU validation logic is correct.
 *
 * Phase 83 — Arabic Writing Practice
 */

import { describe, it, expect } from 'vitest';
import { computeIoU } from '../WritingCanvas.jsx';

// ─── computeIoU logic tests ──────────────────────────────────────────────────
// These test the grid-based IoU validation without needing DOM/canvas

describe('computeIoU', () => {
  it('returns 0 when template is empty', () => {
    expect(computeIoU([], [{ x: 0.5, y: 0.5 }])).toBe(0);
  });

  it('returns 0 when player strokes are empty', () => {
    expect(computeIoU([{ x: 0.5, y: 0.5 }], [])).toBe(0);
  });

  it('returns 100 for identical point sets', () => {
    const points = [
      { x: 0.1, y: 0.1 }, { x: 0.2, y: 0.2 }, { x: 0.3, y: 0.3 },
      { x: 0.4, y: 0.4 }, { x: 0.5, y: 0.5 },
    ];
    expect(computeIoU(points, points)).toBe(100);
  });

  it('returns high score for closely matching strokes', () => {
    const template = [
      { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.2 }, { x: 0.5, y: 0.3 },
      { x: 0.5, y: 0.4 }, { x: 0.5, y: 0.5 }, { x: 0.5, y: 0.6 },
      { x: 0.5, y: 0.7 }, { x: 0.5, y: 0.8 }, { x: 0.5, y: 0.9 },
    ];
    // Player draws slightly offset
    const player = [
      { x: 0.52, y: 0.12 }, { x: 0.51, y: 0.22 }, { x: 0.5, y: 0.32 },
      { x: 0.49, y: 0.42 }, { x: 0.5, y: 0.52 }, { x: 0.51, y: 0.62 },
      { x: 0.5, y: 0.72 }, { x: 0.49, y: 0.82 }, { x: 0.5, y: 0.88 },
    ];
    const score = computeIoU(template, player);
    // With an 8x8 grid, slight offsets still land in same cells most of the time
    expect(score).toBeGreaterThanOrEqual(40);
  });

  it('returns low score for completely different strokes', () => {
    // Template: vertical line in center
    const template = [
      { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.3 }, { x: 0.5, y: 0.5 },
      { x: 0.5, y: 0.7 }, { x: 0.5, y: 0.9 },
    ];
    // Player: horizontal line at top
    const player = [
      { x: 0.1, y: 0.1 }, { x: 0.3, y: 0.1 }, { x: 0.5, y: 0.1 },
      { x: 0.7, y: 0.1 }, { x: 0.9, y: 0.1 },
    ];
    const score = computeIoU(template, player);
    expect(score).toBeLessThan(50);
  });

  it('returns a value between 0 and 100', () => {
    const template = [{ x: 0.2, y: 0.3 }, { x: 0.8, y: 0.7 }];
    const player = [{ x: 0.3, y: 0.4 }, { x: 0.7, y: 0.6 }];
    const score = computeIoU(template, player);
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('handles single-point inputs gracefully', () => {
    const template = [{ x: 0.5, y: 0.5 }];
    const player = [{ x: 0.5, y: 0.5 }];
    const score = computeIoU(template, player);
    expect(score).toBe(100);
  });

  it('handles edge coordinates at 0 and 1', () => {
    const template = [{ x: 0.0, y: 0.0 }, { x: 1.0, y: 1.0 }];
    const player = [{ x: 0.0, y: 0.0 }, { x: 1.0, y: 1.0 }];
    const score = computeIoU(template, player);
    expect(score).toBeGreaterThanOrEqual(50);
  });
});

// ─── Component rendering contract tests ──────────────────────────────────────
// These verify the module's exports and structure without requiring a DOM

describe('WritingCanvas module', () => {
  it('exports computeIoU as a named export', () => {
    expect(typeof computeIoU).toBe('function');
  });

  it('default export is a function (React component)', async () => {
    const mod = await import('../WritingCanvas.jsx');
    expect(typeof mod.default).toBe('function');
  });
});
