/**
 * AccessibilityPanel.jsx
 * Settings panel for accessibility options:
 *   - Color blind mode
 *   - Font scale
 *   - High contrast
 *   - Screen reader mode
 *   - Reduced motion
 *
 * Styled with dark game theme (#0A0A0A / #d4a843 gold) using a CSS module.
 */
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectColorBlindMode,
  selectFontScale,
  selectReducedMotion,
  selectHighContrast,
  selectScreenReaderMode,
  setColorBlindMode,
  setFontScale,
  setReducedMotion,
  setHighContrast,
  setScreenReaderMode,
} from '../../store/slices/settingsSlice.js';
import { getColorBlindPalette } from '../../utils/accessibility.js';
import styles from './AccessibilityPanel.module.css';

const COLOR_BLIND_OPTIONS = [
  { value: 'none',         label: 'None' },
  { value: 'protanopia',   label: 'Protanopia (red-weak)' },
  { value: 'deuteranopia', label: 'Deuteranopia (green-weak)' },
  { value: 'tritanopia',   label: 'Tritanopia (blue-weak)' },
];

const FONT_SCALE_MIN  = 0.8;
const FONT_SCALE_MAX  = 1.5;
const FONT_SCALE_STEP = 0.1;

const DYSLEXIA_KEY = 'gogo-a11y-dyslexia-font';

function readDyslexia() {
  try { return localStorage.getItem(DYSLEXIA_KEY) === 'true'; } catch { return false; }
}

export default function AccessibilityPanel({ onBack }) {
  const dispatch        = useDispatch();
  const colorBlindMode  = useSelector(selectColorBlindMode);
  const fontScale       = useSelector(selectFontScale);
  const reducedMotion   = useSelector(selectReducedMotion);
  const highContrast    = useSelector(selectHighContrast);
  const screenReader    = useSelector(selectScreenReaderMode);
  const [dyslexiaFont, setDyslexiaFont] = useState(readDyslexia);

  const toggleDyslexiaFont = () => {
    const next = !dyslexiaFont;
    setDyslexiaFont(next);
    try { localStorage.setItem(DYSLEXIA_KEY, String(next)); } catch { /* quota */ }
    document.documentElement.setAttribute('data-dyslexia-font', String(next));
  };

  const palette = getColorBlindPalette(colorBlindMode);

  const fontScaleLabel = `${Math.round(fontScale * 10) / 10}x`;

  return (
    <div className={styles.container} role="region" aria-label="Accessibility Settings">
      <div className={styles.panel}>
        <h2 className={styles.title} id="a11y-panel-title">Accessibility</h2>

        {/* ── Color Blind Mode ── */}
        <section className={styles.section} aria-labelledby="cbm-heading">
          <div className={styles.sectionHeading} id="cbm-heading">Color Blind Mode</div>

          <div className={styles.settingRow}>
            <label className={styles.label} htmlFor="colorBlindSelect">
              Vision Profile
            </label>
            <select
              id="colorBlindSelect"
              className={styles.select}
              value={colorBlindMode}
              onChange={(e) => dispatch(setColorBlindMode(e.target.value))}
              aria-describedby="cbm-hint"
            >
              {COLOR_BLIND_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <p className={styles.hint} id="cbm-hint">
            Remaps in-game colors for your vision type.
          </p>

          {/* Color swatch preview */}
          <div
            className={styles.swatchRow}
            role="img"
            aria-label={`Color palette preview for ${colorBlindMode} mode`}
          >
            {['primary', 'secondary', 'danger', 'info', 'warning', 'accent'].map((role) => (
              <div key={role} className={styles.swatchItem}>
                <div
                  className={styles.swatch}
                  style={{ background: palette[role] }}
                  title={`${role}: ${palette[role]}`}
                />
                <span className={styles.swatchLabel}>{role}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── Font Scale ── */}
        <section className={styles.section} aria-labelledby="fs-heading">
          <div className={styles.sectionHeading} id="fs-heading">Font Scale</div>
          <div className={styles.settingRow}>
            <label className={styles.label} htmlFor="fontScaleSlider">
              Text Size
            </label>
            <div className={styles.sliderGroup}>
              <input
                id="fontScaleSlider"
                type="range"
                className={styles.slider}
                min={FONT_SCALE_MIN}
                max={FONT_SCALE_MAX}
                step={FONT_SCALE_STEP}
                value={fontScale}
                onChange={(e) => dispatch(setFontScale(parseFloat(e.target.value)))}
                aria-valuemin={FONT_SCALE_MIN}
                aria-valuemax={FONT_SCALE_MAX}
                aria-valuenow={fontScale}
                aria-valuetext={fontScaleLabel}
              />
              <span className={styles.scaleValue} aria-live="polite">{fontScaleLabel}</span>
            </div>
          </div>
          <div
            className={styles.fontPreview}
            style={{ fontSize: `${Math.round(14 * fontScale)}px` }}
            aria-hidden="true"
          >
            مرحباً — Hello in Arabic
          </div>

          {/* ── Dyslexia-Friendly Font ── */}
          <div className={styles.settingRow}>
            <span className={styles.label} id="df-label">Dyslexia-Friendly Font</span>
            <button
              role="switch"
              aria-checked={dyslexiaFont}
              aria-labelledby="df-label"
              className={dyslexiaFont ? styles.toggleOn : styles.toggleOff}
              onClick={toggleDyslexiaFont}
            >
              {dyslexiaFont ? 'ON' : 'OFF'}
            </button>
          </div>
          <p className={styles.hint}>
            Switches to OpenDyslexic font for improved readability.
          </p>
        </section>

        {/* ── High Contrast ── */}
        <section className={styles.section} aria-labelledby="hc-heading">
          <div className={styles.sectionHeading} id="hc-heading">Contrast &amp; Motion</div>

          <div className={styles.settingRow}>
            <span className={styles.label} id="hc-label">High Contrast</span>
            <button
              role="switch"
              aria-checked={highContrast}
              aria-labelledby="hc-label"
              className={highContrast ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(setHighContrast(!highContrast))}
            >
              {highContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* ── Reduced Motion ── */}
          <div className={styles.settingRow}>
            <span className={styles.label} id="rm-label">Reduced Motion</span>
            <button
              role="switch"
              aria-checked={reducedMotion}
              aria-labelledby="rm-label"
              className={reducedMotion ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(setReducedMotion(!reducedMotion))}
            >
              {reducedMotion ? 'ON' : 'OFF'}
            </button>
          </div>
        </section>

        {/* ── Screen Reader Mode ── */}
        <section className={styles.section} aria-labelledby="sr-heading">
          <div className={styles.sectionHeading} id="sr-heading">Screen Reader</div>
          <div className={styles.settingRow}>
            <span className={styles.label} id="sr-label">Screen Reader Mode</span>
            <button
              role="switch"
              aria-checked={screenReader}
              aria-labelledby="sr-label"
              className={screenReader ? styles.toggleOn : styles.toggleOff}
              onClick={() => dispatch(setScreenReaderMode(!screenReader))}
            >
              {screenReader ? 'ON' : 'OFF'}
            </button>
          </div>
          <p className={styles.hint}>
            Adds ARIA labels and announces game events to assistive technology.
          </p>
        </section>

        {onBack && (
          <button className={styles.backBtn} onClick={onBack} aria-label="Back to settings menu">
            Back
          </button>
        )}
      </div>
    </div>
  );
}
