import { test, expect } from '@playwright/test';

// simulate a streaming response including a response-metadata chunk
const streamBody = [
  'data: {"type":"response-metadata"}\n\n',
  'data: {"type":"text-delta","textDelta":"Hello"}\n\n',
  'data: {"type":"finish","finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n\n',
].join('');

test('chat streams without vite overlay', async ({ page }) => {
  await page.route('/api/chat', (route) => {
    route.fulfill({
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
      body: streamBody,
    });
  });

  await page.goto('/');

  const textarea = page.getByPlaceholder('How can Bolt help you today?');
  await textarea.fill('hello');
  await textarea.press('Enter');

  // wait for streaming to finish
  await page.waitForTimeout(500);

  const overlay = page.locator('#vite-error-overlay');
  await expect(overlay).toHaveCount(0);
});
