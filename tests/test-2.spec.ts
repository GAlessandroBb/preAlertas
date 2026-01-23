import { expect, test } from '@playwright/test'

test('test', async ({ page }) => {
  await page.getByRole('link', { name: ' Solicita tu Envio' }).click()
  await page.getByRole('link', { name: ' Comprobante pendiente' }).click()
  await page.getByTitle('Adjuntar Factura').first().click()
  await page.getByRole('button', { name: 'Favor adjuntar la factura' }).click()
  await page.getByRole('button', { name: 'Favor adjuntar la factura' }).setInputFiles('63ebb938ea71d02e7de92e55415aa1df.pdf')
  await page.locator('#valor_fov').click()
  await page.locator('#valor_fov').fill('150')
  await page.getByRole('button', { name: 'Guardar' }).click()
})
