import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ListeningComprehension from '../ListeningComprehension.jsx';

// ── Mocks ────────────────────────────────────────────────────────────────────

// Mock useFormatArabic
vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => {
    const fn = (s) => s;
    fn.renderArabic = (s) => s;
    fn.getTashkeelOpacity = () => 1.0;
    return fn;
  },
}));

// Mock ttsService
const mockSpeakArabic = vi.fn(() => Promise.resolve());
const mockStopSpeech = vi.fn();
const mockIsArabicTtsAvailable = vi.fn(() => true);

vi.mock('../../../services/ttsService.js', () => ({
  speakArabic: (...args) => mockSpeakArabic(...args),
  stopSpeech: (...args) => mockStopSpeech(...args),
  isArabicTtsAvailable: (...args) => mockIsArabicTtsAvailable(...args),
}));

// ── Test Data ────────────────────────────────────────────────────────────────

const mockWord = {
  id: 'kitab-01',
  arabic: 'كِتاب',
  english: 'book',
  transliteration: 'kitab',
  category: 'nouns',
  cefrLevel: 'A1',
};

const mockChoices = [
  { label: 'book', value: 'book', correct: true },
  { label: 'pen', value: 'pen', correct: false },
  { label: 'chair', value: 'chair', correct: false },
  { label: 'table', value: 'table', correct: false },
];

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ListeningComprehension', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsArabicTtsAvailable.mockReturnValue(true);
    mockSpeakArabic.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders instruction and 4 choice buttons', () => {
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText('Listen and choose the correct meaning')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    // Speaker button + Replay button + 4 choices = 6
    expect(buttons.length).toBeGreaterThanOrEqual(4);

    // All 4 choice labels should be present
    expect(screen.getByText('book')).toBeTruthy();
    expect(screen.getByText('pen')).toBeTruthy();
    expect(screen.getByText('chair')).toBeTruthy();
    expect(screen.getByText('table')).toBeTruthy();
  });

  it('renders speaker button and replay button when TTS is available', () => {
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByLabelText(/Play Arabic audio|Speaking/)).toBeTruthy();
    expect(screen.getByText('Replay')).toBeTruthy();
  });

  it('calls speakArabic when speaker button is clicked', async () => {
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    // Advance past the auto-play timer
    await vi.advanceTimersByTimeAsync(350);

    vi.clearAllMocks();

    const speakerBtn = screen.getByLabelText(/Play Arabic audio/);
    fireEvent.click(speakerBtn);

    expect(mockSpeakArabic).toHaveBeenCalledWith('كِتاب');
  });

  it('calls onAnswer with selected choice value', () => {
    const mockOnAnswer = vi.fn();
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    fireEvent.click(screen.getByText('pen'));
    expect(mockOnAnswer).toHaveBeenCalledWith('pen');
  });

  it('does not call onAnswer when feedback is present', () => {
    const mockOnAnswer = vi.fn();
    const feedback = { correct: true, selected: 'book', message: 'Correct!' };
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    fireEvent.click(screen.getByText('pen'));
    expect(mockOnAnswer).not.toHaveBeenCalled();
  });

  it('shows green highlight on correct choice when feedback.correct is true', () => {
    const feedback = { correct: true, selected: 'book', message: 'Correct!' };
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    // Use aria-label to target the choice button specifically (avoids duplicate "book" in feedback area)
    const correctButton = screen.getByLabelText(/Choice 1: book/);
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('shows red highlight on wrong selected choice', () => {
    const feedback = { correct: false, selected: 'pen', message: 'Wrong!' };
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    const wrongButton = screen.getByLabelText(/Choice 2: pen/);
    expect(wrongButton.className).toMatch(/choiceWrong/);

    const correctButton = screen.getByLabelText(/Choice 1: book/);
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('disables all choice buttons when feedback is present', () => {
    const feedback = { correct: true, selected: 'book', message: 'Correct!' };
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    // Use aria-labels to target choice buttons specifically
    mockChoices.forEach((c, i) => {
      const btn = screen.getByLabelText(new RegExp(`Choice ${i + 1}: ${c.label}`));
      expect(btn.disabled).toBe(true);
    });
  });

  it('shows feedback area with Arabic and English after answering', () => {
    const feedback = { correct: true, selected: 'book', message: 'Correct!' };
    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText('Correct!')).toBeTruthy();
    // "book" appears in both the choice button and feedbackEnglish div
    const bookElements = screen.getAllByText('book');
    expect(bookElements.length).toBeGreaterThanOrEqual(2);
  });

  // ── TTS Fallback ──────────────────────────────────────────────────────────

  it('shows fallback Arabic text and warning when TTS is unavailable', () => {
    mockIsArabicTtsAvailable.mockReturnValue(false);

    render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText(/Audio not available/)).toBeTruthy();
    // Arabic text should be visible as fallback
    expect(screen.getByText('كِتاب')).toBeTruthy();
    // Speaker button should NOT be present
    expect(screen.queryByLabelText(/Play Arabic audio/)).toBeNull();
  });

  it('cleans up speech on unmount', () => {
    const { unmount } = render(
      <ListeningComprehension
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    unmount();
    expect(mockStopSpeech).toHaveBeenCalled();
  });
});
