import { describe, it, expect } from 'vitest';
import { CompoundEffectResolver } from '../CompoundEffectResolver';

describe('CompoundEffectResolver', () => {
  // ──────────────────────────────────────────────────
  // checkForCompounds
  // ──────────────────────────────────────────────────
  describe('checkForCompounds', () => {
    it('returns null when no compound possible', () => {
      const activeEffects = [
        { id: 'poison', remainingTurns: 2 },
        { id: 'shield', remainingTurns: 3 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).toBeNull();
    });

    it('detects resilience from shield + strength', () => {
      const activeEffects = [
        { id: 'shield', remainingTurns: 3 },
        { id: 'strength', remainingTurns: 3 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).not.toBeNull();
      expect(result.id).toBe('resilience');
    });

    it('detects corrosion from poison + burn', () => {
      const activeEffects = [
        { id: 'poison', remainingTurns: 2 },
        { id: 'burn', remainingTurns: 3 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).not.toBeNull();
      expect(result.id).toBe('corrosion');
    });

    it('detects petrify from freeze + slow', () => {
      const activeEffects = [
        { id: 'freeze', remainingTurns: 1 },
        { id: 'slow', remainingTurns: 2 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).not.toBeNull();
      expect(result.id).toBe('petrify');
    });

    it('returns compound with shouldReplace listing component IDs', () => {
      const activeEffects = [
        { id: 'shield', remainingTurns: 3 },
        { id: 'strength', remainingTurns: 3 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result.shouldReplace).toBeDefined();
      expect(result.shouldReplace).toContain('shield');
      expect(result.shouldReplace).toContain('strength');
    });

    it('returns null when only 1 of 2 components present', () => {
      const activeEffects = [{ id: 'shield', remainingTurns: 3 }];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).toBeNull();
    });

    it('returns null for empty active effects', () => {
      const result = CompoundEffectResolver.checkForCompounds([]);
      expect(result).toBeNull();
    });

    it('detects clarity from wisdom + focus', () => {
      const activeEffects = [
        { id: 'wisdom', remainingTurns: 3 },
        { id: 'focus', remainingTurns: 3 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).not.toBeNull();
      expect(result.id).toBe('clarity');
    });

    it('detects berserk from strength + courage', () => {
      const activeEffects = [
        { id: 'strength', remainingTurns: 2 },
        { id: 'courage', remainingTurns: 3 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).not.toBeNull();
      expect(result.id).toBe('berserk');
    });

    it('detects doom from curse + weakness', () => {
      const activeEffects = [
        { id: 'curse', remainingTurns: 3 },
        { id: 'weakness', remainingTurns: 2 },
      ];
      const result = CompoundEffectResolver.checkForCompounds(activeEffects);
      expect(result).not.toBeNull();
      expect(result.id).toBe('doom');
    });
  });

  // ──────────────────────────────────────────────────
  // resolveCompounds
  // ──────────────────────────────────────────────────
  describe('resolveCompounds', () => {
    it('replaces component effects with compound effect', () => {
      const activeEffects = [
        { id: 'shield', remainingTurns: 3 },
        { id: 'strength', remainingTurns: 3 },
      ];
      const resolved = CompoundEffectResolver.resolveCompounds(activeEffects);
      const ids = resolved.map((e) => e.id);
      expect(ids).toContain('resilience');
      expect(ids).not.toContain('shield');
      expect(ids).not.toContain('strength');
    });

    it('preserves non-component effects in the array', () => {
      const activeEffects = [
        { id: 'shield', remainingTurns: 3 },
        { id: 'strength', remainingTurns: 3 },
        { id: 'regen', remainingTurns: 2 },
      ];
      const resolved = CompoundEffectResolver.resolveCompounds(activeEffects);
      const ids = resolved.map((e) => e.id);
      expect(ids).toContain('resilience');
      expect(ids).toContain('regen');
      expect(ids).not.toContain('shield');
      expect(ids).not.toContain('strength');
    });

    it('handles multiple possible compounds — picks first match', () => {
      // strength + shield = resilience, strength + courage = berserk
      // With all three, first compound in COMPOUND_EFFECTS order wins
      const activeEffects = [
        { id: 'shield', remainingTurns: 3 },
        { id: 'strength', remainingTurns: 3 },
        { id: 'courage', remainingTurns: 2 },
      ];
      const resolved = CompoundEffectResolver.resolveCompounds(activeEffects);
      const ids = resolved.map((e) => e.id);
      // resilience is first in COMPOUND_EFFECTS, so it should be picked
      expect(ids).toContain('resilience');
      // After replacing shield+strength, courage remains, but berserk needs strength which is consumed
      expect(ids).toContain('courage');
    });

    it('returns unchanged array when no compounds possible', () => {
      const activeEffects = [
        { id: 'poison', remainingTurns: 2 },
        { id: 'shield', remainingTurns: 3 },
      ];
      const resolved = CompoundEffectResolver.resolveCompounds(activeEffects);
      expect(resolved).toEqual(activeEffects);
    });

    it('compound effect has correct remainingTurns from definition', () => {
      const activeEffects = [
        { id: 'poison', remainingTurns: 2 },
        { id: 'burn', remainingTurns: 3 },
      ];
      const resolved = CompoundEffectResolver.resolveCompounds(activeEffects);
      const corrosion = resolved.find((e) => e.id === 'corrosion');
      expect(corrosion).toBeDefined();
      // corrosion compound definition has turns: 2
      expect(corrosion.remainingTurns).toBe(2);
    });

    it('returns empty array for empty input', () => {
      const resolved = CompoundEffectResolver.resolveCompounds([]);
      expect(resolved).toEqual([]);
    });
  });

  // ──────────────────────────────────────────────────
  // getCompoundArabic
  // ──────────────────────────────────────────────────
  describe('getCompoundArabic', () => {
    it('returns arabic name for known compound', () => {
      const arabic = CompoundEffectResolver.getCompoundArabic('resilience');
      expect(arabic).toBeDefined();
      expect(typeof arabic).toBe('string');
      expect(arabic.length).toBeGreaterThan(0);
      // resilience arabic is صُمود
      expect(arabic).toBe('صُمود');
    });

    it('returns null for unknown compound', () => {
      const arabic = CompoundEffectResolver.getCompoundArabic('nonexistent');
      expect(arabic).toBeNull();
    });

    it('returns correct arabic for all 6 compounds', () => {
      expect(CompoundEffectResolver.getCompoundArabic('resilience')).toBe('صُمود');
      expect(CompoundEffectResolver.getCompoundArabic('corrosion')).toBe('تَآكُل');
      expect(CompoundEffectResolver.getCompoundArabic('petrify')).toBe('تَحَجُّر');
      expect(CompoundEffectResolver.getCompoundArabic('clarity')).toBe('صَفاء');
      expect(CompoundEffectResolver.getCompoundArabic('berserk')).toBe('هِياج');
      expect(CompoundEffectResolver.getCompoundArabic('doom')).toBe('هَلاك');
    });
  });
});
