import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import DialectIdentify from '../DialectIdentify.jsx';

vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => { const fn = (s) => s; fn.renderArabic = (s) => s; fn.getTashkeelOpacity = () => 1.0; return fn; },
}));

const mockWord = {
  id: 'test-dialect-1',
  arabic: 'إزيك',
  dialectItem: {
    phrase: 'إزيك',
    transliteration: 'izzayyak',
    english: 'How are you?',
    dialect: 'Egyptian',
    explanation: 'This is Egyptian Arabic for "How are you?"',
  },
};

const mockOptions = [
  { label: 'MSA', value: 'MSA', correct: false },
  { label: 'Egyptian', value: 'Egyptian', correct: true },
  { label: 'Levantine', value: 'Levantine', correct: false },
  { label: 'Gulf', value: 'Gulf', correct: false },
];

describe('DialectIdentify', () => {
  it('renders phrase, transliteration, meaning, and 4 dialect choice buttons', () => {
    render(
      <DialectIdentify
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    expect(screen.getByText('إزيك')).toBeTruthy();
    expect(screen.getByText('izzayyak')).toBeTruthy();
    expect(screen.getByText('How are you?')).toBeTruthy();
    expect(screen.getByText('Which dialect is this phrase?')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('calls onAnswer with the selected dialect value', () => {
    const mockOnAnswer = vi.fn();
    render(
      <DialectIdentify
        word={mockWord}
        options={mockOptions}
        onAnswer={mockOnAnswer}
        feedback={null}
      />
    );

    fireEvent.click(screen.getByText('Egyptian'));
    expect(mockOnAnswer).toHaveBeenCalledWith('Egyptian');
  });

  it('shows choiceCorrect class on correct answer when feedback.correct is true', () => {
    const feedback = { correct: true, selected: 'Egyptian', correctAnswer: 'Egyptian' };
    render(
      <DialectIdentify
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    const correctButton = screen.getByText('Egyptian');
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('shows choiceWrong class on wrong selected choice when feedback.correct is false', () => {
    const feedback = { correct: false, selected: 'Gulf', correctAnswer: 'Egyptian' };
    render(
      <DialectIdentify
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    const wrongButton = screen.getByText('Gulf');
    expect(wrongButton.className).toMatch(/choiceWrong/);

    const correctButton = screen.getByText('Egyptian');
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('disables all buttons and shows explanation when feedback is present', () => {
    const feedback = { correct: true, selected: 'Egyptian', correctAnswer: 'Egyptian' };
    render(
      <DialectIdentify
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });

    expect(screen.getByText('This is Egyptian Arabic for "How are you?"')).toBeTruthy();
  });
});
