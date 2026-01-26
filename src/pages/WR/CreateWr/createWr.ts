import { expect, Locator, Page } from '@playwright/test'
import { NewWrData } from '../../../types/Interfaces'
import { BasePage } from '../../base/BasePage'

export class CreateWr extends BasePage {
  private readonly inputTracking: Locator
  // private readonly consignee: Locator
  private readonly listShipper: Locator
  private readonly listCarrier: Locator

  private readonly inputBaterias: Locator
  private readonly inputInvoice: Locator
  private readonly inputwrExterno: Locator
  private readonly inputNotaAdm: Locator
  private readonly inputNotaGen: Locator

  private readonly inputCantidad: Locator
  private readonly listTipo: Locator
  private readonly inputPeso: Locator
  private readonly inputAltura: Locator
  private readonly inputAncho: Locator
  private readonly inputLargo: Locator
  private readonly inputDescripcion: Locator
  private readonly addBtn: Locator
  private readonly crearBtn: Locator

  constructor(page: Page) {
    super(page)

    this.inputTracking = this.page.locator('#tracking')
    // this.consignee = this.page.locator('#searchConsignee')
    this.listShipper = this.page.locator('#select2-shipper_id-container')
    this.listCarrier = this.page.locator('#select2-carrier_id-container')
    this.inputBaterias = this.page.locator('#cantBattery')
    this.inputInvoice = this.page.locator('#invoice')
    this.inputwrExterno = this.page.locator('#wr_externo')
    this.inputNotaAdm = this.page.locator('#descripcion2')
    this.inputNotaGen = this.page.locator('#descripcion1')
    this.inputCantidad = this.page.locator('#pqteQty')
    this.listTipo = this.page.locator('#pqteType')
    this.inputPeso = this.page.locator('#pqteLb')
    this.inputAltura = this.page.locator('#pqteHeight')
    this.inputAncho = this.page.locator('#pqteWidth')
    this.inputLargo = this.page.locator('#pqteLength')
    this.inputDescripcion = this.page.locator('#pqteDescription')
    this.addBtn = this.page.locator('#btnAddPqte')
    this.crearBtn = this.page.locator('#btnCrearWR')
  }

  async navigate(): Promise<void> {
    await this.navigateTo('/jc2_addWH1_2019.php', 'olvamiami')
    await this.waitForLoaded()
  }

  async waitForLoaded(): Promise<void> {
    // Esperar a que la página cargue completamente
    await this.page.waitForLoadState('domcontentloaded')
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {})

    // Esperar a que el elemento principal esté visible
    await this.inputTracking.waitFor({ state: 'visible', timeout: 60000 })
  }

  async selectFromSelect2(container: Locator, value: string) {
    await container.click()

    const searchInput = this.page.locator('.select2-search__field')
    await expect(searchInput).toBeVisible()

    await searchInput.fill(value)

    const option = this.page
      .locator('.select2-results__option', {
        hasText: value
      })
      .first()

    await option.click()
  }

  async trackingMatching(tracking: string): Promise<void> {
    await this.inputTracking.press('Enter')
  }

  async crearWR(data: NewWrData): Promise<void> {
    await this.inputTracking.fill(data.tracking)
    await this.trackingMatching(data.tracking)
    await this.inputInvoice.fill(data.invoice)
    await this.inputwrExterno.fill(data.wrExterno)
    await this.inputNotaAdm.fill(data.notaAdm)
    await this.inputNotaGen.fill(data.notaGen)
    await this.inputBaterias.fill(String(data.baterias))

    await this.selectFromSelect2(this.listShipper, data.shipper)
    await this.selectFromSelect2(this.listCarrier, data.carrier)

    // await this.selectConsignee(data.consignee)

    await this.inputCantidad.fill(String(data.cantidad))
    await this.listTipo.selectOption({ label: data.tipo })
    await this.inputPeso.fill(String(data.peso))
    await this.inputAltura.fill(String(data.altura))
    await this.inputAncho.fill(String(data.ancho))
    await this.inputLargo.fill(String(data.largo))
    await this.inputDescripcion.fill(data.descripcion)

    await this.addBtn.click()
    await this.crearBtn.click()
  }
  
  async closePage(): Promise<void> {
    await this.page.waitForTimeout(5000)
    await this.page.close()
  }

  
  // async selectConsignee(name: string) {
  //     await this.consignee.fill(name)
  //     await this.page.click('#btnSearchConsignee')

  //     const modal = this.page.locator('#ModalConsignee')
  //     await expect(modal).toBeVisible()

  //     const rows = modal.locator('#contenidoSearchConsignee tbody tr')

  //     const count = await rows.count()
  //     if (count === 0) {
  //         throw new Error(`No se encontró ningún consignee con el nombre ${name}`)
  //     }

  //     const firstCheckmark = modal
  //         .locator('span.checkmark')
  //         .first()

  //         await expect(firstCheckmark).toBeVisible()
  //         await firstCheckmark.click()

  //     await expect(modal).toBeHidden()
  // }

}
