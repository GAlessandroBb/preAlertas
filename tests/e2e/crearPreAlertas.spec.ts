import { expect, test } from '@playwright/test'
import { LoginPage } from '../../src/pages/Login/loginPage'
import { Create } from '../../src/pages/prealertas/create'
import { PreAlerta } from '../../src/pages/prealertas/prealerta'

test.describe('Crear PreAlerta', () => {
  let login: LoginPage

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page)
    await login.navigate()
  })

  test('Login', async ({ page }) => {
    // login
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await loginPage.waitForLoaded()
    await loginPage.login('galessandroaae@gmail.com', '.')
  })

  test('Crear 1 Prealerta Correcta', async ({ page }) => {
    // login
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await loginPage.waitForLoaded()
    await loginPage.login('galessandroaae@gmail.com', '.')

    //pagina prealerta
    const prealertasPage = new PreAlerta(page)
    await prealertasPage.goToPreAlertaOption()
    await prealertasPage.waitForLoaded()
    await prealertasPage.clickCrear()

    //crear
    const createPreAlerta = new Create(page)
    await createPreAlerta.waitForLoaded()
    await createPreAlerta.createPrealerta({
      tienda: 'Amazon',
      rastreo: 'TRACK123456',
      contenido: 'Audífonos',
      precio: '99.90',
      instrucciones: 'Frágil'
    })
    await createPreAlerta.guardar()

    //validar creacion
    await prealertasPage.waitForLoaded()
    await prealertasPage.expectPrealertaCreada()
  })
})
