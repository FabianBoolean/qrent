import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryHistory, createRouter } from 'vue-router'
import { createAuthGuard, getLoginDestination } from './guards.js'
import { hasRole } from '../utils/permissions.js'

function setup(authenticated = false, role = null) {
  const component = {}
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/login', name: 'login', component },
      { path: '/dashboard', name: 'dashboard', component, meta: { requiresAuth: true } },
      { path: '/equipment/:id', name: 'equipment-detail', component, meta: { requiresAuth: true } },
      { path: '/management', component, meta: { requiresAuth: true }, children: [
        { path: 'roles', name: 'roles', component, meta: { requiredRole: 'ADMIN' } },
        { path: 'equipment', name: 'equipment-management', component, meta: { requiredRole: 'TEACHER' } },
      ] },
      { path: '/forbidden', name: 'forbidden', component, meta: { requiresAuth: true } },
      { path: '/inventar', redirect: '/dashboard' },
      { path: '/:pathMatch(.*)*', name: 'not-found', component },
    ],
  })
  const auth = {
    isAuthenticated: authenticated, role,
    async initializeSession() {},
  }
  router.beforeEach(createAuthGuard(auth, router))
  return { router, auth }
}

test('Anonyme Navigation bewahrt Ziel samt Query und Hash für den Login', async () => {
  const { router } = setup()
  await router.push('/equipment/42?view=items#inventory')
  assert.equal(router.currentRoute.value.name, 'login')
  assert.equal(router.currentRoute.value.query.redirect, '/equipment/42?view=items#inventory')
})

test('Guard wartet auf Session-Prüfung und leitet angemeldete Nutzer vom Login zurück', async () => {
  const { router, auth } = setup()
  auth.initializeSession = async () => {
    await Promise.resolve()
    auth.isAuthenticated = true
    auth.role = 'STUDENT'
  }
  await router.push('/login?redirect=/equipment/42')
  assert.equal(router.currentRoute.value.fullPath, '/equipment/42')
})

test('Lehrer erreichen Verwaltung, aber keine Rollenverwaltung; Admins erreichen beides', async () => {
  const { router, auth } = setup(true, 'TEACHER')
  await router.push('/management/equipment')
  assert.equal(router.currentRoute.value.name, 'equipment-management')
  await router.push('/management/roles')
  assert.equal(router.currentRoute.value.name, 'forbidden')
  auth.role = 'ADMIN'
  await router.push('/management/roles')
  assert.equal(router.currentRoute.value.name, 'roles')
})

test('Session-Ausfall gibt keine geschützte Seite frei; unbekannte Seiten bleiben öffentlich', async () => {
  const { router, auth } = setup()
  auth.initializeSession = async () => { throw new Error('Netzwerkfehler') }
  await router.push('/dashboard')
  assert.equal(router.currentRoute.value.name, 'login')
  await router.push('/unbekannt')
  assert.equal(router.currentRoute.value.name, 'not-found')
})

test('Externe, öffentliche, unbekannte und mehrdeutige Rückkehrziele werden verworfen', () => {
  const { router } = setup()
  for (const target of [undefined, ['//example.invalid'], 'https://example.invalid',
    '//example.invalid', '/\\example.invalid', '/login', '/unbekannt', '/inventar']) {
    assert.equal(getLoginDestination(router, target), '/dashboard')
  }
  assert.equal(getLoginDestination(router, '/equipment/42?x=1#items'), '/equipment/42?x=1#items')
})

test('Rollenhierarchie verweigert unbekannte Rollen und fehlende Mindestrollen', () => {
  assert.equal(hasRole('STUDENT', 'TEACHER'), false)
  assert.equal(hasRole('TEACHER', 'STUDENT'), true)
  assert.equal(hasRole('ADMIN', 'TEACHER'), true)
  assert.equal(hasRole(null, 'STUDENT'), false)
  assert.equal(hasRole('UNKNOWN', 'STUDENT'), false)
  assert.equal(hasRole('ADMIN', 'UNKNOWN'), false)
})
