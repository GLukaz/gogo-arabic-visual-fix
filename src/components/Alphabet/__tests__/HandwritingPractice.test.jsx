/**
 * HandwritingPractice.test.jsx
 * WIRE-009 — handwritingStore wired into practice mode
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import HandwritingPractice from '../HandwritingPractice.jsx';

// Mock handwritingStore so tests don't touch localStorage
vi.mock('../../../services/handwritingStore.js', () => ({
  saveAttempt: vi.fn((letterId, attempt) => ({
    letterId,
    attempts: 1,
    totalAccuracy: attempt.accuracy,
    bestAccuracy: attempt.accuracy,
    directionErrors: 0,
    directionCorrect: 1,
    mistakeCounts: {},
    recentAttempts: [{ accuracy: attempt.accuracy, direction: 'correct', timestamp: '2026-04-07T00:00:00Z' }],
    firstAttemptAt: '2026-04-07T00:00:00Z',
    lastAttemptAt: '2026-04-07T00:00:00Z',
  })),
  getLetterStats: vi.fn(() => null),
  getWeakLetters: vi.fn(() => [
    { letterId: 'ba', averageAccuracy: 30, attempts: 3 },
    { letterId: 'ta', averageAccuracy: 45, attempts: 2 },
  ]),
}));

const mockOnBack = vi.fn();

describe('HandwritingPractice', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the first letter (Alif)', () => {
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);
    expect(screen.getByText('Alif')).toBeInTheDocument();
    expect(screen.getByLabelText(/Arabic letter Alif/i)).toBeInTheDocument();
  });

  it('renders accuracy rating buttons', () => {
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);
    expect(screen.getByRole('button', { name: /rate accuracy as perfect/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /rate accuracy as miss/i })).toBeInTheDocument();
  });

  it('records a stroke attempt when accuracy is rated', async () => {
    const { saveAttempt } = await import('../../../services/handwritingStore.js');
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /rate accuracy as good/i }));

    expect(saveAttempt).toHaveBeenCalledWith('alif', expect.objectContaining({ accuracy: 75 }));
  });

  it('shows result feedback after rating', () => {
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /rate accuracy as perfect/i }));

    expect(screen.getByText(/Recorded: 100% accuracy/i)).toBeInTheDocument();
  });

  it('navigates to next letter', () => {
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /next letter/i }));

    expect(screen.getByText('Ba')).toBeInTheDocument();
  });

  it('shows weak letters in weak mode', async () => {
    const { getWeakLetters } = await import('../../../services/handwritingStore.js');
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /view weak letters/i }));

    expect(getWeakLetters).toHaveBeenCalled();
    expect(screen.getByText('30%')).toBeInTheDocument();
  });

  it('calls onBack when Back button is clicked', () => {
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);
    fireEvent.click(screen.getByRole('button', { name: /back to alphabet/i }));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('shows stats bar after recording an attempt', () => {
    renderWithProviders(<HandwritingPractice onBack={mockOnBack} />);

    fireEvent.click(screen.getByRole('button', { name: /rate accuracy as ok/i }));

    expect(screen.getByLabelText(/stats for alif/i)).toBeInTheDocument();
    expect(screen.getByText(/Attempts: 1/i)).toBeInTheDocument();
  });
});
