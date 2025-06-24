import { test, expect } from '@playwright/test';

test('API key button opens dialog', async ({ page }) => {
  await page.goto('/');

  const button = page.getByRole('button', { name: /API Keys/i });
  await expect(button).toBeVisible();
  await button.click();

  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel('Provider')).toBeVisible();
  await expect(dialog.getByLabel('API Key')).toBeVisible();
  await expect(dialog.getByRole('button', { name: /Test/i })).toBeVisible();
});
