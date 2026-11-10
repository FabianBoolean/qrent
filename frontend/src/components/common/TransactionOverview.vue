<script setup>
/** Wiederverwendbarer Vorgangsbereich; zukünftige Listen werden über den Default-Slot eingesetzt. */
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: 'mdi-clipboard-text-outline' },
})
</script>

<template>
  <v-card variant="outlined" class="h-100">
    <v-card-text>
      <div class="d-flex align-start ga-3 mb-3">
        <v-icon :icon="icon" color="primary" aria-hidden="true" />
        <h2 class="text-h6">{{ title }}</h2>
      </div>
      <p class="text-body-2 text-medium-emphasis mb-4">{{ description }}</p>
      <slot>
        <v-alert type="info" variant="tonal">
          <strong>Platzhalter</strong><br />
          Die Übersicht folgt, sobald die Schnittstelle für Reservierungen und Ausleihen verfügbar ist.
        </v-alert>
      </slot>
    </v-card-text>
  </v-card>
</template>
