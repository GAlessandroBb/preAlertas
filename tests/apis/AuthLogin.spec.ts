// tests/apis/AuthLogin.spec.ts
import { expect, test } from '@playwright/test'
import { RegistroEnviosAuthRest } from '@/apiProviders/registroEnviosAuthRest'
import { AuthGrantType } from '@/types/Interfaces'

// Test data
import loginPwdValid from '@testData/auth/loginPasswordValid.json'
import loginPwdInvalidPassword from '@testData/auth/loginPasswordInvalidPassword.json'
import loginCCValid from '@testData/auth/loginClientCredentialsValid.json'
import loginCCInvalidSecret from '@testData/auth/loginClientCredentialsInvalidSecret.json'
import refreshInvalidToken from '@testData/auth/refreshInvalidToken.json'
import errorMessages from '@testData/auth/errorMessages.json'

// Helper para validar 422 Unprocessable Entity
function expectUnprocessableEntity(
  body: any,
  options?: {
    pointer?: string
    expectedDetail?: string
  }
) {
  expect(body).toHaveProperty('status', 422)
  expect(body).toHaveProperty('title', 'Unprocessable Entity')
  expect(body).toHaveProperty('type')
  expect(body).toHaveProperty('detail')
  expect(body).toHaveProperty('instance')
  expect(body).toHaveProperty('timestamp')
  expect(Array.isArray(body.errors)).toBe(true)

  if (options?.pointer) {
    const hasPointer = body.errors.some((e: any) => e.pointer === options.pointer)
    expect(hasPointer).toBe(true)
  }

  if (options?.expectedDetail) {
    expect(body.detail).toBe(options.expectedDetail)
  }
}

let authRest: RegistroEnviosAuthRest

test.beforeEach(async () => {
  const currentAuthRest = new RegistroEnviosAuthRest()
  authRest = await currentAuthRest.init()
})

//
// 1) LOGIN PASSWORD
//

test('TC-LOGIN-PWD-001: Login exitoso con credenciales válidas (password)', async () => {
  const response = await authRest.loginWithPassword(loginPwdValid.username, loginPwdValid.password)

  expect(response.status()).toBe(200)

  const body = await response.json()
  expect(body.access_token).toBeDefined()
  expect(typeof body.access_token).toBe('string')
  expect(body.refresh_token).toBeDefined()
  expect(typeof body.refresh_token).toBe('string')
})

test('TC-LOGIN-PWD-002: Error con password incorrecto', async () => {
  const response = await authRest.loginWithPassword(
    loginPwdInvalidPassword.username,
    loginPwdInvalidPassword.password
  )

  expect([401]).toContain(response.status())

  const body = await response.json()
  expect(body).toHaveProperty('title')
})

test('TC-LOGIN-PWD-003: Error con username inexistente', async () => {
  const response = await authRest.loginWithPassword('usuario_inexistente_xxx', loginPwdValid.password)

  expect([401]).toContain(response.status())

  const body = await response.json()
  expect(body).toHaveProperty('title')
})

// Depende de tener un usuario bloqueado configurado en backend.
test.skip('TC-LOGIN-PWD-004: Usuario bloqueado/inactivo', async () => {
  const response = await authRest.loginWithPassword('usuario_bloqueado', loginPwdValid.password)
  expect([401, 403]).toContain(response.status())
})

test('TC-LOGIN-PWD-005: Falta username', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.Password,
    // username omitido
    password: loginPwdValid.password
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/username',
    expectedDetail: errorMessages.loginPassword.missingUsername
  })
})

test('TC-LOGIN-PWD-006: Falta password', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.Password,
    username: loginPwdValid.username
    // password omitido
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/password',
    expectedDetail: errorMessages.loginPassword.missingPassword
  })
})

test('TC-LOGIN-PWD-007: Falta grant_type', async () => {
  const bodyRequest = {
    username: loginPwdValid.username,
    password: loginPwdValid.password
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/grant_type',
    expectedDetail: errorMessages.loginPassword.missingGrantType
  })
})

test('TC-LOGIN-PWD-008: grant_type incorrecto', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.ClientCredentials, // incorrecto para password
    username: loginPwdValid.username,
    password: loginPwdValid.password
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    // pointer: '#/grant_type',
    expectedDetail: errorMessages.loginPassword.invalidGrantType
  })
})

test('TC-LOGIN-PWD-009: Body vacío', async () => {
  const response = await authRest.postTokenRaw({})
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    expectedDetail: errorMessages.loginPassword.invalidBody
  })
})

test('TC-LOGIN-PWD-010: Tipos de datos inválidos', async () => {
  const bodyRequest = {
    grant_type: 123, // debería ser string
    username: 99999, // debería ser string
    password: { x: 'y' } // debería ser string
  }

  const response = await authRest.postTokenRaw(bodyRequest as any)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    expectedDetail: errorMessages.loginPassword.invalidD
  })
})

//
// 2) LOGIN CLIENT_CREDENTIALS
//

test('TC-LOGIN-CC-001: Login exitoso con client_credentials válidos', async () => {
  const response = await authRest.loginWithClientCredentials(
    loginCCValid.client_id,
    loginCCValid.client_secret
  )

  expect(response.status()).toBe(200)

  const body = await response.json()
  expect(body.access_token).toBeDefined()
  expect(typeof body.access_token).toBe('string')
  expect(body.refresh_token).toBeDefined()
  expect(typeof body.refresh_token).toBe('string')
})

test('TC-LOGIN-CC-002: client_secret incorrecto', async () => {
  const response = await authRest.loginWithClientCredentials(
    loginCCInvalidSecret.client_id,
    loginCCInvalidSecret.client_secret
  )

  expect([401]).toContain(response.status())

  const body = await response.json()
  expect(body).toHaveProperty('title')
})

test('TC-LOGIN-CC-003: client_id inexistente', async () => {
  const response = await authRest.loginWithClientCredentials(
    'client_inexistente_xxx',
    loginCCValid.client_secret
  )

  expect([401]).toContain(response.status())

  const body = await response.json()
  expect(body).toHaveProperty('title')
})

test('TC-LOGIN-CC-004: client_id y client_secret inválidos', async () => {
  const response = await authRest.loginWithClientCredentials(
    'client_inexistente_xxx',
    'secret_invalido_xxx'
  )

  expect([401]).toContain(response.status())

  const body = await response.json()
  expect(body).toHaveProperty('title')
})

test('TC-LOGIN-CC-005: Falta client_id', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.ClientCredentials,
    // client_id omitido
    client_secret: loginCCValid.client_secret
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/client_id',
    expectedDetail: errorMessages.loginClientCredentials.missingClientId
  })
})

test('TC-LOGIN-CC-006: Falta client_secret', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.ClientCredentials,
    client_id: loginCCValid.client_id
    // client_secret omitido
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/client_secret',
    expectedDetail: errorMessages.loginClientCredentials.missingClientSecret
  })
})

test('TC-LOGIN-CC-007: Falta grant_type', async () => {
  const bodyRequest = {
    client_id: loginCCValid.client_id,
    client_secret: loginCCValid.client_secret
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/grant_type',
    expectedDetail: errorMessages.loginClientCredentials.missingGrantType
  })
})

test('TC-LOGIN-CC-008: grant_type incorrecto', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.Password, // incorrecto
    client_id: loginCCValid.client_id,
    client_secret: loginCCValid.client_secret
  }

  const response = await authRest.postTokenRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    // pointer: '#/grant_type',
    expectedDetail: errorMessages.loginClientCredentials.invalidGrantType
  })
})

test('TC-LOGIN-CC-009: Body vacío', async () => {
  const response = await authRest.postTokenRaw({})
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    expectedDetail: errorMessages.loginClientCredentials.invalidBody
  })
})

test('TC-LOGIN-CC-010: Tipos de dato inválidos', async () => {
  const bodyRequest = {
    grant_type: 999,
    client_id: 12345,
    client_secret: false
  }

  const response = await authRest.postTokenRaw(bodyRequest as any)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    expectedDetail: errorMessages.loginClientCredentials.invalidBodyType
  })
})

//
// 3) REFRESH TOKEN
//

test('TC-REFRESH-001: Refresh exitoso con token obtenido por password', async () => {
  const loginResponse = await authRest.loginWithPassword(loginPwdValid.username, loginPwdValid.password)
  expect(loginResponse.status()).toBe(200)

  const loginBody = await loginResponse.json()
  const refreshToken = loginBody.refresh_token
  expect(refreshToken).toBeDefined()

  const refreshResponse = await authRest.refreshToken(refreshToken)
  expect(refreshResponse.status()).toBe(200)

  const refreshBody = await refreshResponse.json()
  expect(refreshBody.access_token).toBeDefined()
})

test('TC-REFRESH-002: Refresh exitoso con token obtenido por client_credentials', async () => {
  const loginResponse = await authRest.loginWithClientCredentials(
    loginCCValid.client_id,
    loginCCValid.client_secret
  )
  expect(loginResponse.status()).toBe(200)

  const loginBody = await loginResponse.json()
  const refreshToken = loginBody.refresh_token
  expect(refreshToken).toBeDefined()

  const refreshResponse = await authRest.refreshToken(refreshToken)
  expect(refreshResponse.status()).toBe(200)

  const refreshBody = await refreshResponse.json()
  expect(refreshBody.access_token).toBeDefined()
})

test('TC-REFRESH-003: Refresh con refresh_token inválido', async () => {
  const response = await authRest.refreshToken(refreshInvalidToken.refresh_token)
  expect(response.status()).toBe(422)
  const body = await response.json()
})

test.skip('TC-REFRESH-004: Refresh con refresh_token expirado (12 horas)', async () => {
  const response = await authRest.refreshToken('refresh_token_expirado_xxx')
  expect([400]).toContain(response.status())
})

test('TC-REFRESH-005: Reutilizar refresh_token ya usado', async () => {
  const loginResponse = await authRest.loginWithPassword(loginPwdValid.username, loginPwdValid.password)
  expect(loginResponse.status()).toBe(200)

  const loginBody = await loginResponse.json()
  const refreshToken = loginBody.refresh_token

  const firstRefresh = await authRest.refreshToken(refreshToken)
  expect(firstRefresh.status()).toBe(200)

  const secondRefresh = await authRest.refreshToken(refreshToken)
  expect([200, 400]).toContain(secondRefresh.status())
})

test('TC-REFRESH-006: Falta refresh_token', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.RefreshToken
    // refresh_token omitido
  }

  const response = await authRest.postTokenRefreshRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/refresh_token',
    expectedDetail: errorMessages.refreshToken.missingRefreshToken
  })
})

test('TC-REFRESH-007: Falta grant_type', async () => {
  const bodyRequest = {
    refresh_token: 'cualquier_token'
  }

  const response = await authRest.postTokenRefreshRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/grant_type',
    expectedDetail: errorMessages.refreshToken.missingGrantType
  })
})

test('TC-REFRESH-008: grant_type incorrecto', async () => {
  const bodyRequest = {
    grant_type: AuthGrantType.Password,
    refresh_token: 'cualquier_token'
  }

  const response = await authRest.postTokenRefreshRaw(bodyRequest)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    pointer: '#/grant_type',
    expectedDetail: errorMessages.refreshToken.invalidGrantType
  })
})

test('TC-REFRESH-009: Body vacío', async () => {
  const response = await authRest.postTokenRefreshRaw({})
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    expectedDetail: errorMessages.refreshToken.invalidBody
  })
})

test('TC-REFRESH-010: Tipos de dato inválidos', async () => {
  const bodyRequest = {
    grant_type: 123,
    refresh_token: { token: 'xxx' }
  }

  const response = await authRest.postTokenRefreshRaw(bodyRequest as any)
  expect(response.status()).toBe(422)

  const body = await response.json()
  expectUnprocessableEntity(body, {
    expectedDetail: errorMessages.refreshToken.invalidBodyType
  })
})
