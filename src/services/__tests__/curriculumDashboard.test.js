import { describe, it, expect } from 'vitest';
import {
  getCurriculumDashboard,
  selectCurriculumDashboard,
  estimateTimeToNextCefr,
  getWeakAreas,
  suggestNextActivity,
} from '../curriculumDashboard.js';
import { getZoneIntroWords } from '../../data/zoneVocabIntros.js';

// ─── state builders ──────────────────────────────────────────────────────────

function makeEmptyState(overrides = {}) {
  return {
    foundation:       { stage: 'alphabet', bypassedViaPlacement: false },
    alphabetProgress: { letterMastery: {} },
    coreVocabulary:   { wordMastery: {} },
    rootKnowledge:    { knownRoots: [], wordScores: {} },
    zoneVocabIntro:   { reviewedByZone: {} },
    zoneGrammar:      { learnedPoints: {} },
    vocabulary:       { fsrsCards: {} },
    cefrProgress:     { currentLevel: null, levelHistory: [] },
    ...overrides,
  };
}

// ─── getCurriculumDashboard ───────────────────────────────────────────────────

describe('getCurriculumDashboard', () => {
  it('returns a complete dashboard object with all required keys', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    expect(dashboard).toHaveProperty('foundationPhase');
    expect(dashboard).toHaveProperty('zonesIntroduced');
    expect(dashboard).toHaveProperty('vocabTiers');
    expect(dashboard).toHaveProperty('grammarCoverage');
    expect(dashboard).toHaveProperty('rootKnowledge');
    expect(dashboard).toHaveProperty('cefrEstimate');
  });

  it('foundationPhase has stage, stageProgress, overallProgress', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    const { foundationPhase } = dashboard;
    expect(foundationPhase).toHaveProperty('stage');
    expect(foundationPhase).toHaveProperty('stageProgress');
    expect(foundationPhase).toHaveProperty('overallProgress');
    expect(foundationPhase.stage).toBe('alphabet');
    expect(foundationPhase.overallProgress).toBe(0);
  });

  it('foundationPhase.overallProgress is 100 when stage is complete', () => {
    const state = makeEmptyState({ foundation: { stage: 'complete', bypassedViaPlacement: false } });
    const { foundationPhase } = getCurriculumDashboard(state);
    expect(foundationPhase.overallProgress).toBe(100);
  });

  it('zonesIntroduced reflects reviewed words per zone', () => {
    const firstZoneId = 'oasis_village';
    const words = getZoneIntroWords(firstZoneId);
    const reviewed = { [words[0].id]: true };
    const state = makeEmptyState({
      zoneVocabIntro: { reviewedByZone: { [firstZoneId]: reviewed } },
    });
    const { zonesIntroduced } = getCurriculumDashboard(state);
    expect(zonesIntroduced.byZone[firstZoneId].reviewed).toBe(1);
    expect(zonesIntroduced.byZone[firstZoneId].total).toBeGreaterThan(0);
  });

  it('vocabTiers has tier1, tier2, tier3, tier4 numeric fields', () => {
    const state = makeEmptyState();
    const { vocabTiers } = getCurriculumDashboard(state);
    expect(typeof vocabTiers.tier1).toBe('number');
    expect(typeof vocabTiers.tier2).toBe('number');
    expect(typeof vocabTiers.tier3).toBe('number');
    expect(typeof vocabTiers.tier4).toBe('number');
    // Empty FSRS cards → all tiers are 0
    expect(vocabTiers.tier1).toBe(0);
    expect(vocabTiers.tier2).toBe(0);
    expect(vocabTiers.tier3).toBe(0);
    expect(vocabTiers.tier4).toBe(0);
  });

  it('grammarCoverage has learned, total, byZone', () => {
    const { grammarCoverage } = getCurriculumDashboard(makeEmptyState());
    expect(grammarCoverage).toHaveProperty('learned');
    expect(grammarCoverage).toHaveProperty('total');
    expect(grammarCoverage).toHaveProperty('byZone');
    expect(grammarCoverage.total).toBeGreaterThan(0);
    expect(grammarCoverage.learned).toBe(0);
  });

  it('grammarCoverage.learned increments when grammar points are learned', () => {
    const state = makeEmptyState({
      zoneGrammar: { learnedPoints: { gp_ov_001: true, gp_ov_002: true } },
    });
    const { grammarCoverage } = getCurriculumDashboard(state);
    expect(grammarCoverage.learned).toBe(2);
  });

  it('rootKnowledge has known, total, masteredCount, averageMastery, derivedWordsUnlocked', () => {
    const { rootKnowledge } = getCurriculumDashboard(makeEmptyState());
    expect(rootKnowledge).toHaveProperty('known');
    expect(rootKnowledge).toHaveProperty('total');
    expect(rootKnowledge).toHaveProperty('masteredCount');
    expect(rootKnowledge).toHaveProperty('averageMastery');
    expect(rootKnowledge).toHaveProperty('derivedWordsUnlocked');
    expect(rootKnowledge.total).toBe(30); // 30 roots in ROOT_TEACHING_SET
  });

  it('rootKnowledge.derivedWordsUnlocked grows when roots are learned', () => {
    const state = makeEmptyState({
      rootKnowledge: { knownRoots: ['root_ktb'], wordScores: {} },
    });
    const { rootKnowledge } = getCurriculumDashboard(state);
    expect(rootKnowledge.known).toBe(1);
    expect(rootKnowledge.derivedWordsUnlocked).toBeGreaterThan(0);
  });

  it('cefrEstimate has overall and perSkill object', () => {
    const state = makeEmptyState({ cefrProgress: { currentLevel: 'A1', levelHistory: [] } });
    const { cefrEstimate } = getCurriculumDashboard(state);
    expect(cefrEstimate.overall).toBe('A1');
    expect(cefrEstimate).toHaveProperty('perSkill');
    expect(cefrEstimate.perSkill).toHaveProperty('vocabulary');
    expect(cefrEstimate.perSkill).toHaveProperty('grammar');
    expect(cefrEstimate.perSkill).toHaveProperty('alphabet');
    expect(cefrEstimate.perSkill).toHaveProperty('reading');
  });

  it('cefrEstimate.overall is null when no level set', () => {
    const { cefrEstimate } = getCurriculumDashboard(makeEmptyState());
    expect(cefrEstimate.overall).toBeNull();
  });
});

// ─── selectCurriculumDashboard (memoized selector) ───────────────────────────

describe('selectCurriculumDashboard', () => {
  it('returns same shape as getCurriculumDashboard', () => {
    const state = makeEmptyState();
    const result = selectCurriculumDashboard(state);
    expect(result).toHaveProperty('foundationPhase');
    expect(result).toHaveProperty('zonesIntroduced');
    expect(result).toHaveProperty('vocabTiers');
    expect(result).toHaveProperty('grammarCoverage');
    expect(result).toHaveProperty('rootKnowledge');
    expect(result).toHaveProperty('cefrEstimate');
  });

  it('returns memoized result on equal state', () => {
    const state = makeEmptyState();
    const r1 = selectCurriculumDashboard(state);
    const r2 = selectCurriculumDashboard(state);
    expect(r1).toBe(r2); // exact same reference
  });

  it('recomputes when relevant state changes', () => {
    const state1 = makeEmptyState();
    const state2 = {
      ...state1,
      foundation: { stage: 'complete', bypassedViaPlacement: true },
    };
    const r1 = selectCurriculumDashboard(state1);
    const r2 = selectCurriculumDashboard(state2);
    expect(r1).not.toBe(r2);
    expect(r2.foundationPhase.stage).toBe('complete');
  });
});

// ─── estimateTimeToNextCefr ───────────────────────────────────────────────────

describe('estimateTimeToNextCefr', () => {
  it('returns a positive number for null level (pre-A1)', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    const hours = estimateTimeToNextCefr(dashboard);
    expect(typeof hours).toBe('number');
    expect(hours).toBeGreaterThan(0);
  });

  it('returns 0 for B2 level (highest tracked)', () => {
    const state = makeEmptyState({ cefrProgress: { currentLevel: 'B2', levelHistory: [] } });
    const dashboard = getCurriculumDashboard(state);
    const hours = estimateTimeToNextCefr(dashboard);
    expect(hours).toBe(0);
  });

  it('returns fewer hours when more progress has been made at same CEFR level', () => {
    // Both states at A1 — but one has foundation incomplete, the other complete + grammar
    const lowProgress = makeEmptyState({
      cefrProgress: { currentLevel: 'A1', levelHistory: [] },
      foundation:   { stage: 'alphabet', bypassedViaPlacement: false },
    });
    const highProgress = makeEmptyState({
      cefrProgress: { currentLevel: 'A1', levelHistory: [] },
      foundation:   { stage: 'complete', bypassedViaPlacement: false },
      zoneGrammar: {
        learnedPoints: Object.fromEntries(
          ['gp_ov_001','gp_ov_002','gp_dm_001','gp_dm_002','gp_dm_003',
           'gp_al_001','gp_al_002','gp_al_003','gp_f_001','gp_f_002'].map((id) => [id, true]),
        ),
      },
    });
    const lowHours  = estimateTimeToNextCefr(getCurriculumDashboard(lowProgress));
    const highHours = estimateTimeToNextCefr(getCurriculumDashboard(highProgress));
    expect(lowHours).toBeGreaterThanOrEqual(highHours);
  });

  it('handles null/undefined dashboard gracefully', () => {
    expect(() => estimateTimeToNextCefr(null)).not.toThrow();
    expect(() => estimateTimeToNextCefr(undefined)).not.toThrow();
    expect(estimateTimeToNextCefr(null)).toBeGreaterThan(0);
  });
});

// ─── getWeakAreas ─────────────────────────────────────────────────────────────

describe('getWeakAreas', () => {
  it('returns an array of area names', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    const areas = getWeakAreas(dashboard);
    expect(Array.isArray(areas)).toBe(true);
    expect(areas.length).toBeGreaterThan(0);
  });

  it('area names are from the known set', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    const areas = getWeakAreas(dashboard);
    const validNames = new Set(['foundation', 'zoneVocabulary', 'grammar', 'roots', 'vocabulary']);
    for (const name of areas) {
      expect(validNames.has(name)).toBe(true);
    }
  });

  it('returns areas ordered lowest progress first', () => {
    // Complete foundation but leave grammar and roots at zero
    const state = makeEmptyState({
      foundation: { stage: 'complete', bypassedViaPlacement: false },
    });
    const dashboard = getCurriculumDashboard(state);
    const areas = getWeakAreas(dashboard);
    // Foundation is 100%, so it should be the LAST area (highest progress)
    expect(areas[areas.length - 1]).toBe('foundation');
    // And it should NOT be first (there are 0% areas ahead of it)
    expect(areas[0]).not.toBe('foundation');
  });

  it('handles empty/null dashboard', () => {
    expect(() => getWeakAreas(null)).not.toThrow();
    expect(() => getWeakAreas({})).not.toThrow();
  });
});

// ─── suggestNextActivity ──────────────────────────────────────────────────────

describe('suggestNextActivity', () => {
  it('returns an object with action and reason', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    const suggestion = suggestNextActivity(dashboard);
    expect(suggestion).toHaveProperty('action');
    expect(suggestion).toHaveProperty('reason');
    expect(typeof suggestion.action).toBe('string');
    expect(typeof suggestion.reason).toBe('string');
  });

  it('suggests alphabet practice when foundation stage is alphabet', () => {
    const dashboard = getCurriculumDashboard(makeEmptyState());
    const suggestion = suggestNextActivity(dashboard);
    expect(suggestion.action.toLowerCase()).toMatch(/letter|alphabet/i);
  });

  it('suggests core vocab when foundation stage is coreVocab', () => {
    const state = makeEmptyState({ foundation: { stage: 'coreVocab' } });
    const dashboard = getCurriculumDashboard(state);
    const suggestion = suggestNextActivity(dashboard);
    expect(suggestion.action.toLowerCase()).toMatch(/vocab/i);
  });

  it('suggests root study when foundation stage is rootIntro', () => {
    const state = makeEmptyState({ foundation: { stage: 'rootIntro' } });
    const dashboard = getCurriculumDashboard(state);
    const suggestion = suggestNextActivity(dashboard);
    expect(suggestion.action.toLowerCase()).toMatch(/root/i);
  });

  it('suggests zone vocabulary when foundation complete but zones untouched', () => {
    const state = makeEmptyState({ foundation: { stage: 'complete' } });
    const dashboard = getCurriculumDashboard(state);
    const suggestion = suggestNextActivity(dashboard);
    expect(suggestion.action.toLowerCase()).toMatch(/zone|vocab/i);
  });

  it('handles empty dashboard gracefully', () => {
    expect(() => suggestNextActivity(null)).not.toThrow();
    expect(() => suggestNextActivity({})).not.toThrow();
    const suggestion = suggestNextActivity({});
    expect(suggestion).toHaveProperty('action');
    expect(suggestion).toHaveProperty('reason');
  });
});
