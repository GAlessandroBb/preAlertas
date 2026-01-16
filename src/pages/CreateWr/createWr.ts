import { expect, Locator, Page } from '@playwright/test'
import { NewWrData } from '../../types/Interfaces'
import { BasePage } from '../base/BasePage'

export class CreateWr extends BasePage {
private readonly inputTracking: Locator
private readonly consignee: Locator
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
this.consignee = this.page.locator('#searchConsignee')
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
await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
})

// Esperar a que el elemento principal esté visible
await this.inputTracking.waitFor({ state: 'visible', timeout: 60000 })
}



async selectFromSelect2(container: Locator, value: string) {
// 1. Abrir el Select2
await container.click()

// 2. Input interno de búsqueda de Select2
const searchInput = this.page.locator('.select2-search__field')
await expect(searchInput).toBeVisible()

// 3. Escribir lo que buscas
await searchInput.fill(value)

// 4. Esperar y seleccionar la opción
const option = this.page.locator('.select2-results__option', {
hasText: value}).first()

// await expect(option).toBeVisible()
await option.click()
}



async crearWtr(data: NewWrData): Promise<void> {
await this.inputTracking.fill(data.tracking)
await this.inputInvoice.fill(data.invoice)
await this.inputwrExterno.fill(data.wrExterno)
await this.inputNotaAdm.fill(data.notaAdm)
await this.inputNotaGen.fill(data.notaGen)
await this.inputBaterias.fill(String(data.baterias))


await this.selectFromSelect2(this.listShipper, data.shipper)
await this.selectFromSelect2(this.listCarrier, data.carrier)
await this.selectFromSelect2(this.listTipo, data.paquetes.tipo)

await this.selectConsignee(data.consignee)

const p = data.paquetes
await this.inputCantidad.fill(String(p.cantidad))
await this.listTipo.selectOption(p.tipo)
await this.inputPeso.fill(String(p.peso))
await this.inputAltura.fill(String(p.altura))
await this.inputAncho.fill(String(p.ancho))
await this.inputLargo.fill(String(p.largo))
await this.inputDescripcion.fill(p.descripcion)

await this.addBtn.click()
await this.crearBtn.click()
}

async selectConsignee(name: string) {
await this.consignee.fill(name)
await this.page.click('#btnSearchConsignee')

const modal = this.page.locator('#ModalConsignee')
await expect(modal).toBeVisible()

const rows = modal.locator('#contenidoSearchConsignee tbody tr')

const count = await rows.count()
if (count === 0) {
    throw new Error(`No se encontró ningún consignee con el nombre ${name}`)
}

for (let i = 0; i < count; i++) {
    const rowText = await rows.nth(i).innerText()
    if (rowText.includes(name)) {
    await rows.nth(i).click()
    break
    }
}
await expect(modal).toBeHidden()
}
}



//me esta quedando hacer bien lo de consignee y de ahi creo que ya esta pasando todo de ptmr asi que lo puedo terminar mañana altoq pq es solo ese punto y continuo con las creacion de SH.
