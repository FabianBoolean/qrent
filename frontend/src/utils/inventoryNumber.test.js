import { test } from 'node:test'
import assert from 'node:assert/strict'
import { formatInventoryNumber, normalizeInventoryNumber } from './inventoryNumber.js'

test('normalizeInventoryNumber akzeptiert 8 Ziffern mit und ohne Leerzeichen', () => {
  assert.equal(normalizeInventoryNumber('01010002'), '01010002')
  assert.equal(normalizeInventoryNumber('0101 0002'), '01010002')
  assert.equal(normalizeInventoryNumber('  01010002 '), '01010002')
})

test('normalizeInventoryNumber lehnt ungültige Eingaben ab', () => {
  assert.equal(normalizeInventoryNumber('0101000'), null)
  assert.equal(normalizeInventoryNumber('010100023'), null)
  assert.equal(normalizeInventoryNumber('0101A002'), null)
  assert.equal(normalizeInventoryNumber(''), null)
  assert.equal(normalizeInventoryNumber(null), null)
})

test('formatInventoryNumber teilt in zwei Vierergruppen', () => {
  assert.equal(formatInventoryNumber('01010002'), '0101 0002')
  assert.throws(() => formatInventoryNumber('123'))
})
