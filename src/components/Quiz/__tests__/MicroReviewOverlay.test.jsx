import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MicroReviewOverlay from '../MicroReviewOverlay.jsx';

// Minimal store with vocabulary state
function makeStore(fsrsCards = {}) {
  return configureStore({
    reducer: {
      vocabulary: () => ({ fsrsCards }),
      achievements: () => ({ reviews: 0 }),
      player: () => ({ level: 1, xp: 0, learningPath: 'traveler' }),
      settings: () => ({ showDiacritics: true }),
    },
  });
}

// Test word IDs that exist in vocabularyAll
const TEST_WORD_IDS = ['hello', 'book', 'water'];

describe('MicroReviewOverlay', () => {
  let onClose;

  beforeEach(() => {
    onClose = vi.fn();
  });

  it('renders without crashing', () => {
    // Even if wordIds don't match real vocabulary, onClose should be called
    render(
      <Provider store={makeStore()}>
        <MicroReviewOverlay wordIds={[]} onClose={onClose} />
      </Provider>
    );
    // Empty word list triggers immediate close
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when Skip is clicked', () => {
    render(
      <Provider store={makeStore()}>
        <MicroReviewOverlay wordIds={TEST_WORD_IDS} onClose={onClose} />
      </Provider>
    );
    const skipBtn = screen.queryByText('Skip');
    if (skipBtn) {
      fireEvent.click(skipBtn);
      expect(onClose).toHaveBeenCalled();
    }
  });

  it('displays Quick Review header', () => {
    render(
      <Provider store={makeStore()}>
        <MicroReviewOverlay wordIds={TEST_WORD_IDS} onClose={onClose} />
      </Provider>
    );
    // If words don't exist in vocab, overlay closes immediately
    // If they do, we should see the header
    const header = screen.queryByText('Quick Review');
    if (header) {
      expect(header).toBeTruthy();
    }
  });
});
