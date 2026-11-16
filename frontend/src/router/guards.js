import { hasRole } from '../utils/permissions.js'

/**
 * Akzeptiert nur bekannte, interne geschützte Ziele ohne Weiterleitungsschleife.
 * @param {import('vue-router').Router} router Aktueller Router.
 * @param {unknown} redirect Query-Wert vom Login.
 * @returns {string} Sicheres Rückkehrziel oder Dashboard.
 */
export function getLoginDestination(router, redirect) {
  if (typeof redirect !== 'string' || !redirect.startsWith('/')
    || redirect.startsWith('//') || redirect.includes('\\')) return '/dashboard'
  const target = router.resolve(redirect)
  if (!target.meta.requiresAuth || target.matched.some((record) => record.redirect)) {
    return '/dashboard'
  }
  return target.fullPath
}

/**
 * Erzeugt den zentralen Guard; technische Session-Fehler bleiben für den Login-Alert im Store.
 * @param {Object} auth Auth-Store mit tatsächlicher Backend-Rolle.
 * @param {import('vue-router').Router} router Router für sichere Rückkehrziele.
 * @returns {Function} Asynchroner beforeEach-Guard.
 */
export function createAuthGuard(auth, router) {
  return async (to) => {
    if (!to.meta.requiresAuth && to.name !== 'login') return true
    try {
      // Nach einem technischen Fehler beim geschützten Ziel nicht sofort erneut
      // anfragen: Die Login-Karte bietet dafür eine explizite Wiederholen-Aktion.
      if (to.name !== 'login' || !auth.initializationError) {
        await auth.initializeSession()
      }
    } catch {
      // Geschützte Inhalte bleiben bei fehlgeschlagener Session-Prüfung gesperrt.
    }
    if (!auth.isAuthenticated && to.meta.requiresAuth) {
      return { name: 'login', query: { redirect: to.fullPath }, replace: true }
    }
    if (auth.isAuthenticated && to.name === 'login') {
      return getLoginDestination(router, to.query.redirect)
    }
    if (to.meta.requiredRole && !hasRole(auth.role, to.meta.requiredRole)) {
      return { name: 'forbidden', replace: true }
    }
    return true
  }
}
