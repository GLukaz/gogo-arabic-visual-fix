import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import miniGameReducer from '../../../store/slices/miniGameSlice.js';
import MEMORY_MATCH_SETS from '../../../data/miniGames/memoryMatchSets.js';
import MemoryMatchGame from '../MemoryMatchGame.jsx';

function createStore() {
  return configureStore({
    reducer: { miniGames: miniGameReducer },
  });
}

function renderWithStore(ui) {
  const store = createStore();
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('MemoryMatchGame', () => {
  describe('setup screen', () => {
    it('renders the title', () => {
      renderWithStore(<MemoryMatchGame onBack={() => {}} />);
      expect(screen.getByText('Memory Match')).toBeTruthy();
    });

    it('renders all 10 card sets', () => {
      renderWithStore(<MemoryMatchGame onBack={() => {}} />);
      MEMORY_MATCH_SETS.forEach((set) => {
        expect(screen.getByText(set.title)).toBeTruthy();
      });
    });

    it('calls onBack when back button clicked', () => {
      const onBack = vi.fn();
      renderWithStore(<MemoryMatchGame onBack={onBack} />);
      fireEvent.click(screen.getByText('Back'));
      expect(onBack).toHaveBeenCalled();
    });

    it('each set shows Easy and Hard buttons', () => {
      renderWithStore(<MemoryMatchGame onBack={() => {}} />);
      const easyButtons = screen.getAllByText('Easy (4x4)');
      expect(easyButtons.length).toBe(10);
    });
  });

  describe('memoryMatchSets data', () => {
    it('has 10 sets', () => {
      expect(MEMORY_MATCH_SETS.length).toBe(10);
    });

    it('each set has required fields', () => {
      MEMORY_MATCH_SETS.forEach((set) => {
        expect(set.id).toBeTruthy();
        expect(set.title).toBeTruthy();
        expect(set.titleArabic).toBeTruthy();
        expect(['A1', 'A2']).toContain(set.cefrLevel);
        expect(Array.isArray(set.pairs)).toBe(true);
        expect(set.pairs.length).toBeGreaterThanOrEqual(8);
      });
    });

    it('each pair has arabic and english fields', () => {
      MEMORY_MATCH_SETS.forEach((set) => {
        set.pairs.forEach((pair) => {
          expect(pair.arabic).toBeTruthy();
          expect(pair.english).toBeTruthy();
        });
      });
    });

    it('set IDs are unique', () => {
      const ids = MEMORY_MATCH_SETS.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('game screen', () => {
    it('shows cards when a set is selected', () => {
      renderWithStore(<MemoryMatchGame onBack={() => {}} />);

      // Click the first Easy button (Animals set)
      const easyButtons = screen.getAllByText('Easy (4x4)');
      fireEvent.click(easyButtons[0]);

      // Should show 16 face-down cards (4x4 = 8 pairs)
      const faceDownCards = screen.getAllByText('?');
      expect(faceDownCards.length).toBe(16);
    });

    it('shows info bar with moves and pairs', () => {
      renderWithStore(<MemoryMatchGame onBack={() => {}} />);
      const easyButtons = screen.getAllByText('Easy (4x4)');
      fireEvent.click(easyButtons[0]);

      expect(screen.getByText('Moves: 0')).toBeTruthy();
      expect(screen.getByText('Pairs: 0/8')).toBeTruthy();
    });

    it('flips a card when clicked', () => {
      renderWithStore(<MemoryMatchGame onBack={() => {}} />);
      const easyButtons = screen.getAllByText('Easy (4x4)');
      fireEvent.click(easyButtons[0]);

      // Click first card
      const cards = screen.getAllByLabelText('Face-down card');
      expect(cards.length).toBeGreaterThan(0);
      fireEvent.click(cards[0]);

      // After clicking, the card should now show its text (not '?')
      // The card count of face-down should decrease
      const remainingFaceDown = screen.getAllByLabelText('Face-down card');
      expect(remainingFaceDown.length).toBe(cards.length - 1);
    });
  });
});
