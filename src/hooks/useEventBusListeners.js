import { useDialogueEvents } from './useDialogueEvents.js';
import { useZoneEvents } from './useZoneEvents.js';
import { useObjectEvents } from './useObjectEvents.js';
import { useNarrativeEvents } from './useNarrativeEvents.js';
import { useMiscEvents } from './useMiscEvents.js';

/**
 * useEventBusListeners
 * Orchestrator — delegates all EventBus listeners to domain-specific sub-hooks.
 * Each sub-hook owns its own EventBus.on/off registrations with consistent cleanup.
 *
 * @param {React.RefObject} phaserRef - Reference to Phaser game instance
 * @param {Function} playSFX - SFX playback function from useAudio
 * @param {Function} navigate - React Router navigate function
 */
export function useEventBusListeners(phaserRef, playSFX, navigate) {
  useDialogueEvents(playSFX);
  useZoneEvents(phaserRef, playSFX);
  useObjectEvents(playSFX);
  useNarrativeEvents();
  useMiscEvents(phaserRef, playSFX, navigate);
}
