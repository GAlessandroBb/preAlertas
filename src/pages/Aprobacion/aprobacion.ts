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

  constructor(page: Page) {
    super(page)
    // this.inputBuscar = page.locator('#sample-table-2_filter input')

    //scrapping para table td
    // this.table = page.locator('#sample-table-2')
    // this.headerRow = this.table.locator('thead tr')
    // this.headers = this.headerRow.locator('th')
    // this.headersSh = this.headers.nth(2)

    // 1. Ubicamos la tabla principal por ID
    this.table = page.locator('#sample-table-2')

    // 3. El input de búsqueda (anclado al contenedor de filtro de esta tabla)
    this.inputBuscar = page.locator('#sample-table-2_filter input')

    this.btnCheckbox = page.locator('tr', { hasText: 'Miami' }).locator('button.btnAprobar')
    this.inputNota = page.getByRole('textbox', { name: 'Nota' })
    this.aprobar = page.locator('#aprobado')
    this.actualizar = page.locator('#btnAct')
  }

  async navigate(): Promise<void> {
    await this.navigateTo(this.aprobarUrl, 'olvabox')
  }

  async buscarSH(shNumber: string): Promise<void> {
    // En tu test, después de navegar o buscar
    const todasLasPestañas = this.page.context().pages()

    // Traer la primera pestaña al frente (donde está el input lleno)
    await todasLasPestañas[0].bringToFront()

    // Si la segunda pestaña no sirve para nada, ciérrala para no confundirte
    if (todasLasPestañas.length > 1) {
      await todasLasPestañas[1].close()
    }

    // Esperar a que el input esté visible
    await this.inputBuscar.waitFor({ state: 'visible', timeout: 5000 })

    try {
      await this.inputBuscar.click()
      await this.page.waitForTimeout(300)

      await this.inputBuscar.fill(shNumber)
      await this.inputBuscar.press('Enter')

      await this.page.waitForTimeout(500)
    } catch (error) {
      console.log('❌ Estrategia 1 falló:', error)
    }
  }

  async aprobarUltimoSh(sHnumber: string): Promise<void> {
    await this.buscarSH(sHnumber)

    const firstRow = this.page.locator('#sample-table-2 tbody tr').first()
    await expect(firstRow).toBeVisible()

    await this.btnCheckbox.click()

    await expect(this.inputNota).toBeVisible()

    await this.inputNota.fill('Aprobado por automatización')
    await this.aprobar.selectOption('1')
    await this.actualizar.click()
  }
}
