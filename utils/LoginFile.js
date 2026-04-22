import { expect } from '@playwright/test';

export async function login(page, username, password) {
  await page.goto('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForLoadState('networkidle');

  await expect(page.locator('h6:has-text("Dashboard")')).toBeVisible({ timeout: 10000 });
  await expect(page).toHaveURL(/dashboard/);
}