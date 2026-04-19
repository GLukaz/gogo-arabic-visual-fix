import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent, act } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import GiftOverlay from '../GiftOverlay.jsx';

// ─── Test gift data ───
// These must match IDs that exist in src/data/gifts.js
const TEST_NPC_ID = 'scholar-yusuf';
const TEST_NPC_NAME = 'Scholar Yusuf';
const TEST_NPC_NAME_ARABIC = 'الشَّيْخ يوسُف';

// gift_figs is loved by scholar-yusuf (delta=20)
const GIFT_LOVED_ID = 'gift_figs';
// gift_olives is neutral for scholar-yusuf (delta=5)
const GIFT_NEUTRAL_ID = 'gift_olives';

describe('GiftOverlay', () => {
  let onClose;
  let onGift;

  beforeEach(() => {
    onClose = vi.fn();
    onGift = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function renderOverlay(props = {}, preloadedState = {}) {
    const state = {
      inventory: {
        equipped: {
          headCovering: null, robe: null, cloak: null, belt: null,
          boots: null, gloves: null, accessory1: null, accessory2: null,
        },
        items: [
          { itemId: GIFT_LOVED_ID, quantity: 3, locked: false },
          { itemId: GIFT_NEUTRAL_ID, quantity: 1, locked: false },
          { itemId: 'some_equipment_item', quantity: 1, locked: false }, // non-gift item
        ],
        affixesUnlocked: [],
        enchantments: {},
      },
      npc: {
        dialogueState: {},
        friendship: { [TEST_NPC_ID]: 50 },
        giftsGiven: { [TEST_NPC_ID]: [] },
      },
      ...preloadedState,
    };

    return renderWithProviders(
      <GiftOverlay
        npcId={TEST_NPC_ID}
        npcName={TEST_NPC_NAME}
        npcNameArabic={TEST_NPC_NAME_ARABIC}
        npcPortrait={null}
        onClose={onClose}
        onGift={onGift}
        {...props}
      />,
      { preloadedState: state }
    );
  }

  // ─── Rendering ───

  it('renders the overlay with NPC name and Arabic name', () => {
    renderOverlay();
    expect(screen.getByText(TEST_NPC_NAME)).toBeTruthy();
    expect(screen.getByText(TEST_NPC_NAME_ARABIC)).toBeTruthy();
  });

  it('renders a portrait placeholder when no portrait is provided', () => {
    renderOverlay();
    // Placeholder shows first letter of name
    expect(screen.getByText('S')).toBeTruthy();
  });

  it('renders the friendship bar with correct tier', () => {
    renderOverlay();
    const tierBadge = screen.getByTestId('tier-badge');
    expect(tierBadge.textContent).toBe('Friendly');
  });

  it('renders friendship value text', () => {
    renderOverlay();
    expect(screen.getByText('50')).toBeTruthy();
  });

  // ─── Gift Grid ───

  it('shows only giftable items (filters out non-gift inventory items)', () => {
    renderOverlay();
    const grid = screen.getByTestId('gift-grid');
    // Should have 2 gift cards (gift_figs and gift_olives), NOT the equipment item
    const cards = grid.querySelectorAll('button');
    expect(cards.length).toBe(2);
  });

  it('shows empty state when no giftable items exist', () => {
    renderOverlay({}, {
      inventory: {
        equipped: {
          headCovering: null, robe: null, cloak: null, belt: null,
          boots: null, gloves: null, accessory1: null, accessory2: null,
        },
        items: [],
        affixesUnlocked: [],
        enchantments: {},
      },
    });
    expect(screen.getByTestId('empty-state')).toBeTruthy();
  });

  it('displays gift name, Arabic name, value, and quantity', () => {
    renderOverlay();
    // gift_figs has name "Dried Figs"
    expect(screen.getByText('Dried Figs')).toBeTruthy();
    // Arabic name
    expect(screen.getByText('تِين مُجَفَّف')).toBeTruthy();
    // Quantity
    expect(screen.getByText('x3')).toBeTruthy();
  });

  // ─── Gift Selection ───

  it('selects a gift when clicked', () => {
    renderOverlay();
    const card = screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`);
    fireEvent.click(card);
    // Detail panel should appear
    expect(screen.getByTestId('detail-panel')).toBeTruthy();
  });

  it('deselects a gift when clicked again', () => {
    renderOverlay();
    const card = screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`);
    fireEvent.click(card);
    expect(screen.getByTestId('detail-panel')).toBeTruthy();
    fireEvent.click(card);
    expect(screen.queryByTestId('detail-panel')).toBeNull();
  });

  it('shows expected reaction text in detail panel for loved gift', () => {
    renderOverlay();
    const card = screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`);
    fireEvent.click(card);
    // Friendship is 50 so preferences are revealed; gift_figs is loved by scholar-yusuf
    expect(screen.getByText('They will love this!')).toBeTruthy();
  });

  // ─── Preference Indicators ───

  it('shows preference indicators when friendship >= 50', () => {
    renderOverlay();
    // At friendship 50, all preferences are revealed
    const pref = screen.getByTestId(`pref-${GIFT_LOVED_ID}`);
    expect(pref).toBeTruthy();
  });

  it('hides preference indicators when friendship < 50 and category not given before', () => {
    renderOverlay({}, {
      npc: {
        dialogueState: {},
        friendship: { [TEST_NPC_ID]: 30 },
        giftsGiven: { [TEST_NPC_ID]: [] },
      },
    });
    // No gifts given in food category, so preference should be hidden
    expect(screen.queryByTestId(`pref-${GIFT_LOVED_ID}`)).toBeNull();
  });

  // ─── Give Gift Flow ───

  it('dispatches giveNpcGift and removeItem when Give Gift is clicked', () => {
    const { store } = renderOverlay();

    // Select a gift
    fireEvent.click(screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`));
    // Click give
    fireEvent.click(screen.getByTestId('give-btn'));

    const state = store.getState();
    // Gift should be recorded
    expect(state.npc.giftsGiven[TEST_NPC_ID]).toContain(GIFT_LOVED_ID);
    // Quantity should decrease
    const item = state.inventory.items.find((i) => i.itemId === GIFT_LOVED_ID);
    expect(item.quantity).toBe(2); // was 3
  });

  it('calls onGift callback with correct data', () => {
    renderOverlay();
    fireEvent.click(screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`));
    fireEvent.click(screen.getByTestId('give-btn'));

    expect(onGift).toHaveBeenCalledWith({
      giftId: GIFT_LOVED_ID,
      delta: 20, // loved by scholar-yusuf
      reactionType: 'loved',
    });
  });

  // ─── Reaction Display ───

  it('shows reaction overlay after giving a gift', () => {
    renderOverlay();
    fireEvent.click(screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`));
    fireEvent.click(screen.getByTestId('give-btn'));

    const reactionOverlay = screen.getByTestId('reaction-overlay');
    expect(reactionOverlay).toBeTruthy();
    // Loved reaction Arabic text
    expect(screen.getByText('شكراً جزيلاً! أحبّ هذا!')).toBeTruthy();
  });

  it('auto-dismisses reaction after 2 seconds', () => {
    renderOverlay();
    fireEvent.click(screen.getByTestId(`gift-card-${GIFT_LOVED_ID}`));
    fireEvent.click(screen.getByTestId('give-btn'));

    expect(screen.getByTestId('reaction-overlay')).toBeTruthy();

    // Advance past 2 seconds, wrapped in act for state update
    act(() => {
      vi.advanceTimersByTime(2100);
    });

    expect(screen.queryByTestId('reaction-overlay')).toBeNull();
  });

  // ─── Close Behavior ───

  it('calls onClose when close button is clicked', () => {
    renderOverlay();
    fireEvent.click(screen.getByTestId('gift-close-btn'));
    expect(onClose).toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', () => {
    renderOverlay();
    fireEvent.click(screen.getByTestId('gift-overlay-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });

  // ─── Cold tier display ───

  it('shows Cold tier badge for friendship < 25', () => {
    renderOverlay({}, {
      npc: {
        dialogueState: {},
        friendship: { [TEST_NPC_ID]: 10 },
        giftsGiven: {},
      },
    });
    const tierBadge = screen.getByTestId('tier-badge');
    expect(tierBadge.textContent).toBe('Cold');
  });

  // ─── Locked items ───

  it('does not show locked items in gift grid', () => {
    renderOverlay({}, {
      inventory: {
        equipped: {
          headCovering: null, robe: null, cloak: null, belt: null,
          boots: null, gloves: null, accessory1: null, accessory2: null,
        },
        items: [
          { itemId: GIFT_LOVED_ID, quantity: 1, locked: true },
          { itemId: GIFT_NEUTRAL_ID, quantity: 1, locked: false },
        ],
        affixesUnlocked: [],
        enchantments: {},
      },
    });
    const grid = screen.getByTestId('gift-grid');
    const cards = grid.querySelectorAll('button');
    // Only gift_olives should show (gift_figs is locked)
    expect(cards.length).toBe(1);
  });
});
