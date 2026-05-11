/**
 * StatusEffectBar.test.jsx — Render tests for StatusEffectBar component (Phase 55)
 *
 * Tests: empty-effects no-render, non-empty render, overflow badge.
 * framer-motion is replaced with static equivalents to keep tests synchronous.
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// ── Mock framer-motion — replace animated elements with plain HTML ─────────
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, onMouseEnter, onMouseLeave, ..._rest }) => (
      <div
        className={className}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// ── Mock statusEffects data module ─────────────────────────────────────────
vi.mock('../../../data/statusEffects.js', () => ({
  getStatusEffect: vi.fn((id) => {
    if (id === 'burn') {
      return {
        arabic: 'نار',
        transliteration: 'nar',
        english: 'Burn',
        description: 'Deals fire damage each turn.',
        type: 'debuff',
        turns: 3,
      };
    }
    if (id === 'shield') {
      return {
        arabic: 'درع',
        transliteration: 'dir',
        english: 'Shield',
        description: 'Reduces incoming damage.',
        type: 'buff',
        turns: 3,
      };
    }
    return null;
  }),
  COMPOUND_EFFECTS: {},
}));

// ── Import component under test (after mocks) ─────────────────────────────
import StatusEffectBar from '../StatusEffectBar.jsx';

// ── Tests ──────────────────────────────────────────────────────────────────

describe('StatusEffectBar', () => {
  it('renders nothing when effects array is empty', () => {
    const { container } = render(
      <StatusEffectBar effects={[]} target="player" />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when effects prop is null/undefined', () => {
    const { container: c1 } = render(
      <StatusEffectBar effects={null} target="player" />
    );
    expect(c1.firstChild).toBeNull();

    const { container: c2 } = render(
      <StatusEffectBar effects={undefined} target="player" />
    );
    expect(c2.firstChild).toBeNull();
  });

  it('renders a container element when effects array is non-empty', () => {
    const { container } = render(
      <StatusEffectBar
        effects={[{ id: 'burn', remainingTurns: 2 }]}
        target="player"
      />
    );
    expect(container.firstChild).not.toBeNull();
  });

  it('renders an icon for a known effect', () => {
    render(
      <StatusEffectBar
        effects={[{ id: 'burn', remainingTurns: 2 }]}
        target="player"
      />
    );
    // EffectIcon renders the Arabic label — 'نار' sliced to 3 chars is still 'نار'
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders multiple icons for multiple known effects', () => {
    render(
      <StatusEffectBar
        effects={[
          { id: 'burn', remainingTurns: 3 },
          { id: 'shield', remainingTurns: 1 },
        ]}
        target="player"
      />
    );
    // Both effects have turn counts rendered
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows overflow badge when effects exceed maxVisible', () => {
    // 7 burn effects with maxVisible=5 → +2 overflow
    const effects = Array.from({ length: 7 }, (_, i) => ({
      id: 'burn',
      remainingTurns: i + 1,
    }));
    render(
      <StatusEffectBar effects={effects} target="player" maxVisible={5} />
    );
    expect(screen.getByText('+2')).toBeInTheDocument();
  });

  it('shows no overflow badge when effects are within maxVisible', () => {
    const effects = Array.from({ length: 3 }, (_, i) => ({
      id: 'burn',
      remainingTurns: i + 1,
    }));
    render(
      <StatusEffectBar effects={effects} target="player" maxVisible={5} />
    );
    // No element with '+N' pattern
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
  });

  it('default maxVisible is 5 — no overflow with exactly 5 effects', () => {
    const effects = Array.from({ length: 5 }, (_, i) => ({
      id: 'burn',
      remainingTurns: i + 1,
    }));
    const { container } = render(
      <StatusEffectBar effects={effects} target="player" />
    );
    expect(screen.queryByText(/^\+\d+$/)).toBeNull();
    expect(container.firstChild).not.toBeNull();
  });

  it('imports StatusEffectBar as default export', () => {
    expect(typeof StatusEffectBar).toBe('function');
  });
});
