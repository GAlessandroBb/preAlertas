import { expect, test } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('https://clientes.olvabox.com/')
})
