import { test, expect } from '@playwright/test';

test.describe('Softwar Learning Platform - Smoke Tests', () => {
  test('homepage loads and displays hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Master Softwar');
    await expect(page.getByRole('link', { name: /start learning/i })).toBeVisible();
  });

  test('chapters index displays all chapters', async ({ page }) => {
    await page.goto('/learn');
    await expect(page.locator('h1')).toContainText('Course Chapters');
    // Should have at least Executive Summary and Ch1
    await expect(page.getByText('Executive Summary')).toBeVisible();
  });

  test('chapter lesson page loads with content', async ({ page }) => {
    await page.goto('/learn/executive-summary');
    await expect(page.locator('article')).toBeVisible();
    // Should have navigation sidebar
    await expect(page.getByText('On This Page')).toBeVisible();
  });

  test('quiz page loads and allows answering', async ({ page }) => {
    await page.goto('/quiz/executive-summary');
    // Wait for quiz to load
    await expect(page.getByText(/Question 1 of/)).toBeVisible();
    // Should have multiple choice options or textarea
    const hasOptions = await page.locator('button:has-text("Proof-of-Work")').count();
    const hasTextarea = await page.locator('textarea').count();
    expect(hasOptions + hasTextarea).toBeGreaterThan(0);
  });

  test('flashcards page loads and allows review', async ({ page }) => {
    await page.goto('/flashcards');
    // Wait for flashcards to load
    await expect(page.getByText(/Card 1 of/)).toBeVisible();
    // Should show a flashcard
    await expect(page.locator('text=Click card to reveal')).toBeVisible();
  });

  test('glossary page displays terms', async ({ page }) => {
    await page.goto('/glossary');
    await expect(page.locator('h1')).toContainText('Glossary');
    await expect(page.getByText('Bitpower')).toBeVisible();
    await expect(page.getByText('Proof-of-Work')).toBeVisible();
  });

  test('figures gallery displays figure cards', async ({ page }) => {
    await page.goto('/figures');
    await expect(page.locator('h1')).toContainText('Figures');
    // Should have at least one figure card
    const figureCards = await page.locator('text=/fig-/').count();
    expect(figureCards).toBeGreaterThan(0);
  });

  test('timeline page displays events chronologically', async ({ page }) => {
    await page.goto('/timeline');
    await expect(page.locator('h1')).toContainText('Timeline');
    await expect(page.getByText('1453')).toBeVisible(); // Constantinople
    await expect(page.getByText('2008')).toBeVisible(); // Bitcoin whitepaper
  });

  test('search page allows querying', async ({ page }) => {
    await page.goto('/search');
    await expect(page.locator('h1')).toContainText('Search');
    await page.fill('input[type="text"]', 'Bitpower');
    await page.click('button:has-text("Search")');
    // Mock search should return results or "no results"
    const hasResults = await page.locator('text="results found"').count();
    const noResults = await page.locator('text="No results found"').count();
    expect(hasResults + noResults).toBeGreaterThan(0);
  });

  test('sources page displays attribution', async ({ page }) => {
    await page.goto('/sources');
    await expect(page.locator('h1')).toContainText('Sources');
    await expect(page.getByText('Jason P. Lowery')).toBeVisible();
    await expect(page.getByText('CC BY 4.0')).toBeVisible();
    await expect(page.getByText('Critical Perspectives')).toBeVisible();
  });

  test('navigation header links work', async ({ page }) => {
    await page.goto('/');
    await page.click('a:has-text("Chapters")');
    await expect(page).toHaveURL('/learn');

    await page.click('a:has-text("Flashcards")');
    await expect(page).toHaveURL('/flashcards');

    await page.click('a:has-text("Glossary")');
    await expect(page).toHaveURL('/glossary');
  });

  test('progress tracking persists in localStorage', async ({ page }) => {
    await page.goto('/flashcards');
    // Wait for flashcards to load
    await expect(page.getByText(/Card 1 of/)).toBeVisible();

    // Flip card and mark as "Good"
    await page.click('text=Click card to reveal');
    await page.waitForTimeout(500); // Wait for flip animation
    const goodButton = page.locator('button:has-text("Good")');
    if (await goodButton.isVisible()) {
      await goodButton.click();
    }

    // Check localStorage
    const storage = await page.evaluate(() => {
      return localStorage.getItem('flashcard-reviews-anonymous');
    });
    expect(storage).toBeTruthy();
  });
});

test.describe('Responsive Design', () => {
  test('mobile viewport displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    // Navigation should still be accessible
    await expect(page.getByRole('link', { name: /start learning/i })).toBeVisible();
  });

  test('tablet viewport displays correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/learn/executive-summary');
    await expect(page.locator('article')).toBeVisible();
  });
});
