import axios from 'axios'
import { normalizeApiError } from './apiErrors.js'

let onSessionExpired = () => {}

/**
 * Verbindet die HTTP-Schicht mit der Session-Verwaltung, ohne Store-Importzyklus.
 * @param {Function} handler Synchroner Callback bei 401 außerhalb der Auth-Aufrufe.
 * @returns {void}
 */
export function setSessionExpiredHandler(handler) {
  onSessionExpired = handler
}

/** Gemeinsamer HTTP-Client; Cookies verwaltet ausschließlich der Browser. */
const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  timeout: 15000,
  headers: { Accept: 'application/json' },
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalized = normalizeApiError(error)
    if (normalized.status === 401 && !error.config?.skipSessionExpiry) {
      onSessionExpired()
    }
    // Die aufrufende View entscheidet über Alert oder Snackbar: keine Doppelmeldungen.
    return Promise.reject(normalized)
  },
)

export default apiClient
