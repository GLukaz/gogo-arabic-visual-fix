import { describe, it, expect, vi, afterEach } from 'vitest';

// ── Mock SpeechSynthesisUtterance (not available in jsdom) ───────────────────

class MockUtterance {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.rate = 1;
    this.pitch = 1;
    this.voice = null;
    this.onend = null;
    this.onerror = null;
  }
}
globalThis.SpeechSynthesisUtterance = MockUtterance;

import { isArabicTtsAvailable, speakArabic, stopSpeech, getArabicVoices } from '../ttsService.js';

// ── Helpers to mock speechSynthesis ──────────────────────────────────────────

/**
 * The mock speak implementations call onend/onerror via Promise.resolve().then()
 * so the callback fires as a microtask — this allows the awaiting speakArabic
 * promise to settle without needing fake timers.
 */
function installMockSpeechSynthesis({ voices = [], speakImpl, cancelImpl } = {}) {
  const mockSpeak = speakImpl || vi.fn((utterance) => {
    Promise.resolve().then(() => utterance.onend?.());
  });
  const mockCancel = cancelImpl || vi.fn();
  const mockGetVoices = vi.fn(() => voices);

  Object.defineProperty(window, 'speechSynthesis', {
    value: { speak: mockSpeak, cancel: mockCancel, getVoices: mockGetVoices },
    writable: true,
    configurable: true,
  });

  return { mockSpeak, mockCancel, mockGetVoices };
}

function removeMockSpeechSynthesis() {
  Object.defineProperty(window, 'speechSynthesis', {
    value: undefined,
    writable: true,
    configurable: true,
  });
}

const ARABIC_VOICE = { lang: 'ar-SA', name: 'Arabic Saudi' };
const ENGLISH_VOICE = { lang: 'en-US', name: 'Samantha' };

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ttsService', () => {
  afterEach(() => {
    removeMockSpeechSynthesis();
  });

  // ── isArabicTtsAvailable ───────────────────────────────────────────────────

  describe('isArabicTtsAvailable', () => {
    it('returns true when an Arabic voice exists', () => {
      installMockSpeechSynthesis({ voices: [ARABIC_VOICE, ENGLISH_VOICE] });
      expect(isArabicTtsAvailable()).toBe(true);
    });

    it('returns false when no Arabic voice exists', () => {
      installMockSpeechSynthesis({ voices: [ENGLISH_VOICE] });
      expect(isArabicTtsAvailable()).toBe(false);
    });

    it('returns false when speechSynthesis is undefined', () => {
      removeMockSpeechSynthesis();
      expect(isArabicTtsAvailable()).toBe(false);
    });

    it('returns false when voices list is empty', () => {
      installMockSpeechSynthesis({ voices: [] });
      expect(isArabicTtsAvailable()).toBe(false);
    });
  });

  // ── speakArabic ────────────────────────────────────────────────────────────

  describe('speakArabic', () => {
    it('calls speechSynthesis.speak with correct language', async () => {
      const { mockSpeak, mockCancel } = installMockSpeechSynthesis({
        voices: [ARABIC_VOICE],
        speakImpl: vi.fn((utterance) => {
          expect(utterance.lang).toBe('ar-SA');
          expect(utterance.rate).toBe(0.8);
          expect(utterance.pitch).toBe(1);
          Promise.resolve().then(() => utterance.onend?.());
        }),
      });

      await speakArabic('مرحبا');
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalledTimes(1);
    });

    it('uses custom rate and pitch when provided', async () => {
      installMockSpeechSynthesis({
        voices: [ARABIC_VOICE],
        speakImpl: vi.fn((utterance) => {
          expect(utterance.rate).toBe(0.5);
          expect(utterance.pitch).toBe(1.2);
          Promise.resolve().then(() => utterance.onend?.());
        }),
      });

      await speakArabic('كتاب', { rate: 0.5, pitch: 1.2 });
    });

    it('cancels any in-progress speech before speaking', async () => {
      const { mockCancel, mockSpeak } = installMockSpeechSynthesis({
        voices: [ARABIC_VOICE],
        speakImpl: vi.fn((utterance) => {
          Promise.resolve().then(() => utterance.onend?.());
        }),
      });

      await speakArabic('سلام');
      // cancel should have been called (at least once)
      expect(mockCancel).toHaveBeenCalled();
      expect(mockSpeak).toHaveBeenCalled();
    });

    it('rejects when speechSynthesis is undefined', async () => {
      removeMockSpeechSynthesis();
      await expect(speakArabic('مرحبا')).rejects.toThrow('TTS not available');
    });

    it('rejects when utterance errors', async () => {
      installMockSpeechSynthesis({
        voices: [ARABIC_VOICE],
        speakImpl: vi.fn((utterance) => {
          Promise.resolve().then(() => utterance.onerror?.(new Error('speech error')));
        }),
      });

      await expect(speakArabic('خطأ')).rejects.toBeTruthy();
    });

    it('assigns Arabic voice to utterance when available', async () => {
      installMockSpeechSynthesis({
        voices: [ENGLISH_VOICE, ARABIC_VOICE],
        speakImpl: vi.fn((utterance) => {
          expect(utterance.voice).toBe(ARABIC_VOICE);
          Promise.resolve().then(() => utterance.onend?.());
        }),
      });

      await speakArabic('صباح');
    });

    it('resolves when utterance ends', async () => {
      installMockSpeechSynthesis({
        voices: [],
        speakImpl: vi.fn((utterance) => {
          Promise.resolve().then(() => utterance.onend?.());
        }),
      });

      await expect(speakArabic('تمام')).resolves.toBeUndefined();
    });
  });

  // ── stopSpeech ─────────────────────────────────────────────────────────────

  describe('stopSpeech', () => {
    it('calls speechSynthesis.cancel', () => {
      const { mockCancel } = installMockSpeechSynthesis();
      stopSpeech();
      expect(mockCancel).toHaveBeenCalledTimes(1);
    });

    it('does not throw when speechSynthesis is undefined', () => {
      removeMockSpeechSynthesis();
      expect(() => stopSpeech()).not.toThrow();
    });
  });

  // ── getArabicVoices ────────────────────────────────────────────────────────

  describe('getArabicVoices', () => {
    it('returns only Arabic voices', () => {
      installMockSpeechSynthesis({ voices: [ENGLISH_VOICE, ARABIC_VOICE] });
      const voices = getArabicVoices();
      expect(voices).toHaveLength(1);
      expect(voices[0].lang).toBe('ar-SA');
    });

    it('returns empty array when speechSynthesis is undefined', () => {
      removeMockSpeechSynthesis();
      expect(getArabicVoices()).toEqual([]);
    });

    it('returns empty array when no Arabic voices exist', () => {
      installMockSpeechSynthesis({ voices: [ENGLISH_VOICE] });
      expect(getArabicVoices()).toEqual([]);
    });
  });
});
