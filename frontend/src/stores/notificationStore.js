import { ref } from 'vue'
import { defineStore } from 'pinia'
import { normalizeApiError } from '../services/apiErrors.js'

const types = {
  success: { color: 'success', icon: 'mdi-check-circle-outline', timeout: 4000 },
  info: { color: 'info', icon: 'mdi-information-outline', timeout: 5000 },
  warning: { color: 'warning', icon: 'mdi-alert-outline', timeout: 7000 },
  error: { color: 'error', icon: 'mdi-alert-circle-outline', timeout: -1 },
}

/** Globale Meldungswarteschlange; enthält ausschließlich kurzlebigen UI-Zustand. */
export const useNotificationStore = defineStore('notifications', () => {
  const current = ref(null)
  const queue = ref([])
  const isOpen = ref(false)
  const actionPending = ref(false)
  let nextId = 0
  let revision = 0

  /**
   * Stellt eine Meldung an; unmittelbar folgende Duplikate werden unterdrückt.
   * @param {'success'|'info'|'warning'|'error'} type Meldungstyp.
   * @param {string} text Klartext, kein HTML.
   * @param {{action?: {label: string, handler: Function}}} [options] Optionale Aktion.
   * @returns {number|null} Kennung oder null bei leerem Text/Duplikat.
   */
  function enqueue(type, text, options = {}) {
    if (typeof text !== 'string' || !text.trim()) return null
    const normalizedText = text.trim()
    const action = options.action ?? null
    const last = queue.value.at(-1) ?? current.value
    if ((queue.value.length || isOpen.value) && last?.type === type && last.text === normalizedText
      && last.action?.label === action?.label) return null
    const message = { id: ++nextId, type, text: normalizedText, action, ...types[type] }
    if (current.value) queue.value.push(message)
    else {
      current.value = message
      isOpen.value = true
    }
    return message.id
  }

  /**
   * Startet das Schließen; die nächste Meldung wartet auf das Animationsende.
   * @param {number} [id] Erwartete Kennung zum Schutz vor verspäteten Events.
   * @returns {void}
   */
  function dismiss(id = current.value?.id) {
    if (current.value?.id === id) isOpen.value = false
  }

  /**
   * Übernimmt nach der Schließanimation die nächste wartende Meldung.
   * @param {number} id Kennung der geschlossenen Meldung.
   * @returns {void}
   */
  function finishDismiss(id) {
    if (current.value?.id !== id || isOpen.value) return
    current.value = queue.value.shift() ?? null
    actionPending.value = false
    isOpen.value = current.value !== null
  }

  /** Führt eine optionale Aktion einmal aus; Fehler werden zentral angestellt. @returns {Promise<void>} */
  async function runAction() {
    const message = current.value
    if (!message?.action || actionPending.value || !isOpen.value) return
    const currentRevision = revision
    actionPending.value = true
    try {
      await message.action.handler()
    } catch (error) {
      if (currentRevision === revision) {
        dismiss(message.id)
        enqueue('error', normalizeApiError(error).message, { action: message.action })
      }
    } finally {
      if (current.value?.id === message.id) {
        actionPending.value = false
        dismiss(message.id)
      }
    }
  }

  /** Entfernt aktive und wartende Meldungen, beispielsweise beim Logout. @returns {void} */
  function clear() {
    revision += 1
    current.value = null
    queue.value = []
    isOpen.value = false
    actionPending.value = false
  }

  /** Erfolg für vier Sekunden. @param {string} text Meldung. @param {Object} [options] Aktion. @returns {number|null} Kennung. */
  function success(text, options) { return enqueue('success', text, options) }
  /** Information für fünf Sekunden. @param {string} text Meldung. @param {Object} [options] Aktion. @returns {number|null} Kennung. */
  function info(text, options) { return enqueue('info', text, options) }
  /** Warnung für sieben Sekunden. @param {string} text Meldung. @param {Object} [options] Aktion. @returns {number|null} Kennung. */
  function warning(text, options) { return enqueue('warning', text, options) }
  /** Fehler bis zum Schließen. @param {string} text Meldung. @param {Object} [options] Aktion. @returns {number|null} Kennung. */
  function error(text, options) { return enqueue('error', text, options) }

  return { current, queue, isOpen, actionPending, success, info, warning, error,
    dismiss, finishDismiss, runAction, clear }
})
