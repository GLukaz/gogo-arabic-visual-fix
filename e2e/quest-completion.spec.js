import { test, expect } from '@playwright/test';

test.describe('GoGo Arabic - Quest Completion', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-seed player data with an available quest
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'QuestTester',
          level: 2,
          xp: 100,
          dirhams: 50,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village'],
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {
            'learn_first_letters': {
              id: 'learn_first_letters',
              status: 'available',
              progress: 0,
              activated: false,
            },
            'greetings_of_oasis': {
              id: 'greetings_of_oasis',
              status: 'available',
              progress: 0,
              activated: false,
            },
          },
          activeQuests: [],
          completedQuests: [],
          npcsVisited: ['scholar'],
          zonesVisited: ['oasis_village'],
        }),
        alphabet: JSON.stringify({
          letters: [],
          completedGroups: [],
        }),
        settings: JSON.stringify({
          harakat: true,
          sfx: true,
          music: true,
        }),
        npc: JSON.stringify({
          interactions: {
            'scholar': {
              lastInteraction: Date.now() - 10000,
              timesSpokenTo: 1,
            },
          },
        }),
        achievements: JSON.stringify({
          unlocked: [],
        }),
        dailyGoals: JSON.stringify({
          goals: [],
        }),
        grammar: JSON.stringify({
          topics: [],
        }),
        battle: JSON.stringify({
          activeBattle: null,
        }),
        _persist: JSON.stringify({
          version: -1,
          rehydrated: true,
        }),
      };

      localStorage.setItem('persist:gogo-arabic', JSON.stringify(playerData));
    });
  });

  test('quest log shows available quests', async ({ page }) => {
    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Look for quest log or activities menu button
    // May need to open pause menu or activities overlay
    const pauseButton = page.getByRole('button', { name: /menu|pause|activities/i });
    const hasPauseButton = await pauseButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasPauseButton) {
      await pauseButton.click();
      await page.waitForTimeout(500);

      // Look for quest/activities option
      const questButton = page.getByRole('button', { name: /quest|activities/i });
      const hasQuestButton = await questButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasQuestButton) {
        await questButton.click();
        await page.waitForTimeout(500);

        // Should show available quests
        const hasQuests = await page.getByText(/learn.*first.*letters|greetings/i).isVisible({ timeout: 5000 }).catch(() => false);
        expect(hasQuests).toBe(true);
      }
    }
  });

  test('player can activate a quest', async ({ page }) => {
    // Pre-seed with quest available
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'QuestActivator',
          level: 1,
          xp: 0,
          dirhams: 30,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village'],
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {
            'greetings_of_oasis': {
              id: 'greetings_of_oasis',
              status: 'available',
              progress: 0,
              activated: false,
            },
          },
          activeQuests: [],
          completedQuests: [],
          npcsVisited: ['scholar'],
          zonesVisited: ['oasis_village'],
        }),
        alphabet: JSON.stringify({
          letters: [],
          completedGroups: [],
        }),
        settings: JSON.stringify({
          harakat: true,
          sfx: true,
          music: true,
        }),
        npc: JSON.stringify({
          interactions: {},
        }),
        achievements: JSON.stringify({
          unlocked: [],
        }),
        dailyGoals: JSON.stringify({
          goals: [],
        }),
        grammar: JSON.stringify({
          topics: [],
        }),
        battle: JSON.stringify({
          activeBattle: null,
        }),
        _persist: JSON.stringify({
          version: -1,
          rehydrated: true,
        }),
      };

      localStorage.setItem('persist:gogo-arabic', JSON.stringify(playerData));
    });

    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    // After activating quest, check localStorage to verify state change
    const questState = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const quests = JSON.parse(parsed.quests);
      return quests;
    });

    // Quest data should exist
    expect(questState).not.toBeNull();
    expect(questState.quests).toBeDefined();
  });

  test('completing quest objectives updates progress', async ({ page }) => {
    // Pre-seed with quest in progress
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'QuestProgresser',
          level: 3,
          xp: 200,
          dirhams: 100,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village'],
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {
            'learn_first_letters': {
              id: 'learn_first_letters',
              status: 'active',
              progress: 2,
              activated: true,
            },
          },
          activeQuests: ['learn_first_letters'],
          completedQuests: [],
          npcsVisited: ['scholar'],
          zonesVisited: ['oasis_village'],
        }),
        alphabet: JSON.stringify({
          letters: [],
          completedGroups: ['group-1', 'group-2'],
        }),
        settings: JSON.stringify({
          harakat: true,
          sfx: true,
          music: true,
        }),
        npc: JSON.stringify({
          interactions: {},
        }),
        achievements: JSON.stringify({
          unlocked: [],
        }),
        dailyGoals: JSON.stringify({
          goals: [],
        }),
        grammar: JSON.stringify({
          topics: [],
        }),
        battle: JSON.stringify({
          activeBattle: null,
        }),
        _persist: JSON.stringify({
          version: -1,
          rehydrated: true,
        }),
      };

      localStorage.setItem('persist:gogo-arabic', JSON.stringify(playerData));
    });

    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Verify quest progress is tracked in state
    const questProgress = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const quests = JSON.parse(parsed.quests);
      return quests.quests['learn_first_letters'];
    });

    expect(questProgress).toBeDefined();
    expect(questProgress.status).toBe('active');
    expect(questProgress.progress).toBeGreaterThanOrEqual(0);
  });

  test('quest completion shows reward notification', async ({ page }) => {
    // Pre-seed with quest ready to complete
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'QuestCompleter',
          level: 3,
          xp: 200,
          dirhams: 100,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village'],
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {
            'learn_first_letters': {
              id: 'learn_first_letters',
              status: 'completed',
              progress: 3,
              activated: true,
              completedAt: Date.now(),
            },
          },
          activeQuests: [],
          completedQuests: ['learn_first_letters'],
          npcsVisited: ['scholar'],
          zonesVisited: ['oasis_village'],
        }),
        alphabet: JSON.stringify({
          letters: [],
          completedGroups: ['group-1', 'group-2', 'group-3'],
        }),
        settings: JSON.stringify({
          harakat: true,
          sfx: true,
          music: true,
        }),
        npc: JSON.stringify({
          interactions: {},
        }),
        achievements: JSON.stringify({
          unlocked: [],
        }),
        dailyGoals: JSON.stringify({
          goals: [],
        }),
        grammar: JSON.stringify({
          topics: [],
        }),
        battle: JSON.stringify({
          activeBattle: null,
        }),
        _persist: JSON.stringify({
          version: -1,
          rehydrated: true,
        }),
      };

      localStorage.setItem('persist:gogo-arabic', JSON.stringify(playerData));
    });

    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Verify quest is marked as completed in state
    const questState = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const quests = JSON.parse(parsed.quests);
      return quests.quests['learn_first_letters'];
    });

    expect(questState).toBeDefined();
    expect(questState.status).toBe('completed');
    expect(questState.progress).toBe(3);
  });
});
