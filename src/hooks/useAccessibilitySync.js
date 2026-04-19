/**
 * useAccessibilitySync.js
 * Syncs accessibility settings from Redux to DOM data attributes + localStorage.
 *
 * Sets data-high-contrast and data-dyslexia-font on <html> element
 * so CSS variable overrides in variables.css take effect globally.
 *
 * Also persists preferences to localStorage as a secondary backup
 * (primary persistence is via redux-persist on the settings slice).
 */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  selectHighContrast,
  selectReducedMotion,
  selectFontScale,
} from '../store/slices/settingsSlice.js';

const HC_KEY = 'gogo-a11y-high-contrast';
const DYSLEXIA_KEY = 'gogo-a11y-dyslexia-font';

/**
 * Reads a boolean from localStorage (returns false if absent or invalid).
 */
function readBool(key) {
  try {
    return localStorage.getItem(key) === 'true';
  } catch {
    return false;
  }
}

/**
 * Call this hook once in the app root (e.g. App.jsx).
 * It keeps <html> data attributes in sync with the Redux settings slice.
 */
export function useAccessibilitySync() {
  const highContrast = useSelector(selectHighContrast);
  const reducedMotion = useSelector(selectReducedMotion);
  const fontScale = useSelector(selectFontScale);

  // Read dyslexia font from localStorage (not in Redux since we add it in Phase 75)
  // This is set by AccessibilityPanel toggle
  const dyslexiaFont = readBool(DYSLEXIA_KEY);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-high-contrast', String(!!highContrast));
    try { localStorage.setItem(HC_KEY, String(!!highContrast)); } catch { /* quota */ }
  }, [highContrast]);

  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-dyslexia-font', String(!!dyslexiaFont));
  }, [dyslexiaFont]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty('--reduce-motion', 'reduce');
    } else {
      document.documentElement.style.removeProperty('--reduce-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
  }, [fontScale]);
}
