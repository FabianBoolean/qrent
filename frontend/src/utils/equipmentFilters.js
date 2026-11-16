/**
 * Kombiniert Namens-/Codesuche mit Kategorie und Unterkategorie, ohne Quelldaten zu ändern.
 * @param {Array<import('../services/equipmentService.js').ProductSummary>} products Produkte.
 * @param {{search?: string, categoryId?: number|null, subcategoryId?: number|null}} filters Filter.
 * @returns {Array<import('../services/equipmentService.js').ProductSummary>} Passende Produkte.
 */
export function filterProducts(products, { search = '', categoryId = null, subcategoryId = null }) {
  const query = search.trim().toLocaleLowerCase('de')
  return products.filter((product) =>
    (categoryId == null || product.category.id === categoryId)
    && (subcategoryId == null || product.subcategory.id === subcategoryId)
    && (!query || product.name.toLocaleLowerCase('de').includes(query)
      || product.code.toLocaleLowerCase('de').includes(query)))
}

/**
 * Liefert ausschließlich Unterkategorien der gewählten Kategorie.
 * @param {Array<import('../services/equipmentService.js').Category>} categories Kategorien.
 * @param {number|null} categoryId Gewählte Kategorie.
 * @returns {Array<import('../services/equipmentService.js').Subcategory>} Auswahlmöglichkeiten.
 */
export function getSubcategories(categories, categoryId) {
  return categories.find((category) => category.id === categoryId)?.subcategories ?? []
}
