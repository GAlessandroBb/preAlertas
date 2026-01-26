import { expect, test } from '@playwright/test'
import { url } from 'inspector'
import { olvaBoxShVerification } from '../../src/pages/Aprobacion/aprobacion'
import { LoginOlvaBoxPage } from '../../src/pages/Aprobacion/login'
import { PagaYSigue } from '../../src/pages/Aprobacion/paga'
import { olvaBoxHomeShVerification } from '../../src/pages/Aprobacion/shVerification'
import { LoginPage } from '../../src/pages/PreAlerta/Login/loginPage'
import { Create } from '../../src/pages/PreAlerta/prealertas/create'
import { PreAlerta } from '../../src/pages/PreAlerta/prealertas/prealerta'
import { Release } from '../../src/pages/ReleaseSh/releaseSh'
import { comprobantePendiente } from '../../src/pages/Sh/Comprobante/comprobante'
import { Consolidate } from '../../src/pages/Sh/Consolidate/consolidate'
import { SolicitudEnvio } from '../../src/pages/Sh//SolEnvio/envio'
import { olvaBoxHomeVisualizacion } from '../../src/pages/Sh/Visualización/visualizacionAgente'
import { olvaBoxHomeVisualizacionVerificacion } from '../../src/pages/Sh/Visualización/visualizacionValidada'
import { CreateWr } from '../../src/pages/WR/CreateWr/createWr'
import { Bienvenida } from '../../src/pages/WR/HomeMl/1bienvenidaMl'
import { olvaBoxHomeWr } from '../../src/pages/WR/HomeMl/2homeMl'
import { wareHouse } from '../../src/pages/WR/HomeMl/3addingWr'
import { LoginMLPage } from '../../src/pages/WR/LoginML/loginMl'

test('Flujo completo PreAlerta, WR y SH', async ({ page, context }) => {
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

    const tracking = await createPreAlerta.createPrealerta({
        tienda: 'Amazon',
        contenido: 'Audífonos',
        precio: '100',
        instrucciones: 'Frágil'
    })

    await createPreAlerta.guardar()

    //validar creacion
    await prealertasPage.waitForLoaded()
    await prealertasPage.expectPrealertaCreada()




    //WR
    // Otorgar permisos de cámara ANTES de navegar
    await context.grantPermissions(['camera'], { origin: 'https://olvamiami.sistemaml.net' })

    const loginPageMl = new LoginMLPage(page)
    await loginPageMl.navigate()
    await loginPageMl.waitForLoaded()
    await loginPageMl.login('gerardoa', 'arceg.3892')

    const bienvenidaPage = new Bienvenida(page)
    await bienvenidaPage.waitForLoaded()
    await bienvenidaPage.clickVersionPc()

    const home = new olvaBoxHomeWr(page)
    await home.waitForLoaded()
    await home.abrirMenuWarehouse()
    await home.clickAddWr()

    const adding = new wareHouse(page)
    await adding.waitForLoaded()

    const popupPromise = page.waitForEvent('popup')
    await adding.clickBtnAddWr()
    const popupPage = await popupPromise

    await context.grantPermissions(['camera'], { origin: 'https://olvamiami.sistemaml.net' })

    // Usar el popup para crear el WR
    const createWr = new CreateWr(popupPage)
    await createWr.waitForLoaded()

    const wrData = {
        tracking: tracking,
        shipper: 'Amazon',
        carrier: 'DHL',
        baterias: '0',
        invoice: 'INV-11223344',
        wrExterno: 'EXT-11223344',
        notaAdm: 'Nota administrativa',
        notaGen: 'Nota general',
        cantidad: '4',
        tipo: 'Box',
        peso: '10',
        altura: '20',
        ancho: '30',
        largo: '40',
        descripcion: 'Electrónicos'
    }

    await createWr.crearWR(wrData)
    await createWr.closePage()




    //SH
    const comprobante = new comprobantePendiente(page)
    await comprobante.navigateDashboard()
    // await comprobante.goToSolicitaList()
    // await comprobante.waitForLoaded()
    // await comprobante.navigate()
    // await comprobante.agregarFac()
    // await comprobante.verificacion()

    const solicitudEnvio = new SolicitudEnvio(page)
    await solicitudEnvio.goToSolicitaList()
    await solicitudEnvio.waitForLoaded()
    await solicitudEnvio.clickOptionSolicitarEnvio()
    await solicitudEnvio.chooseWrByTracking(tracking)
    await solicitudEnvio.enviarSolicitud()
    await solicitudEnvio.checkModalIfFob()


    const consolidate = new Consolidate(page)
    // await consolidate.navigate()
    await consolidate.selectOptions()
    await consolidate.enviarSolicitud()
    const idSh = await consolidate.verificarMensajeExitoso()
    console.log(idSh)
    

    // const visualizacion = new olvaBoxHomeVisualizacion(page)
    // await home.navigate()
    // await home.waitForLoaded()
    // await visualizacion.shipmentClick()

    // const visualizacionVerificada = new olvaBoxHomeVisualizacionVerificacion(page)
    // await visualizacionVerificada.navigate()
    // await visualizacionVerificada.waitForLoaded()
    // await visualizacionVerificada.verificarPrimerSH(idSh)

            //hacer la comparativa de como lo hace en WR para duplicarlo aqui.




    //Aprobacion SH
    //login, sh verification, aprobacion, paga y sigue
    const loginAprobacion = new LoginOlvaBoxPage(page)
    await loginAprobacion.navigate()
    await loginAprobacion.waitForLoaded()
    await loginAprobacion.login('wendyc', 'wcolva12')

    
    const shVerificationHome = new olvaBoxHomeShVerification(page)
    await shVerificationHome.clickVersionPcOlvaBox()
    await shVerificationHome.tiempo()
    await shVerificationHome.abrirCustomerService()
    await shVerificationHome.clickShVerification()

    

    const ShVerification = new olvaBoxShVerification(page)
    await ShVerification.navigate()
    // await ShVerification.waitForLoaded()
    await ShVerification.aprobarUltimoSh()
    // // await ShVerification.checkbox()
    // await ShVerification.aprobarYActualizar()




    //Pago
    await loginPage.navigate()
    await loginPage.waitForLoaded()
    await loginPage.login('galessandroaae@gmail.com', '.')

    const pagaYSigue = new PagaYSigue(page)
    await pagaYSigue.goToPagaYSigue()
    await pagaYSigue.navigate()
    await pagaYSigue.waitForLoaded()
    await pagaYSigue.clickOlvaBtn()
    await pagaYSigue.pago(idSh)

    //Release
    //login en olvabox, navegar a release, buscar sh, release
    await shVerificationHome.navigate()
    await shVerificationHome.waitForLoaded()
    await shVerificationHome.clickVersionPcOlvaBox()
    await shVerificationHome.waitForLoaded()
    await shVerificationHome.abrirCustomerService()
    const releaseSh = new Release(page)
    await releaseSh.release()
    await releaseSh.waitForLoaded()
    await releaseSh.agregarOperativo()
    await releaseSh.clickAddShIfFirstRowIsOpen()
    await releaseSh.agregarShAlVuelo(idSh)
    }
)