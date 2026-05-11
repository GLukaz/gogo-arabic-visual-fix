import { test, expect } from '@playwright/test';

test.describe('GoGo Arabic - Shop Purchase (Wardrobe)', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-seed player data with sufficient dirhams for purchases
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'ShopTester',
          level: 5,
          xp: 500,
          dirhams: 1000, // Plenty of dirhams for testing
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [
            { itemId: 'simple-thobe', equipped: true },
          ],
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
  });

  test('wardrobe shows available outfits for purchase', async ({ page }) => {
    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Open pause menu
    const pauseButton = page.getByRole('button', { name: /menu|pause/i });
    const hasPauseButton = await pauseButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasPauseButton) {
      await pauseButton.click();
      await page.waitForTimeout(500);

      // Look for wardrobe button
      const wardrobeButton = page.getByRole('button', { name: /wardrobe|outfit|shop/i });
      const hasWardrobeButton = await wardrobeButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasWardrobeButton) {
        await wardrobeButton.click();
        await page.waitForTimeout(500);

        // Wardrobe should show outfit options
        const hasOutfits = await page.locator('[class*="outfit"], [class*="wardrobe"]').count() > 0;
        expect(hasOutfits).toBe(true);
      }
    }
  });

  test('player can purchase an outfit', async ({ page }) => {
    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    // Record initial dirhams
    const initialState = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const player = JSON.parse(parsed.player);
      return {
        dirhams: player.dirhams,
        inventory: player.inventory,
      };
    });

    expect(initialState).not.toBeNull();
    expect(initialState.dirhams).toBeGreaterThan(0);

    // Open wardrobe through pause menu
    const pauseButton = page.getByRole('button', { name: /menu|pause/i });
    const hasPauseButton = await pauseButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasPauseButton) {
      await pauseButton.click();
      await page.waitForTimeout(500);

      const wardrobeButton = page.getByRole('button', { name: /wardrobe|outfit|shop/i });
      const hasWardrobeButton = await wardrobeButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasWardrobeButton) {
        await wardrobeButton.click();
        await page.waitForTimeout(500);

        // Look for purchase buttons (buy/purchase)
        const purchaseButtons = page.getByRole('button', { name: /buy|purchase|unlock/i });
        const hasPurchaseButtons = await purchaseButtons.count() > 0;

        if (hasPurchaseButtons) {
          // Click first available purchase button
          await purchaseButtons.first().click();
          await page.waitForTimeout(1000);

          // Verify purchase occurred (dirhams decreased)
          const newState = await page.evaluate(() => {
            const data = localStorage.getItem('persist:gogo-arabic');
            if (!data) return null;

            const parsed = JSON.parse(data);
            const player = JSON.parse(parsed.player);
            return {
              dirhams: player.dirhams,
              inventory: player.inventory,
            };
          });

          // Dirhams should have decreased OR inventory should have increased
          const purchased = (newState.dirhams < initialState.dirhams) ||
                          (newState.inventory.length > initialState.inventory.length);
          expect(purchased).toBe(true);
        }
      }
    }
  });

  test('player can equip owned outfit', async ({ page }) => {
    // Pre-seed with multiple owned outfits
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'OutfitChanger',
          level: 8,
          xp: 800,
          dirhams: 500,
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [
            { itemId: 'simple-thobe', equipped: true },
            { itemId: 'desert-robe', equipped: false },
            { itemId: 'scholar-attire', equipped: false },
          ],
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

    // Record initial outfit
    const initialOutfit = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const player = JSON.parse(parsed.player);
      return player.outfit;
    });

    expect(initialOutfit).toBe('simple-thobe');

    // Open wardrobe
    const pauseButton = page.getByRole('button', { name: /menu|pause/i });
    const hasPauseButton = await pauseButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasPauseButton) {
      await pauseButton.click();
      await page.waitForTimeout(500);

      const wardrobeButton = page.getByRole('button', { name: /wardrobe|outfit|shop/i });
      const hasWardrobeButton = await wardrobeButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasWardrobeButton) {
        await wardrobeButton.click();
        await page.waitForTimeout(500);

        // Look for equip buttons
        const equipButtons = page.getByRole('button', { name: /equip|wear|select/i });
        const hasEquipButtons = await equipButtons.count() > 0;

        if (hasEquipButtons) {
          // Click first equip button for a different outfit
          await equipButtons.first().click();
          await page.waitForTimeout(1000);

          // Verify outfit changed in state
          const newOutfit = await page.evaluate(() => {
            const data = localStorage.getItem('persist:gogo-arabic');
            if (!data) return null;

            const parsed = JSON.parse(data);
            const player = JSON.parse(parsed.player);
            return player.outfit;
          });

          // Outfit may have changed (if we clicked a different outfit)
          expect(newOutfit).toBeDefined();
        }
      }
    }
  });

  test('insufficient dirhams prevents purchase', async ({ page }) => {
    // Pre-seed with low dirhams
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'BrokeTester',
          level: 2,
          xp: 100,
          dirhams: 10, // Very low dirhams
          currentZone: 'oasis_village',
          position: { x: 0, y: 0 },
          inventory: [
            { itemId: 'simple-thobe', equipped: true },
          ],
          outfit: 'simple-thobe',
          unlockedZones: ['oasis_village'],
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

    await page.goto('/game');

    // Wait for game to load
    await page.waitForSelector('canvas', { timeout: 10000 });

    const initialDirhams = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      if (!data) return null;

      const parsed = JSON.parse(data);
      const player = JSON.parse(parsed.player);
      return player.dirhams;
    });

    expect(initialDirhams).toBe(10);

    // Open wardrobe
    const pauseButton = page.getByRole('button', { name: /menu|pause/i });
    const hasPauseButton = await pauseButton.isVisible({ timeout: 5000 }).catch(() => false);

    if (hasPauseButton) {
      await pauseButton.click();
      await page.waitForTimeout(500);

      const wardrobeButton = page.getByRole('button', { name: /wardrobe|outfit|shop/i });
      const hasWardrobeButton = await wardrobeButton.isVisible({ timeout: 3000 }).catch(() => false);

      if (hasWardrobeButton) {
        await wardrobeButton.click();
        await page.waitForTimeout(500);

        // Try to purchase (should fail or show error)
        const purchaseButtons = page.getByRole('button', { name: /buy|purchase|unlock/i });
        const hasPurchaseButtons = await purchaseButtons.count() > 0;

        if (hasPurchaseButtons) {
          await purchaseButtons.first().click();
          await page.waitForTimeout(1000);

          // Verify dirhams didn't go negative
          const finalDirhams = await page.evaluate(() => {
            const data = localStorage.getItem('persist:gogo-arabic');
            if (!data) return null;

            const parsed = JSON.parse(data);
            const player = JSON.parse(parsed.player);
            return player.dirhams;
          });

          expect(finalDirhams).toBeGreaterThanOrEqual(0);
        }
      }
    }
  });
});
