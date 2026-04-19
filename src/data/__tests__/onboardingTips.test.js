import { describe, it, expect } from 'vitest';
import {
  ONBOARDING_TIPS,
  getTipById,
  getTipsForContext,
  getAllTipContexts,
} from '../onboardingTips.js';

// ============================================================
// ONBOARDING_TIPS — data integrity
// ============================================================

describe('ONBOARDING_TIPS', () => {
  it('exports a non-empty array', () => {
    expect(Array.isArray(ONBOARDING_TIPS)).toBe(true);
    expect(ONBOARDING_TIPS.length).toBeGreaterThanOrEqual(30);
  });

  it('every tip has all required fields', () => {
    ONBOARDING_TIPS.forEach((tip) => {
      expect(tip).toHaveProperty('id');
      expect(tip).toHaveProperty('context');
      expect(tip).toHaveProperty('title');
      expect(tip).toHaveProperty('titleArabic');
      expect(tip).toHaveProperty('message');
      expect(tip).toHaveProperty('messageArabic');
      expect(tip).toHaveProperty('showOnce');
      expect(typeof tip.id).toBe('string');
      expect(typeof tip.context).toBe('string');
      expect(typeof tip.title).toBe('string');
      expect(typeof tip.titleArabic).toBe('string');
      expect(typeof tip.message).toBe('string');
      expect(typeof tip.messageArabic).toBe('string');
      expect(typeof tip.showOnce).toBe('boolean');
    });
  });

  it('all IDs are unique', () => {
    const ids = ONBOARDING_TIPS.map((tip) => tip.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('all contexts are non-empty strings', () => {
    ONBOARDING_TIPS.forEach((tip) => {
      expect(tip.context.length).toBeGreaterThan(0);
    });
  });

  it('Arabic title text contains Arabic characters', () => {
    const arabicPattern = /[\u0600-\u06FF]/;
    ONBOARDING_TIPS.forEach((tip) => {
      expect(arabicPattern.test(tip.titleArabic)).toBe(true);
    });
  });

  it('Arabic message text contains Arabic characters', () => {
    const arabicPattern = /[\u0600-\u06FF]/;
    ONBOARDING_TIPS.forEach((tip) => {
      expect(arabicPattern.test(tip.messageArabic)).toBe(true);
    });
  });

  it('messages are non-trivially long (at least 20 chars)', () => {
    ONBOARDING_TIPS.forEach((tip) => {
      expect(tip.message.length).toBeGreaterThanOrEqual(20);
    });
  });

  it('has at least one showOnce:true tip', () => {
    const showOnceTips = ONBOARDING_TIPS.filter((t) => t.showOnce);
    expect(showOnceTips.length).toBeGreaterThan(0);
  });

  it('has at least one showOnce:false (repeatable) tip', () => {
    const repeatableTips = ONBOARDING_TIPS.filter((t) => !t.showOnce);
    expect(repeatableTips.length).toBeGreaterThan(0);
  });
});

// ============================================================
// getTipById
// ============================================================

describe('getTipById', () => {
  it('returns the correct tip for a valid ID', () => {
    const tip = getTipById('tip_fsrs_review');
    expect(tip).not.toBeNull();
    expect(tip.id).toBe('tip_fsrs_review');
    expect(tip.context).toBe('review_due');
  });

  it('returns null for an unknown ID', () => {
    expect(getTipById('nonexistent_tip')).toBeNull();
  });
});

// ============================================================
// getTipsForContext
// ============================================================

describe('getTipsForContext', () => {
  it('returns tips matching a known context', () => {
    const tips = getTipsForContext('review_due');
    expect(tips.length).toBeGreaterThan(0);
    tips.forEach((tip) => {
      expect(tip.context).toBe('review_due');
    });
  });

  it('returns an empty array for an unknown context', () => {
    expect(getTipsForContext('nonexistent_context')).toEqual([]);
  });
});

// ============================================================
// getAllTipContexts
// ============================================================

describe('getAllTipContexts', () => {
  it('returns a non-empty array of unique strings', () => {
    const contexts = getAllTipContexts();
    expect(contexts.length).toBeGreaterThan(0);
    const unique = new Set(contexts);
    expect(unique.size).toBe(contexts.length);
    contexts.forEach((c) => expect(typeof c).toBe('string'));
  });
});
