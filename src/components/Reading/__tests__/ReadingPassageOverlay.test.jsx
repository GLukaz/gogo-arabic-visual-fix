/**
 * ReadingPassageOverlay.test.jsx
 *
 * Component render tests for the reading passage overlay.
 * Tests: browse state, question flow, scoring.
 *
 * Phase 82 (READ-01 + READ-02)
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import readingReducer from '../../../store/slices/readingSlice.js';
import ReadingPassageOverlay from '../ReadingPassageOverlay.jsx';

/**
 * Create a minimal test store with reading + vocabulary slices.
 */
function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      reading: readingReducer,
      vocabulary: (state = { fsrsCards: {} }) => state,
    },
    preloadedState,
  });
}

function renderOverlay(props = {}, preloadedState = {}) {
  const store = createTestStore(preloadedState);
  const onClose = props.onClose || vi.fn();
  const result = render(
    <Provider store={store}>
      <ReadingPassageOverlay onClose={onClose} />
    </Provider>,
  );
  return { ...result, store, onClose };
}

describe('ReadingPassageOverlay — Browse State', () => {
  it('renders the overlay with title', () => {
    renderOverlay();
    expect(screen.getByText('Reading Practice')).toBeTruthy();
  });

  it('renders close button', () => {
    renderOverlay();
    expect(screen.getByText('Close')).toBeTruthy();
  });

  it('renders CEFR level filter buttons', () => {
    renderOverlay();
    expect(screen.getByText('All')).toBeTruthy();
    // Level buttons also appear as badges, so use getAllByRole to find filter buttons
    const buttons = screen.getAllByRole('button');
    const filterLabels = buttons.map((b) => b.textContent).filter((t) => ['A1', 'A2', 'B1', 'B2'].includes(t));
    expect(filterLabels).toContain('A1');
    expect(filterLabels).toContain('A2');
    expect(filterLabels).toContain('B1');
    expect(filterLabels).toContain('B2');
  });

  it('renders passage cards', () => {
    renderOverlay();
    // Should find at least one passage title
    expect(screen.getByText('My Name')).toBeTruthy();
  });

  it('shows "Not started" for uncompleted passages', () => {
    renderOverlay();
    const labels = screen.getAllByText('Not started');
    expect(labels.length).toBeGreaterThan(0);
  });

  it('shows completed score for finished passages', () => {
    renderOverlay({}, {
      reading: {
        completedPassages: {
          a1_001: { score: 0.8, completedAt: Date.now(), wordsEncountered: [] },
        },
        currentPassageId: null,
        readingStats: { totalRead: 1, averageScore: 0.8, passagesPerLevel: { A1: 1, A2: 0, B1: 0, B2: 0 } },
      },
    });
    expect(screen.getByText('80%')).toBeTruthy();
    expect(screen.getByText('Completed')).toBeTruthy();
  });

  it('filters passages when a CEFR level is clicked', () => {
    renderOverlay();
    // Find the B2 filter button specifically (it's a button, not a badge span)
    const buttons = screen.getAllByRole('button');
    const b2Btn = buttons.find((b) => b.textContent === 'B2');
    fireEvent.click(b2Btn);
    // After filtering to B2, A1 passage "My Name" should not be visible
    expect(screen.queryByText('My Name')).toBeNull();
    // But B2 passages should be visible
    expect(screen.getByText('The Poetry of Mahmoud Darwish')).toBeTruthy();
  });

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderOverlay();
    fireEvent.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ReadingPassageOverlay — Reading State', () => {
  it('enters reading view when a passage is clicked', () => {
    renderOverlay();
    fireEvent.click(screen.getByText('My Name'));
    // Should now show the reading view with Arabic text
    expect(screen.getByText('Continue to Questions')).toBeTruthy();
  });

  it('shows Arabic text in reading view', () => {
    renderOverlay();
    fireEvent.click(screen.getByText('My Name'));
    // The passage title in Arabic should be visible
    expect(screen.getByText('اسمي')).toBeTruthy();
  });

  it('toggles translation visibility', () => {
    renderOverlay();
    fireEvent.click(screen.getByText('My Name'));

    // Translation should be hidden initially
    expect(screen.queryByText(/My name is Sara/)).toBeNull();

    // Click "Show Translation"
    fireEvent.click(screen.getByText('Show Translation'));
    expect(screen.getByText(/My name is Sara/)).toBeTruthy();

    // Click "Hide Translation"
    fireEvent.click(screen.getByText('Hide Translation'));
    expect(screen.queryByText(/My name is Sara/)).toBeNull();
  });
});

describe('ReadingPassageOverlay — Questions State', () => {
  function goToQuestions() {
    renderOverlay();
    fireEvent.click(screen.getByText('My Name'));
    fireEvent.click(screen.getByText('Continue to Questions'));
  }

  it('shows question progress indicator', () => {
    goToQuestions();
    expect(screen.getByText(/Question 1 of/)).toBeTruthy();
  });

  it('shows question text and options', () => {
    goToQuestions();
    // First question of a1_001
    expect(screen.getByText("What is the speaker's name?")).toBeTruthy();
  });

  it('shows feedback after selecting an answer', () => {
    goToQuestions();
    // Select correct answer (Sara = index 1)
    fireEvent.click(screen.getByText('Sara'));
    expect(screen.getByText('Correct!')).toBeTruthy();
  });

  it('shows incorrect feedback for wrong answer', () => {
    goToQuestions();
    // Select wrong answer
    fireEvent.click(screen.getByText('Layla'));
    expect(screen.getByText(/Incorrect/)).toBeTruthy();
  });

  it('shows next button after answering', () => {
    goToQuestions();
    fireEvent.click(screen.getByText('Sara'));
    expect(screen.getByText('Next Question')).toBeTruthy();
  });
});

describe('ReadingPassageOverlay — Complete State', () => {
  function completeAllQuestions() {
    const { store } = renderOverlay();
    fireEvent.click(screen.getByText('My Name'));
    fireEvent.click(screen.getByText('Continue to Questions'));

    // Answer all questions correctly for a1_001 (3 questions)
    // Q1: Sara (correct)
    fireEvent.click(screen.getByText('Sara'));
    fireEvent.click(screen.getByText('Next Question'));

    // Q2: Egypt (correct)
    fireEvent.click(screen.getByText('Egypt'));
    fireEvent.click(screen.getByText('Next Question'));

    // Q3: False (correct - she is not a teacher)
    fireEvent.click(screen.getByText('False'));
    fireEvent.click(screen.getByText('See Results'));

    return store;
  }

  it('shows completion screen after all questions', () => {
    completeAllQuestions();
    expect(screen.getByText('Reading Complete')).toBeTruthy();
  });

  it('shows final score percentage', () => {
    completeAllQuestions();
    expect(screen.getByText('100%')).toBeTruthy();
  });

  it('shows XP earned', () => {
    completeAllQuestions();
    expect(screen.getByText('+30 XP')).toBeTruthy();
  });

  it('shows words encountered', () => {
    completeAllQuestions();
    expect(screen.getByText(/Words Encountered/)).toBeTruthy();
  });

  it('shows back to passages button', () => {
    completeAllQuestions();
    expect(screen.getByText('Back to Passages')).toBeTruthy();
  });

  it('returns to browse view when back button is clicked', () => {
    completeAllQuestions();
    fireEvent.click(screen.getByText('Back to Passages'));
    expect(screen.getByText('Reading Practice')).toBeTruthy();
  });

  it('dispatches completePassage to the store', () => {
    const store = completeAllQuestions();
    const state = store.getState();
    expect(state.reading.completedPassages['a1_001']).toBeDefined();
    expect(state.reading.completedPassages['a1_001'].score).toBe(1);
  });
});
