import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import idiomReducer from '../../../store/slices/idiomSlice.js';
import IdiomQuiz from '../IdiomQuiz.jsx';

function createTestStore() {
  return configureStore({
    reducer: { idiom: idiomReducer },
    preloadedState: {
      idiom: {
        learnedIdioms: [],
        favorites: [],
        dailyIdiomId: null,
        lastDailyDate: null,
        quizHistory: [],
        quizStats: {
          totalQuestions: 0,
          correctAnswers: 0,
          accuracy: 0,
          fastestTime: Infinity,
          averageTime: 0,
        },
      },
    },
  });
}

function renderQuiz(props = {}) {
  const store = createTestStore();
  const onComplete = vi.fn();
  const onBack = vi.fn();

  const result = render(
    <Provider store={store}>
      <IdiomQuiz count={2} onComplete={onComplete} onBack={onBack} {...props} />
    </Provider>
  );

  return { ...result, store, onComplete, onBack };
}

// ============================================================
// RENDERING
// ============================================================

describe('IdiomQuiz — rendering', () => {
  it('renders question prompt', () => {
    renderQuiz();
    expect(screen.getByTestId('question-prompt')).toBeInTheDocument();
  });

  it('displays 4 options', () => {
    renderQuiz();
    const options = screen.getAllByRole('button', { name: /option/i });
    expect(options).toHaveLength(4);
  });

  it('shows question progress', () => {
    renderQuiz({ count: 3 });
    expect(screen.getByTestId('question-1-of-3')).toBeInTheDocument();
  });

  it('shows question type label', () => {
    renderQuiz();
    const label = screen.getByText(/What does this idiom mean|Which idiom matches/i);
    expect(label).toBeInTheDocument();
  });
});

// ============================================================
// ANSWERING
// ============================================================

describe('IdiomQuiz — answering', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows feedback on answer selection', () => {
    renderQuiz();

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    // Should show either "Correct!" or "Incorrect"
    expect(
      screen.getByText(/Correct!|Incorrect/i)
    ).toBeInTheDocument();
  });

  it('disables options after answering', () => {
    renderQuiz();

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    // All options should be disabled
    for (const option of options) {
      expect(option).toBeDisabled();
    }
  });

  it('records quiz result in Redux store', () => {
    const { store } = renderQuiz();

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    const state = store.getState().idiom;
    expect(state.quizHistory).toHaveLength(1);
    expect(state.quizStats.totalQuestions).toBe(1);
  });

  it('advances to next question after delay', () => {
    renderQuiz({ count: 2 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    // Advance timers past the ADVANCE_DELAY
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByTestId('question-2-of-2')).toBeInTheDocument();
  });

  it('shows results after final question', () => {
    renderQuiz({ count: 1 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByTestId('quiz-results')).toBeInTheDocument();
  });

  it('calls onComplete with score data after final question', () => {
    const { onComplete } = renderQuiz({ count: 1 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        score: expect.any(Number),
        accuracy: expect.any(Number),
        timeMs: expect.any(Number),
        answers: expect.any(Array),
      })
    );
  });
});

// ============================================================
// RESULTS SCREEN
// ============================================================

describe('IdiomQuiz — results screen', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows score and accuracy', () => {
    renderQuiz({ count: 1 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByTestId('quiz-results')).toBeInTheDocument();
    expect(screen.getByText('Quiz Results')).toBeInTheDocument();
    expect(screen.getByText(/\d+\/1/)).toBeInTheDocument();
  });

  it('shows Try Again button', () => {
    renderQuiz({ count: 1 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('retry resets the quiz', () => {
    renderQuiz({ count: 1 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    fireEvent.click(screen.getByText('Try Again'));

    // Should be back at question 1
    expect(screen.getByTestId('question-prompt')).toBeInTheDocument();
  });

  it('shows Back button when onBack is provided', () => {
    renderQuiz({ count: 1 });

    const options = screen.getAllByRole('button', { name: /option/i });
    fireEvent.click(options[0]);

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
