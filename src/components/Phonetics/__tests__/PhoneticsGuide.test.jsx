import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import PhoneticsGuide from '../PhoneticsGuide.jsx';

// Mock the ttsService module directly
const mockSpeakArabic = vi.fn().mockResolvedValue(undefined);
const mockIsAvailable = vi.fn().mockReturnValue(true);

vi.mock('../../../services/ttsService.js', () => ({
  speakArabic: (...args) => mockSpeakArabic(...args),
  isArabicTtsAvailable: () => mockIsAvailable(),
  stopSpeech: vi.fn(),
  getArabicVoices: vi.fn().mockReturnValue([]),
}));

describe('PhoneticsGuide', () => {
  beforeEach(() => {
    mockSpeakArabic.mockClear();
    mockSpeakArabic.mockResolvedValue(undefined);
    mockIsAvailable.mockReturnValue(true);
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = renderWithProviders(
      <PhoneticsGuide isOpen={false} onClose={vi.fn()} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders overlay when isOpen is true', () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Arabic Phonetics Guide')).toBeInTheDocument();
  });

  it('renders all 28 consonant buttons plus 6 vowel buttons', () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    // Each consonant/vowel has an aria-label with IPA (contains "/")
    const letterButtons = screen.getAllByRole('button').filter((btn) => {
      const label = btn.getAttribute('aria-label') || '';
      return label.includes('/');
    });
    // 28 consonants + 6 vowels = 34
    expect(letterButtons).toHaveLength(34);
  });

  it('renders vowel section', () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByText('Vowels')).toBeInTheDocument();
  });

  it('shows detail panel placeholder when no letter selected', () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByText('Click a letter to see details')).toBeInTheDocument();
  });

  it('clicking a consonant displays detail panel with correct info', async () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    const baBtn = screen.getByLabelText('Ba - /b/');

    await act(async () => {
      fireEvent.click(baBtn);
    });

    expect(screen.getByText('Ba')).toBeInTheDocument();
    expect(screen.getByText('/b/')).toBeInTheDocument();
  });

  it('clicking a consonant calls speakArabic', async () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    const baBtn = screen.getByLabelText('Ba - /b/');

    await act(async () => {
      fireEvent.click(baBtn);
    });

    expect(mockSpeakArabic).toHaveBeenCalledWith('\u0628');
  });

  it('close button calls onClose', () => {
    const onClose = vi.fn();
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={onClose} />
    );
    const closeBtn = screen.getByLabelText('Close phonetics guide');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('highlights selectedLetter prop', () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} selectedLetter="ba" />
    );
    const baBtn = screen.getByLabelText('Ba - /b/');
    expect(baBtn.className).toContain('letterSelected');
  });

  it('renders articulation diagram', () => {
    renderWithProviders(
      <PhoneticsGuide isOpen={true} onClose={vi.fn()} />
    );
    expect(screen.getByLabelText('Articulation points diagram')).toBeInTheDocument();
  });
});
