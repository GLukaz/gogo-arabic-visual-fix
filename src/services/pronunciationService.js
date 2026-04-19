/**
 * Pronunciation Service
 *
 * Phase F: Wraps the Web Speech API's SpeechRecognition for Arabic pronunciation
 * practice. Returns recognized text and compares against expected Arabic word.
 *
 * Browser support: Chrome (desktop + Android), Edge, Safari 14.1+.
 * Falls back gracefully — returns { supported: false } if unavailable.
 */

/**
 * Check if the Web Speech API is available for Arabic.
 * @returns {boolean}
 */
export function isSpeechRecognitionSupported() {
  return !!(
    typeof window !== 'undefined' &&
    (window.SpeechRecognition || window.webkitSpeechRecognition)
  );
}

/**
 * Listen for Arabic speech and return the recognized text.
 * Returns a promise that resolves with the recognized Arabic string,
 * or rejects on error/timeout.
 *
 * @param {Object} options
 * @param {number} options.timeoutMs - Max listening time in ms (default 5000)
 * @returns {Promise<string>} Recognized Arabic text
 */
export function listenForArabic({ timeoutMs = 5000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!isSpeechRecognitionSupported()) {
      return reject(new Error('Speech recognition not supported'));
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.lang = 'ar';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    let settled = false;

    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        recognition.stop();
        reject(new Error('Speech recognition timeout'));
      }
    }, timeoutMs);

    recognition.onresult = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const transcript = event.results[0]?.[0]?.transcript || '';
      resolve(transcript.trim());
    };

    recognition.onerror = (event) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      reject(new Error(`Speech recognition error: ${event.error}`));
    };

    recognition.onend = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timeout);
        reject(new Error('Speech recognition ended without result'));
      }
    };

    recognition.start();
  });
}

/**
 * Calculate similarity between two Arabic strings.
 * Uses a simplified character-level comparison (not Levenshtein for performance).
 * Returns a 0-1 score.
 *
 * @param {string} expected - Expected Arabic word
 * @param {string} recognized - Recognized Arabic text from Speech API
 * @returns {number} 0-1 similarity score
 */
export function calculateSimilarity(expected, recognized) {
  if (!expected || !recognized) return 0;

  // Strip diacritics (tashkeel) for comparison — Speech API doesn't produce them
  const stripDiacritics = (s) => s.replace(/[\u064B-\u0652\u0670]/g, '');
  const a = stripDiacritics(expected.trim());
  const b = stripDiacritics(recognized.trim());

  if (a === b) return 1;

  // Check if recognized text contains the expected word
  if (b.includes(a)) return 0.9;

  // Character-level Jaccard similarity
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = new Set([...setA].filter((c) => setB.has(c)));
  const union = new Set([...setA, ...setB]);

  return union.size > 0 ? intersection.size / union.size : 0;
}

/**
 * Attempt pronunciation and evaluate.
 *
 * @param {string} expectedArabic - The expected Arabic word
 * @param {Object} options - { timeoutMs }
 * @returns {Promise<{ recognized: string, similarity: number, correct: boolean }>}
 */
export async function evaluatePronunciation(expectedArabic, options = {}) {
  const recognized = await listenForArabic(options);
  const similarity = calculateSimilarity(expectedArabic, recognized);
  return {
    recognized,
    similarity,
    correct: similarity >= 0.7, // 70% threshold
  };
}
