import { test, expect } from '@playwright/test';

test('homepage shows login button', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /login with discord/i })).toBeVisible();
});

test('homepage has remember me checkbox', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#remember-me')).toBeVisible();
});

test('homepage title is correct', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/MuvBot/i);
});
