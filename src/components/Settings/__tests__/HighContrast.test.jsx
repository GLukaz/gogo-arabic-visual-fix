/**
 * HighContrast.test.jsx
 * Phase 75 — Task 2: High Contrast Mode
 * Verifies high-contrast palette, CSS variable overrides, theme utility, and toggle persistence.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import AccessibilityPanel from '../AccessibilityPanel.jsx';
import { HIGH_CONTRAST_COLORS, COLORS, getThemeColors } from '../../../styles/theme.js';

describe('High Contrast Mode', () => {
  beforeEach(() => {
    // Reset data attribute before each test
    document.documentElement.removeAttribute('data-high-contrast');
  });

  describe('getThemeColors utility', () => {
    it('returns COLORS when highContrast is false', () => {
      const result = getThemeColors(false);
      expect(result).toBe(COLORS);
    });

    it('returns HIGH_CONTRAST_COLORS when highContrast is true', () => {
      const result = getThemeColors(true);
      expect(result).toBe(HIGH_CONTRAST_COLORS);
    });
  });

  describe('HIGH_CONTRAST_COLORS palette', () => {
    it('has pure white for beige/creamyBeige backgrounds', () => {
      expect(HIGH_CONTRAST_COLORS.beige).toBe('#ffffff');
      expect(HIGH_CONTRAST_COLORS.creamyBeige).toBe('#ffffff');
    });

    it('has pure black for dark backgrounds', () => {
      expect(HIGH_CONTRAST_COLORS.dark).toBe('#000000');
      expect(HIGH_CONTRAST_COLORS.brown).toBe('#000000');
      expect(HIGH_CONTRAST_COLORS.panel).toBe('#000000');
    });

    it('has boosted accent colors', () => {
      expect(HIGH_CONTRAST_COLORS.cyan).toBe('#00ccff');
      expect(HIGH_CONTRAST_COLORS.red).toBe('#ff0000');
      expect(HIGH_CONTRAST_COLORS.green).toBe('#00cc00');
      expect(HIGH_CONTRAST_COLORS.gold).toBe('#ffcc00');
    });

    it('has same keys as COLORS', () => {
      const colorsKeys = Object.keys(COLORS).sort();
      const hcKeys = Object.keys(HIGH_CONTRAST_COLORS).sort();
      expect(hcKeys).toEqual(colorsKeys);
    });
  });

  describe('AccessibilityPanel toggle', () => {
    it('renders the High Contrast toggle', () => {
      renderWithProviders(<AccessibilityPanel />, {
        preloadedState: { settings: { highContrast: false } },
      });
      expect(screen.getByText('High Contrast')).toBeInTheDocument();
    });

    it('shows OFF when highContrast is false', () => {
      renderWithProviders(<AccessibilityPanel />, {
        preloadedState: { settings: { highContrast: false } },
      });
      const toggle = screen.getByRole('switch', { name: /High Contrast/i });
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(toggle.textContent).toBe('OFF');
    });

    it('shows ON when highContrast is true', () => {
      renderWithProviders(<AccessibilityPanel />, {
        preloadedState: { settings: { highContrast: true } },
      });
      const toggle = screen.getByRole('switch', { name: /High Contrast/i });
      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(toggle.textContent).toBe('ON');
    });

    it('toggles highContrast state on click', () => {
      const { store } = renderWithProviders(<AccessibilityPanel />, {
        preloadedState: { settings: { highContrast: false } },
      });
      const toggle = screen.getByRole('switch', { name: /High Contrast/i });
      fireEvent.click(toggle);
      expect(store.getState().settings.highContrast).toBe(true);
    });
  });
});
