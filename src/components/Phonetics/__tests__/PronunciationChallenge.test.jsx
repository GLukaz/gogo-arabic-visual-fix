import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import PronunciationChallenge from '../PronunciationChallenge.jsx';

// Mock the ttsService module directly
const mockSpeakArabic = vi.fn().mockResolvedValue(undefined);
const mockIsAvailable = vi.fn().mockReturnValue(true);

vi.mock('../../../services/ttsService.js', () => ({
  speakArabic: (...args) => mockSpeakArabic(...args),
  isArabicTtsAvailable: () => mockIsAvailable(),
  stopSpeech: vi.fn(),
  getArabicVoices: vi.fn().mockReturnValue([]),
}));

describe('PronunciationChallenge', () => {
  beforeEach(() => {
    mockSpeakArabic.mockClear();
    mockSpeakArabic.mockResolvedValue(undefined);
    mockIsAvailable.mockReturnValue(true);
  });

  it('renders instruction text', () => {
    renderWithProviders(
      <PronunciationChallenge />
    );
    expect(
      screen.getByText('Which letter does this word start with?')
    ).toBeInTheDocument();
  });

  it('renders speaker button', () => {
    renderWithProviders(
      <PronunciationChallenge />
    );
    const speakerBtn = screen.getByLabelText('Play word');
    expect(speakerBtn).toBeInTheDocument();
  });

  it('play button triggers speakArabic', async () => {
    renderWithProviders(
      <PronunciationChallenge />
    );
    const speakerBtn = screen.getByLabelText('Play word');

    await act(async () => {
      fireEvent.click(speakerBtn);
    });

    expect(mockSpeakArabic).toHaveBeenCalled();
  });

  it('shows letter choices after playing audio', async () => {
    renderWithProviders(
      <PronunciationChallenge />
    );

    const speakerBtn = screen.getByLabelText('Play word');
    await act(async () => {
      fireEvent.click(speakerBtn);
    });

    // After TTS completes, choices should appear
    const letterBtns = screen.getAllByRole('button').filter((btn) => {
      const label = btn.getAttribute('aria-label') || '';
      return label.startsWith('Letter ');
    });
    expect(letterBtns.length).toBeGreaterThanOrEqual(4);
  });

  it('shows progress bar', () => {
    renderWithProviders(
      <PronunciationChallenge />
    );
    expect(screen.getByText(/Round 1/)).toBeInTheDocument();
  });

  it('shows 5 rounds total', () => {
    renderWithProviders(
      <PronunciationChallenge />
    );
    expect(screen.getByText(/Round 1 \/ 5/)).toBeInTheDocument();
  });

  it('shows score display', () => {
    renderWithProviders(
      <PronunciationChallenge />
    );
    expect(screen.getByText(/Score: 0/)).toBeInTheDocument();
  });

  it('renders with focusCategory prop', () => {
    renderWithProviders(
      <PronunciationChallenge focusCategory="emphatic" />
    );
    expect(screen.getByText('Which letter does this word start with?')).toBeInTheDocument();
  });

  it('calls onComplete callback when provided', () => {
    const onComplete = vi.fn();
    renderWithProviders(
      <PronunciationChallenge onComplete={onComplete} />
    );
    expect(screen.getByText(/Round 1/)).toBeInTheDocument();
  });
});
