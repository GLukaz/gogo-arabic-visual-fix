import { EventBus } from '../../../utils/eventBus.js';
import { EVENTS } from '../../../utils/eventBusTypes.js';
import { store } from '../../../store/store.js';
import { getDialogueForContext } from '../../../data/companionDialogue.js';
import { scaleDialogueComplexity } from '../../../utils/dialogueComplexity.js';

export class CompanionContext {
  constructor() {
    this.lastCommentTime = 0;
    this.commentCooldown = 10000;     // 10 seconds between comments
    this.shownComments = new Set();    // Track shown comment IDs (avoid repeats)
    this.lastZone = null;
  }

  /**
   * Check if companion should make a contextual comment.
   * Called every frame by CompanionManager.update(), but respects cooldown.
   */
  evaluateTriggers(companionId, time) {
    if (!companionId) return;

    // Respect cooldown
    if (time - this.lastCommentTime < this.commentCooldown) return;

    const state = store.getState();
    const currentZone = state.player?.currentZone;
    const cefrLevel = this._estimateCEFR(state);

    // Zone change trigger
    if (currentZone && currentZone !== this.lastZone) {
      this.lastZone = currentZone;
      const commentId = `${companionId}_zone_${currentZone}`;

      if (!this.shownComments.has(commentId)) {
        const lines = getDialogueForContext(companionId, { type: 'zone_enter', zone: currentZone });
        if (lines.length > 0) {
          const line = lines[0]; // First available line
          const scaled = scaleDialogueComplexity(line, cefrLevel);

          this.shownComments.add(commentId);
          this.lastCommentTime = time;

          EventBus.emit(EVENTS.COMPANION_CONTEXTUAL_COMMENT, {
            companionId,
            commentId,
            ...scaled,
            arabic: line.arabic,
            english: line.english,
            transliteration: line.transliteration,
          });
        }
      }
    }
  }

  /**
   * Emit a battle-triggered comment (called after battle ends).
   */
  emitBattleComment(companionId, outcome) {
    const state = store.getState();
    const cefrLevel = this._estimateCEFR(state);
    const lines = getDialogueForContext(companionId, { type: `battle_${outcome}` });

    if (lines.length > 0) {
      const line = lines[Math.floor(Math.random() * lines.length)];
      const scaled = scaleDialogueComplexity(line, cefrLevel);

      EventBus.emit(EVENTS.COMPANION_CONTEXTUAL_COMMENT, {
        companionId,
        commentId: `${companionId}_battle_${outcome}_${Date.now()}`,
        ...scaled,
        arabic: line.arabic,
        english: line.english,
        transliteration: line.transliteration,
      });
    }
  }

  _estimateCEFR(state) {
    const vocabCount = Object.keys(state.vocabulary?.fsrsCards || {}).length;
    if (vocabCount <= 100) return 'A1';
    if (vocabCount <= 500) return 'A2';
    if (vocabCount <= 1500) return 'B1';
    if (vocabCount <= 3000) return 'B2';
    if (vocabCount <= 5000) return 'C1';
    return 'C2';
  }

  /**
   * Reset shown comments (e.g., on new game session).
   */
  reset() {
    this.shownComments.clear();
    this.lastCommentTime = 0;
    this.lastZone = null;
  }
}
