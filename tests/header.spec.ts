import { test, expect } from '@playwright/test';

test('API Keys button visible & opens dialog', async ({ page }) => {
  await page.goto('/');
  try {
    await page.getByTestId('api-keys-btn').waitFor({ state: 'visible', timeout: 5000 });
  } catch (e) {
    await page.screenshot({ path: 'debug.png', fullPage: true });
    throw e;
  }
  await page.click('[data-testid="api-keys-btn"]');
  await expect(page.getByRole('dialog')).toBeVisible();
});
