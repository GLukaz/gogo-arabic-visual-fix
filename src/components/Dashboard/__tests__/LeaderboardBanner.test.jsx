import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import LeaderboardBanner from '../LeaderboardBanner.jsx';

// Mock leaderboard service
vi.mock('../../../services/leaderboardService.js', () => ({
  recordWeeklySnapshot: vi.fn(),
  calculatePercentile: vi.fn(),
  getWeekId: vi.fn(() => '2026-W07'),
}));

import { calculatePercentile, recordWeeklySnapshot } from '../../../services/leaderboardService.js';

describe('LeaderboardBanner', () => {
  const mockPreloadedState = {
    player: {
      name: 'Ahmed',
      level: 5,
      xp: 500,
      xpToNextLevel: 1000,
      streak: 7,
      maxStreak: 10,
      dirhams: 250,
      wordsLearned: 42,
      lastPlayedDate: new Date().toISOString(),
    },
    vocabulary: {
      fsrsCards: {
        word1: { card: { due: '2026-02-08T23:59:00.000Z', reps: 1 }, log: null },
        word2: { card: { due: '2026-02-08T23:58:00.000Z', reps: 1 }, log: null },
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should show encouraging message when not enough data', () => {
    calculatePercentile.mockReturnValue({
      percentile: null,
      hasEnoughData: false,
      snapshotCount: 1,
    });

    renderWithProviders(<LeaderboardBanner />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/Keep playing to unlock your weekly ranking/i)).toBeInTheDocument();
  });

  it('should show percentile when enough data exists', () => {
    calculatePercentile.mockReturnValue({
      percentile: 75,
      hasEnoughData: true,
      snapshotCount: 5,
    });

    renderWithProviders(<LeaderboardBanner />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/75%/)).toBeInTheDocument();
    expect(screen.getByText(/You learned more than/i)).toBeInTheDocument();
  });

  it('should clamp percentile to minimum 1%', () => {
    calculatePercentile.mockReturnValue({
      percentile: 0,
      hasEnoughData: true,
      snapshotCount: 4,
    });

    renderWithProviders(<LeaderboardBanner />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/1%/)).toBeInTheDocument();
  });

  it('should record weekly snapshot on render', () => {
    calculatePercentile.mockReturnValue({
      percentile: null,
      hasEnoughData: false,
      snapshotCount: 0,
    });

    renderWithProviders(<LeaderboardBanner />, { preloadedState: mockPreloadedState });

    expect(recordWeeklySnapshot).toHaveBeenCalled();
  });

  it('should render with testid for targeting', () => {
    calculatePercentile.mockReturnValue({
      percentile: null,
      hasEnoughData: false,
      snapshotCount: 0,
    });

    renderWithProviders(<LeaderboardBanner />, { preloadedState: mockPreloadedState });

    expect(screen.getByTestId('leaderboard-banner')).toBeInTheDocument();
  });
});
