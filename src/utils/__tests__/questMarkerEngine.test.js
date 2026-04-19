import { describe, it, expect } from 'vitest';
import {
  getNpcQuestMarker,
  getAvailableQuests,
  checkQuestPreconditions,
} from '../questMarkerEngine.js';

// ─── Test helpers ─────────────────────────────────────────────────────────────

function makeQuest(overrides = {}) {
  return {
    id: 'q1',
    npcGiver: 'guide',
    target: 3,
    prerequisites: [],
    ...overrides,
  };
}

function makeQuestState(overrides = {}) {
  return {
    q1: { status: 'locked', progress: 0, rewardClaimed: false },
    ...overrides,
  };
}

function makePlayerState(overrides = {}) {
  return {
    cefrLevel: null,
    level: 1,
    friendship: {},
    ...overrides,
  };
}

// ─── checkQuestPreconditions ─────────────────────────────────────────────────

describe('checkQuestPreconditions', () => {
  it('returns true when no preconditions defined', () => {
    const qd = makeQuest({ prerequisites: [] });
    expect(checkQuestPreconditions(qd, makeQuestState(), makePlayerState())).toBe(true);
  });

  it('returns false when a prerequisite quest is not completed', () => {
    const qd = makeQuest({ prerequisites: ['q_pre'] });
    const qs = makeQuestState({ q_pre: { status: 'locked', progress: 0 } });
    expect(checkQuestPreconditions(qd, qs, makePlayerState())).toBe(false);
  });

  it('returns true when all prerequisite quests are completed', () => {
    const qd = makeQuest({ prerequisites: ['q_pre'] });
    const qs = makeQuestState({ q_pre: { status: 'completed', progress: 3 } });
    expect(checkQuestPreconditions(qd, qs, makePlayerState())).toBe(true);
  });

  it('returns false when CEFR level gate not met', () => {
    const qd = makeQuest({ cefrRequired: 'B1' });
    const player = makePlayerState({ cefrLevel: 'A1' });
    expect(checkQuestPreconditions(qd, makeQuestState(), player)).toBe(false);
  });

  it('returns true when CEFR level gate is met', () => {
    const qd = makeQuest({ cefrRequired: 'A2' });
    const player = makePlayerState({ cefrLevel: 'B1' });
    expect(checkQuestPreconditions(qd, makeQuestState(), player)).toBe(true);
  });

  it('returns false when friendship gate not met', () => {
    const qd = makeQuest({ friendshipRequired: { npcId: 'guide-amira', minimum: 60 } });
    const player = makePlayerState({ friendship: { 'guide-amira': 40 } });
    expect(checkQuestPreconditions(qd, makeQuestState(), player)).toBe(false);
  });

  it('returns true when friendship gate met exactly', () => {
    const qd = makeQuest({ friendshipRequired: { npcId: 'guide-amira', minimum: 60 } });
    const player = makePlayerState({ friendship: { 'guide-amira': 60 } });
    expect(checkQuestPreconditions(qd, makeQuestState(), player)).toBe(true);
  });

  it('returns false when level gate not met', () => {
    const qd = makeQuest({ levelRequired: 5 });
    const player = makePlayerState({ level: 3 });
    expect(checkQuestPreconditions(qd, makeQuestState(), player)).toBe(false);
  });

  it('returns true when level gate met', () => {
    const qd = makeQuest({ levelRequired: 5 });
    const player = makePlayerState({ level: 5 });
    expect(checkQuestPreconditions(qd, makeQuestState(), player)).toBe(true);
  });
});

// ─── getNpcQuestMarker ───────────────────────────────────────────────────────

describe('getNpcQuestMarker', () => {
  it('returns null when no quests match the NPC', () => {
    const defs = [makeQuest({ npcGiver: 'scholar' })];
    const result = getNpcQuestMarker('guide', makeQuestState(), makePlayerState(), defs);
    expect(result).toBeNull();
  });

  it('returns "available" when quest is locked and preconditions met', () => {
    const defs = [makeQuest({ npcGiver: 'guide' })];
    const qs = makeQuestState({ q1: { status: 'locked', progress: 0 } });
    const result = getNpcQuestMarker('guide', qs, makePlayerState(), defs);
    expect(result).toBe('available');
  });

  it('returns null when quest is locked but preconditions not met (missing prerequisite)', () => {
    const defs = [makeQuest({ npcGiver: 'guide', prerequisites: ['q_pre'] })];
    const qs = makeQuestState({ q_pre: { status: 'active', progress: 0 } });
    const result = getNpcQuestMarker('guide', qs, makePlayerState(), defs);
    expect(result).toBeNull();
  });

  it('returns "active" when quest is in progress', () => {
    const defs = [makeQuest({ npcGiver: 'guide', target: 3 })];
    const qs = makeQuestState({ q1: { status: 'active', progress: 1 } });
    const result = getNpcQuestMarker('guide', qs, makePlayerState(), defs);
    expect(result).toBe('active');
  });

  it('returns "completable" when active quest progress meets target', () => {
    const defs = [makeQuest({ npcGiver: 'guide', target: 3 })];
    const qs = makeQuestState({ q1: { status: 'active', progress: 3 } });
    const result = getNpcQuestMarker('guide', qs, makePlayerState(), defs);
    expect(result).toBe('completable');
  });

  it('"completable" takes priority over "active"', () => {
    const defs = [
      makeQuest({ id: 'qa', npcGiver: 'guide', target: 5 }),
      makeQuest({ id: 'qb', npcGiver: 'guide', target: 2 }),
    ];
    const qs = {
      qa: { status: 'active', progress: 2, rewardClaimed: false }, // active but not done
      qb: { status: 'active', progress: 2, rewardClaimed: false }, // completable
    };
    const result = getNpcQuestMarker('guide', qs, makePlayerState(), defs);
    expect(result).toBe('completable');
  });

  it('matches NPC by prefix (e.g. "guide" matches "guide-amira")', () => {
    const defs = [makeQuest({ npcGiver: 'guide' })];
    const qs = makeQuestState({ q1: { status: 'active', progress: 1 } });
    const result = getNpcQuestMarker('guide-amira', qs, makePlayerState(), defs);
    expect(result).toBe('active');
  });

  it('ignores completed+claimed quests', () => {
    const defs = [makeQuest({ npcGiver: 'guide' })];
    const qs = makeQuestState({ q1: { status: 'completed', progress: 3, rewardClaimed: true } });
    const result = getNpcQuestMarker('guide', qs, makePlayerState(), defs);
    expect(result).toBeNull();
  });

  it('quest chain: returns "available" only after prerequisite completed', () => {
    const defs = [
      makeQuest({ id: 'q_pre', npcGiver: 'scholar' }),
      makeQuest({ id: 'q1', npcGiver: 'guide', prerequisites: ['q_pre'] }),
    ];
    const qsNotDone = { q_pre: { status: 'active', progress: 1 }, q1: { status: 'locked', progress: 0 } };
    const qsDone    = { q_pre: { status: 'completed', progress: 3 }, q1: { status: 'locked', progress: 0 } };

    expect(getNpcQuestMarker('guide', qsNotDone, makePlayerState(), defs)).toBeNull();
    expect(getNpcQuestMarker('guide', qsDone, makePlayerState(), defs)).toBe('available');
  });
});

// ─── getAvailableQuests ──────────────────────────────────────────────────────

describe('getAvailableQuests', () => {
  it('returns empty array when no quests are locked', () => {
    const defs = [makeQuest()];
    const qs = makeQuestState({ q1: { status: 'active', progress: 0 } });
    expect(getAvailableQuests(makePlayerState(), defs, qs)).toHaveLength(0);
  });

  it('returns locked quest when all preconditions met', () => {
    const defs = [makeQuest()];
    const qs = makeQuestState({ q1: { status: 'locked', progress: 0 } });
    const result = getAvailableQuests(makePlayerState(), defs, qs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('q1');
  });

  it('excludes locked quest whose prerequisites are not yet done', () => {
    const defs = [makeQuest({ prerequisites: ['q_pre'] })];
    const qs = makeQuestState({ q_pre: { status: 'active' }, q1: { status: 'locked' } });
    expect(getAvailableQuests(makePlayerState(), defs, qs)).toHaveLength(0);
  });

  it('filters correctly when multiple quests exist', () => {
    const defs = [
      makeQuest({ id: 'qa', npcGiver: 'guide', prerequisites: [] }),
      makeQuest({ id: 'qb', npcGiver: 'scholar', cefrRequired: 'B1' }),
    ];
    const qs = { qa: { status: 'locked' }, qb: { status: 'locked' } };
    const result = getAvailableQuests(makePlayerState({ cefrLevel: 'A1' }), defs, qs);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('qa');
  });
});
