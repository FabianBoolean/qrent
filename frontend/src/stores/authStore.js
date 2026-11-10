import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '../services/authService.js'

/** Session-Zustand im Arbeitsspeicher; keine Speicherung in Local Storage. */
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const initialized = ref(false)
  const initializationError = ref(null)
  const pendingRequests = ref(0)
  const isLoading = computed(() => pendingRequests.value > 0)
  const isAuthenticated = computed(() => user.value !== null)
  const role = computed(() => user.value?.role ?? null)
  let initializationPromise = null
  let revision = 0
  let mutationPromise = Promise.resolve()

  /**
   * Entfernt eine abgelaufene Session und verwirft noch laufende Session-Antworten.
   * @returns {void}
   */
  function invalidateSession() {
    revision += 1
    user.value = null
    initialized.value = true
    initializationError.value = null
  }

  /**
   * Initialisiert einmalig, bündelt parallele Aufrufe und erlaubt technische Fehler erneut zu prüfen.
   * @returns {Promise<import('../services/authService.js').AuthenticatedUser|null>}
   * @throws {import('../services/apiErrors.js').ApiError} Bei technischen Fehlern.
   */
  function initializeSession() {
    if (initializationPromise) return initializationPromise
    if (initialized.value) return Promise.resolve(user.value)
    const currentRevision = revision
    pendingRequests.value += 1
    initializationError.value = null
    initializationPromise = authService.getCurrentUser()
      .then((currentUser) => {
        if (revision === currentRevision) {
          user.value = currentUser
          initialized.value = true
        }
        return user.value
      })
      .catch((error) => {
        if (revision === currentRevision) initializationError.value = error
        throw error
      })
      .finally(() => {
        pendingRequests.value -= 1
        initializationPromise = null
      })
    return initializationPromise
  }

  /**
   * Führt Session-Änderungen nacheinander aus, damit Login/Logout sich nicht überholen.
   * @param {Function} operation Auszuführende Backend-Aktion.
   * @returns {Promise<unknown>} Ergebnis; Fehler werden unverändert weitergereicht.
   */
  function mutateSession(operation) {
    revision += 1
    pendingRequests.value += 1
    const result = mutationPromise.then(operation).finally(() => {
      pendingRequests.value -= 1
    })
    mutationPromise = result.catch(() => {})
    return result
  }

  /**
   * Meldet an und übernimmt ausschließlich die Backend-Benutzerdaten.
   * @param {{email: string, password: string}} credentials Zugangsdaten; werden nicht persistiert.
   * @returns {Promise<import('../services/authService.js').AuthenticatedUser>}
   * @throws {import('../services/apiErrors.js').ApiError} Zur lokalen Anzeige im Login-Formular.
   */
  function login(credentials) {
    return mutateSession(async () => {
      const currentUser = await authService.login(credentials)
      revision += 1
      user.value = currentUser
      initialized.value = true
      initializationError.value = null
      return user.value
    })
  }

  /**
   * Löscht den lokalen Benutzer erst nach bestätigter serverseitiger Abmeldung.
   * @returns {Promise<void>}
   * @throws {import('../services/apiErrors.js').ApiError} Bei fehlgeschlagener Abmeldung.
   */
  function logout() {
    return mutateSession(async () => {
      await authService.logout()
      invalidateSession()
    })
  }

  return {
    user, role, initialized, initializationError, pendingRequests, isLoading, isAuthenticated,
    initializeSession, login, logout, invalidateSession,
  }
})
