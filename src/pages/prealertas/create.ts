import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class Create extends BasePage {
  private readonly createUrl = '/prealertas/create'

  readonly tiendaInput: Locator
  readonly rastreoInput: Locator
  readonly contenidoInput: Locator
  readonly precioInput: Locator
  readonly instruccionesInput: Locator
  readonly btnGuardar: Locator

  constructor(page: Page) {
    super(page)

    this.tiendaInput = page.locator('#shipper')
    this.rastreoInput = page.locator('#tracking')
    this.contenidoInput = page.locator('#articulo')
    this.precioInput = page.locator('#precio')
    this.instruccionesInput = page.locator('#instructions')
    this.btnGuardar = page.getByRole('button', { name: 'Guardar' })
  }

  async waitForLoaded(): Promise<void> {
    await expect(this.tiendaInput).toBeVisible()
    await expect(this.btnGuardar).toBeVisible()
  }

  async createPrealerta(data: { tienda: string; rastreo: string; contenido: string; precio: string; instrucciones: string }): Promise<void> {
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

// de algunas manera ver que en la pagina de prealertas se muestre el mensaje de 'prealerta creada correctamente'
