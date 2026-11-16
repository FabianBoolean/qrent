import apiClient from './apiClient.js'
import { ApiError } from './apiErrors.js'

/**
 * Backend-Benutzer ohne Passwort oder Session-Kennung.
 * @typedef {Object} AuthenticatedUser
 * @property {string} email E-Mail-Adresse.
 * @property {string} firstName Vorname.
 * @property {string} lastName Nachname.
 * @property {string|null} schoolClass Schulklasse.
 * @property {'STUDENT'|'TEACHER'|'ADMIN'} role Tatsächliche Backend-Rolle.
 */

/** Gekapselte Session-Authentifizierung; späterer Austauschpunkt für Schul-SSO. */
export const authService = {
  /**
   * Erstellt eine Backend-Session. Zugangsdaten werden nicht gespeichert.
   * @param {{email: string, password: string}} credentials Formulareingaben.
   * @returns {Promise<AuthenticatedUser>} Angemeldeter Benutzer.
   * @throws {ApiError} Bei ungültigen Zugangsdaten oder technischen Fehlern.
   */
  async login({ email, password }) {
    try {
      const { data } = await apiClient.post('/auth/login', { email, password }, { skipSessionExpiry: true })
      return data
    } catch (error) {
      if (error.status === 401) {
        throw new ApiError('Ungültige Zugangsdaten.', 401, 'http')
      }
      throw error
    }
  },

  /**
   * Prüft die Session; 401 bedeutet regulär „nicht angemeldet“.
   * @returns {Promise<AuthenticatedUser|null>} Benutzer oder null.
   * @throws {ApiError} Bei technischen Fehlern; diese sind keine bestätigte Abmeldung.
   */
  async getCurrentUser() {
    try {
      const { data } = await apiClient.get('/auth/me', { skipSessionExpiry: true })
      return data
    } catch (error) {
      if (error.status === 401) return null
      throw error
    }
  },

  /**
   * Beendet die serverseitige Session; auch 401 bedeutet eine beendete Anmeldung.
   * @returns {Promise<void>}
   * @throws {ApiError} Bei technischen Fehlern bleibt der lokale Benutzer erhalten.
   */
  async logout() {
    try {
      await apiClient.post('/auth/logout', null, { skipSessionExpiry: true })
    } catch (error) {
      if (error.status !== 401) throw error
    }
  },
}
