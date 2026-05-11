import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dailyChallengeReducer from '../../../store/slices/dailyChallengeSlice.js';
import DailyChallengeOverlay from '../DailyChallengeOverlay.jsx';

// Mock data modules to avoid loading full vocabulary/lore/grammar
vi.mock('../../../data/vocabularyAll.js', () => ({
  default: [
    { id: 'v1', arabic: 'كتاب', english: 'book', transliteration: 'kitaab', category: 'education' },
    { id: 'v2', arabic: 'بيت', english: 'house', transliteration: 'bayt', category: 'daily_life' },
    { id: 'v3', arabic: 'ماء', english: 'water', transliteration: "maa'", category: 'food' },
    { id: 'v4', arabic: 'شمس', english: 'sun', transliteration: 'shams', category: 'nature' },
    { id: 'v5', arabic: 'قمر', english: 'moon', transliteration: 'qamar', category: 'nature' },
    { id: 'v6', arabic: 'ولد', english: 'boy', transliteration: 'walad', category: 'family' },
    { id: 'v7', arabic: 'بنت', english: 'girl', transliteration: 'bint', category: 'family' },
    { id: 'v8', arabic: 'سلام', english: 'peace', transliteration: 'salaam', category: 'greetings' },
  ],
}));

vi.mock('../../../data/loreEntries.js', () => ({
  LORE_ENTRIES: [
    { id: 'l1', title: 'Ibn Sina', keyTerm: { arabic: 'طبيب', english: 'physician', transliteration: 'tabib' } },
    { id: 'l2', title: 'Al-Khwarizmi', keyTerm: { arabic: 'الجبر', english: 'algebra', transliteration: 'al-jabr' } },
    { id: 'l3', title: 'House of Wisdom', keyTerm: { arabic: 'حكمة', english: 'wisdom', transliteration: 'hikma' } },
    { id: 'l4', title: 'Ibn Rushd', keyTerm: { arabic: 'فلسفة', english: 'philosophy', transliteration: 'falsafa' } },
    { id: 'l5', title: 'Calligraphy', keyTerm: { arabic: 'خط', english: 'calligraphy', transliteration: 'khatt' } },
    { id: 'l6', title: 'Oud', keyTerm: { arabic: 'عود', english: 'oud', transliteration: 'oud' } },
    { id: 'l7', title: 'Arabesque', keyTerm: { arabic: 'زخرفة', english: 'arabesque', transliteration: 'zakhrafa' } },
    { id: 'l8', title: 'Dinar', keyTerm: { arabic: 'دينار', english: 'dinar', transliteration: 'dinar' } },
  ],
}));

vi.mock('../../../data/grammar.js', () => ({
  grammarLessons: [
    { id: 'g1', title: 'Definite Article', exercises: [{ type: 'fill-blank', prompt: '___ كتاب', answer: 'ال', options: ['ال', 'إل', 'أل', 'لا'] }] },
    { id: 'g2', title: 'Noun-Adjective', exercises: [{ type: 'translate', prompt: 'the big boy', answer: 'الولد الكبير', options: ['ولد كبير', 'الولد الكبير', 'كبير الولد', 'الكبير الولد'] }] },
    { id: 'g3', title: 'Pronouns', exercises: [{ type: 'fill-blank', prompt: '___ طالب', answer: 'أنا', options: ['أنا', 'أنت', 'هو', 'هي'] }] },
    { id: 'g4', title: 'Verb Conjugation', exercises: [{ type: 'fill-blank', prompt: 'أنا ___ العربية', answer: 'أتكلم', options: ['أتكلم', 'يتكلم', 'تتكلم', 'نتكلم'] }] },
    { id: 'g5', title: 'Prepositions', exercises: [{ type: 'fill-blank', prompt: 'الكتاب ___ الطاولة', answer: 'على', options: ['على', 'في', 'من', 'إلى'] }] },
    { id: 'g6', title: 'Plural Forms', exercises: [{ type: 'fill-blank', prompt: 'كتاب → ___', answer: 'كتب', options: ['كتب', 'كتابان', 'كاتب', 'مكتب'] }] },
  ],
}));

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      dailyChallenge: dailyChallengeReducer,
    },
    preloadedState: {
      dailyChallenge: {
        currentStreak: 0,
        longestStreak: 0,
        lastCompletedDate: null,
        completedToday: false,
        todaysChallengeType: null,
        todaysResult: null,
        history: [],
        streakRewardsClaimed: [],
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
      <DailyChallengeOverlay onClose={onClose} />
    </Provider>
  );
  return { ...result, store, onClose };
}

// ============================================================
// RENDERING TESTS
// ============================================================

describe('DailyChallengeOverlay', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders the overlay with header', () => {
    renderWithStore();
    expect(screen.getByText('Daily Challenge')).toBeTruthy();
    expect(screen.getByText('التحدي اليومي')).toBeTruthy();
  });

  it('shows preview state by default', () => {
    renderWithStore();
    expect(screen.getByText('Start Challenge')).toBeTruthy();
    // Should show streak
    expect(screen.getByText(/day streak/)).toBeTruthy();
  });

  it('shows current streak count', () => {
    renderWithStore({ currentStreak: 5 });
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('shows complete state when already done today', () => {
    renderWithStore({ completedToday: true, todaysChallengeType: 'speed_quiz' });
    // Goes straight to complete state
    expect(screen.getByText('Challenge Complete!')).toBeTruthy();
    expect(screen.getByText('Done')).toBeTruthy();
  });

  it('close button calls onClose', () => {
    const { onClose } = renderWithStore();
    fireEvent.click(screen.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('ESC key calls onClose', () => {
    const { onClose } = renderWithStore();
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking backdrop calls onClose', () => {
    const { onClose } = renderWithStore();
    fireEvent.click(screen.getByRole('dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('transitions to active state on Start Challenge click', () => {
    renderWithStore();
    fireEvent.click(screen.getByText('Start Challenge'));
    // After clicking start, the preview should be gone
    expect(screen.queryByText('Start Challenge')).toBeNull();
  });

  it('shows complete state when completedToday with result', () => {
    renderWithStore({
      completedToday: true,
      todaysChallengeType: 'speed_quiz',
      todaysResult: { score: 0.8, timeMs: 45000, xpEarned: 75, completedAt: '2026-03-27T10:00:00Z' },
    });
    expect(screen.getByText('Challenge Complete!')).toBeTruthy();
    expect(screen.getByText('Done')).toBeTruthy();
  });

  it('displays score card in complete state', () => {
    renderWithStore({
      completedToday: true,
      todaysChallengeType: 'speed_quiz',
      todaysResult: { score: 0.8, timeMs: 45000, xpEarned: 75, completedAt: '2026-03-27T10:00:00Z' },
    });
    expect(screen.getByText('80%')).toBeTruthy();
    expect(screen.getByText('+75')).toBeTruthy();
    expect(screen.getByText('Score')).toBeTruthy();
    expect(screen.getByText('XP')).toBeTruthy();
  });

  it('shows next reward progress when applicable', () => {
    renderWithStore({ currentStreak: 5 });
    // Should show next reward info (7-day tier: Committed)
    expect(screen.getByText(/Committed/)).toBeTruthy();
    expect(screen.getByText(/5\/7 days/)).toBeTruthy();
  });

  it('shows unclaimed rewards in complete state', () => {
    renderWithStore({
      completedToday: true,
      currentStreak: 7,
      streakRewardsClaimed: [],
      todaysChallengeType: 'speed_quiz',
      todaysResult: { score: 1, timeMs: 30000, xpEarned: 100, completedAt: '2026-03-27T10:00:00Z' },
    });
    // Should show claim buttons for 3-day and 7-day rewards
    expect(screen.getByText(/Dedicated/)).toBeTruthy();
    expect(screen.getByText(/Committed/)).toBeTruthy();
  });
});
