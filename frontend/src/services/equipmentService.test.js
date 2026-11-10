import { afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { AxiosError } from 'axios'
import apiClient from './apiClient.js'
import { equipmentService } from './equipmentService.js'
import { filterProducts, getSubcategories } from '../utils/equipmentFilters.js'

const originalAdapter = apiClient.defaults.adapter
afterEach(() => { apiClient.defaults.adapter = originalAdapter })

const categories = [
  { id: 1, name: 'Licht', subcategories: [{ id: 10, name: 'Dauerlicht' }] },
  { id: 2, name: 'Audio', subcategories: [{ id: 20, name: 'Mikrofone' }] },
]
const products = [
  { id: 1, code: '0001', name: 'LED Leuchte', category: { id: 1 }, subcategory: { id: 10 }, itemCount: 0 },
  { id: 2, code: '0002', name: 'Mikrofon', category: { id: 2 }, subcategory: { id: 20 }, itemCount: 3 },
  { id: 3, code: '0012', name: 'LED Panel', category: { id: 1 }, subcategory: { id: 11 }, itemCount: 1 },
]

test('Service verwendet bestehende Endpunkte, Session-Client und unveränderte DTOs', async () => {
  const controller = new AbortController()
  const detail = { id: 1, description: null, items: [{ id: 7, inventoryNumber: '01010001', notes: null }] }
  const responses = new Map([['/categories', categories], ['/products', products], ['/products/1', detail]])
  const calls = []
  apiClient.defaults.adapter = async (config) => {
    calls.push(config.url)
    assert.equal(config.baseURL, '/api')
    assert.equal(config.withCredentials, true)
    assert.equal(config.signal, controller.signal)
    return { data: responses.get(config.url), status: 200, headers: {}, config }
  }
  assert.deepEqual(await equipmentService.getCategories({ signal: controller.signal }), categories)
  assert.deepEqual(await equipmentService.getProducts({ signal: controller.signal }), products)
  assert.deepEqual(await equipmentService.getProduct(1, { signal: controller.signal }), detail)
  assert.deepEqual(calls, ['/categories', '/products', '/products/1'])
})

test('Ungültige Produktkennungen lösen keine Anfrage aus', async () => {
  let calls = 0
  apiClient.defaults.adapter = async () => { calls += 1 }
  for (const id of ['abc', '../auth/me', '1/2', '0', '-1', undefined]) {
    await assert.rejects(equipmentService.getProduct(id), { status: 400 })
  }
  assert.equal(calls, 0)
})

test('404 und abgebrochene Requests werden als zentrale API-Fehler weitergereicht', async () => {
  apiClient.defaults.adapter = async (config) => {
    throw new AxiosError('Not found', 'ERR_BAD_REQUEST', config, {}, { status: 404, data: null, config })
  }
  await assert.rejects(equipmentService.getProduct('999'), { status: 404, code: 'http' })
  const controller = new AbortController()
  controller.abort()
  await assert.rejects(equipmentService.getProducts({ signal: controller.signal }), { code: 'canceled' })
})

test('Suche kombiniert Name/Produktcode, Kategorie und Unterkategorie ohne Datenänderung', () => {
  const snapshot = JSON.stringify(products)
  assert.deepEqual(filterProducts(products, { search: '  led  ' }).map((item) => item.id), [1, 3])
  assert.deepEqual(filterProducts(products, { search: '0012' }).map((item) => item.id), [3])
  assert.deepEqual(filterProducts(products, { search: 'LED', categoryId: 1, subcategoryId: 10 }).map((item) => item.id), [1])
  assert.deepEqual(filterProducts(products, { categoryId: 2, subcategoryId: 10 }), [])
  assert.equal(filterProducts(products, {}).length, 3)
  assert.equal(filterProducts(products, { search: 'unbekannt' }).length, 0)
  assert.equal(JSON.stringify(products), snapshot)
})

test('Unterkategorie-Auswahl bleibt auf die ausgewählte Kategorie begrenzt', () => {
  assert.deepEqual(getSubcategories(categories, 1).map((item) => item.id), [10])
  assert.deepEqual(getSubcategories(categories, 2).map((item) => item.id), [20])
  assert.deepEqual(getSubcategories(categories, null), [])
  assert.deepEqual(getSubcategories(categories, 999), [])
})
