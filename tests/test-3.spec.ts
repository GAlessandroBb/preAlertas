import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://app.olvabox.com/');
  await page.locator('html').click();
  await page.locator('#USUARIO2').click();
  await page.locator('#USUARIO2').fill('wendycwcolva12');
  await page.locator('#PASS2').click();
  await page.locator('#PASS2').press('ControlOrMeta+z');
  await page.locator('#USUARIO2').fill('wendyc');
  await page.locator('#PASS2').click();
  await page.locator('#PASS2').click();
  await page.locator('#PASS2').fill('wcolva12');
  await page.getByRole('button', { name: ' Login' }).click();
  await page.getByRole('link', { name: ' Versión PC' }).click();
  await page.getByRole('link', { name: ' Customer Service ' }).click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: ' SH Verification' }).click();
  const page1 = await page1Promise;
  await page1.getByRole('textbox', { name: 'Search:' }).click();
  await page1.getByRole('textbox', { name: 'Search:' }).fill('sh0000045');
  
});