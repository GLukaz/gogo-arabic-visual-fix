/**
 * OfflineIndicator — Phase 72
 *
 * Shows a small indicator in the HUD when the user is offline.
 * Listens to navigator.onLine events.
 */

import { useState, useEffect, memo } from 'react';

// Inject the keyframe once into the document head
let keyframeInjected = false;
function injectKeyframes() {
  if (keyframeInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = '@keyframes offlinePulse{0%,100%{opacity:1}50%{opacity:.3}}';
  document.head.appendChild(style);
  keyframeInjected = true;
}

function OfflineIndicator() {
  const [offline, setOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  );

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);

    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  useEffect(() => {
    if (offline) injectKeyframes();
  }, [offline]);

  if (!offline) return null;

  return (
    <div style={styles.container} role="status" aria-live="polite" aria-label="You are offline">
      <span style={styles.dot} aria-hidden="true" />
      <span style={styles.text}>OFFLINE</span>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 8px',
    background: 'rgba(240, 49, 49, 0.85)',
    border: '2px solid #f03131',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 8,
    color: '#f4fefa',
    pointerEvents: 'none',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#f4fefa',
    animation: 'offlinePulse 1.5s infinite',
  },
  text: {
    letterSpacing: 1,
  },
};

export default memo(OfflineIndicator);
