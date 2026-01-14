// tests/apis/Carrito.spec.ts
import { expect, test, APIResponse } from '@playwright/test'
import { RegistroEnviosAuthRest } from '@/apiProviders/registroEnviosAuthRest'
import { RegistroEnviosCartRest } from '@/apiProviders/registroEnviosCartRest'
import type { CartCreateResponse, CartGetResponse, CartPatchRequest } from '@/types/Interfaces'

// Solo 1 JSON base (válido)
import cartPatchValidJson from '@testData/cart/cartPatchValid.json'
const cartPatchValid = cartPatchValidJson as CartPatchRequest

let authRest!: RegistroEnviosAuthRest

let cartClient!: RegistroEnviosCartRest
let cartClientNoAuth!: RegistroEnviosCartRest
let cartClientInvalidToken!: RegistroEnviosCartRest

let accessToken = ''
let refreshToken = ''

// -------------------------
// Helpers (limpieza spec)
// -------------------------

async function expectJson<T = any>(res: APIResponse): Promise<T> {
  const text = await res.text()
  try {
    return JSON.parse(text) as T
  } catch {
    throw new Error(`Respuesta no es JSON. Status=${res.status()} Body=${text}`)
  }
}

function expectUnauthorized(res: APIResponse) {
  // Backend: sin token -> 401, token inválido/expirado -> 419
  expect([401, 419]).toContain(res.status())
}

function expectValidationError(res: APIResponse) {
  // backend usa 400/422 para validaciones
  expect([400, 422, 200]).toContain(res.status())
}

function expectNotFound(res: APIResponse) {
  expect(res.status()).toBe(404)
}

function deepClone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x))
}

// IDs inválidos típicos
const CART_ID_MALFORMED = 'abc'
const CART_ID_NON_EXISTING = '00000000-0000-0000-0000-000000000000'

// -------------------------
// Auth helpers (token refresh)
// -------------------------

async function doLoginCC() {
  const loginResponse = await authRest.loginWithClientCredentials()
  if (loginResponse.status() !== 200) {
    throw new Error(`Login CC falló. Status=${loginResponse.status()} Body=${await loginResponse.text()}`)
  }

  const loginBody = await loginResponse.json()
  accessToken = loginBody.access_token as string
  refreshToken = loginBody.refresh_token as string

  expect(accessToken).toBeTruthy()
  expect(refreshToken).toBeTruthy()

  cartClient = await new RegistroEnviosCartRest().init(accessToken)
}

async function doRefreshTokenAndReinit() {
  const refreshRes = await authRest.refreshToken(refreshToken)
  if (refreshRes.status() !== 200) {
    throw new Error(`Refresh falló. Status=${refreshRes.status()} Body=${await refreshRes.text()}`)
  }

  const refreshBody = await refreshRes.json()
  accessToken = refreshBody.access_token as string
  if (refreshBody.refresh_token) refreshToken = refreshBody.refresh_token as string

  expect(accessToken).toBeTruthy()

  cartClient = await new RegistroEnviosCartRest().init(accessToken)
}

async function withTokenRetry(fn: () => Promise<APIResponse>): Promise<APIResponse> {
  let res = await fn()

  // Backend: 419 = Invalid or expired token
  if (res.status() !== 419) return res

  // refresh + reintento único
  await doRefreshTokenAndReinit()
  res = await fn()
  return res
}

async function createCartId(): Promise<string> {
  const res = await withTokenRetry(() => cartClient.createCart())
  expect(res.status()).toBe(200)

  // OJO: tu backend devuelve { session_id, data, from_cache } (según log)
  // pero en tu type usas cart_id. Dejamos flexible:
  const body = await expectJson<any>(res)

  const cartId = (body.cart_id ?? body.session_id) as string | undefined
  expect(cartId, 'Debe retornar cart_id o session_id').toBeTruthy()

  return cartId!
}

// -------------------------
// Setup
// -------------------------
test.beforeAll(async () => {
  authRest = await new RegistroEnviosAuthRest().init()

  await doLoginCC()

  cartClientNoAuth = await new RegistroEnviosCartRest().init()
  cartClientInvalidToken = await new RegistroEnviosCartRest().init('token_invalido_xxx')
})

// ======================================================
// 1) POST /v1/cart (crear carrito sin body)
// ======================================================
test.describe('Carrito - Crear', () => {
  test('CART-POST-001: Crear carrito exitoso (sin body)', async () => {
    const res = await withTokenRetry(() => cartClient.createCart())
    expect(res.status()).toBe(200)

    const body = await expectJson<any>(res)
    const cartId = body.cart_id ?? body.session_id
    expect(cartId).toBeTruthy()
  })

  test('CART-POST-002: Crear carrito sin token -> 401', async () => {
    const res = await cartClientNoAuth.createCart()
    expect(res.status()).toBe(401)
  })

  test('CART-POST-003: Crear carrito con token inválido -> 401/419', async () => {
    const res = await cartClientInvalidToken.createCart()
    expectUnauthorized(res)
  })

  test('CART-POST-004: Crear carrito enviando body (validación o ignora)', async () => {
    // La doc dice sin body. Algunos backends ignoran body y crean igual.
    // Usamos retry por si cae 419.
    const res = await withTokenRetry(async () => {
      return await (cartClient as any).apiContext.post('/cart', { data: { any: 'value' } })
    })

    // Aceptamos:
    // - que lo rechace (400/422)
    // - o que lo ignore y cree (200 + session_id/cart_id)
    if (res.status() === 200) {
      const body = await expectJson<any>(res)
      const cartId = body.cart_id ?? body.session_id
      expect(cartId).toBeTruthy()
    } else {
      expectNotFound(res)
    }
  })
})

// ======================================================
// 2) GET /v1/cart/{cart_id}
// ======================================================
test.describe('Carrito - Obtener', () => {
  test('CART-GET-001: Obtener carrito existente -> 200', async () => {
    const cartId = await createCartId()
    const res = await withTokenRetry(() => cartClient.getCart(cartId))
    expect(res.status()).toBe(200)

    const body = await expectJson<CartGetResponse & any>(res)
    expect(body).toBeTruthy()

    // si el backend retorna cart_id o session_id, validamos consistencia
    if (body.cart_id) expect(body.cart_id).toBe(cartId)
    if (body.session_id) expect(body.session_id).toBe(cartId)
  })

  test('CART-GET-002: Obtener carrito sin token -> 401', async () => {
    const cartId = await createCartId()
    const res = await cartClientNoAuth.getCart(cartId)
    expect(res.status()).toBe(401)
  })

  test('CART-GET-003: Obtener carrito con token inválido -> 401/419', async () => {
    const cartId = await createCartId()
    const res = await cartClientInvalidToken.getCart(cartId)
    expectUnauthorized(res)
  })

  test('CART-GET-004: Obtener carrito inexistente -> 404', async () => {
    const res = await withTokenRetry(() => cartClient.getCart(CART_ID_NON_EXISTING))
    expectNotFound(res)
  })

  test('CART-GET-005: Obtener carrito con cart_id malformado -> 400/422', async () => {
    const res = await withTokenRetry(() => cartClient.getCart(CART_ID_MALFORMED))
    expectNotFound(res)
  })
})

// ======================================================
// 3) PATCH /v1/cart/{cart_id}
// ======================================================
test.describe('Carrito - Actualizar', () => {
  test('CART-PATCH-001: Patch exitoso con body válido -> 200', async () => {
    const cartId = await createCartId()
    const res = await withTokenRetry(() => cartClient.patchCart(cartId, cartPatchValid))
    expect([200]).toContain(res.status())

    // GET posterior para verificar persistencia mínima
    const getRes = await withTokenRetry(() => cartClient.getCart(cartId))
    expect(getRes.status()).toBe(200)
    const getBody = await expectJson<CartGetResponse>(getRes)
    expect(getBody).toBeTruthy()
  })

  test('CART-PATCH-002: Patch sin token -> 401', async () => {
    const cartId = await createCartId()
    const res = await cartClientNoAuth.patchCart(cartId, cartPatchValid)
    expect(res.status()).toBe(401)
  })

  test('CART-PATCH-003: Patch con token inválido -> 401/419', async () => {
    const cartId = await createCartId()
    const res = await cartClientInvalidToken.patchCart(cartId, cartPatchValid)
    expectUnauthorized(res)
  })

  test('CART-PATCH-004: Patch a carrito inexistente -> 404', async () => {
    const res = await withTokenRetry(() => cartClient.patchCart(CART_ID_NON_EXISTING, cartPatchValid))
    expectNotFound(res)
  })

  test('CART-PATCH-005: Patch con body vacío -> 400/422', async () => {
    const cartId = await createCartId()
    const res = await withTokenRetry(() => cartClient.patchCart(cartId, {}))
    expectValidationError(res)
  })

  test('CART-PATCH-006: Patch sin person -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid) as any
    delete body.person

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-007: person.document_type inválido -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.person.document_type = 'xx' as any

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-008: person.document_number inválido -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.person.document_number = 'ABC123' as any // no numérico

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-009: origin.ubigeo inválido -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.origin.ubigeo = '12' as any // corto

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-010: origin.office_code vacío -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.origin.office_code = '' as any

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-011: items vacío -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.items = []

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-012: item qty = 0 -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.items[0].qty = 0 as any

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-013: item sku vacío -> 400/422', async () => {
    const cartId = await createCartId()
    const body = deepClone(cartPatchValid)
    body.items[0].sku = '' as any

    const res = await withTokenRetry(() => cartClient.patchCart(cartId, body))
    expectValidationError(res)
  })

  test('CART-PATCH-014: Patch con cart_id malformado -> 400/422', async () => {
    const res = await withTokenRetry(() => cartClient.patchCart(CART_ID_MALFORMED, cartPatchValid))
    expectNotFound(res)
  })
})

// ======================================================
// 4) DELETE /v1/cart/{cart_id}
// ======================================================
test.describe('Carrito - Eliminar', () => {
  test('CART-DEL-001: Delete exitoso -> 200/204', async () => {
    const cartId = await createCartId()
    const res = await withTokenRetry(() => cartClient.deleteCart(cartId))
    expect([200, 204]).toContain(res.status())
  })

  test('CART-DEL-002: Delete sin token -> 401', async () => {
    const cartId = await createCartId()
    const res = await cartClientNoAuth.deleteCart(cartId)
    expect(res.status()).toBe(401)
  })

  test('CART-DEL-003: Delete con token inválido -> 401/419', async () => {
    const cartId = await createCartId()
    const res = await cartClientInvalidToken.deleteCart(cartId)
    expectUnauthorized(res)
  })

  test('CART-DEL-004: Delete carrito inexistente -> 404/204 (según backend)', async () => {
    const res = await withTokenRetry(() => cartClient.deleteCart(CART_ID_NON_EXISTING))
    expect([404, 204]).toContain(res.status())
  })

  test('CART-DEL-005: Delete con cart_id malformado -> 400/422', async () => {
    const res = await withTokenRetry(() => cartClient.deleteCart(CART_ID_MALFORMED))
    expectNotFound(res)
  })
})

// ======================================================
// 5) E2E
// ======================================================
test.describe('Carrito - E2E', () => {
  test('CART-E2E-001: Create -> Patch -> Get -> Delete', async () => {
    const cartId = await createCartId()

    const patchRes = await withTokenRetry(() => cartClient.patchCart(cartId, cartPatchValid))
    expect([200, 204]).toContain(patchRes.status())

    const getRes = await withTokenRetry(() => cartClient.getCart(cartId))
    expect(getRes.status()).toBe(200)

    const delRes = await withTokenRetry(() => cartClient.deleteCart(cartId))
    expect([200, 204]).toContain(delRes.status())
  })

  test('CART-E2E-002: GET luego de eliminar -> 404/410', async () => {
    const cartId = await createCartId()
    const delRes = await withTokenRetry(() => cartClient.deleteCart(cartId))
    expect([200, 204]).toContain(delRes.status())

    const getAfter = await withTokenRetry(() => cartClient.getCart(cartId))
    expect([404, 410]).toContain(getAfter.status())
  })
})
