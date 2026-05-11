import { store } from '../../../store/store.js';
import { COMPANION_DIALOGUE, getTeachingDialogue, getZoneDialogue } from '../../../data/companionDialogue.js';
import { COMPANIONS } from '../../../data/companions.js';
import { scaleDialogueComplexity } from '../../../utils/dialogueComplexity.js';
import { getRelationshipTier } from '../../../utils/companionRelationship.js';

export class CompanionDialogueManager {
  constructor() {
    // No scene dependency — this is a data manager, not a Phaser system
  }

  /**
   * Get available dialogue topics for a companion based on context.
   * @param {string} companionId
   * @param {Object} context — { zone, nearbyObjects, recentBattle, playerLevel }
   * @returns {Array} — [{ id, label, labelArabic, priority, category }]
   */
  getTopics(companionId, context) {
    const companion = COMPANIONS[companionId];
    if (!companion) return [];

    const state = store.getState();
    const relationship = state.companions?.companions?.[companionId]?.relationship ?? 0;
    const tier = getRelationshipTier(relationship);

    const topics = [];

    // 1. Greeting (always available)
    topics.push({
      id: 'greeting',
      label: 'Say hello',
      labelArabic: 'إلقاء التحية',
      priority: 0,
      category: 'greeting',
    });

    // 2. Zone-specific comment (if companion has dialogue for current zone)
    if (context.zone) {
      const zoneDialogue = getZoneDialogue(companionId, context.zone);
      if (zoneDialogue.length > 0) {
        topics.push({
          id: `zone_${context.zone}`,
          label: `About this area`,
          labelArabic: 'عن هذا المكان',
          priority: 1,
          category: 'zone',
        });
      }
    }

    // 3. Teaching topic (based on specialty)
    topics.push({
      id: `teach_${companion.teachingSpecialty}`,
      label: `Learn ${companion.teachingSpecialty}`,
      labelArabic: `تعلم ${COMPANIONS[companionId]?.teachingSpecialty || ''}`,
      priority: 2,
      category: 'teaching',
    });

    // 4. Relationship-gated topics
    if (tier.label === 'Friend' || tier.label === 'Close Friend' || tier.label === 'Best Friend') {
      topics.push({
        id: 'personal',
        label: 'How are you feeling?',
        labelArabic: 'كيف حالك؟',
        priority: 3,
        category: 'relationship',
      });
    }

    // 5. Gift option
    topics.push({
      id: 'give_gift',
      label: 'Give a gift',
      labelArabic: 'قدم هدية',
      priority: 10,
      category: 'gift',
    });

    return topics.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get dialogue lines for a selected topic.
   * Scales Arabic complexity based on player CEFR level.
   */
  getDialogueForTopic(companionId, topicId, _context) {
    const state = store.getState();
    const cefrLevel = this._estimateCEFR(state);
    const relationship = state.companions?.companions?.[companionId]?.relationship ?? 0;

    let rawLines = [];

    if (topicId === 'greeting') {
      rawLines = COMPANION_DIALOGUE[companionId]?.greetings || [];
    } else if (topicId.startsWith('zone_')) {
      const zone = topicId.replace('zone_', '');
      rawLines = getZoneDialogue(companionId, zone);
    } else if (topicId.startsWith('teach_')) {
      const topic = topicId.replace('teach_', '');
      rawLines = getTeachingDialogue(companionId, topic);
    } else if (topicId === 'personal') {
      const tier = getRelationshipTier(relationship);
      rawLines = COMPANION_DIALOGUE[companionId]?.relationship?.[tier.label.toLowerCase().replace(' ', '_')] || [];
    } else if (topicId === 'give_gift') {
      // Gift UI handled by React — return prompt line
      rawLines = [{ arabic: 'ماذا تريد أن تقدم لي؟', english: 'What would you like to give me?', transliteration: 'madha turid an tuqaddim li?' }];
    }

    // Scale complexity based on CEFR level
    return rawLines.map(line => ({
      ...line,
      ...scaleDialogueComplexity(line, cefrLevel),
    }));
  }

  /**
   * Estimate player CEFR level from vocabulary count.
   * A1: 0-100, A2: 101-500, B1: 501-1500, B2: 1501-3000, C1: 3001-5000, C2: 5001+
   */
  _estimateCEFR(state) {
    const vocabCount = Object.keys(state.vocabulary?.fsrsCards || {}).length;
    if (vocabCount <= 100) return 'A1';
    if (vocabCount <= 500) return 'A2';
    if (vocabCount <= 1500) return 'B1';
    if (vocabCount <= 3000) return 'B2';
    if (vocabCount <= 5000) return 'C1';
    return 'C2';
  }
}
