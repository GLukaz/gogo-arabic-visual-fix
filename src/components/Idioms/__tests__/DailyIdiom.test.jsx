import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import idiomReducer, { setDailyIdiom } from '../../../store/slices/idiomSlice.js';
import { ARABIC_IDIOMS, getIdiomById } from '../../../data/arabicIdioms.js';
import { getDailyIdiomId } from '../../../utils/idiomHelpers.js';
import DailyIdiom from '../DailyIdiom.jsx';

// Use a fixed date for deterministic tests
const TODAY = '2026-03-27';
const REAL_DATE = globalThis.Date;

beforeEach(() => {
  // Mock Date so new Date() always returns our fixed date
  const fixedDate = new REAL_DATE('2026-03-27T12:00:00Z');
  vi.spyOn(globalThis, 'Date').mockImplementation(function (...args) {
    if (args.length === 0) return fixedDate;
    return new REAL_DATE(...args);
  });
  globalThis.Date.now = () => fixedDate.getTime();
  // Preserve prototype methods
  globalThis.Date.prototype = REAL_DATE.prototype;
});

afterEach(() => {
  vi.restoreAllMocks();
});

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: { idiom: idiomReducer },
    preloadedState: {
      idiom: {
        learnedIdioms: [],
        favorites: [],
        dailyIdiomId: getDailyIdiomId(TODAY, ARABIC_IDIOMS),
        lastDailyDate: TODAY,
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

function renderWithStore(props = {}, storeOverrides = {}) {
  const store = createTestStore(storeOverrides);
  const result = render(
    <Provider store={store}>
      <DailyIdiom {...props} />
    </Provider>
  );
  return { ...result, store };
}

// ============================================================
// RENDERING
// ============================================================

describe('DailyIdiom — rendering', () => {
  it('renders without crashing', () => {
    const { getByTestId } = renderWithStore();
    expect(getByTestId('daily-idiom-card')).toBeInTheDocument();
  });

  it('displays the daily idiom Arabic text', () => {
    const idiomId = getDailyIdiomId(TODAY, ARABIC_IDIOMS);
    const dailyIdiom = getIdiomById(idiomId);

    renderWithStore();
    expect(screen.getByText(dailyIdiom.arabic)).toBeInTheDocument();
  });

  it('displays the daily idiom meaning', () => {
    const idiomId = getDailyIdiomId(TODAY, ARABIC_IDIOMS);
    const dailyIdiom = getIdiomById(idiomId);

    renderWithStore();
    expect(screen.getByText(dailyIdiom.meaning)).toBeInTheDocument();
  });

  it('shows "Idiom of the Day" label', () => {
    renderWithStore();
    expect(screen.getByText('Idiom of the Day')).toBeInTheDocument();
  });
});

// ============================================================
// SIZE VARIANTS
// ============================================================

describe('DailyIdiom — size variants', () => {
  it('renders small card', () => {
    const { getByTestId } = renderWithStore({ size: 'small' });
    expect(getByTestId('daily-idiom-card')).toBeInTheDocument();
  });

  it('renders large card with full details', () => {
    renderWithStore({ size: 'large' });
    expect(screen.getByText(/Idiom of the Day/)).toBeInTheDocument();
    expect(screen.getByText(/English:/)).toBeInTheDocument();
  });

  it('shows usage example by default', () => {
    const idiomId = getDailyIdiomId(TODAY, ARABIC_IDIOMS);
    const dailyIdiom = getIdiomById(idiomId);

    renderWithStore();
    expect(screen.getByText(dailyIdiom.usageExample.english)).toBeInTheDocument();
  });
});

// ============================================================
// DETERMINISM
// ============================================================

describe('DailyIdiom — deterministic selection', () => {
  it('deterministically selects the same idiom for the same date', () => {
    const idiomId1 = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    const idiomId2 = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    expect(idiomId1).toBe(idiomId2);
  });

  it('selects different idiom on different date', () => {
    const idiomId1 = getDailyIdiomId('2026-03-27', ARABIC_IDIOMS);
    const idiomId2 = getDailyIdiomId('2026-03-28', ARABIC_IDIOMS);
    expect(idiomId1).not.toBe(idiomId2);
  });

  it('always returns a valid idiom ID', () => {
    for (let day = 1; day <= 31; day++) {
      const date = `2026-03-${String(day).padStart(2, '0')}`;
      const idiomId = getDailyIdiomId(date, ARABIC_IDIOMS);
      const idiom = getIdiomById(idiomId);
      expect(idiom, `No idiom found for ${date}`).not.toBeNull();
    }
  });
});

// ============================================================
// REDUX INTEGRATION
// ============================================================

describe('DailyIdiom — Redux integration', () => {
  it('dispatches setDailyIdiom when date changes', () => {
    // Render with a stale lastDailyDate to trigger the useEffect
    const { store } = renderWithStore({}, { lastDailyDate: '2026-03-20' });
    const state = store.getState().idiom;
    // Should have updated the daily idiom
    expect(state.dailyIdiomId).toBeTruthy();
    expect(state.lastDailyDate).not.toBe('2026-03-20');
  });
});

// ============================================================
// INTERACTIONS
// ============================================================

describe('DailyIdiom — interactions', () => {
  it('calls onClick when Learn More is clicked', () => {
    const onClick = vi.fn();
    renderWithStore({ onClick });

    fireEvent.click(screen.getByText(/Learn More/i));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('small card is clickable', () => {
    const onClick = vi.fn();
    const { getByTestId } = renderWithStore({ size: 'small', onClick });

    fireEvent.click(getByTestId('daily-idiom-card'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
