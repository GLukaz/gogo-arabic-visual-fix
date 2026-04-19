import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showTransliteration: true,
  showDiacritics: true,
  keyboardMode: 'onscreen', // 'onscreen' | 'physical'
  masterVolume: 70, // 0-100 — scales all audio channels
  ambientVolume: 70, // 0-100 — kept for backward compat
  bgmVolume: 70, // 0-100 — background music
  sfxVolume: 80,
  pronunciationVolume: 100,
  isMuted: false,
  textSize: 'medium', // 'small' | 'medium' | 'large'
  difficulty: 'normal',           // 'easy' | 'normal' | 'hard'
  vowelMarks: true,               // Show tashkeel on Arabic text
  hintFrequency: 'normal',        // 'always' | 'normal' | 'rare' | 'never'
  battleSpeed: 1.0,               // 0.5 | 1.0 | 1.5 | 2.0
  vocabRandomizerSeed: null,      // Seed for VocabRandomizer (null = default)
  showRomanization: true,         // Show romanized Arabic
  // Accessibility
  colorBlindMode: 'none',         // 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
  fontScale: 1.0,                 // 0.8 – 1.5 in 0.1 increments
  reducedMotion: false,           // Suppress animations
  highContrast: false,            // Boost contrast for all UI elements
  screenReaderMode: false,        // Extra ARIA labels + live announcements
  pronunciationPractice: false,    // Opt-in mic button for pronunciation feedback
  spacedListeningEnabled: false,   // Passive Arabic audio during exploration
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    toggleTransliteration(state) {
      state.showTransliteration = !state.showTransliteration;
    },

    toggleDiacritics(state) {
      state.showDiacritics = !state.showDiacritics;
    },

    setKeyboardMode(state, action) {
      state.keyboardMode = action.payload;
    },

    setMasterVolume(state, action) {
      state.masterVolume = Math.max(0, Math.min(100, action.payload));
    },

    setAmbientVolume(state, action) {
      state.ambientVolume = Math.max(0, Math.min(100, action.payload));
    },

    setBgmVolume(state, action) {
      state.bgmVolume = Math.max(0, Math.min(100, action.payload));
    },

    setSfxVolume(state, action) {
      state.sfxVolume = Math.max(0, Math.min(100, action.payload));
    },

    setPronunciationVolume(state, action) {
      state.pronunciationVolume = Math.max(0, Math.min(100, action.payload));
    },

    toggleMute(state) {
      state.isMuted = !state.isMuted;
    },

    setTextSize(state, action) {
      state.textSize = action.payload;
    },

    setDifficulty(state, action) {
      state.difficulty = action.payload;
    },
    setVowelMarks(state, action) {
      state.vowelMarks = action.payload;
    },
    setHintFrequency(state, action) {
      state.hintFrequency = action.payload;
    },
    setBattleSpeed(state, action) {
      state.battleSpeed = action.payload;
    },
    setVocabRandomizerSeed(state, action) {
      state.vocabRandomizerSeed = action.payload;
    },
    setShowRomanization(state, action) {
      state.showRomanization = action.payload;
    },
    // Accessibility reducers
    setColorBlindMode(state, action) {
      const valid = ['none', 'protanopia', 'deuteranopia', 'tritanopia'];
      if (valid.includes(action.payload)) state.colorBlindMode = action.payload;
    },
    setFontScale(state, action) {
      const clamped = Math.round(Math.min(1.5, Math.max(0.8, action.payload)) * 10) / 10;
      state.fontScale = clamped;
    },
    setReducedMotion(state, action) {
      state.reducedMotion = Boolean(action.payload);
    },
    setHighContrast(state, action) {
      state.highContrast = Boolean(action.payload);
    },
    setScreenReaderMode(state, action) {
      state.screenReaderMode = Boolean(action.payload);
    },
    togglePronunciationPractice(state) {
      state.pronunciationPractice = !state.pronunciationPractice;
    },
    toggleSpacedListening(state) {
      state.spacedListeningEnabled = !state.spacedListeningEnabled;
    },
  },
});

export const {
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
  setDifficulty,
  setVowelMarks,
  setHintFrequency,
  setBattleSpeed,
  setVocabRandomizerSeed,
  setShowRomanization,
  setColorBlindMode,
  setFontScale,
  setReducedMotion,
  setHighContrast,
  setScreenReaderMode,
  togglePronunciationPractice,
  toggleSpacedListening,
} = settingsSlice.actions;

// --- Selectors ---
export const selectShowTransliteration = (state) => state.settings.showTransliteration;
export const selectShowDiacritics = (state) => state.settings.showDiacritics;
export const selectKeyboardMode = (state) => state.settings.keyboardMode;
export const selectMasterVolume = (state) => state.settings.masterVolume;
export const selectAmbientVolume = (state) => state.settings.ambientVolume;
export const selectBgmVolume = (state) => state.settings.bgmVolume;
export const selectSfxVolume = (state) => state.settings.sfxVolume;
export const selectPronunciationVolume = (state) => state.settings.pronunciationVolume;
export const selectIsMuted = (state) => state.settings.isMuted;
export const selectTextSize = (state) => state.settings.textSize;
export const selectSettings = (state) => state.settings;
export const selectDifficulty = (state) => state.settings.difficulty;
export const selectVowelMarks = (state) => state.settings.vowelMarks;
export const selectHintFrequency = (state) => state.settings.hintFrequency;
export const selectBattleSpeed = (state) => state.settings.battleSpeed;
export const selectVocabRandomizerSeed = (state) => state.settings.vocabRandomizerSeed;
// Accessibility selectors
export const selectColorBlindMode = (state) => state.settings.colorBlindMode;
export const selectFontScale = (state) => state.settings.fontScale;
export const selectReducedMotion = (state) => state.settings.reducedMotion;
export const selectHighContrast = (state) => state.settings.highContrast;
export const selectScreenReaderMode = (state) => state.settings.screenReaderMode;
export const selectPronunciationPractice = (state) => state.settings.pronunciationPractice;
export const selectSpacedListeningEnabled = (state) => state.settings.spacedListeningEnabled;

export default settingsSlice.reducer;
