/**
 * MainMenuDailyPhrase.test.jsx
 * WIRE-006 — Daily phrase card integration in MainMenu
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import MainMenu from '../MainMenu.jsx';

vi.mock('../../../services/audio.js', () => ({
  audioManager: { playBGM: vi.fn(), playSFX: vi.fn() },
}));

vi.mock('../../../services/dailyPhraseService.js', () => ({
  getTodayPhrase: vi.fn(() => ({
    id: 'phrase_test_1',
    arabic: 'مرحباً',
    transliteration: 'Marhaban',
    english: 'Hello',
    cefrLevel: 'A1',
    category: 'greetings',
  })),
}));

vi.mock('../../../components/Placement/PlacementTestOverlay.jsx', () => ({
  default: () => <div data-testid="placement-overlay" />,
}));

const mockHandlers = {
  onStartGame: vi.fn(),
  onAlphabet: vi.fn(),
  onReview: vi.fn(),
  onSettings: vi.fn(),
  onCharacterCreation: vi.fn(),
  onGrammar: vi.fn(),
};

describe('MainMenu daily phrase card', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseState = {
    player: { name: '' },
    vocabulary: { fsrsCards: {} },
    cefrProgress: { currentLevel: 'A1', levelHistory: [], lastAssessedAt: null, lastSnapshotDate: null },
    placement: { hasCompleted: true, assignedLevel: null, rawScore: null, completedAt: null },
  };

  it('renders the phrase card with Arabic text', () => {
    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });
    expect(screen.getByText('مرحباً')).toBeInTheDocument();
  });

  it('renders transliteration and English translation', () => {
    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });
    expect(screen.getByText('Marhaban')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders the "Today\'s Phrase" label', () => {
    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });
    expect(screen.getByText("Today's Phrase")).toBeInTheDocument();
  });

  it('phrase card has correct accessibility attributes', () => {
    renderWithProviders(<MainMenu {...mockHandlers} />, { preloadedState: baseState });
    expect(screen.getByRole('complementary', { name: /daily arabic phrase/i })).toBeInTheDocument();
  });

  it('passes CEFR level to getTodayPhrase', async () => {
    const { getTodayPhrase } = await import('../../../services/dailyPhraseService.js');
    renderWithProviders(<MainMenu {...mockHandlers} />, {
      preloadedState: { ...baseState, cefrProgress: { ...baseState.cefrProgress, currentLevel: 'B1' } },
    });
    expect(getTodayPhrase).toHaveBeenCalledWith('B1');
  });

  it('falls back to A1 when cefrLevel is null', async () => {
    const { getTodayPhrase } = await import('../../../services/dailyPhraseService.js');
    renderWithProviders(<MainMenu {...mockHandlers} />, {
      preloadedState: { ...baseState, cefrProgress: { ...baseState.cefrProgress, currentLevel: null } },
    });
    expect(getTodayPhrase).toHaveBeenCalledWith('A1');
  });
});
