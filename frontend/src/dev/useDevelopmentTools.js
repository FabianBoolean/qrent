import { computed, onScopeDispose, ref } from 'vue'
import { authService } from '../services/authService.js'
import { getNavigationItems } from '../router/navigation.js'
import { hasRole } from '../utils/permissions.js'

/**
 * Isolierter Zustand für die Development-Ansicht. Die simulierte Rolle wird
 * ausschließlich für Vorschauwerte verwendet und niemals in den Auth-Store geschrieben.
 * @param {import('vue-router').Router} router Router für die Navigationsvorschau.
 * @param {Object} auth Auth-Store, ausschließlich lesend verwendet.
 * @returns {Object} Lokale Rollenvorschau und manuell ausführbarer Session-Test.
 */
export function useDevelopmentTools(router, auth) {
  const simulatedRole = ref(null)
  const previewRole = computed(() => simulatedRole.value ?? auth.role)
  const previewItems = computed(() => getNavigationItems(router, previewRole.value))
  const showSchoolOverview = computed(() => hasRole(previewRole.value, 'TEACHER'))
  const apiLoading = ref(false)
  const apiResult = ref(null)
  const apiError = ref(null)
  let disposed = false
  onScopeDispose(() => { disposed = true })

  /**
   * Prüft ausschließlich GET /api/auth/me. Die Antwort verändert den Auth-Store nicht.
   * Der Auth-Service übersetzt 401 in null; der Status wird daraus rekonstruiert.
   * @returns {Promise<void>} Ergebnis oder lokaler technischer Fehler im Vorschauzustand.
   */
  async function runSessionTest() {
    if (apiLoading.value || disposed) return
    apiLoading.value = true
    apiResult.value = null
    apiError.value = null
    try {
      const user = await authService.getCurrentUser()
      if (!disposed) apiResult.value = { status: user ? 200 : 401, data: user }
    } catch (error) {
      if (!disposed) apiError.value = error
    } finally {
      if (!disposed) apiLoading.value = false
    }
  }

  return { simulatedRole, previewRole, previewItems, showSchoolOverview,
    apiLoading, apiResult, apiError, runSessionTest }
}
