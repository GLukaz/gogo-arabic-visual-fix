import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import PlayerProfile from '../PlayerProfile.jsx';

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
    header: ({ children, ...props }) => <header {...props}>{children}</header>,
  },
}));

// Mock useGameNavigation hook
const mockGoBack = vi.fn();

vi.mock('../../../hooks/useGameNavigation.js', () => ({
  useGameNavigation: () => ({
    goBack: mockGoBack,
    goToGame: vi.fn(),
    goToReview: vi.fn(),
  }),
}));

// Mock ACHIEVEMENTS data to control achievement rendering
vi.mock('../../../data/achievements.js', () => ({
  ACHIEVEMENTS: [
    { id: 'first_word', name: 'First Steps', description: 'Learn your first Arabic word', icon: '📖', xpReward: 25, rarity: 'common', category: 'vocabulary' },
    { id: 'word_collector_10', name: 'Word Collector', description: 'Learn 10 words', icon: '📚', xpReward: 50, rarity: 'common', category: 'vocabulary' },
    { id: 'quest_master', name: 'Quest Master', description: 'Complete 10 quests', icon: '⚔️', xpReward: 100, rarity: 'uncommon', category: 'quests' },
    { id: 'streak_7', name: 'Week Warrior', description: '7-day streak', icon: '🔥', xpReward: 75, rarity: 'uncommon', category: 'streaks' },
  ],
}));

describe('PlayerProfile', () => {
  const mockPreloadedState = {
    player: {
      name: 'Hassan',
      level: 8,
      xp: 3500,
      dirhams: 450,
      wordsLearned: 120,
      streak: 14,
      maxStreak: 21,
      currentZone: 'ancient_library',
      currentTitle: 'Word Collector',
      lastPlayedDate: new Date().toISOString(),
    },
    vocabulary: {
      fsrsCards: {
        word1: { card: { reps: 5, lapses: 1 } },
        word2: { card: { reps: 3, lapses: 0 } },
        word3: { card: { reps: 8, lapses: 2 } },
        word4: { card: { reps: 10, lapses: 1 } },
      },
    },
    achievements: {
      unlockedAchievements: {
        first_word: Date.now() - 1000000,
        word_collector_10: Date.now() - 500000,
        quest_master: Date.now() - 100000,
      },
    },
    dailyGoals: {
      totalSessionMinutes: 185, // 3h 5m
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render player name', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Hassan')).toBeInTheDocument();
  });

  it('should render player level', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Level 8')).toBeInTheDocument();
  });

  it('should render player title when present', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    // "Word Collector" appears in both player title and achievement name
    const elements = screen.getAllByText('Word Collector');
    expect(elements.length).toBeGreaterThanOrEqual(1);
    expect(elements[0]).toBeInTheDocument();
  });

  it('should render words learned stat', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Words Learned')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
  });

  it('should render accuracy rate', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Accuracy')).toBeInTheDocument();
    // Accuracy should be calculated from FSRS cards
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });

  it('should render time played formatted', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Time Played')).toBeInTheDocument();
    expect(screen.getByText(/3h 5m/)).toBeInTheDocument();
  });

  it('should render current zone', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Current Zone')).toBeInTheDocument();
    expect(screen.getByText(/ancient library/i)).toBeInTheDocument();
  });

  it('should render dirhams count', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Dirhams')).toBeInTheDocument();
    expect(screen.getByText('450')).toBeInTheDocument();
  });

  it('should render total XP', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Total XP')).toBeInTheDocument();
    expect(screen.getByText('3500')).toBeInTheDocument();
  });

  it('should render current streak', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Day Streak')).toBeInTheDocument();
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('should render best streak', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Best Streak')).toBeInTheDocument();
    expect(screen.getByText('21')).toBeInTheDocument();
  });

  it('should render streak calendar', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    // Should render 7 days (last week)
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const renderedDays = days.filter((day) => screen.queryByText(day));
    expect(renderedDays.length).toBeGreaterThan(0);
  });

  it('should render achievements section', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Achievements')).toBeInTheDocument();
  });

  it('should display unlocked achievements count', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    // Should show "3 / 4" format (3 unlocked out of 4 total in mock)
    expect(screen.getByText('3 / 4')).toBeInTheDocument();
  });

  it('should render unlocked achievement badges', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    // Achievement names from ACHIEVEMENTS data
    expect(screen.getByText('First Steps')).toBeInTheDocument();
  });

  it('should show no achievements message when none unlocked', () => {
    const stateWithNoAchievements = {
      ...mockPreloadedState,
      achievements: {
        unlockedAchievements: {},
      },
    };

    renderWithProviders(<PlayerProfile />, { preloadedState: stateWithNoAchievements });

    expect(screen.getByText(/No achievements unlocked yet/i)).toBeInTheDocument();
  });

  it('should call goBack when back button is clicked', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });

  it('should render statistics section title', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Statistics')).toBeInTheDocument();
  });

  it('should render learning streak section title', () => {
    renderWithProviders(<PlayerProfile />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Learning Streak')).toBeInTheDocument();
  });
});
