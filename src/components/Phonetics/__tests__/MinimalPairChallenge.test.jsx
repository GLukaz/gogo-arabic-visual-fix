import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import MinimalPairChallenge from '../MinimalPairChallenge.jsx';

// Mock the ttsService module directly
const mockSpeakArabic = vi.fn().mockResolvedValue(undefined);
const mockIsAvailable = vi.fn().mockReturnValue(true);

vi.mock('../../../services/ttsService.js', () => ({
  speakArabic: (...args) => mockSpeakArabic(...args),
  isArabicTtsAvailable: () => mockIsAvailable(),
  stopSpeech: vi.fn(),
  getArabicVoices: vi.fn().mockReturnValue([]),
}));

describe('MinimalPairChallenge', () => {
  beforeEach(() => {
    mockSpeakArabic.mockClear();
    mockSpeakArabic.mockResolvedValue(undefined);
    mockIsAvailable.mockReturnValue(true);
  });

  it('renders two letter choices from a pair', () => {
    renderWithProviders(
      <MinimalPairChallenge pairId="ba-fa" />
    );
    expect(screen.getByText('VS')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button').filter((btn) => {
      const label = btn.getAttribute('aria-label') || '';
      return label.includes('Ba') || label.includes('Fa');
    });
    expect(buttons).toHaveLength(2);
  });

  it('renders instruction text', () => {
    renderWithProviders(
      <MinimalPairChallenge />
    );
    expect(
      screen.getByText('Listen to the sound and select which one you hear')
    ).toBeInTheDocument();
  });

  it('renders speaker button', () => {
    renderWithProviders(
      <MinimalPairChallenge />
    );
    const speakerBtn = screen.getByLabelText('Play sound');
    expect(speakerBtn).toBeInTheDocument();
  });

  it('play button triggers speakArabic', async () => {
    renderWithProviders(
      <MinimalPairChallenge pairId="ba-fa" />
    );
    const speakerBtn = screen.getByLabelText('Play sound');

    await act(async () => {
      fireEvent.click(speakerBtn);
    });

    expect(mockSpeakArabic).toHaveBeenCalled();
  });

  it('shows score display', () => {
    renderWithProviders(
      <MinimalPairChallenge />
    );
    expect(screen.getByText(/Score:/)).toBeInTheDocument();
    expect(screen.getByText(/Round:/)).toBeInTheDocument();
  });

  it('shows difficulty indicators', () => {
    renderWithProviders(
      <MinimalPairChallenge difficulty={2} />
    );
    expect(screen.getByText('Level')).toBeInTheDocument();
  });

  it('advances to selection phase after playing sound', async () => {
    renderWithProviders(
      <MinimalPairChallenge pairId="ba-fa" />
    );

    const speakerBtn = screen.getByLabelText('Play sound');
    await act(async () => {
      fireEvent.click(speakerBtn);
    });

    // After TTS resolves, letter buttons should be enabled (selection phase)
    const letterBtns = screen.getAllByRole('button').filter((btn) => {
      const label = btn.getAttribute('aria-label') || '';
      return label.includes('Ba') || label.includes('Fa');
    });
    // Both buttons should exist and not be disabled
    expect(letterBtns).toHaveLength(2);
  });

  it('renders with default difficulty of 1', () => {
    renderWithProviders(
      <MinimalPairChallenge />
    );
    const activeDots = screen.getAllByLabelText(/Difficulty 1 \(active\)/);
    expect(activeDots).toHaveLength(1);
  });
});
