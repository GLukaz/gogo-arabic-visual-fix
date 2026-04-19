/**
 * Audio Quiz Type registry entries — Phase 80 (AUD-01 / AUD-02).
 *
 * Exported separately so the integration step can merge them into
 * QUIZ_TYPE_REGISTRY without modifying the existing quizTypes.js file.
 *
 * `requiresTts: true` lets the quiz selector skip these types when the
 * browser has no Web Speech API or no Arabic voice.
 */

export const AUDIO_QUIZ_TYPES = {
  'listening-comprehension': {
    label: 'Listening Comprehension',
    component: 'ListeningComprehension',
    cluster: 'vocabulary',
    minLevel: 3,
    cefrMin: 'A2',
    requiresTts: true,
  },
  'dictation': {
    label: 'Dictation',
    component: 'Dictation',
    cluster: 'vocabulary',
    minLevel: 5,
    cefrMin: 'B1',
    requiresTts: true,
  },
};
