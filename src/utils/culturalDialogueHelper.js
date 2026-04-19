import { getCulturalDialoguesForNPC } from '../data/culturalDialogues.js';

/**
 * Injects a "Learn about Arabic culture" choice into an NPC's default dialogue tree
 * if the NPC has cultural dialogues available
 *
 * @param {Object} npc - The NPC object
 * @param {Array} choices - The current choice array
 * @returns {Array} - The choices array with cultural option added (if applicable)
 */
export function injectCulturalDialogueChoice(npc, choices) {
  if (!npc || !choices) return choices;

  const culturalDialogues = getCulturalDialoguesForNPC(npc.id);

  // Only add the option if the NPC has cultural content
  if (!culturalDialogues || culturalDialogues.length === 0) {
    return choices;
  }

  // Check if cultural option already exists
  const hasCulturalOption = choices.some((c) => c.action === 'show_cultural_menu');
  if (hasCulturalOption) {
    return choices;
  }

  // Insert cultural option before the last choice (usually "goodbye")
  const culturalChoice = {
    arabic: 'عَلِّمْني عَنِ الثَّقافَةِ العَرَبِيَّة',
    english: 'Tell me about Arabic culture',
    action: 'show_cultural_menu',
  };

  // Insert before the last choice
  const newChoices = [...choices];
  newChoices.splice(newChoices.length - 1, 0, culturalChoice);

  return newChoices;
}

/**
 * Gets enhanced choices for a dialogue line
 * Automatically injects cultural dialogue option for NPCs that have cultural content
 *
 * @param {Object} npc - The NPC object
 * @param {Object} line - The dialogue line object
 * @returns {Array|null} - Enhanced choices or null if no choices
 */
export function getEnhancedDialogueChoices(npc, line) {
  if (!line || !line.choices) return null;

  // Only inject for default dialogue trees (return visits)
  // Don't inject in first meetings or special trees
  return injectCulturalDialogueChoice(npc, line.choices);
}
