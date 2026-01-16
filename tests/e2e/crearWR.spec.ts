import { expect, test } from '@playwright/test'
import { CreateWr } from '../../src/pages/CreateWr/createWr'
import { Bienvenida } from '../../src/pages/HomeMl/1bienvenidaMl'
import { Dashboard } from '../../src/pages/HomeMl/2homeMl'
import { wareHouse } from '../../src/pages/HomeMl/3addingWr'
import { LoginMLPage } from '../../src/pages/LoginML/loginMl'

test.describe('Crear WareHouseReceipt', () => {
  // test('Login', async ({ page }) => { // login
  // const loginPage = new LoginMLPage(page)
  // await loginPage.navigate()
  // await loginPage.waitForLoaded()
  // await loginPage.login('gerardoa', 'arceg.3892') })

  test('Crear 1 WareHouse Receipt', async ({ page }) => {
    const loginPage = new LoginMLPage(page)
    await loginPage.navigate()
    await loginPage.waitForLoaded()
    await loginPage.login('gerardoa', 'arceg.3892')

    const bienvenidaPage = new Bienvenida(page)
    await bienvenidaPage.waitForLoaded()
    await bienvenidaPage.clickVersionPc()

    const home = new Dashboard(page)
    // await home.navigate()
    await home.waitForLoaded()
    await home.abrirMenuWarehouse()
    await home.clickAddWr()

    const adding = new wareHouse(page)
    await adding.waitForLoaded()
    await adding.clickBtnAddWr()

    const createWr = new CreateWr(page)
    await createWr.waitForLoaded()

    const wrData = {
      tracking: 'TRK123456',
      instrucciones: 'Manejar con cuidado',
      invoice: 'INV-001',
      wrExterno: 'EXT-001',
      notaAdm: 'Nota administrativa',
      notaGen: 'Nota general',
      fob: '150',
      baterias: '0',
      prohibido: false,
      verificado: true,
      shipper: 'AMAZON',
      carrier: 'DHL',
      consignee: 'gabriel benites',
      paquetes: {
        cantidad: '1',
        tipo: 'BOX',
        peso: '10',
        altura: '20',
        ancho: '30',
        largo: '40',
        descripcion: 'Electrónicos'
      }
    }

    await createWr.crearWtr(wrData)
    await createWr.selectConsignee(wrData.consignee)
  })
})
