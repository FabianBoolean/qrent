const messages = {
  400: 'Die Anfrage ist ungültig. Bitte Angaben überprüfen.',
  401: 'Bitte melde dich an.',
  403: 'Du hast keine Berechtigung für diese Aktion.',
  404: 'Die angeforderten Daten wurden nicht gefunden.',
}

/** Einheitlicher API-Fehler ohne Zugangsdaten oder Axios-Request-Konfiguration. */
export class ApiError extends Error {
  /**
   * @param {string} message Verständliche Meldung.
   * @param {number|null} status HTTP-Status oder null bei fehlender Antwort.
   * @param {string} code Technische Fehlerkategorie.
   */
  constructor(message, status = null, code = 'unknown') {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

/**
 * Übersetzt HTTP-, Timeout- und Netzwerkfehler ohne ungeprüfte Servertexte anzuzeigen.
 * @param {unknown} error Ursprünglicher Fehler.
 * @returns {ApiError} Normalisierter Fehler; bereits normalisierte Fehler bleiben erhalten.
 */
export function normalizeApiError(error) {
  if (error instanceof ApiError) return error
  const status = error?.response?.status ?? null
  if (status) {
    return new ApiError(
      messages[status] ?? (status >= 500
        ? 'Ein Serverfehler ist aufgetreten. Bitte versuche es später erneut.'
        : 'Die Anfrage konnte nicht verarbeitet werden.'),
      status,
      'http',
    )
  }
  if (error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT') {
    return new ApiError('Der Server antwortet nicht rechtzeitig. Bitte erneut versuchen.', null, 'timeout')
  }
  if (error?.code === 'ERR_CANCELED') {
    return new ApiError('Die Anfrage wurde abgebrochen.', null, 'canceled')
  }
  if (error?.request || error?.code === 'ERR_NETWORK') {
    return new ApiError('Der Server ist nicht erreichbar. Bitte Verbindung überprüfen.', null, 'network')
  }
  return new ApiError('Ein unerwarteter Fehler ist aufgetreten.')
}
