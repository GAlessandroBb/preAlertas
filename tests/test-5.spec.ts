import { expect, test } from '@playwright/test'

test('test', async ({ page }) => {
  await page.getByRole('row', { name: '01/23/2026 16:04 PM Miami ' }).locator('label').click()
  await page.getByRole('button', { name: 'Solicitar Envio' }).click()
  await page.getByRole('button', { name: 'Acepto' }).click()
})
