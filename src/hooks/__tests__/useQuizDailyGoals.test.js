import { describe, it, expect, vi } from 'vitest';
import { recordQuizCompletion } from '../../store/middleware/dailyGoalsMiddleware.js';
import { DAILY_GOAL_TYPES } from '../../data/dailyGoals.js';

describe('WIRE-01: Quiz completion → daily goals', () => {
  it('dispatches updateDailyGoal for quizzesPassed when passed=true', () => {
    const dispatch = vi.fn();
    recordQuizCompletion(dispatch, true);
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        payload: {
          goalType: DAILY_GOAL_TYPES.QUIZZES_PASSED,
          amount: 1,
        },
      })
    );
  });

  it('does not dispatch when passed=false', () => {
    const dispatch = vi.fn();
    recordQuizCompletion(dispatch, false);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not dispatch when passed=undefined', () => {
    const dispatch = vi.fn();
    recordQuizCompletion(dispatch, undefined);
    expect(dispatch).not.toHaveBeenCalled();
  });
});
