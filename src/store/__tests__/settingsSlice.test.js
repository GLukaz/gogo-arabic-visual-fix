import { describe, it, expect, beforeEach } from 'vitest';
import settingsReducer, {
  toggleTransliteration,
  toggleDiacritics,
  setKeyboardMode,
  setMasterVolume,
  setAmbientVolume,
  setBgmVolume,
  setSfxVolume,
  setPronunciationVolume,
  toggleMute,
  setTextSize,
} from '../slices/settingsSlice.js';

describe('settingsSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = settingsReducer(undefined, { type: 'unknown' });
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(initialState).toEqual({
        showTransliteration: true,
        showDiacritics: true,
        keyboardMode: 'onscreen',
        masterVolume: 70,
        ambientVolume: 70,
        bgmVolume: 70,
        sfxVolume: 80,
        pronunciationVolume: 100,
        isMuted: false,
        textSize: 'medium',
        difficulty: 'normal',
        vowelMarks: true,
        hintFrequency: 'normal',
        battleSpeed: 1,
        vocabRandomizerSeed: null,
        showRomanization: true,
        colorBlindMode: 'none',
        fontScale: 1,
        reducedMotion: false,
        highContrast: false,
        screenReaderMode: false,
      });
    });
  });

  describe('toggleTransliteration', () => {
    it('should toggle transliteration from true to false', () => {
      const state = settingsReducer(initialState, toggleTransliteration());

      expect(state.showTransliteration).toBe(false);
    });

    it('should toggle transliteration from false to true', () => {
      const startState = { ...initialState, showTransliteration: false };
      const state = settingsReducer(startState, toggleTransliteration());

      expect(state.showTransliteration).toBe(true);
    });

    it('should toggle multiple times', () => {
      let state = settingsReducer(initialState, toggleTransliteration());
      expect(state.showTransliteration).toBe(false);

      state = settingsReducer(state, toggleTransliteration());
      expect(state.showTransliteration).toBe(true);

      state = settingsReducer(state, toggleTransliteration());
      expect(state.showTransliteration).toBe(false);
    });
  });

  describe('toggleDiacritics', () => {
    it('should toggle diacritics from true to false', () => {
      const state = settingsReducer(initialState, toggleDiacritics());

      expect(state.showDiacritics).toBe(false);
    });

    it('should toggle diacritics from false to true', () => {
      const startState = { ...initialState, showDiacritics: false };
      const state = settingsReducer(startState, toggleDiacritics());

      expect(state.showDiacritics).toBe(true);
    });
  });

  describe('setKeyboardMode', () => {
    it('should set keyboard mode to onscreen', () => {
      const startState = { ...initialState, keyboardMode: 'physical' };
      const state = settingsReducer(startState, setKeyboardMode('onscreen'));

      expect(state.keyboardMode).toBe('onscreen');
    });

    it('should set keyboard mode to physical', () => {
      const state = settingsReducer(initialState, setKeyboardMode('physical'));

      expect(state.keyboardMode).toBe('physical');
    });
  });

  describe('setAmbientVolume', () => {
    it('should set ambient volume to valid value', () => {
      const state = settingsReducer(initialState, setAmbientVolume(50));

      expect(state.ambientVolume).toBe(50);
    });

    it('should clamp volume below 0 to 0', () => {
      const state = settingsReducer(initialState, setAmbientVolume(-10));

      expect(state.ambientVolume).toBe(0);
    });

    it('should clamp volume above 100 to 100', () => {
      const state = settingsReducer(initialState, setAmbientVolume(150));

      expect(state.ambientVolume).toBe(100);
    });

    it('should handle boundary values', () => {
      let state = settingsReducer(initialState, setAmbientVolume(0));
      expect(state.ambientVolume).toBe(0);

      state = settingsReducer(initialState, setAmbientVolume(100));
      expect(state.ambientVolume).toBe(100);
    });
  });

  describe('setSfxVolume', () => {
    it('should set sfx volume to valid value', () => {
      const state = settingsReducer(initialState, setSfxVolume(60));

      expect(state.sfxVolume).toBe(60);
    });

    it('should clamp volume below 0 to 0', () => {
      const state = settingsReducer(initialState, setSfxVolume(-5));

      expect(state.sfxVolume).toBe(0);
    });

    it('should clamp volume above 100 to 100', () => {
      const state = settingsReducer(initialState, setSfxVolume(200));

      expect(state.sfxVolume).toBe(100);
    });
  });

  describe('setPronunciationVolume', () => {
    it('should set pronunciation volume to valid value', () => {
      const state = settingsReducer(initialState, setPronunciationVolume(75));

      expect(state.pronunciationVolume).toBe(75);
    });

    it('should clamp volume below 0 to 0', () => {
      const state = settingsReducer(initialState, setPronunciationVolume(-20));

      expect(state.pronunciationVolume).toBe(0);
    });

    it('should clamp volume above 100 to 100', () => {
      const state = settingsReducer(initialState, setPronunciationVolume(120));

      expect(state.pronunciationVolume).toBe(100);
    });
  });

  describe('setMasterVolume', () => {
    it('should set master volume to valid value', () => {
      const state = settingsReducer(initialState, setMasterVolume(50));

      expect(state.masterVolume).toBe(50);
    });

    it('should clamp volume below 0 to 0', () => {
      const state = settingsReducer(initialState, setMasterVolume(-10));

      expect(state.masterVolume).toBe(0);
    });

    it('should clamp volume above 100 to 100', () => {
      const state = settingsReducer(initialState, setMasterVolume(150));

      expect(state.masterVolume).toBe(100);
    });
  });

  describe('setBgmVolume', () => {
    it('should set bgm volume to valid value', () => {
      const state = settingsReducer(initialState, setBgmVolume(40));

      expect(state.bgmVolume).toBe(40);
    });

    it('should clamp volume below 0 to 0', () => {
      const state = settingsReducer(initialState, setBgmVolume(-5));

      expect(state.bgmVolume).toBe(0);
    });

    it('should clamp volume above 100 to 100', () => {
      const state = settingsReducer(initialState, setBgmVolume(200));

      expect(state.bgmVolume).toBe(100);
    });
  });

  describe('toggleMute', () => {
    it('should toggle mute from false to true', () => {
      const state = settingsReducer(initialState, toggleMute());

      expect(state.isMuted).toBe(true);
    });

    it('should toggle mute from true to false', () => {
      const startState = { ...initialState, isMuted: true };
      const state = settingsReducer(startState, toggleMute());

      expect(state.isMuted).toBe(false);
    });
  });

  describe('setTextSize', () => {
    it('should set text size to small', () => {
      const state = settingsReducer(initialState, setTextSize('small'));

      expect(state.textSize).toBe('small');
    });

    it('should set text size to medium', () => {
      const state = settingsReducer(initialState, setTextSize('medium'));

      expect(state.textSize).toBe('medium');
    });

    it('should set text size to large', () => {
      const state = settingsReducer(initialState, setTextSize('large'));

      expect(state.textSize).toBe('large');
    });

    it('should allow changing text size multiple times', () => {
      let state = settingsReducer(initialState, setTextSize('small'));
      expect(state.textSize).toBe('small');

      state = settingsReducer(state, setTextSize('large'));
      expect(state.textSize).toBe('large');

      state = settingsReducer(state, setTextSize('medium'));
      expect(state.textSize).toBe('medium');
    });
  });
});
