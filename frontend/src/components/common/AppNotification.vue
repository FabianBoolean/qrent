<script setup>
import { useNotificationStore } from '@/stores/notificationStore.js'

/** Einmalige globale Snackbar; Vuetifys Layout-Abstand berücksichtigt den Header. */
const notifications = useNotificationStore()
</script>

<template>
  <v-snackbar
    v-for="message in notifications.current ? [notifications.current] : []" :key="message.id"
    :model-value="notifications.isOpen" :color="message.color"
    :timeout="notifications.actionPending ? -1 : message.timeout"
    location="top end" rounded="lg" min-width="0" width="440" max-width="calc(100vw - 32px)"
    :content-props="{ role: message.type === 'error' ? 'alert' : 'status' }"
    @update:model-value="value => { if (!value) notifications.dismiss(message.id) }"
    @after-leave="notifications.finishDismiss(message.id)"
  >
    <div class="d-flex align-start ga-3">
      <v-icon :icon="message.icon" aria-hidden="true" />
      <span class="notification-text">{{ message.text }}</span>
    </div>
    <template #actions>
      <v-btn
        v-if="message.action" variant="text"
        :loading="notifications.actionPending" :disabled="notifications.actionPending"
        @click="notifications.runAction()"
      >{{ message.action.label }}</v-btn>
      <v-btn icon="mdi-close" size="small" variant="text" aria-label="Meldung schließen" @click="notifications.dismiss(message.id)" />
    </template>
  </v-snackbar>
</template>

<style scoped>
.notification-text {
  overflow-wrap: anywhere;
}
</style>

