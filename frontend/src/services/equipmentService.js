import apiClient from './apiClient.js'
import { ApiError } from './apiErrors.js'

/**
 * @typedef {{id: number, name: string}} NamedRef Kategorie-/Unterkategorie-Verweis.
 * @typedef {{id: number, code: string, name: string}} Subcategory Unterkategorie.
 * @typedef {{id: number, code: string, name: string, subcategories: Subcategory[]}} Category Kategorie.
 * @typedef {{id: number, code: string, name: string, category: NamedRef, subcategory: NamedRef, itemCount: number}} ProductSummary Produkt; itemCount ist keine Verfügbarkeit.
 * @typedef {{id: number, inventoryNumber: string, notes: string|null}} EquipmentItem Physisches Exemplar.
 * @typedef {{id: number, code: string, name: string, description: string|null, category: NamedRef, subcategory: NamedRef, items: EquipmentItem[]}} ProductDetail Produktdetails.
 */

/** Lesender Inventarzugriff; verwendet ausschließlich bestehende Backend-Verträge. */
export const equipmentService = {
  /**
   * Lädt die nach Code sortierten Kategorien samt Unterkategorien.
   * @param {{signal?: AbortSignal}} [options] Optionaler Request-Abbruch.
   * @returns {Promise<Category[]>} Kategorien.
   * @throws {ApiError} Bei HTTP-, Netzwerk- oder Abbruchfehlern.
   */
  async getCategories(options = {}) {
    const { data } = await apiClient.get('/categories', options)
    return data
  },

  /**
   * Lädt alle Produkte in der Sortierung des Backends; Filterung erfolgt lokal.
   * @param {{signal?: AbortSignal}} [options] Optionaler Request-Abbruch.
   * @returns {Promise<ProductSummary[]>} Produktübersicht.
   * @throws {ApiError} Bei HTTP-, Netzwerk- oder Abbruchfehlern.
   */
  async getProducts(options = {}) {
    const { data } = await apiClient.get('/products', options)
    return data
  },

  /**
   * Lädt ein Produkt mit seinen Exemplaren.
   * @param {string|number} id Positive Produktkennung aus der Route.
   * @param {{signal?: AbortSignal}} [options] Optionaler Request-Abbruch.
   * @returns {Promise<ProductDetail>} Produktdetails, ohne Verfügbarkeitsangaben.
   * @throws {ApiError} Bei ungültiger Kennung oder fehlgeschlagenem Request.
   */
  async getProduct(id, options = {}) {
    const key = String(id)
    if (!/^[1-9]\d*$/.test(key)) throw new ApiError('Die Produktkennung ist ungültig.', 400, 'http')
    const { data } = await apiClient.get(`/products/${encodeURIComponent(key)}`, options)
    return data
  },
}
