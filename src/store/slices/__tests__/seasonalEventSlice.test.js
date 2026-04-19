/**
 * seasonalEventSlice.test.js — Redux slice tests for seasonal events (Phase 86)
 *
 * Tests all reducers and selectors:
 *   - checkForEvent: active event detection, date tracking, yearly history
 *   - learnSeasonalWord: word tracking, deduplication
 *   - completeSeasonalQuest: quest tracking, deduplication
 *   - recordParticipation: Ramadan day counter
 *   - resetEventProgress: progress clearing
 *   - Selectors: activeEvent, eventData, XP multiplier, vocab learned, quests completed
 */

import { describe, it, expect } from 'vitest';
import seasonalEventReducer, {
  checkForEvent,
  learnSeasonalWord,
  completeSeasonalQuest,
  recordParticipation,
  resetEventProgress,
  selectActiveEvent,
  selectActiveEventData,
  selectActiveEventXPMultiplier,
  selectSeasonalVocabLearned,
  selectSeasonalQuestsCompleted,
  selectRamadanDaysParticipated,
  selectEventProgressForId,
} from '../seasonalEventSlice.js';

// ── Helpers ─────────────────────────────────────────────────────────────────

const getInitialState = () => seasonalEventReducer(undefined, { type: '@@INIT' });

const mockState = (sliceState) => ({ seasonalEvent: sliceState });

// ── Initial State ───────────────────────────────────────────────────────────

describe('seasonalEventSlice — initial state', () => {
  it('Test 1: activeEvent is null', () => {
    const state = getInitialState();
    expect(state.activeEvent).toBeNull();
  });

  it('Test 2: lastCheckedDate is null', () => {
    const state = getInitialState();
    expect(state.lastCheckedDate).toBeNull();
  });

  it('Test 3: eventProgress has entries for all three events', () => {
    const state = getInitialState();
    expect(state.eventProgress).toHaveProperty('ramadan');
    expect(state.eventProgress).toHaveProperty('eid_fitr');
    expect(state.eventProgress).toHaveProperty('eid_adha');
  });

  it('Test 4: ramadan progress has wordsLearned, questsCompleted, daysParticipated', () => {
    const state = getInitialState();
    expect(state.eventProgress.ramadan.wordsLearned).toEqual([]);
    expect(state.eventProgress.ramadan.questsCompleted).toEqual([]);
    expect(state.eventProgress.ramadan.daysParticipated).toBe(0);
  });

  it('Test 5: yearlyHistory is empty', () => {
    const state = getInitialState();
    expect(state.yearlyHistory).toEqual({});
  });
});

// ── checkForEvent ───────────────────────────────────────────────────────────

describe('seasonalEventSlice — checkForEvent', () => {
  it('Test 6: sets activeEvent to the detected event', () => {
    const state = seasonalEventReducer(
      getInitialState(),
      checkForEvent({ detectedEvent: 'ramadan', dateISO: '2025-03-01', hijriYear: 1446 })
    );
    expect(state.activeEvent).toBe('ramadan');
  });

  it('Test 7: sets lastCheckedDate', () => {
    const state = seasonalEventReducer(
      getInitialState(),
      checkForEvent({ detectedEvent: 'ramadan', dateISO: '2025-03-01', hijriYear: 1446 })
    );
    expect(state.lastCheckedDate).toBe('2025-03-01');
  });

  it('Test 8: records yearly history when event is active', () => {
    const state = seasonalEventReducer(
      getInitialState(),
      checkForEvent({ detectedEvent: 'ramadan', dateISO: '2025-03-01', hijriYear: 1446 })
    );
    expect(state.yearlyHistory[1446]).toBeDefined();
    expect(state.yearlyHistory[1446].ramadan).toBe(true);
    expect(state.yearlyHistory[1446].eid_fitr).toBe(false);
  });

  it('Test 9: sets activeEvent to null when no event detected', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      checkForEvent({ detectedEvent: 'ramadan', dateISO: '2025-03-01', hijriYear: 1446 })
    );
    state = seasonalEventReducer(
      state,
      checkForEvent({ detectedEvent: null, dateISO: '2025-05-01' })
    );
    expect(state.activeEvent).toBeNull();
  });

  it('Test 10: preserves existing yearly history entries', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      checkForEvent({ detectedEvent: 'ramadan', dateISO: '2025-03-01', hijriYear: 1446 })
    );
    state = seasonalEventReducer(
      state,
      checkForEvent({ detectedEvent: 'eid_fitr', dateISO: '2025-04-01', hijriYear: 1446 })
    );
    expect(state.yearlyHistory[1446].ramadan).toBe(true);
    expect(state.yearlyHistory[1446].eid_fitr).toBe(true);
  });
});

// ── learnSeasonalWord ───────────────────────────────────────────────────────

describe('seasonalEventSlice — learnSeasonalWord', () => {
  it('Test 11: adds a word ID to the learned list', () => {
    const state = seasonalEventReducer(
      getInitialState(),
      learnSeasonalWord({ eventId: 'ramadan', wordId: 'ramadan_sawm' })
    );
    expect(state.eventProgress.ramadan.wordsLearned).toContain('ramadan_sawm');
  });

  it('Test 12: does not duplicate word IDs', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      learnSeasonalWord({ eventId: 'ramadan', wordId: 'ramadan_sawm' })
    );
    state = seasonalEventReducer(
      state,
      learnSeasonalWord({ eventId: 'ramadan', wordId: 'ramadan_sawm' })
    );
    const count = state.eventProgress.ramadan.wordsLearned.filter(
      (id) => id === 'ramadan_sawm'
    ).length;
    expect(count).toBe(1);
  });

  it('Test 13: can add words to different events', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      learnSeasonalWord({ eventId: 'ramadan', wordId: 'ramadan_sawm' })
    );
    state = seasonalEventReducer(
      state,
      learnSeasonalWord({ eventId: 'eid_fitr', wordId: 'eid_eid' })
    );
    expect(state.eventProgress.ramadan.wordsLearned).toContain('ramadan_sawm');
    expect(state.eventProgress.eid_fitr.wordsLearned).toContain('eid_eid');
  });

  it('Test 14: ignores unknown event IDs', () => {
    const initial = getInitialState();
    const state = seasonalEventReducer(
      initial,
      learnSeasonalWord({ eventId: 'christmas', wordId: 'some_word' })
    );
    expect(state.eventProgress).toEqual(initial.eventProgress);
  });
});

// ── completeSeasonalQuest ───────────────────────────────────────────────────

describe('seasonalEventSlice — completeSeasonalQuest', () => {
  it('Test 15: adds a quest ID to the completed list', () => {
    const state = seasonalEventReducer(
      getInitialState(),
      completeSeasonalQuest({ eventId: 'ramadan', questId: 'ramadan_quest_1' })
    );
    expect(state.eventProgress.ramadan.questsCompleted).toContain('ramadan_quest_1');
  });

  it('Test 16: does not duplicate quest IDs', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      completeSeasonalQuest({ eventId: 'ramadan', questId: 'ramadan_quest_1' })
    );
    state = seasonalEventReducer(
      state,
      completeSeasonalQuest({ eventId: 'ramadan', questId: 'ramadan_quest_1' })
    );
    const count = state.eventProgress.ramadan.questsCompleted.filter(
      (id) => id === 'ramadan_quest_1'
    ).length;
    expect(count).toBe(1);
  });

  it('Test 17: ignores unknown event IDs', () => {
    const initial = getInitialState();
    const state = seasonalEventReducer(
      initial,
      completeSeasonalQuest({ eventId: 'unknown', questId: 'some_quest' })
    );
    expect(state.eventProgress).toEqual(initial.eventProgress);
  });
});

// ── recordParticipation ─────────────────────────────────────────────────────

describe('seasonalEventSlice — recordParticipation', () => {
  it('Test 18: increments daysParticipated for Ramadan', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      recordParticipation({ eventId: 'ramadan' })
    );
    expect(state.eventProgress.ramadan.daysParticipated).toBe(1);

    state = seasonalEventReducer(state, recordParticipation({ eventId: 'ramadan' }));
    expect(state.eventProgress.ramadan.daysParticipated).toBe(2);
  });

  it('Test 19: does not affect events without daysParticipated', () => {
    const initial = getInitialState();
    const state = seasonalEventReducer(
      initial,
      recordParticipation({ eventId: 'eid_fitr' })
    );
    // eid_fitr does not have daysParticipated, so nothing should change
    expect(state.eventProgress.eid_fitr.wordsLearned).toEqual([]);
  });
});

// ── resetEventProgress ──────────────────────────────────────────────────────

describe('seasonalEventSlice — resetEventProgress', () => {
  it('Test 20: resets Ramadan progress including daysParticipated', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      learnSeasonalWord({ eventId: 'ramadan', wordId: 'ramadan_sawm' })
    );
    state = seasonalEventReducer(state, recordParticipation({ eventId: 'ramadan' }));
    state = seasonalEventReducer(state, resetEventProgress({ eventId: 'ramadan' }));

    expect(state.eventProgress.ramadan.wordsLearned).toEqual([]);
    expect(state.eventProgress.ramadan.questsCompleted).toEqual([]);
    expect(state.eventProgress.ramadan.daysParticipated).toBe(0);
  });

  it('Test 21: resets Eid progress without affecting other events', () => {
    let state = seasonalEventReducer(
      getInitialState(),
      learnSeasonalWord({ eventId: 'ramadan', wordId: 'ramadan_sawm' })
    );
    state = seasonalEventReducer(
      state,
      learnSeasonalWord({ eventId: 'eid_fitr', wordId: 'eid_eid' })
    );
    state = seasonalEventReducer(state, resetEventProgress({ eventId: 'eid_fitr' }));

    expect(state.eventProgress.eid_fitr.wordsLearned).toEqual([]);
    expect(state.eventProgress.ramadan.wordsLearned).toContain('ramadan_sawm');
  });
});

// ── Selectors ───────────────────────────────────────────────────────────────

describe('seasonalEventSlice — selectors', () => {
  it('Test 22: selectActiveEvent returns the active event ID', () => {
    const state = mockState({ ...getInitialState(), activeEvent: 'ramadan' });
    expect(selectActiveEvent(state)).toBe('ramadan');
  });

  it('Test 23: selectActiveEvent returns null when no event', () => {
    const state = mockState(getInitialState());
    expect(selectActiveEvent(state)).toBeNull();
  });

  it('Test 24: selectActiveEventData returns event object for active event', () => {
    const state = mockState({ ...getInitialState(), activeEvent: 'ramadan' });
    const data = selectActiveEventData(state);
    expect(data).not.toBeNull();
    expect(data.name).toBe('Ramadan');
  });

  it('Test 25: selectActiveEventData returns null when no active event', () => {
    const state = mockState(getInitialState());
    expect(selectActiveEventData(state)).toBeNull();
  });

  it('Test 26: selectActiveEventXPMultiplier returns 1.25 for Ramadan', () => {
    const state = mockState({ ...getInitialState(), activeEvent: 'ramadan' });
    expect(selectActiveEventXPMultiplier(state)).toBe(1.25);
  });

  it('Test 27: selectActiveEventXPMultiplier returns 1 when no active event', () => {
    const state = mockState(getInitialState());
    expect(selectActiveEventXPMultiplier(state)).toBe(1);
  });

  it('Test 28: selectSeasonalVocabLearned returns learned words for active event', () => {
    const sliceState = {
      ...getInitialState(),
      activeEvent: 'ramadan',
      eventProgress: {
        ...getInitialState().eventProgress,
        ramadan: {
          ...getInitialState().eventProgress.ramadan,
          wordsLearned: ['ramadan_sawm', 'ramadan_iftar'],
        },
      },
    };
    const state = mockState(sliceState);
    expect(selectSeasonalVocabLearned(state)).toEqual(['ramadan_sawm', 'ramadan_iftar']);
  });

  it('Test 29: selectSeasonalVocabLearned returns empty array when no active event', () => {
    const state = mockState(getInitialState());
    expect(selectSeasonalVocabLearned(state)).toEqual([]);
  });

  it('Test 30: selectSeasonalQuestsCompleted returns completed quests', () => {
    const sliceState = {
      ...getInitialState(),
      activeEvent: 'ramadan',
      eventProgress: {
        ...getInitialState().eventProgress,
        ramadan: {
          ...getInitialState().eventProgress.ramadan,
          questsCompleted: ['ramadan_quest_1'],
        },
      },
    };
    const state = mockState(sliceState);
    expect(selectSeasonalQuestsCompleted(state)).toEqual(['ramadan_quest_1']);
  });

  it('Test 31: selectRamadanDaysParticipated returns the day count', () => {
    const sliceState = {
      ...getInitialState(),
      eventProgress: {
        ...getInitialState().eventProgress,
        ramadan: {
          ...getInitialState().eventProgress.ramadan,
          daysParticipated: 15,
        },
      },
    };
    const state = mockState(sliceState);
    expect(selectRamadanDaysParticipated(state)).toBe(15);
  });

  it('Test 32: selectEventProgressForId returns progress for a specific event', () => {
    const state = mockState(getInitialState());
    const progress = selectEventProgressForId('eid_adha')(state);
    expect(progress).toHaveProperty('wordsLearned');
    expect(progress).toHaveProperty('questsCompleted');
  });

  it('Test 33: selectEventProgressForId returns null for unknown event', () => {
    const state = mockState(getInitialState());
    expect(selectEventProgressForId('unknown')(state)).toBeNull();
  });
});
