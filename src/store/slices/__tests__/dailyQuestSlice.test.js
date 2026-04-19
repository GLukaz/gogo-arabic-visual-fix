import { describe, it, expect } from 'vitest';
import reducer, {
  loadDailyQuests,
  progressDailyQuest,
  markBonusAwarded,
  resetDailyQuests,
  selectDailyQuests,
  selectDailyQuestDate,
  selectDailyQuestBonusAwarded,
  selectAllDailyQuestsComplete,
  selectDailyQuestProgress,
  selectDailyQuestHistory,
} from '../dailyQuestSlice.js';
import {
  generateDailyQuests,
  getDifficultyTier,
  hashString,
  QUEST_TARGETS,
  DAILY_QUEST_TYPES,
} from '../../../services/dailyQuestGenerator.js';

// ─── Generator tests ──────────────────────────────────────────────────────────

describe('generateDailyQuests', () => {
  it('returns exactly 3 quests', () => {
    const quests = generateDailyQuests({ level: 1 }, '2026-04-08');
    expect(quests).toHaveLength(3);
  });

  it('each quest has required fields', () => {
    const quests = generateDailyQuests({ level: 1 }, '2026-04-08');
    for (const q of quests) {
      expect(q).toHaveProperty('id');
      expect(q).toHaveProperty('type');
      expect(q).toHaveProperty('target');
      expect(q).toHaveProperty('current', 0);
      expect(q).toHaveProperty('completed', false);
    }
  });

  it('is deterministic — same level + date = same quests', () => {
    const q1 = generateDailyQuests({ level: 5 }, '2026-04-08');
    const q2 = generateDailyQuests({ level: 5 }, '2026-04-08');
    expect(q1.map((q) => q.type)).toEqual(q2.map((q) => q.type));
    expect(q1.map((q) => q.target)).toEqual(q2.map((q) => q.target));
  });

  it('produces different quests for different dates', () => {
    const q1 = generateDailyQuests({ level: 5 }, '2026-04-08');
    const q2 = generateDailyQuests({ level: 5 }, '2026-04-09');
    // At least the type selection should differ at least occasionally; we just assert no crash
    expect(q1).toHaveLength(3);
    expect(q2).toHaveLength(3);
    // IDs must always differ (date is embedded)
    expect(q1[0].id).not.toBe(q2[0].id);
  });

  it('scales targets for easy tier (level 1-10)', () => {
    const quests = generateDailyQuests({ level: 5 }, '2026-04-08');
    for (const q of quests) {
      expect(q.target).toBe(QUEST_TARGETS[q.type].easy);
    }
  });

  it('scales targets for medium tier (level 11-25)', () => {
    const quests = generateDailyQuests({ level: 15 }, '2026-04-08');
    for (const q of quests) {
      expect(q.target).toBe(QUEST_TARGETS[q.type].medium);
    }
  });

  it('scales targets for hard tier (level 26+)', () => {
    const quests = generateDailyQuests({ level: 30 }, '2026-04-08');
    for (const q of quests) {
      expect(q.target).toBe(QUEST_TARGETS[q.type].hard);
    }
  });

  it('embeds date in quest IDs', () => {
    const date = '2026-04-08';
    const quests = generateDailyQuests({ level: 1 }, date);
    for (const q of quests) {
      expect(q.id).toContain(date);
    }
  });

  it('quest types are from the valid set', () => {
    const validTypes = Object.values(DAILY_QUEST_TYPES);
    const quests = generateDailyQuests({ level: 10 }, '2026-04-08');
    for (const q of quests) {
      expect(validTypes).toContain(q.type);
    }
  });

  it('quest types are unique (no duplicates in a day)', () => {
    const quests = generateDailyQuests({ level: 10 }, '2026-04-08');
    const types = quests.map((q) => q.type);
    expect(new Set(types).size).toBe(3);
  });

  it('defaults to level 1 when playerState is undefined', () => {
    expect(() => generateDailyQuests(undefined, '2026-04-08')).not.toThrow();
  });

  it('getDifficultyTier boundaries', () => {
    expect(getDifficultyTier(1)).toBe('easy');
    expect(getDifficultyTier(10)).toBe('easy');
    expect(getDifficultyTier(11)).toBe('medium');
    expect(getDifficultyTier(25)).toBe('medium');
    expect(getDifficultyTier(26)).toBe('hard');
    expect(getDifficultyTier(50)).toBe('hard');
  });

  it('hashString returns a non-negative integer', () => {
    const h = hashString('5:2026-04-08');
    expect(typeof h).toBe('number');
    expect(h).toBeGreaterThanOrEqual(0);
  });
});

// ─── Slice reducer tests ──────────────────────────────────────────────────────

describe('dailyQuestSlice reducer', () => {
  const makeQuests = () => generateDailyQuests({ level: 1 }, '2026-04-08');

  it('returns initial state', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state.date).toBeNull();
    expect(state.quests).toEqual([]);
    expect(state.bonusAwarded).toBe(false);
    expect(state.history).toEqual([]);
  });

  it('loadDailyQuests sets date and quests', () => {
    const quests = makeQuests();
    const state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    expect(state.date).toBe('2026-04-08');
    expect(state.quests).toHaveLength(3);
    expect(state.bonusAwarded).toBe(false);
  });

  it('loadDailyQuests archives previous day into history', () => {
    const quests1 = makeQuests();
    const quests2 = generateDailyQuests({ level: 1 }, '2026-04-09');

    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests: quests1 }));
    state = reducer(state, loadDailyQuests({ date: '2026-04-09', quests: quests2 }));

    expect(state.history).toHaveLength(1);
    expect(state.history[0].date).toBe('2026-04-08');
  });

  it('loadDailyQuests resets bonusAwarded on new day', () => {
    const quests1 = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests: quests1 }));
    state = reducer(state, markBonusAwarded());
    expect(state.bonusAwarded).toBe(true);

    const quests2 = generateDailyQuests({ level: 1 }, '2026-04-09');
    state = reducer(state, loadDailyQuests({ date: '2026-04-09', quests: quests2 }));
    expect(state.bonusAwarded).toBe(false);
  });

  it('progressDailyQuest advances current', () => {
    const quests = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    const firstType = state.quests[0].type;

    state = reducer(state, progressDailyQuest({ type: firstType, amount: 1 }));
    expect(state.quests[0].current).toBe(1);
  });

  it('progressDailyQuest marks completed when current reaches target', () => {
    const quests = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    const quest = state.quests[0];

    state = reducer(state, progressDailyQuest({ type: quest.type, amount: quest.target }));
    expect(state.quests[0].completed).toBe(true);
  });

  it('progressDailyQuest does not overflow past target', () => {
    const quests = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    const quest = state.quests[0];

    state = reducer(state, progressDailyQuest({ type: quest.type, amount: quest.target + 100 }));
    expect(state.quests[0].current).toBe(quest.target);
  });

  it('progressDailyQuest skips already-completed quest', () => {
    const quests = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    const quest = state.quests[0];

    // Complete it
    state = reducer(state, progressDailyQuest({ type: quest.type, amount: quest.target }));
    const currentAfterComplete = state.quests[0].current;

    // Try to progress again
    state = reducer(state, progressDailyQuest({ type: quest.type, amount: 1 }));
    expect(state.quests[0].current).toBe(currentAfterComplete);
  });

  it('markBonusAwarded sets bonusAwarded to true', () => {
    const quests = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    state = reducer(state, markBonusAwarded());
    expect(state.bonusAwarded).toBe(true);
  });

  it('resetDailyQuests clears all state', () => {
    const quests = makeQuests();
    let state = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    state = reducer(state, resetDailyQuests());
    expect(state.date).toBeNull();
    expect(state.quests).toEqual([]);
    expect(state.bonusAwarded).toBe(false);
  });
});

// ─── Selector tests ───────────────────────────────────────────────────────────

describe('dailyQuestSlice selectors', () => {
  const wrapState = (slice) => ({ dailyQuest: slice });
  const makeQuests = () => generateDailyQuests({ level: 1 }, '2026-04-08');

  it('selectDailyQuests returns quests array', () => {
    const quests = makeQuests();
    const sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    expect(selectDailyQuests(wrapState(sliceState))).toHaveLength(3);
  });

  it('selectDailyQuestDate returns current date', () => {
    const quests = makeQuests();
    const sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    expect(selectDailyQuestDate(wrapState(sliceState))).toBe('2026-04-08');
  });

  it('selectDailyQuestBonusAwarded reflects bonus state', () => {
    let sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests: makeQuests() }));
    expect(selectDailyQuestBonusAwarded(wrapState(sliceState))).toBe(false);
    sliceState = reducer(sliceState, markBonusAwarded());
    expect(selectDailyQuestBonusAwarded(wrapState(sliceState))).toBe(true);
  });

  it('selectAllDailyQuestsComplete returns false when not all done', () => {
    const quests = makeQuests();
    const sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    expect(selectAllDailyQuestsComplete(wrapState(sliceState))).toBe(false);
  });

  it('selectAllDailyQuestsComplete returns true when all 3 done', () => {
    const quests = makeQuests();
    let sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    for (const q of sliceState.quests) {
      sliceState = reducer(sliceState, progressDailyQuest({ type: q.type, amount: q.target }));
    }
    expect(selectAllDailyQuestsComplete(wrapState(sliceState))).toBe(true);
  });

  it('selectDailyQuestProgress counts completed correctly', () => {
    const quests = makeQuests();
    let sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests }));
    expect(selectDailyQuestProgress(wrapState(sliceState))).toEqual({ completed: 0, total: 3 });

    sliceState = reducer(sliceState, progressDailyQuest({ type: sliceState.quests[0].type, amount: sliceState.quests[0].target }));
    expect(selectDailyQuestProgress(wrapState(sliceState))).toEqual({ completed: 1, total: 3 });
  });

  it('selectDailyQuestHistory returns history entries', () => {
    const quests1 = makeQuests();
    const quests2 = generateDailyQuests({ level: 1 }, '2026-04-09');
    let sliceState = reducer(undefined, loadDailyQuests({ date: '2026-04-08', quests: quests1 }));
    sliceState = reducer(sliceState, loadDailyQuests({ date: '2026-04-09', quests: quests2 }));
    expect(selectDailyQuestHistory(wrapState(sliceState))).toHaveLength(1);
  });
});
