/**
 * ConversationPracticeOverlay.test.jsx — Render and interaction tests
 *
 * Tests: overlay renders, browse view, scenario card click, word bank interaction.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import React from 'react';

import ConversationPracticeOverlay from '../ConversationPracticeOverlay.jsx';
import conversationReducer from '../../../store/slices/conversationSlice.js';

function createTestStore(preloadedState = {}) {
  return configureStore({
    reducer: {
      conversation: conversationReducer,
    },
    preloadedState: {
      conversation: {
        completedScenarios: {},
        currentScenarioId: null,
        currentExchangeIndex: 0,
        sessionScore: 0,
        exchangeScores: [],
        stats: {
          totalCompleted: 0,
          averageScore: 0,
          scenariosPerZone: {},
        },
        ...preloadedState,
      },
    },
  });
}

describe('ConversationPracticeOverlay', () => {
  let store;
  const onClose = vi.fn();

  beforeEach(() => {
    store = createTestStore();
    onClose.mockClear();
  });

  it('renders the overlay', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    expect(screen.getByTestId('conversation-overlay')).toBeDefined();
  });

  it('shows browse view by default', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    expect(screen.getByText(/Conversations/)).toBeDefined();
  });

  it('shows scenario cards for the default zone', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    // Oasis Village is the default zone, should show its scenarios
    expect(screen.getByText('Greeting a Scholar')).toBeDefined();
    expect(screen.getByText('Introducing Yourself')).toBeDefined();
  });

  it('shows zone tabs', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    expect(screen.getByText('Oasis Village')).toBeDefined();
    expect(screen.getByText('Ancient Library')).toBeDefined();
    expect(screen.getByText('Desert Marketplace')).toBeDefined();
  });

  it('switches zone when tab is clicked', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Ancient Library'));
    expect(screen.getByText('Asking About Books')).toBeDefined();
  });

  it('shows CEFR filter buttons', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    expect(screen.getByText('All')).toBeDefined();
    // CEFR levels appear both as filter buttons and as scenario card tags
    expect(screen.getAllByText('A1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('A2').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('B1').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('B2').length).toBeGreaterThanOrEqual(1);
  });

  it('filters scenarios by CEFR level', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    // Click B2 filter — use getAllByText since CEFR tags in cards also show "B2"
    const b2Buttons = screen.getAllByText('B2');
    // The filter button is the one in the cefrFilter bar (first occurrence)
    fireEvent.click(b2Buttons[0]);
    // Should show only B2 scenario for oasis-village
    expect(screen.getByText('Describing Your Daily Routine')).toBeDefined();
    // A1 scenario should not be visible
    expect(screen.queryByText('Greeting a Scholar')).toBeNull();
  });

  it('starts a scenario when card is clicked', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Greeting a Scholar'));
    // Should now show active view
    expect(screen.getByText('← Back')).toBeDefined();
    expect(screen.getByText('Greeting a Scholar')).toBeDefined();
  });

  it('shows NPC line in active view', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Greeting a Scholar'));
    // NPC should say the first line
    expect(screen.getByText('السَّلامُ عَلَيْكُم!')).toBeDefined();
    expect(screen.getByText('Peace be upon you!')).toBeDefined();
  });

  it('shows word bank tiles', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Greeting a Scholar'));
    const wordBank = screen.getByTestId('word-bank');
    expect(wordBank).toBeDefined();
    // Should have bank tiles
    expect(screen.getByTestId('bank-tile-0')).toBeDefined();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    const closeBtn = screen.getByText('✕');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows submit button disabled when no words selected', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Greeting a Scholar'));
    const submitBtn = screen.getByText('Submit');
    expect(submitBtn.disabled).toBe(true);
  });

  it('shows grammar hint when hint button is clicked', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Greeting a Scholar'));
    fireEvent.click(screen.getByText('Grammar Hint'));
    expect(
      screen.getByText(/standard reply to as-salaamu alaykum/)
    ).toBeDefined();
  });

  it('adds word to sentence when bank tile is clicked', () => {
    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );
    fireEvent.click(screen.getByText('Greeting a Scholar'));

    // Click first bank tile
    const firstTile = screen.getByTestId('bank-tile-0');
    fireEvent.click(firstTile);

    // Should now have a sentence tile
    expect(screen.getByTestId('sentence-tile-0')).toBeDefined();
  });

  it('shows completion status for completed scenarios', () => {
    store = createTestStore({
      completedScenarios: {
        'oasis_greeting_001': { score: 90, completedAt: Date.now(), attempts: 1 },
      },
      stats: {
        totalCompleted: 1,
        averageScore: 90,
        scenariosPerZone: { 'oasis-village': 1 },
      },
    });

    render(
      <Provider store={store}>
        <ConversationPracticeOverlay onClose={onClose} />
      </Provider>
    );

    expect(screen.getByText('90%')).toBeDefined();
    expect(screen.getByText(/1 \/ 40 completed/)).toBeDefined();
  });
});
