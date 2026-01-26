import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.getByLabel('Selecciona un destinatario').selectOption('45');
  await page.locator('#dest_entrega').selectOption('1');
  await page.locator('#reempaque').selectOption('{"required":1,"opcion_value":1,"field_key":"reempaque"}\n                                                 ');
  await page.locator('#requiereSeguro').selectOption('{"required":1,"opcion_value":6,"field_key":"requiereSeguro"}\n                                                 ');
  await page.getByRole('button', { name: 'Solicitar Envio' }).click();
  await page.getByRole('heading', { name: 'SH000166' }).click();
});