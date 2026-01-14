// tests/apis/Personas.spec.ts
import { expect, test } from '@playwright/test'
import { RegistroEnviosAuthRest } from '@/apiProviders/registroEnviosAuthRest'
import { RegistroEnviosPersonSedeRest } from '@/apiProviders/registroEnviosPersonSedeRest'
import {
  PersonByDniResponse,
  PersonByCeResponse,
  PersonByRucResponse,
  DniCase,
  CeCase,
  RucCase,
  ValidateSurnameCase,
  PersonByPassResponse,
  PassCase
} from '@/types/Interfaces'

// ===================
//   Test Data JSON
// ===================

import dniExistingJson from '@testData/personas/dniExisting.json'
import dniInvalidAlphaJson from '@testData/personas/dniInvalidAlpha.json'
import dniInvalidShortJson from '@testData/personas/dniInvalidShort.json'
import dniNonExistingJson from '@testData/personas/dniNonExisting.json'

import ceExistingJson from '@testData/personas/ceExisting.json'
import ceInvalidCharsJson from '@testData/personas/ceInvalidChars.json'
import ceInvalidShortJson from '@testData/personas/ceInvalidShort.json'
import ceNonExistingJson from '@testData/personas/ceNonExisting.json'

import rucExistingJson from '@testData/personas/rucExisting.json'
import rucInvalidCharsJson from '@testData/personas/rucInvalidChars.json'
import rucInvalidShortJson from '@testData/personas/rucInvalidShort.json'
import rucNonExistingJson from '@testData/personas/rucNonExisting.json'

import passExistingJson from '@testData/personas/passExisting.json'
import passInvalidCharsJson from '@testData/personas/passInvalidChars.json'
import passInvalidShortJson from '@testData/personas/passInvalidShort.json'
import passNonExistingJson from '@testData/personas/passNonExisting.json'

import validateSurnameValidJson from '@testData/personas/validateSurnameValid.json'
import validateSurnameInvalidJson from '@testData/personas/validateSurnameInvalid.json'

// Cast tipado de los JSON
const dniExisting = dniExistingJson as DniCase[]
const dniInvalidAlpha = dniInvalidAlphaJson as DniCase
const dniInvalidShort = dniInvalidShortJson as DniCase
const dniNonExisting = dniNonExistingJson as DniCase

const ceExisting = ceExistingJson as CeCase[]
const ceInvalidChars = ceInvalidCharsJson as CeCase
const ceInvalidShort = ceInvalidShortJson as CeCase
const ceNonExisting = ceNonExistingJson as CeCase

const rucExisting = rucExistingJson as RucCase[]
const rucInvalidChars = rucInvalidCharsJson as RucCase
const rucInvalidShort = rucInvalidShortJson as RucCase
const rucNonExisting = rucNonExistingJson as RucCase


const validateSurnameValid = validateSurnameValidJson as ValidateSurnameCase
const validateSurnameInvalid = validateSurnameInvalidJson as ValidateSurnameCase

const passExisting = passExistingJson as PassCase[]
const passInvalidChars = passInvalidCharsJson as PassCase
const passInvalidShort = passInvalidShortJson as PassCase
const passNonExisting = passNonExistingJson as PassCase

let personClient!: RegistroEnviosPersonSedeRest
let personClientNoAuth!: RegistroEnviosPersonSedeRest
let personClientInvalidToken!: RegistroEnviosPersonSedeRest

test.beforeAll(async () => {
  const authRest = await new RegistroEnviosAuthRest().init()
  const loginResponse = await authRest.loginWithClientCredentials()
  expect(loginResponse.status()).toBe(200)

  const loginBody = await loginResponse.json()
  const accessToken: string = loginBody.access_token
  expect(accessToken).toBeDefined()

  personClient = await new RegistroEnviosPersonSedeRest().init(accessToken)
  personClientNoAuth = await new RegistroEnviosPersonSedeRest().init()
  personClientInvalidToken = await new RegistroEnviosPersonSedeRest().init('token_invalido_xxx')
})

//
// Helper para validación de "true/false" de validar persona
//
function extractValidationFlag(body: any): boolean | undefined {
  if (typeof body === 'boolean') return body
  if (typeof body === 'string') {
    if (body.toLowerCase() === 'true') return true
    if (body.toLowerCase() === 'false') return false
  }
  if (body && typeof body === 'object') {
    if (typeof body.valid === 'boolean') return body.valid
    if (typeof body.isValid === 'boolean') return body.isValid
    if (typeof body.result === 'boolean') return body.result
  }
  return undefined
}

//
// =========================
//   1) PERSONAS POR DNI
// =========================
//

test('DNI-001: Búsqueda por varios DNI existentes y validación de last_name_paternal', async () => {
  for (const tc of dniExisting) {
    const response = await personClient.getPersonByDni(tc.dni)
    expect(response.status(), `Status para DNI ${tc.dni}`).toBe(200)

    const body = (await response.json()) as PersonByDniResponse
    expect(body.last_name_paternal).toBe(tc.last_name_paternal)

    console.log(
      `✅ DNI ${tc.dni} -> last_name_paternal: ${body.last_name_paternal} (esperado: ${tc.last_name_paternal})`
    )
  }
})

test('DNI-002: DNI inexistente devuelve 404', async () => {
  const response = await personClient.getPersonByDni(dniNonExisting.dni)
  expect(response.status()).toBe(404)
})

test('DNI-003: DNI con longitud inválida devuelve 422', async () => {
  const response = await personClient.getPersonByDni(dniInvalidShort.dni)
  expect([422]).toContain(response.status())
})

test('DNI-004: DNI con caracteres no numéricos devuelve 422', async () => {
  const response = await personClient.getPersonByDni(dniInvalidAlpha.dni)
  expect([422]).toContain(response.status())
})

test('DNI-005: Búsqueda de DNI sin token devuelve 401', async () => {
  const response = await personClientNoAuth.getPersonByDni(dniExisting[0].dni)
  expect(response.status()).toBe(401)
})

test('DNI-006: Búsqueda de DNI con token inválido devuelve 401', async () => {
  const response = await personClientInvalidToken.getPersonByDni(dniExisting[0].dni)
  expect(response.status()).toBe(419)
})

//
// ====================================
//   2) VALIDAR PERSONA (DNI + APELLIDO)
// ====================================
//

test('VAL-001: Validación correcta de apellido (true)', async () => {
  const { dni, surname } = validateSurnameValid

  const response = await personClient.validatePersonSurname(dni, surname)
  expect(response.status()).toBe(200)

  const body = await response.json()
  const flag = extractValidationFlag(body)

  expect(flag).toBe(true)
})

test('VAL-002: Apellido incorrecto (false)', async () => {
  const { dni, surname } = validateSurnameInvalid

  const response = await personClient.validatePersonSurname(dni, surname)
  expect(response.status()).toBe(200)

  const body = await response.json()
  const flag = extractValidationFlag(body)

  expect(flag).toBe(false)
})

test('VAL-003: Validación con DNI inexistente devuelve 404', async () => {
  const response = await personClient.validatePersonSurname(dniNonExisting.dni, validateSurnameValid.surname)
  expect(response.status()).toBe(404)
})

test('VAL-004: Falta surname en body devuelve 422', async () => {
  const response = await personClient.validatePersonSurnameRaw(validateSurnameValid.dni, {})
  expect([422]).toContain(response.status())
})

test('VAL-005: surname vacío devuelve 422', async () => {
  const response = await personClient.validatePersonSurname(validateSurnameValid.dni, '')
  expect([422]).toContain(response.status())
})

test('VAL-006: DNI con formato inválido devuelve 422', async () => {
  const response = await personClient.validatePersonSurname(dniInvalidAlpha.dni, validateSurnameValid.surname)
  expect([422]).toContain(response.status())
})

test('VAL-007: Validar persona sin token devuelve 401', async () => {
  const response = await personClientNoAuth.validatePersonSurname(
    validateSurnameValid.dni,
    validateSurnameValid.surname
  )
  expect(response.status()).toBe(401)
})

test('VAL-008: Validar persona con token inválido devuelve 419', async () => {
  const response = await personClientInvalidToken.validatePersonSurname(
    validateSurnameValid.dni,
    validateSurnameValid.surname
  )
  expect(response.status()).toBe(419)
})

//
// =========================
//   3) PERSONAS POR CE
// =========================
//

test('CE-001: CE existente y validación de last_name_paternal', async () => {
  const response = await personClient.getPersonByCe(ceExisting[0].ce)
  expect(response.status()).toBe(200)

  const body = (await response.json()) as PersonByCeResponse
  expect(String(body.last_name_paternal).toLowerCase()).toBe(
    String(ceExisting[0].last_name_paternal).toLowerCase()
  )
})

test('CE-002: CE inexistente devuelve 404', async () => {
  const response = await personClient.getPersonByCe(ceNonExisting.ce)
  expect(response.status()).toBe(404)
})

test('CE-003: CE con longitud inválida devuelve 422', async () => {
  const response = await personClient.getPersonByCe(ceInvalidShort.ce)
  expect([422]).toContain(response.status())
})

test('CE-004: CE con caracteres inválidos devuelve 422', async () => {
  const response = await personClient.getPersonByCe(ceInvalidChars.ce)
  expect([422]).toContain(response.status())
})

test('CE-005: Búsqueda de CE sin token devuelve 401', async () => {
  const response = await personClientNoAuth.getPersonByCe(ceExisting[0].ce)
  expect(response.status()).toBe(401)
})

test('CE-006: Búsqueda de CE con token inválido devuelve 419', async () => {
  const response = await personClientInvalidToken.getPersonByCe(ceExisting[0].ce)
  expect(response.status()).toBe(419)
})

//
// =========================
//   4) PERSONAS POR RUC
// =========================
//

test('RUC-001: RUC existentes y validación de contributor_status', async () => {
  for (const tc of rucExisting) {
    const response = await personClient.getPersonByRuc(tc.ruc)
    expect(response.status()).toBe(200)

    const body = (await response.json()) as PersonByRucResponse
    expect(String(body.contributor_status).toUpperCase()).toBe(
      String(tc.contributor_status).toUpperCase()
    )
  }
})

test('RUC-002: RUC inexistente devuelve 404', async () => {
  const response = await personClient.getPersonByRuc(rucNonExisting.ruc)
  expect(response.status()).toBe(404)
})

test('RUC-003: RUC con longitud inválida devuelve 422', async () => {
  const response = await personClient.getPersonByRuc(rucInvalidShort.ruc)
  expect([422]).toContain(response.status())
})

test('RUC-004: RUC con caracteres no numéricos devuelve 422', async () => {
  const response = await personClient.getPersonByRuc(rucInvalidChars.ruc)
  expect([422]).toContain(response.status())
})

test('RUC-005: Búsqueda de RUC sin token devuelve 401', async () => {
  const response = await personClientNoAuth.getPersonByRuc(rucExisting[0].ruc)
  expect(response.status()).toBe(401)
})

test('RUC-006: Búsqueda de RUC con token inválido devuelve 419', async () => {
  const response = await personClientInvalidToken.getPersonByRuc(rucExisting[0].ruc)
  expect(response.status()).toBe(419)
})

//
// =========================
//   3) Passaporte
// =========================
//

test('PASS-001: PASS existente y validación de last_name_paternal', async () => {
  const response = await personClient.getPersonByPass(passExisting[0].pass)
  expect(response.status()).toBe(200)

  const body = (await response.json()) as PersonByCeResponse
  expect(String(body.last_name_paternal).toLowerCase()).toBe(
    String(passExisting[0].last_name_paternal).toLowerCase()
  )
})

test('PASS-002: PASS inexistente devuelve 404', async () => {
  const response = await personClient.getPersonByPass(passNonExisting.pass)
  expect(response.status()).toBe(404)
})

test('PASS-003: PASS con longitud inválida devuelve 422', async () => {
  const response = await personClient.getPersonByPass(passInvalidShort.pass)
  expect([422]).toContain(response.status())
})

test('PASS-004: PASS con caracteres inválidos devuelve 422', async () => {
  const response = await personClient.getPersonByPass(passInvalidChars.pass)
  expect([422]).toContain(response.status())
})

test('PASS-005: Búsqueda de PASS sin token devuelve 401', async () => {
  const response = await personClientNoAuth.getPersonByPass(passExisting[0].pass)
  expect(response.status()).toBe(401)
})

test('PASS-006: Búsqueda de PASS con token inválido devuelve 419', async () => {
  const response = await personClientInvalidToken.getPersonByPass(passExisting[0].pass)
  expect(response.status()).toBe(419)
})