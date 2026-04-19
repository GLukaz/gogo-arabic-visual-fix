/**
 * npcRelationshipService.js
 * GROW-017: NPC relationship consequences — shop discounts, quest filtering,
 * dialogue variants, and battle assist chance based on relationship tier.
 *
 * Tiers: Hostile (<20), Cold (20-39), Neutral (40-59), Friendly (60-79), Beloved (80-100)
 * All functions are pure — no Redux dependency.
 */

export const RELATIONSHIP_TIERS = Object.freeze({
  HOSTILE:  { name: 'Hostile',  min: 0,  max: 19,  key: 'hostile' },
  COLD:     { name: 'Cold',     min: 20, max: 39,  key: 'cold' },
  NEUTRAL:  { name: 'Neutral',  min: 40, max: 59,  key: 'neutral' },
  FRIENDLY: { name: 'Friendly', min: 60, max: 79,  key: 'friendly' },
  BELOVED:  { name: 'Beloved',  min: 80, max: 100, key: 'beloved' },
});

/**
 * getTier(relationship) — returns the tier object for a relationship value (0-100).
 */
export function getTier(relationship) {
  const r = Math.max(0, Math.min(100, relationship ?? 0));
  if (r >= 80) return RELATIONSHIP_TIERS.BELOVED;
  if (r >= 60) return RELATIONSHIP_TIERS.FRIENDLY;
  if (r >= 40) return RELATIONSHIP_TIERS.NEUTRAL;
  if (r >= 20) return RELATIONSHIP_TIERS.COLD;
  return RELATIONSHIP_TIERS.HOSTILE;
}

/**
 * getShopDiscount(npcId, relationship) — returns shop discount as a fraction (0.0–0.25).
 *
 * Hostile: -0% (no discount, may refuse service)
 * Cold: 0%
 * Neutral: 5%
 * Friendly: 15%
 * Beloved: 25%
 */
export function getShopDiscount(npcId, relationship) {
  if (!npcId) return 0;
  const tier = getTier(relationship);
  const discounts = {
    hostile:  0,
    cold:     0,
    neutral:  0.05,
    friendly: 0.15,
    beloved:  0.25,
  };
  return discounts[tier.key];
}

/**
 * getAvailableQuests(npcId, relationship, allQuests) — filters quests by relationship requirement.
 *
 * Each quest may have a `minRelationship` field. Quests without it are always available.
 * Hostile NPCs refuse to give quests (returns []).
 *
 * @param {string} npcId
 * @param {number} relationship
 * @param {Array<{ npcGiver: string, minRelationship?: number }>} allQuests
 * @returns {Array} filtered quests
 */
export function getAvailableQuests(npcId, relationship, allQuests = []) {
  if (!npcId) return [];
  const tier = getTier(relationship);
  if (tier.key === 'hostile') return [];

  return allQuests.filter((quest) => {
    if (quest.npcGiver && quest.npcGiver !== npcId) return false;
    const minRel = quest.minRelationship ?? 0;
    return relationship >= minRel;
  });
}

/**
 * getDialogueVariant(npcId, relationship) — returns the dialogue key for the relationship tier.
 *
 * @returns {'hostile' | 'cold' | 'neutral' | 'friendly' | 'beloved'}
 */
export function getDialogueVariant(npcId, relationship) {
  if (!npcId) return 'neutral';
  return getTier(relationship).key;
}

/**
 * getBattleAssistChance(npcId, relationship) — probability (0–0.15) that an NPC joins battle.
 *
 * Hostile/Cold: 0%
 * Neutral: 0%
 * Friendly: 7%
 * Beloved: 15%
 */
export function getBattleAssistChance(npcId, relationship) {
  if (!npcId) return 0;
  const tier = getTier(relationship);
  const chances = {
    hostile:  0,
    cold:     0,
    neutral:  0,
    friendly: 0.07,
    beloved:  0.15,
  };
  return chances[tier.key];
}
