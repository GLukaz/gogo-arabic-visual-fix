/**
 * UpdatePrompt — Phase 72
 *
 * Shows a toast-style prompt when a new service worker version is available.
 * User can dismiss or reload to apply the update.
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { applyUpdate } from '../../services/swRegistration.js';

function UpdatePrompt({ onDismiss }) {
  return (
    <div style={styles.container} role="alert" aria-live="polite">
      <span style={styles.text}>New version available!</span>
      <button style={styles.updateBtn} onClick={applyUpdate}>
        Update
      </button>
      <button style={styles.dismissBtn} onClick={onDismiss} aria-label="Dismiss update">
        ✕
      </button>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    bottom: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    background: '#2b292c',
    border: '2px solid #e2b659',
    color: '#f4fefa',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 10,
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  },
  text: {
    whiteSpace: 'nowrap',
  },
  updateBtn: {
    padding: '6px 12px',
    background: '#e2b659',
    color: '#2b292c',
    border: 'none',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 9,
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  dismissBtn: {
    padding: '4px 8px',
    background: 'transparent',
    color: '#c8c8c8',
    border: '1px solid #3a373b',
    fontFamily: "'Press Start 2P', cursive",
    fontSize: 9,
    cursor: 'pointer',
  },
};

UpdatePrompt.propTypes = {
  onDismiss: PropTypes.func.isRequired,
};

export default memo(UpdatePrompt);
