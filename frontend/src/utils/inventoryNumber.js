/** Inventarnummer: genau 8 Ziffern (vorläufiges Format laut docs/decisions.md). */
const INVENTORY_NUMBER_PATTERN = /^\d{8}$/

/**
 * Bereinigt eine eingegebene oder gescannte Inventarnummer.
 * Leerzeichen werden entfernt, damit auch die Schreibweise vom Etikett ("0101 0002") gilt.
 * @param {string} input Rohe Eingabe.
 * @returns {string|null} Die 8-stellige Nummer oder null, wenn das Format nicht passt.
 */
export function normalizeInventoryNumber(input) {
  const compact = String(input ?? '').replace(/\s/g, '')
  return INVENTORY_NUMBER_PATTERN.test(compact) ? compact : null
}

/**
 * Formatiert eine Inventarnummer für Etiketten und Anzeige in zwei Vierergruppen.
 * @param {string} inventoryNumber Gültige 8-stellige Nummer.
 * @returns {string} Zum Beispiel "0101 0002".
 * @throws {Error} Wenn die Nummer ungültig ist.
 */
export function formatInventoryNumber(inventoryNumber) {
  const normalized = normalizeInventoryNumber(inventoryNumber)
  if (!normalized) throw new Error('Die Inventarnummer muss aus 8 Ziffern bestehen.')
  return `${normalized.slice(0, 4)} ${normalized.slice(4)}`
}
