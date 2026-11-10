import { hasRole } from '../utils/permissions.js'

const definitions = [
  { name: 'dashboard', title: 'Dashboard', icon: 'mdi-view-dashboard-outline', group: 'primary' },
  { name: 'inventory', title: 'Equipment', icon: 'mdi-camera-outline', group: 'primary' },
  { name: 'checkout', title: 'Ausleihen', icon: 'mdi-export', group: 'primary' },
  { name: 'return', title: 'Rückgabe', icon: 'mdi-import', group: 'primary' },
  { name: 'tutorials', title: 'Tutorials', icon: 'mdi-school-outline', group: 'primary' },
  { name: 'active-rentals', title: 'Aktuelle Verleihungen', icon: 'mdi-clipboard-clock-outline', group: 'primary' },
  { name: 'logs', title: 'Logs', icon: 'mdi-text-box-search-outline', group: 'primary' },
  { name: 'equipment-management', title: 'Equipment verwalten', icon: 'mdi-camera-plus-outline', group: 'management' },
  { name: 'template-management', title: 'Vorlagen verwalten', icon: 'mdi-file-document-multiple-outline', group: 'management' },
  { name: 'role-management', title: 'Rollen verwalten', icon: 'mdi-account-cog-outline', group: 'management' },
  { name: 'development', title: 'Entwicklung', icon: 'mdi-code-braces', group: 'additional' },
]

/**
 * Liefert für Desktop und Mobil dieselben erlaubten Navigationseinträge.
 * Mindestrollen stammen aus den Routen-Metadaten, wie bei den Route Guards.
 * Nicht registrierte Routen (etwa /dev im Produktions-Build) werden ausgelassen.
 * @param {import('vue-router').Router} router Router mit registrierten Routen.
 * @param {string|null} actualRole Tatsächliche Backend-Rolle.
 * @returns {Array<Object>} Einträge mit Routenziel, Titel, Symbol und Gruppe.
 */
export function getNavigationItems(router, actualRole) {
  return definitions.filter((item) => {
    if (!router.hasRoute(item.name)) return false
    const { requiredRole } = router.resolve({ name: item.name }).meta
    return !requiredRole || hasRole(actualRole, requiredRole)
  }).map((item) => ({ ...item, to: { name: item.name } }))
}
