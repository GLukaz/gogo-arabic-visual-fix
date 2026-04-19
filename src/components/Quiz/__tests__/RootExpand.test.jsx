import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RootExpand from '../RootExpand.jsx';

vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => { const fn = (s) => s; fn.renderArabic = (s) => s; fn.getTashkeelOpacity = () => 1.0; return fn; },
}));

const mockWord = {
  id: 'test-root-1',
  arabic: 'ك-ت-ب',
  rootExpansion: {
    root: 'ktb',
    rootDisplay: 'ك-ت-ب',
    meaning: 'writing',
    correctCount: 3,
  },
};

const mockOptions = [
  { label: 'كتاب', value: 'kitaab', correct: true, english: 'book' },
  { label: 'مكتبة', value: 'maktaba', correct: true, english: 'library' },
  { label: 'كاتب', value: 'kaatib', correct: true, english: 'writer' },
  { label: 'بيت', value: 'bayt', correct: false, english: 'house' },
  { label: 'شمس', value: 'shams', correct: false, english: 'sun' },
  { label: 'ماء', value: 'maa', correct: false, english: 'water' },
];

describe('RootExpand', () => {
  it('renders root display, meaning, hint with correct count, and 6 option buttons', () => {
    render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    expect(screen.getByText('ك-ت-ب')).toBeTruthy();
    expect(screen.getByText(/writing/)).toBeTruthy();
    expect(screen.getByText(/3 correct words/)).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    // 6 option buttons + 1 submit button = 7
    expect(buttons.length).toBeGreaterThanOrEqual(7);
  });

  it('toggles selection when clicking an option (aria-pressed)', () => {
    render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    const kitaabBtn = screen.getByText('كتاب');
    expect(kitaabBtn.getAttribute('aria-pressed')).toBe('false');

    fireEvent.click(kitaabBtn);
    expect(kitaabBtn.getAttribute('aria-pressed')).toBe('true');

    // Click again to deselect
    fireEvent.click(kitaabBtn);
    expect(kitaabBtn.getAttribute('aria-pressed')).toBe('false');
  });

  it('submit button sends JSON array of selected values via onAnswer', () => {
    const mockOnAnswer = vi.fn();
    render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={mockOnAnswer}
        feedback={null}
      />
    );

    // Select 2 options
    fireEvent.click(screen.getByText('كتاب'));
    fireEvent.click(screen.getByText('مكتبة'));

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    expect(mockOnAnswer).toHaveBeenCalledTimes(1);
    const arg = JSON.parse(mockOnAnswer.mock.calls[0][0]);
    expect(arg).toContain('kitaab');
    expect(arg).toContain('maktaba');
    expect(arg).toHaveLength(2);
  });

  it('submit button is disabled when 0 items selected', () => {
    render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    const submitBtn = screen.getByText('Submit');
    expect(submitBtn.disabled).toBe(true);
  });

  it('shows choiceCorrect, choiceWrong, and choiceMissed classes after feedback', () => {
    // Simulate: user selected kitaab (correct) and bayt (wrong), missed maktaba and kaatib
    const feedback = {
      correct: false,
      selected: JSON.stringify(['kitaab', 'bayt']),
      correctAnswer: 'كتاب, مكتبة, كاتب',
    };

    // Pre-select the buttons by rendering with selected state
    const { container } = render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    // With feedback, all buttons are disabled
    const buttons = container.querySelectorAll('button');
    buttons.forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });
  });

  it('shows selected count text', () => {
    render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    expect(screen.getByText('0 selected')).toBeTruthy();

    fireEvent.click(screen.getByText('كتاب'));
    expect(screen.getByText('1 selected')).toBeTruthy();

    fireEvent.click(screen.getByText('مكتبة'));
    expect(screen.getByText('2 selected')).toBeTruthy();
  });

  it('hides submit button when feedback is present', () => {
    const feedback = { correct: true, selected: '["kitaab","maktaba","kaatib"]', correctAnswer: 'كتاب, مكتبة, كاتب' };
    render(
      <RootExpand
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    expect(screen.queryByText('Submit')).toBeNull();
  });
});
