import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import DailyDashboard from '../DailyDashboard.jsx';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock useGameNavigation hook
const mockGoToGame = vi.fn();
const mockGoToReview = vi.fn();

vi.mock('../../../hooks/useGameNavigation.js', () => ({
  useGameNavigation: () => ({
    goToGame: mockGoToGame,
    goToReview: mockGoToReview,
    goBack: vi.fn(),
  }),
}));

describe('DailyDashboard', () => {
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
        word1: {
          card: { due: '2026-02-08T23:59:00.000Z', reps: 1 },
        },
        word2: {
          card: { due: '2026-02-08T23:58:00.000Z', reps: 1 },
        },
        word3: {
          card: { due: '2026-02-09T01:00:00.000Z', reps: 1 },
        },
      },
    },
    dailyGoals: {
      goals: {
        wordsLearned: { current: 3, target: 5, xpReward: 50, label: 'Learn Words', icon: 'Aa' },
        reviewsDone: { current: 10, target: 10, xpReward: 30, label: 'Complete Reviews', icon: '✓' },
        quizzesPassed: { current: 2, target: 3, xpReward: 40, label: 'Pass Quizzes', icon: '?' },
        minutesPlayed: { current: 8, target: 15, xpReward: 25, label: 'Study Time', icon: '⏱' },
      },
      totalSessionMinutes: 25,
    },
    quests: {
      quests: {
        quest1: { status: 'active', progress: 2 },
      },
      activeQuestId: 'quest1',
    },
    alphabet: {
      groups: ['group1', 'group2', 'group3', 'group4', 'group5', 'group6', 'group7'],
      completedGroups: ['group1'],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render greeting with player name', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/Ahmed/i)).toBeInTheDocument();
  });

  it('should display current streak count', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('Day Streak')).toBeInTheDocument();
  });

  it('should display best streak when different from current', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText(/Best: 10 days/i)).toBeInTheDocument();
  });

  it('should display reviews due count', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Reviews Due')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 words due for review
  });

  it('should display daily goals with progress bars', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Daily Goals')).toBeInTheDocument();
    expect(screen.getByText('Learn Words')).toBeInTheDocument();
    expect(screen.getByText('Complete Reviews')).toBeInTheDocument();
    expect(screen.getByText('Pass Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Study Time')).toBeInTheDocument();
  });

  it('should display goal progress values', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('3/5')).toBeInTheDocument(); // Words learned
    expect(screen.getByText('10/10')).toBeInTheDocument(); // Reviews done
    expect(screen.getByText('2/3')).toBeInTheDocument(); // Quizzes passed
    expect(screen.getByText('8/15')).toBeInTheDocument(); // Minutes played
  });

  it('should display weekly stats', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
  });

  it('should display player level in stats', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should navigate to game when Continue to Game button is clicked', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    const continueButton = screen.getByText('Continue to Game');
    fireEvent.click(continueButton);

    expect(mockGoToGame).toHaveBeenCalledTimes(1);
  });

  it('should suggest review when reviews are due', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Review Words')).toBeInTheDocument();
    expect(screen.getByText(/You have 2 words ready for review/i)).toBeInTheDocument();
  });

  it('should navigate to review when suggested activity is clicked', () => {
    renderWithProviders(<DailyDashboard />, { preloadedState: mockPreloadedState });

    const reviewButton = screen.getByText('Review Words').closest('button');
    fireEvent.click(reviewButton);

    expect(mockGoToReview).toHaveBeenCalledTimes(1);
  });

  it('should display no reviews message when no reviews due', () => {
    const stateWithNoReviews = {
      ...mockPreloadedState,
      vocabulary: {
        fsrsCards: {},
      },
    };

    renderWithProviders(<DailyDashboard />, { preloadedState: stateWithNoReviews });

    expect(screen.getByText('All caught up! Great work!')).toBeInTheDocument();
  });
});
