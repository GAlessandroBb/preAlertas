import { config } from 'dotenv'
import path from 'path'

// Load environment variables from .env file
config({ path: path.resolve(process.cwd(), '.env') })

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  // Node environment
  nodeEnv: string

  // Application URLs
  baseUrl: string
  olvaMiami: string

  // Test configuration
  test: {
    headless: boolean
    browser: string
    timeout: number
    retries: number
    workers: number
    username: string
    password: string
  }

  // Playwright configuration
  playwright: {
    storageStatePath: string
    startLocalServer: boolean
  }

  // Logging configuration
  logging: {
    level: string
    file: string
  }

  // Media configuration
  media: {
    screenshotMode: string
    videoMode: string
    traceMode: string
  }

  // Environment specific
  environment: string
  testSuite: string
}

/**
 * Environment configuration object
 */
export const environment: EnvironmentConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',

  baseUrl: process.env.BASE_URL_CLIENTE_OLVABOX || 'http://localhost:3000',
  olvaMiami: process.env.BASE_URL_OLVAMIAMI || 'http://localhost:3000',

  test: {
    headless: false,
    browser: process.env.BROWSER || 'chromium',
    timeout: parseNumber(process.env.TIMEOUT, 30000),
    retries: parseNumber(process.env.RETRIES, 2),
    workers: parseNumber(process.env.WORKERS, 4),
    username: process.env.TEST_USERNAME!,
    password: process.env.TEST_PASSWORD!
  },

  playwright: {
    storageStatePath: process.env.STORAGE_STATE_PATH || './auth-state.json',
    startLocalServer: parseBoolean(process.env.START_LOCAL_SERVER, false)
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/test.log'
  },

  media: {
    screenshotMode: process.env.SCREENSHOT_MODE || 'only-on-failure',
    videoMode: process.env.VIDEO_MODE || 'retain-on-failure',
    traceMode: process.env.TRACE_MODE || 'on-first-retry'
  },

  environment: process.env.ENVIRONMENT || 'development', // is obtained from the .env file
  testSuite: process.env.TEST_SUITE || 'smoke'
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  const parsed = Number(value)
  return isNaN(parsed) ? defaultValue : parsed
}

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  return value === 'true' || value === '1' || value === 'on' ? true : value === 'false' || value === '0' || value === 'off' ? false : defaultValue
}
