import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://clientes.olvabox.com/');
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).click();
  await page.getByRole('textbox', { name: 'Correo Electrónico' }).fill('galessandroaae@gmail.com');
  await page.getByRole('textbox', { name: 'Contraseña' }).click();
  await page.getByRole('textbox', { name: 'Contraseña' }).fill('.');
  await page.getByRole('textbox', { name: 'Contraseña' }).press('Enter');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('link', { name: ' Solicita tu Envio' }).click();
  await page.getByRole('link', { name: ' Solicitud de envío' }).click();
});