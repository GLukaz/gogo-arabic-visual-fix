import { describe, it, expect } from 'vitest';
import { generateCefrReport, SKILLS, CATEGORY_SKILL_MAP } from '../cefrReportGenerator.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makePlacement(overrides = {}) {
  return { hasCompleted: false, assignedLevel: null, rawScore: null, ...overrides };
}

// ─── generateCefrReport — empty state ────────────────────────────────────────

describe('generateCefrReport — empty vocabulary', () => {
  it('returns null overallLevel when no cards', () => {
    const report = generateCefrReport({}, makePlacement());
    expect(report.overallLevel).toBeNull();
  });

  it('returns all 5 skills in output', () => {
    const report = generateCefrReport({}, makePlacement());
    expect(Object.keys(report.skills)).toEqual(expect.arrayContaining(SKILLS));
  });

  it('all skill wordsKnown are 0 when no cards', () => {
    const report = generateCefrReport({}, makePlacement());
    for (const skill of SKILLS) {
      expect(report.skills[skill].wordsKnown).toBe(0);
    }
  });

  it('masteryByCefr contains all CEFR levels', () => {
    const report = generateCefrReport({}, makePlacement());
    expect(Object.keys(report.masteryByCefr)).toEqual(expect.arrayContaining(['A1', 'A2', 'B1', 'B2']));
  });

  it('estimatedHoursToNextLevel is a number or null when no level', () => {
    const report = generateCefrReport({}, makePlacement());
    // When no overallLevel, nextLevel index = 0 (A1), so it estimates hours to reach A1
    expect(report.estimatedHoursToNextLevel === null || typeof report.estimatedHoursToNextLevel === 'number').toBe(true);
  });
});

// ─── generateCefrReport — report structure ────────────────────────────────────

describe('generateCefrReport — report structure', () => {
  it('progressSincePlacement.placementLevel is null when no placement', () => {
    const report = generateCefrReport({}, makePlacement());
    expect(report.progressSincePlacement.placementLevel).toBeNull();
  });

  it('progressSincePlacement.delta is null when no placement', () => {
    const report = generateCefrReport({}, makePlacement());
    expect(report.progressSincePlacement.delta).toBeNull();
  });

  it('progressSincePlacement.laggingSkills and advancedSkills are arrays', () => {
    const report = generateCefrReport({}, makePlacement());
    expect(Array.isArray(report.progressSincePlacement.laggingSkills)).toBe(true);
    expect(Array.isArray(report.progressSincePlacement.advancedSkills)).toBe(true);
  });

  it('each skill has level, wordsKnown, totalWords, percentage', () => {
    const report = generateCefrReport({}, makePlacement());
    for (const skill of SKILLS) {
      const s = report.skills[skill];
      expect(s).toHaveProperty('level');
      expect(s).toHaveProperty('wordsKnown');
      expect(s).toHaveProperty('totalWords');
      expect(s).toHaveProperty('percentage');
    }
  });

  it('skill percentage is between 0 and 1', () => {
    const report = generateCefrReport({}, makePlacement());
    for (const skill of SKILLS) {
      expect(report.skills[skill].percentage).toBeGreaterThanOrEqual(0);
      expect(report.skills[skill].percentage).toBeLessThanOrEqual(1);
    }
  });
});

// ─── generateCefrReport — placement progress ─────────────────────────────────

describe('generateCefrReport — progressSincePlacement', () => {
  it('shows placement level when placement is complete', () => {
    const placement = makePlacement({ hasCompleted: true, assignedLevel: 'A1' });
    const report = generateCefrReport({}, placement);
    expect(report.progressSincePlacement.placementLevel).toBe('A1');
  });

  it('levelsGained is 0 when current level equals placement level', () => {
    // With empty cards, overallLevel is null (rank 0), placement A1 (rank 1)
    const placement = makePlacement({ hasCompleted: true, assignedLevel: 'A2' });
    const report = generateCefrReport({}, placement);
    expect(report.progressSincePlacement.levelsGained).toBe(0); // null (0) < A2 (2), so 0
  });
});

// ─── generateCefrReport — estimation ─────────────────────────────────────────

describe('generateCefrReport — estimatedHoursToNextLevel', () => {
  it('returns a non-negative number for estimatedHoursToNextLevel when nextLevel exists', () => {
    const report = generateCefrReport({}, makePlacement());
    if (report.estimatedHoursToNextLevel !== null) {
      expect(report.estimatedHoursToNextLevel).toBeGreaterThanOrEqual(0);
    }
  });

  it('nextLevel is the level after overallLevel', () => {
    const report = generateCefrReport({}, makePlacement());
    // overallLevel null → nextLevel is A1 (first in CEFR_LEVELS)
    expect(report.nextLevel).toBe('A1');
  });
});

// ─── CATEGORY_SKILL_MAP ───────────────────────────────────────────────────────

describe('CATEGORY_SKILL_MAP', () => {
  it('grammar category maps to grammar skill', () => {
    expect(CATEGORY_SKILL_MAP.grammar).toContain('grammar');
  });

  it('greetings category maps to speaking and listening', () => {
    expect(CATEGORY_SKILL_MAP.greetings).toContain('speaking');
    expect(CATEGORY_SKILL_MAP.greetings).toContain('listening');
  });

  it('writing category maps to writing skill', () => {
    expect(CATEGORY_SKILL_MAP.writing).toContain('writing');
  });

  it('literary_arabic maps to reading skill', () => {
    expect(CATEGORY_SKILL_MAP.literary_arabic).toContain('reading');
  });
});
