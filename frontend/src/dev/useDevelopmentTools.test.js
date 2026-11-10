import { afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { effectScope } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { createMemoryHistory, createRouter } from 'vue-router'
import { AxiosError } from 'axios'
import apiClient from '../services/apiClient.js'
import { useAuthStore } from '../stores/authStore.js'
import { createAuthGuard } from '../router/guards.js'
import { useDevelopmentTools } from './useDevelopmentTools.js'

const originalAdapter = apiClient.defaults.adapter
const scopes = []
afterEach(() => {
  apiClient.defaults.adapter = originalAdapter
  scopes.splice(0).forEach((scope) => scope.stop())
})

function setup() {
  setActivePinia(createPinia())
  const auth = useAuthStore()
  auth.user = { email: 'test@example.invalid', firstName: 'Test', lastName: 'User', schoolClass: '5CHIT', role: 'STUDENT' }
  auth.initialized = true
  const component = {}
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/dashboard', name: 'dashboard', component, meta: { requiresAuth: true } },
      { path: '/roles', name: 'role-management', component, meta: { requiresAuth: true, requiredRole: 'ADMIN' } },
      { path: '/forbidden', name: 'forbidden', component, meta: { requiresAuth: true } },
    ],
  })
  router.beforeEach(createAuthGuard(auth, router))
  const scope = effectScope()
  scopes.push(scope)
  return { auth, router, scope, tools: scope.run(() => useDevelopmentTools(router, auth)) }
}

test('ADMIN-Vorschau verändert weder echte Rolle noch Route Guards oder Backend-Aufrufe', async () => {
  const { auth, router, tools } = setup()
  const before = JSON.stringify(auth.$state)
  let calls = 0
  apiClient.defaults.adapter = async () => { calls += 1; throw new Error('Unerwarteter API-Aufruf') }
  tools.simulatedRole.value = 'ADMIN'
  assert.equal(tools.previewRole.value, 'ADMIN')
  assert.equal(tools.showSchoolOverview.value, true)
  assert.equal(tools.previewItems.value.some((item) => item.name === 'role-management'), true)
  assert.equal(auth.role, 'STUDENT')
  await router.push('/roles')
  assert.equal(router.currentRoute.value.name, 'forbidden')
  assert.equal(JSON.stringify(auth.$state), before)
  assert.equal(calls, 0)
  tools.simulatedRole.value = null
  assert.equal(tools.previewRole.value, 'STUDENT')
  assert.equal(tools.showSchoolOverview.value, false)
})

test('Session-Test nutzt nur echte Cookies und übernimmt die API-Antwort nicht in den Store', async () => {
  const { auth, tools } = setup()
  tools.simulatedRole.value = 'ADMIN'
  const before = JSON.stringify(auth.$state)
  const serverUser = { ...auth.user, firstName: 'Backend' }
  apiClient.defaults.adapter = async (config) => {
    assert.equal(config.url, '/auth/me')
    assert.equal(config.method, 'get')
    assert.equal(config.withCredentials, true)
    assert.equal(config.params, undefined)
    assert.equal(config.data, undefined)
    return { data: serverUser, status: 200, config, headers: {} }
  }
  assert.equal(tools.apiResult.value, null)
  await tools.runSessionTest()
  assert.equal(tools.apiResult.value.status, 200)
  assert.equal(tools.apiResult.value.data.firstName, 'Backend')
  assert.equal(JSON.stringify(auth.$state), before)
})

test('401 erscheint lokal als Diagnose, technische Fehler bleiben separat wiederholbar', async () => {
  const { auth, tools } = setup()
  apiClient.defaults.adapter = async (config) => {
    throw new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, {}, { status: 401, config })
  }
  await tools.runSessionTest()
  assert.deepEqual(tools.apiResult.value, { status: 401, data: null })
  assert.equal(auth.isAuthenticated, true)
  apiClient.defaults.adapter = async (config) => { throw new AxiosError('Network', 'ERR_NETWORK', config, {}) }
  await tools.runSessionTest()
  assert.equal(tools.apiResult.value, null)
  assert.equal(tools.apiError.value.code, 'network')
  assert.equal(tools.apiLoading.value, false)
})

test('Parallele Testklicks starten nur einen Request; verlassene Ansicht erhält keine Antwort', async () => {
  const { scope, tools } = setup()
  let calls = 0
  let finish
  apiClient.defaults.adapter = (config) => {
    calls += 1
    return new Promise((resolve) => { finish = () => resolve({ data: {}, status: 200, headers: {}, config }) })
  }
  const running = tools.runSessionTest()
  await tools.runSessionTest()
  assert.equal(calls, 1)
  scope.stop()
  finish()
  await running
  assert.equal(tools.apiResult.value, null)
})
