<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore.js'
import { useNotificationStore } from '@/stores/notificationStore.js'
import { useDevelopmentTools } from '@/dev/useDevelopmentTools.js'
import TransactionOverview from '@/components/common/TransactionOverview.vue'

const auth = useAuthStore()
const notifications = useNotificationStore()
const {
  simulatedRole, previewRole, previewItems, showSchoolOverview,
  apiLoading, apiResult, apiError, runSessionTest,
} = useDevelopmentTools(useRouter(), auth)
const roles = [
  { title: 'Tatsächliche Rolle verwenden', value: null },
  { title: 'STUDENT', value: 'STUDENT' },
  { title: 'TEACHER', value: 'TEACHER' },
  { title: 'ADMIN', value: 'ADMIN' },
]
const userJson = computed(() => JSON.stringify(auth.user, null, 2))
const responseJson = computed(() => JSON.stringify(apiResult.value?.data, null, 2))

/** Stellt drei Meldungen an; die unmittelbar doppelte erste Meldung wird unterdrückt. */
function testQueue() {
  notifications.success('DEV · Warteschlange 1/3')
  notifications.success('DEV · Warteschlange 1/3')
  notifications.info('DEV · Warteschlange 2/3')
  notifications.warning('DEV · Warteschlange 3/3')
}

/** Testet einen Aktionsbutton ohne Backend-Aufruf oder Datenänderung. */
function testAction() {
  notifications.info('DEV · Meldung mit Testaktion', {
    action: { label: 'Testaktion', handler: () => notifications.success('DEV · Testaktion ausgeführt.') },
  })
}
</script>

<template>
  <h1 class="text-h4 mb-2">Entwicklung</h1>
  <p class="text-body-1 text-medium-emphasis mb-6">Diagnose und UI-Vorschau für die lokale Entwicklung.</p>
  <v-alert type="info" variant="tonal" class="mb-6">
    Nur im Entwicklungsmodus. Tatsächliche Backend-Rolle: <strong>{{ auth.role }}</strong>.
    Die Rollensimulation gilt ausschließlich innerhalb der Vorschau auf dieser Seite.
  </v-alert>

  <v-row>
    <v-col cols="12" lg="6">
      <v-card variant="outlined" class="h-100">
        <v-card-text>
          <h2 class="text-h6 mb-4">Benutzer und Session</h2>
          <dl class="session-details mb-4">
            <dt>Authentifiziert</dt><dd>{{ auth.isAuthenticated ? 'Ja' : 'Nein' }}</dd>
            <dt>Initialisiert</dt><dd>{{ auth.initialized ? 'Ja' : 'Nein' }}</dd>
            <dt>Auth-Anfrage läuft</dt><dd>{{ auth.isLoading ? 'Ja' : 'Nein' }}</dd>
            <dt>Tatsächliche Rolle</dt><dd>{{ auth.role || 'Keine' }}</dd>
          </dl>
          <p class="text-caption text-medium-emphasis mb-2">Benutzerdaten aus dem Session-Store</p>
          <pre class="diagnostic-json bg-background rounded pa-3">{{ userJson }}</pre>
          <p class="text-caption text-medium-emphasis mt-3">Session-Cookies und Passwörter werden nicht ausgelesen oder angezeigt.</p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" lg="6">
      <v-card variant="outlined" class="h-100">
        <v-card-text>
          <h2 class="text-h6 mb-4">Session-API testen</h2>
          <p class="mb-4">GET /api/auth/me – ein lesender Test mit den echten Session-Cookies. Die Antwort verändert den lokalen Benutzer nicht.</p>
          <v-btn color="primary" :loading="apiLoading" :disabled="apiLoading" class="mb-4" @click="runSessionTest">
            Session-API aufrufen
          </v-btn>
          <v-alert v-if="apiError" type="error" variant="tonal" role="alert" class="mb-3">
            {{ apiError.message }}<span v-if="apiError.status"> (HTTP {{ apiError.status }})</span>
          </v-alert>
          <div v-if="apiResult" aria-live="polite">
            <v-chip :color="apiResult.status === 200 ? 'success' : 'warning'" class="mb-3">HTTP {{ apiResult.status }}</v-chip>
            <v-alert v-if="apiResult.status === 401" type="warning" variant="tonal" class="mb-3">
              Serverseitig ist keine gültige Session vorhanden. Die Anzeige oben ist der unveränderte lokale Store-Zustand.
            </v-alert>
            <pre class="diagnostic-json bg-background rounded pa-3">{{ responseJson }}</pre>
          </div>
          <p v-else-if="!apiLoading && !apiError" class="text-body-2 text-medium-emphasis">Noch kein API-Test ausgeführt.</p>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card variant="outlined">
        <v-card-text>
          <h2 class="text-h6 mb-3">Globales Meldungssystem testen</h2>
          <p class="mb-4">Explizite Testmeldungen ohne fachliche Datenänderung. Fehler bleiben bis zum Schließen sichtbar.</p>
          <div class="d-flex flex-wrap ga-2 mb-4">
            <v-btn color="success" @click="notifications.success('DEV · Erfolgsmeldung')">Erfolg</v-btn>
            <v-btn color="info" @click="notifications.info('DEV · Informationsmeldung')">Information</v-btn>
            <v-btn color="warning" @click="notifications.warning('DEV · Warnmeldung')">Warnung</v-btn>
            <v-btn color="error" @click="notifications.error('DEV · Fehlermeldung')">Fehler</v-btn>
            <v-btn variant="outlined" @click="testQueue">Warteschlange und Duplikate</v-btn>
            <v-btn variant="outlined" @click="testAction">Aktionsbutton</v-btn>
            <v-btn variant="text" @click="notifications.clear()">Alle Meldungen leeren</v-btn>
          </div>
          <p class="text-caption" aria-live="polite">{{ notifications.current ? 'Eine Meldung aktiv.' : 'Keine Meldung aktiv.' }} {{ notifications.queue.length }} wartend.</p>
        </v-card-text>
      </v-card>
    </v-col>

    <v-col cols="12">
      <v-card variant="outlined">
        <v-card-text>
          <h2 class="text-h6 mb-3">Isolierte UI-Rollenvorschau</h2>
          <v-select v-model="simulatedRole" :items="roles" label="Vorschaurolle" hide-details class="mb-4" />
          <v-alert type="warning" variant="tonal" class="mb-4">
            Vorschau: <strong>{{ previewRole }}</strong>. Tatsächlich: <strong>{{ auth.role }}</strong>.
            Header, Route Guards und API-Anfragen behalten ihre echten Berechtigungen.
          </v-alert>
          <h3 class="text-subtitle-1 mb-3">Sichtbare Navigation für diese Vorschaurolle</h3>
          <div class="d-flex flex-wrap ga-2 mb-6" aria-label="Nicht interaktive Navigationsvorschau">
            <v-chip v-for="item in previewItems" :key="item.name" :prepend-icon="item.icon" variant="tonal">
              {{ item.title }}
            </v-chip>
          </div>
          <p class="text-caption text-medium-emphasis mb-4">Die Vorschau-Einträge sind keine Links und lösen keine Aktionen aus.</p>
          <v-row>
            <v-col cols="12" :lg="showSchoolOverview ? 6 : 12">
              <TransactionOverview title="Meine Reservierungen und Ausleihen" description="Vorschau des eigenen Dashboard-Bereichs." />
            </v-col>
            <v-col v-if="showSchoolOverview" cols="12" lg="6">
              <TransactionOverview title="Alle Reservierungen und Ausleihen" description="Vorschau des schulweiten Dashboard-Bereichs." icon="mdi-account-group-outline" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<style scoped>
.diagnostic-json {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 0.875rem;
}

.session-details {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  overflow-wrap: anywhere;
}

.session-details dt {
  font-weight: bold;
}
</style>
