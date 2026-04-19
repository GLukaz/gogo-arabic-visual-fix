import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import StudyCalendar from '../StudyCalendar.jsx';

describe('StudyCalendar', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-27T12:00:00Z'));
  });

  it('should render the calendar container', () => {
    renderWithProviders(
      <StudyCalendar dailyActivityOverride={{}} />
    );

    expect(screen.getByTestId('study-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('calendar-grid')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should render 12 weeks of columns', () => {
    renderWithProviders(
      <StudyCalendar dailyActivityOverride={{}} />
    );

    const grid = screen.getByTestId('calendar-grid');
    // Each week is a column div
    const columns = grid.children;
    expect(columns.length).toBe(12);

    vi.useRealTimers();
  });

  it('should render day cells with intensity attributes', () => {
    const activity = {
      '2026-03-27': { wordsReviewed: 10, lessonsCompleted: 1, sessionCount: 2, timeSpentMs: 1200000 }, // 20 min = intensity 2
      '2026-03-26': { wordsReviewed: 5, lessonsCompleted: 0, sessionCount: 1, timeSpentMs: 300000 },  // 5 min = intensity 1
    };

    renderWithProviders(
      <StudyCalendar dailyActivityOverride={activity} />
    );

    const todayCell = screen.getByTestId('day-2026-03-27');
    expect(todayCell).toBeInTheDocument();
    expect(todayCell.getAttribute('data-intensity')).toBe('2');

    const yesterdayCell = screen.getByTestId('day-2026-03-26');
    expect(yesterdayCell.getAttribute('data-intensity')).toBe('1');

    vi.useRealTimers();
  });

  it('should show intensity 0 for days without activity', () => {
    renderWithProviders(
      <StudyCalendar dailyActivityOverride={{}} />
    );

    const todayCell = screen.getByTestId('day-2026-03-27');
    expect(todayCell.getAttribute('data-intensity')).toBe('0');

    vi.useRealTimers();
  });

  it('should show intensity 3 for 30+ minute days', () => {
    const activity = {
      '2026-03-27': { wordsReviewed: 20, lessonsCompleted: 2, sessionCount: 3, timeSpentMs: 2400000 }, // 40 min
    };

    renderWithProviders(
      <StudyCalendar dailyActivityOverride={activity} />
    );

    const todayCell = screen.getByTestId('day-2026-03-27');
    expect(todayCell.getAttribute('data-intensity')).toBe('3');

    vi.useRealTimers();
  });

  it('should show intensity 4 for 45+ minute days', () => {
    const activity = {
      '2026-03-27': { wordsReviewed: 30, lessonsCompleted: 3, sessionCount: 4, timeSpentMs: 3600000 }, // 60 min
    };

    renderWithProviders(
      <StudyCalendar dailyActivityOverride={activity} />
    );

    const todayCell = screen.getByTestId('day-2026-03-27');
    expect(todayCell.getAttribute('data-intensity')).toBe('4');

    vi.useRealTimers();
  });

  it('should show title with Arabic', () => {
    renderWithProviders(
      <StudyCalendar dailyActivityOverride={{}} />
    );

    expect(screen.getByText(/Study Calendar/)).toBeInTheDocument();
    expect(screen.getByText(/تقويم الدراسة/)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should display legend', () => {
    renderWithProviders(
      <StudyCalendar dailyActivityOverride={{}} />
    );

    expect(screen.getByText('Less')).toBeInTheDocument();
    expect(screen.getByText('More')).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should display streak info', () => {
    renderWithProviders(
      <StudyCalendar dailyActivityOverride={{}} />
    );

    expect(screen.getByText(/Current Streak/)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should calculate streak from consecutive study days', () => {
    const activity = {
      '2026-03-27': { wordsReviewed: 10, lessonsCompleted: 1, sessionCount: 1, timeSpentMs: 600000 },
      '2026-03-26': { wordsReviewed: 10, lessonsCompleted: 1, sessionCount: 1, timeSpentMs: 600000 },
      '2026-03-25': { wordsReviewed: 10, lessonsCompleted: 1, sessionCount: 1, timeSpentMs: 600000 },
      // gap at 2026-03-24
    };

    renderWithProviders(
      <StudyCalendar dailyActivityOverride={activity} />
    );

    // The streak text should include "3"
    expect(screen.getByText(/3 days/)).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('should render from Redux state when no override', () => {
    const preloadedState = {
      analytics: {
        wordAccuracy: {},
        sessions: [],
        currentSession: null,
        dropoutPoints: {},
        dailyActivity: {
          '2026-03-27': { wordsReviewed: 5, lessonsCompleted: 0, sessionCount: 1, timeSpentMs: 300000 },
        },
      },
    };

    renderWithProviders(
      <StudyCalendar />,
      { preloadedState }
    );

    const todayCell = screen.getByTestId('day-2026-03-27');
    expect(todayCell.getAttribute('data-intensity')).toBe('1');

    vi.useRealTimers();
  });
});
