import { z } from 'zod';

// Condition schema — when to show dialogue lines/choices
const conditionSchema = z.object({
  quest: z.object({
    id: z.string(),
    status: z.enum(['active', 'completed', 'not_started']).optional(),
  }).optional(),
  storyFlag: z.object({
    key: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
  }).optional(),
  relationship: z.object({
    min: z.number().min(0).max(5).optional(),
    max: z.number().min(0).max(5).optional(),
  }).optional(),
  vocabulary: z.object({
    wordId: z.string(),
    mastered: z.boolean().optional(),
  }).optional(),
  // learningPath condition — show line/choice only for a specific learning path
  // Valid values: 'scholar' | 'traveler' | 'historian'
  learningPath: z.enum(['scholar', 'traveler', 'historian']).optional(),
  not: z.lazy(() => conditionSchema).optional(),
}).passthrough();

// Effect schema — what happens after dialogue choices
const effectSchema = z.object({
  type: z.enum([
    'quest_start', 'quest_complete', 'relationship_change',
    'story_flag', 'teach_word', 'give_item', 'unlock_area',
    'change_npc_state', 'open_shop', 'world_state', 'reward'
  ]),
  questId: z.string().optional(),
  amount: z.number().optional(),
  flag: z.string().optional(),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  wordId: z.string().optional(),
  itemId: z.string().optional(),
  quantity: z.number().optional(),
  area: z.string().optional(),
  npcId: z.string().optional(),
  state: z.string().optional(),
}).passthrough();

// Personality schema — NPC personality traits
const personalitySchema = z.object({
  tone: z.string(), // formal_scholar, casual_merchant, gruff_warrior, etc.
  catchphrase: z.string().optional(),
  interests: z.array(z.string()).optional(),
  mood: z.string().optional(), // cheerful, serious, worried, excited
}).passthrough();

// Inline vocabulary schema — highlighted vocab words in dialogue
const inlineVocabSchema = z.object({
  wordId: z.string(),
  arabicText: z.string(),
});

// Dialogue line — spoken by NPC or player choice
const dialogueLineSchema = z.object({
  speaker: z.string().optional(),
  arabic: z.string().optional(),
  english: z.string().optional(),
  transliteration: z.string().optional(),
  teachWord: z.string().optional(),
  action: z.string().optional(),
  condition: conditionSchema.optional(),
  effects: z.array(effectSchema).optional(),
  inlineVocab: z.array(inlineVocabSchema).optional(),
  choices: z.array(z.object({
    arabic: z.string(),
    english: z.string(),
    next: z.string().nullable().optional(),
    condition: conditionSchema.optional(),
    effects: z.array(effectSchema).optional(),
    topic: z.string().optional(),
  }).passthrough()).optional(),
}).passthrough();

// Dialogue tree — a conversation branch
const dialogueTreeSchema = z.object({
  id: z.string(),
  trigger: z.string().optional(),
  topic: z.string().optional(),
  condition: conditionSchema.optional(),
  returnToHub: z.boolean().optional(),
  priority: z.number().optional(),
  lines: z.array(dialogueLineSchema).min(1),
}).passthrough();

// Greeting object
const greetingSchema = z.object({
  arabic: z.string(),
  english: z.string(),
  transliteration: z.string().optional(),
}).passthrough();

// NPC entry
const npcSchema = z.object({
  id: z.string(),
  name: z.string(),
  greeting: greetingSchema,
  dialogueTrees: z.array(dialogueTreeSchema).min(1),
  personality: personalitySchema.optional(),
  zone: z.string().optional(),
  topics: z.array(z.string()).optional(),
}).passthrough();

/** Full NPC data schema — array of NPC entries */
export const dialogueSchema = z.array(npcSchema);

/**
 * Validate NPC dialogue data against the schema.
 * @param {unknown} data - The parsed NPC JSON data
 * @returns {{ success: boolean, errors: string[] }}
 */
export function validateDialogueData(data) {
  const result = dialogueSchema.safeParse(data);
  if (result.success) {
    return { success: true, errors: [] };
  }
  const errors = result.error.issues.map(
    (issue) => `[${issue.path.join('.')}] ${issue.message}`
  );
  return { success: false, errors };
}
