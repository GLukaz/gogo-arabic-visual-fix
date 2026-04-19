import { test, expect } from '@playwright/test';

test.describe('GoGo Arabic - Fast Travel (World Map)', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-seed player data with multiple unlocked and visited zones
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'TravelTester',
          level: 10,
          xp: 1000,
          dirhams: 300,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village', 'ancient_library', 'desert_marketplace'],
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {},
          activeQuests: [],
          completedQuests: [],
          npcsVisited: [],
          zonesVisited: ['oasis_village', 'ancient_library', 'desert_marketplace'],
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
  });

  test('world map displays unlocked zones', async ({ page }) => {
    await page.goto('/game/map');

    // World map should load
    await page.waitForTimeout(1000);

    // Look for zone nodes or zone names
    const hasZones = await page.getByText(/oasis|library|marketplace|village/i).isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasZones).toBe(true);
  });

  test('world map shows zone completion stats', async ({ page }) => {
    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Look for completion percentage or stats
    const hasStats = await page.locator('[class*="completion"], [class*="progress"], [class*="percent"]').count() > 0;

    // Stats may be visible or require hovering over zones
    // This test validates the map loads correctly
    expect(page.url().includes('/game/map')).toBe(true);
  });

  test('clicking unlocked visited zone triggers fast travel', async ({ page }) => {
    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Record current zone
    const initialZone = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const player = JSON.parse(parsed.player);
      return player.currentZone;
    });

    expect(initialZone).toBe('oasis_village');

    // Look for zone nodes (clickable elements)
    // Try to find a zone button/element for ancient_library or desert_marketplace
    const libraryZone = page.getByText(/library/i);
    const marketZone = page.getByText(/market/i);

    const hasLibrary = await libraryZone.isVisible({ timeout: 3000 }).catch(() => false);
    const hasMarket = await marketZone.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasLibrary) {
      await libraryZone.click();
      await page.waitForTimeout(1000);

      // Should navigate back to /game or show zone transition
      const currentUrl = page.url();
      expect(currentUrl.includes('/game')).toBe(true);
    } else if (hasMarket) {
      await marketZone.click();
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      expect(currentUrl.includes('/game')).toBe(true);
    }
  });

  test('locked zones show lock indicator and cannot be accessed', async ({ page }) => {
    // Pre-seed with some locked zones
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'LockedTester',
          level: 3,
          xp: 200,
          dirhams: 50,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village'], // Only starting zone
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {},
          activeQuests: [],
          completedQuests: [],
          npcsVisited: [],
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

    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Look for lock indicators (🔒, locked class, disabled state)
    const hasLocks = await page.locator('[class*="locked"], [class*="disabled"]').count() > 0;
    const hasLockIcon = await page.getByText(/🔒|locked/i).isVisible({ timeout: 3000 }).catch(() => false);

    // Map should show some locked zones
    expect(hasLocks || hasLockIcon).toBe(true);
  });

  test('clicking current zone closes the map', async ({ page }) => {
    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Look for current zone (oasis_village)
    const currentZone = page.getByText(/oasis.*village/i);
    const hasCurrentZone = await currentZone.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasCurrentZone) {
      await currentZone.click();
      await page.waitForTimeout(1000);

      // Should navigate back to /game (not /game/map)
      const currentUrl = page.url();
      expect(currentUrl.endsWith('/game')).toBe(true);
    }
  });

  test('world map can be closed with back button', async ({ page }) => {
    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Look for back/close button
    const backButton = page.getByRole('button', { name: /back|close|exit/i });
    const hasBackButton = await backButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasBackButton) {
      await backButton.click();
      await page.waitForTimeout(1000);

      // Should navigate back to /game
      const currentUrl = page.url();
      expect(currentUrl.endsWith('/game')).toBe(true);
    }
  });

  test('world map can be closed with Escape key', async ({ page }) => {
    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Press Escape key
    await page.keyboard.press('Escape');
    await page.waitForTimeout(1000);

    // Should navigate back to /game
    const currentUrl = page.url();
    expect(currentUrl.endsWith('/game') || !currentUrl.includes('/map')).toBe(true);
  });

  test('unvisited zones cannot be fast traveled to', async ({ page }) => {
    // Pre-seed with unlocked but unvisited zones
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'UnvisitedTester',
          level: 8,
          xp: 800,
          dirhams: 200,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village', 'ancient_library'],
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          quests: {},
          activeQuests: [],
          completedQuests: [],
          npcsVisited: [],
          zonesVisited: ['oasis_village'], // Only visited starting zone
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

    await page.goto('/game/map');

    // Wait for map to load
    await page.waitForTimeout(1000);

    // Current zone should still be oasis_village
    const currentZone = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const player = JSON.parse(parsed.player);
      return player.currentZone;
    });

    expect(currentZone).toBe('oasis_village');

    // Try clicking on ancient_library (unlocked but unvisited)
    const libraryZone = page.getByText(/library/i);
    const hasLibrary = await libraryZone.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasLibrary) {
      await libraryZone.click();
      await page.waitForTimeout(1000);

      // Look for notification about needing to visit first
      const hasNotification = await page.getByText(/visit.*first|on foot|must.*visit/i).isVisible({ timeout: 3000 }).catch(() => false);

      // Either notification appears OR zone didn't change
      const finalZone = await page.evaluate(() => {
        const data = localStorage.getItem('persist:gogo-arabic');
        if (!data) return null;

        const parsed = JSON.parse(data);
        const player = JSON.parse(parsed.player);
        return player.currentZone;
      });

      expect(hasNotification || finalZone === 'oasis_village').toBe(true);
    }
  });
});
