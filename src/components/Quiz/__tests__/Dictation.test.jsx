import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dictation, { stripTashkeel, normalizeAlef, normalizeArabic } from '../Dictation.jsx';

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
  arabic: 'كِتَاب',
  english: 'book',
  transliteration: 'kitaab',
  category: 'nouns',
  cefrLevel: 'A1',
};

const mockChoices = []; // Dictation doesn't use choices

// ── Normalization Unit Tests ─────────────────────────────────────────────────

describe('Arabic normalization helpers', () => {
  describe('stripTashkeel', () => {
    it('removes fathah, kasrah, dammah', () => {
      expect(stripTashkeel('كِتَاب')).toBe('كتاب');
    });

    it('removes tanween', () => {
      // tanween fatha ً, kasra ٍ, damma ٌ
      expect(stripTashkeel('كِتَابًا')).toBe('كتابا');
    });

    it('removes shadda', () => {
      expect(stripTashkeel('شَدَّة')).toBe('شدة');
    });

    it('removes superscript alef (U+0670)', () => {
      expect(stripTashkeel('هٰذا')).toBe('هذا');
    });

    it('returns unchanged text without diacritics', () => {
      expect(stripTashkeel('كتاب')).toBe('كتاب');
    });

    it('handles empty string', () => {
      expect(stripTashkeel('')).toBe('');
    });
  });

  describe('normalizeAlef', () => {
    it('normalizes alef with hamza above (أ) to bare alef', () => {
      expect(normalizeAlef('أحمد')).toBe('احمد');
    });

    it('normalizes alef with hamza below (إ) to bare alef', () => {
      expect(normalizeAlef('إسلام')).toBe('اسلام');
    });

    it('normalizes alef with madda (آ) to bare alef', () => {
      expect(normalizeAlef('آمين')).toBe('امين');
    });

    it('normalizes multiple alef variants', () => {
      expect(normalizeAlef('أإآ')).toBe('ااا');
    });

    it('leaves bare alef unchanged', () => {
      expect(normalizeAlef('ا')).toBe('ا');
    });
  });

  describe('normalizeArabic', () => {
    it('strips tashkeel and normalizes alef', () => {
      expect(normalizeArabic('كِتَاب')).toBe('كتاب');
    });

    it('normalizes أ and strips diacritics together', () => {
      expect(normalizeArabic('أَحْمَد')).toBe('احمد');
    });

    it('trims whitespace', () => {
      expect(normalizeArabic('  كتاب  ')).toBe('كتاب');
    });

    it('handles text with both tashkeel and alef variants', () => {
      expect(normalizeArabic('إِسْلَام')).toBe('اسلام');
    });

    it('returns empty string for whitespace-only input', () => {
      expect(normalizeArabic('   ')).toBe('');
    });
  });
});

// ── Component Tests ──────────────────────────────────────────────────────────

describe('Dictation component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsArabicTtsAvailable.mockReturnValue(true);
    mockSpeakArabic.mockResolvedValue(undefined);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders instruction, input field, and submit button', () => {
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText('Type what you hear in Arabic')).toBeTruthy();
    expect(screen.getByLabelText('Type Arabic here')).toBeTruthy();
    expect(screen.getByLabelText('Submit answer')).toBeTruthy();
  });

  it('renders speaker and replay buttons when TTS is available', () => {
    render(
      <Dictation
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

  it('allows typing Arabic text in the input field', () => {
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');
    fireEvent.change(input, { target: { value: 'كتاب' } });
    expect(input.value).toBe('كتاب');
  });

  it('calls onAnswer with trimmed input on submit', () => {
    const mockOnAnswer = vi.fn();
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');
    fireEvent.change(input, { target: { value: '  كتاب  ' } });
    fireEvent.click(screen.getByLabelText('Submit answer'));

    expect(mockOnAnswer).toHaveBeenCalledWith('كتاب');
  });

  it('calls onAnswer on Enter key press', () => {
    const mockOnAnswer = vi.fn();
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');
    fireEvent.change(input, { target: { value: 'كتاب' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(mockOnAnswer).toHaveBeenCalledWith('كتاب');
  });

  it('does not submit when input is empty', () => {
    const mockOnAnswer = vi.fn();
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    fireEvent.click(screen.getByLabelText('Submit answer'));
    expect(mockOnAnswer).not.toHaveBeenCalled();
  });

  it('submit button is disabled when input is empty', () => {
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const submitBtn = screen.getByLabelText('Submit answer');
    expect(submitBtn.disabled).toBe(true);
  });

  it('does not submit when feedback is already present', () => {
    const mockOnAnswer = vi.fn();
    const feedback = { correct: true, selected: 'كتاب', correctAnswer: 'كتاب' };
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    // Submit button should not be rendered when feedback is present
    expect(screen.queryByLabelText('Submit answer')).toBeNull();
  });

  it('disables input when feedback is present', () => {
    const feedback = { correct: true, selected: 'كتاب', correctAnswer: 'كتاب' };
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');
    expect(input.disabled).toBe(true);
  });

  // ── Feedback display ──────────────────────────────────────────────────────

  it('shows correct feedback styling on correct answer', () => {
    const feedback = { correct: true, selected: 'كتاب', correctAnswer: 'كتاب' };
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText('Correct!')).toBeTruthy();
    const input = screen.getByLabelText('Type Arabic here');
    expect(input.className).toMatch(/arabicInputCorrect/);
  });

  it('shows incorrect feedback with correct answer on wrong answer', () => {
    const feedback = { correct: false, selected: 'كلمة', correctAnswer: 'كتاب' };
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={feedback}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText('Incorrect')).toBeTruthy();
    expect(screen.getByText('Correct answer:')).toBeTruthy();
    const input = screen.getByLabelText('Type Arabic here');
    expect(input.className).toMatch(/arabicInputWrong/);
  });

  // ── Hint system ───────────────────────────────────────────────────────────

  it('does not show hint button before 2 failed attempts', () => {
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    expect(screen.queryByText('Show Hint')).toBeNull();
  });

  it('shows hint button after 2 failed submit attempts', () => {
    const mockOnAnswer = vi.fn();
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');

    // First wrong attempt
    fireEvent.change(input, { target: { value: 'خطأ' } });
    fireEvent.click(screen.getByLabelText('Submit answer'));

    // Second wrong attempt
    fireEvent.change(input, { target: { value: 'غلط' } });
    fireEvent.click(screen.getByLabelText('Submit answer'));

    expect(screen.getByText('Show Hint')).toBeTruthy();
  });

  it('shows transliteration when hint button is clicked', () => {
    const mockOnAnswer = vi.fn();
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={mockOnAnswer}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');

    // Trigger 2 failed attempts to show hint button
    fireEvent.change(input, { target: { value: 'خطأ' } });
    fireEvent.click(screen.getByLabelText('Submit answer'));
    fireEvent.change(input, { target: { value: 'غلط' } });
    fireEvent.click(screen.getByLabelText('Submit answer'));

    // Click hint button
    fireEvent.click(screen.getByText('Show Hint'));

    expect(screen.getByText(/kitaab/)).toBeTruthy();
  });

  // ── TTS Fallback ──────────────────────────────────────────────────────────

  it('shows fallback Arabic text and warning when TTS is unavailable', () => {
    mockIsArabicTtsAvailable.mockReturnValue(false);

    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    expect(screen.getByText(/Audio not available/)).toBeTruthy();
    expect(screen.queryByLabelText(/Play Arabic audio/)).toBeNull();
  });

  // ── TTS interaction ───────────────────────────────────────────────────────

  it('calls speakArabic when speaker button is clicked', async () => {
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    // Advance past auto-play timer
    await vi.advanceTimersByTimeAsync(350);
    vi.clearAllMocks();

    const speakerBtn = screen.getByLabelText(/Play Arabic audio/);
    fireEvent.click(speakerBtn);

    expect(mockSpeakArabic).toHaveBeenCalledWith('كِتَاب');
  });

  it('cleans up speech on unmount', () => {
    const { unmount } = render(
      <Dictation
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

  // ── Input RTL ─────────────────────────────────────────────────────────────

  it('input field has dir="rtl" attribute', () => {
    render(
      <Dictation
        word={mockWord}
        choices={mockChoices}
        onAnswer={vi.fn()}
        feedback={null}
        renderArabic={(s) => s}
      />
    );

    const input = screen.getByLabelText('Type Arabic here');
    expect(input.getAttribute('dir')).toBe('rtl');
  });
});
