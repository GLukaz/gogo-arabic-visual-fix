import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import miniGameReducer from '../../../store/slices/miniGameSlice.js';
import MiniGameHub from '../MiniGameHub.jsx';

function createStore() {
  return configureStore({
    reducer: { miniGames: miniGameReducer },
  });
}

function renderWithStore(ui) {
  const store = createStore();
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('MiniGameHub', () => {
  it('renders the hub title', () => {
    renderWithStore(<MiniGameHub onSelectGame={() => {}} />);
    expect(screen.getByText('Mini-Games')).toBeTruthy();
  });

  it('renders all 4 game cards', () => {
    renderWithStore(<MiniGameHub onSelectGame={() => {}} />);
    expect(screen.getByText('Word Search')).toBeTruthy();
    expect(screen.getByText('Crossword')).toBeTruthy();
    expect(screen.getByText('Number Challenge')).toBeTruthy();
    expect(screen.getByText('Memory Match')).toBeTruthy();
  });

  it('renders Arabic titles for each game', () => {
    renderWithStore(<MiniGameHub onSelectGame={() => {}} />);
    expect(screen.getByText('البحث عن الكلمات')).toBeTruthy();
    expect(screen.getByText('كلمات متقاطعة')).toBeTruthy();
    expect(screen.getByText('تحدي الارقام')).toBeTruthy();
    expect(screen.getByText('لعبة الذاكرة')).toBeTruthy();
  });

  it('calls onSelectGame with game id when card is clicked', () => {
    const onSelect = vi.fn();
    renderWithStore(<MiniGameHub onSelectGame={onSelect} />);

    fireEvent.click(screen.getByText('Word Search'));
    expect(onSelect).toHaveBeenCalledWith('wordSearchNew');
  });

  it('shows stats bar with initial values', () => {
    renderWithStore(<MiniGameHub onSelectGame={() => {}} />);
    expect(screen.getByText('Games Played')).toBeTruthy();
    expect(screen.getByText('Favorite Game')).toBeTruthy();
  });

  it('renders back button when onBack is provided', () => {
    const onBack = vi.fn();
    renderWithStore(<MiniGameHub onSelectGame={() => {}} onBack={onBack} />);
    const btn = screen.getByText('Back');
    fireEvent.click(btn);
    expect(onBack).toHaveBeenCalled();
  });

  it('does not render back button when onBack is not provided', () => {
    renderWithStore(<MiniGameHub onSelectGame={() => {}} />);
    expect(screen.queryByText('Back')).toBeNull();
  });
});
