import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LeaderboardPanel from '../LeaderboardPanel.jsx';
import * as leaderboardService from '../../../services/multiProfileLeaderboardService.js';

// ============================================================
// Mock store helper
// ============================================================

function createMockStore(overrides = {}) {
  return configureStore({
    reducer: {
      player: () => ({
        name: 'TestPlayer',
        level: 10,
        xp: 5000,
        streak: 7,
        wordsLearned: 200,
        ...overrides.player,
      }),
      leaderboard: () => ({
        playerName: '',
        profiles: [],
        activeProfile: null,
        lastSynced: null,
        ...overrides.leaderboard,
      }),
      stats: () => ({
        dailyStats: [],
        totalPlayTime: 0,
        ...overrides.stats,
      }),
      achievements: () => ({
        unlockedAchievements: {},
        stats: { perfectQuizzes: 0 },
        ...overrides.achievements,
      }),
      cefrProgress: () => ({
        currentLevel: null,
        ...overrides.cefrProgress,
      }),
    },
  });
}

describe('LeaderboardPanel', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnClose.mockReset();
  });

  it('should render the leaderboard panel', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByRole('dialog')).toBeTruthy();
    // "Leaderboard" text is inside an h2 alongside an emoji span
    expect(screen.getByText(/Leaderboard/)).toBeTruthy();
  });

  it('should render all 8 category tabs', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(8);
  });

  it('should show empty state when no entries exist', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText(/no entries yet/i)).toBeTruthy();
  });

  it('should show entries when leaderboard has data', () => {
    leaderboardService.saveScore('xp', 'Alice', 1000);
    leaderboardService.saveScore('xp', 'Bob', 800);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Alice')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('should switch categories when tabs are clicked', () => {
    leaderboardService.saveScore('words_learned', 'Alice', 300);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    // Initially on xp — no entries
    expect(screen.getByText(/no entries yet/i)).toBeTruthy();

    // Click Words Learned tab (find the tab via role, not text, to avoid ambiguity with weekly stat label)
    const tabs = screen.getAllByRole('tab');
    // Words Learned is the 2nd tab (index 1)
    fireEvent.click(tabs[1]);

    // Now should show Alice
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('should highlight the current player', () => {
    leaderboardService.saveScore('xp', 'TestPlayer', 5000);
    leaderboardService.saveScore('xp', 'Rival', 3000);

    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    const playerEntry = screen.getByText('TestPlayer');
    // The entry should have the highlight class (we check the parent element)
    expect(playerEntry.className).toContain('entryNameHighlight');
  });

  it('should call onClose when close button is clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    fireEvent.click(screen.getByLabelText('Close leaderboard'));
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should call onClose when backdrop is clicked', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    fireEvent.click(screen.getByRole('dialog'));
    expect(mockOnClose).toHaveBeenCalledOnce();
  });

  it('should render the "Share My Stats" button', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.getByText('Share My Stats')).toBeTruthy();
  });

  it('should render the weekly report section', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    // "This Week" is split across an emoji span + text, so use regex
    expect(screen.getByText(/This Week/)).toBeTruthy();
    expect(screen.getByText('XP Earned')).toBeTruthy();
    expect(screen.getByText('Days Active')).toBeTruthy();
  });

  it('should render Profiles button when onOpenProfiles is provided', () => {
    const store = createMockStore();
    const onOpenProfiles = vi.fn();

    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} onOpenProfiles={onOpenProfiles} />
      </Provider>
    );

    const profilesBtn = screen.getByText('Profiles');
    expect(profilesBtn).toBeTruthy();

    fireEvent.click(profilesBtn);
    expect(onOpenProfiles).toHaveBeenCalledOnce();
  });

  it('should not render Profiles button when onOpenProfiles is not provided', () => {
    const store = createMockStore();
    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    expect(screen.queryByText('Profiles')).toBeNull();
  });

  it('should use leaderboard playerName over player.name when available', () => {
    leaderboardService.saveScore('xp', 'LeaderboardName', 9000);

    const store = createMockStore({
      leaderboard: { playerName: 'LeaderboardName' },
      player: { name: 'PlayerSliceName' },
    });

    render(
      <Provider store={store}>
        <LeaderboardPanel onClose={mockOnClose} />
      </Provider>
    );

    const entry = screen.getByText('LeaderboardName');
    expect(entry.className).toContain('entryNameHighlight');
  });
});
