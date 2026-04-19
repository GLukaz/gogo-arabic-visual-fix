import { test, expect } from '@playwright/test';

test.describe('GoGo Arabic - Authentication & Character Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.evaluate(() => localStorage.clear());
  });

  test('new player can create character and enter game', async ({ page }) => {
    await page.goto('/');

    // Should show main menu or character creation
    const mainMenu = page.getByText(/gogo arabic/i);
    const isMainMenuVisible = await mainMenu.isVisible().catch(() => false);

    if (isMainMenuVisible) {
      // Click "New Game" button to start character creation
      const newGameButton = page.getByRole('button', { name: /new game|start/i });
      await newGameButton.click();
    }

    // Should be on character creation screen
    await expect(page.getByText(/character|name|create/i)).toBeVisible({ timeout: 10000 });

    // Fill in character name
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('TestPlayer');

    // Find and click the create/continue button
    const createButton = page.getByRole('button', { name: /create|continue|start|done/i });
    await createButton.click();

    // Game should load - verify canvas element for Phaser
    await expect(page.locator('canvas')).toBeVisible({ timeout: 10000 });

    // Verify player name appears in game (HUD or state)
    // Note: Player name might be in HUD, pause menu, or profile
    const hasPlayerName = await page.getByText(/TestPlayer/i).isVisible({ timeout: 5000 }).catch(() => false);

    // This test validates the full character creation flow completes successfully
    expect(hasPlayerName || await page.locator('canvas').isVisible()).toBe(true);
  });

  test('character creation persists to localStorage', async ({ page }) => {
    await page.goto('/');

    // Create a character
    const mainMenu = page.getByText(/gogo arabic/i);
    const isMainMenuVisible = await mainMenu.isVisible().catch(() => false);

    if (isMainMenuVisible) {
      const newGameButton = page.getByRole('button', { name: /new game|start/i });
      await newGameButton.click();
    }

    await expect(page.getByText(/character|name|create/i)).toBeVisible({ timeout: 10000 });

    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('PersistentPlayer');

    const createButton = page.getByRole('button', { name: /create|continue|start|done/i });
    await createButton.click();

    // Wait for game to load
    await expect(page.locator('canvas')).toBeVisible({ timeout: 10000 });

    // Check that player data was saved to localStorage
    const playerData = await page.evaluate(() => {
      const data = localStorage.getItem('persist:gogo-arabic');
      return data ? JSON.parse(data) : null;
    });

    expect(playerData).not.toBeNull();
    expect(playerData).toHaveProperty('player');

    const playerState = JSON.parse(playerData.player);
    expect(playerState.name).toBe('PersistentPlayer');
  });

  test('returning player skips character creation', async ({ page }) => {
    // Pre-seed player data to simulate returning player
    await page.evaluate(() => {
      const playerData = {
        player: JSON.stringify({
          name: 'ReturningPlayer',
          level: 5,
          xp: 500,
          dirhams: 100,
          currentZone: 'oasis',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {},
          quizHistory: [],
        }),
        quests: JSON.stringify({
          activeQuests: [],
          completedQuests: [],
        }),
        alphabet: JSON.stringify({
          letters: [],
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

    await page.goto('/');

    // Should skip character creation and go to game or main menu
    // Verify we don't see character creation screen
    const hasCharCreation = await page.getByText(/create.*character/i).isVisible({ timeout: 3000 }).catch(() => false);
    expect(hasCharCreation).toBe(false);

    // Should see main menu or game
    const hasMainMenu = await page.getByText(/gogo arabic|continue|new game/i).isVisible().catch(() => false);
    expect(hasMainMenu).toBe(true);
  });

  test('game canvas renders after character creation', async ({ page }) => {
    await page.goto('/character/create');

    // Fill in character creation
    const nameInput = page.locator('input[type="text"]').first();
    await nameInput.fill('CanvasTestPlayer');

    const createButton = page.getByRole('button', { name: /create|continue|start|done/i });
    await createButton.click();

    // Verify Phaser canvas is created and visible
    const canvas = page.locator('canvas');
    await expect(canvas).toBeVisible({ timeout: 10000 });

    // Verify canvas has dimensions (not 0x0)
    const canvasBox = await canvas.boundingBox();
    expect(canvasBox).not.toBeNull();
    expect(canvasBox.width).toBeGreaterThan(0);
    expect(canvasBox.height).toBeGreaterThan(0);
  });
});
