import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CulturalContext from '../CulturalContext.jsx';

vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => { const fn = (s) => s; fn.renderArabic = (s) => s; fn.getTashkeelOpacity = () => 1.0; return fn; },
}));

const mockWord = {
  id: 'test-cultural-1',
  arabic: 'إن شاء الله',
  culturalItem: {
    expression: 'إن شاء الله',
    transliteration: 'inshallah',
    correctContext: 'future_plans',
    explanation: 'Used when discussing future plans or hopes, meaning "God willing".',
  },
};

const mockOptions = [
  { label: 'When discussing future plans', value: 'future_plans', correct: true },
  { label: 'When greeting someone', value: 'greeting', correct: false },
  { label: 'When saying goodbye', value: 'farewell', correct: false },
  { label: 'When apologizing', value: 'apology', correct: false },
];

describe('CulturalContext', () => {
  it('renders expression, transliteration, and 4 context choice buttons', () => {
    render(
      <CulturalContext
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    expect(screen.getByText('إن شاء الله')).toBeTruthy();
    expect(screen.getByText('inshallah')).toBeTruthy();
    expect(screen.getByText('When is this expression used?')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('calls onAnswer with the selected context value', () => {
    const mockOnAnswer = vi.fn();
    render(
      <CulturalContext
        word={mockWord}
        options={mockOptions}
        onAnswer={mockOnAnswer}
        feedback={null}
      />
    );

    fireEvent.click(screen.getByText('When discussing future plans'));
    expect(mockOnAnswer).toHaveBeenCalledWith('future_plans');
  });

  it('shows choiceCorrect class on correct answer when feedback.correct is true', () => {
    const feedback = { correct: true, selected: 'future_plans', correctAnswer: 'future_plans' };
    render(
      <CulturalContext
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    const correctButton = screen.getByText('When discussing future plans');
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('shows choiceWrong class on wrong selected choice when feedback.correct is false', () => {
    const feedback = { correct: false, selected: 'greeting', correctAnswer: 'future_plans' };
    render(
      <CulturalContext
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    const wrongButton = screen.getByText('When greeting someone');
    expect(wrongButton.className).toMatch(/choiceWrong/);

    const correctButton = screen.getByText('When discussing future plans');
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('disables all buttons and shows explanation when feedback is present', () => {
    const feedback = { correct: true, selected: 'future_plans', correctAnswer: 'future_plans' };
    render(
      <CulturalContext
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

    expect(screen.getByText(/God willing/)).toBeTruthy();
  });
});
