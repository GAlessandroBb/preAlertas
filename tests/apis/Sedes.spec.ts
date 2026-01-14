// tests/apis/Sedes.spec.ts
import { expect, test } from '@playwright/test'
import { RegistroEnviosAuthRest } from '@/apiProviders/registroEnviosAuthRest'
import { RegistroEnviosPersonSedeRest } from '@/apiProviders/registroEnviosPersonSedeRest'
import { SedeResponse } from '@/types/Interfaces'

let sedeClient!: RegistroEnviosPersonSedeRest
let sedeClientNoAuth!: RegistroEnviosPersonSedeRest

test.beforeAll(async () => {
  const authRest = await new RegistroEnviosAuthRest().init()
  const loginResponse = await authRest.loginWithClientCredentials()
  expect(loginResponse.status()).toBe(200)

  const loginBody = await loginResponse.json()
  const accessToken: string = loginBody.access_token
  expect(accessToken).toBeDefined()

  sedeClient = await new RegistroEnviosPersonSedeRest().init(accessToken)
  sedeClientNoAuth = await new RegistroEnviosPersonSedeRest().init()
})

test('SED-001: Listado de sedes con token válido', async () => {
  const response = await sedeClient.getSedes()
  expect(response.status()).toBe(200)

  const body = (await response.json()) as SedeResponse[]

  //expect(Array.isArray(body)).toBe(true)

  console.log(`🔎 Total sedes: ${body.length}`)

  if (body.length > 0) {
    const sede = body[0]
    // Ajusta estos campos según la respuesta real de tu API
    expect(sede).toHaveProperty('id')
    expect(sede).toHaveProperty('code')
    expect(sede).toHaveProperty('name')
  }
})

test('SED-003: Listado de sedes sin token devuelve 401', async () => {
  const response = await sedeClientNoAuth.getSedes()
  expect(response.status()).toBe(401)
})
