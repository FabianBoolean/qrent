import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createMemoryHistory, createRouter } from 'vue-router'
import { getNavigationItems } from './navigation.js'

function createNavigationRouter(development = false) {
  const component = {}
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      ...['dashboard', 'inventory', 'checkout', 'return', 'my-transactions',
        'tutorials', 'logs', ...(development ? ['development'] : [])]
        .map((name) => ({ path: `/${name}`, name, component })),
      { path: '/verleihungen', name: 'active-rentals', component, meta: { requiredRole: 'TEACHER' } },
      ...['equipment-management', 'template-management', 'role-management']
        .map((name) => ({
          path: `/${name}`, name, component,
          meta: { requiredRole: name === 'role-management' ? 'ADMIN' : 'TEACHER' },
        })),
    ],
  })
}

test('Navigation bietet Schülern alle allgemeinen und bisherigen Bereiche, keine Verwaltung', () => {
  const items = getNavigationItems(createNavigationRouter(), 'STUDENT')
  assert.deepEqual(items.filter((item) => item.group === 'primary').map((item) => item.name),
    ['dashboard', 'inventory', 'checkout', 'return', 'tutorials', 'logs'])
  assert.equal(items.some((item) => item.group === 'management'), false)
  assert.deepEqual(items.filter((item) => item.group === 'additional').map((item) => item.name),
    [])
})

test('Lehrkräfte erhalten zwei Verwaltungsziele, Admins zusätzlich Rollenverwaltung', () => {
  const router = createNavigationRouter()
  const management = (role) => getNavigationItems(router, role)
    .filter((item) => item.group === 'management').map((item) => item.name)
  assert.deepEqual(management('TEACHER'), ['equipment-management', 'template-management'])
  assert.deepEqual(management('ADMIN'), ['equipment-management', 'template-management', 'role-management'])
  assert.deepEqual(management('UNKNOWN'), [])
  for (const role of ['TEACHER', 'ADMIN']) {
    assert.equal(getNavigationItems(router, role).some((item) => item.name === 'active-rentals'), true)
  }
})

test('Navigation übernimmt geänderte Mindestrollen aus Router-Metadaten', () => {
  const router = createNavigationRouter()
  router.getRoutes().find((route) => route.name === 'equipment-management').meta.requiredRole = 'ADMIN'
  assert.equal(getNavigationItems(router, 'TEACHER').some((item) => item.name === 'equipment-management'), false)
})

test('Development-Link erscheint ausschließlich bei registrierter Route', () => {
  assert.equal(getNavigationItems(createNavigationRouter(), 'ADMIN')
    .some((item) => item.name === 'development'), false)
  assert.equal(getNavigationItems(createNavigationRouter(true), 'STUDENT')
    .some((item) => item.name === 'development'), true)
})
