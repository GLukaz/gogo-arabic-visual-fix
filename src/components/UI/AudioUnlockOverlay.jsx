import { useState, useEffect, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import styles from './AudioUnlockOverlay.module.css';

/**
 * Fullscreen overlay that appears on mobile/tablet devices to prompt
 * user interaction before audio can play (browser autoplay policy).
 *
 * On tap/click, resumes the AudioContext and plays a silent Howl
 * to trigger Howler's internal unlock mechanism.
 */
export default function AudioUnlockOverlay() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if audio context needs user interaction to unlock
    const ctx = Howler.ctx;
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (ctx && ctx.state === 'suspended') {
      setVisible(true);
    } else if (!ctx && isTouchDevice) {
      // No context yet on a touch device -- show overlay to be safe
      setVisible(true);
    }
    // Desktop with running context: stay hidden
  }, []);

  const handleUnlock = useCallback(() => {
    // Resume AudioContext if suspended
    if (Howler.ctx?.state === 'suspended') {
      Howler.ctx.resume();
    }

    // Play a silent Howl to trigger Howler's internal audio unlock
    new Howl({
      src: ['data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='],
      volume: 0,
      autoplay: true,
      onend: function () {
        this.unload();
      },
    });

    setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={styles.overlay}
      onClick={handleUnlock}
      onTouchStart={handleUnlock}
      role="button"
      tabIndex={0}
      aria-label="Tap to enable audio"
    >
      <div className={styles.content}>
        <div className={styles.icon} aria-hidden="true">{'\u266B'}</div>
        <div className={styles.title}>Tap to Play</div>
        <div className={styles.subtitle}>Enable audio for the full experience</div>
        <button className={styles.btn} type="button">Start</button>
      </div>
    </div>
  );
}
