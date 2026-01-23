import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class SolicitudEnvio extends BasePage {
  private readonly SolicitudEnvio = '/wrs'

  private readonly solicitaList: Locator
  private readonly optionSolicitarEnvio: Locator
  private readonly btnSolicitar: Locator
  private readonly tblWrTable: Locator
  private readonly tbodyWrTable: Locator
  private readonly trFirstRow: Locator
  private readonly tdFirstCell: Locator
  private readonly checkboxFirstRow: Locator

  constructor(page: Page) {
    super(page)

    this.solicitaList = page.getByRole('link', { name: ' Solicita tu Envio' })
    this.optionSolicitarEnvio = page.getByRole('link', { name: ' Solicitud de envío' })
    this.btnSolicitar = page.locator('.btnSolicitarEnvio1')

    // En tu constructor de Page Object
    this.tblWrTable = page.locator('#wrTable')

    // NO repitas '#wrTable' dentro de los hijos, Playwright ya sabe que está ahí
    this.tbodyWrTable = this.tblWrTable.locator('tbody')

    // tr[0] no es CSS válido, se usa .first() o .nth(0)
    this.trFirstRow = this.tbodyWrTable.locator('tr').first()

    // Ubicamos el primer TD de esa fila
    this.tdFirstCell = this.trFirstRow.locator('td').first()

    // Ubicamos el checkbox dentro de ese TD
    // Usamos el tipo para que sea más genérico o el ID si es fijo
    this.checkboxFirstRow = this.tdFirstCell.locator('input[type="checkbox"]')
  }

  async goToSolicitaList(): Promise<void> {
    await this.solicitaList.click()
    await this.waitForLoaded()
  }
  async waitForLoaded(): Promise<void> {
    await expect(this.optionSolicitarEnvio).toBeVisible()
  }
  async clickOptionSolicitarEnvio(): Promise<void> {
    await this.optionSolicitarEnvio.click()
  }
  // async navigate(): Promise<void> {
  //     await this.navigateTo(this.SolicitudEnvio)
  //     await this.page.waitForLoadState('domcontentloaded')
  // }

  async chooseWrByTracking(trackingObjetivo: string): Promise<void> {
    // 1️⃣ Buscar por tracking (esto ya funciona)
    const searchInput = this.page.locator('#wrTable_filter input[type="search"]')
    await searchInput.fill(trackingObjetivo)

    // 2️⃣ Esperar a que DataTables filtre
    await this.page.waitForTimeout(500)

    // 3️⃣ Click REAL desde el DOM (sin Playwright actions)
    // const clicked = await this.page.evaluate(() => {
    //   const checkbox = document.querySelector('#wrTable tbody tr td input.pqtesMarcado') as HTMLInputElement | null

    //   if (!checkbox) return false

    //   checkbox.checked = true
    //   checkbox.dispatchEvent(new Event('change', { bubbles: true }))
    //   checkbox.click()

    //   return true
    // })

    const clicked: boolean = await this.seleccionarCheckboxPorTexto(trackingObjetivo)

    if (!clicked) {
      throw new Error('Checkbox no encontrado después de filtrar por tracking')
    }
  }

  // async seleccionarCheckboxPorTexto(textoFila: string) {
  //   // 1. Buscamos la fila (tr) que contiene el texto específico
  //   const fila = this.tbodyWrTable.locator('tr', { hasText: textoFila })

  //   // 2. Dentro de ESA fila, buscamos el checkbox y le damos click
  //   // Playwright esperará a que sea visible y clickeable automáticamente
  //   await fila.locator('td').first().locator('input[type="checkbox"]').click()
  // }

  async seleccionarCheckboxPorTexto(tracking: string): Promise<boolean> {
    // 1. Usamos una expresión regular para que la búsqueda sea exacta y no falle por espacios
    const fila = this.tbodyWrTable.locator('tr').filter({
      hasText: new RegExp(`\\b${tracking.trim()}\\b`, 'i')
    })

    try {
      // 2. ¡CLAVE!: Esperar a que la fila sea visible (count() no hace esto)
      // Si la fila no aparece en 5 segundos, lanzará un error y pasará al catch
      await fila.waitFor({ state: 'visible', timeout: 5000 })

      // 3. En estas tablas, el click DEBE ser en el <label> o usar force:true
      // Intentamos clickear el label que está dentro del primer td de esa fila
      const selectorCheck = fila.locator('td').first().locator('label')

      // Si el label no existe, intentamos el input con force
      if ((await selectorCheck.count()) > 0) {
        await selectorCheck.click()
      } else {
        await fila.locator('input[type="checkbox"]').click({ force: true })
      }

      return true
    } catch (_e) {
      // Si entra aquí es porque la fila no apareció o el click falló
      console.log(`DEBUG: No se encontró la fila con tracking: ${tracking}`)
      return false
    }
  }

  async enviarSolicitud(): Promise<void> {
    await this.btnSolicitar.click()
  }
}
