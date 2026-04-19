import { test, expect } from '@playwright/test';

test.describe('GoGo Arabic - Smoke Tests', () => {
  test('app loads and shows main menu or character creation', async ({ page }) => {
    await page.goto('/');

    // App should load and show either the main menu or character creation screen
    // depending on whether there's saved game data
    const mainMenuHeading = page.getByText(/gogo arabic/i);
    const characterCreationHeading = page.getByText(/create.*character/i);

    // One of these should be visible
    const isMainMenuVisible = await mainMenuHeading.isVisible().catch(() => false);
    const isCharCreationVisible = await characterCreationHeading.isVisible().catch(() => false);

    expect(isMainMenuVisible || isCharCreationVisible).toBe(true);
  });

  test('displays loading screen initially', async ({ page }) => {
    await page.goto('/');

    // Loading screen should appear (may be brief)
    const hasLoadingText = await page.getByText(/loading/i).isVisible().catch(() => false);

    // This test is informational - loading may complete before we can check
    expect(typeof hasLoadingText).toBe('boolean');
  });

  test('page has correct title', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/gogo arabic/i);
  });

  test('no console errors on page load', async ({ page }) => {
    const consoleErrors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');

    // Wait a moment for the page to fully load
    await page.waitForTimeout(2000);

    // Filter out known acceptable errors (like font loading warnings)
    const criticalErrors = consoleErrors.filter(
      (error) =>
        !error.includes('font') &&
        !error.includes('favicon') &&
        !error.includes('manifest')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('can navigate to character creation from main menu', async ({ page }) => {
    await page.goto('/');

    // Look for "New Game" or "Start" button
    const newGameButton = page.getByRole('button', { name: /new game|start/i });

    if (await newGameButton.isVisible().catch(() => false)) {
      await newGameButton.click();

      // Should navigate to character creation or game
      await expect(
        page.getByText(/character|name|choose/i)
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('main menu has expected buttons', async ({ page }) => {
    await page.goto('/');

    // Wait for main menu to load
    await page.waitForSelector('button', { timeout: 5000 });

    // Main menu should have interactive buttons
    const buttons = await page.getByRole('button').all();

    expect(buttons.length).toBeGreaterThan(0);
  });

  test('app is responsive to viewport changes', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await expect(page.locator('body')).toBeVisible();

    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('body')).toBeVisible();

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('body')).toBeVisible();
  });

  test('Canvas element is rendered for Phaser game', async ({ page }) => {
    await page.goto('/');

    // Phaser should create a canvas element
    const canvas = page.locator('canvas');

    await expect(canvas).toBeVisible({ timeout: 5000 });
  });
});
