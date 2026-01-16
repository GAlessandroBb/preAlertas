import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://olvamiami.sistemaml.net/index.php?accesscheck=%2Fjc_home.php');
  await page.locator('#USUARIO2').click();
  await page.locator('#USUARIO2').fill('gerardoa');
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'New WR' }).click();
  const page1 = await page1Promise;
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'New WR' }).click();
  const page1 = await page1Promise;
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'New WR' }).click();
  const page1 = await page1Promise;
});
