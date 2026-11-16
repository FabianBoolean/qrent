import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createPinia, setActivePinia } from 'pinia'
import { useNotificationStore } from './notificationStore.js'
import { ApiError } from '../services/apiErrors.js'

function setup() {
  setActivePinia(createPinia())
  return useNotificationStore()
}

test('Meldungen laufen FIFO nach der Schließanimation; veraltete Events bleiben wirkungslos', () => {
  const store = setup()
  const first = store.success('Gespeichert')
  const second = store.info('Aktualisiert')
  store.warning('Prüfen')
  assert.equal(store.current.id, first)
  assert.equal(store.current.timeout, 4000)
  store.dismiss(first)
  assert.equal(store.isOpen, false)
  assert.equal(store.current.id, first)
  store.finishDismiss(first)
  assert.equal(store.current.id, second)
  assert.equal(store.current.timeout, 5000)
  store.dismiss(first)
  store.finishDismiss(first)
  assert.equal(store.isOpen, true)
  store.dismiss(second)
  store.finishDismiss(second)
  assert.equal(store.current.timeout, 7000)
})

test('Nur unmittelbar aufeinanderfolgende gleiche Meldungen werden unterdrückt', () => {
  const store = setup()
  store.error('Fehler')
  assert.equal(store.error('Fehler'), null)
  assert.equal(store.current.timeout, -1)
  store.info('Info')
  assert.equal(store.info(' Info '), null)
  assert.ok(store.error('Fehler'))
  assert.equal(store.queue.length, 2)
  assert.equal(store.success('   '), null)
})

test('Leere Warteschlange entfernt die aktive Meldung vollständig', () => {
  const store = setup()
  const id = store.info('Fertig')
  store.dismiss(id)
  store.finishDismiss(id)
  assert.equal(store.current, null)
  assert.equal(store.isOpen, false)
})

test('Asynchrone Aktionen starten nur einmal; Fehlversuch wird neu angezeigt', async () => {
  const store = setup()
  let rejectAction
  let calls = 0
  store.error('Serverfehler', { action: { label: 'Erneut versuchen', handler: () => {
    calls += 1
    return new Promise((resolve, reject) => { rejectAction = reject })
  } } })
  const id = store.current.id
  const first = store.runAction()
  await store.runAction()
  assert.equal(calls, 1)
  assert.equal(store.actionPending, true)
  rejectAction(new ApiError('Serverfehler', 500, 'http'))
  await first
  assert.equal(store.isOpen, false)
  store.finishDismiss(id)
  assert.equal(store.current.text, 'Serverfehler')
  assert.equal(store.current.timeout, -1)
})

test('Leeren während einer laufenden Aktion schützt neuere Meldungen', async () => {
  const store = setup()
  let finish
  store.info('Aktion', { action: { label: 'Start', handler: () => new Promise((resolve) => { finish = resolve }) } })
  const running = store.runAction()
  store.clear()
  store.success('Abgemeldet')
  finish()
  await running
  assert.equal(store.current.text, 'Abgemeldet')
  assert.equal(store.isOpen, true)
  assert.equal(store.queue.length, 0)
})

test('Nach dem Leeren werden verspätete Aktionsfehler nicht erneut angezeigt', async () => {
  const store = setup()
  let rejectAction
  store.error('Aktion', { action: { label: 'Start', handler: () => new Promise((resolve, reject) => {
    rejectAction = reject
  }) } })
  const running = store.runAction()
  store.clear()
  rejectAction(new ApiError('Veralteter Fehler', 500, 'http'))
  await running
  assert.equal(store.current, null)
  assert.equal(store.queue.length, 0)
})
