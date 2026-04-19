/**
 * spacedListeningService.test.js
 * WIRE-008 — Spaced listening start/stop, settings toggle, mode detection
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  startListening,
  stopListening,
  isListening,
  isSpeechSynthesisSupported,
  shouldPause,
} from '../spacedListeningService.js';

// Mock speechSynthesis
const mockSpeechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
};

beforeEach(() => {
  vi.useFakeTimers();
  global.speechSynthesis = mockSpeechSynthesis;
  global.SpeechSynthesisUtterance = vi.fn().mockImplementation(() => ({
    lang: '',
    rate: 0.8,
    volume: 0.7,
    onend: null,
    onerror: null,
  }));
  vi.clearAllMocks();
  stopListening(); // reset module state
});

afterEach(() => {
  stopListening();
  vi.useRealTimers();
  delete global.speechSynthesis;
  delete global.SpeechSynthesisUtterance;
});

const makeGetState = (overrides = {}) => () => ({
  vocabulary: { fsrsCards: {} },
  player: { currentZone: 'oasis_village' },
  settings: { isMuted: false, pronunciationVolume: 100, masterVolume: 70, ...overrides.settings },
  battle: { activeBattle: false, ...overrides.battle },
  ...overrides,
});

describe('spacedListeningService', () => {
  describe('startListening / stopListening', () => {
    it('sets isListening to true after startListening', () => {
      startListening(makeGetState(), []);
      expect(isListening()).toBe(true);
    });

    it('sets isListening to false after stopListening', () => {
      startListening(makeGetState(), []);
      stopListening();
      expect(isListening()).toBe(false);
    });

    it('cancels speechSynthesis on stopListening', () => {
      startListening(makeGetState(), []);
      stopListening();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });

    it('does not start if speechSynthesis is unsupported', () => {
      delete global.speechSynthesis;
      startListening(makeGetState(), []);
      expect(isListening()).toBe(false);
    });
  });

  describe('shouldPause', () => {
    it('returns false during normal exploration', () => {
      const state = makeGetState()();
      expect(shouldPause(state)).toBe(false);
    });

    it('returns true during active battle', () => {
      const state = makeGetState({ battle: { activeBattle: true } })();
      expect(shouldPause(state)).toBe(true);
    });

    it('returns true when muted', () => {
      const state = makeGetState({ settings: { isMuted: true, pronunciationVolume: 100, masterVolume: 70 } })();
      expect(shouldPause(state)).toBe(true);
    });

    it('returns true when pronunciationVolume is 0', () => {
      const state = makeGetState({ settings: { isMuted: false, pronunciationVolume: 0, masterVolume: 70 } })();
      expect(shouldPause(state)).toBe(true);
    });
  });

  describe('settings toggle', () => {
    it('can be restarted after stop (settings re-enabled)', () => {
      startListening(makeGetState(), []);
      expect(isListening()).toBe(true);
      stopListening();
      expect(isListening()).toBe(false);
      startListening(makeGetState(), []);
      expect(isListening()).toBe(true);
    });
  });

  describe('isSpeechSynthesisSupported', () => {
    it('returns true when speechSynthesis is available', () => {
      expect(isSpeechSynthesisSupported()).toBe(true);
    });

    it('returns false when speechSynthesis is absent', () => {
      delete global.speechSynthesis;
      expect(isSpeechSynthesisSupported()).toBe(false);
    });
  });
});
