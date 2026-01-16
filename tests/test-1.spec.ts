import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  // Recording...

  await page.getByRole('link', { name: ' Warehouse ' }).click();
  await page.getByRole('link', { name: ' Add WR' }).click();
});