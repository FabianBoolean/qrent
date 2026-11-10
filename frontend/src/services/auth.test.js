import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { AxiosError } from 'axios'
import apiClient, { setSessionExpiredHandler } from './apiClient.js'
import { authService } from './authService.js'
import { normalizeApiError } from './apiErrors.js'
import { useAuthStore } from '../stores/authStore.js'

const originalAdapter = apiClient.defaults.adapter
const user = { email: 'test@example.invalid', firstName: 'Test', lastName: 'User', schoolClass: null, role: 'TEACHER' }

function response(config, data, status = 200) {
  return { config, data, status, statusText: '', headers: {} }
}

function fail(config, status) {
  throw new AxiosError('Backend-Fehler', 'ERR_BAD_RESPONSE', config, {}, response(config, null, status))
}

afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
  setSessionExpiredHandler(() => {})
})

test('Session-Prüfung bündelt parallele Aufrufe und speichert nur Backend-Daten', async () => {
  setActivePinia(createPinia())
  let calls = 0
  apiClient.defaults.adapter = async (config) => {
    calls += 1
    assert.equal(config.baseURL, '/api')
    assert.equal(config.withCredentials, true)
    assert.equal(config.url, '/auth/me')
    return response(config, user)
  }
  const store = useAuthStore()
  await Promise.all([store.initializeSession(), store.initializeSession()])
  await store.initializeSession()
  assert.equal(calls, 1)
  assert.equal(store.role, 'TEACHER')
  assert.equal(store.isAuthenticated, true)
  assert.equal(store.isLoading, false)
})

test('Initiale 401 ist regulär; spätere 401 invalidiert die Session', async () => {
  setActivePinia(createPinia())
  const store = useAuthStore()
  let expired = 0
  setSessionExpiredHandler(() => { expired += 1; store.invalidateSession() })
  apiClient.defaults.adapter = async (config) => fail(config, 401)
  await store.initializeSession()
  assert.equal(store.initialized, true)
  assert.equal(store.initializationError, null)
  assert.equal(expired, 0)
  await assert.rejects(apiClient.get('/products'), { status: 401 })
  assert.equal(expired, 1)
  await assert.rejects(authService.login({ email: 'test', password: 'test' }), {
    message: 'Ungültige Zugangsdaten.', status: 401,
  })
  assert.equal(expired, 1)
})

test('Technischer Initialisierungsfehler bleibt wiederholbar und enthält keine Request-Daten', async () => {
  setActivePinia(createPinia())
  const store = useAuthStore()
  apiClient.defaults.adapter = async (config) => fail(config, 500)
  await assert.rejects(store.initializeSession(), { status: 500 })
  assert.equal(store.initialized, false)
  assert.equal(store.isLoading, false)
  assert.equal(store.initializationError.config, undefined)
  apiClient.defaults.adapter = async (config) => response(config, user)
  await store.initializeSession()
  assert.equal(store.initializationError, null)
  assert.equal(store.isAuthenticated, true)
})

test('Login verwendet Vertrag; fehlgeschlagener Logout erhält Benutzer, bestätigter entfernt ihn', async () => {
  setActivePinia(createPinia())
  const store = useAuthStore()
  apiClient.defaults.adapter = async (config) => {
    assert.equal(config.url, '/auth/login')
    assert.deepEqual(JSON.parse(config.data), { email: 'test', password: 'secret' })
    return response(config, user)
  }
  await store.login({ email: 'test', password: 'secret' })
  assert.equal(JSON.stringify(store.$state).includes('secret'), false)
  apiClient.defaults.adapter = async (config) => fail(config, 500)
  await assert.rejects(store.logout(), { status: 500 })
  assert.equal(store.isAuthenticated, true)
  apiClient.defaults.adapter = async (config) => {
    assert.equal(config.url, '/auth/logout')
    return response(config, null, 204)
  }
  await store.logout()
  assert.equal(store.isAuthenticated, false)
  assert.equal(store.role, null)
})

test('Verspätete Session-Prüfung überschreibt keinen neu angemeldeten Benutzer', async () => {
  setActivePinia(createPinia())
  const store = useAuthStore()
  let finishCheck
  apiClient.defaults.adapter = (config) => config.url === '/auth/me'
    ? new Promise((resolve) => { finishCheck = () => resolve(response(config, null)) })
    : Promise.resolve(response(config, user))
  const checking = store.initializeSession()
  await store.login({ email: 'test', password: 'secret' })
  finishCheck()
  await checking
  assert.equal(store.role, 'TEACHER')
})

test('HTTP-, Netzwerk- und Timeoutfehler erhalten verständliche Kategorien', () => {
  for (const status of [400, 401, 403, 404, 500]) {
    const error = normalizeApiError({ response: { status } })
    assert.equal(error.status, status)
    assert.equal(error.code, 'http')
    assert.ok(error.message.length > 10)
  }
  assert.equal(normalizeApiError({ code: 'ERR_NETWORK' }).code, 'network')
  assert.equal(normalizeApiError({ code: 'ECONNABORTED' }).code, 'timeout')
})
