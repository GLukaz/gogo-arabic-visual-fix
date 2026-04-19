import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WordOrder from '../WordOrder.jsx';

// Mock useFormatArabic to return identity function
vi.mock('../../../hooks/useFormatArabic.js', () => ({
  useFormatArabic: () => { const fn = (s) => s; fn.renderArabic = (s) => s; fn.getTashkeelOpacity = () => 1.0; return fn; },
}));

const mockWord = { id: 'test1', arabic: 'كلمة', english: 'word' };

const mockOptions = [
  { label: 'كلمة', value: 'كلمة', correct: true, tile: true },
  { label: 'في', value: 'في', correct: false, tile: true },
  { label: 'البيت', value: 'البيت', correct: false, tile: true },
];

describe('WordOrder', () => {
  it('renders tile bank from options array', () => {
    render(
      <WordOrder
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // All 3 tiles should be visible in the bank
    expect(screen.getByText('كلمة')).toBeTruthy();
    expect(screen.getByText('في')).toBeTruthy();
    expect(screen.getByText('البيت')).toBeTruthy();
  });

  it('clicking tile moves it to drop zone', () => {
    render(
      <WordOrder
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // Initially, no Submit button visible (no tiles placed)
    expect(screen.queryByText('Submit')).toBeNull();

    // Click the first tile
    const allTiles = screen.getAllByText('كلمة');
    fireEvent.click(allTiles[0]);

    // Submit button should appear (a tile is placed)
    expect(screen.getByText('Submit')).toBeTruthy();
  });

  it('submit calls onAnswer with joined sentence string', () => {
    const mockOnAnswer = vi.fn();
    render(
      <WordOrder
        word={mockWord}
        options={mockOptions}
        onAnswer={mockOnAnswer}
        feedback={null}
      />
    );

    // Click all tiles in order
    fireEvent.click(screen.getAllByText('كلمة')[0]);
    fireEvent.click(screen.getAllByText('في')[0]);
    fireEvent.click(screen.getAllByText('البيت')[0]);

    // Click submit
    fireEvent.click(screen.getByText('Submit'));

    expect(mockOnAnswer).toHaveBeenCalledWith('كلمة في البيت');
  });

  it('placed tile click returns it to bank', () => {
    render(
      <WordOrder
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={null}
      />
    );

    // Place first tile
    fireEvent.click(screen.getAllByText('كلمة')[0]);

    // Now there are 2 elements with 'كلمة': one in drop zone (enabled), one in bank (disabled/dimmed)
    // The tile in the drop zone is enabled (not disabled), so we click it to return
    const dropZoneTile = screen.getAllByText('كلمة').find((el) => !el.closest('button')?.disabled);
    fireEvent.click(dropZoneTile.closest('button'));

    // After returning, Submit should be gone (no placed tiles)
    expect(screen.queryByText('Submit')).toBeNull();
  });

  it('disables all interaction when feedback is present', () => {
    const feedback = { correct: true, correctAnswer: 'كلمة في البيت' };
    render(
      <WordOrder
        word={mockWord}
        options={mockOptions}
        onAnswer={vi.fn()}
        feedback={feedback}
      />
    );

    // Submit should not be visible when feedback is present
    expect(screen.queryByText('Submit')).toBeNull();

    // All tile bank buttons should be disabled
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn.disabled).toBe(true);
    });
  });
});
