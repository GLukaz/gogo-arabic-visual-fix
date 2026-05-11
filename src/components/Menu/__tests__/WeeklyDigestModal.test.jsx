/**
 * WeeklyDigestModal.test.jsx
 * WIRE-007 — Weekly digest popup integration
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import MainMenu from '../MainMenu.jsx';

vi.mock('../../../services/audio.js', () => ({
  audioManager: { playBGM: vi.fn(), playSFX: vi.fn() },
}));

vi.mock('../../../services/dailyPhraseService.js', () => ({
  getTodayPhrase: vi.fn(() => ({
    id: 'phrase_1',
    arabic: 'مرحباً',
    transliteration: 'Marhaban',
    english: 'Hello',
    cefrLevel: 'A1',
  })),
}));

vi.mock('../../../components/Placement/PlacementTestOverlay.jsx', () => ({
  default: () => <div data-testid="placement-overlay" />,
}));

vi.mock('../../../services/weeklyDigestService.js', () => ({
  isDigestReady: vi.fn(),
  getDigestIfReady: vi.fn(),
  markDigestShown: vi.fn(),
  formatDigestSummary: vi.fn(() => '📚 Reviewed 10 words • 🔥 5 day streak'),
}));

const mockHandlers = {
  onStartGame: vi.fn(),
  onAlphabet: vi.fn(),
  onReview: vi.fn(),
  onSettings: vi.fn(),
  onCharacterCreation: vi.fn(),
  onGrammar: vi.fn(),
};

const baseState = {
  player: { name: '' },
  vocabulary: { fsrsCards: {} },
  cefrProgress: { currentLevel: 'A1', levelHistory: [], lastAssessedAt: null, lastSnapshotDate: null },
  placement: { hasCompleted: true, assignedLevel: null, rawScore: null, completedAt: null },
  analytics: { dailyActivity: {}, sessions: [], wordAccuracy: {} },
};

const mockDigest = {
  wordsReviewed: 10,
  wordsMastered: 3,
  studyMinutes: 25,
  streakDays: 5,
  averageAccuracy: 87,
  sessionsCount: 4,
  activeDays: 5,
};

describe('WeeklyDigestModal integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not show digest modal when digest is not ready', async () => {
    const { isDigestReady } = await import('../../../services/weeklyDigestService.js');
    isDigestReady.mockReturnValue(false);

    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });

    expect(screen.queryByRole('dialog', { name: /weekly learning summary/i })).not.toBeInTheDocument();
  });

  it('does not show digest modal when digest is ready but has no activity', async () => {
    const { isDigestReady, getDigestIfReady } = await import('../../../services/weeklyDigestService.js');
    isDigestReady.mockReturnValue(true);
    getDigestIfReady.mockReturnValue(null);

    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('shows digest modal when digest is ready with activity', async () => {
    const { isDigestReady, getDigestIfReady } = await import('../../../services/weeklyDigestService.js');
    isDigestReady.mockReturnValue(true);
    getDigestIfReady.mockReturnValue(mockDigest);

    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });

    expect(screen.getByRole('dialog', { name: /weekly learning summary/i })).toBeInTheDocument();
    expect(screen.getByText('Weekly Summary')).toBeInTheDocument();
  });

  it('displays digest stats in the modal', async () => {
    const { isDigestReady, getDigestIfReady } = await import('../../../services/weeklyDigestService.js');
    isDigestReady.mockReturnValue(true);
    getDigestIfReady.mockReturnValue(mockDigest);

    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });

    expect(screen.getByText('10')).toBeInTheDocument();  // wordsReviewed
    expect(screen.getByText('87%')).toBeInTheDocument(); // accuracy
  });

  it('calls markDigestShown and hides modal on dismiss', async () => {
    const { isDigestReady, getDigestIfReady, markDigestShown } = await import('../../../services/weeklyDigestService.js');
    isDigestReady.mockReturnValue(true);
    getDigestIfReady.mockReturnValue(mockDigest);

    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });

    const dismissBtn = screen.getByRole('button', { name: /dismiss weekly summary/i });
    fireEvent.click(dismissBtn);

    expect(markDigestShown).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
