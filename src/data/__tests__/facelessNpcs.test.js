import { describe, it, expect } from 'vitest';
import { NPC_KEY_MAP } from '../spriteKeyMap.js';

// Phase 97 Plan 01 Wave 0 — RED until Plan 03 rewires NPC_KEY_MAP to faceless-only sprites
// (npc-scholar-yusuf, npc-merchant-fatima, etc. — the 24 faceless PNGs at
// public/assets/sprites/npcs/faceless/*.png).

describe('faceless NPC enforcement', () => {
  const FACELESS_PREFIX = 'npc-';
  // Every sprite key matching these patterns has a visible face (cultural violation).
  const FACE_VISIBLE_PATTERNS = [
    /^kenmi-desert-npc-desert-person-/,
    /^kenmi-desert-npc-pharaoh/,
    /^kenmi-desert-npc-traders-/,
    /^kenmi-base-npcs-premade-/,
  ];

  it('NPC_KEY_MAP contains at least 20 entries', () => {
    expect(Object.keys(NPC_KEY_MAP).length).toBeGreaterThanOrEqual(20);
  });

  for (const [logicalId, spriteKey] of Object.entries(NPC_KEY_MAP)) {
    it(`${logicalId} maps to a faceless sprite key`, () => {
      const isFaceVisible = FACE_VISIBLE_PATTERNS.some((re) => re.test(spriteKey));
      expect(
        isFaceVisible,
        `${logicalId} → ${spriteKey} is face-bearing; must be rewired to npc-* faceless asset`,
      ).toBe(false);
      expect(
        spriteKey.startsWith(FACELESS_PREFIX) || spriteKey.includes('faceless'),
        `${spriteKey} must be a faceless asset`,
      ).toBe(true);
    });
  }
});
