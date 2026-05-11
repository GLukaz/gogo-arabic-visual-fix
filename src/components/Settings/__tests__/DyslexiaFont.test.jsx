/**
 * DyslexiaFont.test.jsx
 * Phase 75 — Task 3: Dyslexia-friendly font toggle
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '../../../test/testUtils.jsx';
import AccessibilityPanel from '../AccessibilityPanel.jsx';

const DYSLEXIA_KEY = 'gogo-a11y-dyslexia-font';

describe('Dyslexia-Friendly Font Toggle', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-dyslexia-font');
  });

  it('renders the Dyslexia-Friendly Font toggle', () => {
    renderWithProviders(<AccessibilityPanel />, {
      preloadedState: { settings: { highContrast: false } },
    });
    expect(screen.getByText('Dyslexia-Friendly Font')).toBeInTheDocument();
  });

  it('shows OFF when localStorage has no value', () => {
    renderWithProviders(<AccessibilityPanel />, {
      preloadedState: { settings: { highContrast: false } },
    });
    const toggle = screen.getByRole('switch', { name: /Dyslexia-Friendly Font/i });
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(toggle.textContent).toBe('OFF');
  });

  it('shows ON when localStorage has true', () => {
    localStorage.setItem(DYSLEXIA_KEY, 'true');
    renderWithProviders(<AccessibilityPanel />, {
      preloadedState: { settings: { highContrast: false } },
    });
    const toggle = screen.getByRole('switch', { name: /Dyslexia-Friendly Font/i });
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(toggle.textContent).toBe('ON');
  });

  it('toggles state and persists to localStorage on click', () => {
    renderWithProviders(<AccessibilityPanel />, {
      preloadedState: { settings: { highContrast: false } },
    });
    const toggle = screen.getByRole('switch', { name: /Dyslexia-Friendly Font/i });

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
    expect(localStorage.getItem(DYSLEXIA_KEY)).toBe('true');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'false');
    expect(localStorage.getItem(DYSLEXIA_KEY)).toBe('false');
  });

  it('sets data-dyslexia-font attribute on html', () => {
    renderWithProviders(<AccessibilityPanel />, {
      preloadedState: { settings: { highContrast: false } },
    });
    const toggle = screen.getByRole('switch', { name: /Dyslexia-Friendly Font/i });

    fireEvent.click(toggle);
    expect(document.documentElement.getAttribute('data-dyslexia-font')).toBe('true');
  });

  it('shows hint text about OpenDyslexic', () => {
    renderWithProviders(<AccessibilityPanel />, {
      preloadedState: { settings: { highContrast: false } },
    });
    expect(screen.getByText(/OpenDyslexic/i)).toBeInTheDocument();
  });
});
