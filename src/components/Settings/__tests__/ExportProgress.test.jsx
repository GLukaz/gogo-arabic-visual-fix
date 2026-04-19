import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import ExportProgress, { buildProgressData, progressToCSV } from '../ExportProgress.jsx';

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = vi.fn();

describe('ExportProgress', () => {
  // Use distinct counts so we can verify each one
  const mockPreloadedState = {
    player: {
      name: 'Ahmed',
      level: 8,
      xp: 1200,
      xpToNextLevel: 2000,
      streak: 5,
      maxStreak: 12,
      dirhams: 300,
      wordsLearned: 25,
      lastPlayedDate: new Date().toISOString(),
    },
    vocabulary: {
      fsrsCards: {
        word1: { card: { due: '2026-02-10T00:00:00.000Z', reps: 3, stability: 5.2, difficulty: 0.3 }, log: { rating: 4, review: '2026-02-09T00:00:00.000Z' }, source: 'npc' },
        word2: { card: { due: '2026-02-12T00:00:00.000Z', reps: 1, stability: 2.0, difficulty: 0.5 }, log: null, source: null },
        word3: { card: { due: '2026-02-14T00:00:00.000Z', reps: 2, stability: 3.0, difficulty: 0.4 }, log: null, source: null },
      },
    },
    grammar: {
      completedLessons: ['al-definite', 'sun-moon-letters'],
      unlockedLessons: ['al-definite', 'sun-moon-letters', 'pronouns'],
      lessonScores: {
        'al-definite': { exerciseScore: 90, quizScore: 85, attempts: 2, lastAttempt: '2026-02-08T10:00:00.000Z' },
        'sun-moon-letters': { exerciseScore: 100, quizScore: 95, attempts: 1, lastAttempt: '2026-02-09T10:00:00.000Z' },
      },
      currentLessonId: null,
    },
    quests: {
      quests: {},
      activeQuestId: null,
      quizzesPassed: [
        { accuracy: 90, timestamp: '2026-02-08T10:00:00.000Z' },
        { accuracy: 100, timestamp: '2026-02-09T11:00:00.000Z' },
        { accuracy: 85, timestamp: '2026-02-09T12:00:00.000Z' },
        { accuracy: 95, timestamp: '2026-02-09T13:00:00.000Z' },
        { accuracy: 88, timestamp: '2026-02-09T14:00:00.000Z' },
      ],
    },
    achievements: {
      unlockedAchievements: {
        first_word: 1707408000000,
        word_collector_10: 1707494400000,
        word_collector_50: 1707580800000,
        word_collector_100: 1707667200000,
        word_collector_200: 1707753600000,
        word_collector_500: 1707840000000,
        word_collector_1000: 1707926400000,
      },
      newAchievements: [],
      stats: { totalReviews: 0, reviewStreakDays: 0, lastReviewDate: null, perfectQuizzes: 0, shopPurchases: 0, dirhamsSpent: 0, quizTypeStats: {} },
    },
    cefrProgress: {
      currentLevel: 'A2',
      levelHistory: [{ level: 'A1', date: '2026-01-15T00:00:00.000Z', source: 'placement' }],
      lastAssessedAt: '2026-02-01T00:00:00.000Z',
      lastSnapshotDate: null,
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the export panel with title', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });
    expect(screen.getByText('Export My Progress')).toBeInTheDocument();
  });

  it('should display data summary labels', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Words')).toBeInTheDocument();
    expect(screen.getByText('Grammar')).toBeInTheDocument();
    expect(screen.getByText('Quizzes')).toBeInTheDocument();
    expect(screen.getByText('Achievements')).toBeInTheDocument();
    expect(screen.getByText('Data Summary')).toBeInTheDocument();
  });

  it('should display correct stat values', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });

    // 3 words, 2 grammar, 5 quizzes, 7 achievements — all distinct
    expect(screen.getByText('3')).toBeInTheDocument(); // vocab
    expect(screen.getByText('5')).toBeInTheDocument(); // quizzes
    expect(screen.getByText('7')).toBeInTheDocument(); // achievements
  });

  it('should display CEFR level badge', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });
    expect(screen.getByText('A2')).toBeInTheDocument();
  });

  it('should display N/A when no CEFR level', () => {
    const stateWithoutCefr = {
      ...mockPreloadedState,
      cefrProgress: { currentLevel: null, levelHistory: [], lastAssessedAt: null, lastSnapshotDate: null },
    };
    renderWithProviders(<ExportProgress />, { preloadedState: stateWithoutCefr });
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('should have Export JSON and Export CSV buttons', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });

    expect(screen.getByText('Export JSON')).toBeInTheDocument();
    expect(screen.getByText('Export CSV')).toBeInTheDocument();
  });

  it('should have accessible export buttons with aria-labels', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });

    expect(screen.getByLabelText('Export as JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('Export as CSV')).toBeInTheDocument();
  });

  it('should render back button when onBack prop is provided', () => {
    const mockOnBack = vi.fn();
    renderWithProviders(<ExportProgress onBack={mockOnBack} />, { preloadedState: mockPreloadedState });

    const backBtn = screen.getByText('Back');
    fireEvent.click(backBtn);
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('should not render back button when onBack is not provided', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });
    expect(screen.queryByText('Back')).not.toBeInTheDocument();
  });

  it('should have region role with accessible label', () => {
    renderWithProviders(<ExportProgress />, { preloadedState: mockPreloadedState });
    expect(screen.getByRole('region', { name: 'Export Progress' })).toBeInTheDocument();
  });
});

describe('buildProgressData', () => {
  it('should build complete progress object', () => {
    const data = buildProgressData({
      fsrsCards: {
        word1: { card: { due: '2026-02-10', reps: 2 }, log: { rating: 3 }, source: 'npc' },
      },
      completedLessons: ['al-definite'],
      lessonScores: {
        'al-definite': { exerciseScore: 90, quizScore: 85, attempts: 1, lastAttempt: '2026-02-09' },
      },
      unlockedAchievements: { first_word: 1707408000000 },
      cefrLevel: 'A1',
      cefrHistory: [],
      quizzesPassed: [{ accuracy: 95, timestamp: '2026-02-09' }],
      playerName: 'Test',
      playerLevel: 3,
    });

    expect(data.vocabulary).toHaveLength(1);
    expect(data.vocabulary[0].wordId).toBe('word1');
    expect(data.vocabulary[0].card.reps).toBe(2);
    expect(data.vocabulary[0].source).toBe('npc');
    expect(data.grammarLessons).toHaveLength(1);
    expect(data.grammarLessons[0].exerciseScore).toBe(90);
    expect(data.quizHistory).toHaveLength(1);
    expect(data.quizHistory[0].accuracy).toBe(95);
    expect(data.achievements).toHaveLength(1);
    expect(data.achievements[0].id).toBe('first_word');
    expect(data.cefrLevel.currentLevel).toBe('A1');
    expect(data.summary.wordsLearned).toBe(1);
    expect(data.summary.grammarCompleted).toBe(1);
    expect(data.summary.quizzesCompleted).toBe(1);
    expect(data.summary.achievementsUnlocked).toBe(1);
    expect(data.playerName).toBe('Test');
    expect(data.playerLevel).toBe(3);
    expect(data.exportDate).toBeDefined();
  });

  it('should handle empty data gracefully', () => {
    const data = buildProgressData({
      fsrsCards: {},
      completedLessons: [],
      lessonScores: {},
      unlockedAchievements: {},
      cefrLevel: null,
      cefrHistory: [],
      quizzesPassed: [],
      playerName: '',
      playerLevel: 1,
    });

    expect(data.vocabulary).toHaveLength(0);
    expect(data.grammarLessons).toHaveLength(0);
    expect(data.quizHistory).toHaveLength(0);
    expect(data.achievements).toHaveLength(0);
    expect(data.cefrLevel.currentLevel).toBe('Not assessed');
    expect(data.playerName).toBe('Anonymous');
    expect(data.playerLevel).toBe(1);
  });

  it('should handle null quizzesPassed', () => {
    const data = buildProgressData({
      fsrsCards: {},
      completedLessons: [],
      lessonScores: {},
      unlockedAchievements: {},
      cefrLevel: 'A1',
      cefrHistory: null,
      quizzesPassed: null,
      playerName: 'Player',
      playerLevel: 1,
    });

    expect(data.quizHistory).toHaveLength(0);
    expect(data.cefrLevel.history).toEqual([]);
  });
});

describe('progressToCSV', () => {
  it('should generate valid CSV string with all sections', () => {
    const data = {
      exportDate: '2026-02-09T00:00:00.000Z',
      playerName: 'Test',
      playerLevel: 5,
      cefrLevel: { currentLevel: 'A2', history: [] },
      vocabulary: [
        { wordId: 'hello', card: { due: '2026-02-10', reps: 2, stability: 3.0, difficulty: 0.4 }, source: 'npc' },
      ],
      grammarLessons: [
        { lessonId: 'al-definite', exerciseScore: 90, quizScore: 85, attempts: 1, lastAttempt: '2026-02-08' },
      ],
      quizHistory: [
        { index: 1, accuracy: 95, timestamp: '2026-02-09' },
      ],
      achievements: [
        { id: 'first_word', name: 'First Steps', category: 'vocabulary', unlockedAt: '2026-02-01T00:00:00.000Z' },
      ],
    };

    const csv = progressToCSV(data);
    expect(csv).toContain('# GoGo Arabic Progress Export');
    expect(csv).toContain('# Player: Test');
    expect(csv).toContain('# Level: 5');
    expect(csv).toContain('# CEFR: A2');
    expect(csv).toContain('## Vocabulary');
    expect(csv).toContain('Word ID,Due Date,Reps,Stability,Difficulty,Source');
    expect(csv).toContain('hello,2026-02-10,2,3,0.4,npc');
    expect(csv).toContain('## Grammar Lessons');
    expect(csv).toContain('Lesson ID,Exercise Score,Quiz Score,Attempts,Last Attempt');
    expect(csv).toContain('al-definite,90,85,1,2026-02-08');
    expect(csv).toContain('## Quiz History');
    expect(csv).toContain('Index,Accuracy,Timestamp');
    expect(csv).toContain('1,95,2026-02-09');
    expect(csv).toContain('## Achievements');
    expect(csv).toContain('ID,Name,Category,Unlocked At');
    expect(csv).toContain('first_word,"First Steps",vocabulary');
  });

  it('should handle empty data arrays', () => {
    const data = {
      exportDate: '2026-02-09T00:00:00.000Z',
      playerName: 'Empty',
      playerLevel: 1,
      cefrLevel: { currentLevel: 'N/A', history: [] },
      vocabulary: [],
      grammarLessons: [],
      quizHistory: [],
      achievements: [],
    };

    const csv = progressToCSV(data);
    expect(csv).toContain('# GoGo Arabic Progress Export');
    expect(csv).toContain('## Vocabulary');
    expect(csv).toContain('## Achievements');
  });
});
