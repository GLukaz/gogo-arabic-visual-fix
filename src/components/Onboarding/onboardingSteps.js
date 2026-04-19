/**
 * onboardingSteps.js
 *
 * Declarative onboarding step definitions for the ContextualOnboarding system.
 * Step 2 guides new players directly to the alphabet button so they discover
 * letter learning within the first 3 steps.
 *
 * Each step:
 * - target: CSS selector for the highlighted element (or 'body' for center overlay)
 * - content: Instructional text shown to the player
 * - placement: Where the tooltip appears relative to the target
 * - trigger: EventBus event that auto-advances to the next step (null = manual advance)
 * - highlightNpc: (optional) NPC id to highlight with golden glow in-game
 */
export const onboardingSteps = [
  {
    target: 'body',
    content:
      'Welcome to GoGo Arabic! Use WASD or arrow keys to explore the world. Hold Shift to sprint!',
    placement: 'center',
    trigger: null,
  },
  {
    target: '[aria-label*="Alphabet module"]',
    content:
      'Start here! Learn the Arabic alphabet by clicking this button or pressing L. Master all 28 letters to unlock the full game!',
    placement: 'bottom',
    trigger: 'player-position-update',
  },
  {
    target: '[aria-label="Experience progress to next level"]',
    content:
      'This is your XP bar. Learn words and complete quests to level up and earn rewards!',
    placement: 'bottom',
    trigger: null,
  },
  {
    target: '[aria-label*="Quest log"]',
    content:
      'Check your quests here. Press Q anytime to open the quest log. Talk to NPCs to discover new quests!',
    placement: 'bottom',
    trigger: null,
  },
  {
    target: 'body',
    content:
      'Look for Scholar Yusuf nearby — he has a golden glow! Walk up to him and press Space to start your first quest.',
    placement: 'center',
    trigger: null,
    highlightNpc: 'oasis_village-scholar-yusuf',
  },
];
