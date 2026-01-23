//login a olvabox (olvaBoxPage), customer, release sh, se abre otra pestaña y hago click en agregar operativo, miami y aereo, 'SI', Se crea, verifica que es ESTATUS sea OPEN y le haces click en 'add SH', hago una busqueda del idSh creado anteriormente, verifico que este en la lista y hago click en el checkbox y verificar que el boton 'Agregar el vuelo' y si lo esta entonces le das click y validar que cuando recargue se muestre el pop up EXITO.

import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class Release extends BasePage {
  private readonly releaseUrl = '/jc2_SS_Operativos.php'
  readonly page: Page
  private readonly releaseShBtn: Locator
  private readonly agregarOperativoBtn: Locator
  private readonly modalOperativo: Locator
  private readonly siBtn: Locator

  constructor(page: Page) {
    super(page)
    this.page = page
    this.releaseShBtn = page.locator('ul.submenu li a:text("SH Verification")')
    this.agregarOperativoBtn = page.locator('.btn-group')
    this.modalOperativo = page.locator('.modal-content')
    this.siBtn = page.locator('.btn.btn-primary')
  }

  async release(): Promise<void> {
    await this.releaseShBtn.click()
  }

  async waitForLoaded(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded')
  }

  async agregarOperativo(): Promise<void> {
    await this.agregarOperativoBtn.click()
    await expect(this.modalOperativo).toBeVisible()
    await this.siBtn.click()
  }

  async clickAddShIfFirstRowIsOpen(): Promise<void> {
    const firstRow = this.page.locator('tbody tr').first()

    await expect(firstRow).toBeVisible()

    const status = await firstRow.locator('td:nth-child(2)').innerText()

    if (status.trim() === 'OPEN') {
      const addShBtn = firstRow.locator('.btnEditar')
      await expect(addShBtn).toBeVisible()
      await addShBtn.click()
    }
  }

  async agregarShAlVuelo(idSh: string): Promise<void> {
    const searchInput = this.page.locator('#myTable_filter input[type="search"]')

    await expect(searchInput).toBeVisible()
    await searchInput.fill(idSh)

    const firstRow = this.page.locator('#myTable tbody tr').first()
    await expect(firstRow).toBeVisible()

    const checkbox = firstRow.locator('input.idSHCheck')

    await expect(checkbox).toBeVisible()
    await checkbox.check()

    const agregarVueloBtn = this.page.locator('#btnSolicitar')

    await expect(agregarVueloBtn).toBeEnabled()
    await agregarVueloBtn.click()
  }
}
