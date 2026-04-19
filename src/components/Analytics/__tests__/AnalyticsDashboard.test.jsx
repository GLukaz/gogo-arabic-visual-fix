import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import AnalyticsDashboard from '../AnalyticsDashboard.jsx';

// Mock recharts to avoid canvas rendering issues in tests
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  Line: () => null,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
}));

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

describe('AnalyticsDashboard', () => {
  it('should render empty state when no data', () => {
    renderWithProviders(<AnalyticsDashboard onBack={vi.fn()} />);
    expect(screen.getByText(/No analytics data yet/i)).toBeInTheDocument();
  });

  it('should render hardest words when data exists', () => {
    const preloadedState = {
      analytics: {
        wordAccuracy: {
          kitab: { correct: 1, total: 5 },
          qalam: { correct: 4, total: 5 },
          bayt: { correct: 2, total: 4 },
        },
        sessions: [],
        currentSession: null,
        dropoutPoints: {},
        dailyActivity: {},
      },
    };

    renderWithProviders(<AnalyticsDashboard onBack={vi.fn()} />, { preloadedState });
    expect(screen.getByText('Hardest Words')).toBeInTheDocument();
    expect(screen.getByText('kitab')).toBeInTheDocument();
  });

  it('should render session accuracy trend with multiple sessions', () => {
    const preloadedState = {
      analytics: {
        wordAccuracy: { kitab: { correct: 3, total: 5 } },
        sessions: [
          { type: 'review', startedAt: '2026-03-23T10:00:00Z', endedAt: '2026-03-23T10:10:00Z', wordsReviewed: 20, correctCount: 15 },
          { type: 'review', startedAt: '2026-03-24T10:00:00Z', endedAt: '2026-03-24T10:15:00Z', wordsReviewed: 25, correctCount: 20 },
        ],
        currentSession: null,
        dropoutPoints: {},
        dailyActivity: {},
      },
    };

    renderWithProviders(<AnalyticsDashboard onBack={vi.fn()} />, { preloadedState });
    expect(screen.getByText('Session Accuracy Trend')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('should render daily activity chart', () => {
    const preloadedState = {
      analytics: {
        wordAccuracy: { kitab: { correct: 3, total: 5 } },
        sessions: [],
        currentSession: null,
        dropoutPoints: {},
        dailyActivity: {
          '2026-03-24': { wordsReviewed: 15, lessonsCompleted: 2, sessionCount: 3, timeSpentMs: 600000 },
        },
      },
    };

    renderWithProviders(<AnalyticsDashboard onBack={vi.fn()} />, { preloadedState });
    expect(screen.getByText('Daily Activity')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('should show overall accuracy stat', () => {
    const preloadedState = {
      analytics: {
        wordAccuracy: {
          kitab: { correct: 5, total: 10 },
          qalam: { correct: 5, total: 10 },
        },
        sessions: [],
        currentSession: null,
        dropoutPoints: {},
        dailyActivity: {},
      },
    };

    renderWithProviders(<AnalyticsDashboard onBack={vi.fn()} />, { preloadedState });
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});
