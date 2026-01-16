import { expect, Locator, Page } from '@playwright/test'
import path from 'path'
import { BasePage } from '../base/BasePage'

export class Create extends BasePage {
  private readonly createUrl = '/prealertas/create'

  readonly tiendaInput: Locator
  readonly rastreoInput: Locator
  readonly contenidoInput: Locator
  readonly precioInput: Locator
  readonly instruccionesInput: Locator
  readonly btnGuardar: Locator
  readonly comprobante: Locator

  constructor(page: Page) {
    super(page)

    this.tiendaInput = page.locator('#shipper')
    this.rastreoInput = page.locator('#tracking')
    this.contenidoInput = page.locator('#articulo')
    this.precioInput = page.locator('#precio')
    this.instruccionesInput = page.locator('#instructions')
    this.comprobante = page.locator('#archivo')
    this.btnGuardar = page.getByRole('button', { name: 'Guardar' })
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.tiendaInput).toBeVisible()
    await expect(this.btnGuardar).toBeVisible()
  }

  async createPrealerta(data: { tienda: string; rastreo: string; contenido: string; precio: string; instrucciones: string }): Promise<void> {
    const pdfPath = path.resolve(__dirname, '../../testData/comprobantes/comprobante.pdf')

    await this.comprobante.setInputFiles(pdfPath)

    await this.tiendaInput.fill(data.tienda)
    await this.rastreoInput.fill(data.rastreo)
    await this.contenidoInput.fill(data.contenido)
    await this.precioInput.fill(data.precio)
    await this.instruccionesInput.fill(data.instrucciones)
  }

  async guardar(): Promise<void> {
    await expect(this.btnGuardar).toBeEnabled()
    await this.btnGuardar.click()
  }
}
