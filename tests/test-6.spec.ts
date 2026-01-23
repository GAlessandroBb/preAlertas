import { expect, test } from '@playwright/test'

test('test', async ({ page }) => {
  await page.goto('https://clientes.olvabox.com/')
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('g')
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).click()
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('galessandroaae@gmail.com')
  await page.getByRole('textbox', { name: 'Contraseña' }).click()
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('.')
  await page.getByRole('textbox', { name: 'Contraseña' }).press('Enter')
  await page.getByRole('textbox', { name: 'Contraseña' }).press('Enter')
  await page.getByRole('textbox', { name: 'Contraseña' }).press('Enter')
  await page.getByRole('button', { name: 'Ingresar' }).click()
  await page.getByRole('button', { name: 'Ingresar' }).press('Enter')
  await page.getByRole('link', { name: ' Solicitud de envío' }).click()
  await page.getByRole('gridcell', { name: '1769206686349' }).dblclick()
  await page.locator('body').press('ControlOrMeta+c')
  await page.getByRole('searchbox', { name: 'Buscar' }).click()
  await page.getByRole('searchbox', { name: 'Buscar' }).fill('1769206686349')
  await page.getByRole('searchbox', { name: 'Buscar' }).click({
    modifiers: ['ControlOrMeta']
  })
  await page.getByRole('row', { name: '01/23/2026 17:18 PM Miami ' }).locator('label').click()
  await page.getByRole('row', { name: '01/23/2026 17:18 PM Miami ' }).locator('label').click()
})
