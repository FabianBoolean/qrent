<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppVersion from '@/components/common/AppVersion.vue'
import { useNotificationStore } from '@/stores/notificationStore.js'

const auth = useAuthStore()
const router = useRouter()
const notifications = useNotificationStore()
const loggingOut = ref(false)

/** Beendet die Session und meldet bestätigten Erfolg. Fehler gehen an den Aufrufer. */
async function performLogout() {
  if (loggingOut.value) return
  loggingOut.value = true
  try {
    await auth.logout()
    notifications.clear()
    await router.replace({ name: 'login' })
    notifications.success('Du wurdest abgemeldet.')
  } finally {
    loggingOut.value = false
  }
}

/** Meldet Logout-Fehler zentral und bietet eine erneute serverseitige Abmeldung an. */
async function logout() {
  try {
    await performLogout()
  } catch (error) {
    notifications.error(error.message, { action: { label: 'Erneut versuchen', handler: performLogout } })
  }
}
</script>

<template>
  <a class="skip-link bg-surface text-primary rounded pa-3" href="#main-content">Zum Inhalt springen</a>
  <AppHeader :logging-out="loggingOut" @logout="logout" />
  <v-main id="main-content" tabindex="-1">
    <v-container class="qrent-container py-4 py-sm-6">
      <v-card>
        <v-card-text>
          <RouterView />
        </v-card-text>
      </v-card>
      <AppVersion />
    </v-container>
  </v-main>
</template>

<style scoped>
.skip-link {
  position: fixed;
  top: 8px;
  left: 8px;
  z-index: 3000;
  transform: translateY(-150%);
}

.skip-link:focus {
  transform: translateY(0);
}
</style>
