import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ClozePassage from '../ClozePassage.jsx';

// Mock useFormatArabic to return identity function
vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => { const fn = (s) => s; fn.renderArabic = (s) => s; fn.getTashkeelOpacity = () => 1.0; return fn; },
}));

const mockWord = {
  id: 'test1',
  arabic: 'كتاب',
  english: 'book',
  exampleSentence: {
    arabic: 'أقرأ كتاب كل يوم',
    english: 'I read a book every day',
  },
};

const mockOptions = [
  { label: 'كتاب', value: 'كتاب', correct: true },
  { label: 'قلم', value: 'قلم', correct: false },
  { label: 'بيت', value: 'بيت', correct: false },
  { label: 'ماء', value: 'ماء', correct: false },
];

describe('ClozePassage', () => {
  it('renders passage text with blank placeholder', () => {
    render(
      <ClozePassage
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // Blank placeholder should be visible in the passage
    expect(screen.getByText('______')).toBeTruthy();
  });

  it('renders 4 Arabic word choices', () => {
    render(
      <ClozePassage
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // All 4 choice buttons should be visible
    expect(screen.getByText('كتاب')).toBeTruthy();
    expect(screen.getByText('قلم')).toBeTruthy();
    expect(screen.getByText('بيت')).toBeTruthy();
    expect(screen.getByText('ماء')).toBeTruthy();

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });

  it('calls onAnswer with selected choice value', () => {
    const mockOnAnswer = vi.fn();
    render(
      <ClozePassage
        word={mockWord}
        options={mockOptions}
        onAnswer={mockOnAnswer}
        feedback={null}
      />
    );

    // Click a choice
    fireEvent.click(screen.getByText('كتاب'));
    expect(mockOnAnswer).toHaveBeenCalledWith('كتاب');
  });

  it('falls back gracefully when exampleSentence is absent', () => {
    const wordNoSentence = {
      id: 'test2',
      arabic: 'قلم',
      english: 'pen',
    };

    // Should render without crashing
    render(
      <ClozePassage
        word={wordNoSentence}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // Blank placeholder should still be visible
    expect(screen.getByText('______')).toBeTruthy();
  });

  it('disables all choice buttons when feedback is present', () => {
    const feedback = { correct: true, selected: 'كتاب', correctAnswer: 'كتاب' };
    render(
      <ClozePassage
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
