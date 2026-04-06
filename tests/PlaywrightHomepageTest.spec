import { test, expect } from '@playwright/test';

test('homepage renders main content', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main')).toBeVisible();
});
