/**
 * TTS Service — Web Speech API wrapper for Arabic text-to-speech.
 * Phase 80 (AUD-01 / AUD-02)
 *
 * Provides Arabic TTS with graceful fallback when the API or Arabic voices
 * are unavailable.  Rate defaults to 0.8 (slightly slower for learners).
 */

/**
 * Check whether the browser exposes at least one Arabic TTS voice.
 * Safe to call server-side (returns false).
 * @returns {boolean}
 */
export function isArabicTtsAvailable() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  const voices = window.speechSynthesis.getVoices();
  return voices.some((v) => v.lang.startsWith('ar'));
}

/**
 * Speak Arabic text via Web Speech API.
 * Resolves when the utterance finishes; rejects on error or if TTS is missing.
 *
 * @param {string} text    - Arabic text to speak
 * @param {Object} [options]
 * @param {number} [options.rate=0.8]  - Speech rate (0.1 – 10)
 * @param {number} [options.pitch=1]   - Pitch (0 – 2)
 * @returns {Promise<void>}
 */
export function speakArabic(text, options = {}) {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('TTS not available'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = options.rate ?? 0.8;
    utterance.pitch = options.pitch ?? 1;

    // Prefer an Arabic voice when one exists
    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) utterance.voice = arabicVoice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    // Cancel any in-progress speech first
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Stop any currently playing speech.
 */
export function stopSpeech() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Get the list of available Arabic voices.
 * @returns {SpeechSynthesisVoice[]}
 */
export function getArabicVoices() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.startsWith('ar'));
}
