import { describe, it, expect } from 'vitest';
import {
  getChainProgress,
  getAllChainProgress,
  getUnlockedChains,
  getInProgressChains,
  getNextChainTargets,
  checkChainCompletions,
} from '../achievementChainService.js';

describe('achievementChainService', () => {
  const mockUnlocked = {
    explorer_3: '2024-01-01',
    oasis_wisdom_keeper_defeated: '2024-01-02',
    first_quest: '2024-01-03',
    word_collector_10: '2024-01-04',
    word_collector_50: '2024-01-05',
  };

  it('reports progress for a chain', () => {
    const progress = getChainProgress('chain_oasis_master', mockUnlocked);
    expect(progress).not.toBeNull();
    expect(progress.isComplete).toBe(true);
    expect(progress.percentage).toBe(100);
    expect(progress.total).toBe(3);
    expect(progress.completed).toBe(3);
  });

  it('reports incomplete chain correctly', () => {
    const progress = getChainProgress('chain_vocabulary_titan', mockUnlocked);
    expect(progress.isComplete).toBe(false);
    expect(progress.completed).toBe(2); // word_collector_10 and _50
    expect(progress.remaining.length).toBe(3);
  });

  it('returns null for unknown chain', () => {
    expect(getChainProgress('nonexistent', mockUnlocked)).toBeNull();
  });

  it('getAllChainProgress returns all chains', () => {
    const all = getAllChainProgress(mockUnlocked);
    expect(all.length).toBeGreaterThan(0);
    expect(all.every((c) => c.chainId)).toBe(true);
  });

  it('getUnlockedChains returns only complete chains', () => {
    const unlocked = getUnlockedChains(mockUnlocked);
    expect(unlocked.every((c) => c.isComplete)).toBe(true);
    expect(unlocked.some((c) => c.chainId === 'chain_oasis_master')).toBe(true);
  });

  it('getInProgressChains sorts by percentage desc', () => {
    const inProgress = getInProgressChains(mockUnlocked);
    for (let i = 1; i < inProgress.length; i++) {
      expect(inProgress[i - 1].percentage).toBeGreaterThanOrEqual(inProgress[i].percentage);
    }
  });

  it('getNextChainTargets returns limited results', () => {
    const targets = getNextChainTargets(mockUnlocked, 2);
    expect(targets.length).toBeLessThanOrEqual(2);
  });

  it('checkChainCompletions detects newly completed chains', () => {
    // Complete oasis master by adding the last achievement
    const partialUnlocked = { explorer_3: '1', oasis_wisdom_keeper_defeated: '1' };
    const full = { ...partialUnlocked, first_quest: '1' };
    const completions = checkChainCompletions('first_quest', full);
    expect(completions.some((c) => c.chainId === 'chain_oasis_master')).toBe(true);
  });
});
