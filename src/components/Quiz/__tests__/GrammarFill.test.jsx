import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GrammarFill from '../GrammarFill.jsx';

// Mock useFormatArabic to return identity function
vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => { const fn = (s) => s; fn.renderArabic = (s) => s; fn.getTashkeelOpacity = () => 1.0; return fn; },
}));

const mockParadigmContext = {
  verb: 'كَتَبَ',
  root: 'ك-ت-ب',
  meaning: 'to write',
  paradigm: 'present',
  pronoun: { en: 'I (أنا)', ar: 'أنا' },
};

const mockOptions = [
  { label: 'أكتب', value: 'أكتب', correct: true,  paradigmContext: mockParadigmContext },
  { label: 'يكتب', value: 'يكتب', correct: false, paradigmContext: mockParadigmContext },
  { label: 'تكتب', value: 'تكتب', correct: false, paradigmContext: mockParadigmContext },
  { label: 'نكتب', value: 'نكتب', correct: false, paradigmContext: mockParadigmContext },
];

const mockWord = { id: 'test1', arabic: 'كلمة', english: 'word' };

describe('GrammarFill', () => {
  it('renders verb root, pronoun, and 4 choice buttons', () => {
    render(
      <GrammarFill
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // Verb root is displayed
    expect(screen.getByText('كَتَبَ')).toBeTruthy();

    // Pronoun Arabic displayed
    expect(screen.getByText('أنا')).toBeTruthy();

    // Pronoun English displayed
    expect(screen.getByText('I (أنا)')).toBeTruthy();

    // 4 choice buttons rendered
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('calls onAnswer with selected conjugated form string', () => {
    const mockOnAnswer = vi.fn();
    render(
      <GrammarFill
        word={mockWord}
        options={mockOptions}
        onAnswer={mockOnAnswer}
        feedback={null}
      />
    );

    // Click the correct form button
    fireEvent.click(screen.getByText('أكتب'));
    expect(mockOnAnswer).toHaveBeenCalledWith('أكتب');
  });

  it('shows green highlight on correct choice when feedback.correct is true', () => {
    const feedback = { correct: true, selected: 'أكتب', correctAnswer: 'أكتب' };
    render(
      <GrammarFill
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    // The correct button should have the correct CSS Module class
    const correctButton = screen.getByText('أكتب');
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('shows red highlight on wrong selected choice when feedback.correct is false', () => {
    const feedback = { correct: false, selected: 'يكتب', correctAnswer: 'أكتب' };
    render(
      <GrammarFill
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    // The selected wrong button should have the wrong CSS Module class
    const wrongButton = screen.getByText('يكتب');
    expect(wrongButton.className).toMatch(/choiceWrong/);

    // The correct answer button should have the correct CSS Module class
    const correctButton = screen.getByText('أكتب');
    expect(correctButton.className).toMatch(/choiceCorrect/);
  });

  it('disables all buttons when feedback is present', () => {
    const feedback = { correct: true, selected: 'أكتب', correctAnswer: 'أكتب' };
    render(
      <GrammarFill
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
  });
});
