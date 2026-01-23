import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../../base/BasePage'

export class SolicitudEnvio extends BasePage {
    private readonly SolicitudEnvio = '/wrs'

    private readonly solicitaList: Locator
    private readonly optionSolicitarEnvio: Locator
    private readonly btnSolicitar: Locator
    
    constructor(page: Page) {
        super(page)

        this.solicitaList = page.getByRole('link', { name: ' Solicita tu Envio' })
        this.optionSolicitarEnvio = page.getByRole('link', { name: ' Solicitud de envío' })
        this.btnSolicitar = page.locator('.btnSolicitarEnvio1')
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
        const clicked = await this.page.evaluate(() => {
            const checkbox = document.querySelector(
                '#wrTable tbody tr td input.pqtesMarcado'
            ) as HTMLInputElement | null

            if (!checkbox) return false

            checkbox.checked = true
            checkbox.dispatchEvent(new Event('change', { bubbles: true }))
            checkbox.click()

            return true
        })

        if (!clicked) {
            throw new Error('Checkbox no encontrado después de filtrar por tracking')
        }
    }


    async enviarSolicitud(): Promise<void> {
        await this.btnSolicitar.click()
    }
}