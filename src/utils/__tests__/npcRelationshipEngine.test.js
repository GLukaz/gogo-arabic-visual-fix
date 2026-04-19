import { describe, it, expect } from 'vitest';
import { decayRelationships, getNpcGiftPreference } from '../npcRelationshipEngine.js';

// ─── decayRelationships ───────────────────────────────────────────────────────

describe('decayRelationships', () => {
  it('reduces friendship by 1 point per day', () => {
    const result = decayRelationships({ 'elder-tariq': 60 }, 1);
    expect(result['elder-tariq']).toBe(59);
  });

  it('reduces friendship by N points for N days', () => {
    const result = decayRelationships({ 'scholar-yusuf': 70 }, 5);
    expect(result['scholar-yusuf']).toBe(65);
  });

  it('floors friendship at 0 — never goes negative', () => {
    const result = decayRelationships({ 'guide-amira': 2 }, 10);
    expect(result['guide-amira']).toBe(0);
  });

  it('exact decay to 0 stays at 0', () => {
    const result = decayRelationships({ 'healer-khadija': 3 }, 3);
    expect(result['healer-khadija']).toBe(0);
  });

  it('decays multiple NPCs independently', () => {
    const result = decayRelationships(
      { 'elder-tariq': 80, 'farmer-omar': 10 },
      3,
    );
    expect(result['elder-tariq']).toBe(77);
    expect(result['farmer-omar']).toBe(7);
  });

  it('0 days elapsed returns unchanged friendships', () => {
    const result = decayRelationships({ 'scholar-yusuf': 50 }, 0);
    expect(result['scholar-yusuf']).toBe(50);
  });

  it('fractional days are floored (only whole days decay)', () => {
    const result = decayRelationships({ 'guide-amira': 50 }, 1.9);
    expect(result['guide-amira']).toBe(49); // floor(1.9) = 1
  });

  it('returns empty object for empty relationships', () => {
    const result = decayRelationships({}, 5);
    expect(result).toEqual({});
  });
});

// ─── getNpcGiftPreference ─────────────────────────────────────────────────────

describe('getNpcGiftPreference', () => {
  it('returns 5.0 for a favorite category', () => {
    // elder-tariq favorites: food, cultural
    expect(getNpcGiftPreference('elder-tariq', 'food')).toBe(5.0);
    expect(getNpcGiftPreference('elder-tariq', 'cultural')).toBe(5.0);
  });

  it('returns 2.0 for a liked category', () => {
    // elder-tariq liked: books
    expect(getNpcGiftPreference('elder-tariq', 'books')).toBe(2.0);
  });

  it('returns 1.0 for a neutral category', () => {
    // elder-tariq has no preference for crafts
    expect(getNpcGiftPreference('elder-tariq', 'crafts')).toBe(1.0);
  });

  it('returns 0.5 for a disliked category', () => {
    // elder-tariq dislikes: tools, luxury
    expect(getNpcGiftPreference('elder-tariq', 'tools')).toBe(0.5);
    expect(getNpcGiftPreference('elder-tariq', 'luxury')).toBe(0.5);
  });

  it('returns 1.0 for unknown NPC (neutral default)', () => {
    expect(getNpcGiftPreference('unknown-npc', 'food')).toBe(1.0);
  });

  it('scholar-yusuf favorites books and cultural', () => {
    expect(getNpcGiftPreference('scholar-yusuf', 'books')).toBe(5.0);
    expect(getNpcGiftPreference('scholar-yusuf', 'cultural')).toBe(5.0);
  });

  it('scholar-yusuf dislikes clothing and luxury', () => {
    expect(getNpcGiftPreference('scholar-yusuf', 'clothing')).toBe(0.5);
    expect(getNpcGiftPreference('scholar-yusuf', 'luxury')).toBe(0.5);
  });

  it('farmer-omar favorites food and tools', () => {
    expect(getNpcGiftPreference('farmer-omar', 'food')).toBe(5.0);
    expect(getNpcGiftPreference('farmer-omar', 'tools')).toBe(5.0);
  });

  it('healer-khadija favorites food and crafts', () => {
    expect(getNpcGiftPreference('healer-khadija', 'food')).toBe(5.0);
    expect(getNpcGiftPreference('healer-khadija', 'crafts')).toBe(5.0);
  });
});
