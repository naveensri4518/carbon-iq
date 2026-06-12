import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should allow a user to register and login', async ({ page }) => {
    // 1. Go to register page
    await page.goto('/register');
    await expect(page).toHaveTitle(/Register/);

    // 2. Fill registration form
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');

    // 3. Submit
    await page.click('button[type="submit"]');

    // 4. Expect to be redirected to dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');

    // 5. Logout? (if button exists) or clear cookies and login
    await page.context().clearCookies();
    await page.goto('/login');

    // 6. Login
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 7. Expect dashboard
    await expect(page).toHaveURL(/\/dashboard/);
  });
});
