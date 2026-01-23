//login ML, bienvenida,
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class olvaBoxShVerification extends BasePage {
  private readonly aprobarUrl = '/jc2_sh_porAprobar2018.php'

  private readonly inputBuscar: Locator
  private readonly btnCheckbox: Locator
  private readonly inputNota: Locator
  private readonly aprobar: Locator
  private readonly actualizar: Locator

  constructor(page: Page) {
    super(page)

    this.inputBuscar = page.locator('input[aria-controls="sample-table-2"]')
    this.btnCheckbox = page.locator('.icon-check')
    this.inputNota = page.locator('#nota')
    this.aprobar = page.locator('#aprobado')
    this.actualizar = page.locator('#btnAct')
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.aprobarUrl, 'olvabox')
    await this.waitForLoaded()
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  //buscar sh
  async buscarSh(idSh: string): Promise<void> {
    await this.inputBuscar.fill(idSh)
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
