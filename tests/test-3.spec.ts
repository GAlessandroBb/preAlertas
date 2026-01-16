import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'New WR' }).click();
  const page1 = await page1Promise;


});
await page1.locator('html').click();
await page1.goto('https://olvamiami.sistemaml.net/jc2_addWH1_2019.php');