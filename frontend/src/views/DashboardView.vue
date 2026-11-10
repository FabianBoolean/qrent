<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore.js'
import { hasRole } from '@/utils/permissions.js'
import TransactionOverview from '@/components/common/TransactionOverview.vue'

const auth = useAuthStore()
const showSchoolOverview = computed(() => hasRole(auth.role, 'TEACHER'))
</script>

<template>
  <div class="d-flex flex-wrap align-center justify-space-between ga-4 mb-6">
    <div>
      <h1 class="text-h4 mb-2">Dashboard</h1>
      <p class="text-body-1 text-medium-emphasis">Deine Übersicht für den Equipment-Verleih.</p>
    </div>
    <v-btn :to="{ name: 'inventory' }" color="primary" prepend-icon="mdi-camera-outline">
      Equipment ansehen
    </v-btn>
  </div>
  <v-row>
    <v-col cols="12" :lg="showSchoolOverview ? 6 : 12">
      <TransactionOverview
        title="Meine Reservierungen und Ausleihen"
        description="Hier werden später deine aktiven und vergangenen Vorgänge angezeigt."
        icon="mdi-account-clock-outline"
      />
    </v-col>
    <v-col v-if="showSchoolOverview" cols="12" lg="6">
      <TransactionOverview
        title="Alle Reservierungen und Ausleihen"
        description="Hier folgt die schulweite Übersicht für Lehrkräfte und Administration."
        icon="mdi-account-group-outline"
      />
    </v-col>
  </v-row>
</template>
