import { describe, it, expect } from 'vitest';
import { getNpcContextLine, NPC_CONTEXT_DIALOGUE } from '../npcContextDialogue.js';

// ─── Helper: build minimal playerState ────────────────────────────────────────

function makeState({
  cefrLevel = 'A1',
  factions = {},
  vocabCount = 0,
  completedQuests = [],
} = {}) {
  return { cefrLevel, factions, vocabCount, completedQuests };
}

// ─── getNpcContextLine — basic behavior ───────────────────────────────────────

describe('getNpcContextLine — null / unknown inputs', () => {
  it('returns null for null npcId', () => {
    expect(getNpcContextLine(null, makeState())).toBeNull();
  });

  it('returns null for undefined npcId', () => {
    expect(getNpcContextLine(undefined, makeState())).toBeNull();
  });

  it('returns null for null playerState', () => {
    expect(getNpcContextLine('scholar-yusuf', null)).toBeNull();
  });

  it('returns null for an npcId not in the data', () => {
    expect(getNpcContextLine('unknown-npc-999', makeState())).toBeNull();
  });

  it('returns null when no condition matches (fresh player)', () => {
    // vocabCount=0, no quests, no faction, cefrLevel=A1 — nothing matches
    const state = makeState();
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result).toBeNull();
  });
});

// ─── vocabCount condition ────────────────────────────────────────────────────

describe('getNpcContextLine — vocabCount condition', () => {
  it('returns a line when vocabCount meets the minimum', () => {
    const state = makeState({ vocabCount: 10 });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('arabic');
    expect(result).toHaveProperty('english');
  });

  it('does not return a vocabCount line when count is too low', () => {
    const state = makeState({ vocabCount: 5 });
    expect(getNpcContextLine('scholar-yusuf', state)).toBeNull();
  });

  it('returns the most specific (last matching) vocabCount line', () => {
    // scholar-yusuf has lines at min=10, min=50, min=100
    // With vocabCount=100, the min=100 line should win
    const state = makeState({ vocabCount: 100 });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('مِئَة');
  });

  it('returns the correct vocabCount tier for 50 words', () => {
    const state = makeState({ vocabCount: 50 });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('خَمسون');
  });
});

// ─── cefrLevel condition ─────────────────────────────────────────────────────

describe('getNpcContextLine — cefrLevel condition', () => {
  it('returns a cefrLevel line over vocabCount when both match', () => {
    // cefrLevel has higher priority than vocabCount
    const state = makeState({ vocabCount: 100, cefrLevel: 'A2' });
    const result = getNpcContextLine('scholar-yusuf', state);
    // Must be a cefrLevel result, not a vocabCount result
    expect(result.arabic).toContain('A2');
  });

  it('returns B1-specific line when player is at B1', () => {
    const state = makeState({ cefrLevel: 'B1', vocabCount: 50 });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('B1');
  });

  it('a B1 player matches both A2 and B1 cefrLevel conditions — B1 wins (last match)', () => {
    const state = makeState({ cefrLevel: 'B1' });
    const result = getNpcContextLine('librarian-ibrahim', state);
    expect(result.arabic).toContain('B1');
  });

  it('an A1 player does not match A2 cefrLevel condition', () => {
    const state = makeState({ cefrLevel: 'A1', vocabCount: 0 });
    expect(getNpcContextLine('scholar-yusuf', state)).toBeNull();
  });
});

// ─── factionTier condition ────────────────────────────────────────────────────

describe('getNpcContextLine — factionTier condition', () => {
  it('returns a factionTier line over cefrLevel when both match', () => {
    // factionTier has higher priority than cefrLevel
    const state = makeState({
      cefrLevel: 'A2',
      factions: { scholars: 30 }, // Friendly tier (score 25+)
    });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('صَديق العُلَماء');
  });

  it('returns Trusted-tier line when score >= 50', () => {
    const state = makeState({ factions: { scholars: 60 } });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('مَوثوق');
  });

  it('returns Friendly line (not Trusted) when score = 30', () => {
    const state = makeState({ factions: { scholars: 30 } });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('صَديق العُلَماء');
  });

  it('returns null for faction condition when score is 0 (Neutral)', () => {
    const state = makeState({ factions: { scholars: 0 } });
    expect(getNpcContextLine('librarian-ibrahim', state)).toBeNull();
  });

  it('faction condition for different factions only applies to that faction', () => {
    // scholar-yusuf factionTier lines check 'scholars' — merchants score should not matter
    const state = makeState({ factions: { merchants: 60 } });
    expect(getNpcContextLine('scholar-yusuf', state)).toBeNull();
  });
});

// ─── questComplete condition ─────────────────────────────────────────────────

describe('getNpcContextLine — questComplete condition', () => {
  it('returns a questComplete line over factionTier when both match', () => {
    // questComplete has highest priority
    const state = makeState({
      factions: { scholars: 60 },
      completedQuests: ['master_of_letters'],
    });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result.arabic).toContain('اختِبار الأَحرُف');
  });

  it('returns quest line when only quest is completed', () => {
    const state = makeState({ completedQuests: ['market_talk'] });
    const result = getNpcContextLine('merchant-fatima', state);
    expect(result.arabic).toContain('السّوق');
  });

  it('returns null when quest condition quest is not in completedQuests', () => {
    const state = makeState({ completedQuests: ['some_other_quest'] });
    // scholar-yusuf has no vocabCount/cefr matches at 0 words / A1
    expect(getNpcContextLine('scholar-yusuf', state)).toBeNull();
  });

  it('returns the last matching quest line when multiple quest conditions match', () => {
    // merchant-fatima has questComplete conditions for 'market_talk' and 'merchant_master'
    const state = makeState({ completedQuests: ['market_talk', 'merchant_master'] });
    const result = getNpcContextLine('merchant-fatima', state);
    // 'merchant_master' line is last, so it should win
    expect(result.arabic).toContain('سَيِّد التُّجّار');
  });
});

// ─── Priority ordering ────────────────────────────────────────────────────────

describe('getNpcContextLine — priority ordering', () => {
  it('questComplete beats factionTier beats cefrLevel beats vocabCount', () => {
    const state = makeState({
      vocabCount: 100,
      cefrLevel: 'B1',
      factions: { scholars: 60 },
      completedQuests: ['master_of_letters'],
    });
    const result = getNpcContextLine('scholar-yusuf', state);
    // Should be the questComplete line
    expect(result.arabic).toContain('اختِبار الأَحرُف');
  });

  it('factionTier beats cefrLevel when no quest matches', () => {
    const state = makeState({
      cefrLevel: 'B1',
      factions: { scholars: 60 },
    });
    const result = getNpcContextLine('scholar-yusuf', state);
    // Should be the Trusted factionTier line
    expect(result.arabic).toContain('مَوثوق');
  });

  it('cefrLevel beats vocabCount when no quest or faction matches', () => {
    const state = makeState({ vocabCount: 100, cefrLevel: 'B1' });
    const result = getNpcContextLine('scholar-yusuf', state);
    // Should be the B1 cefrLevel line
    expect(result.arabic).toContain('B1');
  });
});

// ─── Data coverage ────────────────────────────────────────────────────────────

describe('NPC_CONTEXT_DIALOGUE data coverage', () => {
  it('has data for 20+ NPCs', () => {
    const npcIds = Object.keys(NPC_CONTEXT_DIALOGUE);
    expect(npcIds.length).toBeGreaterThanOrEqual(20);
  });

  it('every NPC entry has at least 5 lines', () => {
    for (const [npcId, lines] of Object.entries(NPC_CONTEXT_DIALOGUE)) {
      expect(lines.length, `${npcId} should have >= 5 lines`).toBeGreaterThanOrEqual(5);
    }
  });

  it('every line has arabic and english fields', () => {
    for (const [npcId, lines] of Object.entries(NPC_CONTEXT_DIALOGUE)) {
      for (const line of lines) {
        expect(line, `${npcId} line missing arabic`).toHaveProperty('arabic');
        expect(line, `${npcId} line missing english`).toHaveProperty('english');
        expect(typeof line.arabic, `${npcId} arabic is not string`).toBe('string');
        expect(typeof line.english, `${npcId} english is not string`).toBe('string');
      }
    }
  });

  it('every line has a valid condition type', () => {
    const validTypes = ['questComplete', 'factionTier', 'cefrLevel', 'vocabCount'];
    for (const [npcId, lines] of Object.entries(NPC_CONTEXT_DIALOGUE)) {
      for (const line of lines) {
        expect(validTypes, `${npcId} has invalid condition type: ${line.condition?.type}`)
          .toContain(line.condition?.type);
      }
    }
  });

  it('includes scholar-yusuf, merchant-fatima, guard-hamza, captain-rashid, vizier-abbas', () => {
    expect(NPC_CONTEXT_DIALOGUE).toHaveProperty('scholar-yusuf');
    expect(NPC_CONTEXT_DIALOGUE).toHaveProperty('merchant-fatima');
    expect(NPC_CONTEXT_DIALOGUE).toHaveProperty('guard-hamza');
    expect(NPC_CONTEXT_DIALOGUE).toHaveProperty('captain-rashid');
    expect(NPC_CONTEXT_DIALOGUE).toHaveProperty('vizier-abbas');
  });

  it('getNpcContextLine returns object with only arabic + english keys', () => {
    const state = makeState({ vocabCount: 100 });
    const result = getNpcContextLine('scholar-yusuf', state);
    expect(result).not.toBeNull();
    const keys = Object.keys(result);
    expect(keys).toContain('arabic');
    expect(keys).toContain('english');
    expect(keys).toHaveLength(2);
  });
});
