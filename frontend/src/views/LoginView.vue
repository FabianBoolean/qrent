<script setup>
import { computed, defineAsyncComponent, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { getLoginDestination } from '@/router/guards.js'
import logo from '@/assets/qrent-logo.png'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const form = ref(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const submitting = ref(false)
const loginError = ref('')
const isDevelopment = import.meta.env.DEV
// Der bedingte Import entfernt die Mock-Zugänge vollständig aus dem Produktions-Build.
const DevelopmentLoginUsers = import.meta.env.DEV
  ? defineAsyncComponent(() => import('@/dev/DevelopmentLoginUsers.vue'))
  : null
const errorMessage = computed(() => loginError.value || auth.initializationError?.message || '')
const required = (value) => Boolean(value) || 'Dieses Feld ist erforderlich.'
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Bitte eine gültige E-Mail-Adresse eingeben.'

/** Validiert das Formular; Anmeldefehler erscheinen ausschließlich innerhalb der Karte. */
async function submit() {
  if (submitting.value || auth.isLoading) return
  submitting.value = true
  loginError.value = ''
  auth.initializationError = null
  try {
    const { valid } = await form.value.validate()
    if (!valid) return
    await auth.login({ email: email.value.trim(), password: password.value })
    password.value = ''
    await router.replace(getLoginDestination(router, route.query.redirect))
  } catch (error) {
    loginError.value = error.message || 'Die Anmeldung ist fehlgeschlagen.'
  } finally {
    submitting.value = false
  }
}

/** Wiederholt eine technisch fehlgeschlagene Session-Prüfung ohne globale Meldung. */
async function retrySession() {
  loginError.value = ''
  try {
    await auth.initializeSession()
    if (auth.isAuthenticated) {
      await router.replace(getLoginDestination(router, route.query.redirect))
    }
  } catch {
    // Der Store hält den Fehler für den lokalen Alert bereit.
  }
}
</script>

<template>
  <v-card class="pa-2 pa-sm-6" width="100%" max-width="460">
    <v-card-text>
      <div class="text-center mb-6">
        <v-img :src="logo" alt="QRent" height="64" class="mb-4" />
        <h1 class="text-h5 mb-2">Bei QRent anmelden</h1>
        <p>Dein Zugang zum Equipment-Verleih der Schule.</p>
      </div>
      <v-form ref="form" validate-on="submit" @submit.prevent="submit">
        <v-text-field
          v-model="email" label="E-Mail-Adresse" type="email" name="email"
          autocomplete="username" :rules="[required, validEmail]"
          :disabled="submitting || auth.isLoading" class="mb-2"
        />
        <v-text-field
          v-model="password" label="Passwort" name="password" autocomplete="current-password"
          :type="showPassword ? 'text' : 'password'" :rules="[required]"
          :disabled="submitting || auth.isLoading" class="mb-2"
        >
          <template #append-inner>
            <v-btn
              :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" variant="text" size="small"
              :aria-label="showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'"
              :aria-pressed="showPassword" :disabled="submitting || auth.isLoading"
              @click="showPassword = !showPassword"
            />
          </template>
        </v-text-field>
        <v-alert v-if="errorMessage" type="error" variant="tonal" class="mb-4" role="alert">
          {{ errorMessage }}
          <v-btn
            v-if="auth.initializationError" variant="text" class="mt-2" block
            :loading="auth.isLoading" @click="retrySession"
          >Session erneut prüfen</v-btn>
        </v-alert>
        <v-btn
          type="submit" color="primary" size="large" block
          :loading="submitting || auth.isLoading" :disabled="submitting || auth.isLoading"
        >Anmelden</v-btn>
      </v-form>
      <p v-if="isDevelopment" class="text-caption mt-4">
        Entwicklungsumgebung: Anmeldung mit vorhandenen Mock-Benutzern.
      </p>
      <DevelopmentLoginUsers v-if="isDevelopment" />
    </v-card-text>
  </v-card>
</template>
