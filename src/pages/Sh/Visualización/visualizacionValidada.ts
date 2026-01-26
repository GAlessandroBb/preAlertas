import { expect, Page, Locator } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class olvaBoxHomeVisualizacionVerificacion extends BasePage {
    private readonly shipmentUrl = '/jc2_SS_Shipment.php'

    constructor(page: Page) {
        super(page)
    }

    async waitForLoaded(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded')
    }
    
    async navigate(): Promise<void> {
        await this.navigateTo(this.shipmentUrl, 'olvamiami')
        await this.page.waitForLoadState('domcontentloaded')
    }

    async verificarPrimerSH(idSh: string): Promise<void> {
        const tabla = this.page.locator('#sample-table-2 tbody')
        await tabla.waitFor({ state: 'visible' })

        const primeraFila = tabla.locator('tr').first()

        // Capturamos la nueva pestaña que se abrirá
        const [shPage] = await Promise.all([
            new Promise<Page>((resolve) => {
                // Listener para la nueva página
                const listener = (page: Page) => {
                    this.page.context().off('page', listener)
                    resolve(page)
                }
                this.page.context().on('page', listener)
            }),
            primeraFila.locator('td a.btnInfoSH').click() // click que abre target=_blank
        ])

        // Espera que cargue la nueva pestaña
        await shPage.waitForLoadState('domcontentloaded')

        // Obtener el texto del SH en la nueva pestaña
        const shText = await shPage.locator('td a.btnInfoSH, h1.font-weight-bold').first().textContent()
        const shTrim = shText?.trim() || ''

        if (shTrim !== idSh) {
            await shPage.close()
            throw new Error(`SH de la primera fila (${shTrim}) no coincide con el IdSh esperado (${idSh})`)
        }

        // Espera 5 segundos antes de cerrar solo la pestaña secundaria
        await shPage.waitForTimeout(5000)
        await shPage.close()
    }
}
