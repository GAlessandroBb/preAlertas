//login ML, bienvenida,
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class olvaBoxShVerification extends BasePage {
  private readonly aprobarUrl = '/jc2_sh_porAprobar2018.php'

  private readonly btnCheckbox: Locator
  private readonly inputNota: Locator
  private readonly aprobar: Locator
  private readonly actualizar: Locator
  
  private readonly inputBuscar: Locator

  constructor(page: Page) {
    super(page)
    this.inputBuscar = page.locator('#sample-table-2_filter input')


    this.btnCheckbox = page.locator('tr', { hasText: 'Miami' }).locator('button.btnAprobar')
    this.inputNota = page.getByRole('textbox', { name: 'Nota' })
    this.aprobar = page.locator('#aprobado')
    this.actualizar = page.locator('#btnAct')
  }


  async waitForLoaded(): Promise<void> {
    await expect(this.inputBuscar).toBeVisible({ timeout: 10000 })
  }


  async aprobarUltimoSh(): Promise<void> {
    const thSH = this.page.getByRole('columnheader', { name: 'SH' })
    await thSH.click()

    const thSh2 = this.page.locator('.sorting_desc')
    await thSh2.click()

    const primeraFila = this.page.locator('#sample-table-2 tbody tr').first()

    const btnAprobar = primeraFila.locator('button.btnAprobar')

    await btnAprobar.click()
}


  //click checkbox
  async checkbox(): Promise<void> {
    await this.btnCheckbox.click()
  }

  //aprobar y actualizar
  async aprobarYActualizar(): Promise<void> {
    await this.inputNota.fill('Aprobado por automatizacion')
    await this.aprobar.selectOption('1')
    await this.actualizar.click()
  }
}
