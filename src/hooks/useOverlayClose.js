import { useEffect, useCallback } from 'react';
import { EventBus } from '../utils/eventBus.js';
import { EVENTS } from '../utils/eventBusTypes.js';

/**
 * useOverlayClose -- centralized overlay dismissal
 * Handles: ESC key, guaranteed unfreeze-player on close.
 *
 * IMPORTANT: We do NOT emit PLAYER_UNFREEZE on unmount, because many components
 * using this hook are mounted at startup (before any freeze occurs), and an
 * unconditional unfreeze-on-unmount would create mismatched freeze/unfreeze pairs
 * that permanently freeze the player after the first interaction closes.
 *
 * @param {function} onClose - The close handler (dispatch closeX action, etc.)
 * @param {object} options
 * @param {boolean} options.escEnabled - Allow ESC to close (default: true)
 * @param {function} options.beforeClose - Optional guard (return false to prevent close)
 */
export function useOverlayClose(onClose, options = {}) {
  const { escEnabled = true, beforeClose = null } = options;

  const handleClose = useCallback(() => {
    if (beforeClose && beforeClose() === false) return;
    onClose();
    EventBus.emit(EVENTS.PLAYER_UNFREEZE);
  }, [onClose, beforeClose]);

  // ESC key handler
  useEffect(() => {
    if (!escEnabled) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true); // capture phase
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [escEnabled, handleClose]);

  return handleClose;
}
