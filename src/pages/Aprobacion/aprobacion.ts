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
  private readonly table: Locator
  private readonly headerRow: Locator
  private readonly headers: Locator
  private readonly headersSh: Locator

  constructor(page: Page) {
    super(page)
    this.inputBuscar = page.locator('#sample-table-2_filter input')


    //scrapping para table td
    this.table = page.locator('#sample-table-2');
    this.headerRow = this.table.locator('thead tr');
    this.headers = this.headerRow.locator('th');
    this.headersSh = this.headers.nth(2);


    this.btnCheckbox = page.locator('tr', { hasText: 'Miami' }).locator('button.btnAprobar')
    this.inputNota = page.getByRole('textbox', { name: 'Nota' })
    this.aprobar = page.locator('#aprobado')
    this.actualizar = page.locator('#btnAct')
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.aprobarUrl, 'olvabox')
  }

  // async waitForLoaded(): Promise<void> {
  //   await expect(this.page).
  // }


  async aprobarUltimoSh(): Promise<void> {
    await this.headersSh.click()
    await this.headersSh.click()


    const firstRow = this.page.locator('#sample-table-2 tbody tr').first()
    await expect(firstRow).toBeVisible()


    await this.btnCheckbox.click()


    await expect(this.inputNota).toBeVisible()


    await this.inputNota.fill('Aprobado por automatización')
    await this.aprobar.selectOption('1')
    await this.actualizar.click()
  }
}
