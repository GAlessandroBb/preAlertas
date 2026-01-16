import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'
import { NewWrData } from '../../types/Interfaces'

export class CreateWr extends BasePage {
readonly inputTracking: Locator
readonly consignee: Locator
readonly listShipper: Locator
readonly listCarrier: Locator

readonly prohibido: Locator
readonly inputBaterias: Locator
readonly verificado: Locator
readonly inputFob: Locator
readonly inputInvoice: Locator
readonly inputwrExterno: Locator
readonly inputinstrucciones: Locator
readonly inputNotaAdm: Locator
readonly inputNotaGen: Locator


readonly inputCantidad: Locator
readonly listTipo: Locator
readonly inputPeso: Locator
readonly inputAltura: Locator
readonly inputAncho: Locator
readonly inputLargo: Locator
readonly inputDescripcion: Locator
readonly addBtn: Locator
readonly crearBtn: Locator

constructor(page: Page) {
super(page)

this.inputTracking = page.locator('#inputTracking')
this.consignee = page.locator('#searchlistConsignee')
this.listShipper = page.locator('#select2-listShipper_id-container')
this.listCarrier = page.locator('#select2-listCarrier_id-container')
this.prohibido = page.locator('#prohibido')
this.inputBaterias = page.locator('#cantBattery')
this.verificado = page.locator('#verificado')
this.inputFob = page.locator('#valor_fov')
this.inputInvoice = page.locator('#inputInvoice')
this.inputwrExterno = page.locator('#wr_externo')
this.inputinstrucciones = page.locator('#instructions')
this.inputNotaAdm = page.locator('#inputDescripcion2')
this.inputNotaGen = page.locator('#inputDescripcion1')
this.inputCantidad = page.locator('#pqteQty')
this.listTipo = page.locator('#pqteType')
this.inputPeso = page.locator('#pqteLb')
this.inputAltura = page.locator('#pqteHeight')
this.inputAncho = page.locator('#pqteWidth')
this.inputLargo = page.locator('#pqteLength')
this.inputDescripcion = page.locator('#pqteDescription')
this.addBtn = page.locator('#btnAddPqte')
this.crearBtn = page.locator('#btnCrearWR')
}

async navigate(): Promise<void> {
    await this.navigateTo('/jc2_addWH1_2019.php', 'olvamiami')
    await this.waitForLoaded()
}
async waitForLoaded(): Promise<void> {
    await expect(this.addBtn).toBeVisible()
    await expect(this.addBtn).toBeEnabled()
}

async selectFromSelect2(container: Locator, value: string) {
    await container.click()
    const option = this.page.locator('.select2-results__option', { hasText: value })
    await expect(option).toBeVisible()
    await option.click()
}

async crearWtr(data: NewWrData): Promise<void> {
    
    await this.inputTracking.fill(String(data.tracking))
    await this.inputinstrucciones.fill(data.instrucciones)
    await this.inputInvoice.fill(data.invoice)
    await this.inputwrExterno.fill(data.wrExterno)
    await this.inputNotaAdm.fill(data.notaAdm)
    await this.inputNotaGen.fill(data.notaGen)
    await this.inputFob.fill(String(data.fob))
    await this.inputBaterias.fill(String(data.baterias))

    
    await this.prohibido.selectOption(data.prohibido ? '1' : '0')
    await this.verificado.selectOption(data.verificado ? '1' : '2')

    
    await this.selectFromSelect2(this.listShipper, data.shipper)
    await this.selectFromSelect2(this.listCarrier, data.carrier)

    
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