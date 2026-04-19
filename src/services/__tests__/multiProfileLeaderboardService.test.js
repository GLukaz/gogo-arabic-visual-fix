import { describe, it, expect, beforeEach } from 'vitest';
import {
  LEADERBOARD_CATEGORIES,
  saveScore,
  getLeaderboard,
  getPlayerRank,
  getPlayerBests,
  clearLeaderboards,
  loadProfiles,
  createProfile,
  deleteProfile,
  getMaxProfiles,
} from '../multiProfileLeaderboardService.js';

describe('multiProfileLeaderboardService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // ============================================================
  // LEADERBOARD_CATEGORIES
  // ============================================================

  describe('LEADERBOARD_CATEGORIES', () => {
    it('should define 8 categories', () => {
      expect(Object.keys(LEADERBOARD_CATEGORIES)).toHaveLength(8);
    });

    it('should have label, labelArabic, and icon for each category', () => {
      Object.values(LEADERBOARD_CATEGORIES).forEach((cat) => {
        expect(cat.label).toBeTruthy();
        expect(cat.labelArabic).toBeTruthy();
        expect(cat.icon).toBeTruthy();
      });
    });
  });

  // ============================================================
  // saveScore
  // ============================================================

  describe('saveScore', () => {
    it('should save a score and return rank 1 for first entry', () => {
      const result = saveScore('xp', 'Alice', 1000);
      expect(result.rank).toBe(1);
      expect(result.isNewBest).toBe(true);
    });

    it('should update score only if higher', () => {
      saveScore('xp', 'Alice', 500);
      const result = saveScore('xp', 'Alice', 300);
      expect(result.isNewBest).toBe(false);

      const board = getLeaderboard('xp');
      expect(board[0].score).toBe(500);
    });

    it('should update score when new score is higher', () => {
      saveScore('xp', 'Alice', 500);
      const result = saveScore('xp', 'Alice', 800);
      expect(result.isNewBest).toBe(true);

      const board = getLeaderboard('xp');
      expect(board[0].score).toBe(800);
    });

    it('should sort entries by descending score', () => {
      saveScore('xp', 'Alice', 500);
      saveScore('xp', 'Bob', 1000);
      saveScore('xp', 'Charlie', 750);

      const board = getLeaderboard('xp');
      expect(board[0].playerName).toBe('Bob');
      expect(board[1].playerName).toBe('Charlie');
      expect(board[2].playerName).toBe('Alice');
    });

    it('should be case-insensitive for player name matching', () => {
      saveScore('xp', 'Alice', 500);
      const result = saveScore('xp', 'alice', 800);
      expect(result.isNewBest).toBe(true);

      const board = getLeaderboard('xp');
      expect(board).toHaveLength(1);
    });

    it('should return rank -1 for invalid category', () => {
      const result = saveScore('nonexistent', 'Alice', 100);
      expect(result.rank).toBe(-1);
    });

    it('should return rank -1 for missing player name', () => {
      const result = saveScore('xp', '', 100);
      expect(result.rank).toBe(-1);
    });

    it('should return rank -1 for non-numeric score', () => {
      const result = saveScore('xp', 'Alice', 'not-a-number');
      expect(result.rank).toBe(-1);
    });

    it('should save scores across multiple categories independently', () => {
      saveScore('xp', 'Alice', 1000);
      saveScore('words_learned', 'Alice', 200);

      const xpBoard = getLeaderboard('xp');
      const wordsBoard = getLeaderboard('words_learned');

      expect(xpBoard[0].score).toBe(1000);
      expect(wordsBoard[0].score).toBe(200);
    });
  });

  // ============================================================
  // getLeaderboard
  // ============================================================

  describe('getLeaderboard', () => {
    it('should return empty array for empty category', () => {
      const board = getLeaderboard('xp');
      expect(board).toEqual([]);
    });

    it('should return entries with rank numbers', () => {
      saveScore('xp', 'Alice', 500);
      saveScore('xp', 'Bob', 1000);

      const board = getLeaderboard('xp');
      expect(board[0].rank).toBe(1);
      expect(board[1].rank).toBe(2);
    });

    it('should respect the limit parameter', () => {
      for (let i = 0; i < 15; i++) {
        saveScore('xp', `Player${i}`, i * 100);
      }

      const board = getLeaderboard('xp', 5);
      expect(board).toHaveLength(5);
    });

    it('should default to limit of 10', () => {
      for (let i = 0; i < 15; i++) {
        saveScore('xp', `Player${i}`, i * 100);
      }

      const board = getLeaderboard('xp');
      expect(board).toHaveLength(10);
    });
  });

  // ============================================================
  // getPlayerRank
  // ============================================================

  describe('getPlayerRank', () => {
    it('should return null for unknown player', () => {
      const result = getPlayerRank('xp', 'Unknown');
      expect(result).toBeNull();
    });

    it('should return correct rank and total', () => {
      saveScore('xp', 'Alice', 500);
      saveScore('xp', 'Bob', 1000);
      saveScore('xp', 'Charlie', 750);

      const result = getPlayerRank('xp', 'Charlie');
      expect(result.rank).toBe(2);
      expect(result.score).toBe(750);
      expect(result.total).toBe(3);
    });

    it('should be case-insensitive', () => {
      saveScore('xp', 'Alice', 500);
      const result = getPlayerRank('xp', 'ALICE');
      expect(result).not.toBeNull();
      expect(result.rank).toBe(1);
    });
  });

  // ============================================================
  // getPlayerBests
  // ============================================================

  describe('getPlayerBests', () => {
    it('should return empty object for unknown player', () => {
      const bests = getPlayerBests('Unknown');
      expect(bests).toEqual({});
    });

    it('should return scores for all categories with entries', () => {
      saveScore('xp', 'Alice', 1000);
      saveScore('words_learned', 'Alice', 200);
      saveScore('streak', 'Alice', 30);

      const bests = getPlayerBests('Alice');
      expect(Object.keys(bests)).toHaveLength(3);
      expect(bests.xp.score).toBe(1000);
      expect(bests.words_learned.score).toBe(200);
      expect(bests.streak.score).toBe(30);
    });

    it('should include rank and date for each category', () => {
      saveScore('xp', 'Alice', 1000);
      const bests = getPlayerBests('Alice');
      expect(bests.xp.rank).toBe(1);
      expect(bests.xp.date).toBeTruthy();
    });
  });

  // ============================================================
  // clearLeaderboards
  // ============================================================

  describe('clearLeaderboards', () => {
    it('should remove all leaderboard data', () => {
      saveScore('xp', 'Alice', 1000);
      saveScore('words_learned', 'Bob', 200);

      clearLeaderboards();

      expect(getLeaderboard('xp')).toEqual([]);
      expect(getLeaderboard('words_learned')).toEqual([]);
    });
  });

  // ============================================================
  // Storage persistence
  // ============================================================

  describe('storage persistence', () => {
    it('should persist scores across separate loadLeaderboard calls', () => {
      saveScore('xp', 'Alice', 1000);

      // Simulate a "fresh" read
      const board = getLeaderboard('xp');
      expect(board).toHaveLength(1);
      expect(board[0].playerName).toBe('Alice');
      expect(board[0].score).toBe(1000);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('gogo_leaderboards', 'not-json');
      const board = getLeaderboard('xp');
      expect(board).toEqual([]);
    });
  });

  // ============================================================
  // Profile management
  // ============================================================

  describe('createProfile', () => {
    it('should create a profile successfully', () => {
      const result = createProfile('Alice');
      expect(result.success).toBe(true);
      expect(result.profile.name).toBe('Alice');
      expect(result.profile.id).toBeTruthy();
    });

    it('should assign a default avatar', () => {
      const result = createProfile('Alice');
      expect(result.profile.avatar).toBeTruthy();
    });

    it('should use provided avatar', () => {
      const result = createProfile('Alice', '\ud83e\uddd9');
      expect(result.profile.avatar).toBe('\ud83e\uddd9');
    });

    it('should reject empty names', () => {
      const result = createProfile('');
      expect(result.success).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject duplicate names (case-insensitive)', () => {
      createProfile('Alice');
      const result = createProfile('alice');
      expect(result.success).toBe(false);
    });

    it('should enforce max profile limit', () => {
      for (let i = 0; i < getMaxProfiles(); i++) {
        createProfile(`Player${i}`);
      }
      const result = createProfile('OneMore');
      expect(result.success).toBe(false);
    });

    it('should trim whitespace from names', () => {
      const result = createProfile('  Alice  ');
      expect(result.profile.name).toBe('Alice');
    });
  });

  describe('loadProfiles', () => {
    it('should return empty array when no profiles exist', () => {
      const profiles = loadProfiles();
      expect(profiles).toEqual([]);
    });

    it('should return created profiles', () => {
      createProfile('Alice');
      createProfile('Bob');

      const profiles = loadProfiles();
      expect(profiles).toHaveLength(2);
    });
  });

  describe('deleteProfile', () => {
    it('should delete a profile by ID', () => {
      const { profile } = createProfile('Alice');
      const deleted = deleteProfile(profile.id);

      expect(deleted).toBe(true);
      expect(loadProfiles()).toHaveLength(0);
    });

    it('should return false for unknown ID', () => {
      const deleted = deleteProfile('nonexistent');
      expect(deleted).toBe(false);
    });

    it('should not affect other profiles', () => {
      createProfile('Alice');
      const { profile: bobProfile } = createProfile('Bob');

      deleteProfile(bobProfile.id);

      const profiles = loadProfiles();
      expect(profiles).toHaveLength(1);
      expect(profiles[0].name).toBe('Alice');
    });
  });

  describe('getMaxProfiles', () => {
    it('should return 5', () => {
      expect(getMaxProfiles()).toBe(5);
    });
  });
});
