const ranks = { STUDENT: 0, TEACHER: 1, ADMIN: 2 }

/**
 * Prüft die Rollen-Hierarchie; unbekannte Rollen erhalten keine Berechtigung.
 * @param {string|null} actualRole Tatsächliche Backend-Rolle.
 * @param {string} requiredRole Benötigte Mindestrolle.
 * @returns {boolean} Ob die Mindestrolle erfüllt ist.
 */
export function hasRole(actualRole, requiredRole) {
  return Object.hasOwn(ranks, actualRole) && Object.hasOwn(ranks, requiredRole)
    && ranks[actualRole] >= ranks[requiredRole]
}
