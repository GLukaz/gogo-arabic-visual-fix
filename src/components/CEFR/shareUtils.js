/**
 * shareUtils.js — Social sharing utilities for CEFR Progress Report.
 *
 * Provides:
 *  - buildShareText: pure function composing share message from player stats
 *  - handleShare: async function using Web Share API with clipboard fallback
 */

/**
 * Build a shareable text string from player stats.
 *
 * @param {{ currentLevel: string, wordsLearned: number, playerLevel: number }} params
 * @returns {string}
 */
export function buildShareText({ currentLevel, wordsLearned, playerLevel }) {
  return [
    `I just reached ${currentLevel} in Arabic on Gogo Arabic!`,
    `${wordsLearned} words learned | Level ${playerLevel}`,
    `Play free: gogo-arabic.com`,
  ].join('\n');
}

/**
 * Attempt to share text via Web Share API, falling back to clipboard.writeText.
 * Dispatches showNotification on clipboard copy success or failure.
 *
 * @param {string} shareText - The text to share
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} showNotification - showNotification action creator from uiSlice
 */
export async function handleShare(shareText, dispatch, showNotification) {
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Gogo Arabic', text: shareText });
      return;
    } catch {
      // User cancelled or unsupported params — fall through to clipboard
    }
  }
  try {
    await navigator.clipboard.writeText(shareText);
    dispatch(showNotification({ message: 'Copied to clipboard!', type: 'success' }));
  } catch {
    // Clipboard not available (non-HTTPS, Firefox without permission)
    dispatch(showNotification({ message: 'Share not available', type: 'error' }));
  }
}
