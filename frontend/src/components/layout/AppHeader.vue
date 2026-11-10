<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useAuthStore } from '@/stores/authStore.js'
import { getNavigationItems } from '@/router/navigation.js'
import AppNavigation from './AppNavigation.vue'
import logo from '@/assets/qrent-logo.png'

/** Header liest echte Benutzerdaten; Logout wird als Ereignis an das Layout delegiert. */
defineProps({ loggingOut: { type: Boolean, default: false } })
const emit = defineEmits(['logout'])
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const { lgAndUp, width } = useDisplay()
const drawer = ref(false)
const items = computed(() => getNavigationItems(router, auth.role))
const displayName = computed(() => [auth.user?.firstName, auth.user?.lastName]
  .filter(Boolean).join(' ') || auth.user?.email || 'Benutzer')
const roleLabel = computed(() => ({
  STUDENT: 'Schüler/in', TEACHER: 'Lehrkraft', ADMIN: 'Administration',
}[auth.role] || 'Unbekannte Rolle'))
const drawerWidth = computed(() => Math.min(320, Math.max(0, width.value - 24)))

watch(() => route.fullPath, () => { drawer.value = false })
watch(lgAndUp, () => { drawer.value = false })

/** Schließt die mobile Navigation vor dem Abmelden. */
function requestLogout() {
  drawer.value = false
  emit('logout')
}
</script>

<template>
  <v-app-bar color="primary" elevation="1" :height="lgAndUp ? 72 : 64">
    <div class="app-header d-flex align-center ga-2 px-2 px-sm-4">
      <v-app-bar-nav-icon
        v-if="!lgAndUp" :aria-label="drawer ? 'Navigation schließen' : 'Navigation öffnen'"
        :aria-expanded="drawer" aria-controls="mobile-navigation"
        @click="drawer = !drawer"
      />
      <RouterLink to="/dashboard" class="brand-link" aria-label="QRent – zum Dashboard">
        <img :src="logo" alt="QRent" class="brand-logo" />
      </RouterLink>
      <v-spacer />
      <AppNavigation v-if="lgAndUp" :items="items" />
      <v-spacer v-if="lgAndUp" />
      <v-menu location="bottom end">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps" variant="text" class="user-button" height="52"
            :aria-label="`Benutzermenü: ${displayName}, ${roleLabel}`"
          >
            <v-icon icon="mdi-account-circle-outline" size="28" />
            <span v-if="lgAndUp" class="user-summary text-left mx-2">
              <span class="d-block text-truncate">{{ displayName }}</span>
              <span class="d-block text-caption text-medium-emphasis">{{ roleLabel }}</span>
            </span>
            <v-icon icon="mdi-chevron-down" size="18" />
          </v-btn>
        </template>
        <v-list aria-label="Benutzermenü" class="user-menu">
          <v-list-item>
            <v-list-item-title class="text-wrap">{{ displayName }}</v-list-item-title>
            <v-list-item-subtitle class="text-wrap">{{ auth.user?.email }}</v-list-item-subtitle>
            <div class="text-caption mt-1">{{ roleLabel }} · {{ auth.role }}</div>
          </v-list-item>
          <v-divider class="my-2" />
          <v-list-item
            title="Abmelden" prepend-icon="mdi-logout" :disabled="loggingOut"
            @click="requestLogout"
          />
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>

  <v-navigation-drawer
    v-if="!lgAndUp" id="mobile-navigation" v-model="drawer" temporary
    :width="drawerWidth" aria-label="Mobile Navigation"
  >
    <div class="d-flex align-center pa-3">
      <span class="text-subtitle-1 font-weight-bold">Navigation</span>
      <v-spacer />
      <v-btn icon="mdi-close" variant="text" aria-label="Navigation schließen" @click="drawer = false" />
    </div>
    <div class="px-4 pb-3">
      <div class="text-body-2 font-weight-medium text-break">{{ displayName }}</div>
      <div class="text-caption text-medium-emphasis">{{ roleLabel }}</div>
    </div>
    <v-divider />
    <AppNavigation :items="items" mobile @navigate="drawer = false" />
    <v-divider />
    <v-list>
      <v-list-item title="Abmelden" prepend-icon="mdi-logout" :disabled="loggingOut" @click="requestLogout" />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.app-header {
  width: 100%;
  height: 100%;
  min-width: 0;
}

.brand-link {
  flex-shrink: 0;
}

.brand-logo {
  display: block;
  width: 88px;
  max-height: 40px;
  object-fit: contain;
}

.user-button {
  flex-shrink: 0;
}

.user-summary {
  max-width: 150px;
  text-transform: none;
  letter-spacing: normal;
}

.user-menu {
  width: min(320px, calc(100vw - 24px));
  overflow-wrap: anywhere;
}
</style>
