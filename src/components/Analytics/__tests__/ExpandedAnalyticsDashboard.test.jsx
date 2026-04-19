import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import ExpandedAnalyticsDashboard from '../ExpandedAnalyticsDashboard.jsx';

// Mock recharts to avoid canvas rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => null,
  Cell: () => null,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  RadarChart: ({ children }) => <div data-testid="radar-chart">{children}</div>,
  Radar: () => null,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  Line: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock the sub-components
vi.mock('../StudyCalendar.jsx', () => ({
  default: () => <div data-testid="study-calendar">Study Calendar</div>,
}));

vi.mock('../GoalSetting.jsx', () => ({
  default: ({ readOnly }) => <div data-testid="goal-setting" data-readonly={readOnly}>Goal Setting</div>,
}));

// Mock extendedAnalyticsSlice selectors
vi.mock('../../../store/slices/extendedAnalyticsSlice.js', () => ({
  selectStudySessions: () => [],
  selectWeeklyReports: () => [],
  selectMonthlyReports: () => [],
  selectLearningGoals: () => ({ dailyMinutes: 20, dailyWords: 5, weeklyPassages: 3 }),
  selectGoalProgress: () => ({}),
  selectGoalCompletion: () => ({
    minutes: { current: 0, target: 20, percent: 0 },
    words: { current: 0, target: 5, percent: 0 },
    passages: { current: 0, target: 3, percent: 0 },
  }),
  selectGoalStreak: () => 0,
  default: (state = {}) => state,
}));

describe('ExpandedAnalyticsDashboard', () => {
  const baseState = {
    analytics: {
      wordAccuracy: {},
      sessions: [],
      currentSession: null,
      dropoutPoints: {},
      dailyActivity: {},
    },
    cefrProgress: {
      currentLevel: null,
      levelHistory: [],
      lastAssessedAt: null,
      lastSnapshotDate: null,
    },
    stats: {
      currentStreak: 0,
      longestStreak: 0,
    },
    vocabulary: {
      fsrsCards: {},
      reviewQueue: [],
      stats: {},
    },
    grammar: {
      completedLessons: [],
      unlockedLessons: ['al-definite'],
      lessonScores: {},
    },
  };

  it('should render the dashboard with Overview tab by default', () => {
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('Learning Analytics')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByTestId('quick-stats')).toBeInTheDocument();
    expect(screen.getByTestId('study-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('goal-setting')).toBeInTheDocument();
  });

  it('should render all tab buttons', () => {
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: baseState }
    );

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Vocabulary')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Activity')).toBeInTheDocument();
    expect(screen.getByText('Reports')).toBeInTheDocument();
  });

  it('should switch to Vocabulary tab', () => {
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: baseState }
    );

    fireEvent.click(screen.getByText('Vocabulary'));
    // Vocabulary tab with no data won't show pie chart or table
    // but won't crash either
  });

  it('should switch to Skills tab and show grammar progress', () => {
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: baseState }
    );

    fireEvent.click(screen.getByText('Skills'));
    expect(screen.getByText('Grammar Progress')).toBeInTheDocument();
    expect(screen.getByText('CEFR Progress')).toBeInTheDocument();
  });

  it('should switch to Activity tab', () => {
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: baseState }
    );

    fireEvent.click(screen.getByText('Activity'));
    expect(screen.getByText('Overall Accuracy')).toBeInTheDocument();
  });

  it('should switch to Reports tab and show current report', () => {
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: baseState }
    );

    fireEvent.click(screen.getByText('Reports'));
    expect(screen.getByText('This Week')).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={onClose} />,
      { preloadedState: baseState }
    );

    fireEvent.click(screen.getByLabelText('Close analytics'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should display word accuracy data in Vocabulary tab', () => {
    const stateWithData = {
      ...baseState,
      analytics: {
        ...baseState.analytics,
        wordAccuracy: {
          kitab: { correct: 1, total: 10 },
          qalam: { correct: 2, total: 10 },
          bayt: { correct: 9, total: 10 },
        },
        dailyActivity: {
          '2026-03-27': { wordsReviewed: 10, lessonsCompleted: 1, sessionCount: 2, timeSpentMs: 600000 },
        },
      },
      vocabulary: {
        fsrsCards: { kitab: {}, qalam: {}, bayt: {} },
        reviewQueue: [],
        stats: {},
      },
    };

    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: stateWithData }
    );

    fireEvent.click(screen.getByText('Vocabulary'));
    expect(screen.getByText('Struggling Words')).toBeInTheDocument();
    expect(screen.getByText('kitab')).toBeInTheDocument();
  });

  it('should display quick stats on Overview tab', () => {
    const stateWithData = {
      ...baseState,
      analytics: {
        ...baseState.analytics,
        wordAccuracy: { a: { correct: 5, total: 5 }, b: { correct: 5, total: 5 } },
        sessions: [
          { type: 'review', startedAt: '2026-03-27T10:00:00Z', endedAt: '2026-03-27T10:10:00Z', wordsReviewed: 10, correctCount: 8 },
        ],
      },
      stats: { currentStreak: 3, longestStreak: 5 },
    };

    renderWithProviders(
      <ExpandedAnalyticsDashboard onClose={vi.fn()} />,
      { preloadedState: stateWithData }
    );

    expect(screen.getByText('2')).toBeInTheDocument(); // 2 words
    expect(screen.getByText('1')).toBeInTheDocument(); // 1 session
    expect(screen.getByText('3')).toBeInTheDocument(); // 3 streak
  });
});
