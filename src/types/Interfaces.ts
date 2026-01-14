// ====== AUTH / LOGIN – REGISTRO DE ENVIOS ======

export enum AuthGrantType {
  Password = 'password',
  ClientCredentials = 'client_credentials',
  RefreshToken = 'refresh_token'
}

export interface LoginPasswordRequest {
  grant_type: AuthGrantType.Password
  username: string
  password: string
}

export interface LoginClientCredentialsRequest {
  grant_type: AuthGrantType.ClientCredentials
  client_id: string
  client_secret: string
}

export interface RefreshTokenRequest {
  grant_type: AuthGrantType.RefreshToken
  refresh_token: string
}

/**
 * Respuesta estándar de login / refresh.
 * Ajusta los campos si el backend devuelve más/menos,
 * pero esto te cubre lo típico de OAuth2-like.
 */
export interface AuthTokenResponse {
  access_token: string
  refresh_token: string
  token_type?: string
  expires_in?: number            // ~900s (15 min) para el access token
  refresh_expires_in?: number    // ~43200s (12 horas) si lo exponen
  scope?: string
  [key: string]: any             // para no romper si agregan campos nuevos
}

/**
 * Unión de todos los posibles bodies para /token y /token-refresh,
 * por si en algún punto quieres tipar algo genérico.
 */
export type AuthRequestBody =
  | LoginPasswordRequest
  | LoginClientCredentialsRequest
  | RefreshTokenRequest

 // ==========================
//   Personas (Búsqueda)
// ==========================

export interface PersonByDniResponse {
  document_number?: string
  last_name_paternal?: string
  last_name_maternal?: string
  names?: string
  [key: string]: unknown
}

export interface PersonByCeResponse {
  document_number?: string
  last_name_paternal?: string
  last_name_maternal?: string
  names?: string
  [key: string]: unknown
}

export interface PersonByRucResponse {
  ruc?: string
  business_name?: string
  contributor_status?: string
  [key: string]: unknown
}

export interface PersonByPassResponse {
  document_number?: string
  last_name_paternal?: string
  last_name_maternal?: string
  names?: string
  [key: string]: unknown
}

// ==========================
//   Personas – TestData
// ==========================

export interface DniCase {
  dni: string
  last_name_paternal?: string
}

export interface CeCase {
  ce: string
  last_name_paternal?: string
}

export interface RucCase {
  ruc: string
  contributor_status?: string
}

export interface PassCase {
  pass: string
  last_name_paternal?: string
}

export interface ValidateSurnameCase {
  dni: string
  surname: string
}
// ==========================
//          Sedes
// ==========================

export interface SedeResponse {
  id?: number | string
  code?: string
  name?: string
  status?: string
  [key: string]: unknown
}
// ==========================
//          Carrito
// ==========================

export interface CartPerson {
  document_number: string
  document_type: 'dni' | 'ce' | 'ruc' | string
  first_names: string
  last_name_paternal: string
  last_name_maternal: string
  full_name: string
  [key: string]: unknown
}

export interface CartOrigin {
  address: string
  ubigeo: string
  office_code: string
  [key: string]: unknown
}

export interface CartItem {
  sku: string
  qty: number
  [key: string]: unknown
}

export interface CartPatchRequest {
  person: CartPerson
  origin: CartOrigin
  items: CartItem[]
  [key: string]: unknown
}

/** POST /cart (según doc: “solo se obtiene el cart id”) */
export interface CartCreateResponse {
  cart_id: string
  [key: string]: unknown
}

/** GET /cart/{id} (no está fijo, lo dejamos flexible) */
export interface CartGetResponse {
  cart_id?: string
  person?: Partial<CartPerson>
  origin?: Partial<CartOrigin>
  items?: CartItem[]
  [key: string]: unknown
}
