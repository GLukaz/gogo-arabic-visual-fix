import { describe, it, expect } from 'vitest';
import achievementReducer, {
  recordQuizTypeResult,
} from '../achievementSlice.js';

/**
 * achievementSlice unit tests
 *
 * Tests quizTypeStats tracking and recordQuizTypeResult reducer
 * for quiz_type_streak achievement support (Phase 63-02).
 */

describe('achievementSlice — quizTypeStats', () => {
  const baseState = achievementReducer(undefined, { type: '@@INIT' });

  it('Test 1: Initial state has quizTypeStats: {} in stats', () => {
    expect(baseState.stats.quizTypeStats).toEqual({});
  });

  it('Test 2: recordQuizTypeResult({quizType:"ar-to-en", perfect:true}) increments perfectStreak to 1', () => {
    const state = achievementReducer(baseState, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    expect(state.stats.quizTypeStats['ar-to-en'].perfectStreak).toBe(1);
  });

  it('Test 3: two perfect results in a row sets perfectStreak to 2', () => {
    let state = achievementReducer(baseState, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    state = achievementReducer(state, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    expect(state.stats.quizTypeStats['ar-to-en'].perfectStreak).toBe(2);
  });

  it('Test 4: recordQuizTypeResult with perfect:false resets perfectStreak to 0', () => {
    let state = achievementReducer(baseState, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    state = achievementReducer(state, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    state = achievementReducer(state, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: false }));
    expect(state.stats.quizTypeStats['ar-to-en'].perfectStreak).toBe(0);
  });

  it('Test 5: recordQuizTypeResult with perfect:true also increments totalPerfect', () => {
    let state = achievementReducer(baseState, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    state = achievementReducer(state, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    expect(state.stats.quizTypeStats['ar-to-en'].totalPerfect).toBe(2);
  });

  it('Test 6: different quizTypes track independently', () => {
    let state = achievementReducer(baseState, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    state = achievementReducer(state, recordQuizTypeResult({ quizType: 'ar-to-en', perfect: true }));
    state = achievementReducer(state, recordQuizTypeResult({ quizType: 'en-to-ar', perfect: true }));
    expect(state.stats.quizTypeStats['ar-to-en'].perfectStreak).toBe(2);
    expect(state.stats.quizTypeStats['en-to-ar'].perfectStreak).toBe(1);
  });

  it('perfect:false on a type that has not been seen yet initialises with streak 0', () => {
    const state = achievementReducer(baseState, recordQuizTypeResult({ quizType: 'new-type', perfect: false }));
    expect(state.stats.quizTypeStats['new-type'].perfectStreak).toBe(0);
    expect(state.stats.quizTypeStats['new-type'].totalPerfect).toBe(0);
  });
});
