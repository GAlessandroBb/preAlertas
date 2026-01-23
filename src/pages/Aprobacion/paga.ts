import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from '../base/BasePage'

export class PagaYSigue extends BasePage {
    private readonly paga = '/shs'

    private readonly btnPaga:Locator
    private readonly solicitud:Locator
    private readonly servicioOlvaBtn:Locator
    private readonly modal:Locator
    private readonly titleSh:Locator
    private readonly niubizBtn:Locator
    private readonly pagarBtn:Locator
    private readonly modalPago:Locator
    private readonly tarjetaCredito:Locator
    private readonly continuarBtn:Locator
    private readonly nmrTarjeta:Locator
    private readonly mmaa:Locator
    private readonly cvv:Locator
    private readonly nombreTarjeta:Locator
    private readonly apellidoTarjeta:Locator
    private readonly email:Locator
    private readonly pagarTarjetaBtn:Locator
    private readonly alertaVerificacion:Locator


    constructor(page: Page) {
        super(page)

        this.btnPaga = page.getByRole('link', { name: 'Paga y sigue tu envio' })
        this.solicitud = page.locator('table tbody tr').first()
        this.servicioOlvaBtn = this.solicitud.getByRole('button', { name: /servicio olva/i })
        this.modal = page.locator('.modal-content')
        this.titleSh = page.locator('#titleSH')
        this.niubizBtn = page.locator('label[data-method="Niubiz"] input[type="radio"]')
        this.pagarBtn = page.locator('button.btn-submit-pago')
        this.modalPago = page.locator('.paymentMethods')
        this.tarjetaCredito = page.locator('.pm001')
        this.continuarBtn = page.locator('.payment-continue')

        this.nmrTarjeta = page.locator('.number')
        this.mmaa = page.locator('.expiry')
        this.cvv = page.locator('.cvc')
        this.nombreTarjeta = page.locator('.name')
        this.apellidoTarjeta = page.locator('.lastname')
        this.email = page.locator('.email')
        this.pagarTarjetaBtn = page.locator('button.btn-pay[type="submit"]')
        this.alertaVerificacion = page.locator('div.alert.alert-success')
    }

    async goToPagaYSigue(): Promise<void> {
        await this.btnPaga.click()
    }

    async navigate(): Promise<void> {
        await this.navigateTo(this.paga)
        await this.waitForLoaded()
    }

    async waitForLoaded(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded')
    }

    async clickOlvaBtn(): Promise<void> {
        await this.servicioOlvaBtn.click()
    }

    async pago(idSh: string): Promise<void> {
        await expect(this.modal).toBeVisible()

        const shModalText = (await this.titleSh.textContent())?.trim()
        expect(shModalText).toBe(idSh)

        await this.niubizBtn.click()
        await this.pagarBtn.click()

        await expect(this.modalPago).toBeVisible()
        await this.tarjetaCredito.click()
        await this.continuarBtn.click()

        await this.nmrTarjeta.fill('5455 4609 2009 4260')
        await this.mmaa.fill('03/28')
        await this.cvv.fill('111')
        await this.nombreTarjeta.fill('Juan')
        await this.apellidoTarjeta.fill('Perez')
        await this.email.fill('pruebasqa@gmail.com')

        await expect(this.pagarTarjetaBtn).toBeEnabled()
        await this.pagarTarjetaBtn.click()

        await expect(this.alertaVerificacion).toBeVisible()
    }
}