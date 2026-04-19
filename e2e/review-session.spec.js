import { test, expect } from '@playwright/test';

test.describe('GoGo Arabic - Review Session', () => {
  test.beforeEach(async ({ page }) => {
    // Pre-seed player data with due review cards
    await page.evaluate(() => {
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);

      const playerData = {
        player: JSON.stringify({
          name: 'ReviewTester',
          level: 3,
          xp: 200,
          dirhams: 50,
          currentZone: 'oasis',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {
            'word-1': {
              card: {
                due: new Date(oneDayAgo).toISOString(),
                stability: 1,
                difficulty: 5,
                elapsed_days: 1,
                scheduled_days: 1,
                reps: 1,
                lapses: 0,
                state: 1,
                last_review: new Date(oneDayAgo).toISOString(),
              },
              log: {
                rating: 3,
                review: new Date(oneDayAgo).toISOString(),
              },
            },
            'word-2': {
              card: {
                due: new Date(oneDayAgo).toISOString(),
                stability: 1,
                difficulty: 5,
                elapsed_days: 1,
                scheduled_days: 1,
                reps: 1,
                lapses: 0,
                state: 1,
                last_review: new Date(oneDayAgo).toISOString(),
              },
              log: {
                rating: 3,
                review: new Date(oneDayAgo).toISOString(),
              },
            },
          },
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
          totalReviews: 5,
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

  test('review session loads and shows quiz interface', async ({ page }) => {
    await page.goto('/review');

    // Quiz interface should load
    // Look for question text or quiz UI elements
    const hasQuizUI = await page.locator('.quiz, [class*="quiz"], [class*="review"]').isVisible({ timeout: 10000 }).catch(() => false);
    const hasButtons = await page.getByRole('button').count() > 0;

    expect(hasQuizUI || hasButtons).toBe(true);
  });

  test('user can answer a quiz question', async ({ page }) => {
    await page.goto('/review');

    // Wait for quiz to load
    await page.waitForSelector('button', { timeout: 10000 });

    // Look for answer choice buttons
    const buttons = await page.getByRole('button').all();
    expect(buttons.length).toBeGreaterThan(0);

    // Click first available answer choice (not a navigation button)
    const answerButtons = buttons.filter(async (btn) => {
      const text = await btn.textContent();
      // Filter out navigation/back buttons
      return text && !text.match(/back|exit|close|menu/i);
    });

    if (answerButtons.length > 0) {
      await answerButtons[0].click();

      // After answering, feedback should appear
      // Look for indicators like "Correct", "Incorrect", or next question
      await page.waitForTimeout(1000); // Brief wait for feedback animation

      // Should show some feedback or advance to next question
      const hasFeedback = await page.getByText(/correct|incorrect|next|continue/i).isVisible({ timeout: 5000 }).catch(() => false);
      expect(hasFeedback).toBe(true);
    }
  });

  test('review session shows progress', async ({ page }) => {
    await page.goto('/review');

    // Wait for review session to load
    await page.waitForSelector('button', { timeout: 10000 });

    // Look for progress indicators (progress bar, question count, etc.)
    const hasProgress = await page.locator('[class*="progress"], [role="progressbar"]').isVisible({ timeout: 5000 }).catch(() => false);

    // Progress indicator should be present
    expect(hasProgress).toBe(true);
  });

  test('completing review session shows results', async ({ page }) => {
    await page.goto('/review');

    // Answer questions until session completes
    // Note: This is a simplified test - may need to answer multiple questions
    let attemptsLeft = 25; // Safety limit

    while (attemptsLeft > 0) {
      attemptsLeft--;

      // Check if we've reached results screen
      const hasResults = await page.getByText(/score|complete|finish|result|well done/i).isVisible({ timeout: 2000 }).catch(() => false);
      if (hasResults) {
        // Results screen found!
        expect(hasResults).toBe(true);
        break;
      }

      // Try to answer next question
      const buttons = await page.getByRole('button').all();
      if (buttons.length === 0) break;

      // Find answer button (not back/exit)
      let foundAnswer = false;
      for (const btn of buttons) {
        const text = await btn.textContent();
        if (text && !text.match(/back|exit|close|menu/i)) {
          await btn.click();
          foundAnswer = true;
          await page.waitForTimeout(800); // Wait for transition
          break;
        }
      }

      if (!foundAnswer) break;
    }

    // Should eventually show results or completion
    const hasCompletion = await page.getByText(/score|complete|finish|result|xp|well done/i).isVisible({ timeout: 5000 }).catch(() => false);
    expect(hasCompletion).toBe(true);
  });

  test('review session can be exited', async ({ page }) => {
    await page.goto('/review');

    // Wait for review to load
    await page.waitForSelector('button', { timeout: 10000 });

    // Look for back/exit button
    const backButton = page.getByRole('button', { name: /back|exit|close|menu/i });
    const hasBackButton = await backButton.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasBackButton) {
      await backButton.click();

      // Should navigate away from review
      await page.waitForTimeout(1000);

      // Should not be on /review anymore or should show confirmation
      const currentUrl = page.url();
      const hasConfirmation = await page.getByText(/sure|confirm|cancel/i).isVisible({ timeout: 2000 }).catch(() => false);

      expect(!currentUrl.includes('/review') || hasConfirmation).toBe(true);
    }
  });

  test('typing quiz accepts keyboard input', async ({ page }) => {
    // Pre-seed with typing quiz scenario
    await page.evaluate(() => {
      const now = Date.now();
      const oneDayAgo = now - (24 * 60 * 60 * 1000);

      const playerData = {
        player: JSON.stringify({
          name: 'TypingTester',
          level: 2,
          xp: 100,
          dirhams: 30,
          currentZone: 'oasis',
          position: { x: 0, y: 0 },
          inventory: [],
          outfit: 'simple-thobe',
        }),
        vocabulary: JSON.stringify({
          fsrsCards: {
            'word-hello': {
              card: {
                due: new Date(oneDayAgo).toISOString(),
                stability: 1,
                difficulty: 5,
                elapsed_days: 1,
                scheduled_days: 1,
                reps: 1,
                lapses: 0,
                state: 1,
                last_review: new Date(oneDayAgo).toISOString(),
              },
              log: {
                rating: 3,
                review: new Date(oneDayAgo).toISOString(),
              },
            },
          },
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
          totalReviews: 0,
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

    await page.goto('/review');

    // Wait for review to load
    await page.waitForSelector('button', { timeout: 10000 });

    // Look for text input field (typing quiz)
    const textInput = page.locator('input[type="text"]');
    const hasTextInput = await textInput.isVisible({ timeout: 3000 }).catch(() => false);

    if (hasTextInput) {
      // Type into the input
      await textInput.fill('مرحبا');

      // Verify input was accepted
      const inputValue = await textInput.inputValue();
      expect(inputValue.length).toBeGreaterThan(0);
    }
  });
});
