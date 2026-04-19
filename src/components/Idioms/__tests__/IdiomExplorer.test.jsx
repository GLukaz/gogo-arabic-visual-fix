import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import idiomReducer, { learnIdiom } from '../../../store/slices/idiomSlice.js';
import { IDIOM_CATEGORIES, CATEGORY_META, ARABIC_IDIOMS } from '../../../data/arabicIdioms.js';
import IdiomExplorer from '../IdiomExplorer.jsx';

function createTestStore(preloadedState = {}) {
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
        ...preloadedState,
      },
    },
  });
}

function renderWithStore(preloadedState = {}) {
  const store = createTestStore(preloadedState);
  const onClose = vi.fn();
  const result = render(
    <Provider store={store}>
      <IdiomExplorer onClose={onClose} />
    </Provider>
  );
  return { ...result, store, onClose };
}

// ============================================================
// RENDERING
// ============================================================

describe('IdiomExplorer — rendering', () => {
  it('renders without crashing', () => {
    const { getByText } = renderWithStore();
    expect(getByText(/Arabic Idioms/i)).toBeInTheDocument();
  });

  it('displays the Arabic title', () => {
    const { getByText } = renderWithStore();
    expect(getByText('\u0623\u0645\u062B\u0627\u0644 \u0648\u062D\u0643\u0645 \u0639\u0631\u0628\u064A\u0629')).toBeInTheDocument();
  });

  it('shows learned count', () => {
    const { getByText } = renderWithStore();
    expect(getByText(/Learned:/)).toBeInTheDocument();
  });

  it('displays all category tabs', () => {
    renderWithStore();
    for (const cat of IDIOM_CATEGORIES) {
      // Use getAllByText since category labels may also appear in idiom card text
      const matches = screen.getAllByText(new RegExp(CATEGORY_META[cat].label));
      expect(matches.length).toBeGreaterThanOrEqual(1);
    }
  });

  it('displays idiom cards', () => {
    const { queryAllByTestId } = renderWithStore();
    const cards = queryAllByTestId('idiom-card');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });
});

// ============================================================
// FILTERING
// ============================================================

describe('IdiomExplorer — filtering', () => {
  it('filters idioms by selected category', () => {
    renderWithStore();

    const wisdomTab = screen.getByText(new RegExp(`${CATEGORY_META.wisdom.label}`));
    fireEvent.click(wisdomTab);

    const cards = screen.queryAllByTestId('idiom-card');
    for (const card of cards) {
      expect(card.dataset.category).toBe('wisdom');
    }
  });

  it('shows all idioms when "All" tab is clicked', () => {
    renderWithStore();

    // Click wisdom first
    const wisdomTab = screen.getByText(new RegExp(`${CATEGORY_META.wisdom.label}`));
    fireEvent.click(wisdomTab);

    // Then click All
    const allTab = screen.getByText(/^All \(/);
    fireEvent.click(allTab);

    const cards = screen.queryAllByTestId('idiom-card');
    expect(cards.length).toBe(ARABIC_IDIOMS.length);
  });

  it('toggles unlearned filter', () => {
    renderWithStore({ learnedIdioms: ['idiom_wisdom_001'] });

    const unlearnedToggle = screen.getByRole('checkbox', { name: /unlearned/i });
    fireEvent.click(unlearnedToggle);

    const cards = screen.queryAllByTestId('idiom-card');
    for (const card of cards) {
      expect(card.dataset.learned).toBe('false');
    }
  });

  it('filters by CEFR level', () => {
    renderWithStore();

    const levelSelect = screen.getByLabelText(/Filter by CEFR level/i);
    fireEvent.change(levelSelect, { target: { value: 'A1' } });

    const cards = screen.queryAllByTestId('idiom-card');
    expect(cards.length).toBeGreaterThan(0);
    // All displayed cards should be A1 level
    expect(cards.length).toBeLessThan(ARABIC_IDIOMS.length);
  });

  it('search filters by text', () => {
    renderWithStore();

    const searchInput = screen.getByPlaceholderText(/Search idioms/i);
    fireEvent.change(searchInput, { target: { value: 'patience' } });

    const cards = screen.queryAllByTestId('idiom-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThan(ARABIC_IDIOMS.length);
  });
});

// ============================================================
// INTERACTIONS
// ============================================================

describe('IdiomExplorer — interactions', () => {
  it('dispatches learnIdiom action on Learn button click', () => {
    const { store } = renderWithStore();

    const firstIdiomId = ARABIC_IDIOMS[0].id;
    const learnBtn = screen.getByTestId(`learn-button-${firstIdiomId}`);
    fireEvent.click(learnBtn);

    const state = store.getState().idiom;
    expect(state.learnedIdioms).toContain(firstIdiomId);
  });

  it('calls onClose when close button is clicked', () => {
    const { onClose } = renderWithStore();

    const closeBtn = screen.getByLabelText('Close');
    fireEvent.click(closeBtn);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('expands card on click', () => {
    renderWithStore();

    const cards = screen.queryAllByTestId('idiom-card');
    fireEvent.click(cards[0]);

    // Expanded card shows transliteration and usage example
    expect(screen.getByText(/Transliteration:/)).toBeInTheDocument();
    expect(screen.getByText(/English Equivalent:/)).toBeInTheDocument();
  });

  it('shows learned badge for learned idioms', () => {
    const firstId = ARABIC_IDIOMS[0].id;
    renderWithStore({ learnedIdioms: [firstId] });

    const learnedBtn = screen.getByTestId(`learned-button-${firstId}`);
    expect(learnedBtn).toBeInTheDocument();
    expect(learnedBtn.textContent).toBe('Learned');
  });
});

// ============================================================
// EDGE CASES
// ============================================================

describe('IdiomExplorer — edge cases', () => {
  it('shows empty state when no idioms match filters', () => {
    renderWithStore();

    // Search for something that won't match
    const searchInput = screen.getByPlaceholderText(/Search idioms/i);
    fireEvent.change(searchInput, { target: { value: 'xyznonexistent123' } });

    expect(screen.getByText(/No idioms match/i)).toBeInTheDocument();
  });

  it('closes on Escape key', () => {
    const { onClose } = renderWithStore();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
