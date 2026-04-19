import { describe, it, expect, beforeEach } from 'vitest';
import playerReducer, {
  setName,
  setSkinTone,
  setOutfit,
  setHeadCovering,
  addXP,
  addDirhams,
  spendDirhams,
  incrementWordsLearned,
  updateStreak,
  setCurrentZone,
  unlockZone,
  addToInventory,
  equipItem,
  setPosition,
  addBoost,
  removeExpiredBoosts,
  markChestOpened,
  markBookRead,
  selectPlayerStats,
  selectInventoryIds,
  selectPlayerAppearance,
} from '../slices/playerSlice.js';

describe('playerSlice', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      name: '',
      skinTone: 0,
      outfit: 'simple-thobe',
      headCovering: 'kufi',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      dirhams: 0,
      currency: { fils: 0, dirhams: 0, dinars: 0 },
      wordsLearned: 0,
      streak: 0,
      lastPlayedDate: null,
      maxStreak: 0,
      streakRewardsEarned: [],
      titles: [],
      currentTitle: null,
      currentZone: 'oasis_village',
      unlockedZones: ['oasis_village'],
      inventory: [],
      position: { x: 640, y: 400 },
      boosts: [],
      openedChests: [],
      readBooks: [],
      levelUpRewards: null,
      streakRewardPending: null,
      onboardingComplete: false,
      tutorialPhase: 'cinematic_intro',
      mentorAvailable: true,
      onboardingTargetNpc: null,
      learningPath: null,
      lastLoginDate: null,
      loginStreak: 0,
      totalLogins: 0,
      pendingLoginReward: null,
    };
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      expect(playerReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });
  });

  describe('setName', () => {
    it('should set player name', () => {
      const state = playerReducer(initialState, setName('Ahmed'));
      expect(state.name).toBe('Ahmed');
    });
  });

  describe('setSkinTone', () => {
    it('should set skin tone', () => {
      const state = playerReducer(initialState, setSkinTone(2));
      expect(state.skinTone).toBe(2);
    });
  });

  describe('setOutfit', () => {
    it('should set outfit', () => {
      const state = playerReducer(initialState, setOutfit('fancy-thobe'));
      expect(state.outfit).toBe('fancy-thobe');
    });
  });

  describe('setHeadCovering', () => {
    it('should set head covering', () => {
      const state = playerReducer(initialState, setHeadCovering('turban'));
      expect(state.headCovering).toBe('turban');
    });
  });

  describe('addXP', () => {
    it('should add XP without leveling up', () => {
      const state = playerReducer(initialState, addXP(50));
      expect(state.xp).toBe(50);
      expect(state.level).toBe(1);
    });

    it('should level up when XP threshold is reached', () => {
      const state = playerReducer(initialState, addXP(100));
      expect(state.xp).toBe(100);
      expect(state.level).toBe(2);
    });

    it('should level up multiple times if XP is very high', () => {
      // Level 2 = 100, Level 3 = 250, Level 4 = 450
      const state = playerReducer(initialState, addXP(450));
      expect(state.xp).toBe(450);
      expect(state.level).toBe(4);
    });

    it('should update xpToNextLevel after leveling', () => {
      const state = playerReducer(initialState, addXP(100));
      expect(state.xpToNextLevel).toBe(250); // Level 3 threshold
    });

    it('should handle multiple addXP actions correctly', () => {
      let state = playerReducer(initialState, addXP(50));
      state = playerReducer(state, addXP(50));
      expect(state.xp).toBe(100);
      expect(state.level).toBe(2);
    });
  });

  describe('addDirhams', () => {
    it('should add dirhams', () => {
      const state = playerReducer(initialState, addDirhams(100));
      expect(state.dirhams).toBe(100);
    });

    it('should accumulate dirhams', () => {
      let state = playerReducer(initialState, addDirhams(50));
      state = playerReducer(state, addDirhams(30));
      expect(state.dirhams).toBe(80);
    });
  });

  describe('spendDirhams', () => {
    it('should subtract dirhams', () => {
      const startState = { ...initialState, dirhams: 100 };
      const state = playerReducer(startState, spendDirhams(30));
      expect(state.dirhams).toBe(70);
    });

    it('should not go below 0', () => {
      const startState = { ...initialState, dirhams: 50 };
      const state = playerReducer(startState, spendDirhams(100));
      expect(state.dirhams).toBe(0);
    });
  });

  describe('incrementWordsLearned', () => {
    it('should increment words learned by 1', () => {
      const state = playerReducer(initialState, incrementWordsLearned());
      expect(state.wordsLearned).toBe(1);
    });

    it('should increment multiple times', () => {
      let state = playerReducer(initialState, incrementWordsLearned());
      state = playerReducer(state, incrementWordsLearned());
      state = playerReducer(state, incrementWordsLearned());
      expect(state.wordsLearned).toBe(3);
    });
  });

  describe('updateStreak', () => {
    it('should start streak at 1 on first play', () => {
      const state = playerReducer(initialState, updateStreak());
      expect(state.streak).toBe(1);
      expect(state.lastPlayedDate).toBe(new Date().toDateString());
    });

    it('should not increment streak on same day', () => {
      const today = new Date().toDateString();
      const startState = {
        ...initialState,
        streak: 5,
        lastPlayedDate: today,
        maxStreak: 10,
        streakRewardsEarned: [],
      };
      const state = playerReducer(startState, updateStreak());
      expect(state.streak).toBe(5);
    });

    it('should increment streak on consecutive day', () => {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const startState = {
        ...initialState,
        streak: 3,
        lastPlayedDate: yesterday,
        maxStreak: 5,
        streakRewardsEarned: [],
      };
      const state = playerReducer(startState, updateStreak());
      expect(state.streak).toBe(4);
    });

    it('should reset streak if not consecutive', () => {
      const twoDaysAgo = new Date(Date.now() - 172800000).toDateString();
      const startState = {
        ...initialState,
        streak: 10,
        lastPlayedDate: twoDaysAgo,
        maxStreak: 10,
        streakRewardsEarned: [],
      };
      const state = playerReducer(startState, updateStreak());
      expect(state.streak).toBe(1);
    });
  });

  describe('setCurrentZone', () => {
    it('should set current zone', () => {
      const state = playerReducer(initialState, setCurrentZone('desert_market'));
      expect(state.currentZone).toBe('desert_market');
    });
  });

  describe('unlockZone', () => {
    it('should add new zone to unlocked zones', () => {
      const state = playerReducer(initialState, unlockZone('desert_market'));
      expect(state.unlockedZones).toContain('desert_market');
      expect(state.unlockedZones).toContain('oasis_village');
    });

    it('should not duplicate zones', () => {
      let state = playerReducer(initialState, unlockZone('desert_market'));
      state = playerReducer(state, unlockZone('desert_market'));
      expect(state.unlockedZones.filter(z => z === 'desert_market')).toHaveLength(1);
    });
  });

  describe('addToInventory', () => {
    it('should add item to inventory', () => {
      const state = playerReducer(initialState, addToInventory({ itemId: 'sword', equipped: false }));
      expect(state.inventory).toHaveLength(1);
      expect(state.inventory[0]).toEqual({ itemId: 'sword', equipped: false });
    });

    it('should not add duplicate items', () => {
      let state = playerReducer(initialState, addToInventory({ itemId: 'sword' }));
      state = playerReducer(state, addToInventory({ itemId: 'sword' }));
      expect(state.inventory).toHaveLength(1);
    });

    it('should default equipped to false if not provided', () => {
      const state = playerReducer(initialState, addToInventory({ itemId: 'shield' }));
      expect(state.inventory[0].equipped).toBe(false);
    });
  });

  describe('equipItem', () => {
    it('should equip an item in inventory', () => {
      const startState = {
        ...initialState,
        inventory: [{ itemId: 'sword', equipped: false }],
      };
      const state = playerReducer(startState, equipItem('sword'));
      expect(state.inventory[0].equipped).toBe(true);
    });

    it('should do nothing if item not in inventory', () => {
      const state = playerReducer(initialState, equipItem('nonexistent'));
      expect(state.inventory).toEqual([]);
    });
  });

  describe('setPosition', () => {
    it('should set player position', () => {
      const state = playerReducer(initialState, setPosition({ x: 100, y: 200 }));
      expect(state.position).toEqual({ x: 100, y: 200 });
    });
  });

  describe('addBoost', () => {
    it('should add boost to boosts array', () => {
      const boost = { type: 'xp_boost', expiresAt: Date.now() + 3600000 };
      const state = playerReducer(initialState, addBoost(boost));
      expect(state.boosts).toHaveLength(1);
      expect(state.boosts[0]).toEqual(boost);
    });
  });

  describe('removeExpiredBoosts', () => {
    it('should remove expired boosts', () => {
      const past = Date.now() - 1000;
      const future = Date.now() + 3600000;
      const startState = {
        ...initialState,
        boosts: [
          { type: 'boost1', expiresAt: past },
          { type: 'boost2', expiresAt: future },
        ],
      };
      const state = playerReducer(startState, removeExpiredBoosts());
      expect(state.boosts).toHaveLength(1);
      expect(state.boosts[0].type).toBe('boost2');
    });
  });

  describe('markChestOpened', () => {
    it('should add chest ID to openedChests', () => {
      const state = playerReducer(initialState, markChestOpened('chest_001'));
      expect(state.openedChests).toContain('chest_001');
    });

    it('should not duplicate chest IDs', () => {
      let state = playerReducer(initialState, markChestOpened('chest_001'));
      state = playerReducer(state, markChestOpened('chest_001'));
      expect(state.openedChests.filter(id => id === 'chest_001')).toHaveLength(1);
    });

    it('should handle invalid input gracefully', () => {
      const state = playerReducer(initialState, markChestOpened(null));
      expect(state.openedChests).toEqual([]);
    });
  });

  describe('markBookRead', () => {
    it('should add book ID to readBooks', () => {
      const state = playerReducer(initialState, markBookRead('book_001'));
      expect(state.readBooks).toContain('book_001');
    });

    it('should not duplicate book IDs', () => {
      let state = playerReducer(initialState, markBookRead('book_001'));
      state = playerReducer(state, markBookRead('book_001'));
      expect(state.readBooks.filter(id => id === 'book_001')).toHaveLength(1);
    });
  });

  describe('selectors', () => {
    const mockState = {
      player: {
        ...initialState,
        level: 5,
        xp: 700,
        xpToNextLevel: 1000,
        streak: 3,
        dirhams: 150,
        wordsLearned: 25,
        skinTone: 2,
        outfit: 'fancy-thobe',
        headCovering: 'turban',
        inventory: [
          { itemId: 'sword', equipped: true },
          { itemId: 'shield', equipped: false },
        ],
      },
    };

    it('selectPlayerStats should return player stats', () => {
      const stats = selectPlayerStats(mockState);
      expect(stats).toEqual({
        level: 5,
        xp: 700,
        xpToNextLevel: 1000,
        streak: 3,
        dirhams: 150,
        wordsLearned: 25,
      });
    });

    it('selectInventoryIds should return array of item IDs', () => {
      const ids = selectInventoryIds(mockState);
      expect(ids).toEqual(['sword', 'shield']);
    });

    it('selectPlayerAppearance should return appearance data', () => {
      const appearance = selectPlayerAppearance(mockState);
      expect(appearance).toEqual({
        skinTone: 2,
        outfit: 'fancy-thobe',
        headCovering: 'turban',
      });
    });
  });
});
